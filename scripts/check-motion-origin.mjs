import { chromium } from "playwright";
const origin = process.argv[2] ?? "https://dev.kaplun.tech";
const local = origin.includes("127.0.0.1") || origin.includes("localhost");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1568, height: 829 } });
const errors = [];
const failed = [];
page.on("pageerror", (e) => errors.push(e.message.split("\n")[0]));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 200));
});
page.on("requestfailed", (r) => failed.push(`${r.failure()?.errorText} ${r.url()}`));
await page.goto(origin, { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
const state = await page.evaluate(() => {
  const dock = document.querySelector(".hp-hero-strip-dock");
  const camp = document.querySelector(".hp-camp");
  const h1 = document.querySelector("h1");
  return {
    path: location.pathname,
    h1Opacity: h1 ? getComputedStyle(h1).opacity : null,
    rvIn: document.querySelectorAll("main .rv-in").length,
    lenis: document.documentElement.classList.contains("lenis"),
    dockFloating: dock?.getAttribute("data-floating") ?? null,
    dockPosition: dock ? getComputedStyle(dock).position : null,
    campVideos: camp?.querySelectorAll("video").length ?? 0,
    animations: document.getAnimations().length,
    scripts: [...document.scripts].filter((s) => s.src.includes("/_next/")).length,
  };
});
await page.evaluate(() => scrollTo(0, 700));
await page.waitForTimeout(600);
const scrolled = await page.evaluate(() => {
  const dock = document.querySelector(".hp-hero-strip-dock");
  return {
    y: scrollY,
    dockFloating: dock?.getAttribute("data-floating") ?? null,
    dockPosition: dock ? getComputedStyle(dock).position : null,
    headerScrolled: document.querySelector(".wire-header")?.getAttribute("data-scrolled") ?? null,
  };
});
const failures = [];
if (state.rvIn === 0) failures.push("no .rv-in (page runtime never hydrated)");
if (!state.lenis) failures.push("Lenis never mounted");
if (state.dockFloating !== "true" || state.dockPosition !== "fixed")
  failures.push("hero ticker is not floating at rest");
if (scrolled.dockFloating !== "false" || scrolled.dockPosition !== "relative")
  failures.push("hero ticker did not dock after scrolling");
if (errors.length) failures.push(`${errors.length} console/page errors`);

console.log(
  JSON.stringify(
    {
      origin,
      local,
      state,
      scrolled,
      errors: errors.slice(0, 8),
      failed: failed.slice(0, 8),
      failures,
    },
    null,
    2,
  ),
);
await browser.close();
if (failures.length) process.exitCode = 1;
