import { chromium } from "playwright";

const origin = process.argv[2] ?? "http://127.0.0.1:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1568, height: 829 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message.split("\n")[0]));

await page.goto(origin, { waitUntil: "networkidle" });
await page.evaluate(() => scrollTo(0, 4000));
await page.waitForTimeout(1200);
const saved = await page.evaluate(() => Number(sessionStorage.getItem("tano:scroll:/") ?? 0));

await page.reload({ waitUntil: "commit" });
const samples = [];
const readAt = Date.now();
for (const delay of [0, 100, 300, 700, 1200, 2000, 3000]) {
  await page.waitForTimeout(Math.max(0, delay - (Date.now() - readAt)));
  samples.push(
    await page.evaluate(() => {
      const loading = document.querySelector(".wire-boot-mask");
      const footer = document.querySelector(".wire-footer");
      return {
        y: scrollY,
        stage: document.querySelector(".wire-nav-bar")?.dataset.stage,
        loadingHeight: loading ? getComputedStyle(loading).height : null,
        footerTop: footer?.getBoundingClientRect().top ?? null,
        viewport: innerHeight,
      };
    }),
  );
}
const failures = [];
if (saved < 100) failures.push(`scroll memory was not stored (${saved})`);
for (const [index, sample] of samples.entries()) {
  // Sample 0 can still be the pre-reload document; check after commit only.
  if (index > 0 && sample.stage !== "settled")
    failures.push(`nav replayed intro at sample ${index}`);
  const footerVisible =
    sample.footerTop !== null && sample.footerTop < sample.viewport && sample.footerTop >= 0;
  const masked = sample.loadingHeight === `${sample.viewport}px`;
  if (footerVisible && !masked) failures.push(`footer visible before restore at sample ${index}`);
}
const final = samples.at(-1);
if (Math.abs((final?.y ?? 0) - saved) > 2)
  failures.push(`restored ${final?.y}px instead of ${saved}px`);
if (errors.length) failures.push(`${errors.length} page errors`);

console.log(JSON.stringify({ origin, saved, samples, errors, failures }, null, 2));
await browser.close();
if (failures.length) process.exitCode = 1;
