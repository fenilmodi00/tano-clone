#!/usr/bin/env node
/**
 * Navigation regression checks for the Tano replica.
 *
 * Five independent checks run in Chromium at one viewport against a single
 * base URL (the local dev server or a tunnel):
 *
 *   1. no-footer-landing  /guides is scrolled to 2400, then the header mark
 *                         is clicked. The settled home route must start at
 *                         the top, with the footer below the viewport and
 *                         the chrome visible; the nav intro must not replay
 *                         and the document must not reload.
 *   2. dropdown-close     The Resources dropdown closes after choosing an
 *                         item and navigating to /compare.
 *   3. menu-navigation    A Use Cases item navigates client-side, leaving the
 *                         nav settled and the destination's main content
 *                         committed at the top, with its dropdown closed.
 *   4. hydration-guard    Four direct loads must not log a hydration console
 *                         or page error. Other console errors are logged,
 *                         not fatal.
 *   5. no-empty-page      Each of the four routes has a main, real body text
 *                         and either a visible reveal (`.rv-scope .rv-in`)
 *                         or a visible main heading.
 *
 * Usage:
 *   node scripts/check-nav-regressions.mjs [base] [--help]
 *
 * The base is the first positional argument, then NAV_BASE, then
 * http://127.0.0.1:3000. JSON goes to stdout; the human summary goes to
 * stderr. Exit codes: 0 = every check passed, 1 = a check failed,
 * 2 = bad arguments.
 */
import { chromium } from "playwright";

const DEFAULT_BASE = "http://127.0.0.1:3000";
const VIEWPORT = { width: 1568, height: 829 };
const GOTO_TIMEOUT = 45_000;
const NAV_TIMEOUT = 15_000;
const POLL_INTERVAL = 100;
const CHECK_ROUTES = ["/", "/for-creators", "/compare", "/guides"];
const HYDRATION_PATTERN = /hydration|minified react error|text content does not match/i;
const MARKER = "tano-nav-regression-marker";

function usage() {
  return `Usage: node scripts/check-nav-regressions.mjs [base] [--help]

  base        Origin to test, without a trailing slash.
              Default: NAV_BASE, then ${DEFAULT_BASE}.
  --help, -h  Show this help.

Checks:
  no-footer-landing  /guides scrolled to 2400, then the header logo: / starts
                     at the top, footer below the viewport, chrome visible,
                     nav intro not replayed, no document reload.
  dropdown-close     The Resources dropdown closes after navigating to
                     /compare.
  menu-navigation    A Use Cases link navigates client-side, nav settled,
                     destination at the top, dropdown closed.
  hydration-guard    /, /for-creators, /compare and /guides load without a
                     hydration console or page error.
  no-empty-page      Those four routes have a main, >200 characters of body
                     text, and a visible .rv-in reveal or visible main h1/h2.

Output is { base, checks, errors } on stdout plus a summary on stderr.
Exit 1 when any check fails.`;
}

function parseArgs(argv) {
  const positional = [];
  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") return { help: true };
    if (arg.startsWith("-")) return { error: `Unknown option: ${arg}` };
    positional.push(arg);
  }
  if (positional.length > 1) return { error: "Expected at most one base URL." };
  return { base: positional[0] ?? process.env.NAV_BASE ?? DEFAULT_BASE };
}

function normalizeBase(raw) {
  const trimmed = raw.replace(/\/+$/, "");
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return trimmed;
  } catch {
    return null;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function shorten(value, max = 320) {
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function routeUrl(base, route) {
  return `${base}${route}`;
}

function pathnameOf(raw) {
  try {
    return new URL(raw).pathname;
  } catch {
    return "";
  }
}

function samePath(actual, expected) {
  const normalize = (path) => (path.length > 1 ? path.replace(/\/+$/, "") : path);
  return normalize(actual) === normalize(expected);
}

const errors = [];
const logged = new Set();

function logError(message) {
  const text = shorten(message, 420);
  if (logged.has(text) || errors.length >= 50) return;
  logged.add(text);
  errors.push(text);
}

async function poll(read, accept, { timeout, interval = POLL_INTERVAL }) {
  const started = Date.now();
  let value;
  for (;;) {
    try {
      value = await read();
    } catch (error) {
      value = { readError: shorten(error?.message ?? error) };
    }
    if (value && !value.readError && accept(value)) {
      return { ok: true, value, waited: Date.now() - started };
    }
    if (Date.now() - started >= timeout) {
      return { ok: false, value, waited: Date.now() - started };
    }
    await sleep(interval);
  }
}

/**
 * Wait for the nav to report "settled" for a short stable window. Server
 * markup starts at "settled" too, so an immediate sample can precede the
 * intro effect; requiring it to stay settled lets that intro start first.
 */
async function waitForSettledNav(page, timeout = 5000) {
  const started = Date.now();
  let settledSince = 0;
  let state = null;
  for (;;) {
    try {
      state = await readNavState(page);
    } catch (error) {
      state = { readError: shorten(error?.message ?? error) };
    }
    if (state.stage === "settled") {
      if (settledSince === 0) settledSince = Date.now();
      if (Date.now() - settledSince >= 150) {
        return { ok: true, value: state, waited: Date.now() - started };
      }
    } else {
      settledSince = 0;
    }
    if (Date.now() - started >= timeout) {
      return { ok: false, value: state, waited: Date.now() - started };
    }
    await sleep(60);
  }
}

async function openPage(browser) {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  return { context, page, consoleErrors, pageErrors };
}

async function gotoRoute(page, url, settleMs = 0) {
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: GOTO_TIMEOUT });
  if (!response) throw new Error(`no response for ${url}`);
  if (response.status() >= 400) throw new Error(`HTTP ${response.status()} for ${url}`);
  if (settleMs > 0) await sleep(settleMs);
}

function readNavState(page) {
  return page.evaluate(() => {
    const bar = document.querySelector(".wire-nav-bar");
    const chrome = document.querySelector(".wire-chrome");
    const footer = document.querySelector(".wire-footer");
    const main = document.querySelector("main");
    const loading = document.querySelector(".wire-loading");
    return {
      pathname: location.pathname,
      scrollY: Math.round(window.scrollY),
      viewport: window.innerHeight,
      stage: bar ? bar.getAttribute("data-stage") : null,
      chromeHidden: chrome ? chrome.getAttribute("data-hidden") : null,
      footerTop: footer ? Math.round(footer.getBoundingClientRect().top) : null,
      hasMain: Boolean(main),
      mainTextLength: main ? main.innerText.trim().length : 0,
      loadingPresent: Boolean(loading),
      loadingVisible: loading ? loading.getClientRects().length > 0 : false,
      marker: window.__marker ?? null,
      dropdowns: Array.from(document.querySelectorAll(".wire-nav-dropdown")).map((element) => ({
        open: element.getAttribute("data-open"),
        hidden: element.hidden,
      })),
    };
  });
}

function dropdownsOpen(state) {
  if (!state?.dropdowns) return [];
  return state.dropdowns.filter((dropdown) => dropdown.open !== "false" || !dropdown.hidden);
}

/** The route's own content has committed and the loading shell is gone. */
function destinationSettled(state) {
  return Boolean(
    state &&
      !state.readError &&
      state.hasMain &&
      state.mainTextLength > 200 &&
      !state.loadingVisible,
  );
}

function describeState(state) {
  if (!state) return "no sample";
  if (state.readError) return `page read failed: ${state.readError}`;
  const dropdowns =
    state.dropdowns.length === 0
      ? "none"
      : state.dropdowns
          .map((dropdown) => `${dropdown.open}/${dropdown.hidden ? "hidden" : "shown"}`)
          .join(",");
  const mainState = state.hasMain ? `main=${state.mainTextLength}ch` : "main=missing";
  const loadingState = !state.loadingPresent
    ? "loading=none"
    : state.loadingVisible
      ? "loading=visible"
      : "loading=empty";
  return `path=${state.pathname} scrollY=${state.scrollY} stage=${state.stage} chromeHidden=${state.chromeHidden} footerTop=${state.footerTop}/${state.viewport} ${mainState} ${loadingState} dropdowns=${dropdowns}`;
}

async function checkNoFooterLanding(browser, base) {
  const session = await openPage(browser);
  const { page } = session;
  try {
    await gotoRoute(page, routeUrl(base, "/guides"), 1200);

    const settled = await waitForSettledNav(page);
    if (!settled.ok) {
      return {
        ok: false,
        detail: `nav never settled on /guides before the click (${describeState(settled.value)})`,
      };
    }

    await page.evaluate((marker) => {
      window.__marker = marker;
      window.scrollTo(0, 2400);
    }, MARKER);

    const scrolled = await poll(
      () => readNavState(page),
      (state) => state.scrollY >= 2000,
      { timeout: 2000 },
    );

    let clickError = null;
    try {
      await page.locator(".wire-nav-mark").click({ timeout: 10_000 });
    } catch (error) {
      clickError = shorten(error?.message ?? error);
    }

    const samples = [];
    let final = null;

    const sampleNow = async () => {
      let sample;
      try {
        sample = await readNavState(page);
      } catch (error) {
        sample = {
          readError: shorten(error?.message ?? error),
          pathname: null,
          scrollY: null,
          viewport: null,
          stage: null,
          chromeHidden: null,
          footerTop: null,
          hasMain: false,
          mainTextLength: 0,
          loadingPresent: false,
          loadingVisible: false,
          marker: null,
          dropdowns: [],
        };
      }
      samples.push(sample);
      final = sample;
      return sample;
    };

    const readyAtHome = (sample) =>
      samePath(sample.pathname ?? "", "/") &&
      destinationSettled(sample) &&
      typeof sample.scrollY === "number" &&
      sample.scrollY <= 4 &&
      typeof sample.footerTop === "number" &&
      typeof sample.viewport === "number" &&
      sample.footerTop >= sample.viewport &&
      sample.chromeHidden !== "true";

    if (clickError) {
      await sampleNow();
    } else {
      const urlDeadline = Date.now() + 8000;
      for (;;) {
        const sample = await sampleNow();
        if (samePath(sample.pathname ?? "", "/")) break;
        if (Date.now() >= urlDeadline) break;
        await sleep(POLL_INTERVAL);
      }

      if (samePath(final?.pathname ?? "", "/")) {
        const settleDeadline = Date.now() + 8000;
        for (;;) {
          const sample = await sampleNow();
          if (readyAtHome(sample)) break;
          if (Date.now() >= settleDeadline) break;
          await sleep(POLL_INTERVAL);
        }
      }
    }

    const failures = [];
    if (clickError) failures.push(`header mark click failed: ${clickError}`);
    if (!scrolled.ok) {
      failures.push(
        `/guides did not scroll to 2400 before the click (${describeState(scrolled.value)})`,
      );
    }
    if (!clickError && samePath(final?.pathname ?? "", "/") && !destinationSettled(final)) {
      failures.push(
        `destination did not settle within 8 s of the URL change (${describeState(final)})`,
      );
    }
    if (!samePath(final?.pathname ?? "", "/")) {
      failures.push(`landed on ${final?.pathname ?? "an unknown URL"} instead of /`);
    }
    if (typeof final?.scrollY !== "number" || final.scrollY > 4) {
      failures.push(`final scrollY is ${final?.scrollY ?? "unknown"}, expected <= 4`);
    }
    if (
      typeof final?.footerTop !== "number" ||
      typeof final?.viewport !== "number" ||
      final.footerTop < final.viewport
    ) {
      failures.push(
        `footer top is ${final?.footerTop ?? "missing"}/${final?.viewport ?? "unknown"}, expected below the viewport`,
      );
    }
    if (final?.chromeHidden === "true") failures.push(".wire-chrome is still data-hidden=true");

    const unsettled = samples.filter((sample) => sample.stage !== "settled");
    if (unsettled.length > 0) {
      const stages = [...new Set(unsettled.map((sample) => sample.stage ?? "missing"))];
      failures.push(
        `nav stage was not settled in ${unsettled.length}/${samples.length} post-click samples (${stages.join(", ")})`,
      );
    }
    const markerLost = samples.filter((sample) => sample.marker !== MARKER);
    if (markerLost.length > 0) {
      failures.push(
        `window.__marker was missing in ${markerLost.length}/${samples.length} post-click samples (document reloaded)`,
      );
    }

    if (failures.length > 0) return { ok: false, detail: failures.join("; ") };
    return {
      ok: true,
      detail: `landed on / at scrollY=${final.scrollY}, footerTop=${final.footerTop}/${final.viewport}, mainText=${final.mainTextLength}ch; nav settled in all ${samples.length} samples; marker survived`,
    };
  } finally {
    await session.context.close().catch(() => {});
  }
}

async function checkDropdownClose(browser, base) {
  const session = await openPage(browser);
  const { page } = session;
  try {
    await gotoRoute(page, routeUrl(base, "/guides"));

    const settled = await waitForSettledNav(page);
    if (!settled.ok) {
      return {
        ok: false,
        detail: `nav never settled on /guides before hovering Resources (${describeState(settled.value)})`,
      };
    }

    const trigger = page.locator('button[aria-controls="nav-Resources"]');
    await trigger.hover({ timeout: 10_000 });
    await sleep(250);
    const opened = await page
      .locator("#nav-Resources")
      .evaluate((element) => ({ open: element.getAttribute("data-open"), hidden: element.hidden }));
    if (opened.open !== "true" || opened.hidden) {
      return {
        ok: false,
        detail: `Resources dropdown did not open on hover (data-open=${opened.open}, hidden=${opened.hidden})`,
      };
    }

    await page.locator('#nav-Resources a[href="/compare"]').click({ timeout: 10_000 });
    const arrived = await poll(
      async () => ({ pathname: pathnameOf(page.url()) }),
      (state) => samePath(state.pathname, "/compare"),
      { timeout: NAV_TIMEOUT },
    );
    if (!arrived.ok) {
      return {
        ok: false,
        detail: `did not reach /compare after choosing it (at ${arrived.value?.pathname ?? "an unknown URL"})`,
      };
    }

    await sleep(600);
    const state = await readNavState(page);
    const stillOpen = dropdownsOpen(state);
    if (stillOpen.length > 0) {
      return {
        ok: false,
        detail: `${stillOpen.length}/${state.dropdowns.length} dropdown(s) still open 600 ms after navigating to /compare (${describeState(state)})`,
      };
    }
    return {
      ok: true,
      detail: `Resources opened on hover and all ${state.dropdowns.length} dropdown(s) were closed 600 ms after navigating to /compare`,
    };
  } finally {
    await session.context.close().catch(() => {});
  }
}

async function checkMenuNavigation(browser, base) {
  const session = await openPage(browser);
  const { page } = session;
  try {
    await gotoRoute(page, routeUrl(base, "/"), 1200);

    const settled = await waitForSettledNav(page);
    if (!settled.ok) {
      return {
        ok: false,
        detail: `nav never settled on / before the click (${describeState(settled.value)})`,
      };
    }

    await page.evaluate((marker) => {
      window.__marker = marker;
    }, MARKER);

    const trigger = page.locator('button[aria-controls="nav-Use Cases"]');
    await trigger.hover({ timeout: 10_000 });
    await sleep(250);
    const opened = await page
      .locator('[id="nav-Use Cases"]')
      .evaluate((element) => ({ open: element.getAttribute("data-open"), hidden: element.hidden }));
    if (opened.open !== "true" || opened.hidden) {
      return {
        ok: false,
        detail: `Use Cases dropdown did not open on hover (data-open=${opened.open}, hidden=${opened.hidden})`,
      };
    }

    await page
      .locator('[id="nav-Use Cases"] a[href="/use-cases/drive-revenue"]')
      .click({ timeout: 10_000 });
    const arrived = await poll(
      async () => ({ pathname: pathnameOf(page.url()) }),
      (state) => samePath(state.pathname, "/use-cases/drive-revenue"),
      { timeout: NAV_TIMEOUT },
    );
    if (!arrived.ok) {
      return {
        ok: false,
        detail: `did not reach /use-cases/drive-revenue after choosing it (at ${arrived.value?.pathname ?? "an unknown URL"})`,
      };
    }

    const final = await poll(
      () => readNavState(page),
      (state) =>
        destinationSettled(state) &&
        state.marker === MARKER &&
        state.stage === "settled" &&
        state.scrollY <= 4 &&
        dropdownsOpen(state).length === 0,
      { timeout: 8000 },
    );
    if (!final.ok) {
      const reasons = [];
      const state = final.value;
      if (!destinationSettled(state)) reasons.push("destination did not settle within 8 s");
      if (state?.marker !== MARKER) reasons.push("window.__marker was lost (document reloaded)");
      if (state?.stage !== "settled") reasons.push(`nav stage is ${state?.stage ?? "missing"}`);
      if (typeof state?.scrollY !== "number" || state.scrollY > 4) {
        reasons.push(`scrollY is ${state?.scrollY ?? "unknown"}`);
      }
      if (dropdownsOpen(state).length > 0) {
        reasons.push(`${dropdownsOpen(state).length} dropdown(s) still open`);
      }
      return { ok: false, detail: `${reasons.join("; ")} (${describeState(state)})` };
    }

    return {
      ok: true,
      detail: `client-side navigation kept the marker, nav settled, scrollY=${final.value.scrollY}, mainText=${final.value.mainTextLength}ch, all dropdowns closed`,
    };
  } finally {
    await session.context.close().catch(() => {});
  }
}

async function checkHydrationGuard(browser, base) {
  const failures = [];
  let otherMessages = 0;

  for (const route of CHECK_ROUTES) {
    let session;
    try {
      session = await openPage(browser);
    } catch (error) {
      failures.push(`${route}: could not open a page (${shorten(error?.message ?? error)})`);
      continue;
    }
    try {
      await gotoRoute(session.page, routeUrl(base, route), 1500);
    } catch (error) {
      failures.push(`${route}: load failed (${shorten(error?.message ?? error)})`);
      await session.context.close().catch(() => {});
      continue;
    }

    const messages = [
      ...session.consoleErrors.map((text) => ({ source: "console", text })),
      ...session.pageErrors.map((text) => ({ source: "pageerror", text })),
    ];
    for (const message of messages) {
      if (HYDRATION_PATTERN.test(message.text)) {
        failures.push(`${route}: ${message.source} hydration error: ${shorten(message.text)}`);
      } else {
        otherMessages += 1;
        logError(`${route}: ${message.source} (logged, not fatal): ${shorten(message.text)}`);
      }
    }
    await session.context.close().catch(() => {});
  }

  if (failures.length > 0) return { ok: false, detail: failures.join("; ") };
  return {
    ok: true,
    detail: `${CHECK_ROUTES.length} routes loaded without hydration errors; ${otherMessages} other console message(s) logged`,
  };
}

async function checkNoEmptyPage(browser, base) {
  const failures = [];
  const summaries = [];

  for (const route of CHECK_ROUTES) {
    let session;
    try {
      session = await openPage(browser);
    } catch (error) {
      failures.push(`${route}: could not open a page (${shorten(error?.message ?? error)})`);
      continue;
    }
    try {
      await gotoRoute(session.page, routeUrl(base, route));
      const result = await poll(
        () =>
          session.page.evaluate(() => {
            const main = document.querySelector("main");
            const textLength = document.body.innerText.trim().length;
            const rvInCount = document.querySelectorAll(".rv-scope .rv-in").length;
            const headings = Array.from(document.querySelectorAll("main h1, main h2"));
            const headingOpacities = headings.map((element) =>
              Number.parseFloat(getComputedStyle(element).opacity),
            );
            return {
              hasMain: Boolean(main),
              textLength,
              rvInCount,
              headingCount: headings.length,
              headingOpacity: headingOpacities.length > 0 ? Math.max(...headingOpacities) : null,
            };
          }),
        (state) =>
          state.hasMain &&
          state.textLength > 200 &&
          (state.rvInCount > 0 || (state.headingOpacity ?? 0) > 0.01),
        { timeout: 6000 },
      );

      const value = result.value ?? {};
      if (!result.ok) {
        const reasons = [];
        if (!value.hasMain) reasons.push("no main");
        if (!(value.textLength > 200)) reasons.push(`body text is ${value.textLength ?? 0} chars`);
        if (!(value.rvInCount > 0) && !((value.headingOpacity ?? 0) > 0.01)) {
          reasons.push(
            `no visible reveal: .rv-in=${value.rvInCount ?? 0}, main headings=${value.headingCount ?? 0}, opacity=${value.headingOpacity ?? "none"}`,
          );
        }
        failures.push(`${route}: ${reasons.join(", ") || "not ready"}`);
      } else {
        summaries.push(
          `${route} text=${value.textLength} rv-in=${value.rvInCount} headingOpacity=${value.headingOpacity ?? "none"}/${value.headingCount}`,
        );
      }
    } catch (error) {
      failures.push(`${route}: ${shorten(error?.message ?? error)}`);
    } finally {
      await session.context.close().catch(() => {});
    }
  }

  if (failures.length > 0) return { ok: false, detail: failures.join("; ") };
  return { ok: true, detail: summaries.join("; ") };
}

async function runCheck(name, fn) {
  try {
    const result = await fn();
    return { name, ok: Boolean(result.ok), detail: result.detail };
  } catch (error) {
    return { name, ok: false, detail: `threw: ${shorten(error?.stack ?? error)}` };
  }
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(usage());
  process.exit(0);
}
if (args.error) {
  console.error(`${args.error}\n`);
  console.error(usage());
  process.exit(2);
}
const base = normalizeBase(args.base);
if (!base) {
  console.error(`Invalid base URL: ${args.base}\n`);
  console.error(usage());
  process.exit(2);
}

let browser = null;
try {
  browser = await chromium.launch();
} catch (error) {
  logError(`chromium launch failed: ${shorten(error?.message ?? error, 600)}`);
}

const checks = [];
if (browser) {
  const definitions = [
    ["no-footer-landing", () => checkNoFooterLanding(browser, base)],
    ["dropdown-close", () => checkDropdownClose(browser, base)],
    ["menu-navigation", () => checkMenuNavigation(browser, base)],
    ["hydration-guard", () => checkHydrationGuard(browser, base)],
    ["no-empty-page", () => checkNoEmptyPage(browser, base)],
  ];
  try {
    for (const [name, fn] of definitions) {
      checks.push(await runCheck(name, fn));
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

const passed = checks.filter((check) => check.ok).length;
const failed = checks.length - passed;

console.log(JSON.stringify({ base, checks, errors }, null, 2));
console.error("");
console.error(`Nav regression checks - ${base}`);
for (const check of checks) {
  console.error(`${check.ok ? "PASS" : "FAIL"}  ${check.name} - ${check.detail}`);
}
if (checks.length === 0) console.error("FAIL  no checks ran");
console.error(`${passed}/${checks.length} checks passed`);
if (errors.length > 0) {
  console.error(`${errors.length} non-fatal console message(s) logged`);
}

process.exitCode = failed > 0 || checks.length === 0 ? 1 : 0;
