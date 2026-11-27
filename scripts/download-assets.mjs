/**
 * Download the assets used by the captured Tano pages into public/sites/tano.
 * Writes docs/research/tano/asset-map.json (source URL -> local public path).
 */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const RESEARCH = path.resolve("docs/research/tano");
const PUBLIC = path.resolve("public/sites/tano");
const ORIGIN = "https://www.tano.ai";
const LIMIT_BYTES = 30 * 1024 * 1024;

const extra = [
  `${ORIGIN}/textures/hp-fold-a.webp`,
  `${ORIGIN}/textures/hp-fold-b.webp`,
  `${ORIGIN}/brand/hero/tano-app-icon.png`,
  `${ORIGIN}/brand/hero/cursor.svg`,
  `${ORIGIN}/brand/shoots/footer-daylight.glass.jpg`,
  `${ORIGIN}/brand/shoots/footer-daylight.sm.glass.jpg`,
];

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

function realSource(url) {
  // Unwrap Next's image proxy to the underlying asset.
  if (url.includes("/_next/image")) {
    const inner = new URL(url).searchParams.get("url");
    if (inner) return inner.startsWith("http") ? inner : ORIGIN + inner;
  }
  const u = new URL(url, ORIGIN);
  // Asset URLs accept size params; drop them to get the original.
  u.search = "";
  return u.toString();
}

async function main() {
  const pages = (await fs.readdir(RESEARCH, { withFileTypes: true }))
    .filter((d) => d.isDirectory() && d.name !== "svg")
    .map((d) => d.name);

  const urls = new Set(extra);
  for (const dir of pages) {
    try {
      const data = JSON.parse(await fs.readFile(path.join(RESEARCH, dir, "page.json"), "utf8"));
      for (const img of data.imgs) if (img.src) urls.add(img.src);
      for (const v of data.videos) {
        if (v.src) urls.add(v.src);
        if (v.poster) urls.add(v.poster);
      }
    } catch {
      /* page without capture */
    }
  }

  const map = {};
  const used = new Set();
  let index = 0;
  for (const url of [...urls].sort()) {
    const src = realSource(url);
    const u = new URL(src);
    let ext = path.extname(u.pathname).toLowerCase();
    if (!/^\.(png|jpe?g|webp|avif|gif|svg|mp4|webm|vtt|woff2?)$/.test(ext)) ext = ".bin";
    if (ext === ".jpeg") ext = ".jpg";

    // Prefer a readable hint from the path.
    const parts = u.pathname.split("/").filter(Boolean);
    let hint = parts.at(-1)?.replace(ext, "") ?? "asset";
    if (/^[0-9a-f]{20,}/i.test(hint)) hint = parts.at(-2) ?? "asset";
    if (hint === "production" || hint === "images" || hint === "files") hint = "tano";
    const base = `${slug(hint) || "asset"}${ext}`;
    let name = base;
    let n = 2;
    while (used.has(name)) name = `${slug(hint)}-${n++}${ext}`;
    used.add(name);

    const dest = path.join(PUBLIC, ext === ".mp4" || ext === ".webm" ? "video" : "images", name);
    await fs.mkdir(path.dirname(dest), { recursive: true });

    try {
      const head = await fetch(src, { method: "HEAD" });
      const len = Number(head.headers.get("content-length") || 0);
      if (len > LIMIT_BYTES) {
        console.log("skip large", Math.round(len / 1e6) + "MB", src);
        continue;
      }
      const res = await fetch(src);
      if (!res.ok) {
        console.log("fail", res.status, src);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > LIMIT_BYTES) {
        console.log("skip large", Math.round(buf.length / 1e6) + "MB", src);
        continue;
      }
      await fs.writeFile(dest, buf);
      const hash = crypto.createHash("sha1").update(buf).digest("hex").slice(0, 8);
      map[url] = `/sites/tano/${path.relative(PUBLIC, dest)}`.replace(/\\/g, "/");
      console.log(`${(buf.length / 1024).toFixed(0)}K ${map[url]}`);
      index++;
    } catch (err) {
      console.log("error", src, err.message);
    }
  }
  await fs.writeFile(path.join(RESEARCH, "asset-map.json"), JSON.stringify(map, null, 2));
  console.log(`downloaded ${index} assets`);
}

main();
