import type { Metadata } from "next";
import type { Page } from "@/content/types";
import { site } from "./site";

type PageMetadataInput = Pick<Page, "route" | "meta">;

/**
 * Route metadata comes from the same JSON that feeds the page content, so the
 * title/description cannot drift between `page.tsx` and `content/`.
 */
export function buildPageMetadata(page: PageMetadataInput): Metadata {
  const { title, description } = page.meta;
  const canonical = page.route === "/" ? "/" : page.route;
  const image = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: `${title} — ${site.name}`,
  };

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: site.allowIndexing,
      follow: site.allowIndexing,
    },
  };
}
