/**
 * Assert that the production build is fully static and that every route has
 * its HTML plus the generated SEO endpoints. Run after `next build`.
 */
import fs from "node:fs";
import path from "node:path";

const routes = JSON.parse(fs.readFileSync("docs/research/tano/routes.json", "utf8")).map(
  (entry) => entry.route,
);
const manifestPath = ".next/prerender-manifest.json";
if (!fs.existsSync(manifestPath)) {
  console.error(`Missing ${manifestPath}; run npm run build first.`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const dynamicRoutes = Object.keys(manifest.dynamicRoutes ?? {});
if (dynamicRoutes.length) {
  console.error(`Expected a static build; found dynamic routes: ${dynamicRoutes.join(", ")}`);
  process.exit(1);
}

const missing = [];
for (const route of routes) {
  const html =
    route === "/"
      ? path.join(".next/server/app/index.html")
      : path.join(`.next/server/app${route}.html`);
  if (!fs.existsSync(html)) missing.push(route);
}
if (missing.length) {
  console.error(`Missing prerendered HTML for ${missing.length} route(s):\n${missing.join("\n")}`);
  process.exit(1);
}

for (const file of [
  ".next/server/app/sitemap.xml.body",
  ".next/server/app/robots.txt.body",
  ".next/server/app/manifest.webmanifest.body",
  ".next/server/app/opengraph-image.body",
]) {
  if (!fs.existsSync(file)) {
    console.error(`Missing generated metadata endpoint: ${file}`);
    process.exit(1);
  }
}

const sitemap = fs.readFileSync(".next/server/app/sitemap.xml.body", "utf8");
const locCount = (sitemap.match(/<loc>/g) ?? []).length;
if (locCount !== routes.length) {
  console.error(`Sitemap has ${locCount} URLs; expected ${routes.length}.`);
  process.exit(1);
}

console.log(
  `Static output OK: ${routes.length} routes, 0 dynamic, sitemap/robots/manifest/OG present.`,
);
