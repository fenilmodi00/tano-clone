import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

/**
 * Captures the four home hero campaign reels from the live page and writes the
 * typed data module. Run with: node scripts/capture-hero.mjs
 *
 * Every asset is rewritten through docs/research/tano/asset-map.json, and the
 * script fails if any captured URL is not resolvable to a local file.
 */

const ORIGIN = "https://www.tano.ai";
const PAGE = `${ORIGIN}/`;
const OUT = "src/components/sites/tano/content/hero-campaigns.ts";
const ASSET_MAP = "docs/research/tano/asset-map.json";
const FILL =
  "position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent";

/* ------------------------------------------------------------------ assets */

const map = JSON.parse(fs.readFileSync(ASSET_MAP, "utf8"));
const byPath = new Map();
const byInner = new Map();

for (const [key, value] of Object.entries(map)) {
  if (typeof value !== "string" || !value.startsWith("/sites/tano/")) continue;
  if (!fs.existsSync(path.join("public", value))) continue;
  let url;
  try {
    url = new URL(key, ORIGIN);
  } catch {
    continue;
  }
  if (url.pathname === "/_next/image") {
    const inner = url.searchParams.get("url");
    if (!inner) continue;
    try {
      byInner.set(decodeURIComponent(new URL(inner).pathname), value);
    } catch {
      /* ignore malformed inner URLs */
    }
  } else {
    byPath.set(url.pathname, value);
  }
}

const localDirs = [
  "public/sites/tano/extras",
  "public/sites/tano/images",
  "public/sites/tano/video",
];
function findLocalByBase(base) {
  for (const dir of localDirs) {
    const candidate = path.join(dir, base);
    if (fs.existsSync(candidate))
      return "/" + path.relative("public", candidate).replace(/\\/g, "/");
  }
  return null;
}

function localise(value, label) {
  if (!value) throw new Error(`missing ${label}`);
  let url = value.trim();
  if (url.startsWith("data:")) return url;
  if (url.startsWith("/sites/tano/")) {
    if (!fs.existsSync(path.join("public", url))) throw new Error(`missing local ${url}`);
    return url;
  }
  // srcset without src: take the first candidate.
  if (url.includes(",") && /\s+\d+[wx]/.test(url)) url = url.split(",")[0].trim().split(/\s+/)[0];
  let parsed;
  try {
    parsed = new URL(url, ORIGIN);
  } catch {
    throw new Error(`cannot parse ${label}: ${value}`);
  }
  if (parsed.pathname === "/_next/image") {
    const inner = parsed.searchParams.get("url");
    if (inner) {
      const innerPath = decodeURIComponent(new URL(inner, ORIGIN).pathname);
      if (byInner.has(innerPath)) return byInner.get(innerPath);
      if (byPath.has(innerPath)) return byPath.get(innerPath);
      const innerBase = innerPath.split("/").filter(Boolean).at(-1);
      if (innerBase) {
        const found = findLocalByBase(innerBase);
        if (found) return found;
      }
    }
  }
  if (byPath.has(parsed.pathname)) return byPath.get(parsed.pathname);
  const base = parsed.pathname.split("/").filter(Boolean).at(-1);
  if (base) {
    const found = findLocalByBase(base);
    if (found) return found;
  }
  throw new Error(`no local asset for ${label}: ${value}`);
}

/* ----------------------------------------------------------------- capture */

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1568, height: 900 },
  deviceScaleFactor: 1,
  locale: "en-GB",
  reducedMotion: "no-preference",
});
await context.addCookies([{ name: "tano_consent", value: "denied", url: ORIGIN }]);
const page = await context.newPage();
await page.goto(PAGE, { waitUntil: "networkidle", timeout: 120_000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForSelector(".hp-camp .hp-camp-scene", { timeout: 30_000 });

// Reset the reel to index 0 through the source's own play zone (leave + return).
await page.evaluate(() => scrollTo(0, 2200));
await page.waitForTimeout(700);
await page.evaluate(() => scrollTo(0, 350));
await page.waitForTimeout(600);

const EXTRACT = () => {
  const text = (el) => (el?.textContent || "").trim();
  const src = (img) => {
    if (!img) return "";
    if (img.currentSrc) return img.currentSrc;
    if (img.getAttribute("src")) return img.getAttribute("src");
    return (img.getAttribute("srcset") || "").split(",")[0]?.trim().split(/\s+/)[0] || "";
  };
  const camp = document.querySelector(".hp-camp");
  if (!camp) throw new Error("no .hp-camp");
  const video = camp.querySelector("video");
  const tile = camp.querySelector(".hp-camp-tile");
  const buttons = [...document.querySelectorAll(".hp-camp-track-button")];
  const liveButton = buttons.findIndex((button) => button.dataset.state === "live");
  return {
    live: liveButton,
    handle: text(camp.querySelector(".hp-camp-field-foot .wire-lockup-handle")),
    profileAvatar: src(camp.querySelector(".hp-camp-field-foot .wire-lockup-ring img")),
    chatAvatar: src(camp.querySelector(".hp-camp-turn-face .wire-lockup-ring img")),
    chatterLabel:
      camp.querySelector(".hp-camp-turn-face .wire-lockup")?.getAttribute("aria-label") || "",
    brand: camp.querySelector(".hp-camp-logo img")?.getAttribute("alt") || "",
    logo: src(camp.querySelector(".hp-camp-logo img")),
    product: text(camp.querySelector(".hp-camp-gift-name")),
    productImage: src(camp.querySelector(".hp-camp-tile img")),
    tint: tile ? getComputedStyle(tile).backgroundColor : "",
    video: video?.currentSrc || video?.getAttribute("src") || "",
    poster: video?.getAttribute("poster") || "",
    aria: text(camp.querySelector(".hp-camp-scene:not([data-leaving]) .wire-visually-hidden")),
    match: text(camp.querySelector(".hp-camp-match-figure")),
    backdrops: [...camp.querySelectorAll(".hp-camp-panel .hp-camp-backdrop")].map((img) => ({
      src: src(img),
      live: img.dataset.live === "true",
    })),
    trackLabels: buttons.map((button) => button.getAttribute("aria-label") || ""),
    card: {
      chips: [...camp.querySelectorAll(".hp-camp-chip")].map((el) => ({
        label: text(el),
        picked: el.dataset.picked === "true",
      })),
      targets: [...camp.querySelectorAll(".hp-camp-target .hp-camp-mono")].map(text),
      scores: [...camp.querySelectorAll(".hp-camp-score-row")].map((row) => ({
        label: text(row.querySelector(".hp-camp-score-label")),
        share: Number.parseFloat(
          row.querySelector(".hp-camp-bar")?.style.getPropertyValue("--share") || "0",
        ),
        win: row.dataset.win === "true",
      })),
      chat: [...camp.querySelectorAll(".hp-camp-turn")].map((turn) => ({
        from: turn.dataset.from || "agent",
        text: text(turn.querySelector(".hp-camp-bubble")),
      })),
      metrics: [...camp.querySelectorAll(".hp-camp-metric")].map((metric) => ({
        label: text(metric.querySelector(".hp-camp-mono")),
        path: metric.querySelector(".hp-camp-metric-line")?.getAttribute("d") || "",
      })),
    },
  };
};

const reels = [];
const seen = new Set();
const deadline = Date.now() + 60_000;
let lastLive = -1;

while (seen.size < 4 && Date.now() < deadline) {
  const live = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll(".hp-camp-track-button")];
    return buttons.findIndex((button) => button.dataset.state === "live");
  });
  if (live >= 0 && !seen.has(live)) {
    if (lastLive !== live) {
      // Let the scene cross-fade and the creator-score count-up finish.
      await page.waitForTimeout(2600);
      await page
        .waitForFunction(
          () => {
            const figure = document.querySelector(".hp-camp-match-figure");
            return figure !== null && Number.parseFloat(figure.textContent || "") >= 0.915;
          },
          null,
          { timeout: 2500 },
        )
        .catch(() => {});
      lastLive = live;
      continue;
    }
    const snapshot = await page.evaluate(EXTRACT);
    if (snapshot.live !== live) continue;
    seen.add(live);
    reels[live] = snapshot;
    console.log(
      `captured reel ${live}: ${snapshot.handle} / ${snapshot.brand} / ${snapshot.product}`,
    );
  }
  await page.waitForTimeout(180);
}

await browser.close();

if (reels.length !== 4 || reels.some((reel) => !reel)) {
  throw new Error(`captured ${reels.filter(Boolean).length}/4 reels`);
}

for (const key of ["handle", "profileAvatar", "video", "poster", "brand", "product"]) {
  const values = reels.map((reel) => reel[key]);
  if (new Set(values).size !== 4)
    throw new Error(`${key} is not distinct across the four reels: ${values.join(", ")}`);
}
for (const reel of reels) {
  if (!reel.chatAvatar) throw new Error(`${reel.handle}: missing chat avatar`);
}

/* --------------------------------------------------------------- data module */

const hex = (value) => {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return value;
  return (
    "#" +
    [match[1], match[2], match[3]]
      .map((part) => Number(part).toString(16).padStart(2, "0"))
      .join("")
  );
};

const r = (value) => Math.round(value * 100) / 100;
const q = (value) => JSON.stringify(value);

const records = reels.map((reel, index) => {
  if (reel.trackLabels.length !== 4) throw new Error("expected four track labels");
  const backdrop = reel.backdrops.find((item) => item.live)?.src;
  if (!backdrop) throw new Error(`no live backdrop for reel ${index}`);
  const tint = hex(reel.tint);
  const match = Number.parseFloat(reel.match);
  if (!Number.isFinite(match)) throw new Error(`no creator score for reel ${index}`);
  return {
    key: ["bloom-and-wild", "neom", "peachies", "papier"][index],
    trackLabel: reel.trackLabels[index],
    handle: reel.handle,
    avatar: localise(reel.profileAvatar, "avatar"),
    brand: {
      name: reel.brand,
      logo: localise(reel.logo, "brand logo"),
      backdrop: localise(backdrop, "backdrop"),
    },
    product: {
      name: reel.product,
      image: localise(reel.productImage, "product image"),
      tint,
    },
    clip: {
      src: localise(reel.video, "video"),
      poster: localise(reel.poster, "poster"),
    },
    cards: {
      chips: reel.card.chips,
      targets: reel.card.targets,
      library: { match: r(match), rows: reel.card.scores },
      chat: reel.card.chat,
      metrics: reel.card.metrics,
    },
  };
});

const lines = [];
lines.push("/* Generated by scripts/capture-hero.mjs from https://www.tano.ai/.");
lines.push("   Four home hero reels, captured from the live page. All assets are local. */");
lines.push("");
lines.push("export type HeroCampaignChip = { label: string; picked: boolean };");
lines.push("export type HeroCampaignScoreRow = { label: string; share: number; win: boolean };");
lines.push('export type HeroCampaignChatTurn = { from: "agent" | "creator"; text: string };');
lines.push("export type HeroCampaignMetric = { label: string; path: string };");
lines.push("");
lines.push("export type HeroCampaign = {");
lines.push("  key: string;");
lines.push("  trackLabel: string;");
lines.push("  handle: string;");
lines.push("  avatar: string;");
lines.push("  brand: { name: string; logo: string; backdrop: string };");
lines.push("  product: { name: string; image: string; tint: string };");
lines.push("  clip: { src: string; poster: string };");
lines.push("  cards: {");
lines.push("    chips: HeroCampaignChip[];");
lines.push("    targets: string[];");
lines.push("    library: { match: number; rows: HeroCampaignScoreRow[] };");
lines.push("    chat: HeroCampaignChatTurn[];");
lines.push("    metrics: HeroCampaignMetric[];");
lines.push("  };");
lines.push("};");
lines.push("");
lines.push("export const HERO_CAMPAIGNS: readonly HeroCampaign[] = [");
for (const record of records) {
  lines.push("  {");
  lines.push(`    key: ${q(record.key)},`);
  lines.push(`    trackLabel: ${q(record.trackLabel)},`);
  lines.push(`    handle: ${q(record.handle)},`);
  lines.push(`    avatar: ${q(record.avatar)},`);
  lines.push(
    `    brand: { name: ${q(record.brand.name)}, logo: ${q(record.brand.logo)}, backdrop: ${q(record.brand.backdrop)} },`,
  );
  lines.push(
    `    product: { name: ${q(record.product.name)}, image: ${q(record.product.image)}, tint: ${q(record.product.tint)} },`,
  );
  lines.push(`    clip: { src: ${q(record.clip.src)}, poster: ${q(record.clip.poster)} },`);
  lines.push("    cards: {");
  lines.push(`      chips: ${q(record.cards.chips)},`);
  lines.push(`      targets: ${q(record.cards.targets)},`);
  lines.push(
    `      library: { match: ${record.cards.library.match}, rows: ${q(record.cards.library.rows)} },`,
  );
  lines.push(`      chat: ${q(record.cards.chat)},`);
  lines.push(`      metrics: ${q(record.cards.metrics)},`);
  lines.push("    },");
  lines.push("  },");
}
lines.push("];");
lines.push("");

const source = lines.join("\n");
if (/https?:\/\//.test(JSON.stringify(records)))
  throw new Error("generated data still contains a remote URL");
if (!fs.existsSync("src/components/sites/tano/content"))
  throw new Error("content directory missing");

fs.writeFileSync(OUT, source);
console.log(`wrote ${OUT} (${source.length} bytes)`);
console.log(
  JSON.stringify(
    records.map((record) => ({
      key: record.key,
      handle: record.handle,
      avatar: record.avatar,
      brand: record.brand.name,
      product: record.product.name,
      video: record.clip.src,
      poster: record.clip.poster,
      backdrop: record.brand.backdrop,
      label: record.trackLabel,
    })),
    null,
    2,
  ),
);
