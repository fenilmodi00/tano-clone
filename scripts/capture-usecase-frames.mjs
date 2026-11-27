import { chromium } from "playwright";
import fs from "node:fs/promises";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1568, height: 900 } });
const out = {};
for (const route of ["/use-cases/drive-revenue", "/use-cases/creative-velocity"]) {
  await p.goto("https://www.tano.ai" + route, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  await p.evaluate(() => scrollTo(0, 1496));
  await p.waitForTimeout(1200);
  const frames = [];
  const count = await p.evaluate(
    () => document.querySelectorAll(".hp-uc-process .hp-pp .hp-steps-seg-button").length,
  );
  for (let i = 0; i < count; i++) {
    await p.evaluate(
      (i) => document.querySelectorAll(".hp-uc-process .hp-pp .hp-steps-seg-button")[i].click(),
      i,
    );
    await p.waitForTimeout(650);
    const frame = await p.evaluate(() => {
      const frames = [...document.querySelectorAll(".hp-uc-process .hp-pp-frame")].filter(
        (f) => !f.hasAttribute("data-leaving"),
      );
      const f = frames[frames.length - 1];
      if (!f) return null;
      return { html: f.outerHTML, scene: f.querySelector(".hp-pp-scene")?.dataset.scene };
    });
    frames.push(frame);
    console.log(route, i, frame?.scene, frame?.html.length);
  }
  out[route] = frames;
}
await fs.writeFile("/tmp/uc-frames.json", JSON.stringify(out));
await b.close();
