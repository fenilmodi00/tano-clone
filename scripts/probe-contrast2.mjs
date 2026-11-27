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
const p = await b.newPage({ viewport: { width: 1568, height: 829 } });
const parse = async (colors) => colors.map((c) => c);
for (const r of routes) {
  await p.goto("http://127.0.0.1:3100" + r, { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (const frac of [0, 0.25, 0.5, 0.75]) {
    await p.evaluate((y) => scrollTo(0, y), Math.round((h - 829) * frac));
    await p.waitForTimeout(650);
    const out = await p.evaluate(() => {
      const rgb = (c) => {
        const cv = document.createElement("canvas");
        cv.width = cv.height = 1;
        const x = cv.getContext("2d");
        x.fillStyle = c;
        x.fillRect(0, 0, 1, 1);
        const d = x.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2], d[3] / 255];
      };
      const lum = ([r, g, b]) => {
        const f = (v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const ratio = (a, c) => {
        const L1 = lum(a),
          L2 = lum(c);
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      };
      const bgOf = (el) => {
        let e = el;
        while (e) {
          const c = getComputedStyle(e).backgroundColor;
          const [r, g, b, a] = rgb(c);
          if (a > 0.9) return [r, g, b];
          e = e.parentElement;
        }
        return [14, 13, 12];
      };
      const bad = [];
      for (const e of [...document.querySelectorAll("main h1,main h2,main p")]) {
        const r = e.getBoundingClientRect();
        if (r.top < 0 || r.bottom > innerHeight || r.width < 10) continue;
        const c = getComputedStyle(e);
        const fg = rgb(c.color);
        if (fg[3] < 0.3) continue;
        const bg = bgOf(e);
        const cr = ratio(fg, bg);
        if (cr < 3)
          bad.push({
            tag: e.tagName,
            text: e.textContent.trim().slice(0, 30),
            fg: c.color,
            bg,
            cr: +cr.toFixed(2),
            op: c.opacity,
          });
      }
      return {
        bad: bad.slice(0, 3),
        tone: document.documentElement.dataset.groundTone,
        veil: getComputedStyle(document.querySelector(".wire-ground-veil")).opacity,
      };
    });
    if (out.bad.length) console.log(r, frac, JSON.stringify(out));
  }
}
await b.close();
