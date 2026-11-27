import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1568, height: 829 } });
await p.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.evaluate(() => scrollTo(0, document.body.scrollHeight - 900));
await p.waitForTimeout(600);
console.log(
  "pre",
  await p.evaluate(() => ({
    y: scrollY,
    h: document.body.scrollHeight,
    rest: history.scrollRestoration,
  })),
);
const start = Date.now();
await p.reload({ waitUntil: "commit" });
const states = [];
for (const ms of [0, 16, 32, 50, 80, 120, 180, 260, 400, 600, 900, 1400]) {
  const wait = ms - (Date.now() - start);
  if (wait > 0) await p.waitForTimeout(wait);
  states.push(
    await p.evaluate((ms) => {
      const nav = document.querySelector(".wire-nav");
      const foot = document.querySelector(".wire-footer");
      return {
        ms,
        y: scrollY,
        rest: history.scrollRestoration,
        stage: document.querySelector(".wire-chrome")?.dataset.stage,
        chromeHidden: document.querySelector(".wire-chrome")?.dataset.hidden,
        navTop: nav?.getBoundingClientRect().top,
        navOp: nav ? getComputedStyle(nav).opacity : null,
        footTop: foot?.getBoundingClientRect().top,
        htmlH: document.documentElement.scrollHeight,
        bodyH: document.body.scrollHeight,
      };
    }, ms),
  );
}
console.log(JSON.stringify(states, null, 2));
await b.close();
