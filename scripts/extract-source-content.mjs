#!/usr/bin/env node
/**
 * Extract the editorial content of the captured tano.ai pages into the typed
 * content model consumed by the clone.
 *
 * Inputs:
 *   docs/research/tano/routes.json
 *   docs/research/tano/<slug>/page.html
 *   docs/research/tano/asset-map.json
 *   /home/boxd/tano/site/<route>.html (fallback when a capture is missing)
 *
 * Outputs:
 *   src/content/tano/pages/<slug>.json
 *   src/content/tano/routes.ts (via generate-route-manifest.mjs)
 *
 * Run with: node scripts/extract-source-content.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const RESEARCH = path.join(ROOT, "docs/research/tano");
const FALLBACK_SITE = "/home/boxd/tano/site";
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(ROOT, "src/content/tano");
const PAGES_DIR = path.join(OUT_DIR, "pages");

const ALLOWED_INLINE = new Set(["a", "strong", "em", "br", "sup", "sub"]);
const DROP_TAGS = new Set([
  "script",
  "style",
  "template",
  "svg",
  "path",
  "noscript",
  "iframe",
  "form",
  "input",
  "select",
  "option",
  "textarea",
  "button",
  "video",
  "audio",
  "source",
  "canvas",
  "object",
  "embed",
  "link",
  "meta",
]);
const WORD_CLASSES = new Set(["rv-word", "hp-brand-word", "wire-cases-title-word"]);

const routes = JSON.parse(fs.readFileSync(path.join(RESEARCH, "routes.json"), "utf8"));
const assetMap = JSON.parse(fs.readFileSync(path.join(RESEARCH, "asset-map.json"), "utf8"));

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------

const exactAssets = new Map();
const baseAssets = new Map();
const pathAssets = new Map();

/** Resolve a Sanity / Next image URL to the source URL it wraps. */
function unwrapSource(raw) {
  if (!raw) return "";
  const value = String(raw).trim();
  if (!value || value.startsWith("data:")) return "";
  try {
    const url = new URL(value, "https://www.tano.ai");
    if (url.pathname === "/_next/image") {
      const inner = url.searchParams.get("url");
      if (inner) return decodeURIComponent(inner);
    }
    if (
      url.hostname === "www.tano.ai" &&
      /^\/(brand|legacy|images|videos|brand-mark)\//.test(url.pathname)
    ) {
      return url.pathname;
    }
  } catch {
    // Keep non-URL strings (e.g. relative local paths) as-is.
  }
  return value;
}

function assetPathExists(localPath) {
  return localPath.startsWith("/") && fs.existsSync(path.join(PUBLIC_DIR, localPath.slice(1)));
}

function remember(map, key, value) {
  if (!key) return;
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

for (const [key, value] of Object.entries(assetMap)) {
  if (!value || !assetPathExists(value)) continue;
  const normalized = unwrapSource(key);
  remember(exactAssets, normalized, value);
  remember(baseAssets, normalized.split("?")[0], value);
  try {
    remember(pathAssets, new URL(normalized, "https://www.tano.ai").pathname, value);
  } catch {
    // ignore malformed asset keys
  }
}

function pickAsset(set) {
  if (!set || set.size === 0) return undefined;
  // Deterministic and favour the first downloaded rendition.
  return [...set].sort()[0];
}

function resolveAsset(raw, { video = false } = {}) {
  const normalized = unwrapSource(raw);
  if (!normalized) return undefined;

  const candidates = [];
  const add = (value) => {
    if (value && !candidates.includes(value)) candidates.push(value);
  };

  add(pickAsset(exactAssets.get(normalized)));
  add(pickAsset(baseAssets.get(normalized.split("?")[0])));
  try {
    add(pickAsset(pathAssets.get(new URL(normalized, "https://www.tano.ai").pathname)));
  } catch {
    // ignore
  }

  for (const local of candidates) {
    if (video && !/\.(mp4|webm|mov)$/i.test(local)) continue;
    if (!video && /\.(mp4|webm|mov)$/i.test(local)) continue;
    if (assetPathExists(local)) return local;
  }

  // Local assets that were not part of the download manifest still count when
  // they already live under public (the manifest is image-specific).
  if (normalized.startsWith("/") && assetPathExists(normalized)) {
    if (video && /\.(mp4|webm|mov)$/i.test(normalized)) return normalized;
    if (!video && !/\.(mp4|webm|mov)$/i.test(normalized)) return normalized;
  }
  return undefined;
}

const mediaMisses = new Map();
function miss(kind, raw) {
  if (!raw) return;
  const key = `${kind}\t${raw}`;
  mediaMisses.set(key, (mediaMisses.get(key) || 0) + 1);
}

/** Pull creatorReel objects out of the embedded page data. */
function buildReelMap(html) {
  const map = new Map();
  const unescaped = html.replace(/\\"/g, '"').replace(/\\u0026/g, "&");
  const objectRe =
    /"id":"creatorReel\.[^"]*"([\s\S]{0,1200}?)"src":"(https:[^"]+\.mp4)","poster":"(https:[^"]+)"/g;
  for (const match of unescaped.matchAll(objectRe)) {
    const window = match[1];
    const src = match[2];
    const poster = match[3];
    if (!src || !poster) continue;
    map.set(unwrapSource(poster).split("?")[0], {
      src,
      handle: window.match(/"handle":"([^"]*)"/)?.[1],
      brand: window.match(/"brand":"([^"]*)"/)?.[1],
    });
  }
  return map;
}

// ---------------------------------------------------------------------------
// Text and inline HTML
// ---------------------------------------------------------------------------

function classList(node) {
  const value = node?.attribs?.class || "";
  return value.split(/\s+/).filter(Boolean);
}

function asDom($, node) {
  if (!node) return undefined;
  if (typeof node.find === "function" && typeof node.get === "function") {
    return node.get(0);
  }
  return node;
}

function asCheerio($, node) {
  if (!node) return $();
  if (typeof node.find === "function" && typeof node.get === "function") return node;
  return $(node);
}

function hasClass(node, name) {
  return classList(node).includes(name);
}

function isAriaHidden(node) {
  return node?.attribs?.["aria-hidden"] === "true";
}

function isHiddenUtility(node) {
  return hasClass(node, "wire-visually-hidden");
}

function escapeText(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/[ \t\n\r\f]+/g, " ")
    .replace(/\u00a0+/g, " ")
    .trim();
}

function normalizeHref(raw) {
  if (!raw) return "";
  const href = String(raw).trim();
  if (!href) return "";
  if (
    href.startsWith("#") ||
    href.startsWith("/") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }
  if (href.startsWith("//")) return `https:${href}`;
  return href;
}

function isExternalHref(href) {
  return /^https?:\/\//i.test(href);
}

/** Serialise a DOM node to the limited inline vocabulary in the schema. */
function inlineHtml(node) {
  if (node.type === "text") return escapeText(node.data || "");
  if (node.type !== "tag") return "";
  const tag = node.name.toLowerCase();
  if (DROP_TAGS.has(tag) || isHiddenUtility(node)) return "";
  if (tag === "br") return "<br>";
  if (isAriaHidden(node) && tag !== "a") return "";

  const inner = (node.children || []).map(inlineHtml).join("");

  if (!ALLOWED_INLINE.has(tag)) return inner;

  if (tag === "a") {
    const href = normalizeHref(node.attribs?.href);
    if (!href) return inner;
    const attrs = [`href="${escapeAttr(href)}"`];
    if (isExternalHref(href)) {
      attrs.push('target="_blank"', 'rel="noreferrer noopener"');
    }
    return `<a ${attrs.join(" ")}>${inner}</a>`;
  }

  return `<${tag}>${inner}</${tag}>`;
}

function inlineHtmlOf(node) {
  return cleanInline((node.children || []).map(inlineHtml).join(""));
}

function cleanInline(html) {
  return String(html || "")
    .replace(/[ \t\n\r\f]+/g, " ")
    .trim();
}

function textContent(node) {
  if (!node) return "";
  if (node.type === "text") return node.data || "";
  if (node.type !== "tag") return "";
  const tag = node.name.toLowerCase();
  if (DROP_TAGS.has(tag) || isHiddenUtility(node) || isAriaHidden(node)) return "";
  if (tag === "br") return " ";
  const inner = (node.children || []).map(textContent).join("");
  if (WORD_CLASSES.has(classList(node).find((name) => WORD_CLASSES.has(name)))) {
    return ` ${inner} `;
  }
  return inner;
}

function visibleText(node) {
  return cleanText(textContent(node));
}

/** Headline text: word-split animation spans need explicit separators. */
function headingText(node) {
  if (!node) return "";
  const el = node;
  const words = [];
  for (const child of el.children || []) {
    if (child.type === "tag" && hasClass(child, "rv-word")) {
      words.push(cleanText(textContent(child)));
    }
  }
  if (words.length) return cleanText(words.join(" "));

  const directSpans = (el.children || []).filter(
    (child) => child.type === "tag" && child.name === "span" && cleanText(textContent(child)),
  );
  if (directSpans.length > 1) {
    return cleanText(directSpans.map((child) => cleanText(textContent(child))).join(" "));
  }
  return visibleText(el);
}

// ---------------------------------------------------------------------------
// Blocks
// ---------------------------------------------------------------------------

function proseBlock(html) {
  let value = cleanInline(html);
  // The schema models a prose block as inline HTML. One paragraph per block,
  // so unwrap the single paragraph container when callers hand us one.
  value = value.replace(/^<p>([\s\S]*)<\/p>$/i, "$1").trim();
  if (!value) return null;
  const text = cleanText(value.replace(/<[^>]*>/g, " "));
  if (!text) return null;
  return { type: "prose", html: value };
}

function paragraphBlock($, node) {
  let html = cleanInline(inlineHtmlOf(node));
  html = html.replace(/^<p>([\s\S]*)<\/p>$/i, "$1").trim();
  if (!html) return null;
  const text = cleanText(html.replace(/<[^>]*>/g, " "));
  if (!text) return null;
  return { type: "prose", html };
}

function listBlock($, node) {
  const ordered = node.name.toLowerCase() === "ol";
  const items = [];
  for (const child of node.children || []) {
    if (child.type !== "tag" || child.name.toLowerCase() !== "li") continue;
    const text = visibleText(child);
    if (text) items.push(text);
  }
  if (!items.length) return null;
  return { type: "list", ordered, items };
}

function tableBlock($, node) {
  const allRows = [];
  const head = [];
  const thead = (node.children || []).find(
    (child) => child.type === "tag" && child.name.toLowerCase() === "thead",
  );
  const tbody = (node.children || []).find(
    (child) => child.type === "tag" && child.name.toLowerCase() === "tbody",
  );

  if (thead) {
    const tr = (thead.children || []).find(
      (child) => child.type === "tag" && child.name.toLowerCase() === "tr",
    );
    if (tr) {
      let index = 0;
      for (const cell of tr.children || []) {
        if (cell.type !== "tag") continue;
        const name = cell.name.toLowerCase();
        if (name === "th" || name === "td") {
          let text = visibleText(cell);
          // The Tano column head is a wordmark plus a visually hidden label;
          // keep the accessible label when there is no visible text. The
          // leading attribute cell intentionally stays blank.
          if (!text && index > 0) text = cleanText($(cell).text());
          head.push(text);
          index += 1;
        }
      }
    }
  }

  const rowsRoot = tbody || node;
  for (const tr of rowsRoot.children || []) {
    if (tr.type !== "tag" || tr.name.toLowerCase() !== "tr") continue;
    const cells = [];
    for (const cell of tr.children || []) {
      if (cell.type !== "tag") continue;
      const name = cell.name.toLowerCase();
      if (name === "th" || name === "td") cells.push(visibleText(cell));
    }
    if (cells.some(Boolean)) allRows.push(cells);
  }

  if (!head.length && allRows.length) {
    const [first, ...rest] = allRows;
    if (first.every((cell) => !cell)) return null;
    // A table without a head still needs a stable two-dimensional shape.
    if (rest.length) return { type: "table", head: first, rows: rest };
    return { type: "table", head: [], rows: allRows };
  }
  if (!head.length && !allRows.length) return null;
  return { type: "table", head, rows: allRows };
}

function dlTableBlock($, node) {
  const rows = [];
  for (const row of node.children || []) {
    if (row.type !== "tag") continue;
    if (row.name.toLowerCase() === "div") {
      const dt = (row.children || []).find(
        (child) => child.type === "tag" && child.name.toLowerCase() === "dt",
      );
      const dd = (row.children || []).find(
        (child) => child.type === "tag" && child.name.toLowerCase() === "dd",
      );
      if (dt && dd) rows.push([visibleText(dt), visibleText(dd)]);
    }
  }
  if (!rows.length) return null;
  return { type: "table", head: [], rows };
}

function statValueText($, node) {
  if (!node) return "";
  const valueEl = asCheerio($, node).find(".hp-stat-value").first();
  if (!valueEl.length) return "";
  const clone = valueEl.clone();
  clone.find(".wire-visually-hidden").remove();
  return cleanText(clone.text());
}

/** Visible value text that keeps aria-hidden visual text but drops the
 * screen-reader duplicate (used by stat tiles and case-study figures). */
function valueText($, node) {
  if (!node) return "";
  const clone = asCheerio($, node).clone();
  clone.find(".wire-visually-hidden").remove();
  return cleanText(clone.text());
}

function statsBlock($, root, selector = ".hp-stat") {
  const items = [];
  const seen = new Set();
  for (const node of root.find(selector).toArray()) {
    const $node = $(node);
    const value = statValueText($, $node);
    const captionEl = $node.find(".hp-stat-caption").first();
    const label = visibleText(captionEl.get(0));
    if (!value || !label) continue;
    const key = `${value}\u0000${label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ value, label });
  }
  if (!items.length) return null;
  return { type: "stats", items };
}

function quoteFrom($, rawRoot) {
  const root = asCheerio($, rawRoot);
  const blockquote = root.find("blockquote.hp-brand-quote-live").first();
  const quoteEl = blockquote.length ? blockquote : root.find(".hp-brand-quote-live").first();
  if (!quoteEl.length) return null;
  const clone = quoteEl.clone();
  clone.find(".hp-brand-quote-mark, .hp-brand-quote-ghost").remove();
  let text = cleanText(clone.text());
  text = text
    .replace(/^[“"']+/, "")
    .replace(/[”"']+$/, "")
    .trim();
  if (!text) return null;

  const nameBox = root.find(".hp-brand-who-name").first();
  let name;
  let role;
  if (nameBox.length) {
    const parts = nameBox
      .children("span")
      .toArray()
      .map((child) => cleanText(textContent(child)));
    name = parts[0] || cleanText(nameBox.text());
    role = parts.slice(1).filter(Boolean).join(" · ") || undefined;
    if (!role) {
      const all = cleanText(nameBox.text());
      if (name && all.startsWith(name) && all.length > name.length) {
        role = all.slice(name.length).trim() || undefined;
      }
    }
  }

  const portrait = root
    .find(".hp-brand-portrait img, .hp-portrait img, img.hp-brand-portrait")
    .first();
  const image = portrait.length ? resolveAsset(portrait.attr("src")) : undefined;
  if (portrait.length && !image) miss("portrait", portrait.attr("src"));

  return {
    type: "quote",
    text,
    ...(name ? { name } : {}),
    ...(role ? { role } : {}),
    ...(image ? { image } : {}),
  };
}

function buildMedia({ src, alt, poster, href }) {
  if (!src) return null;
  const localPoster = poster ? resolveAsset(poster) : undefined;
  if (poster && !localPoster) miss("poster", poster);
  return {
    type: "media",
    src,
    ...(alt ? { alt } : {}),
    ...(localPoster ? { poster: localPoster } : {}),
    ...(href ? { href } : {}),
  };
}

function mediaFromImage($, img) {
  const raw = img.attr("src");
  const local = resolveAsset(raw);
  if (!local) {
    miss("image", raw);
    return null;
  }
  const alt = cleanText(img.attr("alt"));
  const anchor = $(img).closest("a[href]");
  const href = anchor.length ? normalizeHref(anchor.attr("href")) : undefined;
  return buildMedia({ src: local, alt: alt || undefined, href });
}

function figureBlocks($, rawFigure) {
  const figure = asCheerio($, rawFigure);
  const blocks = [];

  const quote = quoteFrom($, figure);
  if (quote) blocks.push(quote);

  const video = figure.find("video").first();
  if (video.length) {
    const rawVideo = video.attr("src") || video.find("source[src]").attr("src");
    const localVideo = resolveAsset(rawVideo, { video: true });
    const posterRaw = video.attr("poster") || figure.find("img").first().attr("src");
    if (localVideo) {
      const media = buildMedia({
        src: localVideo,
        alt: cleanText(video.attr("aria-label")),
        poster: posterRaw,
      });
      if (media) blocks.push(media);
    } else if (rawVideo) {
      miss("video", rawVideo);
    }
  }

  if (!blocks.length) {
    for (const img of figure.find("img").toArray()) {
      if (isAriaHidden(img) || isHiddenUtility(img)) continue;
      const alt = cleanText(img.attribs?.alt);
      if (!alt) continue;
      const media = mediaFromImage($, $(img));
      if (media) blocks.push(media);
    }
  }

  return blocks;
}

const BLOCK_CONTAINER_CLASSES = new Set([
  "wire-article-prose",
  "hp-rp-prose",
  "wire-legal-intro",
  "wire-legal-clauses",
  "hp-prose-columns",
  "hp-prose-row",
  "hp-prose-column",
  "wire-table-scroll",
  "hp-prose-table",
  "hp-rp-section",
  "hp-uc-step-card",
  "wire-study-body",
]);

/** Recursively collect blocks from a rich-text container. */
function collectBlocks($, rawRoot) {
  const root = asDom($, rawRoot) || { children: [] };
  const blocks = [];

  const visit = (node) => {
    if (!node || node.type !== "tag") return;
    const tag = node.name.toLowerCase();
    if (DROP_TAGS.has(tag)) return;
    const classes = classList(node);

    if (tag === "p") {
      const block = paragraphBlock($, node);
      if (block) blocks.push(block);
      return;
    }
    if (classes.includes("wire-study-stats")) {
      const stats = statsBlock($, $(node));
      if (stats) blocks.push(stats);
      return;
    }
    if (tag === "ul" || tag === "ol") {
      if (classes.includes("wire-study-steps") || classes.includes("wire-study-steps-list")) {
        const cards = cardsFromList($, node);
        if (cards) blocks.push(cards);
        return;
      }
      if (
        classes.includes("wire-legal-list") ||
        classes.includes("hp-rp-bullets") ||
        classes.includes("hp-rp-steps") ||
        classes.includes("hp-rp-team") ||
        classes.includes("hp-uc-steps-row")
      ) {
        if (classes.includes("hp-rp-team") || classes.includes("hp-rp-steps")) {
          const cards = cardsFromList($, node);
          if (cards) blocks.push(cards);
        } else {
          const list = listBlock($, node);
          if (list) blocks.push(list);
        }
      } else {
        const list = listBlock($, node);
        if (list) blocks.push(list);
      }
      return;
    }
    if (tag === "table") {
      const table = tableBlock($, node);
      if (table) blocks.push(table);
      return;
    }
    if (tag === "dl") {
      const table = dlTableBlock($, node);
      if (table) blocks.push(table);
      return;
    }
    if (tag === "blockquote") {
      const quote = quoteFrom($, node);
      if (quote) blocks.push(quote);
      return;
    }
    if (tag === "figure") {
      const figureContent = figureBlocks($, node);
      blocks.push(...figureContent);
      if (figureContent.length) return;
    }
    if (tag === "img") {
      const media = mediaFromImage($, $(node));
      if (media) blocks.push(media);
      return;
    }
    if (classes.includes("wire-study-quote-card") || classes.includes("wire-study-quote")) {
      const quote = quoteFrom($, $(node));
      if (quote) blocks.push(quote);
      return;
    }
    if (tag === "h2" || tag === "h3" || tag === "h4") {
      return;
    }

    // Containers recurse. Unknown divs with block content are walked too; a
    // leaf div with only inline copy is intentionally ignored (micro-UI chrome).
    const hasBlockChild = (node.children || []).some((child) => {
      if (child.type !== "tag") return false;
      const name = child.name.toLowerCase();
      return ["p", "ul", "ol", "table", "dl", "blockquote", "figure", "img", "div"].includes(name);
    });
    if (
      BLOCK_CONTAINER_CLASSES.has(classes.find((name) => BLOCK_CONTAINER_CLASSES.has(name))) ||
      hasBlockChild
    ) {
      for (const child of node.children || []) visit(child);
    }
  };

  for (const child of root.children || []) visit(child);
  return { blocks };
}

function cardsFromList($, list) {
  const items = [];
  for (const li of $(list).children("li").toArray()) {
    const title = headingText($(li).find("h3").first().get(0) || $(li).find("p").first().get(0));
    const body = visibleText($(li).find("p").last().get(0));
    const meta = visibleText(
      $(li).find(".hp-ct-index, .hp-cj-index, .hp-rp-step-number").first().get(0),
    );
    if (!title) continue;
    items.push({
      title,
      ...(body && body !== title ? { body } : {}),
      ...(meta ? { meta } : {}),
    });
  }
  return items.length ? { type: "cards", items } : null;
}

// ---------------------------------------------------------------------------
// Section helpers
// ---------------------------------------------------------------------------

function section({ id, heading, eyebrow, variant, blocks }) {
  const cleanHeading = heading ? cleanText(heading) : "";
  const cleanEyebrow = eyebrow ? cleanText(eyebrow) : "";
  const usefulBlocks = (blocks || []).filter(Boolean);
  if (!cleanHeading && !cleanEyebrow && !usefulBlocks.length) return null;
  return {
    ...(id ? { id } : {}),
    ...(cleanHeading ? { heading: cleanHeading } : {}),
    ...(cleanEyebrow ? { eyebrow: cleanEyebrow } : {}),
    ...(variant ? { variant } : {}),
    ...(usefulBlocks.length ? { blocks: usefulBlocks } : { blocks: [] }),
  };
}

function bandHeading($, band) {
  const preferred = [
    ".hp-band-heading-copy h2",
    ".hp-band-heading h2",
    ".hp-faq-head h2",
    ".hp-closing-title",
    ".wire-study-others-head h2",
    ".wire-legal-hero h1",
  ];
  for (const selector of preferred) {
    const el = band.find(selector).first();
    if (el.length) {
      const text = headingText(el.get(0));
      if (text) return text;
    }
  }
  // Only a direct child h2 belongs to the band itself; nested card headings
  // must not become section headings.
  const direct = band.children("h2").first();
  return direct.length ? headingText(direct.get(0)) : "";
}

function bandEyebrow($, band) {
  const el = band
    .find(".hp-careers-eyebrow, .wire-resource-kicker, .hp-uc-hero-eyebrow, .hp-eyebrow")
    .first();
  return el.length ? visibleText(el.get(0)) : "";
}

function subTexts($, band) {
  const selectors = [
    ".hp-band-heading-copy > p.hp-sub",
    ".hp-band-heading-copy > p",
    ".hp-uc-hero-copy > p.hp-uc-hero-sub",
    ".hp-closing-copy > p",
    ".hp-closing-copy .hp-sub",
    ".hp-team-head .hp-sub",
  ];
  const seen = new Set();
  const values = [];
  for (const selector of selectors) {
    for (const node of band.find(selector).toArray()) {
      const text = visibleText(node);
      if (text && !seen.has(text)) {
        seen.add(text);
        values.push(text);
      }
    }
    if (values.length) break;
  }
  return values;
}

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

function cardFromLinkCard($, node) {
  const card = $(node);
  const link = card.find("h3 a").first();
  const title = headingText(card.find("h3").first().get(0)) || cleanText(link.text());
  if (!title) return null;
  const bodyEl = card
    .find("p")
    .filter((_, el) => !classList(el).includes("hp-link-card-go"))
    .first();
  const body = visibleText(bodyEl.get(0));
  const href = normalizeHref(link.attr("href"));
  return {
    title,
    ...(body ? { body } : {}),
    ...(href ? { href } : {}),
  };
}

function cardFromResourceCard($, node) {
  const card = $(node);
  const title = headingText(card.find("h3").first().get(0));
  if (!title) return null;
  const href = normalizeHref(card.find("h3 a, a").first().attr("href"));
  const body = visibleText(card.find(".wire-resource-standfirst").first().get(0));
  const meta = visibleText(card.find(".wire-resource-meta").first().get(0));
  return {
    title,
    ...(body ? { body } : {}),
    ...(href ? { href } : {}),
    ...(meta ? { meta } : {}),
  };
}

function cardFromCaseGrid($, node) {
  const card = $(node);
  const title = headingText(card.find(".wire-cg-title").first().get(0));
  if (!title) return null;
  const href = normalizeHref(card.find(".wire-cg-title a, a").first().attr("href"));
  const body = visibleText(card.find(".wire-cg-intro").first().get(0));
  const img = card.find(".wire-cg-photo").first();
  const image = img.length ? resolveAsset(img.attr("src")) : undefined;
  if (img.length && !image) miss("image", img.attr("src"));
  return {
    title,
    ...(body ? { body } : {}),
    ...(href ? { href } : {}),
    ...(image ? { image } : {}),
  };
}

function cardFromCaseBanner($, node) {
  const card = $(node);
  const titleEl = card.find(".wire-case-title").first();
  const title = headingText(titleEl.get(0));
  if (!title) return null;
  const href = normalizeHref(
    card.find(".wire-case-title a, .wire-case-link, a").first().attr("href"),
  );
  const body = visibleText(card.find(".wire-case-foot p, .wire-case-intro").first().get(0));
  const metaEl = card.find(".wire-resource-meta").first();
  const meta = metaEl.length
    ? metaEl.children().length
      ? metaEl
          .children()
          .toArray()
          .map((el) => visibleText(el))
          .filter(Boolean)
          .join(" · ")
      : visibleText(metaEl.get(0))
    : "";
  const img = card.find(".wire-case-photo").first();
  const image = img.length ? resolveAsset(img.attr("src")) : undefined;
  if (img.length && !image) miss("image", img.attr("src"));
  return {
    title,
    ...(body ? { body } : {}),
    ...(href ? { href } : {}),
    ...(image ? { image } : {}),
    ...(meta ? { meta } : {}),
  };
}

function cardFromFig($, node) {
  const card = $(node);
  const title = visibleText(card.find(".wire-fig-value").first().get(0));
  if (!title) return null;
  const body = visibleText(card.find(".wire-fig-caption").first().get(0));
  const href = normalizeHref(card.attr("href") || card.find("a").first().attr("href"));
  const meta = cleanText(card.find(".hp-stat-mark-frame").first().attr("aria-label"));
  return {
    title,
    ...(body ? { body } : {}),
    ...(href ? { href } : {}),
    ...(meta ? { meta } : {}),
  };
}

function cardFromRole($, node) {
  const card = $(node);
  const title = headingText(card.find(".hp-role-title").first().get(0));
  if (!title) return null;
  const href = normalizeHref(card.attr("href") || card.find("a").first().attr("href"));
  const body = visibleText(card.find(".hp-role-summary").first().get(0));
  const tags = card
    .find(".hp-role-tag")
    .toArray()
    .map((el) => visibleText(el))
    .filter(Boolean);
  const openings = visibleText(card.find(".hp-role-openings").first().get(0));
  const meta = [openings, ...tags].filter(Boolean).join(" · ") || undefined;
  return {
    title,
    ...(body ? { body } : {}),
    ...(href ? { href } : {}),
    ...(meta ? { meta } : {}),
  };
}

function cardFromObjective($, node) {
  const card = $(node);
  const title = headingText(card.find("h3").first().get(0));
  if (!title) return null;
  const body = visibleText(card.find(".hp-objective-body").first().get(0));
  const href = normalizeHref(card.find("a.tano-button").first().attr("href"));
  const art = card
    .find(".hp-objective-art-label, .hp-objective-art-figure, .hp-objective-art-period")
    .toArray()
    .map((el) => visibleText(el))
    .filter(Boolean);
  const img = card.find(".hp-objective-ground img").first();
  const image = img.length ? resolveAsset(img.attr("src")) : undefined;
  if (img.length && !image) miss("image", img.attr("src"));
  return {
    title,
    ...(body ? { body } : {}),
    ...(href ? { href } : {}),
    ...(image ? { image } : {}),
    ...(art.length ? { meta: [...new Set(art)].join(" · ") } : {}),
  };
}

function dedupeCards(cards) {
  const seen = new Set();
  const result = [];
  for (const card of cards.filter(Boolean)) {
    const key = `${card.title}\u0000${card.href || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(card);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Page-specific extraction
// ---------------------------------------------------------------------------

function extractHero($, route, family) {
  const main = $("main").first();
  let hero = main.children("section").first();
  if (!hero.length) hero = main.children("div").first();

  const heroNode = hero.get(0);
  let copy = hero;
  if (family === "home" || family === "for-creators") {
    copy = hero.find(".hp-hero-copy").first();
  } else if (family === "contact") {
    copy = main.find(".wire-contact-head").first();
  } else if (family === "case-study") {
    copy = hero.find(".wire-study-hero-copy").first();
  } else if (family === "case-studies-index") {
    copy = hero.find(".wire-cases-hero-copy").first();
  } else if (family === "career-role") {
    copy = hero.find(".hp-rp-hero-copy").first();
  } else if (
    family === "legal" ||
    family === "news-article" ||
    family === "playbook" ||
    family === "playbooks-index" ||
    family === "webinars"
  ) {
    copy = hero.find(".wire-legal-hero-copy").first();
  } else {
    copy = hero.find(".hp-uc-hero-copy").first();
  }
  if (!copy.length) copy = hero;

  const h1 = copy.find("h1").first().length ? copy.find("h1").first() : hero.find("h1").first();
  const title = headingText(h1.get(0));
  if (!title) throw new Error(`${route.route}: hero has no title`);

  const eyebrowEl = copy
    .find(".hp-careers-eyebrow, .wire-resource-kicker, .hp-uc-hero-eyebrow, .hp-eyebrow")
    .first();
  let eyebrow = eyebrowEl.length ? visibleText(eyebrowEl.get(0)) : "";

  const paragraphs = [];
  const paragraphCandidates = [];
  if (family === "home" || family === "for-creators") {
    paragraphCandidates.push(...copy.children("p").toArray());
  } else if (family === "case-study") {
    paragraphCandidates.push(...copy.children("p.wire-study-hero-lede, p").toArray());
  } else if (family === "case-studies-index") {
    paragraphCandidates.push(...copy.find(".wire-cases-hero-standfirst").toArray());
  } else if (
    family === "legal" ||
    family === "news-article" ||
    family === "playbook" ||
    family === "playbooks-index" ||
    family === "webinars"
  ) {
    paragraphCandidates.push(...copy.find(".wire-legal-hero-measure > p").toArray());
  } else if (family === "contact") {
    paragraphCandidates.push(...copy.children("p").toArray());
  } else if (family === "career-role") {
    paragraphCandidates.push(...copy.children("p").toArray());
  } else {
    paragraphCandidates.push(...copy.children("p.hp-uc-hero-sub").toArray());
  }

  const seen = new Set();
  for (const p of paragraphCandidates) {
    if (p.type !== "tag" || p.name.toLowerCase() !== "p") continue;
    if (classList(p).includes("hp-careers-eyebrow")) continue;
    if (isHiddenUtility(p)) continue;
    const text = visibleText(p);
    if (text && !seen.has(text)) {
      seen.add(text);
      paragraphs.push(text);
    }
  }

  const actions = [];
  const actionSeen = new Set();
  for (const anchor of hero.find("a.tano-button, a.hp-action").toArray()) {
    const $anchor = $(anchor);
    if ($anchor.closest("form").length) continue;
    const href = normalizeHref(anchor.attribs?.href);
    const labelEl = $anchor.find(".tano-button__label").first();
    const label = cleanText(labelEl.length ? labelEl.text() : $anchor.text());
    if (!href || !label) continue;
    const key = `${label}\u0000${href}`;
    if (actionSeen.has(key)) continue;
    actionSeen.add(key);
    actions.push({ label, href });
  }

  const tags = hero
    .find(".hp-role-tag")
    .toArray()
    .map((el) => visibleText(el))
    .filter(Boolean);
  if (family === "career-role" && !eyebrow && tags.length) eyebrow = tags[0];

  let media;
  if (family === "home") {
    const poster = hero.find(".hp-camp-video").first().attr("poster");
    media = poster ? resolveAsset(poster) : undefined;
    if (!media) {
      const img = hero.find(".hp-hero-pin img, .hp-hero img").first();
      media = img.length ? resolveAsset(img.attr("src")) : undefined;
      if (img.length && !media) miss("image", img.attr("src"));
    }
  } else if (family === "case-study") {
    const img = hero.find(".wire-study-results-backdrop, .wire-study-hero-figures img").first();
    media = img.length ? resolveAsset(img.attr("src")) : undefined;
    if (img.length && !media) miss("image", img.attr("src"));
  } else if (family === "careers-index") {
    const img = hero.find(".hp-careers-film-shot img").first();
    media = img.length ? resolveAsset(img.attr("src")) : undefined;
    if (img.length && !media) miss("image", img.attr("src"));
  } else if (family === "contact") {
    const img = hero.find(".wire-contact-art img").first();
    media = img.length ? resolveAsset(img.attr("src")) : undefined;
    if (img.length && !media) miss("image", img.attr("src"));
  } else if (family === "for-creators") {
    const img = hero.find(".hp-ccar img").first();
    media = img.length ? resolveAsset(img.attr("src")) : undefined;
    if (img.length && !media) miss("image", img.attr("src"));
  }

  return {
    hero: {
      ...(eyebrow ? { eyebrow } : {}),
      title,
      paragraphs,
      actions,
      ...(media ? { media } : {}),
    },
    heroNode,
  };
}

function extractFaq($, band) {
  const faq = [];
  for (const row of band.find(".hp-faq-row").toArray()) {
    const $row = $(row);
    const questionEl = $row.find(".hp-faq-trigger").first();
    const answerEl = $row.find(".hp-faq-answer-text").first();
    const q = questionEl.length
      ? cleanText(questionEl.clone().find(".hp-faq-glyph").remove().end().text())
      : "";
    const a = visibleText(answerEl.get(0));
    if (q && a) faq.push({ q, a });
  }
  return faq;
}

function extractReels($, root, reelMap) {
  const blocks = [];
  const seen = new Set();
  for (const card of root.find(".wire-reel-card").toArray()) {
    const $card = $(card);
    const posterImg = $card.find(".wire-reel-poster").first();
    const posterRaw = posterImg.length ? posterImg.attr("src") : undefined;
    const posterKey = posterRaw ? unwrapSource(posterRaw).split("?")[0] : "";
    const reel = reelMap.get(posterKey);
    const video = $card.find("video").first();
    const rawVideo = reel?.src || video.attr("src") || video.find("source[src]").attr("src");
    const localVideo = resolveAsset(rawVideo, { video: true });
    if (!localVideo) {
      if (rawVideo) miss("video", rawVideo);
      continue;
    }
    const poster = resolveAsset(posterRaw);
    if (posterRaw && !poster) miss("poster", posterRaw);
    const alt = cleanText(video.attr("aria-label")) || cleanText(posterImg.attr("alt"));
    const href = normalizeHref($card.find(".wire-reel-cta, a[href]").first().attr("href"));
    const key = `${localVideo}\u0000${poster || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    blocks.push({
      type: "media",
      src: localVideo,
      ...(alt ? { alt } : {}),
      ...(poster ? { poster } : {}),
      ...(href ? { href } : {}),
    });
  }
  return blocks;
}

function flowSections($, root, options = {}) {
  const {
    baseHeading = "",
    baseEyebrow = "",
    variant = "prose",
    idFromNode = false,
    includeBaseIntro = true,
  } = options;

  const sections = [];
  let current = {
    heading: baseHeading,
    eyebrow: baseEyebrow,
    id: idFromNode ? root.attribs?.id : undefined,
    blocks: [],
    variant,
  };

  const flush = () => {
    const built = section(current);
    if (built) sections.push(built);
  };

  const addBlocks = (blocks) => {
    if (blocks.length) current.blocks.push(...blocks);
  };

  const consume = (node) => {
    if (!node || node.type !== "tag") return;
    const tag = node.name.toLowerCase();
    if (DROP_TAGS.has(tag)) return;

    if (tag === "h2") {
      const text = headingText(node);
      if (text) {
        flush();
        current = {
          heading: text,
          eyebrow: baseEyebrow,
          id: node.attribs?.id,
          blocks: [],
          variant,
        };
      }
      return;
    }
    if (tag === "h3" || tag === "h4") {
      const text = headingText(node);
      if (text) {
        flush();
        current = {
          heading: text,
          eyebrow: baseHeading || baseEyebrow,
          id: node.attribs?.id,
          blocks: [],
          variant: "subsection",
        };
      }
      return;
    }
    if (
      tag === "p" ||
      tag === "ul" ||
      tag === "ol" ||
      tag === "table" ||
      tag === "dl" ||
      tag === "blockquote" ||
      tag === "figure" ||
      tag === "img"
    ) {
      const { blocks } = collectBlocks($, { type: "tag", name: "div", children: [node] });
      addBlocks(blocks);
      return;
    }

    const classes = classList(node);
    if (classes.includes("wire-study-stats")) {
      const stats = statsBlock($, $(node));
      if (stats) current.blocks.push(stats);
      return;
    }

    if (classes.includes("wire-legal-clause")) {
      const headingEl = $(node).find("h3, h4").first();
      const clauseHeading = headingEl.length ? headingText(headingEl.get(0)) : "";
      const blocks = [];
      for (const child of node.children || []) {
        if (child.type !== "tag") continue;
        const childTag = child.name.toLowerCase();
        if (childTag === "h3" || childTag === "h4") continue;
        const result = collectBlocks($, { type: "tag", name: "div", children: [child] });
        blocks.push(...result.blocks);
      }
      const built = section({
        heading: clauseHeading,
        eyebrow: baseHeading || baseEyebrow,
        id: node.attribs?.id,
        variant: "subsection",
        blocks,
      });
      if (built) sections.push(built);
      return;
    }

    if (classes.includes("wire-legal-clauses")) {
      for (const child of node.children || []) consume(child);
      return;
    }

    // Recurse through known rich-text wrappers and containers with block children.
    const containerish = classes.some((name) => BLOCK_CONTAINER_CLASSES.has(name));
    const hasBlockChild = (node.children || []).some((child) => {
      if (child.type !== "tag") return false;
      const childTag = child.name.toLowerCase();
      return [
        "p",
        "ul",
        "ol",
        "table",
        "dl",
        "blockquote",
        "figure",
        "img",
        "div",
        "h2",
        "h3",
        "h4",
      ].includes(childTag);
    });
    if (containerish || hasBlockChild) {
      for (const child of node.children || []) consume(child);
    }
  };

  for (const child of root.children || []) consume(child);
  flush();

  if (!sections.length && includeBaseIntro && baseHeading) {
    const built = section({ heading: baseHeading, eyebrow: baseEyebrow, variant, blocks: [] });
    if (built) sections.push(built);
  }
  return sections;
}

function proseSections($, band) {
  const heading = bandHeading($, band);
  const eyebrow = bandEyebrow($, band);
  const sub = subTexts($, band);
  const sections = [];

  const rows = band.find(".hp-prose-row").toArray();
  if (rows.length) {
    for (const row of rows) {
      const $row = $(row);
      const rowHeadingEl = $row.find(".hp-prose-row-head h2, .hp-prose-row-head h3").first();
      const rowHeading = rowHeadingEl.length ? headingText(rowHeadingEl.get(0)) : "";
      const rowEyebrowEl = $row.find(".hp-prose-row-head > p").first();
      const rowEyebrow = rowEyebrowEl.length ? visibleText(rowEyebrowEl.get(0)) : "";
      const columns = $row.children(".hp-prose-columns").children(".hp-prose-column").toArray();
      const effectiveColumns = columns.length ? columns : [$row.get(0)];

      const columnEntries = effectiveColumns.map((column) => {
        const $column = $(column);
        const h3 = $column.find("h3").first();
        const columnHeading = h3.length ? headingText(h3.get(0)) : "";
        const eyebrowEl = $column.children("p.tano-body-mono-xs, p.tano-body-mono-sm").first();
        const columnEyebrow = eyebrowEl.length ? visibleText(eyebrowEl.get(0)) : "";
        return { column, columnHeading, columnEyebrow };
      });

      if (columnEntries.length > 1 && columnEntries.every((entry) => entry.columnHeading)) {
        for (const entry of columnEntries) {
          const $column = $(entry.column);
          const blocks = [];
          for (const child of entry.column.children || []) {
            if (child.type !== "tag") continue;
            const tag = child.name.toLowerCase();
            if (tag === "h3") continue;
            if (tag === "p" && child.attribs?.class?.includes("tano-body-mono")) continue;
            const result = collectBlocks($, { type: "tag", name: "div", children: [child] });
            blocks.push(...result.blocks);
          }
          const built = section({
            heading: entry.columnHeading,
            eyebrow: entry.columnEyebrow || rowEyebrow || rowHeading || heading || eyebrow,
            variant: "prose-column",
            blocks,
          });
          if (built) sections.push(built);
        }
        continue;
      }

      const introBlocks = [];
      if (sub.length && sections.length === 0 && rows.indexOf(row) === 0) {
        introBlocks.push(...sub.map((text) => proseBlock(escapeText(text))).filter(Boolean));
      }

      const targetHeading = rowHeading || heading;
      if (columnEntries.length === 1) {
        const entry = columnEntries[0];
        if (entry.columnHeading && !rowHeading) {
          // A single column with its own h3 is a titled block.
          const blocks = [];
          for (const child of entry.column.children || []) {
            if (child.type !== "tag") continue;
            if (child.name.toLowerCase() === "h3") continue;
            if (
              child.name.toLowerCase() === "p" &&
              child.attribs?.class?.includes("tano-body-mono")
            )
              continue;
            const result = collectBlocks($, { type: "tag", name: "div", children: [child] });
            blocks.push(...result.blocks);
          }
          const built = section({
            heading: entry.columnHeading,
            eyebrow: entry.columnEyebrow || rowEyebrow || heading || eyebrow,
            variant: "prose-column",
            blocks,
          });
          if (built) sections.push(built);
          continue;
        }
        const flow = flowSections($, entry.column, {
          baseHeading: targetHeading,
          baseEyebrow: rowEyebrow || (sub.length ? undefined : eyebrow),
          variant: "prose",
        });
        if (flow.length) sections.push(...flow);
        else if (targetHeading) {
          const built = section({ heading: targetHeading, blocks: introBlocks });
          if (built) sections.push(built);
        }
      } else {
        const blocks = introBlocks;
        for (const entry of columnEntries) {
          const result = collectBlocks($, entry.column);
          blocks.push(...result.blocks);
        }
        const built = section({
          heading: targetHeading,
          eyebrow: rowEyebrow || eyebrow,
          variant: "prose",
          blocks,
        });
        if (built) sections.push(built);
      }
    }
    if (!sections.length) {
      const built = section({ heading, eyebrow, variant: "prose", blocks: [] });
      if (built) sections.push(built);
    }
    return sections;
  }

  // No row wrappers: treat the band as one rich-text flow.
  const blocks = [];
  const proseRoot = band.find(".hp-prose").first().length ? band.find(".hp-prose").first() : band;
  for (const child of proseRoot.children || []) {
    if (child.type !== "tag") continue;
    const tag = child.name.toLowerCase();
    if (["p", "ul", "ol", "table", "dl", "blockquote", "figure", "img"].includes(tag)) {
      const result = collectBlocks($, { type: "tag", name: "div", children: [child] });
      blocks.push(...result.blocks);
    }
  }
  const built = section({ heading, eyebrow, variant: "prose", blocks });
  return built ? [built] : [];
}

function legalSections($, body) {
  const article = body.find(".wire-legal-measure, article").first();
  const root = article.length ? article.get(0) : body.get(0);
  const sections = [];
  let introAdded = false;

  const addIntro = (node) => {
    const { blocks } = collectBlocks($, node);
    if (blocks.length) {
      const built = section({ variant: "legal", blocks });
      if (built) sections.push(built);
      introAdded = true;
    }
  };

  for (const child of root.children || []) {
    if (child.type !== "tag") continue;
    const tag = child.name.toLowerCase();
    const classes = classList(child);

    if (tag === "nav" || tag === "style" || tag === "script") continue;

    if (
      tag === "section" &&
      (classes.includes("wire-legal-section") || classes.includes("wire-study-section"))
    ) {
      const headingEl = $(child).children("h2").first();
      const parentHeading = headingEl.length ? headingText(headingEl.get(0)) : "";
      const parentId = child.attribs?.id;

      let parentBlocks = [];
      const clauses = [];
      for (const grand of child.children || []) {
        if (grand.type !== "tag") continue;
        const grandTag = grand.name.toLowerCase();
        const grandClasses = classList(grand);
        if (grandTag === "h2") continue;
        if (grandClasses.includes("wire-legal-clauses")) {
          clauses.push(...$(grand).children().toArray());
          continue;
        }
        if (grandClasses.includes("wire-legal-clause")) {
          clauses.push(grand);
          continue;
        }
        if (grandTag === "h3" || grandTag === "h4") {
          clauses.push(grand);
          continue;
        }
        const { blocks } = collectBlocks($, { type: "tag", name: "div", children: [grand] });
        parentBlocks.push(...blocks);
      }

      const clauseData = [];
      for (const clause of clauses) {
        if (clause.type !== "tag") continue;
        const clauseTag = clause.name.toLowerCase();
        if (clauseTag === "h3" || clauseTag === "h4") continue;
        if (!classList(clause).includes("wire-legal-clause")) continue;
        const clauseHeadingEl = $(clause).find("h3, h4").first();
        const clauseHeading = clauseHeadingEl.length ? headingText(clauseHeadingEl.get(0)) : "";
        const clauseBlocks = [];
        for (const sub of clause.children || []) {
          if (sub.type !== "tag") continue;
          const subTag = sub.name.toLowerCase();
          if (subTag === "h3" || subTag === "h4") continue;
          const { blocks } = collectBlocks($, { type: "tag", name: "div", children: [sub] });
          clauseBlocks.push(...blocks);
        }
        clauseData.push({ heading: clauseHeading, blocks: clauseBlocks, id: clause.attribs?.id });
      }

      // A clause without its own h3 is simply body copy of the parent legal
      // section; keep it there instead of emitting an untitled subsection.
      for (const clause of clauseData.filter((item) => !item.heading)) {
        parentBlocks.push(...clause.blocks);
      }

      const titledClauses = clauseData.filter((item) => item.heading);
      if (
        (parentHeading && (parentBlocks.length || !titledClauses.length)) ||
        (!parentHeading && parentBlocks.length)
      ) {
        const built = section({
          id: parentId,
          heading: parentHeading,
          variant: "legal",
          blocks: parentBlocks,
        });
        if (built) sections.push(built);
      }

      for (const clause of titledClauses) {
        const built = section({
          heading: clause.heading,
          eyebrow: parentHeading || undefined,
          id: clause.id,
          variant: "subsection",
          blocks: clause.blocks,
        });
        if (built) sections.push(built);
      }
      continue;
    }

    if (
      tag === "div" &&
      (classes.includes("wire-article-prose") || classes.includes("wire-legal-intro"))
    ) {
      // Split inline h3 headings into sub-sections while preserving intro.
      const flow = flowSections($, child, {
        baseHeading: "",
        variant: "legal",
      });
      sections.push(...flow);
      introAdded = true;
      continue;
    }

    if (["p", "ul", "ol", "table", "blockquote", "figure", "img"].includes(tag)) {
      const node = { type: "tag", name: "div", children: [child] };
      if (!introAdded) addIntro(node);
      else {
        const { blocks } = collectBlocks($, node);
        if (blocks.length) {
          const built = section({ variant: "legal", blocks });
          if (built) sections.push(built);
        }
      }
    }
  }

  return sections.filter((item) => item.heading || (item.blocks && item.blocks.length));
}

function contactSection($, band) {
  const head = band.find(".wire-contact-head").first();
  if (!head.length) return null;
  const heading = headingText(head.find("h1, h2").first().get(0));
  const paragraph = head.find("p").first();
  const blocks = [];
  if (paragraph.length) {
    const html = inlineHtmlOf(paragraph.get(0));
    if (html) blocks.push(proseBlock(html));
  }
  return section({
    heading: heading || "Talk to us",
    variant: "contact",
    blocks,
  });
}

function cardsSection($, root, options = {}) {
  const { heading = "", eyebrow = "", variant = "cards", selector, mapper, id } = options;
  const items = dedupeCards(
    $(root)
      .find(selector)
      .toArray()
      .map((node) => mapper($, node)),
  );
  if (!items.length) return null;
  return section({ id, heading, eyebrow, variant, blocks: [{ type: "cards", items }] });
}

function processBand($, band, ctx) {
  const $band = $(band);
  const classes = classList(band);
  const heading = bandHeading($, $band);
  const eyebrow = bandEyebrow($, $band);
  const sub = subTexts($, $band);
  const sections = [];
  let closing;

  if ($band.is(ctx.heroNode)) return { sections, closing };
  if ($band.find("h1").length && !$band.find("h2").length) {
    // The hero has already been consumed; never re-emit it.
    if ($band.is(ctx.heroNode) || $band.closest("main").children("section").first().is($band)) {
      return { sections, closing };
    }
  }

  // Closing bands are stored in the dedicated field.
  if (
    classes.includes("hp-closing-band") ||
    $band.find(".hp-closing").length ||
    (classes.includes("tano") && !$band.find(".wire-grid").length)
  ) {
    closing = extractClosing($, $band);
    if (closing) return { sections, closing };
  }

  if (classes.includes("wire-legal-body") || $band.find(".wire-legal-body").length) {
    const body = classes.includes("wire-legal-body")
      ? $band
      : $band.find(".wire-legal-body").first();
    const legal = legalSections($, body);
    if (legal.length) sections.push(...legal);
    if (sections.length) return { sections, closing };
  }

  if (classes.includes("wire-contact-sheet") || $band.find(".wire-contact-sheet").length) {
    const sheet = classes.includes("wire-contact-sheet")
      ? $band
      : $band.find(".wire-contact-sheet").first();
    const contact = contactSection($, sheet);
    if (contact) sections.push(contact);
    return { sections, closing };
  }

  if ($band.find(".wire-lead-gate").length) {
    const gate = $band.find(".wire-lead-gate").first();
    const head = gate.find(".wire-contact-head").first();
    const gateHeading = headingText(head.find("h2").first().get(0));
    const gateEyebrow = visibleText(head.find("p.tano-body-mono-xs").first().get(0));
    const gateIntro = visibleText(head.find("p.tano-body-md").first().get(0));
    const features = head
      .find("ul li")
      .toArray()
      .map((el) => visibleText(el))
      .filter(Boolean);
    const blocks = [];
    if (gateIntro) blocks.push(proseBlock(`<p>${escapeText(gateIntro)}</p>`));
    if (features.length) {
      blocks.push({ type: "cards", items: features.map((title) => ({ title })) });
    }
    const built = section({
      heading: gateHeading || gateEyebrow,
      eyebrow: gateHeading ? gateEyebrow : undefined,
      variant: "playbook-gate",
      blocks,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-faq").length) {
    const faq = extractFaq($, $band);
    const faqHeadingEl = $band.find(".hp-faq-head .hp-band-heading h2").first();
    const faqHeading = faqHeadingEl.length ? headingText(faqHeadingEl.get(0)) : heading;
    const intro = $band.find(".hp-faq-head .hp-band-heading-copy > p").first();
    const blocks = [];
    if (intro.length) {
      const block = paragraphBlock($, intro.get(0));
      if (block) blocks.push(block);
    }
    if (faq.length) {
      blocks.push({
        type: "cards",
        items: faq.map(({ q, a }) => ({ title: q, body: a })),
      });
    }
    const built = section({ heading: faqHeading, eyebrow, variant: "faq", blocks });
    if (built) sections.push(built);
    ctx.faq.push(...faq);
    return { sections, closing };
  }

  if ($band.find(".hp-brands").length) {
    const brands = $band.find(".hp-brands").first();
    const blocks = [];
    const statValue = visibleText(brands.find(".hp-brand-stat").first().get(0));
    const statLabel = visibleText(brands.find(".hp-brand-caption").first().get(0));
    if (statValue && statLabel)
      blocks.push({ type: "stats", items: [{ value: statValue, label: statLabel }] });
    const quote = quoteFrom($, brands);
    if (quote) blocks.push(quote);
    const built = section({ heading, eyebrow, variant: "quote", blocks });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-comparison").length || $band.find("table.hp-table").length) {
    const blocks = [];
    for (const table of $band.find("table").toArray()) {
      const block = tableBlock($, table);
      if (block) blocks.push(block);
    }
    const built = section({ heading, eyebrow, variant: "comparison", blocks });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if (classes.includes("hp-prose") || $band.find(".hp-prose").length) {
    const prose = proseSections(
      $,
      $band.find(".hp-prose").first().length ? $band.find(".hp-prose").first() : $band,
    );
    if (prose.length) sections.push(...prose);
    return { sections, closing };
  }

  if ($band.find(".hp-roles").length) {
    const roles = $band.find(".hp-roles").first();
    const roleHeading = headingText(roles.find(".hp-band-heading h2").first().get(0)) || heading;
    const count = visibleText(
      roles.find(".hp-roles-count, .hp-band-heading-copy > p").first().get(0),
    );
    const built = cardsSection($, roles, {
      heading: roleHeading,
      eyebrow: count || eyebrow,
      variant: "roles",
      selector: ".hp-role",
      mapper: cardFromRole,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-team").length) {
    const team = $band.find(".hp-team").first();
    const teamHeading = headingText(team.find(".hp-band-heading h2").first().get(0)) || heading;
    const teamEyebrow = visibleText(team.find(".hp-careers-eyebrow").first().get(0)) || eyebrow;
    const blocks = [];
    const subEl = team.find(".hp-band-heading-copy > p").first();
    if (subEl.length) {
      const block = paragraphBlock($, subEl.get(0));
      if (block) blocks.push(block);
    }
    for (const img of team.find(".hp-team-print img").toArray()) {
      const media = mediaFromImage($, $(img));
      if (media) blocks.push(media);
    }
    const built = section({ heading: teamHeading, eyebrow: teamEyebrow, variant: "team", blocks });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if (
    $band.find(".hp-uc-process").length ||
    ($band.find(".hp-pp").length && $band.find(".hp-pp-slide").length)
  ) {
    const process = $band.find(".hp-uc-process").length
      ? $band.find(".hp-uc-process").first()
      : $band;
    const processHeading =
      headingText(process.find(".hp-band-heading h2").first().get(0)) || heading;
    const processSub = subTexts($, process);
    const blocks = [];
    if (processSub.length) {
      const block = proseBlock(escapeText(processSub[0]));
      if (block) blocks.push(block);
    }
    const slides = [];
    for (const slide of process.find(".hp-pp-slide").toArray()) {
      const title = headingText($(slide).find("h3").first().get(0));
      const body = visibleText($(slide).find(".hp-steps-body, p").last().get(0));
      const meta = visibleText($(slide).find(".hp-pp-owner").first().get(0));
      if (title) {
        slides.push({
          title,
          ...(body && body !== title ? { body } : {}),
          ...(meta ? { meta } : {}),
        });
      }
    }
    if (slides.length) blocks.push({ type: "cards", items: slides });
    const built = section({
      heading: processHeading,
      eyebrow: bandEyebrow($, process),
      variant: "process",
      blocks,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-track").length) {
    const track = $band.find(".hp-track").first();
    const trackHeading = headingText(track.find(".hp-band-heading h2").first().get(0)) || heading;
    const trackSub = subTexts($, track);
    const blocks = [];
    if (trackSub.length) {
      const block = proseBlock(escapeText(trackSub[0]));
      if (block) blocks.push(block);
    }
    const items = [];
    for (const card of track.find(".hp-track-card").toArray()) {
      const title = headingText($(card).find(".hp-track-note h3").first().get(0));
      const body = visibleText($(card).find(".hp-track-note p").first().get(0));
      const meta = visibleText($(card).find(".hp-tm-label").first().get(0));
      if (title) items.push({ title, ...(body ? { body } : {}), ...(meta ? { meta } : {}) });
    }
    if (items.length) blocks.push({ type: "cards", items });
    const built = section({
      heading: trackHeading,
      eyebrow: bandEyebrow($, track),
      variant: "track",
      blocks,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-stats").length) {
    const stats = $band.find(".hp-stats").first();
    const statHeading = headingText(stats.find(".hp-band-heading h2").first().get(0)) || heading;
    const statSub = subTexts($, stats);
    const blocks = [];
    if (statSub.length) {
      const block = proseBlock(escapeText(statSub[0]));
      if (block) blocks.push(block);
    }
    const stat = statsBlock($, stats);
    if (stat) blocks.push(stat);
    if (!stat && stats.find(".hp-uc-metrics-label").length) {
      const items = [];
      for (const group of stats.find(".hp-uc-metrics-label").toArray()) {
        const title = headingText(group);
        const parent = $(group).parent();
        const lines = parent
          .find(".hp-uc-metrics-list li")
          .toArray()
          .map((li) => visibleText(li))
          .filter(Boolean);
        if (title) items.push({ title, ...(lines.length ? { body: lines.join(" · ") } : {}) });
      }
      if (items.length) blocks.push({ type: "cards", items });
    }
    const built = section({
      heading: statHeading,
      eyebrow: bandEyebrow($, stats),
      variant: "stats",
      blocks,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-objectives").length) {
    const objectives = $band.find(".hp-objectives").first();
    const blocks = [];
    const subEl = objectives.find(".hp-band-heading-copy > p").first();
    if (subEl.length) {
      const block = paragraphBlock($, subEl.get(0));
      if (block) blocks.push(block);
    }
    const cards = dedupeCards(
      objectives
        .find(".hp-objective-card")
        .toArray()
        .map((node) => cardFromObjective($, node)),
    );
    if (cards.length) blocks.push({ type: "cards", items: cards });
    const built = section({
      heading: headingText(objectives.find(".hp-band-heading h2").first().get(0)) || heading,
      eyebrow: bandEyebrow($, objectives),
      variant: "objectives",
      blocks,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-creator").length) {
    const creator = $band.find(".hp-creator").first();
    const blocks = [];
    const subEl = creator.find(".hp-creator-sub").first();
    if (subEl.length) {
      const block = paragraphBlock($, subEl.get(0));
      if (block) blocks.push(block);
    }
    const built = section({
      heading: headingText(creator.find(".hp-creator-title").first().get(0)) || heading,
      eyebrow,
      variant: "creator",
      blocks,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-logo-band").length || classes.includes("hp-logo-band")) {
    const logoBand = classes.includes("hp-logo-band") ? $band : $band.find(".hp-logo-band").first();
    const caption =
      visibleText(logoBand.find(".wire-cases-marks-caption").first().get(0)) || heading;
    const marksCopy = logoBand.find(".wire-cases-marks-copy").first();
    const markScope = marksCopy.length ? marksCopy : logoBand;
    const cards = [];
    const seen = new Set();
    for (const mark of markScope.find(".wire-cases-mark").toArray()) {
      const $mark = $(mark);
      const title =
        cleanText($mark.find(".wire-cases-mark-image").first().attr("aria-label")) ||
        visibleText($mark.find(".wire-cases-mark-category").first().get(0));
      if (!title || seen.has(title)) continue;
      seen.add(title);
      const category = visibleText($mark.find(".wire-cases-mark-category").first().get(0));
      const href = normalizeHref($mark.attr("href") || $mark.find("a").first().attr("href"));
      cards.push({
        title,
        ...(category && category !== title ? { meta: category } : {}),
        ...(href ? { href } : {}),
      });
    }
    const blocks = cards.length ? [{ type: "cards", items: cards }] : [];
    const built = section({ heading: caption, variant: "logos", blocks });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".wire-study-others").length) {
    const others = $band.find(".wire-study-others").first();
    const otherHeading =
      headingText(others.find(".wire-study-others-head h2").first().get(0)) || heading;
    const otherSub = visibleText(others.find(".wire-study-others-head > p").first().get(0));
    const blocks = [];
    if (otherSub) blocks.push(proseBlock(`<p>${escapeText(otherSub)}</p>`));
    const cards = dedupeCards(
      others
        .find(".wire-case-banner")
        .toArray()
        .map((node) => cardFromCaseBanner($, node)),
    );
    if (cards.length) blocks.push({ type: "cards", items: cards });
    const built = section({ heading: otherHeading, variant: "case-studies", blocks });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".wire-cg-card").length) {
    const built = cardsSection($, $band, {
      heading,
      eyebrow,
      variant: "case-grid",
      selector: ".wire-cg-card",
      mapper: cardFromCaseGrid,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".wire-fig").length) {
    const built = cardsSection($, $band, {
      heading: heading || cleanText($band.attr("aria-label")),
      eyebrow,
      variant: "results",
      selector: ".wire-fig",
      mapper: cardFromFig,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".wire-reel-card").length) {
    const blocks = extractReels($, $band, ctx.reelMap);
    const built = section({ heading, variant: "films", blocks });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".wire-resource-card").length) {
    const built = cardsSection($, $band, {
      heading,
      eyebrow,
      variant: "cards",
      selector: ".wire-resource-card",
      mapper: cardFromResourceCard,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-link-card").length) {
    const built = cardsSection($, $band, {
      heading,
      eyebrow,
      variant: "cards",
      selector: ".hp-link-card",
      mapper: cardFromLinkCard,
      id: $band.find(".hp-band-heading").first().attr("id"),
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".wire-case-banner").length) {
    const built = cardsSection($, $band, {
      heading,
      eyebrow,
      variant: "case-cards",
      selector: ".wire-case-banner",
      mapper: cardFromCaseBanner,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-ct-row").length || $band.find(".hp-cj-row").length) {
    const blocks = [];
    const subEl = $band.find(".hp-band-heading-copy > p").first();
    if (subEl.length) {
      const block = paragraphBlock($, subEl.get(0));
      if (block) blocks.push(block);
    }
    const items = [];
    for (const card of $band.find(".hp-ct-step, .hp-cj-step").toArray()) {
      const title = headingText($(card).find("h3").first().get(0));
      const body = visibleText($(card).find("p").first().get(0));
      const meta = visibleText($(card).find(".hp-ct-index, .hp-cj-index").first().get(0));
      if (title) items.push({ title, ...(body ? { body } : {}), ...(meta ? { meta } : {}) });
    }
    if (items.length) blocks.push({ type: "cards", items: dedupeCards(items) });
    const built = section({ heading, eyebrow, variant: "cards", blocks });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-cp").length) {
    const cp = $band.find(".hp-cp").first();
    const copy = cp.find(".hp-cp-copy").first();
    const blocks = [];
    for (const p of copy.find("p").toArray()) {
      const block = paragraphBlock($, p);
      if (block) blocks.push(block);
    }
    const statEl = cp.find(".hp-cp-stat").first();
    if (statEl.length) {
      const value = valueText($, statEl.find(".tano-heading-lg").first().get(0));
      const full = valueText($, statEl.get(0));
      if (value && full) {
        const label = cleanText(full.startsWith(value) ? full.slice(value.length) : full);
        if (label) blocks.push({ type: "stats", items: [{ value, label }] });
      }
    }
    const built = section({
      heading: headingText(copy.find("h2").first().get(0)) || heading,
      eyebrow,
      variant: "profile",
      blocks,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-uc-steps-row").length) {
    const blocks = [];
    const subEl = $band.find(".hp-band-heading-copy > p").first();
    if (subEl.length) {
      const block = paragraphBlock($, subEl.get(0));
      if (block) blocks.push(block);
    }
    const items = [];
    for (const card of $band.find(".hp-uc-step").toArray()) {
      const title = headingText($(card).find("h3").first().get(0));
      const body = visibleText($(card).find("p").first().get(0));
      const meta = visibleText($(card).find(".hp-uc-step-node").first().get(0));
      if (title) items.push({ title, ...(body ? { body } : {}), ...(meta ? { meta } : {}) });
    }
    if (items.length) blocks.push({ type: "cards", items });
    const built = section({ heading, eyebrow, variant: "steps", blocks });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-uc-case").length) {
    const caseEl = $band.find(".hp-uc-case").first();
    const blocks = [];
    const caseHeading = headingText(caseEl.find("h2").first().get(0)) || heading;
    const href = normalizeHref(
      caseEl.find(".hp-uc-case-actions a[href], a.tano-button[href]").first().attr("href"),
    );
    const img = caseEl.find(".hp-uc-case-ground img, .hp-uc-case-media img").first();
    if (img.length) {
      const media = mediaFromImage($, img);
      if (media) {
        blocks.push({ ...media, ...(href ? { href } : {}) });
      }
    }
    const figure = valueText($, caseEl.find(".hp-uc-tile-figure").first().get(0));
    const note = visibleText(caseEl.find(".hp-uc-tile-note").first().get(0));
    if (figure && note) blocks.push({ type: "stats", items: [{ value: figure, label: note }] });

    const quoteEl = caseEl.find(".hp-uc-case-quote").first();
    if (quoteEl.length) {
      const text = cleanText(quoteEl.clone().text())
        .replace(/^[“"']+/, "")
        .replace(/[”"']+$/, "")
        .trim();
      const who = caseEl.find(".hp-uc-case-who").first();
      const name = visibleText(who.find(".tano-body-sm").first().get(0));
      const role = visibleText(who.find(".hp-sub").first().get(0));
      if (text) {
        blocks.push({
          type: "quote",
          text,
          ...(name ? { name } : {}),
          ...(role ? { role } : {}),
        });
      }
    }

    const built = section({ heading: caseHeading, eyebrow, variant: "case-study", blocks });
    if (built) sections.push(built);
    return { sections, closing };
  }

  if ($band.find(".hp-team").length) {
    return { sections, closing };
  }

  if ($band.find(".hp-rp-close").length) {
    const close = $band.find(".hp-rp-close").first();
    const blocks = [];
    const subEl = close.find("p").first();
    if (subEl.length) {
      const block = paragraphBlock($, subEl.get(0));
      if (block) blocks.push(block);
    }
    const built = section({
      heading: headingText(close.find("h2").first().get(0)) || heading,
      variant: "closing",
      blocks,
    });
    if (built) sections.push(built);
    return { sections, closing };
  }

  // Generic fallback: preserve the heading, sub-copy and any simple rich text.
  if (heading || sub.length || $band.find(".wire-article-prose").length) {
    const blocks = sub.map((text) => proseBlock(`<p>${escapeText(text)}</p>`)).filter(Boolean);
    for (const prose of $band.find(".wire-article-prose").toArray()) {
      const { blocks: proseBlocks } = collectBlocks($, prose);
      blocks.push(...proseBlocks);
    }
    const built = section({ heading, eyebrow, variant: "content", blocks });
    if (built) sections.push(built);
  }

  return { sections, closing };
}

function processRoleSections($, main) {
  const sections = [];
  let parentHeading = "";
  const metaTags = main
    .find(".hp-rp-hero .hp-role-tag")
    .toArray()
    .map((el) => visibleText(el))
    .filter(Boolean);
  if (metaTags.length) {
    const labels = ["Department", "Location", "Contract", "Openings", "Detail"];
    sections.push(
      section({
        heading: "Role details",
        variant: "role-meta",
        blocks: [
          {
            type: "stats",
            items: metaTags.map((value, index) => ({ value, label: labels[index] || "Detail" })),
          },
        ],
      }),
    );
  }

  for (const node of main.find(".hp-rp-section").toArray()) {
    const $node = $(node);
    const directH2 = $node.children("h2").first();
    const directH3 = $node.children("h3").first();
    const heading = headingText((directH2.length ? directH2 : directH3).get(0));
    let eyebrow = "";
    if (directH2.length) {
      parentHeading = heading;
    } else if (directH3.length) {
      eyebrow = parentHeading;
    }
    const blocks = [];
    const introBlocks = [];
    for (const child of node.children || []) {
      if (child.type !== "tag") continue;
      const tag = child.name.toLowerCase();
      const classes = classList(child);
      if (tag === "h2") continue;
      if (tag === "div" && classes.includes("hp-rp-prose")) {
        for (const p of $(child).children("p").toArray()) {
          const block = paragraphBlock($, p);
          if (block) introBlocks.push(block);
        }
        continue;
      }
      if (tag === "ul" && classes.includes("hp-rp-bullets")) {
        const list = listBlock($, child);
        if (list) blocks.push(list);
        continue;
      }
      if (tag === "ul" && classes.includes("hp-rp-team")) {
        const items = [];
        for (const li of $(child).children("li").toArray()) {
          const title = headingText($(li).find("p").first().get(0));
          const body = visibleText($(li).find("p").last().get(0));
          if (title) items.push({ title, ...(body && body !== title ? { body } : {}) });
        }
        if (items.length) blocks.push({ type: "cards", items });
        continue;
      }
      if (tag === "ol" && classes.includes("hp-rp-steps")) {
        const items = [];
        for (const li of $(child).children("li").toArray()) {
          const title = visibleText($(li).find("span.tano-body-para-md").first().get(0));
          const meta = visibleText($(li).find(".hp-rp-step-number").first().get(0));
          if (title) items.push({ title, ...(meta ? { meta } : {}) });
        }
        if (items.length) blocks.push({ type: "cards", items });
        continue;
      }
      if (tag === "dl" && classes.includes("hp-rp-table")) {
        const table = dlTableBlock($, child);
        if (table) blocks.push(table);
        continue;
      }
      if (tag === "h3") {
        continue;
      }
      if (
        tag === "p" ||
        tag === "ul" ||
        tag === "ol" ||
        tag === "table" ||
        tag === "blockquote" ||
        tag === "figure"
      ) {
        const result = collectBlocks($, { type: "tag", name: "div", children: [child] });
        blocks.push(...result.blocks);
      }
    }

    if (introBlocks.length || blocks.length) {
      const built = section({
        heading,
        eyebrow,
        variant: "role",
        blocks: [...introBlocks, ...blocks],
      });
      if (built) sections.push(built);
    }
  }

  const close = main.find(".hp-rp-close").first();
  if (close.length) {
    const blocks = [];
    const p = close.find("p").first();
    if (p.length) {
      const block = paragraphBlock($, p.get(0));
      if (block) blocks.push(block);
    }
    const built = section({
      heading: headingText(close.find("h2").first().get(0)),
      variant: "closing",
      blocks,
    });
    if (built) sections.push(built);
  }
  return sections;
}

function extractClosing($, band) {
  const $band = $(band);
  let titleEl = $band.find(".hp-closing-title").first();
  if (!titleEl.length) titleEl = $band.find(".hp-band-heading h2").first();
  if (!titleEl.length) return undefined;
  const title = headingText(titleEl.get(0));
  if (!title) return undefined;

  const bodyParts = [];
  const bodies = $band.find(".hp-closing-copy > p").toArray();
  if (!bodies.length) bodies.push(...$band.find(".hp-band-heading-copy > p").toArray());
  for (const p of bodies) {
    const text = visibleText(p);
    if (text && !bodyParts.includes(text)) bodyParts.push(text);
  }

  const ctaAnchor = $band.find("a.tano-button[href], a.hp-action[href]").first();
  if (!ctaAnchor.length) return undefined;
  const href = normalizeHref(ctaAnchor.attr("href"));
  const labelEl = ctaAnchor.find(".tano-button__label").first();
  const label = cleanText(labelEl.length ? labelEl.text() : ctaAnchor.text());
  if (!href || !label) return undefined;

  return {
    title,
    body: bodyParts.join(" "),
    cta: { label, href },
  };
}

function familyFor(route) {
  if (route === "/") return "home";
  if (route === "/careers") return "careers-index";
  if (route.startsWith("/careers/")) return "career-role";
  if (route === "/case-studies") return "case-studies-index";
  if (route.startsWith("/case-studies/")) return "case-study";
  if (route === "/compare") return "compare-index";
  if (route.startsWith("/compare/")) return "compare";
  if (route === "/guides") return "guides-index";
  if (route.startsWith("/guides/")) return "guide";
  if (route === "/news") return "news-index";
  if (route.startsWith("/news/")) return "news-article";
  if (route === "/playbooks") return "playbooks-index";
  if (route.startsWith("/playbooks/")) return "playbook";
  if (route === "/for-creators") return "for-creators";
  if (route === "/privacy-policy") return "legal";
  if (route === "/talk-to-us") return "contact";
  if (route.startsWith("/use-cases/")) return "use-case";
  if (route === "/webinars") return "webinars";
  return "page";
}

function readCapture(route) {
  const primary = path.join(RESEARCH, route.slug, "page.html");
  if (fs.existsSync(primary)) return { html: fs.readFileSync(primary, "utf8") };
  const fallbackName =
    route.route === "/"
      ? "_root.html"
      : `${route.route.replace(/^\//, "").replaceAll("/", "__")}.html`;
  const fallback = path.join(FALLBACK_SITE, fallbackName);
  if (fs.existsSync(fallback)) return { html: fs.readFileSync(fallback, "utf8") };
  throw new Error(`${route.route}: no capture at ${primary} and no fallback at ${fallback}`);
}

function topBands($, main) {
  const bands = [];
  const walk = (node) => {
    for (const child of node.children || []) {
      if (child.type !== "tag") continue;
      const tag = child.name.toLowerCase();
      if (tag === "script" || tag === "style" || tag === "template") continue;
      if (tag === "section") {
        bands.push(child);
        continue;
      }
      if (tag === "div") {
        const classes = classList(child);
        if (
          classes.some((name) =>
            [
              "hp-band",
              "wire-band",
              "wire-legal-body",
              "wire-contact-sheet",
              "wire-study-films",
              "wire-study-others",
              "hp-rp-close",
            ].includes(name),
          )
        ) {
          bands.push(child);
        } else {
          walk(child);
        }
      }
    }
  };
  walk(main);
  return bands;
}

function collectPageCards(family, sections) {
  const indexFamilies = new Set([
    "careers-index",
    "case-studies-index",
    "compare-index",
    "guides-index",
    "news-index",
    "playbooks-index",
  ]);
  if (!indexFamilies.has(family)) return [];

  const fallbackGroups = {
    "careers-index": "Open roles",
    "case-studies-index": "Case studies",
    "compare-index": "Comparisons",
    "news-index": "News",
    "playbooks-index": "Playbooks",
  };
  const cards = [];
  const pushCards = (items, group) => {
    for (const item of items) {
      if (!item.title || !item.href) continue;
      cards.push({
        title: item.title,
        ...(item.body ? { body: item.body } : {}),
        href: item.href,
        ...(group ? { group } : {}),
      });
    }
  };

  for (const sectionItem of sections) {
    if (!["cards", "case-grid", "roles", "case-cards"].includes(sectionItem.variant)) continue;
    for (const block of sectionItem.blocks || []) {
      if (block.type === "cards") {
        pushCards(block.items, sectionItem.heading || fallbackGroups[family]);
      }
    }
  }

  const seen = new Set();
  return cards.filter((card) => {
    const key = `${card.title}\u0000${card.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractPage(route) {
  const { html } = readCapture(route);
  const $ = cheerio.load(html);
  $("script, style, noscript, template").remove();

  const main = $("main").first().length ? $("main").first() : $("body").first();
  const family = familyFor(route.route);
  const reelMap = buildReelMap(html);

  const title = cleanText($("title").first().text()) || route.title || route.route;
  const description = cleanText(
    $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "",
  );

  const { hero, heroNode } = extractHero($, route, family);
  const ctx = { heroNode, reelMap, faq: [] };
  const sections = [];
  let closing;

  if (family === "career-role") {
    sections.push(...processRoleSections($, main));
  } else {
    const bands = topBands($, main.get(0));
    const seenSections = new Set();
    for (const band of bands) {
      const result = processBand($, band, ctx);
      for (const item of result.sections) {
        const key = JSON.stringify(item);
        if (seenSections.has(key)) continue;
        seenSections.add(key);
        sections.push(item);
      }
      if (result.closing) closing = result.closing;
    }
  }

  // Contact stats, hero and section copy are all handled by processBand.
  // (Kept as an explicit no-op so future layout changes have one seam.)

  // Case-study hero stats and client/sector facts live outside the body flow.
  if (family === "case-study") {
    const heroBand = $("main .wire-study-hero").first();
    const heroStats = statsBlock($, heroBand);
    const factItems = [];
    for (const fact of heroBand.find(".wire-study-fact").toArray()) {
      const label = visibleText($(fact).find("dt").first().get(0));
      const value = visibleText($(fact).find("dd").first().get(0));
      if (label && value) factItems.push({ value, label });
    }
    const items = [...factItems, ...(heroStats?.items || [])];
    if (items.length) {
      sections.unshift(
        section({
          variant: "case-study-stats",
          blocks: [{ type: "stats", items }],
        }),
      );
    }
  }

  if ((family === "use-case" || family === "compare") && $(".hp-uc-hero-proof").length) {
    const proof = $(".hp-uc-hero-proof").first();
    const statHeading = visibleText(proof.find(".hp-stat-group-label").first().get(0));
    const stats = statsBlock($, proof);
    if (stats) {
      sections.unshift(
        section({
          heading: statHeading || "Results",
          variant: "hero-stats",
          blocks: [stats],
        }),
      );
    }
  }

  const faq = ctx.faq;

  if (!closing && family === "playbook") {
    const ctaBands = $("main section.hp-band")
      .toArray()
      .filter((band) => $(band).find("a.tano-button[href]").length);
    const lastCta = ctaBands[ctaBands.length - 1];
    if (lastCta) {
      const fallbackClosing = extractClosing($, lastCta);
      if (fallbackClosing) {
        closing = fallbackClosing;
        const index = sections.findIndex((item) => item.heading === fallbackClosing.title);
        if (index >= 0) sections.splice(index, 1);
      }
    }
  }

  const pageCards = collectPageCards(family, sections);

  const builtSections = sections.map((item) => section(item)).filter(Boolean);

  return {
    route: route.route,
    family,
    meta: { title, description },
    hero,
    sections: builtSections,
    ...(faq.length ? { faq } : {}),
    ...(closing ? { closing } : {}),
    ...(pageCards.length ? { cards: pageCards } : {}),
  };
}

// ---------------------------------------------------------------------------
// Validation and output
// ---------------------------------------------------------------------------

function collectStrings(value, output) {
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, output);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [childKey, childValue] of Object.entries(value)) {
    if (typeof childValue === "string") {
      if (["image", "media", "mediaPoster", "poster", "src"].includes(childKey)) {
        output.push({ key: childKey, value: childValue });
      }
    } else {
      collectStrings(childValue, output);
    }
  }
}

function validatePage(page, route) {
  const errors = [];
  if (!page.hero || !page.hero.title || !page.hero.title.trim()) errors.push("empty hero.title");
  if (!Array.isArray(page.sections) || page.sections.length < 1) errors.push("no sections");
  const serialized = JSON.stringify(page);
  if (/<script\b|<style\b/i.test(serialized)) errors.push("script/style leaked");
  if (/<form\b|<input\b/i.test(serialized)) errors.push("form leaked");

  const mediaStrings = [];
  collectStrings(page, mediaStrings);
  for (const { key, value } of mediaStrings) {
    if (/^https?:\/\//i.test(value)) {
      errors.push(`remote ${key}: ${value.slice(0, 80)}`);
      continue;
    }
    if (value.startsWith("/") && !fs.existsSync(path.join(PUBLIC_DIR, value.slice(1)))) {
      errors.push(`missing ${key}: ${value}`);
    }
  }

  if (errors.length) {
    throw new Error(`${route.route}:\n  - ${errors.join("\n  - ")}`);
  }
}

function main() {
  fs.mkdirSync(PAGES_DIR, { recursive: true });

  const written = [];
  const failures = [];
  for (const route of routes) {
    try {
      const page = extractPage(route);
      validatePage(page, route);
      const file = path.join(PAGES_DIR, `${route.slug}.json`);
      fs.writeFileSync(file, `${JSON.stringify(page, null, 2)}\n`);
      written.push({ route, page });
    } catch (error) {
      failures.push(error instanceof Error ? error.stack || error.message : String(error));
    }
  }

  const mediaCount = mediaMisses.size
    ? [...mediaMisses.entries()].reduce((total, [, count]) => total + count, 0)
    : 0;

  if (failures.length) {
    console.error(`\n${failures.length} route(s) failed:`);
    for (const failure of failures) console.error(`\n${failure}`);
    console.error(`\n${written.length}/${routes.length} routes extracted.`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Extracted ${written.length}/${routes.length} routes -> ${path.relative(ROOT, PAGES_DIR)}`,
  );
  console.log(
    `Pages: ${written.filter(({ page }) => page.sections.length > 0).length}/${routes.length} have sections; ` +
      `${written.reduce((total, { page }) => total + page.sections.length, 0)} sections total.`,
  );
  if (mediaCount) {
    console.log(
      `Note: ${mediaCount} unmapped decorative media reference(s) were omitted (no local asset in asset-map.json).`,
    );
  }
  console.log("OK: schema, hero/section presence, local media and sanitisation checks passed.");
}

main();
