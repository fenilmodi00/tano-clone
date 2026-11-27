import type { MetadataRoute } from "next";
import { ROUTES } from "@/content/routes";
import { absoluteUrl, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.contentUpdatedAt);

  return ROUTES.map((route) => {
    const isHome = route.path === "/";
    const isHub = !isHome && route.path.split("/").filter(Boolean).length === 1;
    return {
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: isHome || route.family === "news-index" ? "weekly" : "monthly",
      priority: isHome ? 1 : isHub ? 0.8 : 0.6,
    };
  });
}
