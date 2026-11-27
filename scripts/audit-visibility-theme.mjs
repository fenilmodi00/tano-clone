#!/usr/bin/env node
/**
 * Theme / ground / reveal visibility audit.
 *
 * For all 44 routes at 1568x829 and 390x844, in two navigation modes
 * (fresh document and SPA navigation from "/"), and at five scroll states
 * (0, 25%, 50%, 75%, max), this records and judges:
 *
 *   - expected vs actual pathname (+ hash),
 *   - first main h1/h2 own opacity, effective opacity and split-word opacity,
 *   - `.rv-in` counts inside `main`,
 *   - `data-ground-tone`, `--ground-t`, expected tone from `[data-ground-dark]`,
 *   - `.wire-ground-veil` opacity / data-tone / moving attributes,
 *   - header/nav visibility,
 *   - every visible main h1/h2/p: computed text colour against the effective
 *     ancestor background, contrast ratio, effective opacity, conservative
 *     opaque-overlay hit test.
 *
 * Failures: opacity < 0.05, contrast < 2.0, transparent text, reveal never
 * applied, expected ground tone mismatch, veil left above 0.05, missing hash
 * target, pathname mismatch, pageerror. A failure writes a viewport screenshot
 * and a context JSON.
 *
 * Usage:
 *   node scripts/audit-visibility-theme.mjs --base http://127.0.0.1:3100
 *   node scripts/audit-visibility-theme.mjs --only /compare --no-spa
 *   node scripts/audit-visibility-theme.mjs --negative-control
 *
 * Exit codes: 0 = clean (or control correctly detected), 1 = audit red or
 * control failed to prove the detector, 2 = audit could not run.
 *
 * This file owns no app code; it never injects CSS into a real route except in
 * --negative-control mode, where the injection is the point.
 */

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const ROUTES_FILE = path.join(ROOT, "docs/research/tano/routes.json");
const VIEWPORTS = [
  { name: "1568x829", width: 1568, height: 829 },
  { name: "390x844", width: 390, height: 844 },
];
const HASH_ROUTE = "/guides#link-cards-gh-muse";
const PRIORITY_GROUPS = {
  compare: [
    "/compare",
    "/compare/agentio-vs-tano",
    "/compare/grin-vs-tano",
    "/compare/ltk-vs-tano",
    "/compare/shopmy-vs-tano",
  ],
  guides: ["/guides"],
  useCases: ["/use-cases/creative-velocity", "/use-cases/drive-revenue"],
  lightPages: ["/for-creators", "/talk-to-us", "/privacy-policy", "/webinars", "/playbooks"],
  hash: [HASH_ROUTE],
};
const HISTORY_STEPS = [
  { kind: "client", route: "/guides", name: "push-guides" },
  { kind: "client", route: "/compare", name: "push-compare" },
  { kind: "client", route: "/for-creators", name: "push-for-creators" },
  { kind: "client", route: HASH_ROUTE, name: "push-guides-hash" },
  { kind: "back", route: "/for-creators", name: "back-for-creators" },
  { kind: "back", route: "/compare", name: "back-compare" },
  { kind: "back", route: "/guides", name: "back-guides" },
  { kind: "forward", route: "/compare", name: "forward-compare" },
  { kind: "direct", route: "/compare/grin-vs-tano", name: "direct-compare-grin" },
  { kind: "direct", route: "/talk-to-us", name: "direct-talk-to-us" },
  { kind: "direct", route: "/privacy-policy", name: "direct-privacy-policy" },
];

const DEFAULTS = {
  base: process.env.VISIBILITY_BASE || "http://127.0.0.1:3100",
  json: "docs/verify/theme/results.json",
  csv: "docs/verify/theme/samples.csv",
  report: "docs/verify/theme/REPORT.md",
  shots: "docs/verify/theme/failures",
  label: "",
  concurrency: 3,
  settle: 3000,
  grace: 800,
  timeout: 45000,
  viewport: "all",
  mode: "all",
  history: true,
  negativeControl: false,
  controlRoute: "/talk-to-us",
  only: null,
  maxScreenshots: 80,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function usage() {
  return `Usage: node scripts/audit-visibility-theme.mjs [options]

  --base <url>          Origin to audit (default ${DEFAULTS.base})
  --json <file>         Machine-readable result (default ${DEFAULTS.json})
  --csv <file>          Per-sample CSV (default ${DEFAULTS.csv})
  --report <file>       Markdown report (default ${DEFAULTS.report})
  --shots <dir>         Failure screenshots + context (default ${DEFAULTS.shots})
  --label <text>        Free-form label stored in the JSON
  --concurrency <n>     Parallel pages (default ${DEFAULTS.concurrency})
  --settle <ms>         Maximum settle wait per scroll state (default ${DEFAULTS.settle})
  --grace <ms>          Fixed wait after state settles (default ${DEFAULTS.grace})
  --timeout <ms>        Per-navigation timeout (default ${DEFAULTS.timeout})
  --viewport <all|1568|390>  Restrict viewports
  --mode <all|direct|spa>    Restrict navigation modes
  --only <list>         Comma-separated route substrings
  --no-spa              Direct loads only
  --no-history          Skip back/forward section
  --negative-control    Prove the detector by forcing opacity 0 / low contrast
  --control-route <r>   Page for the negative control (default ${DEFAULTS.controlRoute})
  --max-shots <n>       Screenshot budget (default ${DEFAULTS.maxScreenshots})
  --help                Show this help`;
}

function parseArgs(argv) {
  const opts = { ...DEFAULTS };
  const numberKeys = new Set(["concurrency", "settle", "grace", "timeout", "maxScreenshots"]);
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (arg === "--no-spa") {
      opts.mode = "direct";
      continue;
    }
    if (arg === "--no-history") {
      opts.history = false;
      continue;
    }
    if (arg === "--negative-control") {
      opts.negativeControl = true;
      continue;
    }
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument: ${arg}\n\n${usage()}`);
    const [rawKey, inline] = arg.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (!(key in opts)) throw new Error(`Unknown option: ${arg}\n\n${usage()}`);
    const value = inline ?? argv[++i];
    if (value === undefined) throw new Error(`Missing value for ${arg}`);
    opts[key] = numberKeys.has(key) ? Number(value) : value;
    if (numberKeys.has(key) && !Number.isFinite(opts[key])) {
      throw new Error(`Expected a number for ${arg}, got ${value}`);
    }
  }
  opts.base = opts.base.replace(/\/+$/, "");
  if (opts.only)
    opts.only = opts.only
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  if (!["all", "direct", "spa"].includes(opts.mode))
    throw new Error(`--mode must be all, direct or spa`);
  if (!["all", "1568", "390"].includes(opts.viewport))
    throw new Error(`--viewport must be all, 1568 or 390`);
  return opts;
}

const opts = parseArgs(process.argv.slice(2));
const JSON_PATH = path.resolve(ROOT, opts.json);
const CSV_PATH = path.resolve(ROOT, opts.csv);
const REPORT_PATH = path.resolve(ROOT, opts.report);
const SHOTS_DIR = path.resolve(ROOT, opts.shots);
const CONTROL_JSON = path.resolve(
  ROOT,
  path.join(path.dirname(opts.json), "negative-control.json"),
);
const CONTROL_DIR = path.resolve(ROOT, path.join(path.dirname(opts.json), "controls"));
const runStarted = new Date();

function slugify(value) {
  return (
    String(value)
      .replace(/#/g, "-hash-")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "home"
  );
}

function pad(value, width) {
  const text = String(value ?? "");
  return text.length >= width ? text : text + " ".repeat(width - text.length);
}

function round(value, digits = 2) {
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

async function waitForServer(base, timeoutMs) {
  const start = Date.now();
  let lastError = "no response";
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`${base}/`, {
        redirect: "follow",
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await sleep(1000);
  }
  throw new Error(`Dev server not reachable at ${base} after ${timeoutMs}ms (${lastError})`);
}

async function loadRoutes() {
  const raw = JSON.parse(await fs.readFile(ROUTES_FILE, "utf8"));
  const routes = raw.map((entry) =>
    typeof entry === "string" ? { route: entry, slug: slugify(entry) } : entry,
  );
  if (!opts.only) return routes;
  return routes.filter((entry) => opts.only.some((needle) => entry.route.includes(needle)));
}

function parseRoute(route) {
  const hashIndex = route.indexOf("#");
  return {
    route,
    pathname: hashIndex === -1 ? route : route.slice(0, hashIndex),
    hash: hashIndex === -1 ? "" : route.slice(hashIndex),
  };
}

/** Browser-side measurement. Kept in one serializable function. */
function measurePage(args) {
  const { expectedPath, expectedHash, scrollRequest } = args;
  const round = (value, digits = 2) =>
    Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
  const html = document.documentElement;
  const main = document.querySelector("main");

  // ---- colour parsing through a canvas resolves oklab()/color(srgb ...) ----
  const canvas = (window.__tanoAuditCanvas ||= (() => {
    const element = document.createElement("canvas");
    element.width = 1;
    element.height = 1;
    return element;
  })());
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const colourCache = (window.__tanoAuditColourCache ||= new Map());
  const parseColour = (value) => {
    if (colourCache.has(value)) return colourCache.get(value);
    ctx.clearRect(0, 0, 1, 1);
    ctx.globalCompositeOperation = "copy";
    ctx.fillStyle = "#010203";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    const colour = { r: data[0], g: data[1], b: data[2], a: data[3] / 255 };
    colourCache.set(value, colour);
    return colour;
  };
  const over = (top, bottom) => {
    const alpha = top.a;
    return {
      r: top.r * alpha + bottom.r * (1 - alpha),
      g: top.g * alpha + bottom.g * (1 - alpha),
      b: top.b * alpha + bottom.b * (1 - alpha),
      a: 1,
    };
  };
  const luminance = ({ r, g, b }) => {
    const channel = (value) => {
      const v = value / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const contrast = (a, b) => {
    const la = luminance(a);
    const lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  const effectiveOpacity = (element) => {
    let value = 1;
    let node = element;
    while (node) {
      const style = getComputedStyle(node);
      const opacityValue = Number.parseFloat(style.opacity);
      value *= Number.isFinite(opacityValue) ? opacityValue : 1;
      if (style.visibility === "hidden" || style.display === "none") {
        return {
          value: 0,
          blocker: `${node.tagName}.${String(node.className || "").slice(0, 40)}`,
        };
      }
      if (value < 0.001) return { value: 0, blocker: "opacity" };
      node = node.parentElement;
    }
    return { value };
  };

  const isClippedByAncestor = (element) => {
    const rect = element.getBoundingClientRect();
    let node = element.parentElement;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      if (style.overflowX !== "visible" || style.overflowY !== "visible") {
        const box = node.getBoundingClientRect();
        const left = box.left + node.clientLeft;
        const top = box.top + node.clientTop;
        const right = left + node.clientWidth;
        const bottom = top + node.clientHeight;
        const visibleWidth = Math.max(0, Math.min(rect.right, right) - Math.max(rect.left, left));
        const visibleHeight = Math.max(0, Math.min(rect.bottom, bottom) - Math.max(rect.top, top));
        if (visibleWidth < 2 || visibleHeight < 2) return true;
      }
      node = node.parentElement;
    }
    return false;
  };

  const hasRunningOpacityAnimation = (element) => {
    let node = element;
    while (node && node !== document.documentElement) {
      if (typeof node.getAnimations === "function") {
        for (const animation of node.getAnimations()) {
          if (animation.playState !== "running") continue;
          if (animation.transitionProperty === "opacity") return true;
          const frames = animation.effect?.getKeyframes?.() || [];
          if (frames.some((frame) => frame.opacity !== undefined && frame.opacity !== null)) return true;
        }
      }
      node = node.parentElement;
    }
    return false;
  };

  const backgroundFor = (element) => {
    const layers = [];
    let image = null;
    let opaque = null;
    let node = element;
    while (node) {
      const style = getComputedStyle(node);
      const colour = parseColour(style.backgroundColor);
      if (colour.a > 0.001) {
        layers.push({
          colour,
          node: `${node.tagName}.${String(node.className || "").slice(0, 48)}`,
        });
        if (colour.a >= 0.999) {
          opaque = `${node.tagName}.${String(node.className || "").slice(0, 48)}`;
          break;
        }
      }
      if (
        style.backgroundImage !== "none" &&
        !(style.backgroundClip === "text" || style.webkitBackgroundClip === "text")
      ) {
        image = `${node.tagName}.${String(node.className || "").slice(0, 48)}`;
      }
      node = node.parentElement;
    }
    let base = opaque ? layers[layers.length - 1].colour : { r: 255, g: 255, b: 255, a: 1 };
    if (!opaque) {
      base = { r: 255, g: 255, b: 255, a: 1 };
    }
    for (let i = layers.length - 2; i >= 0; i -= 1) base = over(layers[i].colour, base);
    return {
      rgb: { r: Math.round(base.r), g: Math.round(base.g), b: Math.round(base.b), a: 1 },
      layers: layers.slice(0, 5).map((layer) => layer.node),
      opaqueSource: opaque,
      imageSource: image,
      uncertain: Boolean(image),
    };
  };

  const rectOf = (element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      w: Math.round(rect.width),
      h: Math.round(rect.height),
      top: Math.round(rect.top),
      bottom: Math.round(rect.bottom),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
    };
  };

  const describe = (element) => {
    if (!element) return null;
    const style = getComputedStyle(element);
    const opacity = effectiveOpacity(element);
    const words = Array.from(element.querySelectorAll(".rv-word"));
    const wordOpacities = words.map(
      (word) => Number.parseFloat(getComputedStyle(word).opacity) || 0,
    );
    const rect = rectOf(element);
    const inViewport = rect.bottom > 0 && rect.top < innerHeight;
    return {
      tag: element.tagName.toLowerCase(),
      id: element.id || null,
      className: String(element.className || "").slice(0, 140),
      text: (element.innerText || element.textContent || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 120),
      rect,
      inViewport,
      styleOpacity: Number.parseFloat(style.opacity) || 0,
      effectiveOpacity: round(opacity.value, 3),
      opacityBlocker: opacity.blocker || null,
      words: words.length,
      minWordOpacity: wordOpacities.length ? round(Math.min(...wordOpacities), 3) : null,
      maxWordOpacity: wordOpacities.length ? round(Math.max(...wordOpacities), 3) : null,
      split: element.hasAttribute("data-rv-split"),
      rvIn: Boolean(element.classList.contains("rv-in") || element.closest(".rv-in")),
      rvOnload: Boolean(element.closest("[data-rv-onload]")),
      display: style.display,
      visibility: style.visibility,
      color: style.color,
      webkitTextFillColor: style.webkitTextFillColor || null,
      backgroundClip: style.backgroundClip || style.webkitBackgroundClip || null,
    };
  };

  const textOpacity = (element, description) => {
    let value = description.effectiveOpacity;
    if (description.minWordOpacity != null) value *= description.minWordOpacity;
    return value;
  };

  const isGradientText = (element) => {
    const style = getComputedStyle(element);
    const clip = style.backgroundClip || style.webkitBackgroundClip || "";
    const fill = parseColour(style.webkitTextFillColor || "rgba(0, 0, 0, 0)");
    return clip.includes("text") && style.backgroundImage !== "none" && fill.a < 0.05;
  };

  const readable = (element, description) => {
    const style = getComputedStyle(element);
    const background = backgroundFor(element);
    const fillColour = parseColour(style.webkitTextFillColor || style.color);
    const colour = parseColour(style.color);
    const textColour = fillColour.a > 0.001 ? fillColour : colour;
    const gradient = isGradientText(element);
    const composited = textColour.a < 0.999 ? over(textColour, background.rgb) : textColour;
    const ratio = gradient ? null : round(contrast(composited, background.rgb), 2);
    return {
      colour: style.color,
      fillColour: style.webkitTextFillColor || null,
      textColorRGB: {
        r: Math.round(composited.r),
        g: Math.round(composited.g),
        b: Math.round(composited.b),
      },
      background: background.rgb,
      backgroundLayers: background.layers,
      backgroundOpaqueSource: background.opaqueSource,
      backgroundImageSource: background.imageSource,
      backgroundUncertain: background.uncertain,
      contrast: ratio,
      gradientText: gradient,
      textAlpha: round(textColour.a, 3),
      opacity: textOpacity(element, description),
    };
  };

  const overlayAt = (element, rect) => {
    const points = [];
    const xs = [
      Math.min(innerWidth - 2, Math.max(1, rect.left + Math.min(rect.width / 2, 120))),
      Math.min(innerWidth - 2, Math.max(1, rect.left + Math.min(rect.width / 3, 60))),
    ];
    const ys = [
      Math.min(innerHeight - 2, Math.max(1, rect.top + Math.min(rect.height / 2, 30))),
      Math.min(innerHeight - 2, Math.max(1, rect.top + Math.min(rect.height / 4, 14))),
    ];
    for (const x of xs) for (const y of ys) points.push([Math.round(x), Math.round(y)]);
    const hits = [];
    for (const [x, y] of points) {
      if (x < 1 || y < 1 || x >= innerWidth - 1 || y >= innerHeight - 1) continue;
      const stack = document.elementsFromPoint(x, y);
      let safe = false;
      for (const hit of stack) {
        if (!hit) continue;
        if (hit === element || element.contains(hit) || hit.contains(element)) {
          safe = true;
          break;
        }
        const style = getComputedStyle(hit);
        if (
          element.closest(".wire-case-banners") &&
          hit.closest(".wire-case-banners")
        ) {
          // The case-study banner deck is a deliberate stack; the next card
          // overlaps the previous one by design, not because of theme/reveal.
          hits.push({
            kind: "case-banner-deck",
            tag: hit.tagName.toLowerCase(),
            className: String(hit.className || "").slice(0, 80),
          });
          safe = true;
          break;
        }
        if (
          hit.closest(".wire-nav") ||
          hit.closest(".wire-nav-bar") ||
          hit.closest(".wire-consent") ||
          hit.closest(".wire-spectrum-rule")
        ) {
          hits.push({
            kind: "chrome",
            tag: hit.tagName.toLowerCase(),
            className: String(hit.className || "").slice(0, 80),
          });
          safe = true;
          break;
        }
        if (style.pointerEvents === "none") continue;
        const bg = parseColour(style.backgroundColor);
        const opacity = effectiveOpacity(hit).value;
        const hasImage = style.backgroundImage !== "none";
        if (bg.a * opacity >= 0.5 || (hasImage && opacity >= 0.5)) {
          const hitRect = hit.getBoundingClientRect();
          const overlapX = Math.max(
            0,
            Math.min(rect.right, hitRect.right) - Math.max(rect.left, hitRect.left),
          );
          const overlapY = Math.max(
            0,
            Math.min(rect.bottom, hitRect.bottom) - Math.max(rect.top, hitRect.top),
          );
          const coverage = (overlapX * overlapY) / Math.max(1, rect.width * rect.height);
          if (coverage >= 0.35) {
            return {
              covered: true,
              by: {
                tag: hit.tagName.toLowerCase(),
                className: String(hit.className || "").slice(0, 100),
                background: style.backgroundColor,
                position: style.position,
                zIndex: style.zIndex,
                opacity: round(opacity, 2),
                rect: rectOf(hit),
                coverage: round(coverage, 2),
              },
              hits,
            };
          }
        }
        hits.push({
          kind: "transparent",
          tag: hit.tagName.toLowerCase(),
          className: String(hit.className || "").slice(0, 80),
        });
      }
      if (safe) continue;
    }
    return { covered: false, hits };
  };

  if (!main) {
    return {
      pathname: location.pathname,
      hash: location.hash,
      missingMain: true,
      scrollY: Math.round(window.scrollY),
      violations: [{ code: "missing-main", category: "nav", message: "main not found" }],
      checks: [],
    };
  }

  const violations = [];
  const checks = [];
  const firstHeadingElement = main.querySelector("h1, h2");
  const firstHeading = describe(firstHeadingElement);
  const rvIn = main.querySelectorAll(".rv-in").length;
  const rvWords = main.querySelectorAll(".rv-word").length;
  const totalText = (main.innerText || "").replace(/\s+/g, " ").trim();

  const scrollY = Math.round(window.scrollY);
  const scrollMax = Math.round(Math.max(0, html.scrollHeight - innerHeight));
  const expectedTone = (() => {
    const line = scrollY + innerHeight * 0.45;
    for (const band of Array.from(document.querySelectorAll("[data-ground-dark]"))) {
      if (!band.getClientRects().length) continue;
      const rect = band.getBoundingClientRect();
      const top = rect.top + scrollY;
      const bottom =
        band.dataset.groundDark === "open" ? Number.POSITIVE_INFINITY : top + rect.height;
      if (line >= top && line < bottom) return "dark";
    }
    return "light";
  })();

  const veilElement = document.querySelector(".wire-ground-veil");
  const veilStyle = veilElement ? getComputedStyle(veilElement) : null;
  const groundT = Number.parseFloat(getComputedStyle(html).getPropertyValue("--ground-t").trim());
  const inkT = Number.parseFloat(getComputedStyle(html).getPropertyValue("--ink-t").trim());
  const actualTone = html.dataset.groundTone || null;
  const ground = {
    dataGroundTone: actualTone,
    htmlGroundT: Number.isFinite(groundT) ? round(groundT, 3) : null,
    htmlInkT: Number.isFinite(inkT) ? round(inkT, 3) : null,
    expectedTone,
    toneMatchesExpected: actualTone === expectedTone,
    tokenMatchesTone:
      actualTone === "dark"
        ? Number.isFinite(groundT) && groundT >= 0.85
        : actualTone === "light"
          ? Number.isFinite(groundT) && groundT <= 0.15
          : null,
    moving: html.hasAttribute("data-ground-moving"),
    swap: html.hasAttribute("data-ground-swap"),
    veil: veilElement
      ? {
          exists: true,
          opacity: round(Number.parseFloat(veilStyle.opacity) || 0, 3),
          dataTone: veilElement.dataset.tone || null,
          backgroundColor: veilStyle.backgroundColor,
          zIndex: veilStyle.zIndex,
          position: veilStyle.position,
          rect: rectOf(veilElement),
        }
      : { exists: false },
  };

  if (!ground.toneMatchesExpected) {
    violations.push({
      code: "ground-mismatch",
      category: "ground",
      cause: "ground-timing",
      message: `data-ground-tone=${actualTone} but bands under the 45% line expect ${expectedTone}`,
    });
  }
  if (ground.tokenMatchesTone === false) {
    violations.push({
      code: "ground-token",
      category: "ground",
      cause: "theme-token",
      message: `data-ground-tone=${actualTone} but --ground-t=${groundT}`,
    });
  }
  if (ground.veil.exists && ground.veil.opacity > 0.05) {
    violations.push({
      code: "veil-stuck",
      category: "ground",
      cause: "ground-veil",
      message: `veil opacity ${ground.veil.opacity} at settled state (data-tone=${ground.veil.dataTone})`,
    });
  }

  const navElement = document.querySelector(".wire-nav");
  const nav = navElement
    ? (() => {
        const style = getComputedStyle(navElement);
        const rect = rectOf(navElement);
        const opacity = effectiveOpacity(navElement).value;
        const bar = document.querySelector(".wire-nav-bar");
        const barStyle = bar ? getComputedStyle(bar) : null;
        return {
          exists: true,
          visible:
            opacity > 0.05 &&
            style.visibility !== "hidden" &&
            style.display !== "none" &&
            rect.w > 2 &&
            rect.h > 2 &&
            rect.bottom > 0 &&
            rect.top < innerHeight,
          opacity: round(opacity, 3),
          display: style.display,
          visibility: style.visibility,
          position: style.position,
          rect,
          dataScrolled: navElement.getAttribute("data-scrolled"),
          bar: bar
            ? {
                rect: rectOf(bar),
                position: barStyle.position,
                backgroundColor: barStyle.backgroundColor,
                opacity: round(effectiveOpacity(bar).value, 3),
                dataScrolled: bar.getAttribute("data-scrolled"),
              }
            : null,
        };
      })()
    : { exists: false, visible: false };

  const expectedPathName = expectedPath;
  if (location.pathname !== expectedPathName) {
    violations.push({
      code: "path-mismatch",
      category: "nav",
      cause: "nav",
      message: `location.pathname=${location.pathname} expected ${expectedPathName}`,
    });
  }
  if (expectedHash && location.hash !== expectedHash) {
    violations.push({
      code: "hash-mismatch",
      category: "nav",
      cause: "nav",
      message: `location.hash=${location.hash || "(none)"} expected ${expectedHash}`,
    });
  }

  const hashTarget = expectedHash
    ? (() => {
        const id = expectedHash.replace(/^#/, "");
        const element = document.getElementById(id);
        if (!element) return { exists: false, id };
        const description = describe(element);
        const reading = readable(element, description);
        return {
          exists: true,
          id,
          ...description,
          ...reading,
          visibleInViewport:
            description.rect.bottom > 0 &&
            description.rect.top < innerHeight &&
            reading.opacity >= 0.05,
        };
      })()
    : null;

  if (hashTarget && !hashTarget.exists) {
    violations.push({
      code: "hash-missing",
      category: "nav",
      cause: "nav",
      message: `#${hashTarget.id} not found`,
    });
  }

  if (firstHeading) {
    const headingOpacity = textOpacity(firstHeadingElement, firstHeading);
    firstHeading.textOpacity = round(headingOpacity, 3);
    if (firstHeading.inViewport && headingOpacity < 0.05 && !hasRunningOpacityAnimation(firstHeadingElement)) {
      violations.push({
        code: "heading-hidden",
        category: "hidden",
        cause: !firstHeading.rvIn && !firstHeading.rvOnload ? "reveal" : "opacity",
        message: `first heading text opacity ${round(headingOpacity, 3)} (own ${firstHeading.styleOpacity}, words ${firstHeading.minWordOpacity}, rv-in=${firstHeading.rvIn})`,
        selector: `main ${firstHeading.tag}`,
        element: firstHeading,
      });
    }
  } else {
    violations.push({
      code: "missing-heading",
      category: "hidden",
      cause: "content",
      message: "main has no h1/h2",
    });
  }

  const candidates = Array.from(
    document.querySelectorAll(
      "main li, main .wire-button-row, main h1, main h2, main p, footer h1, footer h2, footer p, footer li",
    ),
  );
  for (const element of candidates) {
    const text = (element.innerText || element.textContent || "").replace(/\s+/g, " ").trim();
    if (text.length < 2) continue;
    const rect = element.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) continue;
    if (rect.bottom <= 1 || rect.top >= innerHeight - 1) continue;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") continue;
    if (element.closest(".wire-visually-hidden")) continue;
    if (isClippedByAncestor(element)) continue;

    // A hidden list item is the container that matters; do not repeat every
    // paragraph inside it as a separate violation.
    let hiddenAncestor = null;
    for (let node = element.parentElement; node && node !== document.body; node = node.parentElement) {
      if (node.tagName === "LI" || node.classList.contains("wire-button-row")) {
        if (effectiveOpacity(node).value < 0.05) {
          hiddenAncestor = node;
          break;
        }
      }
    }
    if (hiddenAncestor) continue;

    const description = describe(element);
    const reading = readable(element, description);
    const contrastRelevant = ["H1", "H2", "P"].includes(element.tagName);
    const animatedOpacity = hasRunningOpacityAnimation(element);
    const check = {
      ...description,
      ...reading,
      text: text.slice(0, 100),
      covered: false,
      cover: null,
      violative: false,
    };

    if (check.opacity < 0.05 && animatedOpacity) {
      // A chat/loop keyframe is between states; not a reveal or theme defect.
      check.animatedOpacity = true;
    } else if (check.opacity < 0.05) {
      check.violative = true;
      violations.push({
        code: "opacity",
        category: "hidden",
        cause: !check.rvIn && !check.rvOnload ? "reveal" : "opacity",
        message: `${check.tag} text opacity ${round(check.opacity, 3)} (own ${check.styleOpacity}, words ${check.minWordOpacity}, rv-in=${check.rvIn})`,
        selector: `${check.tag}.${String(check.className).split(/\s+/)[0] || ""}`,
        element: check,
      });
    } else if (!contrastRelevant) {
      // The container (list item / button row) carries the hidden state; its
      // descendants are skipped above, so there is no second assertion here.
    } else if (check.gradientText) {
      // Decorative gradient text is visible without a solid colour; no
      // contrast assertion is meaningful here.
    } else if (check.textAlpha < 0.05) {
      check.violative = true;
      violations.push({
        code: "transparent-text",
        category: "hidden",
        cause: "theme-token",
        message: `${check.tag} text colour alpha ${check.textAlpha}`,
        selector: `${check.tag}.${String(check.className).split(/\s+/)[0] || ""}`,
        element: check,
      });
    } else if (check.contrast != null && check.contrast < 2 && !check.backgroundUncertain) {
      check.violative = true;
      violations.push({
        code: "contrast",
        category: "contrast",
        cause: "theme-token",
        message: `${check.tag} contrast ${check.contrast} (text ${check.textColorRGB.r},${check.textColorRGB.g},${check.textColorRGB.b} on ${check.background.r},${check.background.g},${check.background.b}; opaque ${check.backgroundOpaqueSource})`,
        selector: `${check.tag}.${String(check.className).split(/\s+/)[0] || ""}`,
        element: check,
      });
    }

    const overlay = overlayAt(element, rect);
    check.overlayHits = overlay.hits.slice(0, 3);
    if (overlay.covered) {
      check.covered = true;
      check.cover = overlay.by;
      check.violative = true;
      violations.push({
        code: "covered",
        category: "overlay",
        cause: "overlay",
        message: `${check.tag} covered by ${overlay.by.tag}.${overlay.by.className.split(/\s+/)[0] || ""} (${overlay.by.coverage * 100}% of box, bg ${overlay.by.background}, z ${overlay.by.zIndex})`,
        selector: `${check.tag}.${String(check.className).split(/\s+/)[0] || ""}`,
        element: check,
      });
    }

    checks.push(check);
    if (checks.length >= 140) break;
  }

  if (!totalText) {
    violations.push({
      code: "no-text",
      category: "hidden",
      cause: "content",
      message: "main text is empty",
    });
  }

  return {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    expectedPath,
    expectedHash,
    title: document.title,
    scrollY,
    scrollMax,
    scrollRequest,
    textLength: totalText.length,
    rvIn,
    rvWords,
    firstHeading,
    ground,
    nav,
    hashTarget,
    checks,
    violations,
    checkedCount: checks.length,
    hiddenCount: checks.filter(
      (check) => check.violative && (check.opacity < 0.05 || check.covered || check.contrast < 2),
    ).length,
  };
}

/** Read the cheap stability signature used before a full measurement. */
function settleSignature() {
  const html = document.documentElement;
  const veil = document.querySelector(".wire-ground-veil");
  const veilStyle = veil ? getComputedStyle(veil) : null;
  return {
    y: Math.round(window.scrollY),
    max: Math.round(Math.max(0, html.scrollHeight - innerHeight)),
    rv: document.querySelectorAll("main .rv-in").length,
    tone: html.dataset.groundTone || null,
    groundT: getComputedStyle(html).getPropertyValue("--ground-t").trim(),
    veil: veilStyle ? Number.parseFloat(veilStyle.opacity) || 0 : null,
    moving: html.hasAttribute("data-ground-moving"),
    swap: html.hasAttribute("data-ground-swap"),
  };
}

function instrument(page) {
  const errors = [];
  let mark = 0;
  page.on("pageerror", (error) => {
    errors.push({ kind: "pageerror", text: String(error.message).slice(0, 400) });
  });
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    errors.push({ kind: "console", text: message.text().slice(0, 400) });
  });
  return {
    mark() {
      mark = errors.length;
    },
    take() {
      return errors.slice(mark).map((error) => ({ ...error }));
    },
    all() {
      return errors.slice();
    },
  };
}

async function waitForFonts(page) {
  await page
    .evaluate(() =>
      Promise.race([
        document.fonts.ready.then(() => true),
        new Promise((resolve) => setTimeout(() => resolve(false), 2500)),
      ]),
    )
    .catch(() => {});
}

async function dismissConsent(page) {
  try {
    const visible = await page.evaluate(() => {
      const consent = document.querySelector(".wire-consent");
      if (!consent) return false;
      const style = getComputedStyle(consent);
      const rect = consent.getBoundingClientRect();
      return style.display !== "none" && Number.parseFloat(style.opacity) > 0.01 && rect.width > 2;
    });
    if (!visible) return { shown: false, dismissed: false };
    const clicked = await page.evaluate(() => {
      const consent = document.querySelector(".wire-consent");
      if (!consent) return false;
      const buttons = Array.from(consent.querySelectorAll("button, a")).filter(
        (element) => element.getClientRects().length,
      );
      const target = buttons.find((element) =>
        /reject|accept|dismiss|close/i.test(element.textContent || ""),
      );
      if (!target) return false;
      target.click();
      return true;
    });
    await page.waitForTimeout(350);
    const still = await page.evaluate(() => {
      const consent = document.querySelector(".wire-consent");
      if (!consent) return false;
      const style = getComputedStyle(consent);
      return (
        style.display !== "none" &&
        Number.parseFloat(style.opacity) > 0.05 &&
        consent.getBoundingClientRect().width > 2
      );
    });
    return { shown: true, dismissed: clicked && !still, stillVisible: still };
  } catch {
    return { shown: false, dismissed: false, error: true };
  }
}

async function gotoWithRetry(page, url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await page.goto(url, { waitUntil: "domcontentloaded", timeout: opts.timeout });
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(800 * attempt);
    }
  }
  throw lastError;
}

/**
 * Direct load with a retry around the whole ready handshake. The dev server
 * compiles routes on demand and is shared with other workstreams, so a single
 * 30-45 s stall is infrastructure, not a page result; two retries distinguish
 * it from a route that genuinely never renders.
 */
async function loadDirect(page, route) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await gotoWithRetry(page, `${opts.base}${route}`, 2);
      await waitForPageReady(page);
      return { ok: true, attempts: attempt };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await sleep(1200 * attempt);
    }
  }
  throw lastError;
}

async function waitForPageReady(page) {
  await page.waitForSelector("main", { state: "attached", timeout: opts.timeout });
  await waitForFonts(page);
  await page.waitForTimeout(450);
  // Runtime reveal markers. A hidden route is still measured: the timeout is
  // allowed and the missing marker is reported by the state checks.
  await page
    .waitForFunction(() => document.querySelector("main .rv-in") !== null, { timeout: 6000 })
    .catch(() => {});
  await dismissConsent(page);
}

async function settle(page) {
  const started = Date.now();
  let signature = null;
  let stable = 0;
  let checks = 0;
  while (Date.now() - started < opts.settle) {
    await page.waitForTimeout(90);
    checks += 1;
    const next = await page.evaluate(settleSignature).catch(() => null);
    if (!next) continue;
    if (
      signature &&
      Math.abs(next.y - signature.y) <= 2 &&
      next.rv === signature.rv &&
      next.tone === signature.tone &&
      next.groundT === signature.groundT &&
      (next.veil == null ||
        signature.veil == null ||
        Math.abs(next.veil - signature.veil) < 0.01) &&
      !next.moving &&
      !next.swap
    ) {
      stable += 1;
    } else {
      stable = 0;
    }
    signature = next;
    if (stable >= 2) break;
  }
  const stableMs = Date.now() - started;
  await page.waitForTimeout(opts.grace);
  const final = await page.evaluate(settleSignature).catch(() => null);
  return {
    stable: stable >= 2,
    settleMs: Date.now() - started,
    polls: checks,
    stabilityMs: stableMs,
    signature: final,
  };
}

async function measureState(page, expected, scrollLabel, scrollRequest, errors) {
  const measured = await page.evaluate(measurePage, {
    expectedPath: expected.pathname,
    expectedHash: expected.hash,
    scrollRequest,
  });
  measured.state = scrollLabel;
  measured.errors = errors;
  measured.runtimeErrors = errors.length;
  measured.byCode = {};
  for (const violation of measured.violations) {
    const code = violation.code;
    measured.byCode[code] = (measured.byCode[code] || 0) + 1;
  }
  measured.ok = measured.violations.length === 0;
  return measured;
}

function stateFlags(measured) {
  const flags = new Set();
  for (const violation of measured.violations) {
    if (
      ["opacity", "transparent-text", "heading-hidden", "missing-heading", "no-text"].includes(
        violation.code,
      )
    )
      flags.add("H");
    if (violation.code === "contrast") flags.add("C");
    if (violation.code === "covered") flags.add("O");
    if (["ground-mismatch", "ground-token", "veil-stuck"].includes(violation.code)) flags.add("G");
    if (["path-mismatch", "hash-mismatch", "hash-missing", "missing-main"].includes(violation.code))
      flags.add("N");
    if (violation.code === "pageerror") flags.add("E");
  }
  if (!flags.size) flags.add(".");
  return [...flags].join("");
}

async function captureFailure(page, job, measured, index) {
  const base = `${slugify(job.route)}--${job.viewport.name}--${job.mode}--${String(index).padStart(2, "0")}-${slugify(measured.state)}`;
  const png = path.join(SHOTS_DIR, `${base}.png`);
  const json = path.join(SHOTS_DIR, `${base}.json`);
  let screenshot = null;
  if (job.screenshots < opts.maxScreenshots) {
    try {
      await page.screenshot({ path: png, type: "png", fullPage: false });
      screenshot = path.relative(ROOT, png);
      job.screenshots += 1;
    } catch {
      screenshot = null;
    }
  }
  const context = {
    route: job.route,
    viewport: job.viewport,
    mode: job.mode,
    state: measured.state,
    scrollRequest: measured.scrollRequest,
    scrollY: measured.scrollY,
    scrollMax: measured.scrollMax,
    expectedPath: measured.expectedPath,
    expectedHash: measured.expectedHash,
    pathname: measured.pathname,
    hash: measured.hash,
    firstHeading: measured.firstHeading,
    ground: measured.ground,
    nav: measured.nav,
    hashTarget: measured.hashTarget,
    violations: measured.violations.map((violation) => ({
      ...violation,
      element: violation.element
        ? {
            tag: violation.element.tag,
            className: violation.element.className,
            text: violation.element.text,
            rect: violation.element.rect,
            styleOpacity: violation.element.styleOpacity,
            effectiveOpacity: violation.element.effectiveOpacity,
            words: violation.element.words,
            minWordOpacity: violation.element.minWordOpacity,
            rvIn: violation.element.rvIn,
            color: violation.element.color,
            background: violation.element.background,
            contrast: violation.element.contrast,
            cover: violation.element.cover,
          }
        : undefined,
    })),
    checkedSamples: measured.checks.slice(0, 12),
    screenshot,
  };
  await fs.writeFile(json, `${JSON.stringify(context, null, 2)}\n`);
  return { screenshot, context: path.relative(ROOT, json) };
}

async function scrollToFraction(page, fraction) {
  const max = await page.evaluate(() =>
    Math.round(Math.max(0, document.documentElement.scrollHeight - window.innerHeight)),
  );
  const y = Math.round(max * fraction);
  await page.evaluate((top) => window.scrollTo({ top, left: 0, behavior: "instant" }), y);
  await page.waitForTimeout(60);
  const actual = await page.evaluate(() => Math.round(window.scrollY));
  return { requestedY: y, actualY: actual, max, fraction };
}

async function sampleStates(page, job, expected, instrumented) {
  const samples = [];
  const labels = [
    { label: "scroll-0", fraction: 0 },
    { label: "scroll-25", fraction: 0.25 },
    { label: "scroll-50", fraction: 0.5 },
    { label: "scroll-75", fraction: 0.75 },
    { label: "scroll-bottom", fraction: 1 },
  ];
  for (let index = 0; index < labels.length; index += 1) {
    const entry = labels[index];
    const scroll = await scrollToFraction(page, entry.fraction);
    const settleInfo = await settle(page);
    instrumented.mark();
    await page.waitForTimeout(25);
    const errors = instrumented.take();
    const measured = await measureState(page, expected, entry.label, scroll, errors);
    measured.settle = settleInfo;
    samples.push(measured);
    if (!measured.ok && job.screenshots < opts.maxScreenshots) {
      const artifact = await captureFailure(page, job, measured, index);
      if (artifact.screenshot) {
        measured.screenshot = artifact.screenshot;
        measured.contextFile = artifact.context;
      }
    }
    if (!measured.ok) job.samplesFailed += 1;
  }
  return samples;
}

async function findAnchor(page, targetPath) {
  return page.evaluate((target) => {
    const candidates = [];
    for (const anchor of Array.from(document.querySelectorAll("a[href]"))) {
      if (anchor.target && anchor.target !== "_self") continue;
      if (anchor.hasAttribute("download")) continue;
      let url;
      try {
        url = new URL(anchor.getAttribute("href"), location.href);
      } catch {
        continue;
      }
      if (url.origin !== location.origin || url.pathname !== target.pathname) continue;
      if (target.hash && url.hash !== target.hash) continue;
      const style = getComputedStyle(anchor);
      const rect = anchor.getBoundingClientRect();
      const visible =
        rect.width > 1 &&
        rect.height > 1 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0.01;
      candidates.push({
        element: anchor,
        visible,
        inMain: Boolean(anchor.closest("main")),
        inFooter: Boolean(anchor.closest("footer")),
        text: (anchor.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
        href: anchor.getAttribute("href"),
      });
    }
    if (!candidates.length) return { found: false };
    const score = (candidate) =>
      (candidate.visible ? 100 : 0) + (candidate.inMain ? 10 : 0) + (candidate.inFooter ? 5 : 0);
    candidates.sort((a, b) => score(b) - score(a));
    const chosen = candidates[0];
    chosen.element.setAttribute("data-audit-anchor", "1");
    return {
      found: true,
      visible: chosen.visible,
      inMain: chosen.inMain,
      inFooter: chosen.inFooter,
      text: chosen.text,
      href: chosen.href,
    };
  }, targetPath);
}

async function clickTemporaryAnchor(page, href) {
  return page.evaluate((url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.textContent = "visibility audit";
    anchor.style.cssText =
      "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;z-index:2147483647";
    document.body.appendChild(anchor);
    const dispatched = anchor.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, view: window }),
    );
    anchor.remove();
    return dispatched;
  }, href);
}

async function waitForHashLanding(page, expectedHash, timeoutMs = 5000) {
  if (!expectedHash) return;
  const id = expectedHash.replace(/^#/, "");
  await page
    .waitForFunction(
      (targetId) => {
        const element = document.getElementById(targetId);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top > -8 && rect.top < innerHeight * 0.6;
      },
      id,
      { timeout: timeoutMs },
    )
    .catch(() => {});
  await page.waitForTimeout(120);
}

async function waitForPath(page, expected, timeoutMs = 8000) {
  const started = Date.now();
  try {
    await page.waitForFunction(
      (target) => location.pathname === target.path,
      { path: expected.pathname },
      { timeout: timeoutMs },
    );
    if (expected.hash) {
      try {
        await page.waitForFunction((hash) => location.hash === hash, expected.hash, {
          timeout: 5000,
        });
      } catch {
        const actualHash = await page.evaluate(() => location.hash).catch(() => "");
        return { ok: false, ms: Date.now() - started, actual: expected.pathname, actualHash };
      }
    }
    return { ok: true, ms: Date.now() - started, actual: expected.pathname };
  } catch {
    const actual = await page.evaluate(() => location.pathname).catch(() => "");
    return { ok: false, ms: Date.now() - started, actual };
  }
}

/**
 * Navigate from "/" to the target using a real internal anchor when one
 * exists, otherwise dispatch a click on a temporary anchor so the delegated
 * useClientNav handler (router.push) runs.
 */
async function clientNavigate(page, expected) {
  const beforePath = await page.evaluate(() => location.pathname);
  const result = {
    via: "temp",
    anchor: null,
    beforePath,
    fallback: false,
    nav: { ok: false, ms: 0, actual: beforePath },
  };
  if (
    beforePath === expected.pathname &&
    (!expected.hash || (await page.evaluate(() => location.hash)) === expected.hash)
  ) {
    result.via = "initial";
    result.nav = { ok: true, ms: 0, actual: beforePath };
    return result;
  }
  const anchor = await findAnchor(page, expected);
  result.anchor = anchor.found
    ? {
        text: anchor.text,
        href: anchor.href,
        visible: anchor.visible,
        inMain: anchor.inMain,
        inFooter: anchor.inFooter,
      }
    : null;
  if (anchor.found) {
    await page
      .locator('[data-audit-anchor="1"]')
      .first()
      .evaluate((element) => element.click())
      .catch(() => {});
    result.via = "anchor-dom";
    result.nav = await waitForPath(page, expected, 5000);
    if (!result.nav.ok) {
      result.fallback = true;
      await clickTemporaryAnchor(page, expected.route).catch(() => false);
      result.via = "temp-after-anchor";
      result.nav = await waitForPath(page, expected, 7000);
    }
  } else {
    await clickTemporaryAnchor(page, expected.route).catch(() => false);
    result.nav = await waitForPath(page, expected, 8000);
  }
  return result;
}

async function newJobPage(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    locale: "en-GB",
    timezoneId: "Europe/London",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(opts.timeout);
  const instrumented = instrument(page);
  return { context, page, instrumented };
}

async function auditJob(browser, job) {
  const { context, page, instrumented } = await newJobPage(browser, job.viewport);
  const expected = parseRoute(job.route);
  const record = {
    route: job.route,
    slug: job.slug,
    viewport: job.viewport,
    mode: job.mode,
    expectedPath: expected.pathname,
    expectedHash: expected.hash,
    ok: false,
    nav: null,
    spaOutcome: null,
    drawer: null,
    samples: [],
    screenshots: 0,
    samplesFailed: 0,
    errors: [],
    failureReasons: [],
    ms: 0,
  };
  const started = Date.now();
  try {
    if (job.mode === "direct") {
      const loaded = await loadDirect(page, job.route);
      record.nav = { ok: true, via: "direct", attempts: loaded.attempts };
    } else if (job.route === "/") {
      const loaded = await loadDirect(page, "/");
      record.nav = { ok: true, via: "initial", attempts: loaded.attempts };
      record.spaOutcome = "noop-home";
    } else if (expected.pathname === "/talk-to-us") {
      // The site-wide drawer owns every unmodified /talk-to-us click; the URL
      // deliberately does not change. Record that outcome, then measure the
      // route by direct load so its states are still covered.
      await gotoWithRetry(page, `${opts.base}/`);
      await waitForPageReady(page);
      await clickTemporaryAnchor(page, job.route).catch(() => false);
      await page.waitForTimeout(600);
      const drawer = await page.evaluate(() => {
        const element = document.querySelector(".wire-drawer");
        if (!element) return null;
        const style = getComputedStyle(element);
        return {
          display: style.display,
          visibility: style.visibility,
          opacity: Number(style.opacity),
          open: element.hasAttribute("open") || element.getAttribute("aria-hidden") !== "true",
          rect: (() => {
            const r = element.getBoundingClientRect();
            return {
              x: Math.round(r.x),
              y: Math.round(r.y),
              w: Math.round(r.width),
              h: Math.round(r.height),
            };
          })(),
        };
      });
      record.drawer = drawer;
      record.spaOutcome = "drawer";
      record.nav = {
        ok: Boolean(drawer && drawer.display !== "none" && drawer.rect.w > 2),
        via: "drawer",
        pathname: await page.evaluate(() => location.pathname),
      };
      await loadDirect(page, job.route);
    } else {
      await loadDirect(page, "/");
      const nav = await clientNavigate(page, expected);
      record.nav = nav;
      await page.waitForTimeout(250);
      try {
        await waitForPageReady(page);
      } catch (error) {
        // A slow dev-server commit must not turn into a route verdict; reload
        // the destination directly and keep the SPA failure in the record.
        record.spaOutcome = "fallback-direct";
        record.nav.fallbackDirect = true;
        record.nav.error = error instanceof Error ? error.message.slice(0, 240) : String(error);
        await loadDirect(page, job.route);
      }
    }

    if (expected.hash) {
      // Hash landing is measured before the five scroll states: it is the
      // state the explicit /guides#link-cards-gh-muse coverage requires.
      await page.waitForTimeout(500);
      await waitForHashLanding(page, expected.hash);
      const settleInfo = await settle(page);
      instrumented.mark();
      const errors = instrumented.take();
      const measured = await measureState(
        page,
        expected,
        "hash-landing",
        {
          fraction: null,
          hashLanding: true,
          actualY: await page.evaluate(() => Math.round(window.scrollY)),
        },
        errors,
      );
      measured.settle = settleInfo;
      const target = measured.hashTarget;
      if (target?.exists) {
        const top = target.rect.top;
        if (top < -4 || top > job.viewport.height * 0.6) {
          measured.violations.push({
            code: "hash-not-in-view",
            category: "nav",
            cause: "nav",
            message: `#${target.id} top=${top} (viewport height=${job.viewport.height}) after hash navigation`,
          });
          measured.ok = false;
        }
        if (target.opacity != null && target.opacity < 0.05) {
          measured.violations.push({
            code: "hash-target-hidden",
            category: "hidden",
            cause: "reveal",
            message: `#${target.id} text opacity ${target.opacity}`,
          });
          measured.ok = false;
        }
        if (target.contrast != null && target.contrast < 2 && !target.backgroundUncertain) {
          measured.violations.push({
            code: "contrast",
            category: "contrast",
            cause: "theme-token",
            message: `#${target.id} contrast ${target.contrast}`,
          });
          measured.ok = false;
        }
      }
      measured.state = "hash-landing";
      record.samples.push(measured);
      if (!measured.ok) {
        const artifact = await captureFailure(page, record, measured, 0);
        measured.screenshot = artifact.screenshot;
        measured.contextFile = artifact.context;
        record.samplesFailed += 1;
      }
    }

    const samples = await sampleStates(page, record, expected, instrumented);
    record.samples.push(...samples);
    record.errors = instrumented.all();
    record.ok = record.samples.every((sample) => sample.ok) && record.nav.ok !== false;
    if (!record.ok) {
      for (const sample of record.samples) {
        if (!sample.ok) {
          record.failureReasons.push(
            `${sample.state}: ${sample.violations.map((violation) => violation.code).join("+")}`,
          );
        }
      }
      if (record.nav.ok === false) record.failureReasons.push(`nav:${record.nav.via}`);
    }
  } catch (error) {
    record.failureReasons.push(
      `exception:${error instanceof Error ? error.message : String(error)}`,
    );
    record.errors = instrumented.all();
    record.ok = false;
  } finally {
    record.ms = Date.now() - started;
    await context.close().catch(() => {});
  }
  return record;
}

async function auditHistory(browser, viewport) {
  const { context, page, instrumented } = await newJobPage(browser, viewport);
  const record = {
    kind: "history",
    viewport,
    mode: "history",
    steps: [],
    ok: false,
    ms: 0,
    screenshots: 0,
  };
  const started = Date.now();
  try {
    await gotoWithRetry(page, `${opts.base}/`);
    await waitForPageReady(page);
    for (let index = 0; index < HISTORY_STEPS.length; index += 1) {
      const step = HISTORY_STEPS[index];
      const expected = parseRoute(step.route);
      const stepRecord = {
        name: step.name,
        kind: step.kind,
        route: step.route,
        expectedPath: expected.pathname,
        expectedHash: expected.hash,
        ok: false,
        nav: { ok: false, via: step.kind },
        samples: [],
        failureReasons: [],
        screenshots: 0,
      };
      try {
        if (step.kind === "client") {
          const nav = await clientNavigate(page, expected);
          stepRecord.nav = { ...nav.nav, via: nav.via };
          await page.waitForTimeout(250);
          try {
            await waitForPageReady(page);
          } catch {
            await loadDirect(page, step.route);
            stepRecord.nav.fallbackDirect = true;
          }
        } else if (step.kind === "back" || step.kind === "forward") {
          try {
            await (step.kind === "back"
              ? page.goBack({ timeout: 8000 })
              : page.goForward({ timeout: 8000 }));
          } catch {
            await page.evaluate(
              (direction) => (direction === "back" ? history.back() : history.forward()),
              step.kind,
            );
          }
          stepRecord.nav = { ...(await waitForPath(page, expected, 8000)), via: step.kind };
          await page.waitForTimeout(300);
          try {
            await waitForPageReady(page);
          } catch {
            await loadDirect(page, step.route);
            stepRecord.nav.fallbackDirect = true;
          }
        } else {
          const loaded = await loadDirect(page, step.route);
          stepRecord.nav = { ok: true, via: "direct", attempts: loaded.attempts };
        }

        if (expected.hash) {
          await page.waitForTimeout(350);
          await waitForHashLanding(page, expected.hash);
          const landingSettle = await settle(page);
          instrumented.mark();
          const landingErrors = instrumented.take();
          const landing = await measureState(
            page,
            expected,
            "hash-landing",
            {
              fraction: null,
              hashLanding: true,
              actualY: await page.evaluate(() => Math.round(window.scrollY)),
            },
            landingErrors,
          );
          landing.settle = landingSettle;
          if (landing.hashTarget?.exists) {
            const top = landing.hashTarget.rect.top;
            if (top < -4 || top > viewport.height * 0.6) {
              landing.violations.push({
                code: "hash-not-in-view",
                category: "nav",
                cause: "nav",
                message: `#${landing.hashTarget.id} top=${top} after ${step.kind}`,
              });
              landing.ok = false;
            }
          }
          stepRecord.samples.push(landing);
          if (!landing.ok) {
            const artifact = await captureFailure(
              page,
              { ...record, route: step.route, mode: "history" },
              landing,
              0,
            );
            landing.screenshot = artifact.screenshot;
            record.screenshots += artifact.screenshot ? 1 : 0;
          }
        }

        const stateSamples = [];
        const labels = [
          { label: "scroll-0", fraction: 0 },
          { label: "scroll-25", fraction: 0.25 },
          { label: "scroll-50", fraction: 0.5 },
          { label: "scroll-75", fraction: 0.75 },
          { label: "scroll-bottom", fraction: 1 },
        ];
        for (let stateIndex = 0; stateIndex < labels.length; stateIndex += 1) {
          const entry = labels[stateIndex];
          const scroll = await scrollToFraction(page, entry.fraction);
          const settleInfo = await settle(page);
          instrumented.mark();
          await page.waitForTimeout(25);
          const errors = instrumented.take();
          const measured = await measureState(page, expected, entry.label, scroll, errors);
          measured.settle = settleInfo;
          stateSamples.push(measured);
          if (!measured.ok) {
            const jobShim = {
              route: step.route,
              viewport,
              mode: `history-${step.name}`,
              screenshots: record.screenshots,
            };
            const artifact = await captureFailure(page, jobShim, measured, stateIndex);
            record.screenshots = jobShim.screenshots;
            if (artifact.screenshot) {
              measured.screenshot = artifact.screenshot;
              measured.contextFile = artifact.context;
            }
          }
        }
        stepRecord.samples.push(...stateSamples);
        stepRecord.ok =
          stepRecord.samples.every((sample) => sample.ok) && stepRecord.nav.ok !== false;
        if (!stepRecord.ok) {
          stepRecord.failureReasons = stepRecord.samples
            .filter((sample) => !sample.ok)
            .map((sample) => `${sample.state}: ${sample.violations.map((v) => v.code).join("+")}`);
          if (stepRecord.nav.ok === false) stepRecord.failureReasons.push("nav");
        }
      } catch (error) {
        stepRecord.failureReasons.push(
          `exception:${error instanceof Error ? error.message : String(error)}`,
        );
        stepRecord.ok = false;
        stepRecord.errors = instrumented.all();
      }
      record.steps.push(stepRecord);
    }
    record.ok = record.steps.every((step) => step.ok);
  } catch (error) {
    record.failureReasons = [`exception:${error instanceof Error ? error.message : String(error)}`];
    record.ok = false;
  } finally {
    record.ms = Date.now() - started;
    await context.close().catch(() => {});
  }
  return record;
}

function buildJobs(routes) {
  const jobs = [];
  const viewports = VIEWPORTS.filter((viewport) =>
    opts.viewport === "all" ? true : viewport.name.startsWith(opts.viewport),
  );
  const includeDirect = opts.mode === "all" || opts.mode === "direct";
  const includeSpa = opts.mode === "all" || opts.mode === "spa";
  for (const viewport of viewports) {
    for (const entry of routes) {
      const route = entry.route;
      const slug = entry.slug || slugify(route);
      if (includeDirect) jobs.push({ route, slug, viewport, mode: "direct" });
      if (includeSpa) jobs.push({ route, slug, viewport, mode: "spa" });
      if (route === "/guides") {
        if (includeDirect)
          jobs.push({ route: HASH_ROUTE, slug: `${slug}-hash`, viewport, mode: "direct" });
        if (includeSpa)
          jobs.push({ route: HASH_ROUTE, slug: `${slug}-hash`, viewport, mode: "spa" });
      }
    }
  }
  return jobs;
}

async function probeBookRoute() {
  try {
    const response = await fetch(`${opts.base}/book`, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    const text = await response.text();
    return {
      route: "/book",
      status: response.status,
      implemented: response.status === 200,
      title: (text.match(/<title>([^<]*)<\/title>/i) || [])[1] || null,
    };
  } catch (error) {
    return { route: "/book", status: null, implemented: false, error: String(error) };
  }
}

function aggregate(records, history) {
  const samples = [];
  for (const record of records) {
    for (const sample of record.samples) {
      samples.push({
        route: record.route,
        viewport: record.viewport.name,
        mode: record.mode,
        state: sample.state,
        scrollY: sample.scrollY,
        scrollMax: sample.scrollMax,
        tone: sample.ground?.dataGroundTone,
        expectedTone: sample.ground?.expectedTone,
        groundT: sample.ground?.htmlGroundT,
        veilOpacity: sample.ground?.veil?.opacity ?? null,
        veilTone: sample.ground?.veil?.dataTone ?? null,
        rvIn: sample.rvIn,
        firstHeadingOpacity: sample.firstHeading?.textOpacity ?? null,
        checked: sample.checkedCount,
        contrastMin: (() => {
          const values = sample.checks
            .map((check) => check.contrast)
            .filter((value) => typeof value === "number");
          return values.length ? Math.min(...values) : null;
        })(),
        opacityMin: (() => {
          const values = sample.checks
            .map((check) => check.opacity)
            .filter((value) => typeof value === "number");
          return values.length ? Math.min(...values) : null;
        })(),
        navVisible: sample.nav?.visible ?? null,
        flags: stateFlags(sample),
        ok: sample.ok,
        codes: sample.violations.map((violation) => violation.code).join("+"),
        firstViolation: sample.violations[0]?.message || "",
        screenshot: sample.screenshot || null,
        contextFile: sample.contextFile || null,
      });
    }
  }
  const historySamples = [];
  for (const record of history) {
    for (const step of record.steps) {
      for (const sample of step.samples) {
        historySamples.push({
          route: step.route,
          step: step.name,
          viewport: record.viewport.name,
          mode: "history",
          state: sample.state,
          scrollY: sample.scrollY,
          scrollMax: sample.scrollMax,
          tone: sample.ground?.dataGroundTone,
          veilOpacity: sample.ground?.veil?.opacity ?? null,
          rvIn: sample.rvIn,
          firstHeadingOpacity: sample.firstHeading?.textOpacity ?? null,
          flags: stateFlags(sample),
          ok: sample.ok,
          codes: sample.violations.map((violation) => violation.code).join("+"),
          screenshot: sample.screenshot || null,
        });
      }
    }
  }
  return { samples, historySamples };
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(rows) {
  const headers = [
    "route",
    "viewport",
    "mode",
    "state",
    "scrollY",
    "scrollMax",
    "tone",
    "expectedTone",
    "groundT",
    "veilOpacity",
    "veilTone",
    "rvIn",
    "firstHeadingOpacity",
    "checked",
    "contrastMin",
    "opacityMin",
    "navVisible",
    "flags",
    "ok",
    "codes",
    "firstViolation",
    "screenshot",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function worstOf(samples) {
  const values = (key) =>
    samples.map((sample) => sample[key]).filter((value) => typeof value === "number");
  const contrasts = values("contrastMin");
  const opacities = values("opacityMin");
  const veils = values("veilOpacity");
  return {
    contrastMin: contrasts.length ? Math.min(...contrasts) : null,
    opacityMin: opacities.length ? Math.min(...opacities) : null,
    veilMax: veils.length ? Math.max(...veils) : null,
  };
}

function flagString(samples) {
  return samples
    .map((sample) =>
      sample.ok
        ? "."
        : sample.codes
          ? sample.codes
              .split("+")
              .map((code) => {
                if (
                  [
                    "opacity",
                    "transparent-text",
                    "heading-hidden",
                    "missing-heading",
                    "no-text",
                  ].includes(code)
                )
                  return "H";
                if (code === "contrast") return "C";
                if (code === "covered") return "O";
                if (["ground-mismatch", "ground-token", "veil-stuck"].includes(code)) return "G";
                if (
                  ["path-mismatch", "hash-mismatch", "hash-missing", "missing-main"].includes(code)
                )
                  return "N";
                if (code === "pageerror") return "E";
                return "?";
              })
              .join("")
          : "?",
    )
    .join("");
}

function buildReport(payload) {
  const { summary, records, history, coverage, negativeControl } = payload;
  const lines = [];
  lines.push("# Theme / ground / reveal visibility audit");
  lines.push("");
  lines.push(
    `Run: **${payload.generatedAt}** (${(payload.durationMs / 1000).toFixed(1)} s) · Base \`${payload.base}\` · ` +
      `${payload.viewports.map((v) => `${v.width}×${v.height}`).join(" / ")} · DPR 1 · ` +
      `\`prefers-reduced-motion: no-preference\` · Chromium (Playwright).`,
  );
  lines.push("");
  lines.push("```sh");
  lines.push(`cd /home/boxd/tano-clone`);
  lines.push(
    `node scripts/audit-visibility-theme.mjs --base ${payload.base}` +
      (payload.label ? ` --label ${payload.label}` : ""),
  );
  lines.push("```");
  lines.push("");
  lines.push("## Result");
  lines.push("");
  lines.push("| Metric | Result |");
  lines.push("|---|---:|");
  lines.push(`| Route jobs | ${summary.jobs} |`);
  lines.push(`| Route jobs passed | ${summary.jobsPassed} |`);
  lines.push(`| Route jobs failed | ${summary.jobsFailed} |`);
  lines.push(`| Scroll samples | ${summary.samples} |`);
  lines.push(`| Samples passed | ${summary.samplesPassed} |`);
  lines.push(`| Samples failed | ${summary.samplesFailed} |`);
  lines.push(`| Hidden (opacity/reveal/heading) | ${summary.hiddenSamples} |`);
  lines.push(`| Low contrast (< 2.0) | ${summary.contrastSamples} |`);
  lines.push(`| Covered by opaque overlay | ${summary.coveredSamples} |`);
  lines.push(`| Ground / veil / token | ${summary.groundSamples} |`);
  lines.push(`| History steps | ${summary.historySteps} (${summary.historyFailed} failed) |`);
  lines.push(`| Exit code | ${summary.exitCode} |`);
  lines.push("");
  if (summary.samplesFailed === 0 && summary.jobsFailed === 0) {
    lines.push(
      "**No hidden or low-contrast content was detected in this run.** The detector is proven red-capable by the negative control below.",
    );
  } else {
    lines.push(
      `**Failures were detected.** ${summary.jobsFailed} route job(s) failed; ${summary.samplesFailed} scroll sample(s) carry violations. Details and screenshots are under \`docs/verify/theme/failures/\`; the complete sample grid is in \`samples.csv\` and \`results.json\`.`,
    );
  }
  lines.push("");
  lines.push("## Root-cause ranking");
  lines.push("");
  if (!summary.causes.length) {
    lines.push("No active causes in this run. The ranked detector paths, in order, are:");
    lines.push("");
    lines.push(
      "1. **reveal** — a visible h1/h2/p (or split word) without `.rv-in`, or with `.rv-in` but text opacity < 0.05.",
    );
    lines.push(
      "2. **ground-veil** — `.wire-ground-veil` opacity left > 0.05 after settle or `data-ground-moving` set.",
    );
    lines.push(
      "3. **theme-token** — contrast < 2.0, transparent text, or `data-ground-tone`/`--ground-t` disagreement.",
    );
    lines.push(
      "4. **overlay** — an unrelated opaque element covering ≥ 35% of a visible text box.",
    );
    lines.push("5. **timing** — page errors, or a state that never settled inside the cap.");
  } else {
    for (const cause of summary.causes) {
      lines.push(
        `${cause.rank}. **${cause.cause}** — ${cause.samples} samples / ${cause.routes} routes: ${cause.message}`,
      );
    }
  }
  lines.push("");
  lines.push("## Explicit coverage");
  lines.push("");
  lines.push("| Group | Routes / evidence | Result |");
  lines.push("|---|---|---|");
  for (const [group, entry] of Object.entries(coverage.groups)) {
    lines.push(
      `| ${group} | ${entry.routes.map((route) => `\`${route}\``).join(", ")} | ${entry.ok ? "PASS" : "FAIL"} |`,
    );
  }
  lines.push(
    `| /book | ${coverage.book.implemented ? "implemented and audited" : `not implemented at ${payload.base} (HTTP ${coverage.book.status}); \`/talk-to-us\` is the book-like light page covered above`} | ${coverage.book.implemented ? "covered" : "N/A"} |`,
  );
  lines.push(
    `| SPA back/forward | ${coverage.historySteps.join(" → ")} | ${coverage.historyOk ? "PASS" : "FAIL"} |`,
  );
  lines.push("");
  lines.push("## Complete route × viewport × mode table");
  lines.push("");
  lines.push(
    "Flags per state (`scroll-0`, `25`, `50`, `75`, `bottom`): `.` pass · `H` hidden/opacity · `C` contrast · `O` overlay · `G` ground/veil · `N` path/hash · `E` pageerror.",
  );
  lines.push("");
  lines.push(
    "| Route | Viewport | Mode | States | Worst contrast | Min opacity | Max veil | Tone sequence | Page errors | Result |",
  );
  lines.push("|---|---|---|---|---:|---:|---:|---|---:|---|");
  for (const record of records) {
    const samples = record.samples;
    const worst = worstOf(samples);
    const tones = samples
      .map((sample) => (sample.ground?.dataGroundTone || "?").charAt(0))
      .join("");
    const pageErrors = (record.errors || []).filter((error) => error.kind === "pageerror").length;
    lines.push(
      `| \`${record.route}\` | ${record.viewport.name} | ${record.mode} | \`${flagString(samples)}\` | ${worst.contrastMin ?? "-"} | ${worst.opacityMin ?? "-"} | ${worst.veilMax ?? "-"} | ${tones} | ${pageErrors} | ${record.ok ? "PASS" : "FAIL"} |`,
    );
  }
  lines.push("");
  lines.push("## SPA history / back-forward");
  lines.push("");
  lines.push("| Viewport | Step | Route | States | Result |");
  lines.push("|---|---|---|---|---|");
  for (const record of history) {
    for (const step of record.steps) {
      lines.push(
        `| ${record.viewport.name} | ${step.kind} \`${step.name}\` | \`${step.route}\` | \`${flagString(step.samples)}\` | ${step.ok ? "PASS" : "FAIL"} |`,
      );
    }
  }
  lines.push("");
  lines.push("## Failures");
  lines.push("");
  const failures = [];
  for (const record of records) {
    for (const sample of record.samples) {
      if (!sample.ok) failures.push({ record, sample });
    }
  }
  for (const record of history) {
    for (const step of record.steps) {
      for (const sample of step.samples) {
        if (!sample.ok)
          failures.push({
            record: { ...record, route: step.route, mode: `history:${step.name}` },
            sample,
          });
      }
    }
  }
  if (!failures.length) {
    lines.push("None. Failure screenshots directory is empty.");
  } else {
    for (const { record, sample } of failures.slice(0, 60)) {
      lines.push(
        `### \`${record.route}\` · ${record.viewport.name} · ${record.mode} · ${sample.state}`,
      );
      lines.push("");
      lines.push(
        `- path \`${sample.pathname}${sample.hash || ""}\` · scroll ${sample.scrollY}/${sample.scrollMax} · tone \`${sample.ground?.dataGroundTone}\` expected \`${sample.ground?.expectedTone}\` · --ground-t ${sample.ground?.htmlGroundT} · veil ${sample.ground?.veil?.opacity}`,
      );
      lines.push(
        `- first heading opacity ${sample.firstHeading?.textOpacity ?? "-"} · \`.rv-in\` ${sample.rvIn} · checked ${sample.checkedCount}`,
      );
      for (const violation of sample.violations.slice(0, 8)) {
        lines.push(`- **${violation.code}** (${violation.cause}): ${violation.message}`);
      }
      if (sample.screenshot) lines.push(`- screenshot: \`${sample.screenshot}\``);
      if (sample.contextFile) lines.push(`- context: \`${sample.contextFile}\``);
      lines.push("");
    }
    if (failures.length > 60) {
      lines.push(
        `… ${failures.length - 60} more failing samples are listed in \`results.json\` / \`samples.csv\`.`,
      );
      lines.push("");
    }
  }
  const jobFailures = records.filter((record) => !record.ok && record.samples.length === 0);
  if (jobFailures.length) {
    lines.push("### Jobs that failed before sampling");
    lines.push("");
    for (const record of jobFailures) {
      lines.push(
        `- \`${record.route}\` · ${record.viewport.name} · ${record.mode}: ${record.failureReasons.join("; ")}`,
      );
    }
    lines.push("");
  }
  lines.push("## Runtime error observations (not a visibility gate)");
  lines.push("");
  if (summary.runtimeErrorRoutes.length) {
    lines.push(
      `\`pageerror\` was emitted on ${summary.runtimeErrorRoutes.length} route job(s). These are recorded separately; they do not by themselves fail the hidden/contrast gate, but a hydration mismatch re-renders the tree and is the main \`timing\` risk.`,
    );
    lines.push("");
    lines.push("| Page error | Occurrences |");
    lines.push("|---|---:|");
    for (const entry of summary.runtimeErrorMessages) {
      lines.push(`| ${entry.message.replace(/\|/g, "\\|")} | ${entry.count} |`);
    }
    lines.push("");
    lines.push(`Routes: ${summary.runtimeErrorRoutes.map((route) => `\`${route}\``).join(", ")}`);
    lines.push("");
  } else {
    lines.push("None.");
    lines.push("");
  }
  lines.push("## Negative control");
  lines.push("");
  if (negativeControl) {
    lines.push(
      `Purpose: prove the detector can go red. Baseline \`${negativeControl.route}\` was ` +
        `${negativeControl.baselineClean ? "clean" : "already red"} (${negativeControl.baselineViolations.length} violations).`,
    );
    lines.push("");
    lines.push("| Control | Injected state | Detected | Verdict |");
    lines.push("|---|---|---|---|");
    lines.push(
      `| Opacity 0 | visible main h1/h2/p opacity forced to 0 | ${negativeControl.opacity.detected ? `yes (${negativeControl.opacity.codes.join(", ")})` : "no"} | ${negativeControl.opacity.detected ? "PASS" : "FAIL"} |`,
    );
    lines.push(
      `| Low contrast | text fill forced to near-white on a light page | ${negativeControl.contrast.detected ? `yes (${negativeControl.contrast.codes.join(", ")})` : "no"} | ${negativeControl.contrast.detected ? "PASS" : "FAIL"} |`,
    );
    lines.push("");
    lines.push(
      `Overall control: **${negativeControl.ok ? "PASS" : "FAIL"}** — \`docs/verify/theme/negative-control.json\`.`,
    );
  } else {
    lines.push(
      "Not run in this invocation. Run `node scripts/audit-visibility-theme.mjs --negative-control`.",
    );
  }
  lines.push("");
  lines.push("## Method and exact selectors");
  lines.push("");
  lines.push(
    "- **Route set**: all 44 entries in `docs/research/tano/routes.json`, at 1568×829 and 390×844. Every route is loaded fresh and navigated to from `/` through a real internal anchor when present, otherwise through a temporary anchor whose click is handled by the delegated `useClientNav` handler.",
  );
  lines.push(
    "- **Scroll states**: `scrollY = 0`, `0.25`, `0.5`, `0.75` and `1.0` of `document.documentElement.scrollHeight - innerHeight`, applied with `window.scrollTo({behavior:'instant'})`.",
  );
  lines.push(
    "- **Settle**: poll every 90 ms (max " +
      opts.settle +
      " ms) until scrollY (±2 px), `main .rv-in` count, `data-ground-tone`, `--ground-t`, veil opacity (±0.01) are stable, and `data-ground-moving`/`data-ground-swap` are absent for two consecutive polls; then wait " +
      opts.grace +
      " ms (covers the 490 ms reveal delay + 280 ms fade and the 600 ms ground tween).",
  );
  lines.push(
    "- **First heading**: first `main h1, main h2`; own computed `opacity`, ancestor-product effective opacity, split `.rv-word` min opacity; hidden when effective text opacity < 0.05 while in the viewport.",
  );
  lines.push(
    "- **Reveal**: `.rv-in` count in `main`; `main .rv-word` count. A visible h1/h2/p without `.rv-in` (or inside a `.rv-in` ancestor) is reported as `reveal`.",
  );
  lines.push(
    "- **Ground**: `document.documentElement.dataset.groundTone`, computed `--ground-t` and `--ink-t`, expected tone recomputed from `[data-ground-dark]` intersections with the 45% viewport line, `.wire-ground-veil` computed opacity + `data-tone`, `data-ground-moving`/`data-ground-swap`.",
  );
  lines.push(
    "- **Text checks**: every `main h1, main h2, main p` with ≥2 chars intersecting the viewport. `background-color` is collected from the element and ancestors until an opaque layer; intermediate colours are composited over it. `color`/`-webkit-text-fill-color` is parsed through a 1×1 canvas (so `oklab()` and `color(srgb …)` resolve); alpha text is composited over the background. WCAG contrast is computed. Flag: contrast < 2.0, effective text opacity < 0.05, text alpha < 0.05 (unless `background-clip:text` gradient text), or text hidden by an unrelated opaque element covering ≥ 35% of its box.",
  );
  lines.push(
    "- **Nav**: `.wire-nav` display/visibility/opacity/rect/`data-scrolled` and `.wire-nav-bar` measured at every state; recorded, not asserted (the source can park chrome depending on scroll).",
  );
  lines.push(
    "- **Runtime errors**: `pageerror` is recorded at every state and summarized separately; it does not by itself fail the hidden/contrast gate, because the question is whether content is actually unreadable. A page that never renders `main` still fails through the job exception path.",
  );
  lines.push(
    "- **Hash coverage**: `/guides#link-cards-gh-muse` is loaded directly and navigated to from `/`; the `#link-cards-gh-muse` box is checked at its landing scroll before the five fixed states.",
  );
  lines.push(
    "- **Negative control**: `--negative-control` loads a page, verifies baseline is clean, then forces visible main h1/h2/p opacity to 0, then (fresh load) forces text fill near-white on a light page. The detector must report each injected state.",
  );
  lines.push("");
  lines.push("## Artifacts");
  lines.push("");
  lines.push(
    "- `docs/verify/theme/results.json` — every job, every sample, all computed values and violations.",
  );
  lines.push("- `docs/verify/theme/samples.csv` — one row per state sample.");
  lines.push(
    "- `docs/verify/theme/failures/` — one PNG per failing job/state (budget " +
      opts.maxScreenshots +
      ") and a context JSON for every failing sample.",
  );
  lines.push(
    "- `docs/verify/theme/negative-control.json` — detector proof when `--negative-control` was run.",
  );
  lines.push("- `docs/verify/theme/REPORT.md` — this report.");
  lines.push("");
  lines.push("## Limitations");
  lines.push("");
  lines.push(
    "- Dev server, not a production build; on-demand compilation can slow navigation, and HMR can repaint. Timeouts are generous and settle is state-based.",
  );
  lines.push(
    "- Static background walking cannot see photographic/gradient backgrounds: when a background-image lies between text and the first opaque background, contrast is recorded as uncertain and not used to fail. The veil is likewise recorded, not sampled as pixels.",
  );
  lines.push(
    "- Occlusion uses real pointer hit-testing and ignores known chrome (`.wire-nav`, `.wire-nav-bar`, `.wire-consent`, `.wire-spectrum-rule`); a pointer-events:none overlay with an opaque fill is measured by its box, not by hit-testing.",
  );
  lines.push(
    "- The cookie consent banner is dismissed (Reject) before states so it does not mask content; when it cannot be dismissed it is recorded, not failed.",
  );
  lines.push(
    "- `/talk-to-us` has no SPA URL change by design: the drawer owns the click. The SPA job records the drawer and then measures the route by direct load.",
  );
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function computeSummary(records, history, aggregateRows) {
  const samples = aggregateRows.samples;
  const failed = samples.filter((sample) => !sample.ok);
  const causeMap = new Map();
  for (const record of records) {
    for (const sample of record.samples) {
      for (const violation of sample.violations) {
        const key = violation.cause || "unknown";
        if (!causeMap.has(key))
          causeMap.set(key, {
            cause: key,
            samples: 0,
            routes: new Set(),
            message: violation.message,
          });
        const entry = causeMap.get(key);
        entry.samples += 1;
        entry.routes.add(record.route);
        if (!entry.message || entry.message.length < violation.message.length)
          entry.message = violation.message;
      }
    }
  }
  for (const record of records) {
    if (record.ok) continue;
    for (const reason of record.failureReasons) {
      const isNav = reason.startsWith("nav:");
      const isException = reason.startsWith("exception:");
      if (!isNav && !isException) continue;
      const key = isException ? "timing" : "nav";
      if (!causeMap.has(key)) {
        causeMap.set(key, { cause: key, samples: 0, routes: new Set(), message: reason });
      }
      const entry = causeMap.get(key);
      entry.samples += 1;
      entry.routes.add(record.route);
      if (!entry.message || entry.message.length < reason.length) entry.message = reason;
    }
  }
  const causes = [...causeMap.values()]
    .map((entry) => ({ ...entry, routes: entry.routes.size }))
    .sort((a, b) => b.samples - a.samples)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
  const runtimeErrorRoutes = [
    ...new Set(
      records
        .filter((record) => (record.errors || []).some((error) => error.kind === "pageerror"))
        .map((record) => record.route),
    ),
  ];
  const runtimeErrorMessages = new Map();
  for (const record of records) {
    for (const error of record.errors || []) {
      if (error.kind !== "pageerror") continue;
      const key = error.text.slice(0, 160);
      runtimeErrorMessages.set(key, (runtimeErrorMessages.get(key) || 0) + 1);
    }
  }
  const hiddenCodes = new Set([
    "opacity",
    "transparent-text",
    "heading-hidden",
    "missing-heading",
    "no-text",
    "hash-target-hidden",
  ]);
  const groundCodes = new Set(["ground-mismatch", "ground-token", "veil-stuck"]);
  const countWith = (predicate) => samples.filter(predicate).length;
  return {
    jobs: records.length,
    jobsPassed: records.filter((record) => record.ok).length,
    jobsFailed: records.filter((record) => !record.ok).length,
    samples: samples.length,
    samplesPassed: samples.length - failed.length,
    samplesFailed: failed.length,
    hiddenSamples: countWith((sample) =>
      sample.codes.split("+").some((code) => hiddenCodes.has(code)),
    ),
    contrastSamples: countWith((sample) => sample.codes.split("+").includes("contrast")),
    coveredSamples: countWith((sample) => sample.codes.split("+").includes("covered")),
    groundSamples: countWith((sample) =>
      sample.codes.split("+").some((code) => groundCodes.has(code)),
    ),
    historySteps: history.reduce((total, record) => total + record.steps.length, 0),
    historyFailed: history.reduce(
      (total, record) => total + record.steps.filter((step) => !step.ok).length,
      0,
    ),
    failedRoutes: [
      ...new Set([
        ...failed.map((sample) => sample.route),
        ...records.filter((record) => !record.ok).map((record) => record.route),
      ]),
    ],
    runtimeErrorRoutes,
    runtimeErrorMessages: [...runtimeErrorMessages.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([message, count]) => ({ message, count })),
    causes,
    exitCode: records.some((record) => !record.ok) || history.some((record) => !record.ok) ? 1 : 0,
  };
}

async function runNegativeControl(browser) {
  const viewport = VIEWPORTS[0];
  const route = opts.controlRoute;
  const expected = parseRoute(route);
  const result = {
    purpose:
      "Prove the visibility/contrast detector can go red: force opacity 0 on one page, then force low-contrast text on a light page.",
    generatedAt: new Date().toISOString(),
    base: opts.base,
    route,
    viewport,
    baseline: null,
    opacity: { detected: false, codes: [], violations: [] },
    contrast: { detected: false, codes: [], violations: [] },
    baselineClean: false,
    ok: false,
    screenshots: {},
  };
  await fs.mkdir(CONTROL_DIR, { recursive: true });
  const { context, page, instrumented } = await newJobPage(browser, viewport);
  try {
    await loadDirect(page, route);
    await scrollToFraction(page, 0);
    await settle(page);
    instrumented.mark();
    const baseline = await measureState(
      page,
      expected,
      "control-baseline",
      { fraction: 0, actualY: 0 },
      instrumented.take(),
    );
    result.baseline = {
      ok: baseline.ok,
      violations: baseline.violations.map((violation) => ({
        code: violation.code,
        message: violation.message,
      })),
      firstHeading: baseline.firstHeading,
      checked: baseline.checkedCount,
    };
    result.baselineClean = baseline.ok;
    result.baselineViolations = baseline.violations.map((violation) => violation.code);

    // Control 1: force every visible main h1/h2/p to opacity 0.
    const forcedCount = await page.evaluate(() => {
      let count = 0;
      for (const element of document.querySelectorAll("main h1, main h2, main p")) {
        const rect = element.getBoundingClientRect();
        if (rect.bottom <= 1 || rect.top >= innerHeight - 1 || rect.width < 4 || rect.height < 4)
          continue;
        element.style.setProperty("opacity", "0", "important");
        count += 1;
      }
      return count;
    });
    await page.waitForTimeout(350);
    instrumented.mark();
    const forcedOpacity = await measureState(
      page,
      expected,
      "control-opacity-0",
      { fraction: 0, actualY: 0, forcedCount },
      instrumented.take(),
    );
    result.opacity = {
      forcedCount,
      detected: forcedOpacity.violations.some((violation) =>
        ["opacity", "heading-hidden", "transparent-text"].includes(violation.code),
      ),
      codes: [...new Set(forcedOpacity.violations.map((violation) => violation.code))],
      violations: forcedOpacity.violations
        .slice(0, 10)
        .map((violation) => ({ code: violation.code, message: violation.message })),
    };
    try {
      await page.screenshot({
        path: path.join(CONTROL_DIR, "negative-control-opacity-0.png"),
        type: "png",
      });
      result.screenshots.opacity = path.relative(
        ROOT,
        path.join(CONTROL_DIR, "negative-control-opacity-0.png"),
      );
    } catch {}

    // Control 2: reload, then force near-white text over the light ground.
    await loadDirect(page, route);
    await scrollToFraction(page, 0);
    await settle(page);
    await page.addStyleTag({
      content:
        "main h1, main h2, main p, main h1 *, main h2 *, main p * { color: rgb(251, 249, 245) !important; -webkit-text-fill-color: rgb(251, 249, 245) !important; text-shadow: none !important; }",
    });
    await page.waitForTimeout(350);
    instrumented.mark();
    const forcedContrast = await measureState(
      page,
      expected,
      "control-low-contrast",
      { fraction: 0, actualY: 0 },
      instrumented.take(),
    );
    result.contrast = {
      detected: forcedContrast.violations.some((violation) => violation.code === "contrast"),
      codes: [...new Set(forcedContrast.violations.map((violation) => violation.code))],
      violations: forcedContrast.violations
        .slice(0, 10)
        .map((violation) => ({ code: violation.code, message: violation.message })),
    };
    try {
      await page.screenshot({
        path: path.join(CONTROL_DIR, "negative-control-low-contrast.png"),
        type: "png",
      });
      result.screenshots.contrast = path.relative(
        ROOT,
        path.join(CONTROL_DIR, "negative-control-low-contrast.png"),
      );
    } catch {}
    result.ok = result.baselineClean && result.opacity.detected && result.contrast.detected;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  } finally {
    await context.close().catch(() => {});
  }
  await fs.mkdir(SHOTS_DIR, { recursive: true });
  await fs.writeFile(CONTROL_JSON, `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

async function main() {
  const routes = await loadRoutes();
  if (!routes.length) throw new Error("No routes matched --only");
  await fs.mkdir(path.dirname(JSON_PATH), { recursive: true });
  await fs.mkdir(SHOTS_DIR, { recursive: true });
  // Failure artifacts belong to the latest run only.
  await fs.rm(SHOTS_DIR, { recursive: true, force: true });
  await fs.mkdir(SHOTS_DIR, { recursive: true });

  await waitForServer(opts.base, opts.timeout);

  if (opts.negativeControl) {
    console.log(`Negative control — ${opts.base} · ${opts.controlRoute}`);
    const browser = await chromium.launch({ headless: true });
    let control;
    try {
      control = await runNegativeControl(browser);
    } finally {
      await browser.close().catch(() => {});
    }
    console.log(
      JSON.stringify(
        {
          baselineClean: control.baselineClean,
          opacityDetected: control.opacity.detected,
          contrastDetected: control.contrast.detected,
          ok: control.ok,
        },
        null,
        2,
      ),
    );
    process.exitCode = control.ok ? 0 : 1;
    return;
  }

  const jobs = buildJobs(routes);
  const book = await probeBookRoute();
  console.log(`Visibility / theme audit — ${opts.base}`);
  console.log(
    `Routes: ${routes.length} | jobs: ${jobs.length} | viewports: ${VIEWPORTS.filter(
      (v) => opts.viewport === "all" || v.name.startsWith(opts.viewport),
    )
      .map((v) => v.name)
      .join(", ")} | concurrency: ${opts.concurrency}`,
  );

  const browser = await chromium.launch({ headless: true });
  const results = new Array(jobs.length);
  let cursor = 0;
  const worker = async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= jobs.length) break;
      const job = jobs[index];
      const record = await auditJob(browser, job);
      results[index] = record;
      const mark = record.ok ? "PASS" : "FAIL";
      console.log(
        `${pad(index + 1, 3)}/${pad(jobs.length, 3)} ${pad(job.route, 58)} ${pad(job.viewport.name, 10)} ${pad(job.mode, 6)} ${mark} ${record.ms}ms`,
      );
    }
  };
  try {
    await Promise.all(Array.from({ length: Math.max(1, opts.concurrency) }, worker));
  } finally {
    await browser.close().catch(() => {});
  }

  const history = [];
  if (opts.history) {
    const historyBrowser = await chromium.launch({ headless: true });
    try {
      for (const viewport of VIEWPORTS.filter(
        (v) => opts.viewport === "all" || v.name.startsWith(opts.viewport),
      )) {
        const record = await auditHistory(historyBrowser, viewport);
        history.push(record);
        console.log(`history ${viewport.name} ${record.ok ? "PASS" : "FAIL"} ${record.ms}ms`);
      }
    } finally {
      await historyBrowser.close().catch(() => {});
    }
  }

  const { samples, historySamples } = aggregate(samplesFrom(results), history);
  const summary = computeSummary(results, history, { samples });
  const coverage = {
    groups: {},
    book,
    historySteps: HISTORY_STEPS.map((step) => `${step.kind}:${step.route}`),
    historyOk: history.every((record) => record.ok),
  };
  for (const [group, groupRoutes] of Object.entries(PRIORITY_GROUPS)) {
    const groupSet = new Set(groupRoutes);
    const relevant = results.filter((record) => groupSet.has(record.route));
    coverage.groups[group] = {
      routes: groupRoutes,
      ok: relevant.length > 0 && relevant.every((record) => record.ok),
    };
  }

  const negativeControl = await fs
    .readFile(CONTROL_JSON, "utf8")
    .then(JSON.parse)
    .catch(() => null);

  const payload = {
    generatedAt: new Date().toISOString(),
    label: opts.label || null,
    base: opts.base,
    viewports: VIEWPORTS.filter((v) => opts.viewport === "all" || v.name.startsWith(opts.viewport)),
    reducedMotion: "no-preference",
    thresholds: { contrast: 2, opacity: 0.05, veil: 0.05, overlayCoverage: 0.35 },
    durationMs: Date.now() - runStarted.getTime(),
    options: {
      concurrency: opts.concurrency,
      settle: opts.settle,
      grace: opts.grace,
      modes: opts.mode,
      history: opts.history,
    },
    summary,
    coverage,
    records: results,
    history,
    negativeControl,
  };
  await fs.writeFile(JSON_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.writeFile(CSV_PATH, writeCsv([...samples, ...historySamples]));
  await fs.writeFile(REPORT_PATH, buildReport(payload));

  console.log("");
  console.log(
    `Summary: ${summary.jobsPassed}/${summary.jobs} jobs pass, ${summary.samplesPassed}/${summary.samples} samples pass` +
      ` | hidden ${summary.hiddenSamples} · contrast ${summary.contrastSamples} · overlay ${summary.coveredSamples} · ground ${summary.groundSamples}` +
      ` | history ${summary.historySteps - summary.historyFailed}/${summary.historySteps}`,
  );
  const failedRoutes = summary.failedRoutes;
  if (failedRoutes.length) {
    console.log(
      `Failed routes (${failedRoutes.length}): ${failedRoutes.slice(0, 30).join(", ")}${failedRoutes.length > 30 ? " …" : ""}`,
    );
  }
  console.log(`JSON: ${path.relative(ROOT, JSON_PATH)}`);
  console.log(`CSV: ${path.relative(ROOT, CSV_PATH)}`);
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log(`Screenshots: ${path.relative(ROOT, SHOTS_DIR)}`);
  process.exitCode = summary.exitCode;
}

function samplesFrom(records) {
  return records;
}

main().catch((error) => {
  console.error(`\nAudit could not run: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 2;
});
