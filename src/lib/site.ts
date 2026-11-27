/**
 * Deployment-level site configuration.
 *
 * The clone is indexed only when explicitly allowed: publishing a copy of
 * Tano's brand and copy must be a deliberate decision, never a default.
 */
const fallbackUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const site = {
  name: "Tano",
  shortName: "Tano",
  description:
    "Tano enables consumer brands to partner with creators programmatically, running it like a performance channel.",
  /** Set NEXT_PUBLIC_SITE_URL to the canonical deployment origin. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl).replace(/\/+$/, ""),
  locale: "en_GB",
  themeColor: "#0e0d0c",
  backgroundColor: "#0e0d0c",
  /** Search indexing is opt-in because this is a reference clone. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  /** Fixed so sitemap builds are reproducible. */
  contentUpdatedAt: "2026-11-27",
} as const;

export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
