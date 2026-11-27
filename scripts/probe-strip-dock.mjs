import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1568, height: 829 } });
for (const base of ["https://www.tano.ai", "http://127.0.0.1:3000"]) {
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  console.log(
    base,
    JSON.stringify(
      await p.evaluate(() => {
        const d = document.querySelector(".hp-hero-strip-dock");
        const c = getComputedStyle(d);
        const r = d.getBoundingClientRect();
        return {
          html: d.outerHTML.slice(0, 300),
          pos: c.position,
          top: c.top,
          bottom: c.bottom,
          left: c.left,
          right: c.right,
          z: c.zIndex,
          transform: c.transform,
          rect: [r.x, r.y, r.width, r.height],
          attrs: [...d.attributes].map((a) => [a.name, a.value]),
          parent: d.parentElement.className,
        };
      }),
    ),
  );
}
await b.close();
