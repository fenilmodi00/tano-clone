import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1568, height: 829 } });
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => {
  if (m.type() === "error") errs.push(m.text().slice(0, 120));
});
await p.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
await p.waitForTimeout(1400);
// navigate to guides by footer
await p.evaluate(() => scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(400);
await p.click('.wire-footer-card a[href="/guides"]');
await p.waitForTimeout(1500);
console.log(
  "guides",
  await p.evaluate(() => ({
    url: location.pathname,
    hash: location.hash,
    scrollY: Math.round(scrollY),
    h1: getComputedStyle(document.querySelector("main h1")).opacity,
    rv: document.querySelectorAll(".rv-in").length,
    tone: document.documentElement.dataset.groundTone,
  })),
);
// click Meta Muse resource link which points /guides#link-cards-gh-muse
const link = await p.$('a[href="/guides#link-cards-gh-muse"]');
if (link) {
  await link.click();
  await p.waitForTimeout(1400);
}
console.log(
  "hash",
  await p.evaluate(() => {
    const t = document.querySelector("#link-cards-gh-muse");
    const r = t?.getBoundingClientRect();
    return {
      url: location.pathname + location.hash,
      scrollY: Math.round(scrollY),
      target: r && [Math.round(r.y), Math.round(r.height)],
      op: t && getComputedStyle(t).opacity,
      rv: document.querySelectorAll(".rv-in").length,
      tone: document.documentElement.dataset.groundTone,
      text: document.querySelector("main")?.innerText.length,
    };
  }),
);
// navigate compare footer
await p.evaluate(() => scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(400);
await p.click('.wire-footer-card a[href="/compare"]');
await p.waitForTimeout(1500);
console.log(
  "compare",
  await p.evaluate(() => {
    const h = document.querySelector("main h1");
    return {
      h1: h && { op: getComputedStyle(h).opacity, color: getComputedStyle(h).color },
      rv: document.querySelectorAll(".rv-in").length,
      tone: document.documentElement.dataset.groundTone,
      text: document.querySelector("main")?.innerText.length,
      veil: getComputedStyle(document.querySelector(".wire-ground-veil")).opacity,
    };
  }),
);
console.log("errs", errs.slice(0, 5));
await b.close();
