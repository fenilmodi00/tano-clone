import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1568, height: 709 } });
await p.goto("http://127.0.0.1:3000/use-cases/drive-revenue", { waitUntil: "networkidle" });
await p.evaluate(() => scrollTo(0, 1496));
await p.waitForTimeout(1400);
for (let i = 0; i < 3; i++) {
  await p.evaluate(() => document.querySelectorAll("[data-direction=next]")[0].click());
  await p.waitForTimeout(120);
  console.log(
    "t+120",
    await p.evaluate(() => ({
      leaving: document.querySelectorAll(".hp-pp-frame[data-leaving]").length,
      scenes: [...document.querySelectorAll(".hp-pp-frame")].map((f) => [
        f.querySelector(".hp-pp-scene")?.dataset.scene,
        f.hasAttribute("data-leaving"),
      ]),
    })),
  );
  await p.waitForTimeout(500);
}
// creative count
await p.goto("http://127.0.0.1:3000/use-cases/creative-velocity", { waitUntil: "networkidle" });
await p.evaluate(() => scrollTo(0, 1496));
await p.waitForTimeout(1200);
const seq = [];
for (let i = 0; i < 5; i++) {
  if (i) {
    await p.evaluate(() => document.querySelectorAll("[data-direction=next]")[0].click());
    await p.waitForTimeout(900);
  }
  seq.push(await p.evaluate(() => document.querySelector(".hp-pp-scene")?.dataset.scene));
}
console.log("creative", seq);
await b.close();
