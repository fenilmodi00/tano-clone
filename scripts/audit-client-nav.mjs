#!/usr/bin/env node
/**
 * Site-wide client-navigation regression audit.
 *
 * For every route in docs/research/tano/routes.json:
 *   1. load "/" (fresh document),
 *   2. navigate client-side to the target — by clicking a real internal
 *      anchor when one exists, otherwise by dispatching a click on a
 *      temporary anchor so the delegated useClientNav handler runs,
 *   3. wait for the pathname and network to settle,
 *   4. assert the destination is actually visible (main text, first heading
 *      opacity / reveal state, console + page errors, horizontal overflow,
 *      scroll at top).
 *
 * It also exercises browser Back/Forward across three routes and a direct
 * load. Failures get a viewport screenshot; every run writes machine-readable
 * JSON.
 *
 * Usage:
 *   node scripts/audit-client-nav.mjs
 *   node scripts/audit-client-nav.mjs --base http://127.0.0.1:3000 \
 *     --label baseline --json docs/verify/client-nav/baseline.json
 *
 * Exit codes: 0 = every route visible, 1 = at least one failure,
 *             2 = the dev server never answered.
 */

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const ROUTES_FILE = path.join(ROOT, "docs/research/tano/routes.json");
const DEFAULT_BASE = process.env.CLIENT_NAV_BASE || "http://127.0.0.1:3000";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function usage() {
  return `Usage: node scripts/audit-client-nav.mjs [options]

  --base <url>       Origin to audit (default ${DEFAULT_BASE})
  --json <file>      Machine-readable output (default docs/verify/client-nav/results.json)
  --shots <dir>      Failure screenshots (default docs/verify/client-nav/failures)
  --label <text>     Free-form label stored in the JSON
  --width <px>       Viewport width (default 1440)
  --height <px>      Viewport height (default 900)
  --settle <ms>      Extra settle time after each navigation (default 1000)
  --timeout <ms>     Per-navigation timeout (default 20000)
  --wait-server <ms> How long to wait for the dev server (default 45000)
  --only <list>      Comma-separated route substrings to audit
  --no-history       Skip the Back/Forward + direct-load section
  --help             Show this help`;
}

function parseArgs(argv) {
  const opts = {
    base: DEFAULT_BASE.replace(/\/+$/, ""),
    json: "docs/verify/client-nav/results.json",
    shots: "docs/verify/client-nav/failures",
    label: "",
    width: 1440,
    height: 900,
    settle: 1000,
    timeout: 20000,
    waitServer: 45000,
    only: null,
    history: true,
  };
  const numberKeys = new Set(["width", "height", "settle", "timeout", "waitServer"]);
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (arg === "--no-history") {
      opts.history = false;
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
  return opts;
}

const opts = parseArgs(process.argv.slice(2));
const jsonPath = path.resolve(ROOT, opts.json);
const shotsDir = path.resolve(ROOT, opts.shots);
const runStarted = new Date();

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
    typeof entry === "string"
      ? { route: entry, slug: entry.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home" }
      : entry,
  );
  if (!opts.only) return routes;
  return routes.filter((entry) => opts.only.some((needle) => entry.route.includes(needle)));
}

/** Attach console/page-error and in-flight-request tracking to one page. */
function instrument(page) {
  const errors = [];
  const inflight = new Set();
  let errorMark = 0;

  page.on("pageerror", (error) => {
    errors.push({ kind: "pageerror", text: String(error.message).slice(0, 400), url: "" });
  });
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const location = message.location();
    errors.push({
      kind: "console",
      text: message.text().slice(0, 400),
      url: (location?.url || "").slice(0, 400),
    });
  });
  page.on("request", (request) => {
    if (request.resourceType() === "websocket" || request.resourceType() === "eventsource") return;
    inflight.add(request);
  });
  const done = (request) => inflight.delete(request);
  page.on("requestfinished", done);
  page.on("requestfailed", done);

  return {
    markErrors() {
      errorMark = errors.length;
    },
    takeErrors() {
      return errors.slice(errorMark).map((error) => ({ ...error }));
    },
    inflightCount() {
      return inflight.size;
    },
  };
}

async function waitNetworkQuiet(page, instrumented, idleMs = 500, timeoutMs = 8000) {
  const start = Date.now();
  let quietSince = 0;
  while (true) {
    if (instrumented.inflightCount() === 0) {
      if (!quietSince) quietSince = Date.now();
      if (Date.now() - quietSince >= idleMs) return { idle: true, ms: Date.now() - start };
    } else {
      quietSince = 0;
    }
    if (Date.now() - start >= timeoutMs) {
      return { idle: false, ms: Date.now() - start, inflight: instrumented.inflightCount() };
    }
    await sleep(100);
  }
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

async function waitForHydration(page) {
  // React attaches its props/fiber expando to host nodes during hydration.
  // Waiting for it keeps the first click from racing the delegated handler.
  await page
    .waitForFunction(
      () => {
        const anchor = document.querySelector("a[href]");
        if (!anchor) return false;
        return Object.keys(anchor).some(
          (key) => key.startsWith("__reactProps$") || key.startsWith("__reactFiber$"),
        );
      },
      { timeout: 8000 },
    )
    .catch(() => {});
  await page.waitForTimeout(150);
}

async function gotoWithRetry(page, url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await page.goto(url, { waitUntil: "domcontentloaded", timeout: opts.timeout });
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(1000 * attempt);
    }
  }
  throw lastError;
}

async function loadHome(page, instrumented) {
  await gotoWithRetry(page, `${opts.base}/`);
  await page.waitForSelector("main", { timeout: opts.timeout });
  await waitNetworkQuiet(page, instrumented, 400, 6000);
  await waitForFonts(page);
  await waitForHydration(page);
}

async function waitForPath(page, expectedPath, timeoutMs = 6000) {
  const started = Date.now();
  try {
    await page.waitForFunction((expected) => location.pathname === expected, expectedPath, {
      timeout: timeoutMs,
    });
    return { ok: true, ms: Date.now() - started, actual: expectedPath };
  } catch {
    const actual = await page.evaluate(() => location.pathname).catch(() => "");
    return { ok: false, ms: Date.now() - started, actual };
  }
}

/** Pick, mark and return the best real internal anchor for a route. */
async function findAnchor(page, expectedPath) {
  return page.evaluate((targetPath) => {
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
      if (url.origin !== location.origin || url.pathname !== targetPath) continue;
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
  }, expectedPath);
}

/** Dispatch a click on a temporary anchor so useClientNav handles it. */
async function clickTemporaryAnchor(page, route) {
  return page.evaluate((href) => {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.id = "__client_nav_audit_anchor";
    anchor.textContent = "client nav audit";
    anchor.style.cssText =
      "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;z-index:2147483647";
    document.body.appendChild(anchor);
    const dispatched = anchor.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, view: window }),
    );
    anchor.remove();
    return dispatched;
  }, route);
}

/**
 * Client-side navigation: click the best real anchor (pointer click when it is
 * actionable, DOM click for anchors parked in closed menus), fall back to a
 * temporary anchor for routes with no real link on the current page.
 */
async function clientNavigate(page, expectedPath) {
  const beforePath = await page.evaluate(() => location.pathname);
  const result = {
    via: "temp",
    anchor: null,
    beforePath,
    fallback: false,
    dispatchResult: null,
    nav: { ok: false, ms: 0, actual: beforePath },
  };
  if (beforePath === expectedPath) {
    result.via = "initial";
    result.nav = { ok: true, ms: 0, actual: beforePath };
    return result;
  }

  const anchor = await findAnchor(page, expectedPath);
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
    let clickedWithPointer = false;
    if (anchor.visible) {
      try {
        const locator = page.locator('[data-audit-anchor="1"]').first();
        await locator.scrollIntoViewIfNeeded({ timeout: 2500 });
        await locator.click({ timeout: 2500 });
        clickedWithPointer = true;
      } catch {
        // Covered by a sticky overlay or not actionable — use the DOM path.
      }
    }
    if (!clickedWithPointer) {
      await page
        .locator('[data-audit-anchor="1"]')
        .first()
        .evaluate((element) => element.click());
    }
    result.via = clickedWithPointer ? "anchor" : "anchor-dom";
    result.nav = await waitForPath(page, expectedPath, 4000);

    if (!result.nav.ok) {
      // The anchor existed but did not produce a client navigation. Retry
      // through the delegated handler so the destination page is still audited.
      result.fallback = true;
      result.dispatchResult = await clickTemporaryAnchor(page, expectedPath).catch(() => false);
      result.via = "temp-after-anchor";
      result.nav = await waitForPath(page, expectedPath, 6000);
    }
  } else {
    result.dispatchResult = await clickTemporaryAnchor(page, expectedPath);
    result.via = "temp";
    result.nav = await waitForPath(page, expectedPath, 6000);
  }

  return result;
}

async function settleAfterNav(page, instrumented, { requireScrollTop }) {
  const network = await waitNetworkQuiet(page, instrumented, 500, 8000);
  await waitForFonts(page);
  await page.waitForTimeout(opts.settle);
  let scroll = { ok: null, y: null, ms: 0 };
  if (requireScrollTop) {
    const started = Date.now();
    let y = await page.evaluate(() => Math.round(window.scrollY)).catch(() => NaN);
    while (Number.isFinite(y) && y > 5 && Date.now() - started < 3000) {
      await page.waitForTimeout(100);
      y = await page.evaluate(() => Math.round(window.scrollY)).catch(() => NaN);
    }
    scroll = { ok: Number.isFinite(y) && y <= 5, y, ms: Date.now() - started };
  }
  return { network, scroll };
}

async function readMetrics(page) {
  return page.evaluate(() => {
    const main = document.querySelector("main");
    const heading = main?.querySelector("h1, h2") || null;
    const headingStyle = heading ? getComputedStyle(heading) : null;
    const words = heading ? Array.from(heading.querySelectorAll(".rv-word")) : [];
    const wordOpacities = words.map((word) => Number(getComputedStyle(word).opacity));
    const revealScope = document.querySelector(".rv-scope main");
    const documentElement = document.documentElement;
    return {
      pathname: location.pathname,
      textLength: (main?.innerText || "").replace(/\s+/g, " ").trim().length,
      heading: heading
        ? {
            tag: heading.tagName.toLowerCase(),
            opacity: Number(headingStyle?.opacity ?? 0),
            words: words.length,
            maxWordOpacity: wordOpacities.length ? Math.max(...wordOpacities) : null,
            text: (heading.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100),
          }
        : null,
      rvIn: revealScope ? revealScope.querySelectorAll(".rv-in").length : 0,
      scrollY: Math.round(window.scrollY),
      overflowPx: Math.max(
        0,
        documentElement.scrollWidth - documentElement.clientWidth,
        document.body?.scrollWidth ? document.body.scrollWidth - documentElement.clientWidth : 0,
      ),
    };
  });
}

function judge(record, errors, { requireScrollTop }) {
  const reasons = [];
  const metrics = record.metrics;
  const expectedPath = record.expectedPath;

  if (!record.nav.ok) {
    reasons.push(`nav:${record.via} timeout (at ${record.nav.actual || "?"})`);
  }
  if (metrics.pathname !== expectedPath) {
    reasons.push(`path:${metrics.pathname || "?"}≠${expectedPath}`);
  }
  if (!(metrics.textLength > 20)) {
    reasons.push(`text:${metrics.textLength}≤20`);
  }
  const heading = metrics.heading;
  const wordsVisible = !heading || heading.words === 0 || (heading.maxWordOpacity ?? 0) > 0.01;
  const headingVisible = Boolean(heading) && heading.opacity > 0.01 && wordsVisible;
  const revealRan = metrics.rvIn > 0;
  record.checks.heading = headingVisible;
  record.checks.reveal = revealRan;
  if (!headingVisible && !revealRan) {
    const opacity = heading ? heading.opacity.toFixed(2) : "none";
    const wordOpacity = heading?.maxWordOpacity == null ? "-" : heading.maxWordOpacity.toFixed(2);
    reasons.push(`hidden:h1=${opacity} words=${wordOpacity} rv-in=${metrics.rvIn}`);
  }
  if (errors.length > 0) {
    reasons.push(`errors:${errors.length}`);
  }
  if (metrics.overflowPx > 1) {
    reasons.push(`overflow:${metrics.overflowPx}px`);
  }
  if (requireScrollTop && record.scroll && !record.scroll.ok) {
    reasons.push(`scroll:${record.scroll.y}`);
  }
  record.checks.path = metrics.pathname === expectedPath;
  record.checks.text = metrics.textLength > 20;
  record.checks.console = errors.length === 0;
  record.checks.overflow = metrics.overflowPx <= 1;
  record.checks.scrollTop = requireScrollTop ? Boolean(record.scroll?.ok) : null;
  record.ok = reasons.length === 0;
  record.failureReasons = reasons;
  return record;
}

async function captureFailure(page, name) {
  const file = path.join(shotsDir, `${name}.jpg`);
  try {
    await page.screenshot({ path: file, type: "jpeg", quality: 55, fullPage: false });
    return path.relative(ROOT, file);
  } catch {
    return null;
  }
}

async function auditRoute(page, instrumented, entry, index) {
  const expectedPath = new URL(entry.route, opts.base).pathname;
  const started = Date.now();
  const record = {
    index,
    route: entry.route,
    slug: entry.slug || String(index),
    expectedPath,
    ok: false,
    via: "unknown",
    note: null,
    nav: { ok: false, ms: 0, actual: "" },
    anchor: null,
    fallback: false,
    checks: {},
    metrics: {},
    errors: [],
    scroll: null,
    network: null,
    failureReasons: [],
    screenshot: null,
    ms: 0,
  };

  try {
    await loadHome(page, instrumented);
    instrumented.markErrors();

    if (expectedPath === "/talk-to-us") {
      // The site-wide drawer owns every unmodified /talk-to-us click; the URL
      // is deliberately left alone. The route itself is audited by direct load.
      await gotoWithRetry(page, `${opts.base}${entry.route}`);
      await page.waitForSelector("main", { timeout: opts.timeout });
      record.via = "direct";
      record.nav = { ok: true, ms: 0, actual: expectedPath };
      record.note = "drawer intercepts client-side /talk-to-us clicks; audited by direct load";
    } else if (expectedPath === "/") {
      record.via = "initial";
      record.nav = { ok: true, ms: 0, actual: "/" };
    } else {
      const nav = await clientNavigate(page, expectedPath);
      record.via = nav.via;
      record.nav = nav.nav;
      record.anchor = nav.anchor;
      record.fallback = nav.fallback;
    }

    const settle = await settleAfterNav(page, instrumented, { requireScrollTop: true });
    record.network = settle.network;
    record.scroll = settle.scroll;
    record.metrics = await readMetrics(page);
    record.errors = instrumented.takeErrors();
    judge(record, record.errors, { requireScrollTop: true });
  } catch (error) {
    record.nav.ok = false;
    record.failureReasons.push(
      `exception:${error instanceof Error ? error.message : String(error)}`,
    );
    record.errors = instrumented.takeErrors();
    try {
      record.metrics = await readMetrics(page);
    } catch {
      record.metrics = {};
    }
    record.ok = false;
  }

  record.ms = Date.now() - started;
  if (!record.ok) {
    record.screenshot = await captureFailure(
      page,
      `${String(index).padStart(2, "0")}-${record.slug}`,
    );
  }
  return record;
}

function pickHistoryRoutes(routes) {
  const available = new Set(routes.map((entry) => entry.route));
  const preferred = ["/guides", "/case-studies", "/news"];
  const picks = preferred.filter((route) => available.has(route));
  for (const entry of routes) {
    if (picks.length >= 3) break;
    if (entry.route !== "/" && !picks.includes(entry.route)) picks.push(entry.route);
  }
  return picks.slice(0, 3);
}

async function auditHistory(page, instrumented, routes) {
  const picks = pickHistoryRoutes(routes);
  if (picks.length < 2) return [];
  const steps = [];
  for (const route of picks) steps.push({ kind: "client", route, name: `push-${route}` });
  for (let i = picks.length - 1; i > 0; i -= 1) {
    steps.push({ kind: "back", route: picks[i - 1], name: `back-to-${picks[i - 1]}` });
  }
  steps.push({ kind: "forward", route: picks[1], name: `forward-to-${picks[1]}` });
  steps.push({
    kind: "direct",
    route: picks[picks.length - 1],
    name: `direct-${picks[picks.length - 1]}`,
  });

  const results = [];
  await loadHome(page, instrumented);

  for (const step of steps) {
    const expectedPath = new URL(step.route, opts.base).pathname;
    const started = Date.now();
    const record = {
      step: step.name,
      kind: step.kind,
      route: step.route,
      expectedPath,
      ok: false,
      via: null,
      nav: { ok: false, ms: 0, actual: "" },
      checks: {},
      metrics: {},
      errors: [],
      scroll: null,
      network: null,
      failureReasons: [],
      screenshot: null,
      ms: 0,
    };
    instrumented.markErrors();
    try {
      if (step.kind === "client") {
        const nav = await clientNavigate(page, expectedPath);
        record.via = nav.via;
        record.nav = nav.nav;
        record.anchor = nav.anchor;
        record.fallback = nav.fallback;
      } else if (step.kind === "back" || step.kind === "forward") {
        record.via = step.kind;
        try {
          await (step.kind === "back"
            ? page.goBack({ timeout: 5000 })
            : page.goForward({ timeout: 5000 }));
        } catch {
          await page.evaluate(
            (direction) => (direction === "back" ? history.back() : history.forward()),
            step.kind,
          );
        }
        record.nav = await waitForPath(page, expectedPath, 6000);
      } else {
        record.via = "direct";
        await gotoWithRetry(page, `${opts.base}${step.route}`);
        await page.waitForSelector("main", { timeout: opts.timeout });
        record.nav = { ok: true, ms: 0, actual: expectedPath };
      }

      const settle = await settleAfterNav(page, instrumented, {
        requireScrollTop: step.kind === "direct",
      });
      record.network = settle.network;
      record.scroll = settle.scroll;
      record.metrics = await readMetrics(page);
      record.errors = instrumented.takeErrors();
      judge(record, record.errors, { requireScrollTop: step.kind === "direct" });
    } catch (error) {
      record.nav.ok = false;
      record.failureReasons.push(
        `exception:${error instanceof Error ? error.message : String(error)}`,
      );
      record.errors = instrumented.takeErrors();
      record.ok = false;
    }
    record.ms = Date.now() - started;
    if (!record.ok) {
      record.screenshot = await captureFailure(
        page,
        `history-${step.name.replace(/[^a-z0-9-]+/gi, "-")}`,
      );
    }
    results.push(record);
  }
  return results;
}

function pad(value, width) {
  const text = String(value ?? "");
  return text.length >= width ? text : text + " ".repeat(width - text.length);
}

function printTable(records) {
  console.log(
    `${pad("#", 3)} ${pad("ROUTE", 56)} ${pad("RESULT", 7)} ${pad("VIA", 17)} ${pad("PATH", 5)} ${pad("TXT", 6)} ${pad("H1/RV", 11)} ${pad("SCROLL", 7)} ${pad("OVF", 5)} ${pad("ERR", 4)}`,
  );
  console.log("-".repeat(132));
  for (const record of records) {
    const metrics = record.metrics || {};
    const heading = metrics.heading;
    const h1 = heading
      ? `${heading.opacity.toFixed(2)}/${metrics.rvIn ?? "?"}`
      : `none/${metrics.rvIn ?? "?"}`;
    console.log(
      `${pad(record.index, 3)} ${pad(record.route, 56)} ${pad(record.ok ? "PASS" : "FAIL", 7)} ${pad(record.via, 17)} ${pad(record.checks?.path ? "ok" : "bad", 5)} ${pad(metrics.textLength ?? "?", 6)} ${pad(h1, 11)} ${pad(record.scroll?.y ?? "?", 7)} ${pad(metrics.overflowPx ?? "?", 5)} ${pad(record.errors?.length ?? "?", 4)}`,
    );
  }
}

function printFailureReasons(records) {
  const failed = records.filter((record) => !record.ok);
  if (!failed.length) return;
  console.log("\nFailures");
  for (const record of failed) {
    const errorText = (record.errors || [])
      .slice(0, 2)
      .map((error) => error.text.replace(/\s+/g, " ").slice(0, 110))
      .join(" | ");
    console.log(
      `- ${record.route} [${record.via}] ${record.failureReasons.join("; ")}${errorText ? ` :: ${errorText}` : ""}`,
    );
  }
}

function printHistory(history) {
  if (!history.length) return;
  console.log("\nHistory / direct load");
  for (const record of history) {
    const metrics = record.metrics || {};
    console.log(
      `${pad(record.step, 44)} ${pad(record.ok ? "PASS" : "FAIL", 7)} ${pad(record.via, 8)} path=${pad(metrics.pathname ?? "?", 34)} h1=${pad(metrics.heading?.opacity ?? "?", 5)} rv-in=${pad(metrics.rvIn ?? "?", 4)} scroll=${pad(record.scroll?.y ?? "-", 6)} errors=${record.errors?.length ?? "?"}`,
    );
  }
  const failed = history.filter((record) => !record.ok);
  for (const record of failed) {
    console.log(`- ${record.step}: ${record.failureReasons.join("; ")}`);
  }
}

async function main() {
  const routes = await loadRoutes();
  if (!routes.length) throw new Error("No routes matched --only");

  await fs.mkdir(path.dirname(jsonPath), { recursive: true });
  await fs.mkdir(shotsDir, { recursive: true });
  // Failure shots belong to the latest run only.
  await fs.rm(shotsDir, { recursive: true, force: true });
  await fs.mkdir(shotsDir, { recursive: true });

  await waitForServer(opts.base, opts.waitServer);

  console.log(`Client navigation audit — ${opts.base}`);
  console.log(
    `Routes: ${routes.length} | viewport ${opts.width}x${opts.height} | motion: no-preference | ${runStarted.toISOString()}`,
  );

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: opts.width, height: opts.height },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    locale: "en-GB",
    timezoneId: "Europe/London",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(opts.timeout);
  const instrumented = instrument(page);

  const results = [];
  const history = [];
  try {
    for (let i = 0; i < routes.length; i += 1) {
      const record = await auditRoute(page, instrumented, routes[i], i + 1);
      results.push(record);
      const mark = record.ok ? "PASS" : "FAIL";
      console.log(`${pad(i + 1, 3)} ${pad(record.route, 56)} ${mark}`);
    }
    if (opts.history) {
      history.push(...(await auditHistory(page, instrumented, routes)));
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const failed = results.filter((record) => !record.ok);
  const historyFailed = history.filter((record) => !record.ok);
  const hidden = results.filter((record) => !record.checks?.heading && !record.checks?.reveal);

  printTable(results);
  printFailureReasons(results);
  printHistory(history);

  const payload = {
    generatedAt: new Date().toISOString(),
    label: opts.label || null,
    base: opts.base,
    viewport: { width: opts.width, height: opts.height },
    reducedMotion: "no-preference",
    durationMs: Date.now() - runStarted.getTime(),
    summary: {
      total: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      hidden: hidden.map((record) => record.route),
      historyTotal: history.length,
      historyFailed: historyFailed.length,
      exitCode: failed.length + historyFailed.length > 0 ? 1 : 0,
    },
    routes: results,
    history,
  };
  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(
    `\nSummary: ${payload.summary.passed}/${payload.summary.total} routes pass, ${payload.summary.failed} fail` +
      (history.length
        ? ` | history ${payload.summary.historyTotal - payload.summary.historyFailed}/${payload.summary.historyTotal} pass`
        : ""),
  );
  console.log(`JSON: ${path.relative(ROOT, jsonPath)}`);
  if (failed.length || historyFailed.length) {
    console.log(`Screenshots: ${path.relative(ROOT, shotsDir)}`);
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }
}

main().catch(async (error) => {
  console.error(`\nAudit could not run: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 2;
});
