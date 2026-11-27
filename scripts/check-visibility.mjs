/**
 * Guard against the blank/black-page regression: with the reveal stylesheet,
 * content is hidden until the runtime adds .rv-in. If hydration or a chunk
 * fails, the page must still recover (inline fail-safe) and this check fails
 * when no above-fold content is visible.
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";

const routes = JSON.parse(await fs.readFile("docs/research/tano/routes.json", "utf8")).map(
  (r) => r.route,
);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1568, height: 829 } });
const failures = [];
page.on("pageerror", (error) => failures.push(`pageerror: ${error.message.slice(0, 160)}`));

for (const route of routes) {
  const response = await page
    .goto("http://127.0.0.1:3000" + route, { waitUntil: "networkidle" })
    .catch(() => null);
  await page.waitForTimeout(900);
  const state = await page.evaluate(() => {
    const heading = document.querySelector("main h1, main h2");
    const opacity = heading ? Number(getComputedStyle(heading).opacity) : 0;
    return {
      status: document.readyState,
      headingOpacity: opacity,
      revealed: document.querySelectorAll(".rv-in").length,
      text: (document.querySelector("main")?.innerText || "").trim().length,
    };
  });
  if (!response || response.status() !== 200) failures.push(`${route}: HTTP ${response?.status()}`);
  if (state.headingOpacity === 0 && state.revealed === 0)
    failures.push(`${route}: content hidden (opacity 0, no .rv-in)`);
  if (state.text < 20) failures.push(`${route}: main text too short (${state.text})`);
  console.log(
    route,
    response?.status(),
    "opacity",
    state.headingOpacity,
    "rv",
    state.revealed,
    "text",
    state.text,
  );
}

await browser.close();
if (failures.length) {
  console.error("\nFAILURES\n" + failures.join("\n"));
  process.exit(1);
}
console.log(`\nOK: ${routes.length} routes visible and error-free`);
