import { chromium } from "playwright";
const routes = [
  "/",
  "/guides",
  "/guides#link-cards-gh-muse",
  "/compare",
  "/compare/grin-vs-tano",
  "/use-cases/drive-revenue",
  "/case-studies",
  "/for-creators",
  "/careers",
  "/news",
];
const b = await chromium.launch();
for (const width of [1568, 390]) {
  const p = await b.newPage({ viewport: { width, height: 829 } });
  for (const r of routes) {
    await p.goto("http://127.0.0.1:3100" + r, { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    const h = await p.evaluate(() => document.body.scrollHeight);
    for (const frac of [0, 0.25, 0.5, 0.75, 0.95]) {
      await p.evaluate((y) => scrollTo(0, y), Math.max(0, Math.round((h - 829) * frac)));
      await p.waitForTimeout(500);
      const out = await p.evaluate(() => {
        const els = [...document.querySelectorAll("main h1,main h2,main p")].filter((e) => {
          const r = e.getBoundingClientRect();
          return r.top >= 0 && r.bottom <= innerHeight && r.width > 0;
        });
        const bad = [];
        for (const e of els.slice(0, 5)) {
          const c = getComputedStyle(e);
          let p = e.parentElement,
            bg = "rgba(0, 0, 0, 0)";
          while (p) {
            const pc = getComputedStyle(p);
            if (pc.backgroundColor !== "rgba(0, 0, 0, 0)") {
              bg = pc.backgroundColor;
              break;
            }
            p = p.parentElement;
          }
          const lum = (s) => {
            const m = s.match(/[\d.]+/g)?.map(Number) || [];
            if (m.length < 3) return null;
            return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2];
          };
          const fg = lum(c.color),
            bl = lum(bg);
          if (fg !== null && bl !== null && Math.abs(fg - bl) < 12)
            bad.push({ t: e.tagName, fg: c.color, bg, op: c.opacity });
        }
        return {
          bad,
          tone: document.documentElement.dataset.groundTone,
          veil: getComputedStyle(document.querySelector(".wire-ground-veil")).opacity,
          h1: getComputedStyle(document.querySelector("main h1,main h2")).opacity,
        };
      });
      if (out.bad.length || out.h1 === "0" || out.veil !== "0")
        console.log(width, r, frac, JSON.stringify(out));
    }
  }
  await p.close();
}
await b.close();
