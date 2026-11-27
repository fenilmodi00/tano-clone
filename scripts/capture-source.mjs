/**
 * Capture evidence from the live Tano site for the local clone.
 *
 * Usage: node scripts/capture-source.mjs [route ...]
 * Writes docs/research/tano/<slug>/page.html, page.png, mobile.png, page.json
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://www.tano.ai";
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "/",
      "/use-cases/drive-revenue",
      "/use-cases/creative-velocity",
      "/case-studies",
      "/case-studies/papier",
      "/for-creators",
      "/talk-to-us",
      "/guides",
      "/compare",
      "/playbooks",
      "/webinars",
      "/careers",
      "/news",
      "/privacy-policy",
    ];

const OUT = path.resolve("docs/research/tano");

const slug = (route) =>
  route === "/" ? "home" : route.replace(/^\//, "").replace(/[\/?&=#]+/g, "-");

const measure = () => {
  const pick = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      cls: el.className?.baseVal ?? el.className ?? "",
      text: (el.textContent || "").trim().slice(0, 400),
      rect: (() => {
        const r = el.getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y + scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      })(),
      font: `${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      background: cs.backgroundColor,
      padding: cs.padding,
      margin: cs.margin,
      gap: cs.gap,
      display: cs.display,
      borderRadius: cs.borderRadius,
      position: cs.position,
    };
  };

  const main = document.querySelector("main");
  const sections = [...(main?.children ?? [])].map((el) => {
    const s = pick(el);
    const heads = [...el.querySelectorAll("h1,h2,h3")].slice(0, 4).map(pick);
    const paras = [...el.querySelectorAll("p")].slice(0, 3).map(pick);
    return { ...s, heads, paras };
  });

  const imgs = [...document.querySelectorAll("img")].map((img) => ({
    src: img.currentSrc || img.src,
    srcset: img.srcset,
    alt: img.alt,
    natural: [img.naturalWidth, img.naturalHeight],
    rect: pick(img)?.rect,
    fit: getComputedStyle(img).objectFit,
    radius: getComputedStyle(img).borderRadius,
  }));

  const videos = [...document.querySelectorAll("video")].map((v) => ({
    src: v.currentSrc || v.src,
    poster: v.poster,
    autoplay: v.autoplay,
    loop: v.loop,
    muted: v.muted,
    playsInline: v.playsInline,
    sources: [...v.querySelectorAll("source")].map((s) => ({
      src: s.src,
      type: s.type,
    })),
    rect: pick(v)?.rect,
  }));

  const fonts = [...document.fonts].map((f) => ({
    family: f.family,
    weight: f.weight,
    style: f.style,
    status: f.status,
  }));

  const root = getComputedStyle(document.documentElement);
  const vars = {};
  for (const name of root) {
    if (name.startsWith("--") && vars[name] === undefined)
      vars[name] = root.getPropertyValue(name).trim();
  }
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    const walk = (list) => {
      for (const rule of list) {
        if (rule.cssRules) walk(rule.cssRules);
        if (rule.style) {
          for (const name of rule.style) {
            if (name.startsWith("--") && !vars[name])
              vars[name] = rule.style.getPropertyValue(name).trim();
          }
        }
      }
    };
    walk(rules);
  }

  const nav = document.querySelector("header");
  const footer = document.querySelector("footer");

  return {
    title: document.title,
    url: location.href,
    viewport: { w: innerWidth, h: innerHeight },
    bodyHeight: document.body.scrollHeight,
    sections,
    imgs,
    videos,
    fonts,
    vars,
    navHTML: nav?.outerHTML ?? "",
    footerHTML: footer?.outerHTML ?? "",
    bodyClass: document.body.className,
    mainHTML: main?.outerHTML ?? "",
  };
};

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1568, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const seen = new Set();
  for (const route of ROUTES) {
    const dir = path.join(OUT, slug(route));
    await fs.mkdir(dir, { recursive: true });
    const page = await context.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") console.log(`[${route}] console:`, m.text().slice(0, 160));
    });
    try {
      await page.goto(ORIGIN + route, { waitUntil: "networkidle", timeout: 90_000 });
    } catch (err) {
      console.log(`[${route}] goto:`, err.message);
      await page
        .goto(ORIGIN + route, { waitUntil: "domcontentloaded", timeout: 90_000 })
        .catch(() => {});
    }
    await page.evaluate(async () => {
      await document.fonts.ready;
      // Trigger lazy media and reveal animations by walking the page.
      const step = innerHeight * 0.75;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });
    await page.waitForTimeout(1200);

    const data = await page.evaluate(measure);
    await fs.writeFile(path.join(dir, "page.json"), JSON.stringify(data, null, 2));
    await fs.writeFile(path.join(dir, "page.html"), await page.content());
    await page.screenshot({ path: path.join(dir, "page.png"), fullPage: true });
    await page.screenshot({ path: path.join(dir, "fold.png"), fullPage: false });

    // Mobile pass
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(900);
    await page.evaluate(async () => {
      const step = innerHeight * 0.75;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
      scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    await page.screenshot({ path: path.join(dir, "mobile.png"), fullPage: true });
    console.log(`[${route}] ${data.sections.length} sections, ${data.imgs.length} images`);

    for (const img of data.imgs) if (img.src) seen.add(img.src);
    for (const v of data.videos) {
      if (v.src) seen.add(v.src);
      if (v.poster) seen.add(v.poster);
    }
    await page.close();
  }
  await fs.writeFile(path.join(OUT, "assets.json"), JSON.stringify([...seen].sort(), null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
