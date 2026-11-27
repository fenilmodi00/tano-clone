import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — The Creator Advertising Platform`,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: site.backgroundColor,
    theme_color: site.themeColor,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
