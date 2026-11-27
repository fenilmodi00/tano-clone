#!/usr/bin/env node
/**
 * Motion-scene comparison: live source vs local clone at matched scroll/time
 * offsets, with a +/-400 ms slide alignment and timing-divergence report.
 *
 *   node scripts/compare-motion.mjs --scene all --width 1568
 *   node scripts/compare-motion.mjs --scene hero-campaign --widths 1568,390
 *
 * Scenes on `/`:
 *   hero-campaign  .hp-camp              campaign reel, score, chat, LTV/CAC
 *   counters       .hp-hero-strip        live counters + hero strip marquee
 *   experiments    .hp-xl               6-round experiment table
 *   marquee        .wire-cases-marks     rAF logo/case-mark marquee
 *   ground-theme   first [data-ground] boundary: tone tween + after state
 *
 * Each side is captured from the same reset scroll position; frames are taken
 * on a 0/250..5500 ms grid (ground theme uses a 30 ms DOM sample plus a
 * screenshot ladder). A frame is compared against every frame on the other
 * side whose visual timestamp is within +/-400 ms; the minimum pixel diff and
 * its timing offset are reported. Motion/video frames are diagnostic, never
 * pass/fail. Writes docs/verify/motion/<scene>-<width>.json + best diff PNG.
 *
 * Flags: --scene --route --width --widths --out --samples --window --keep-frames
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import pixelmatch from "pixelmatch";
import {
  SOURCE_ORIGIN,
  LOCAL_ORIGIN,
  VIEWPORT_HEIGHT,
  launchBrowser,
  newSideContext,
  installOverlayCleanup,
  scrollThrough,
  settleImages,
  scrollTo,
  pngRGBA,
  cropRGBA,
} from "./compare-route.mjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const DEFAULT_OUT = "docs/verify";
const DEFAULT_WINDOW = 400;
const DEFAULT_OFFSETS = [0, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500];
const GROUND_OFFSETS = [0, 150, 350, 600, 900];

const SCENES = {
  "hero-campaign": {
    anchor: ".hp-camp",
    offsets: DEFAULT_OFFSETS,
    park: "hero",
  },
  counters: {
    anchor: ".hp-hero-strip",
    offsets: DEFAULT_OFFSETS,
    park: "below",
  },
  experiments: {
    anchor: ".hp-xl",
    offsets: DEFAULT_OFFSETS,
    park: "below",
  },
  marquee: {
    anchor: ".wire-cases-marks",
    offsets: DEFAULT_OFFSETS,
    park: "below",
  },
  "ground-theme": {
    anchor: null,
    offsets: GROUND_OFFSETS,
    park: "ground",
  },
};

async function waitForFonts(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    if (document.fonts.status !== "loaded") {
      await new Promise((resolve) => {
        document.fonts.addEventListener("loadingdone", resolve, { once: true });
        setTimeout(resolve, 5000);
      });
    }
  });
}

async function preparePage(browser, { side, width, route, timeout }) {
  const context = await newSideContext(browser, width, side);
  try {
    return await preparePageInContext(context, { side, width, route, timeout });
  } catch (error) {
    await context.close().catch(() => {});
    throw error;
  }
}

async function preparePageInContext(context, { side, width, route, timeout }) {
  const page = await context.newPage();
  page.setDefaultTimeout(timeout);
  await installOverlayCleanup(page);
  const consoleErrors = [];
  const badResponses = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text().replace(/\s+/g, " ").slice(0, 240);
      if (!/WebSocket|favicon/i.test(text)) consoleErrors.push(text);
    }
  });
  page.on("response", (res) => {
    if (res.status() >= 400) {
      badResponses.push({ status: res.status(), url: res.url().slice(0, 200), type: res.request().resourceType() });
    }
  });
  const url = (side === "source" ? SOURCE_ORIGIN : LOCAL_ORIGIN) + route;
  let status = 0;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout });
      status = response?.status() ?? 0;
      break;
    } catch (error) {
      if (attempt === 2) throw error;
      await sleep(800);
    }
  }
  await page.waitForLoadState("load", { timeout: 15_000 }).catch(() => {});
  await waitForFonts(page);
  await sleep(450);
  await scrollThrough(page);
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.loading = "eager";
    });
  });
  await settleImages(page);
  await page.waitForLoadState("networkidle", { timeout: 4000 }).catch(() => {});
  await scrollTo(page, 0);
  await sleep(500);
  return { context, page, url, status, consoleErrors, badResponses };
}

function readMarkersInPage(scene) {
  const opacity = (el) => {
    const value = Number(getComputedStyle(el).opacity);
    return Number.isFinite(value) ? Math.round(value * 1000) / 1000 : null;
  };
  const text = (el) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
  const translate = (el) => {
    if (!el) return null;
    const transform = getComputedStyle(el).transform;
    if (!transform || transform === "none") return { x: 0, y: 0 };
    try {
      const matrix = new DOMMatrixReadOnly(transform);
      return { x: Math.round(matrix.m41 * 100) / 100, y: Math.round(matrix.m42 * 100) / 100 };
    } catch {
      return null;
    }
  };
  const base = {
    scrollY: Math.round(window.scrollY),
    tone: document.documentElement.getAttribute("data-ground-tone"),
    groundT: getComputedStyle(document.documentElement).getPropertyValue("--ground-t").trim(),
    inkT: getComputedStyle(document.documentElement).getPropertyValue("--ink-t").trim(),
    moving: document.documentElement.hasAttribute("data-ground-moving"),
    bodyBg: getComputedStyle(document.body).backgroundColor,
  };

  if (scene === "hero-campaign") {
    const campaign =
      document.querySelector('.hp-camp-track-button[aria-current="true"]')?.getAttribute("aria-label") ?? null;
    const brand = campaign
      ? campaign.replace(/^Show the\s+/, "").replace(/\s+campaign$/, "").trim().toLowerCase()
      : null;
    const scenes = [...document.querySelectorAll(".hp-camp-scene")].map((el) => ({
      opacity: opacity(el),
      leaving: el.hasAttribute("data-leaving"),
      text: text(el).toLowerCase(),
      turns: [...el.querySelectorAll(".hp-camp-turn")].map(opacity),
      metrics: [...el.querySelectorAll(".hp-camp-metric")].map(opacity),
      score: text(el.querySelector(".hp-camp-match-figure")),
    }));
    // During the 600 ms crossfade both the outgoing and incoming scene exist.
    // Prefer the incoming scene (matches the current campaign brand), then
    // fall back to the most opaque one.
    const active =
      (brand ? scenes.find((item) => item.text.includes(brand)) : null) ??
      scenes.reduce(
        (best, item, index) => (item.opacity > (best?.opacity ?? -1) ? { ...item, index } : best),
        null,
      );
    return {
      ...base,
      campaign,
      activeScene: active?.index ?? null,
      sceneOpacities: scenes.map((item) => item.opacity),
      turns: active?.turns ?? [],
      metrics: active?.metrics ?? [],
      score: active?.score ?? null,
      fills: [...document.querySelectorAll(".hp-camp-track .hp-steps-seg-fill")].map(
        (el) => getComputedStyle(el).width,
      ),
    };
  }
  if (scene === "counters") {
    const strip = document.querySelector(".hp-hero-strip-run");
    return {
      ...base,
      chips: [...document.querySelectorAll(".hp-hero-strip .hp-loop-stat-chip")].map(text),
      x: translate(strip)?.x ?? null,
      stripWidth: strip ? Math.round(strip.getBoundingClientRect().width) : null,
      dock:
        document.querySelector(".hp-hero-strip-dock")?.getAttribute("data-intro") ??
        document.querySelector(".hp-hero-strip-dock")?.getAttribute("data-floating") ??
        null,
    };
  }
  if (scene === "experiments") {
    return {
      ...base,
      activeChip: text(document.querySelector('.hp-xl-chip[data-picked="true"]')),
      chips: [...document.querySelectorAll(".hp-xl-chip")].map(text),
      cac: text(document.querySelector(".hp-xl-cac-row")),
      rows: [...document.querySelectorAll(".hp-xl [class*='row']")].slice(0, 12).map(text),
    };
  }
  if (scene === "marquee") {
    const run = document.querySelector(".wire-cases-marks-run");
    return {
      ...base,
      x: translate(run)?.x ?? null,
      copyWidth: run ? Math.round(run.getBoundingClientRect().width) : null,
      heroStripX: translate(document.querySelector(".hp-hero-strip-run"))?.x ?? null,
      inline: run?.getAttribute("style") ?? null,
    };
  }
  return base;
}

async function readMarkers(page, scene) {
  return page.evaluate(readMarkersInPage, scene);
}

async function anchorInfo(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      top: Math.round((rect.top + window.scrollY) * 100) / 100,
      left: Math.round(rect.left * 100) / 100,
      height: Math.round(rect.height * 100) / 100,
      width: Math.round(rect.width * 100) / 100,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
    };
  }, selector);
}

async function groundInfo(page) {
  return page.evaluate(() => {
    const nodes = [...document.querySelectorAll("[data-ground]")].map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        tone: el.getAttribute("data-ground"),
        top: Math.round((rect.top + window.scrollY) * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
        label: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 80),
      };
    });
    let index = -1;
    for (let i = 1; i < nodes.length; i += 1) {
      if (nodes[i].tone !== nodes[i - 1].tone && nodes[i].height > 100) {
        index = i;
        break;
      }
    }
    if (index < 0) return { nodes, boundary: null };
    return {
      nodes,
      boundary: {
        index,
        top: nodes[index].top,
        from: nodes[index - 1].tone,
        to: nodes[index].tone,
        label: nodes[index].label,
      },
    };
  });
}

async function clipFor(page, anchor) {
  return page.evaluate(
    ({ selector }) => {
      if (!selector) return { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
      const el = document.querySelector(selector);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.floor(rect.left));
      const y = Math.max(0, Math.floor(rect.top));
      const width = Math.min(window.innerWidth - x, Math.floor(rect.right) - x);
      const height = Math.min(window.innerHeight - y, Math.floor(rect.bottom) - y);
      return { x, y, width, height, rect: { top: Math.round(rect.top), height: Math.round(rect.height) } };
    },
    { selector: anchor },
  );
}

async function parkAndEnter(page, scene) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const maxScroll = Math.max(0, height - VIEWPORT_HEIGHT);
  if (scene === "ground-theme") {
    const info = await groundInfo(page);
    if (!info.boundary) throw new Error("No [data-ground] tone boundary found");
    const park = Math.max(0, Math.min(maxScroll, info.boundary.top - VIEWPORT_HEIGHT - 400));
    const target = Math.max(0, Math.min(maxScroll, info.boundary.top - VIEWPORT_HEIGHT * 0.45 + 120));
    await scrollTo(page, park);
    await sleep(950);
    const before = await readMarkers(page, scene);
    await scrollTo(page, target);
    await sleep(40);
    return { info, park, target, before };
  }
  const spec = SCENES[scene];
  const anchor = await anchorInfo(page, spec.anchor);
  if (!anchor || anchor.width < 2 || anchor.height < 2) {
    throw new Error(`Scene anchor ${spec.anchor} not visible (${JSON.stringify(anchor)})`);
  }
  if (scene === "hero-campaign") {
    await scrollTo(page, Math.min(maxScroll, Math.max(0, anchor.top + 1600)));
    await sleep(750);
  } else {
    const park = Math.max(0, Math.min(maxScroll, anchor.top + 1200));
    await scrollTo(page, park);
    await sleep(900);
  }
  const afterPark = await anchorInfo(page, spec.anchor);
  const target =
    scene === "hero-campaign"
      ? Math.max(0, Math.min(maxScroll, afterPark.top - 150))
      : Math.max(
          0,
          Math.min(maxScroll, afterPark.top + afterPark.height / 2 - VIEWPORT_HEIGHT / 2),
        );
  await scrollTo(page, target);
  await sleep(40);
  let anchorMode = "entry";
  let campaign = null;
  if (scene === "hero-campaign") {
    const label = () =>
      page
        .evaluate(
          () =>
            document.querySelector('.hp-camp-track-button[aria-current="true"]')?.getAttribute("aria-label") ??
            null,
        )
        .catch(() => null);
    const startLabel = await label();
    if (startLabel) {
      const deadline = Date.now() + 9000;
      while (Date.now() < deadline) {
        const current = await label();
        if (current && current !== startLabel) {
          campaign = current;
          anchorMode = "campaign-change";
          break;
        }
        await sleep(90);
      }
      if (!campaign) {
        anchorMode = "timeout";
        campaign = startLabel;
      }
    }
  }
  return { anchor: afterPark, park: null, target, before: null, anchorMode, campaign };
}

async function captureFrames(page, { scene, clip, offsets, keepFrames, frameDir, side }) {
  const t0 = Date.now();
  const frames = [];
  for (const targetMs of offsets) {
    const wait = t0 + targetMs - Date.now();
    if (wait > 0) await sleep(wait);
    const markers = await readMarkers(page, scene);
    const elapsedMs = Date.now() - t0;
    const png = await page.screenshot({
      type: "png",
      caret: "hide",
      clip: clip ?? undefined,
    });
    const capturedAtMs = Date.now() - t0;
    frames.push({
      targetMs,
      elapsedMs,
      capturedAtMs,
      visualMs: Math.round((elapsedMs + capturedAtMs) / 2),
      markers,
      png,
    });
    if (keepFrames && frameDir) {
      await fs.mkdir(frameDir, { recursive: true });
      await fs.writeFile(path.join(frameDir, `${side}-${String(targetMs).padStart(5, "0")}.png`), png);
    }
  }
  return frames;
}

function speedFromFrames(frames, fromMs = 1000) {
  const usable = frames.filter((frame) => frame.elapsedMs >= fromMs && frame.markers.x != null);
  if (usable.length < 2) return null;
  const first = usable[0];
  const last = usable[usable.length - 1];
  const dt = (last.visualMs - first.visualMs) / 1000;
  if (dt <= 0) return null;
  const dx = last.markers.x - first.markers.x;
  return {
    pxPerSec: Math.round((dx / dt) * 100) / 100,
    fromMs: first.elapsedMs,
    toMs: last.elapsedMs,
    dx: Math.round(dx * 100) / 100,
    dtSec: Math.round(dt * 1000) / 1000,
    samples: usable.length,
  };
}

function firstFrame(frames, predicate) {
  for (const frame of frames) {
    if (predicate(frame)) return frame;
  }
  return null;
}

function signalsFor(scene, frames) {
  if (!frames.length) return {};
  const first = frames[0].markers;
  if (scene === "hero-campaign") {
    const scoreStart = firstFrame(frames, (frame) => frame.markers.score !== first.score);
    const turn2 = firstFrame(frames, (frame) => (frame.markers.turns?.[1] ?? 0) > 0.5);
    const turn3 = firstFrame(frames, (frame) => (frame.markers.turns?.[2] ?? 0) > 0.5);
    const metricSwitch = firstFrame(frames, (frame) => (frame.markers.metrics?.[1] ?? 0) > 0.5);
    const campaignChange = firstFrame(frames, (frame) => frame.markers.campaign !== first.campaign);
    return {
      scoreChangeMs: scoreStart?.elapsedMs ?? null,
      turn2Ms: turn2?.elapsedMs ?? null,
      turn3Ms: turn3?.elapsedMs ?? null,
      metricSwitchMs: metricSwitch?.elapsedMs ?? null,
      campaignChangeMs: campaignChange?.elapsedMs ?? null,
      initialScore: first.score,
      initialCampaign: first.campaign,
    };
  }
  if (scene === "counters") {
    const chipsChange = firstFrame(
      frames,
      (frame) => JSON.stringify(frame.markers.chips) !== JSON.stringify(first.chips),
    );
    return {
      counterChangeMs: chipsChange?.elapsedMs ?? null,
      initialChips: first.chips,
      speed: speedFromFrames(frames),
      stripWidth: first.stripWidth,
      dock: first.dock,
    };
  }
  if (scene === "experiments") {
    const roundChange = firstFrame(frames, (frame) => frame.markers.activeChip !== first.activeChip);
    const cacChange = firstFrame(frames, (frame) => frame.markers.cac !== first.cac);
    return {
      roundChangeMs: roundChange?.elapsedMs ?? null,
      cacChangeMs: cacChange?.elapsedMs ?? null,
      initialChip: first.activeChip,
      initialCac: first.cac,
    };
  }
  if (scene === "marquee") {
    return {
      speed: speedFromFrames(frames),
      copyWidth: first.copyWidth,
      initialX: first.x,
    };
  }
  return {};
}

async function sampleGroundFast(page, { park, target, duration = 900, interval = 30 }) {
  return page.evaluate(
    async ({ parkY, targetY, durationMs, stepMs }) => {
      const read = () => {
        const root = document.documentElement;
        const tano = document.querySelector(".tano");
        const atPoint = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * 0.55);
        return {
          t: 0,
          tone: root.getAttribute("data-ground-tone"),
          groundT: getComputedStyle(root).getPropertyValue("--ground-t").trim(),
          inkT: getComputedStyle(root).getPropertyValue("--ink-t").trim(),
          moving: root.hasAttribute("data-ground-moving"),
          bodyBg: getComputedStyle(document.body).backgroundColor,
          tanoBg: tano ? getComputedStyle(tano).backgroundColor : null,
          atLine: atPoint?.closest?.("[data-ground]")?.getAttribute("data-ground") ?? null,
          scrollY: Math.round(window.scrollY),
        };
      };
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, parkY);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      window.scrollTo(0, targetY);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const t0 = performance.now();
      const samples = [];
      while (performance.now() - t0 <= durationMs) {
        const sample = read();
        sample.t = Math.round((performance.now() - t0) * 10) / 10;
        samples.push(sample);
        await new Promise((resolve) => setTimeout(resolve, stepMs));
      }
      return samples;
    },
    { parkY: park, targetY: target, durationMs: duration, stepMs: interval },
  );
}

function groundSignals(samples, targetTone) {
  if (!samples?.length) return {};
  const flip = samples.find((sample) => sample.tone === targetTone);
  const settle = samples.find(
    (sample) => sample.tone === targetTone && Number.parseFloat(sample.groundT || "0") >= 0.985,
  );
  const firstMoving = samples.find((sample) => sample.moving);
  return {
    targetTone,
    initialTone: samples[0].tone,
    toneFlipMs: flip?.t ?? null,
    groundSettleMs: settle?.t ?? null,
    movingStartMs: firstMoving?.t ?? null,
    movingEndMs: [...samples].reverse().find((sample) => sample.moving)?.t ?? null,
    finalGroundT: samples[samples.length - 1].groundT,
    finalInkT: samples[samples.length - 1].inkT,
    finalBodyBg: samples[samples.length - 1].bodyBg,
    sampleCount: samples.length,
  };
}

async function comparePair(a, b) {
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  if (width < 1 || height < 1)
    return { pct: 100, width: 0, height: 0, diffBuffer: null, sourceCrop: null, localCrop: null };
  const ca = cropRGBA(a.data, a.width, 0, 0, width, height);
  const cb = cropRGBA(b.data, b.width, 0, 0, width, height);
  const out = Buffer.alloc(width * height * 4);
  const diff = pixelmatch(ca, cb, out, width, height, {
    threshold: 0.1,
    includeAA: false,
    alpha: 0.5,
    diffColor: [255, 0, 80],
    aaColor: [255, 220, 0],
  });
  return {
    pct: Math.round(((100 * diff) / (width * height)) * 100) / 100,
    width,
    height,
    diffBuffer: out,
    sourceCrop: ca,
    localCrop: cb,
  };
}

async function runScene(browser, { scene, route, width, outDir, windowMs, keepFrames, timeout }) {
  const spec = SCENES[scene];
  if (!spec) throw new Error(`Unknown scene: ${scene}`);
  const dir = path.resolve(outDir, "motion");
  await fs.mkdir(dir, { recursive: true });
  const started = Date.now();
  const [sourceSide, localSide] = await Promise.all([
    preparePage(browser, { side: "source", width, route, timeout }),
    preparePage(browser, { side: "local", width, route, timeout }),
  ]);

  let result = {
    generatedAt: new Date().toISOString(),
    scene,
    route,
    width,
    viewportHeight: VIEWPORT_HEIGHT,
    alignmentWindowMs: windowMs,
    offsets: spec.offsets,
  };

  try {
    const [sourceRun, localRun] = await Promise.all([
      (async () => {
        const entry = await parkAndEnter(sourceSide.page, scene);
        const clip = await clipFor(sourceSide.page, spec.anchor);
        const fast =
          scene === "ground-theme"
            ? await sampleGroundFast(sourceSide.page, {
                park: entry.park,
                target: entry.target,
                duration: 900,
                interval: 30,
              })
            : null;
        if (scene === "ground-theme") {
          // Reset once more so the screenshot ladder starts from the parked tone.
          await parkAndEnter(sourceSide.page, scene);
        }
        const frames = await captureFrames(sourceSide.page, {
          scene,
          clip,
          offsets: spec.offsets,
          keepFrames,
          frameDir: path.join(dir, `${scene}-${width}-frames`),
          side: "source",
        });
        return { entry, clip, fast, frames };
      })(),
      (async () => {
        const entry = await parkAndEnter(localSide.page, scene);
        const clip = await clipFor(localSide.page, spec.anchor);
        const fast =
          scene === "ground-theme"
            ? await sampleGroundFast(localSide.page, {
                park: entry.park,
                target: entry.target,
                duration: 900,
                interval: 30,
              })
            : null;
        if (scene === "ground-theme") {
          await parkAndEnter(localSide.page, scene);
        }
        const frames = await captureFrames(localSide.page, {
          scene,
          clip,
          offsets: spec.offsets,
          keepFrames,
          frameDir: path.join(dir, `${scene}-${width}-frames`),
          side: "local",
        });
        return { entry, clip, fast, frames };
      })(),
    ]);

    const source = sourceRun;
    const local = localRun;
    const sourceSignals =
      scene === "ground-theme"
        ? groundSignals(source.fast, source.entry.info.boundary.to)
        : signalsFor(scene, source.frames);
    const localSignals =
      scene === "ground-theme"
        ? groundSignals(local.fast, local.entry.info.boundary.to)
        : signalsFor(scene, local.frames);

    const decodedSource = await Promise.all(source.frames.map((frame) => pngRGBA(frame.png)));
    const decodedLocal = await Promise.all(local.frames.map((frame) => pngRGBA(frame.png)));

    const alignments = [];
    let best = null;
    for (let i = 0; i < local.frames.length; i += 1) {
      const localFrame = local.frames[i];
      const candidates = source.frames
        .map((frame, index) => ({ frame, index }))
        .filter(({ frame }) => Math.abs(frame.visualMs - localFrame.visualMs) <= windowMs);
      const pool = candidates.length
        ? candidates
        : source.frames
            .map((frame, index) => ({ frame, index }))
            .sort(
              (a, b) =>
                Math.abs(a.frame.visualMs - localFrame.visualMs) -
                Math.abs(b.frame.visualMs - localFrame.visualMs),
            )
            .slice(0, 1);
      let bestCandidate = null;
      for (const candidate of pool) {
        const compared = await comparePair(decodedSource[candidate.index], decodedLocal[i]);
        const record = {
          sourceIndex: candidate.index,
          sourceTargetMs: candidate.frame.targetMs,
          sourceElapsedMs: candidate.frame.elapsedMs,
          sourceVisualMs: candidate.frame.visualMs,
          localTargetMs: localFrame.targetMs,
          localElapsedMs: localFrame.elapsedMs,
          localVisualMs: localFrame.visualMs,
          deltaMs: Math.round(candidate.frame.visualMs - localFrame.visualMs),
          diffPct: compared.pct,
          compared,
        };
        if (!bestCandidate || record.diffPct < bestCandidate.diffPct) bestCandidate = record;
        if (!best || record.diffPct < best.diffPct) best = record;
      }
      alignments.push({
        localTargetMs: localFrame.targetMs,
        localElapsedMs: localFrame.elapsedMs,
        localVisualMs: localFrame.visualMs,
        candidates: pool.length,
        bestSourceTargetMs: bestCandidate.sourceTargetMs,
        bestSourceElapsedMs: bestCandidate.sourceElapsedMs,
        deltaMs: bestCandidate.deltaMs,
        diffPct: bestCandidate.diffPct,
      });
    }

    const pcts = alignments.map((item) => item.diffPct);
    const sorted = [...pcts].sort((a, b) => a - b);
    const median = sorted.length
      ? Math.round(sorted[Math.floor(sorted.length / 2)] * 100) / 100
      : null;
    const mean = pcts.length
      ? Math.round((pcts.reduce((sum, value) => sum + value, 0) / pcts.length) * 100) / 100
      : null;

    const divergence = [];
    const addDivergence = (name, sourceMs, localMs) => {
      if (sourceMs == null || localMs == null) return;
      divergence.push({
        signal: name,
        sourceMs: Math.round(sourceMs),
        localMs: Math.round(localMs),
        deltaMs: Math.round(localMs - sourceMs),
      });
    };
    for (const signal of [
      "scoreChangeMs",
      "turn2Ms",
      "turn3Ms",
      "metricSwitchMs",
      "campaignChangeMs",
      "counterChangeMs",
      "roundChangeMs",
      "cacChangeMs",
      "toneFlipMs",
      "groundSettleMs",
    ]) {
      addDivergence(signal, sourceSignals[signal], localSignals[signal]);
    }
    if (sourceSignals.speed && localSignals.speed) {
      addDivergence("marqueeSpeedPxPerSec", sourceSignals.speed.pxPerSec, localSignals.speed.pxPerSec);
    }

    const artifacts = {};
    if (best) {
      const bestPng = path.join(dir, `${scene}-${width}-best.png`);
      const sourcePng = path.join(dir, `${scene}-${width}-best-source.png`);
      const localPng = path.join(dir, `${scene}-${width}-best-local.png`);
      await sharp(best.compared.diffBuffer, {
        raw: { width: best.compared.width, height: best.compared.height, channels: 4 },
      })
        .png({ compressionLevel: 6 })
        .toFile(bestPng);
      await sharp(best.compared.sourceCrop, {
        raw: { width: best.compared.width, height: best.compared.height, channels: 4 },
      })
        .png()
        .toFile(sourcePng);
      await sharp(best.compared.localCrop, {
        raw: { width: best.compared.width, height: best.compared.height, channels: 4 },
      })
        .png()
        .toFile(localPng);
      artifacts.bestDiff = path.relative(process.cwd(), bestPng);
      artifacts.bestSource = path.relative(process.cwd(), sourcePng);
      artifacts.bestLocal = path.relative(process.cwd(), localPng);
    }

    const compactFrames = (frames, signals) =>
      frames.map((frame) => ({
        targetMs: frame.targetMs,
        elapsedMs: frame.elapsedMs,
        visualMs: frame.visualMs,
        markers: frame.markers,
      }));

    result = {
      ...result,
      source: {
        url: sourceSide.url,
        status: sourceSide.status,
        consoleErrors: sourceSide.consoleErrors.slice(0, 10),
        badResponses: sourceSide.badResponses.slice(0, 10),
        entry: {
          target: source.entry.target,
          park: source.entry.park,
          clip: source.clip,
          anchor: source.entry.anchor ?? null,
          anchorMode: source.entry.anchorMode ?? "entry",
          campaign: source.entry.campaign ?? null,
          boundary: source.entry.info?.boundary ?? null,
        },
        signals: sourceSignals,
        frames: compactFrames(source.frames),
      },
      local: {
        url: localSide.url,
        status: localSide.status,
        consoleErrors: localSide.consoleErrors.slice(0, 10),
        badResponses: localSide.badResponses.slice(0, 10),
        entry: {
          target: local.entry.target,
          park: local.entry.park,
          clip: local.clip,
          anchor: local.entry.anchor ?? null,
          anchorMode: local.entry.anchorMode ?? "entry",
          campaign: local.entry.campaign ?? null,
          boundary: local.entry.info?.boundary ?? null,
        },
        signals: localSignals,
        frames: compactFrames(local.frames),
      },
      alignment: {
        basis: "midpoint of pre/post screenshot timestamps",
        windowMs,
        pairs: alignments,
        best: best
          ? {
              diffPct: best.diffPct,
              deltaMs: best.deltaMs,
              sourceTargetMs: best.sourceTargetMs,
              sourceElapsedMs: best.sourceElapsedMs,
              localTargetMs: best.localTargetMs,
              localElapsedMs: best.localElapsedMs,
              width: best.compared.width,
              height: best.compared.height,
            }
          : null,
        medianBestDiffPct: median,
        meanBestDiffPct: mean,
      },
      timingDivergence: divergence,
      artifacts,
    };
  } catch (error) {
    result.error = String(error?.stack ?? error).slice(0, 2000);
  } finally {
    await sourceSide.context.close().catch(() => {});
    await localSide.context.close().catch(() => {});
  }

  result.timings = { totalMs: Date.now() - started };
  const jsonPath = path.join(dir, `${scene}-${width}.json`);
  result.artifacts = { ...(result.artifacts ?? {}), json: path.relative(process.cwd(), jsonPath) };
  await fs.writeFile(jsonPath, JSON.stringify(result, null, 2));
  return result;
}

function parseArgs(argv) {
  const options = {
    scenes: [...Object.keys(SCENES)],
    route: "/",
    widths: [1568],
    outDir: DEFAULT_OUT,
    windowMs: DEFAULT_WINDOW,
    keepFrames: false,
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
    if (arg === "--scene") {
      const value = next();
      options.scenes = value === "all" ? [...Object.keys(SCENES)] : value.split(",");
    } else if (arg === "--route") options.route = next();
    else if (arg === "--width") options.widths = [Number(next())];
    else if (arg === "--widths") options.widths = next().split(",").map(Number);
    else if (arg === "--out") options.outDir = next();
    else if (arg === "--window") options.windowMs = Number(next());
    else if (arg === "--timeout") options.timeout = Number(next());
    else if (arg === "--samples") {
      const values = next().split(",").map(Number).filter(Number.isFinite);
      if (values.length) {
        for (const scene of options.scenes) SCENES[scene].offsets = values;
      }
    } else if (arg === "--keep-frames") options.keepFrames = true;
    else if (arg === "--quiet") options.quiet = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: node scripts/compare-motion.mjs --scene all --width 1568 [--route /] [--widths 1568,390] [--window 400] [--keep-frames]",
      );
      process.exit(0);
    } else if (!arg.startsWith("-")) positional.push(arg);
    else throw new Error(`Unknown flag: ${arg}`);
  }
  if (positional[0]) options.scenes = [positional[0]];
  if (positional[1]) options.widths = [Number(positional[1])];
  const unknown = options.scenes.filter((scene) => !SCENES[scene]);
  if (unknown.length) throw new Error(`Unknown scene(s): ${unknown.join(", ")}`);
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const browser = await launchBrowser();
  const summaries = [];
  try {
    for (const width of options.widths) {
      for (const scene of options.scenes) {
        let result;
        try {
          result = await runScene(browser, {
            scene,
            route: options.route,
            width,
            outDir: options.outDir,
            windowMs: options.windowMs,
            keepFrames: options.keepFrames,
            timeout: options.timeout,
          });
        } catch (error) {
          result = {
            generatedAt: new Date().toISOString(),
            scene,
            route: options.route,
            width,
            viewportHeight: VIEWPORT_HEIGHT,
            alignmentWindowMs: options.windowMs,
            error: String(error?.stack ?? error).slice(0, 2000),
            alignment: null,
            timingDivergence: [],
            artifacts: {},
          };
          const dir = path.resolve(options.outDir, "motion");
          await fs.mkdir(dir, { recursive: true });
          const jsonPath = path.join(dir, `${scene}-${width}.json`);
          result.artifacts = { json: path.relative(process.cwd(), jsonPath) };
          await fs.writeFile(jsonPath, JSON.stringify(result, null, 2));
        }
        summaries.push(result);
        if (!options.quiet) {
          if (result.error) {
            console.log(`${scene.padEnd(16)} ${String(width).padStart(4)}  ERROR ${result.error.split("\n")[0]}`);
          } else {
            console.log(
              [
                scene.padEnd(16),
                String(width).padStart(4),
                `best ${String(result.alignment.best?.diffPct ?? "?").padStart(6)}%`,
                `median ${String(result.alignment.medianBestDiffPct ?? "?").padStart(6)}%`,
                `bestDelta ${String(result.alignment.best?.deltaMs ?? "?").padStart(5)}ms`,
                `${Math.round(result.timings.totalMs / 1000)}s`,
              ].join("  "),
            );
          }
        }
      }
    }
  } finally {
    await browser.close();
  }
  const indexPath = path.resolve(options.outDir, "motion", "summary.json");
  await fs.mkdir(path.dirname(indexPath), { recursive: true });
  let existing = [];
  try {
    existing = JSON.parse(await fs.readFile(indexPath, "utf8"));
  } catch {
    existing = [];
  }
  const merged = new Map(
    (Array.isArray(existing) ? existing : []).map((entry) => [`${entry.scene}:${entry.width}`, entry]),
  );
  for (const result of summaries) {
    merged.set(`${result.scene}:${result.width}`, {
      scene: result.scene,
      width: result.width,
      error: result.error ?? null,
      best: result.alignment?.best ?? null,
      medianBestDiffPct: result.alignment?.medianBestDiffPct ?? null,
      timingDivergence: result.timingDivergence ?? [],
      sourceSignals: result.source?.signals ?? null,
      localSignals: result.local?.signals ?? null,
      artifacts: result.artifacts ?? {},
    });
  }
  await fs.writeFile(
    indexPath,
    JSON.stringify(
      [...merged.values()].sort((a, b) => a.width - b.width || a.scene.localeCompare(b.scene)),
      null,
      2,
    ),
  );
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
