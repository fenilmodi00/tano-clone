import fs from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
import * as cheerio from "cheerio";
const MAP = JSON.parse(await fs.readFile("docs/research/tano/asset-map.json", "utf8"));
const ORIGIN = "https://www.tano.ai";
const missing = new Map();
async function localize(url) {
  if (!url) return null;
  let u = url.replace(/&amp;/g, "&");
  if (u.startsWith("/sites/tano/") || u.startsWith("data:")) return u;
  if (MAP[u]) return MAP[u];
  if (u.startsWith("/") && MAP[ORIGIN + u]) return MAP[ORIGIN + u];
  if (u.includes("/_next/image")) {
    const inner = decodeURIComponent(new URL(u, ORIGIN).searchParams.get("url") || "");
    if (MAP[inner]) return MAP[inner];
  }
  let abs = u.startsWith("http") ? u : ORIGIN + u;
  let base = new URL(abs).pathname.split("/").filter(Boolean).at(-1) || "asset";
  const dest = path.join("public/sites/tano/extras", base);
  if (!missing.has(abs)) {
    missing.set(abs, dest);
    try {
      const res = await fetch(abs);
      if (res.ok) {
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
        MAP[abs] = "/sites/tano/extras/" + base;
        MAP[ORIGIN + new URL(abs).pathname] = "/sites/tano/extras/" + base;
      } else console.log("fail", res.status, abs);
    } catch (e) {
      console.log("err", abs, e.message);
    }
  }
  return "/sites/tano/extras/" + base;
}
const data = JSON.parse(await fs.readFile("/tmp/uc-frames.json", "utf8"));
const out = {};
for (const [route, frames] of Object.entries(data)) {
  const key = route.includes("creative") ? "creative-velocity" : "drive-revenue";
  out[key] = [];
  for (const frame of frames) {
    if (!frame) continue;
    const $ = cheerio.load(frame.html, { decodeEntities: false });
    $("script,noscript,style").remove();
    for (const el of $("img").toArray()) {
      const $el = $(el);
      const src = await localize($el.attr("src") || "");
      if (src) $el.attr("src", src);
      $el.removeAttr("srcset");
      $el.removeAttr("sizes");
      $el.removeAttr("loading");
      $el.removeAttr("data-nimg");
    }
    for (const el of $("video").toArray()) {
      const $el = $(el);
      const src = await localize($el.attr("src") || "");
      if (src) $el.attr("src", src);
      const poster = await localize($el.attr("poster") || "");
      if (poster) $el.attr("poster", poster);
    }
    const html = $.html();
    out[key].push(gzipSync(Buffer.from(html)).toString("base64"));
  }
  console.log(key, out[key].length);
}
const ts = `/* Generated from the public Tano use-case step scenes. */\nconst PAYLOADS: Record<string, string[]> = ${JSON.stringify(out, null, 2)};\n\nexport async function loadUseCaseScenes(key: "drive-revenue" | "creative-velocity"): Promise<string[]> {\n  return Promise.all((PAYLOADS[key] ?? []).map(async (payload) => {\n    const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));\n    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));\n    return new Response(stream).text();\n  }));\n}\n`;
await fs.writeFile("src/components/sites/tano/pages/use-case-scenes.ts", ts);
await fs.writeFile("docs/research/tano/asset-map.json", JSON.stringify(MAP, null, 2));
console.log("module", ts.length, "downloaded", missing.size);
