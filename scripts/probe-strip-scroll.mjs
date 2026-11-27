import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1568, height: 829 } });
await p.goto("https://www.tano.ai/", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
for (const y of [0, 300, 600, 900, 1200, 1400, 1600, 2000]) {
  await p.evaluate((y) => scrollTo(0, y), y);
  await p.waitForTimeout(600);
  console.log(
    y,
    await p.evaluate(() => {
      const d = document.querySelector(".hp-hero-strip-dock");
      const c = getComputedStyle(d);
      const r = d.getBoundingClientRect();
      return {
        float: d.dataset.floating,
        intro: d.dataset.intro,
        pos: c.position,
        y: Math.round(r.y),
        bottom: c.bottom,
        op: c.opacity,
        transform: c.transform,
      };
    }),
  );
}
await b.close();
