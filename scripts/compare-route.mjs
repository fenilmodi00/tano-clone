#!/usr/bin/env node
/**
 * Compare one route at one viewport width: live source vs local dev server.
 *
 *   node scripts/compare-route.mjs --route / --width 1568 [--scroll 0]
 *   node scripts/compare-route.mjs /case-studies 1440
 *
 * What it does:
 *   - opens https://www.tano.ai<route> and http://127.0.0.1:3000<route> at
 *     width x 900, DPR 1, no reduced motion;
 *   - waits for fonts, dismisses the announcement/consent overlays;
 *   - scrolls through the whole page to trigger lazy images and reveals,
 *     then returns to --scroll (default 0);
 *   - classifies every `main` band as static / motion / video by sampling
 *     live DOM changes and running animations, freezes CSS animations only
 *     inside static bands, and freezes videos at their first frame;
 *   - takes a full-page screenshot of both sides, then reports pixelmatch
 *     percentages (overall, static-only, per band), section geometry
 *     deltas, broken resources and missing <img> counts;
 *   - writes docs/verify/<slug>/<width>.json plus <width>-diff.png.
 *
 * The script never edits application code. DOM changes are runtime-only
 * (dismiss overlays, pause animations, freeze video). Motion/video bands are
 * reported but excluded from the strict static percentage.
 *
 * Flags: --route --width --scroll --out --keep-shots --timeout --quiet
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import pixelmatch from "pixelmatch";

export const SOURCE_ORIGIN = process.env.TANO_SOURCE_ORIGIN || "https://www.tano.ai";
export const LOCAL_ORIGIN = process.env.TANO_LOCAL_ORIGIN || "http://127.0.0.1:3000";
export const VIEWPORT_HEIGHT = 900;
export const DEFAULT_OUT = "docs/verify";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function slugFor(route) {
  if (route === "/" || route === "") return "home";
  return route
    .replace(/^\//, "")
    .replace(/[\/?&=#]+/g, "-")
    .replace(/-+$/, "");
}

/** Launch one Chromium for a whole matrix run. */
export async function launchBrowser() {
  return chromium.launch({ headless: true });
}

/** Create a context that already rejects cookies on the source site. */
export async function newSideContext(browser, width, side) {
  const context = await browser.newContext({
    viewport: { width, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    locale: "en-GB",
    timezoneId: "Europe/London",
    reducedMotion: "no-preference",
    colorScheme: "light",
    serviceWorkers: "block",
  });
  if (side === "source") {
    await context.addCookies([
      {
        name: "tano_consent",
        value: "denied",
        domain: ".tano.ai",
        path: "/",
        secure: true,
        sameSite: "Lax",
        expires: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
      },
    ]);
  }
  return context;
}

/** Remove announcement/consent overlays as soon as they mount. */
export async function installOverlayCleanup(page) {
  await page.addInitScript(() => {
    const clean = () => {
      document
        .querySelectorAll('[aria-label="Announcement"], .wire-consent')
        .forEach((el) => el.remove());
      document.documentElement.style.setProperty("--hp-notify-push", "0px");
      document.querySelector("main[data-notify]")?.removeAttribute("data-notify");
    };
    // `document` exists from the first init-script tick; documentElement may
    // not exist yet, and observing null throws before cleanup can attach.
    const observer = new MutationObserver(clean);
    observer.observe(document, { childList: true, subtree: true });
    document.addEventListener("DOMContentLoaded", clean, { once: true });
  });
}

export async function scrollTo(page, y) {
  await page.evaluate((target) => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, target);
  }, y);
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

/** Scroll the whole document in viewport steps so lazy media and reveals fire. */
export async function scrollThrough(page, { stepRatio = 0.82, stepMs = 60 } = {}) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.max(200, Math.round(VIEWPORT_HEIGHT * stepRatio));
  for (let y = 0; y < height; y += step) {
    await scrollTo(page, y);
    await sleep(stepMs);
  }
  await scrollTo(page, Math.max(0, height - VIEWPORT_HEIGHT));
  await sleep(320);
  // Force lazy images that live in hidden carousel copies to load too.
  await page
    .evaluate(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        img.loading = "eager";
      });
    })
    .catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
}

export async function settleImages(page) {
  await page
    .evaluate(async () => {
      const pending = [...document.images].map((img) =>
        img.decode ? img.decode().catch(() => {}) : Promise.resolve(),
      );
      await Promise.race([Promise.all(pending), new Promise((r) => setTimeout(r, 8000))]);
    })
    .catch(() => {});
}

/** Remove cookie/announcement overlays that are not part of the page design. */
async function dismissOverlays(page) {
  let removed = [];
  const reject = page
    .locator(".wire-consent button")
    .filter({ hasText: /reject/i })
    .first();
  if ((await reject.count()) && (await reject.isVisible().catch(() => false))) {
    await reject.click({ timeout: 1500 }).catch(() => {});
    await sleep(250);
    removed.push("consent");
  }
  const announcement = page.locator('[aria-label="Announcement"]').first();
  if (await announcement.count()) {
    const closer = announcement.locator(".hp-notify-close").first();
    if (await closer.count()) await closer.click({ timeout: 1500 }).catch(() => {});
    await sleep(550);
    removed.push("announcement");
  }
  await page.evaluate(() => {
    document
      .querySelectorAll('.wire-consent, [aria-label="Announcement"]')
      .forEach((el) => el.remove());
    document.documentElement.style.setProperty("--hp-notify-push", "0px");
    document.querySelector("main[data-notify]")?.removeAttribute("data-notify");
  });
  return removed;
}

async function waitForFonts(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    if (document.fonts.status !== "loaded") {
      await new Promise((resolve) => {
        const done = () => resolve();
        document.fonts.addEventListener("loadingdone", done, { once: true });
        setTimeout(done, 5000);
      });
    }
  });
}

async function finishFiniteAnimations(page) {
  await page
    .evaluate(() => {
      for (const anim of document.getAnimations()) {
        const timing = anim.effect?.getTiming?.();
        if (!timing) continue;
        if (timing.iterations === Infinity) continue;
        if (anim.playState === "running") {
          try {
            anim.finish();
          } catch {
            /* ignore */
          }
        }
      }
    })
    .catch(() => {});
}

/**
 * Sample each main band twice, 220 ms apart, and record which animations
 * belong to it. Also measures the section boxes used for geometry.
 */
async function measureBands(page) {
  return page.evaluate(async () => {
    const all = [...document.querySelectorAll("main > section, main > div")];
    const bands = all.filter((el) => el.getBoundingClientRect().height > 0.5);
    const labelOf = (el) => {
      const cls = (el.className?.baseVal ?? el.className ?? "").toString().trim();
      return cls
        ? el.tagName.toLowerCase() + "." + cls.split(/\s+/).slice(0, 3).join(".")
        : el.tagName.toLowerCase();
    };
    const meta = bands.map((el, index) => {
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        index,
        tag: el.tagName.toLowerCase(),
        label: labelOf(el),
        top: Math.round((rect.top + window.scrollY) * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
        width: Math.round(rect.width * 100) / 100,
        ground: el.getAttribute("data-ground"),
        overflow: cs.overflow,
        h1:
          (el.querySelector("h1")?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 140) ||
          null,
      };
    });

    const sample = () =>
      bands.map((el) => {
        const parts = [(el.innerText || "").replace(/\s+/g, " ").slice(0, 2500)];
        const nodes = new Set();
        const add = (node) => {
          if (nodes.size < 320) nodes.add(node);
        };
        el.querySelectorAll(
          "[class*='run'],[class*='marquee'],[class*='strip'],[class*='track'],[class*='turn'],[class*='camp'],[class*='score'],[class*='metric'],[class*='fill'],[class*='stat'],[class*='scene'],[class*='carousel'],[class*='slide'],[class*='reveal'],[style*='translate']",
        ).forEach(add);
        el.querySelectorAll("*").forEach(add);
        for (const node of nodes) {
          const cs = getComputedStyle(node);
          if (
            cs.transform !== "none" ||
            cs.backgroundPosition !== "0% 0%" ||
            cs.animationName !== "none" ||
            cs.opacity !== "1"
          ) {
            parts.push(
              [cs.transform, cs.backgroundPosition, cs.opacity, cs.animationName, cs.width].join(
                "|",
              ),
            );
          }
        }
        for (const video of el.querySelectorAll("video")) {
          parts.push("video:" + video.currentTime.toFixed(3) + ":" + (video.paused ? "p" : "r"));
        }
        return parts.join(";");
      });

    const first = sample();
    await new Promise((resolve) => setTimeout(resolve, 220));
    const second = sample();

    const animations = document
      .getAnimations()
      .map((anim) => {
        const target = anim.effect?.target;
        const bandEl = target?.closest?.("main > section, main > div");
        const band = bandEl ? bands.indexOf(bandEl) : -1;
        const timing = anim.effect?.getTiming?.() ?? {};
        return {
          band,
          name:
            anim.animationName || anim.transitionProperty || anim.constructor?.name || "animation",
          playState: anim.playState,
          iterations: timing.iterations === Infinity ? "Infinity" : (timing.iterations ?? null),
          duration: typeof timing.duration === "number" ? timing.duration : null,
        };
      })
      .filter((anim) => anim.band >= 0);

    const videos = bands.map((el) => el.querySelectorAll("video").length);
    const images = bands.map((el) => el.querySelectorAll("img").length);

    return {
      bands: meta.map((band, index) => {
        const bandAnimations = animations.filter((anim) => anim.band === index);
        const infinite = bandAnimations.filter((anim) => anim.iterations === "Infinity").length;
        const running = bandAnimations.filter((anim) => anim.playState === "running").length;
        const changed = first[index] !== second[index];
        const kind = videos[index] > 0 ? "video" : changed || infinite > 0 ? "motion" : "static";
        return {
          ...band,
          kind,
          signals: {
            domChanged: changed,
            infiniteAnimations: infinite,
            runningAnimations: running,
            videos: videos[index],
            images: images[index],
          },
          animations: bandAnimations.slice(0, 40),
        };
      }),
      page: {
        title: document.title,
        height: document.body.scrollHeight,
        width: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        scrollY: window.scrollY,
        groundTone: document.documentElement.getAttribute("data-ground-tone"),
        sectionCount: bands.length,
        animations: document.getAnimations().length,
      },
      images: [...document.images].map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        loading: img.loading,
        rect: (() => {
          const r = img.getBoundingClientRect();
          return { top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
        })(),
      })),
      h1:
        (document.querySelector("main h1")?.textContent || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 200) || null,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
    };
  });
}

/** Pause/rewind CSS animations that live inside bands classified as static. */
async function freezeStaticBands(page, bandCount, staticFlags) {
  return page
    .evaluate(
      ({ bandCount, staticFlags }) => {
        const all = [...document.querySelectorAll("main > section, main > div")];
        const bands = all.filter((el) => el.getBoundingClientRect().height > 0.5);
        let paused = 0;
        for (const anim of document.getAnimations()) {
          const target = anim.effect?.target;
          const bandEl = target?.closest?.("main > section, main > div");
          if (!bandEl) continue;
          const index = bands.indexOf(bandEl);
          if (index < 0 || index >= bandCount || !staticFlags[index]) continue;
          const timing = anim.effect?.getTiming?.();
          if (!timing) continue;
          if (timing.iterations === Infinity || anim.playState === "running") {
            try {
              anim.currentTime = 0;
              anim.pause();
              paused += 1;
            } catch {
              /* ignore */
            }
          }
        }
        return paused;
      },
      { bandCount, staticFlags },
    )
    .catch(() => 0);
}

async function freezeVideos(page, bandCount) {
  await page
    .evaluate(async () => {
      const videos = [...document.querySelectorAll("video")];
      for (const video of videos) {
        try {
          video.pause();
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
      await Promise.race([
        Promise.all(
          videos.map(
            (video) =>
              new Promise((resolve) => {
                if (Math.abs(video.currentTime) < 0.01) return resolve();
                video.addEventListener("seeked", resolve, { once: true });
                setTimeout(resolve, 800);
              }),
          ),
        ),
        new Promise((r) => setTimeout(r, 1000)),
      ]);
    })
    .catch(() => {});
}

/** Open, settle and capture one side. Returns buffers + measurements. */
export async function captureSide(browser, { side, route, width, scrollY = 0, timeout = 60_000 }) {
  const started = Date.now();
  const context = await newSideContext(browser, width, side);
  const page = await context.newPage();
  page.setDefaultTimeout(timeout);
  await installOverlayCleanup(page);
  const consoleErrors = [];
  const badResponses = [];
  let status = 0;
  let navError = null;

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text().replace(/\s+/g, " ").slice(0, 300);
      if (!/WebSocket|favicon/i.test(text)) consoleErrors.push(text);
    }
  });
  page.on("pageerror", (err) =>
    consoleErrors.push("pageerror: " + String(err.message).slice(0, 300)),
  );
  page.on("response", (res) => {
    if (res.status() >= 400) {
      badResponses.push({
        status: res.status(),
        url: res.url().slice(0, 240),
        type: res.request().resourceType(),
      });
    }
  });
  page.on("requestfailed", (req) => {
    const failure = req.failure()?.errorText ?? "failed";
    if (!/net::ERR_ABORTED/.test(failure)) {
      badResponses.push({
        status: 0,
        url: req.url().slice(0, 240),
        type: req.resourceType(),
        failure,
      });
    }
  });

  const origin = side === "source" ? SOURCE_ORIGIN : LOCAL_ORIGIN;
  const url = origin + (route === "/" ? "/" : route);
  const startedAt = Date.now();
  try {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout });
        status = response?.status() ?? 0;
        break;
      } catch (err) {
        navError = String(err?.message ?? err).slice(0, 400);
        if (attempt === 2) throw err;
        await sleep(900);
      }
    }
    await page.waitForLoadState("load", { timeout: 15_000 }).catch(() => {});
    await waitForFonts(page);
    await sleep(450);
    const overlaysRemoved = await dismissOverlays(page).catch(() => []);
    await scrollThrough(page);
    await settleImages(page);
    await scrollTo(
      page,
      Math.max(
        0,
        Math.min(
          scrollY,
          await page.evaluate(() => document.body.scrollHeight - window.innerHeight),
        ),
      ),
    );
    await sleep(950);
    await finishFiniteAnimations(page);
    await sleep(120);

    const measured = await measureBands(page);
    const staticFlags = measured.bands.map((band) => band.kind === "static");
    const pausedAnimations = await freezeStaticBands(page, measured.bands.length, staticFlags);
    await freezeVideos(page, measured.bands.length);
    await sleep(120);

    const screenshot = await page.screenshot({ fullPage: true, type: "png", caret: "hide" });
    await context.close();

    return {
      side,
      url,
      status,
      navError,
      overlaysRemoved,
      pausedAnimations,
      consoleErrors: consoleErrors.slice(0, 15),
      badResponses,
      measured,
      screenshot,
      timings: { totalMs: Date.now() - started, navMs: Date.now() - startedAt },
    };
  } catch (error) {
    await context.close().catch(() => {});
    return {
      side,
      url,
      status,
      navError: navError || String(error?.message ?? error),
      consoleErrors: consoleErrors.slice(0, 15),
      badResponses,
      measured: null,
      screenshot: null,
      timings: { totalMs: Date.now() - started },
    };
  }
}

/** Decode a PNG to RGBA and crop to the common origin. */
export async function pngRGBA(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

export function cropRGBA(src, srcWidth, x, y, width, height) {
  const out = Buffer.alloc(width * height * 4);
  for (let row = 0; row < height; row += 1) {
    const from = ((y + row) * srcWidth + x) * 4;
    const to = row * width * 4;
    src.copy(out, to, from, from + width * 4);
  }
  return out;
}

function diffRegion(a, aWidth, aHeight, b, bWidth, bHeight, region) {
  const x = Math.max(0, Math.min(region.x, Math.min(aWidth, bWidth)));
  const y = Math.max(0, Math.min(region.y, Math.min(aHeight, bHeight)));
  const width = Math.max(0, Math.min(region.width, Math.min(aWidth, bWidth) - x));
  const height = Math.max(0, Math.min(region.height, Math.min(aHeight, bHeight) - y));
  if (width < 1 || height < 1) return { pixels: 0, diff: 0, pct: null };
  const ca = cropRGBA(a, aWidth, x, y, width, height);
  const cb = cropRGBA(b, bWidth, x, y, width, height);
  const out = Buffer.alloc(width * height * 4);
  const diff = pixelmatch(ca, cb, out, width, height, {
    threshold: 0.1,
    includeAA: false,
    alpha: 0.5,
    diffColor: [255, 0, 80],
    aaColor: [255, 220, 0],
  });
  return { pixels: width * height, diff, pct: (100 * diff) / (width * height), width, height };
}

/**
 * Compare two full-page PNGs. Returns overall pixelmatch %, per-band values
 * on both absolute (same document Y) and inner (each band's own crop)
 * alignment, plus a full-page diff PNG buffer.
 */
export async function diffPages(sourcePng, localPng, sourceBands, localBands, kinds) {
  const a = await pngRGBA(sourcePng);
  const b = await pngRGBA(localPng);
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  // Always crop both decoded images to the common rectangle: PNG heights can
  // differ by a few px when a route's lazy media settles between captures.
  const ca = cropRGBA(a.data, a.width, 0, 0, width, height);
  const cb = cropRGBA(b.data, b.width, 0, 0, width, height);
  const diffBuffer = Buffer.alloc(width * height * 4);
  const overallDiff = pixelmatch(ca, cb, diffBuffer, width, height, {
    threshold: 0.1,
    includeAA: false,
    alpha: 0.5,
    diffColor: [255, 0, 80],
    aaColor: [255, 220, 0],
  });

  const bandResults = [];
  let staticPixels = 0;
  let staticDiff = 0;
  let motionPixels = 0;
  let motionDiff = 0;
  let videoPixels = 0;
  let videoDiff = 0;

  const count = Math.max(sourceBands.length, localBands.length);
  for (let i = 0; i < count; i += 1) {
    const sBand = sourceBands[i];
    const lBand = localBands[i];
    const kind = kinds[i] || "motion";
    const top = Math.min(sBand?.top ?? lBand?.top ?? 0, lBand?.top ?? sBand?.top ?? 0);
    const absHeight = Math.min(
      sBand?.height ?? lBand?.height ?? 0,
      lBand?.height ?? sBand?.height ?? 0,
    );
    const abs = diffRegion(ca, width, height, cb, width, height, {
      x: 0,
      y: Math.max(0, Math.round(top)),
      width,
      height: Math.max(0, Math.round(absHeight)),
    });
    let inner = null;
    if (kind === "static" && sBand && lBand) {
      const sTop = Math.max(0, Math.min(height - 1, Math.round(sBand.top)));
      const lTop = Math.max(0, Math.min(height - 1, Math.round(lBand.top)));
      const innerHeight = Math.min(
        Math.round(Math.min(sBand.height, lBand.height)),
        height - sTop,
        height - lTop,
      );
      if (innerHeight >= 1) {
        const sa = cropRGBA(ca, width, 0, sTop, width, innerHeight);
        const sb = cropRGBA(cb, width, 0, lTop, width, innerHeight);
        const out = Buffer.alloc(width * innerHeight * 4);
        const id = pixelmatch(sa, sb, out, width, innerHeight, {
          threshold: 0.1,
          includeAA: false,
          alpha: 0.5,
          diffColor: [255, 0, 80],
          aaColor: [255, 220, 0],
        });
        inner = {
          pixels: width * innerHeight,
          diff: id,
          pct: (100 * id) / (width * innerHeight),
        };
      }
    }
    if (kind === "static") {
      staticPixels += abs.pixels;
      staticDiff += abs.diff;
    } else if (kind === "video") {
      videoPixels += abs.pixels;
      videoDiff += abs.diff;
    } else {
      motionPixels += abs.pixels;
      motionDiff += abs.diff;
    }
    bandResults.push({
      index: i,
      label: sBand?.label ?? lBand?.label ?? `band${i}`,
      kind,
      source: sBand
        ? { top: sBand.top, height: sBand.height, kind: sBand.kind, signals: sBand.signals }
        : null,
      local: lBand
        ? { top: lBand.top, height: lBand.height, kind: lBand.kind, signals: lBand.signals }
        : null,
      delta: {
        top: sBand && lBand ? Math.round((lBand.top - sBand.top) * 100) / 100 : null,
        height: sBand && lBand ? Math.round((lBand.height - sBand.height) * 100) / 100 : null,
      },
      pct: abs.pct === null ? null : Math.round(abs.pct * 100) / 100,
      pixels: abs.pixels,
      diffPixels: abs.diff,
      innerPct: inner ? Math.round(inner.pct * 100) / 100 : null,
    });
  }

  return {
    width,
    height,
    sourceSize: { width: a.width, height: a.height },
    localSize: { width: b.width, height: b.height },
    overallPct: Math.round(((100 * overallDiff) / (width * height)) * 100) / 100,
    overallDiff,
    staticPct: staticPixels ? Math.round(((100 * staticDiff) / staticPixels) * 100) / 100 : null,
    staticPixels,
    staticDiff,
    motionPct: motionPixels ? Math.round(((100 * motionDiff) / motionPixels) * 100) / 100 : null,
    motionPixels,
    motionDiff,
    videoPct: videoPixels ? Math.round(((100 * videoDiff) / videoPixels) * 100) / 100 : null,
    videoPixels,
    videoDiff,
    bands: bandResults,
    diffBuffer,
  };
}

/** Compare one route/width pair and write JSON + diff PNG. */
export async function compareRoute(options) {
  const {
    browser,
    route,
    width,
    scrollY = 0,
    outDir = DEFAULT_OUT,
    keepShots = false,
    timeout = 60_000,
    quiet = false,
  } = options;
  const started = Date.now();
  const slug = slugFor(route);
  const dir = path.resolve(outDir, slug);
  await fs.mkdir(dir, { recursive: true });

  const [source, local] = await Promise.all([
    captureSide(browser, { side: "source", route, width, scrollY, timeout }),
    captureSide(browser, { side: "local", route, width, scrollY, timeout }),
  ]);

  const result = {
    generatedAt: new Date().toISOString(),
    route,
    slug,
    width,
    viewportHeight: VIEWPORT_HEIGHT,
    scrollY,
    source: source.measured
      ? {
          url: source.url,
          status: source.status,
          ...source.measured.page,
          missingImages: source.measured.images.filter((img) => !img.complete || !img.naturalWidth),
          imageCount: source.measured.images.length,
          h1: source.measured.h1,
          bodyBackground: source.measured.bodyBackground,
          consoleErrors: source.consoleErrors,
          badResponses: source.badResponses.slice(0, 20),
          pausedAnimations: source.pausedAnimations,
          overlaysRemoved: source.overlaysRemoved,
          timings: source.timings,
        }
      : {
          url: source.url,
          status: source.status,
          error: source.navError,
          consoleErrors: source.consoleErrors,
          badResponses: source.badResponses.slice(0, 20),
          timings: source.timings,
        },
    local: local.measured
      ? {
          url: local.url,
          status: local.status,
          ...local.measured.page,
          missingImages: local.measured.images.filter((img) => !img.complete || !img.naturalWidth),
          imageCount: local.measured.images.length,
          h1: local.measured.h1,
          bodyBackground: local.measured.bodyBackground,
          consoleErrors: local.consoleErrors,
          badResponses: local.badResponses.slice(0, 20),
          pausedAnimations: local.pausedAnimations,
          overlaysRemoved: local.overlaysRemoved,
          timings: local.timings,
        }
      : {
          url: local.url,
          status: local.status,
          error: local.navError,
          consoleErrors: local.consoleErrors,
          badResponses: local.badResponses.slice(0, 20),
          timings: local.timings,
        },
    artifacts: {},
    timings: {},
  };

  if (source.screenshot && local.screenshot && source.measured && local.measured) {
    const sourceBands = source.measured.bands;
    const localBands = local.measured.bands;
    const kinds = Array.from(
      { length: Math.max(sourceBands.length, localBands.length) },
      (_, i) => {
        const s = sourceBands[i]?.kind;
        const l = localBands[i]?.kind;
        if (s === "motion" || l === "motion") return "motion";
        if (s === "video" || l === "video") return "video";
        return "static";
      },
    );
    const diff = await diffPages(
      source.screenshot,
      local.screenshot,
      sourceBands,
      localBands,
      kinds,
    );

    const diffPath = path.join(dir, `${width}-diff.png`);
    await sharp(diff.diffBuffer, { raw: { width: diff.width, height: diff.height, channels: 4 } })
      .png({ compressionLevel: 6 })
      .toFile(diffPath)
      .catch(() => {});

    if (keepShots) {
      await fs.writeFile(path.join(dir, `${width}-source.png`), source.screenshot);
      await fs.writeFile(path.join(dir, `${width}-local.png`), local.screenshot);
    }

    const worst = [...diff.bands]
      .filter((band) => band.pct !== null)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5);

    result.diff = {
      overallPct: diff.overallPct,
      staticPct: diff.staticPct,
      motionPct: diff.motionPct,
      videoPct: diff.videoPct,
      staticPixels: diff.staticPixels,
      staticDiffPixels: diff.staticDiff,
      motionPixels: diff.motionPixels,
      motionDiffPixels: diff.motionDiff,
      videoPixels: diff.videoPixels,
      videoDiffPixels: diff.videoDiff,
      sourceSize: diff.sourceSize,
      localSize: diff.localSize,
      commonSize: { width: diff.width, height: diff.height },
      heightDelta: diff.localSize.height - diff.sourceSize.height,
      widthDelta: diff.localSize.width - diff.sourceSize.width,
      bands: diff.bands,
      worstBands: worst.map((band) => ({
        index: band.index,
        label: band.label,
        kind: band.kind,
        pct: band.pct,
        innerPct: band.innerPct,
        delta: band.delta,
      })),
    };
    result.artifacts.diff = path.relative(process.cwd(), diffPath);
  } else {
    result.diff = null;
  }

  result.source.heightDelta =
    result.source.height && result.local.height ? result.local.height - result.source.height : null;
  result.geometry = {
    documentHeight: {
      source: result.source.height ?? null,
      local: result.local.height ?? null,
      delta:
        result.source.height != null && result.local.height != null
          ? result.local.height - result.source.height
          : null,
    },
    documentWidth: {
      source: result.source.width ?? null,
      local: result.local.width ?? null,
      delta:
        result.source.width != null && result.local.width != null
          ? result.local.width - result.source.width
          : null,
    },
    sectionCount: {
      source: result.source.sectionCount ?? null,
      local: result.local.sectionCount ?? null,
      delta:
        result.source.sectionCount != null && result.local.sectionCount != null
          ? result.local.sectionCount - result.source.sectionCount
          : null,
    },
    maxSectionShiftPx: result.diff
      ? Math.max(0, ...result.diff.bands.map((band) => Math.abs(band.delta.top ?? 0)))
      : null,
  };
  result.missingImages = {
    source: result.source.missingImages?.length ?? null,
    local: result.local.missingImages?.length ?? null,
    delta:
      result.source.missingImages != null && result.local.missingImages != null
        ? result.local.missingImages.length - result.source.missingImages.length
        : null,
  };
  result.timings.totalMs = Date.now() - started;
  result.timings.sourceMs = source.timings.totalMs;
  result.timings.localMs = local.timings.totalMs;

  const jsonPath = path.join(dir, `${width}.json`);
  await fs.writeFile(jsonPath, JSON.stringify(result, null, 2));
  result.artifacts.json = path.relative(process.cwd(), jsonPath);

  if (!quiet) {
    const bits = [
      route.padEnd(36),
      String(width).padStart(4),
      `h ${result.source.height ?? "?"}/${result.local.height ?? "?"}`,
      `overall ${result.diff?.overallPct ?? "?"}%`,
      `static ${result.diff?.staticPct ?? "?"}%`,
      `missing ${result.missingImages.source ?? "?"}/${result.missingImages.local ?? "?"}`,
      `${Math.round(result.timings.totalMs / 1000)}s`,
    ];
    console.log(bits.join("  "));
  }
  return result;
}

function parseArgs(argv) {
  const options = {
    route: null,
    width: 1568,
    scrollY: 0,
    outDir: DEFAULT_OUT,
    keepShots: false,
    timeout: 60_000,
    quiet: false,
  };
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      return argv[i];
    };
    if (arg === "--route") options.route = next();
    else if (arg === "--width") options.width = Number(next());
    else if (arg === "--scroll") options.scrollY = Number(next());
    else if (arg === "--out") options.outDir = next();
    else if (arg === "--timeout") options.timeout = Number(next());
    else if (arg === "--keep-shots") options.keepShots = true;
    else if (arg === "--quiet") options.quiet = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: node scripts/compare-route.mjs --route / --width 1568 [--scroll 0] [--out docs/verify] [--keep-shots] [--timeout 60000]",
      );
      process.exit(0);
    } else if (!arg.startsWith("-")) positional.push(arg);
    else throw new Error(`Unknown flag: ${arg}`);
  }
  if (!options.route && positional[0]) options.route = positional[0];
  if (positional[1]) options.width = Number(positional[1]);
  if (!options.route) options.route = "/";
  if (!Number.isFinite(options.width) || options.width < 320)
    throw new Error("A valid --width is required");
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const browser = await launchBrowser();
  try {
    const result = await compareRoute({ browser, ...options });
    if (result.diff) {
      console.log(
        JSON.stringify(
          {
            route: result.route,
            width: result.width,
            overallPct: result.diff.overallPct,
            staticPct: result.diff.staticPct,
            motionPct: result.diff.motionPct,
            heightDelta: result.diff.heightDelta,
            missingImages: result.missingImages,
            worstBands: result.diff.worstBands,
            artifacts: result.artifacts,
          },
          null,
          2,
        ),
      );
    }
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
