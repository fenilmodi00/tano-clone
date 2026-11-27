<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tano clone — production rebuild

## What this is

A 44-route Next.js 16 rebuild of the Tano marketing site: captured copy/assets, source-faithful
layout, motion and interactions. It is a reference build, not a deployment of Tano.

Read `docs/ARCHITECTURE.md` before changing route structure, styling, metadata or motion, and
`docs/EVIDENCE.md` before touching captures or assets.

## Tech stack

- **Framework:** Next.js 16 App Router, React 19, TypeScript strict.
- **Styling:** the ported Tano design system in `src/styles/` (tokens, layers, keyframes).
  Tailwind utilities and the shadcn scaffold were removed; do not add a second styling convention.
- **Motion:** CSS keyframes plus small DOM-query hooks; Lenis for smooth scroll.
- **Content:** per-route JSON, a generated route/SEO manifest, and data-driven playbook/compare
  templates.
- **Verification:** Playwright, pixelmatch, static-build assertion.

## Commands

- `npm run dev` — dev server on `http://localhost:3000`.
- `npm run check` — format, content-manifest, lint, typecheck, build, static assertion.
- `npm run format` / `npm run format:check` — Prettier.
- `npm run content:check` — fail if `src/content/routes.ts` is stale.
- `npm run typecheck`, `npm run lint`.
- `npm run verify:visibility`, `npm run verify:links`, `npm run verify:smoke`,
  `npm run verify:client-nav` — runtime gates against port 3000.
- `npm run verify` / `npm run verify:motion` — live-source pixel/motion matrix.
- `npm run assert:static` — 44 prerendered routes, zero dynamic routes, SEO endpoints present.

## Code style

- TypeScript strict, no `any`; named exports; PascalCase components; camelCase utilities.
- Use the existing design-system classes and tokens. Avoid inline styles unless the value is
  per-instance data (custom properties, media URLs, chart values).
- Every internal link uses `next/link`; do not add a document-level click interceptor.
- 2-space indentation; Prettier owns formatting.

## Structure

```
src/app/<route>/page.tsx        route entry + JSON-derived metadata
src/app/<route>/_components/    route-local captured body (21 routes)
src/app/_home/                  home body, data and controllers
src/app/_runtime/               client runtime composition
src/app/guides/_components/     guide template + brands (14 details)
src/app/compare/_components/    compare template (4 details)
src/app/playbooks/_components/  playbook template (5 details)
src/components/ui/              shared button and FAQ row
src/components/layout/          header, footer, mobile nav, consent, logo strings
src/components/media/           shared reel card
src/components/status-page.tsx  shared 404/error/loading surface
src/hooks/                      shared client hooks
src/lib/                        metadata, site config, motion primitives, form model
src/content/
  routes.ts                     generated route/SEO manifest
  pages/                        route-mirrored JSON content
  types.ts
src/styles/                     design system, purged CSS, runtime CSS, route shims
scripts/                        capture, generation, verification, assertions
docs/ARCHITECTURE.md            current design + migration plan
```

## Rules

- Metadata lives in each route's JSON and flows through `buildPageMetadata`; never duplicate
  title/description literals in `page.tsx`.
- Add a route by adding its JSON, then regenerate `routes.ts`; `content:check` must pass.
- Generated replicas/content/CSS are format-ignored. Running the capture generator overwrites
  hand edits; diff before accepting.
- Runtime-only classes (Lenis, JS-built markup, inline SVG strings) belong in
  `src/styles/runtime.css`, not the purged vendor stylesheet.
- Keep the `@media (scripting: none)` reveal fallback when changing reveal CSS or hooks.
- Do not add fixed `width`/`height` to absolutely positioned media without checking the CSS
  aspect ratio; this previously distorted the case-study reel cards.
- Guides, compare and playbooks now use JSON templates; follow the remaining family order in
  `docs/ARCHITECTURE.md` and verify each family against the live source before deleting replicas.
