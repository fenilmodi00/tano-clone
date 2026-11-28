/**
 * Route-transition ground-tone gate.
 *
 * A committed pathname must paint its first declared band's tone before the
 * browser paints it. This drives real client navigations from a deep-scrolled,
 * opposite-tone page and fails on any frame that shows the previous tone after
 * the new pathname commits.
 */
import { chromium } from "playwright";

const origin = process.argv[2] ?? "http://127.0.0.1:3000";

/** Routes whose first declared band owns the first paint. The contact sheet
 * has no declared band and intentionally keeps its sampled light tone. */
const CASES = [
  { to: "/guides", tone: "dark" },
  { to: "/compare", tone: "dark" },
  { to: "/case-studies", tone: "dark" },
  { to: "/news", tone: "dark" },
  { to: "/use-cases/creative-velocity", tone: "dark" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const failures = [];

await page.addInitScript(() => {
  window.__navTone = { recording: false, samples: [] };
  const tick = () => {
    if (window.__navTone.recording) {
      const html = document.documentElement;
      window.__navTone.samples.push({
        path: location.pathname,
        tone: html.dataset.groundTone ?? null,
        ground: Number.parseFloat(getComputedStyle(html).getPropertyValue("--ground-t")) || 0,
        y: Math.round(scrollY),
      });
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

for (const { to, tone } of CASES) {
  await page.goto(`${origin}/`, { waitUntil: "load" });
  await page.waitForTimeout(700);
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);

  // Start from the opposite tone so the layout effect has to correct before paint.
  await page.evaluate(
    (opposite) => window.__tanoGround?.setGroundTone(opposite),
    tone === "dark" ? "light" : "dark",
  );
  await page.waitForTimeout(800);

  const link = page.locator(`a[href="${to}"]`).last();
  if ((await link.count()) === 0) {
    failures.push(`${to}: no link from /`);
    continue;
  }

  await page.evaluate(() => {
    window.__navTone.samples = [];
    window.__navTone.recording = true;
  });
  await link.click({ noWaitAfter: true });
  await page.waitForTimeout(900);

  const result = await page.evaluate((expectedTone) => {
    window.__navTone.recording = false;
    const samples = window.__navTone.samples.filter((sample) => sample.path === location.pathname);
    return {
      path: location.pathname,
      y: Math.round(scrollY),
      tone: document.documentElement.dataset.groundTone,
      samples: samples.length,
      wrong: samples.filter((sample) => sample.tone !== expectedTone).slice(0, 3),
      first: samples.slice(0, 6),
      expected: expectedTone,
    };
  }, tone);
  console.log(JSON.stringify({ to, tone, ...result }));
  if (result.path !== to) failures.push(`${to}: landed on ${result.path}`);
  if (result.tone !== tone) failures.push(`${to}: final tone ${result.tone}`);
  if (result.wrong?.length)
    failures.push(`${to}: wrong-tone frames ${JSON.stringify(result.wrong)}`);
  if (result.samples === 0) failures.push(`${to}: no post-commit frames sampled`);
}

console.log(JSON.stringify({ origin, failures }, null, 2));
await browser.close();
if (failures.length) process.exitCode = 1;
