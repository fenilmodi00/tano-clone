# Cloudflare Workers deployment

Production: <https://app.kaplun.tech>, Worker `tano-clone`, custom domain declared in
`cloudflare.config.ts`.

The production target is Cloudflare Workers with vinext, Cloudflare's current
Next.js-on-Workers integration. OpenNext remains the maintenance path for
existing OpenNext apps; this repo started fresh on vinext.

## Why this shape

- All 44 routes are static. `staticAssetsAdapter()` prerenders every route at
  build time and serves the snapshot through the `ASSETS` binding; no route
  renders per request.
- `--image-optimization=none` because the site does not use `next/image`.
  Captured `<img>` markup is served as-is.
- `--data-cache=none` because the site has no `fetch` cache or `"use cache"`
  entries. There is no KV namespace to provision.
- Hashed `/_next/static/*` responses, fonts, images and brand marks skip the
  Worker and are served directly by Workers Static Assets; `public/_headers`
  carries their cache policies. HTML, RSC payloads and video stay worker-first
  so `next.config.ts` headers and byte-range handling still apply.

## Commands

```bash
npm run dev              # Next.js dev server, port 3000
npm run dev:vinext       # Vite/vinext dev server in workerd, port 3001
npm run build:vinext     # prerender + Workers Build Output
npm run start:vinext     # local Workers preview, http://localhost:4173
NEXT_PUBLIC_SITE_URL=https://app.kaplun.tech npm run deploy:vinext
```

Login once with `npx cf auth login`, or set `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` in CI. The deploy command reads `cloudflare.config.ts`;
do not add a root `wrangler.jsonc` for this Worker.

`cf deploy --prebuilt --dry-run` validates the built output without uploading.

## Build split

`next.config.ts` only emits `output: "standalone"` when `NEXT_OUTPUT=standalone`
is set. The Dockerfile sets it; the Cloudflare/vinext build must not, because
vinext tries to emit a Node standalone bundle under `dist/` while the Cloudflare
Vite plugin writes its Build Output under `.cloudflare/`.

## Assets and limits

Workers Static Assets allows 25 MiB per file (20,000 files on Free, 100,000 on
Paid). The three case-study films were 48–92 MiB at 1080p, so they were
transcoded to 720p H.264 with AAC audio and `+faststart`:

| File                         | Original |      Now |
| ---------------------------- | -------: | -------: |
| `papier-case-study.mp4`      | 91.5 MiB | 19.2 MiB |
| `papier-cpa.mp4`             | 60.6 MiB | 11.1 MiB |
| `bloom-and-wild-rebrand.mp4` | 48.2 MiB |  9.2 MiB |

The originals are kept in `.archive/sites/tano/media/` (gitignored) for
reversibility. Re-encode with `ffmpeg -vf scale=-2:720 -c:v libx264 -preset
medium -crf 25 -maxrate 750k -bufsize 1500k -c:a aac -b:a 64k`.

The Wrangler temporary preview account has a **5 MiB per-asset** cap, so it
cannot host these films. Use a real account (or claim the temporary account)
for a complete deployment. For even larger media, use Cloudflare Stream or R2
behind the Worker instead of Workers Assets.

## Range requests

Workers Static Assets answers a `Range` request with the whole file and no
`Content-Range`. Safari needs partial responses for video, so `worker/index.js`
intercepts video paths, slices the requested bytes, and returns `206` with
`Accept-Ranges`, `Content-Length` and `Content-Range`. Every other request is
handed to `vinext/server/fetch-handler`.

## Performance

Measured on the production deployment: TTFB 228 ms, FCP 508 ms, LCP 712 ms,
zstd-compressed HTML, and `x-vinext-cache: HIT` on all 44 prerendered routes.
The client build is 280 KB of JavaScript and 61 KB of CSS, both
brotli-compressed.

- `/_next/static/*`, `/sites/tano/fonts/*`, `/sites/tano/images/*`,
  `/brand-mark/*` and the immutable captured images under
  `/sites/tano/extras/*` (`jpg`, `jpeg`, `png`, `webp`, `avif`) skip the Worker
  and are served directly by Workers Static Assets. `public/_headers` carries
  their cache policies.
- HTML, RSC payloads and the remaining route output stay worker-first so the
  `next.config.ts` security headers and the `staticAssetsAdapter()` snapshot
  still apply.
- Video under `/sites/tano/extras/*` (`mp4`, `webm`, `mov`) stays worker-first
  so `worker/index.js` can answer `Range` requests with `206`.

The `runWorkerFirst` negative rules cover only files with a fixed cache policy
in `public/_headers`, so an extras image request is answered by Workers Static
Assets and never reaches the Worker.

## Environment

- `NEXT_PUBLIC_SITE_URL` is inlined at build time and feeds canonical links,
  sitemap, robots and structured metadata. Set it to the production origin
  before `npm run build:vinext`.
- `NEXT_PUBLIC_ALLOW_INDEXING=true` is required to allow indexing. The default
  is off because this is a reference clone.
- Worker logs and traces are enabled in `cloudflare.config.ts`; view them in
  the Cloudflare dashboard.

## Workers Builds

Connect the repository to a Worker named `tano-clone`, leave the build command
empty, and use:

- Deploy command: `npm run deploy:vinext`
- Preview command: `npx vinext-cloudflare previews deploy`

Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ALLOW_INDEXING` as build variables,
plus `CLOUDFLARE_API_TOKEN` as a secret. Workers Builds cannot deploy a project
that only has `cloudflare.config.ts` via its default `wrangler deploy` command;
the explicit commands above are required.

## Verification

```bash
npx cf deploy --prebuilt --dry-run   # asset sizes, bundle, bindings
npm run start:vinext                 # then curl the routes
```

Check `/`, a font, an image, a video with `Range: bytes=0-1023` (expect `206`),
`/sitemap.xml`, `/robots.txt` and a missing route (expect `404`).
