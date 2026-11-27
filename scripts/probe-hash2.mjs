import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1568, height: 829 } });
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => {
  if (m.type() === "error") errs.push(m.text().slice(0, 120));
});
await p.goto("http://127.0.0.1:3100/guides", { waitUntil: "networkidle" });
await p.waitForTimeout(1400);
for (const href of ["/guides#link-cards-gh-muse", "/compare"]) {
  await p.evaluate((href) => {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = "t";
    document.body.append(a);
    a.click();
    a.remove();
  }, href);
  await p.waitForTimeout(1500);
  console.log(
    href,
    await p.evaluate(() => {
      const h = document.querySelector("main h1");
      const t = document.querySelector("#link-cards-gh-muse");
      const r = t?.getBoundingClientRect();
      return {
        url: location.pathname + location.hash,
        scrollY: Math.round(scrollY),
        h1: h && { op: getComputedStyle(h).opacity, color: getComputedStyle(h).color },
        rv: document.querySelectorAll(".rv-in").length,
        tone: document.documentElement.dataset.groundTone,
        target: r && [Math.round(r.y), Math.round(r.height)],
        text: document.querySelector("main")?.innerText.length,
        veil: getComputedStyle(document.querySelector(".wire-ground-veil")).opacity,
      };
    }),
  );
}
console.log("errs", errs.slice(0, 5));
await b.close();
