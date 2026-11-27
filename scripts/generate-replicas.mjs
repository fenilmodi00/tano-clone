/**
 * Generate React replica components from the saved (SSR) Tano HTML.
 * Keeps the source design-system class structure (styles ported in source.css),
 * localizes every asset and strips runtime scripts.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { parse } from "node:url";
const require = createRequire(import.meta.url);
const HTMLtoJSX = require("htmltojsx");
import * as cheerio from "cheerio";

const SRC = process.env.TANO_SRC || "/home/boxd/tano/site";
const CONTENT_DIR = "src/content/pages";
const TEMPLATE_FAMILIES = new Set(["guide", "compare", "playbook"]);
const dryRun = process.argv.includes("--dry-run");
const MAP = JSON.parse(fs.readFileSync("docs/research/tano/asset-map.json", "utf8"));
const ROUTES = JSON.parse(fs.readFileSync("docs/research/tano/routes.json", "utf8"));
const ORIGIN = "https://www.tano.ai";

const byInner = new Map();
const byPath = new Map();
for (const [k, v] of Object.entries(MAP)) {
  if (k.includes("/_next/image")) {
    const inner = new URL(k).searchParams.get("url") || "";
    byInner.set(decodeURIComponent(inner.split("?")[0]), v);
    byInner.set(inner.split("?")[0], v);
  } else {
    byPath.set(new URL(k).pathname, v);
  }
}
for (const [k, v] of Object.entries(MAP)) {
  if (!k.includes("/_next/image")) byPath.set(new URL(k).pathname, v);
}

function localize(url) {
  if (!url) return null;
  const u = url.trim().replace(/&amp;/g, "&");
  if (u.startsWith("data:") || u.startsWith("/sites/tano/") || u.startsWith("/brand-mark/"))
    return u;
  if (MAP[u]) return MAP[u];
  if (u.startsWith("/") && MAP[ORIGIN + u]) return MAP[ORIGIN + u];
  if (u.includes("/_next/image")) {
    const inner = new URL(u, ORIGIN).searchParams.get("url") || "";
    const clean = decodeURIComponent(inner.split("?")[0]);
    if (byInner.has(clean)) return byInner.get(clean);
    if (byPath.has(clean)) return byPath.get(clean);
    if (MAP[clean]) return MAP[clean];
    if (MAP[clean.split("?")[0]]) return MAP[clean.split("?")[0]];
  }
  try {
    const p = new URL(u, ORIGIN).pathname;
    if (byPath.has(p)) return byPath.get(p);
    if (byInner.has(p)) return byInner.get(p);
    const base = p.split("/").filter(Boolean).at(-1);
    if (base) {
      const extra = path.join("public/sites/tano/extras", base);
      if (fs.existsSync(extra)) return "/sites/tano/extras/" + base;
      const mark = path.join("public/brand-mark", base);
      if (fs.existsSync(mark)) return "/brand-mark/" + base;
    }
  } catch {}
  return null;
}

function savedFile(route) {
  const parts = route.split("/").filter(Boolean);
  if (parts.length === 0) return "_root.html";
  return parts.join("__") + ".html";
}

function camelStyleKeys(jsx) {
  // htmltojsx rewrites CSS custom properties (`--reel-count`) into `-reelCount`.
  // Restore every leading-dash style key to a quoted custom property.
  jsx = jsx.replace(/([{,]\s*)'?(-[a-zA-Z][A-Za-z0-9]*)'?\s*:/g, (_m, pre, key) => {
    const kebab = key.slice(1).replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
    return `${pre}'--${kebab}':`;
  });
  if (process.env.DEBUG_STYLE) console.log("AFTER", jsx.slice(jsx.indexOf("style={{")));
  return jsx;
}

function cleanHtml(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  $("script, noscript, style, template").remove();
  $("link").remove();
  $("img").each((_, el) => {
    const $el = $(el);
    const src = localize($el.attr("src") || "");
    if (src) $el.attr("src", src);
    $el.removeAttr("srcset");
    $el.removeAttr("sizes");
    $el.removeAttr("data-nimg");
    $el.removeAttr("loading");
    if ($el.attr("alt") === undefined) $el.attr("alt", "");
    const value = $el.attr("value");
    if (value !== undefined) {
      $el.removeAttr("value");
      $el.attr("data-default-value", value);
    }
  });
  $("video").each((_, el) => {
    const $el = $(el);
    const src = localize($el.attr("src") || "");
    if (src) $el.attr("src", src);
    const poster = localize($el.attr("poster") || "");
    if (poster) $el.attr("poster", poster);
    $el.removeAttr("style").attr("preload", "metadata");
  });
  $("[style]").each((_, el) => {
    const $el = $(el);
    const style = $el.attr("style") || "";
    if (!style.includes("url(")) return;
    $el.attr(
      "style",
      style.replace(
        /(\/_next\/image\?[^"'\s)]+|https:\/\/cdn\.sanity\.io\/[^"'\s)]+)/g,
        (match) => {
          const local = localize(match.replace(/&amp;/g, "&"));
          return local || match;
        },
      ),
    );
  });
  $("option").each((_, el) => {
    const $el = $(el);
    $el.removeAttr("selected");
    $el.removeAttr("defaultSelected");
  });
  $("source").each((_, el) => {
    const $el = $(el);
    const src = localize($el.attr("src") || "");
    if (src) $el.attr("src", src);
    $el.removeAttr("srcset");
  });
  return $.html();
}

function sanitizeJsx(jsx) {
  jsx = camelStyleKeys(jsx);
  jsx = jsx.replace(/\bdata-default-value=/g, "defaultValue=");

  // Attribute fixes apply only inside tags; JSX text and quoted values stay untouched.
  const fixTag = (tag) => {
    const values = [];
    tag = tag.replace(/="([^"]*)"/g, (_m, value) => {
      values.push(value);
      return `="\u0000${values.length - 1}\u0000"`;
    });
    tag = tag.replace(/\bfetchpriority=/g, "fetchPriority=");
    tag = tag.replace(/\benterkeyhint=/g, "enterKeyHint=");
    tag = tag.replace(/\bautocapitalize=/g, "autoCapitalize=");
    tag = tag.replace(/\bautocorrect=/g, "autoCorrect=");
    tag = tag.replace(/\baria-hidden=""/g, 'aria-hidden="true"');
    tag = tag.replace(/\baria-label(?=[\s\/>])/g, 'aria-label=""');
    tag = tag.replace(/\balt(?=[\s\/>])/g, 'alt=""');
    tag = tag.replace(/\bvalue(?=[\s\/>])/g, 'value=""');
    tag = tag.replace(/\bplaceholder(?=[\s\/>])/g, 'placeholder=""');
    tag = tag.replace(/\bdefaultValue(?=[\s\/>])/g, 'defaultValue=""');
    tag = tag.replace(/\bdefaultSelected(?=[\s\/>])/g, "selected");
    tag = tag.replace(/="\u0000(\d+)\u0000"/g, (_m, i) => `="${values[Number(i)]}"`);
    return tag;
  };
  jsx = jsx.replace(/<[^<>]*>/g, fixTag);
  return jsx;
}

function readFamilies() {
  const families = new Map();
  for (const file of fs.readdirSync(CONTENT_DIR, { recursive: true })) {
    if (!String(file).endsWith(".json")) continue;
    const data = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, String(file)), "utf8"));
    families.set(data.route, data.family);
  }
  return families;
}

function outputFor(route) {
  const dir =
    route === "/" ? "src/app/_home" : path.join("src/app", route.replace(/^\//, ""), "_components");
  return path.join(dir, "captured-body.tsx");
}

function main() {
  const made = [];
  const families = readFamilies();
  for (const row of ROUTES) {
    const route = row.route;
    if (TEMPLATE_FAMILIES.has(families.get(route))) {
      console.log("TEMPLATE", route);
      continue;
    }
    const outFile = outputFor(route);
    if (dryRun) {
      console.log("WOULD WRITE", route, "->", outFile);
      made.push({ route, file: outFile });
      continue;
    }
    const file = path.join(SRC, savedFile(route));
    if (!fs.existsSync(file)) {
      console.log("MISSING", route, savedFile(route));
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
    const $ = cheerio.load(html, { decodeEntities: false });
    const main = $("main").first();
    if (!main.length) {
      console.log("NO MAIN", route);
      continue;
    }
    const mainAttrs = {};
    for (const [k, v] of Object.entries(main.attr() || {})) mainAttrs[k] = v;
    const pageStyles = $("main style")
      .map((_, el) => $(el).html() || "")
      .get()
      .filter((css) => css && !css.includes("mux-player") && !css.includes("rv-scope"))
      .join("\n");
    let inner = cleanHtml(main.html() || "");
    inner = inner.replace(/<!--[\s\S]*?-->/g, "");
    const converter = new HTMLtoJSX({ createClass: false });
    let jsx;
    try {
      jsx = converter.convert(`<div data-replica-root>${inner}</div>`);
    } catch (err) {
      console.log("CONVERT FAIL", route, err.message);
      continue;
    }
    // unwrap the synthetic root
    jsx = jsx.replace(/^<div data-replica-root>/, "").replace(/<\/div>\s*$/, "");
    jsx = sanitizeJsx(jsx);
    const attrStr = Object.entries(mainAttrs)
      .map(([k, v]) => {
        if (k === "class") return `className=${JSON.stringify(v)}`;
        if (k === "id") return `id=${JSON.stringify(v)}`;
        return `${k}=${JSON.stringify(v)}`;
      })
      .join(" ");
    const out = `/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main ${attrStr}>
      ${pageStyles ? `<style dangerouslySetInnerHTML={{ __html: ${JSON.stringify(pageStyles)} }} />` : ""}
${jsx}
    </main>
  );
}
`;
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, out);
    made.push({ route, file: outFile, bytes: out.length });
    console.log(String(out.length).padStart(7), route, "->", outFile);
  }
  console.log(dryRun ? "would generate" : "generated", made.length);
}

main();
