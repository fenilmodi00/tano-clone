import type { NextConfig } from "next";

// Keep the Cloudflare dev hostname in the default: without it Next blocks the
// HMR origin and the client never hydrates behind https://dev.kaplun.tech.
const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "127.0.0.1,localhost,dev.kaplun.tech")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Applied to production responses only: the dev server injects its own inline
// HMR runtime, so the shipped policy is not meant to gate local development.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Docker self-hosting opts into standalone output; the Cloudflare/vinext
  // build must keep Vite's output because standalone emission looks for dist/.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY }]
            : []),
        ],
      },
      // Dev chunk URLs are stable across recompiles, so a cached copy leaves an
      // open tab running a module from an older compile (e.g. an intermediate
      // edit missing an import). Cloudflare rewrites the dev server's
      // `no-cache` to a four-hour `max-age`; `no-store` keeps both the edge and
      // the browser out of the way. Production chunks are content-hashed and
      // keep the immutable policy below.
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              source: "/_next/static/:path*",
              headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
            },
          ]
        : []),
      {
        source: "/sites/tano/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/sites/tano/extras/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/brand-mark/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/sites/tano/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/sites/tano/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/sites/tano/video/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
