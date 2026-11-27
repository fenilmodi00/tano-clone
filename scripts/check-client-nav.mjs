/**
 * Client-side navigation regression check.
 *
 * The reveal stylesheet starts every page element at opacity 0 and only
 * `.rv-in` (added by the page runtime) fades it in. If the page behaviours are
 * mounted once for the lifetime of the document, an App Router navigation
 * swaps the DOM but never reveals it: every subpage stays invisible until a
 * hard refresh. This checks the real UI flow through the header and footer and
 * browser Back, asserting the new page is actually revealed.
 *
 * Usage: node scripts/check-client-nav.mjs [baseUrl]
 *        BASE_URL=http://127.0.0.1:3000 node scripts/check-client-nav.mjs
 */
import { chromium } from "playwright";

const base = (process.env.BASE_URL || process.argv[2] || "http://127.0.0.1:3000").replace(/\/+$/, "");
const VIEWPORT = { width: 1568, height: 829 };
const NAV_TIMEOUT = 30_000;
const REVEAL_TIMEOUT = 20_000;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEWPORT });
const page = await context.newPage();

const errors = [];
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});

const failures = [];
function expect(label, condition, detail) {
  console.log(`${condition ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!condition) failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
}

async function state() {
  return page.evaluate(() => {
    const main = document.querySelector("main");
    const heading = document.querySelector("main h1, main h2");
    const words = heading ? Array.from(heading.querySelectorAll(".rv-word")) : [];
    const wordOpacity = words.length ? Math.max(...words.map((word) => Number(getComputedStyle(word).opacity))) : null;
    return {
      path: location.pathname + location.search,
      heading: heading?.textContent?.trim().slice(0, 52) ?? null,
      headingOpacity: heading ? Number(getComputedStyle(heading).opacity) : -1,
      wordOpacity,
      rv: document.querySelectorAll(".rv-in").length,
      shown: document.querySelectorAll('[data-shown="true"]').length,
      text: (main?.innerText || "").trim().length,
      veil: document.querySelectorAll(".wire-ground-veil").length,
      groundApi: Boolean(window.__tanoGround && typeof window.__tanoGround === "object"),
      groundTone: document.documentElement.getAttribute("data-ground-tone"),
      lenis: document.documentElement.classList.contains("lenis"),
      navReady: document.documentElement.hasAttribute("data-nav-ready"),
      groundReady: document.documentElement.hasAttribute("data-ground-ready"),
    };
  });
}

async function waitForRoute(path) {
  await page.waitForURL((url) => url.pathname === path, { timeout: NAV_TIMEOUT });
  // Wait until the page runtime has mounted on the committed route and the
  // above-fold reveal has been applied (70ms stagger + 240ms fade).
  await page
    .waitForFunction(
      () => {
        const heading = document.querySelector("main h1, main h2");
        const words = heading ? Array.from(heading.querySelectorAll(".rv-word")) : [];
        const visibleWord = !words.length || words.some((word) => Number(getComputedStyle(word).opacity) > 0);
        return document.querySelectorAll(".rv-in").length > 0 && visibleWord;
      },
      null,
      { timeout: REVEAL_TIMEOUT },
    )
    .catch(() => {});
  await page.waitForTimeout(350);
}

async function assertPage(label, path) {
  const snapshot = await state();
  const suffix = JSON.stringify(snapshot);
  expect(`${label}: route`, snapshot.path === path, `${snapshot.path} (want ${path}) ${suffix}`);
  expect(`${label}: main text`, snapshot.text > 20, `length ${snapshot.text}`);
  expect(`${label}: heading opacity`, snapshot.headingOpacity > 0, `h1.op=${snapshot.headingOpacity}`);
  expect(`${label}: first word opacity`, snapshot.wordOpacity === null || snapshot.wordOpacity > 0, `word.op=${snapshot.wordOpacity}`);
  expect(`${label}: .rv-in count`, snapshot.rv > 0, `rv=${snapshot.rv}`);
  expect(
    `${label}: not hidden with zero reveals`,
    !(snapshot.headingOpacity === 0 && snapshot.rv === 0),
    `op=${snapshot.headingOpacity} rv=${snapshot.rv}`,
  );
  expect(`${label}: single ground veil`, snapshot.veil === 1, `veils=${snapshot.veil}`);
  expect(`${label}: ground API`, snapshot.groundApi, "window.__tanoGround");
  expect(`${label}: ground tone`, snapshot.groundTone === "dark" || snapshot.groundTone === "light", `tone=${snapshot.groundTone}`);
  expect(`${label}: Lenis active`, snapshot.lenis, "html.lenis");
  expect(`${label}: nav ready`, snapshot.navReady, "data-nav-ready");
  expect(`${label}: ground ready`, snapshot.groundReady, "data-ground-ready");
  return snapshot;
}

function reportErrors(label) {
  const seen = errors.splice(0);
  expect(`${label}: no page/console errors`, seen.length === 0, seen.slice(0, 4).join(" | "));
}

try {
  // 1. Direct load of home.
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
  await waitForRoute("/");
  const home = await assertPage("home (direct load)", "/");

  // 2. Real UI: hover the Use Cases menu, click Drive Revenue.
  await page.hover(".wire-nav-menu");
  const useCaseLink = page.locator('.wire-nav-menu a[href="/use-cases/drive-revenue"]');
  await useCaseLink.waitFor({ state: "visible", timeout: 10_000 });
  await useCaseLink.click();
  await waitForRoute("/use-cases/drive-revenue");
  await assertPage("use-cases/drive-revenue (SPA)", "/use-cases/drive-revenue");

  // 3. Real UI: footer Guides link.
  const guidesLink = page.locator('.wire-footer-card a[href="/guides"]').first();
  await guidesLink.scrollIntoViewIfNeeded();
  await guidesLink.click();
  await waitForRoute("/guides");
  const guides = await assertPage("guides (SPA)", "/guides");

  // 4. Browser Back to the previous route.
  await page.goBack({ waitUntil: "commit", timeout: NAV_TIMEOUT }).catch(() => {});
  await waitForRoute("/use-cases/drive-revenue");
  await assertPage("use-cases/drive-revenue (back)", "/use-cases/drive-revenue");

  // 5. Direct load of a subpage stays green.
  await page.goto(`${base}/guides`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
  await waitForRoute("/guides");
  await assertPage("guides (direct load)", "/guides");

  // 6. Repeat SPA navigation: a fresh mount must not stack observers or veil.
  await page.locator(".wire-nav-mark").first().click();
  await waitForRoute("/");
  await assertPage("home (repeat SPA)", "/");
  await page.hover(".wire-nav-menu");
  await page.locator('.wire-nav-menu a[href="/use-cases/drive-revenue"]').click();
  await waitForRoute("/use-cases/drive-revenue");
  await assertPage("drive-revenue (repeat SPA)", "/use-cases/drive-revenue");

  expect("global runtime survived navigation", guides.lenis && guides.veil === 1, `lenis=${guides.lenis} veils=${guides.veil}`);
  expect("home runtime reached the client", home.rv > 0, `rv=${home.rv}`);
  reportErrors("flow");
} catch (error) {
  failures.push(`crash: ${error instanceof Error ? error.message : String(error)}`);
  console.error(error);
}

await browser.close();
console.log("");
if (failures.length) {
  console.log("FAIL");
  for (const failure of failures) console.log(` - ${failure}`);
  process.exit(1);
}
console.log("PASS");
