import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const routes = JSON.parse(await fs.readFile("docs/research/tano/routes.json", "utf8"));
const outDir = "docs/verify/smoke";
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1568, height: 900 } });
const results = [];

for (const { route } of routes) {
  const errors = [];
  const bad = [];
  const onConsole = (m) => {
    if (m.type() === "error" && !m.text().includes("WebSocket"))
      errors.push(m.text().slice(0, 200));
  };
  const onResponse = (r) => {
    if (r.status() >= 400 && r.url().startsWith("http://127.0.0.1:3000"))
      bad.push([r.status(), r.url().slice(0, 140)]);
  };
  page.on("console", onConsole);
  page.on("response", onResponse);
  let status = 0;
  try {
    const res = await page.goto("http://127.0.0.1:3000" + route, {
      waitUntil: "networkidle",
      timeout: 60_000,
    });
    status = res?.status() ?? 0;
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.waitForTimeout(600);
  } catch (err) {
    errors.push("NAV: " + err.message.slice(0, 160));
  }
  const info = await page
    .evaluate(() => {
      const sections = [...document.querySelectorAll("main > section, main > div")];
      return {
        title: document.title,
        h: document.body.scrollHeight,
        w: document.documentElement.scrollWidth,
        sections: sections.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            y: Math.round(r.y + scrollY),
            h: Math.round(r.height),
            cls: (el.className?.baseVal ?? el.className ?? "").slice(0, 60),
          };
        }),
        h1:
          document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim().slice(0, 90) ?? "",
        missing: [...document.images]
          .filter((i) => !i.complete || !i.naturalWidth)
          .map((i) => i.currentSrc || i.src)
          .slice(0, 6),
      };
    })
    .catch(() => null);
  page.off("console", onConsole);
  page.off("response", onResponse);
  results.push({ route, status, errors, bad, ...info });
  console.log(
    route,
    status,
    info?.h,
    "errs",
    errors.length,
    "bad",
    bad.length,
    "missing",
    info?.missing.length,
  );
}

await fs.writeFile(path.join(outDir, "report.json"), JSON.stringify(results, null, 2));
await browser.close();
