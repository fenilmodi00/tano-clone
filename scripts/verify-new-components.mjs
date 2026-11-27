import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1568, height: 829 } });
const fails = [];
// Dock ticker
await p.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await p.waitForTimeout(1400);
const dock0 = await p.evaluate(() => {
  const d = document.querySelector(".hp-hero-strip-dock");
  const c = d && getComputedStyle(d);
  return (
    d && {
      float: d.dataset.floating,
      pos: c.position,
      y: Math.round(d.getBoundingClientRect().y),
      op: c.opacity,
    }
  );
});
if (!dock0 || dock0.float !== "true" || dock0.pos !== "fixed")
  fails.push("dock not floating initially: " + JSON.stringify(dock0));
await p.evaluate(() => scrollTo(0, 250));
await p.waitForTimeout(400);
const dock2 = await p.evaluate(() => {
  const d = document.querySelector(".hp-hero-strip-dock");
  const c = d && getComputedStyle(d);
  return d && { float: d.dataset.floating, aside: d.dataset.aside, pos: c.position, op: c.opacity };
});
if (!dock2 || dock2.float !== "true" || dock2.pos !== "fixed" || dock2.op !== "1")
  fails.push("dock faded before docking: " + JSON.stringify(dock2));
await p.evaluate(() => scrollTo(0, 600));
await p.waitForTimeout(900);
const dock6 = await p.evaluate(() => {
  const d = document.querySelector(".hp-hero-strip-dock");
  return (
    d && {
      float: d.dataset.floating,
      pos: getComputedStyle(d).position,
      y: Math.round(d.getBoundingClientRect().y),
    }
  );
});
if (!dock6 || dock6.float !== "false" || dock6.pos !== "relative")
  fails.push("dock did not dock after scroll: " + JSON.stringify(dock6));
// Announcement removed
const notice = await p.evaluate(() => document.querySelectorAll(".hp-notify").length);
if (notice) fails.push("announcement still rendered: " + notice);
// Use-case scenes per step
await p.goto("http://127.0.0.1:3000/use-cases/drive-revenue", { waitUntil: "networkidle" });
await p.evaluate(() => scrollTo(0, 1496));
await p.waitForTimeout(1200);
const sceneSteps = [];
for (let i = 0; i < 4; i++) {
  if (i > 0) {
    await p.evaluate(() => document.querySelectorAll("[data-direction=next]")[0].click());
    await p.waitForTimeout(1100);
  }
  sceneSteps.push(
    await p.evaluate(() => {
      const s = document.querySelector(".hp-pp-scene");
      return {
        scene: s?.dataset.scene,
        running: s?.dataset.running,
        leaving: document.querySelectorAll("[data-leaving]").length,
        text: (s?.innerText || "").slice(0, 50),
      };
    }),
  );
}
const scenes = sceneSteps.map((s) => s.scene);
if (new Set(scenes).size < 4) fails.push("use-case scenes repeated: " + JSON.stringify(sceneSteps));
console.log("dock0", dock0, "dock6", dock6, "notice", notice, "scenes", sceneSteps);
console.log(fails.length ? "FAIL\n" + fails.join("\n") : "PASS");
process.exit(fails.length ? 1 : 0);
