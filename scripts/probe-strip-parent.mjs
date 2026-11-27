import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1568, height: 829 } });
for (const base of ["https://www.tano.ai", "http://127.0.0.1:3000"]) {
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  console.log(
    base,
    await p.evaluate(() => {
      const s = document.querySelector(".hp-hero-strip");
      const chain = [];
      let e = s;
      for (let i = 0; i < 5 && e; i++) {
        const c = getComputedStyle(e);
        chain.push({
          tag: e.tagName,
          cls: String(e.className).slice(0, 50),
          pos: c.position,
          disp: c.display,
          rect: (() => {
            const r = e.getBoundingClientRect();
            return [Math.round(r.y), Math.round(r.height)];
          })(),
        });
        e = e.parentElement;
      }
      return chain;
    }),
  );
}
await b.close();
