# Handoff — Tano clone

Status: buildable, 44 routes live, motion + interactions integrated. Last verification: `docs/verify/REPORT.md` (1568 baseline), `docs/verify/summary.json`, `docs/verify/motion/*`.

## Run / check

```bash
npm install
npm run dev
npm run check
npm run verify
npm run verify:motion
```

Dev server used during the build: `http://127.0.0.1:3000`. Production check: `npm run build && npm run start` (standalone warning is printed; the app serves normally).

## Routes

All 44 captured paths are implemented, including `/`, `/use-cases/{drive-revenue,creative-velocity}`, `/case-studies` + 4 studies, `/guides` + 14, `/playbooks` + 5, `/compare` + 4, `/careers` + 3 roles, `/news` + article, `/webinars`, `/privacy-policy`, `/for-creators`, `/talk-to-us`. Route files are under `src/app/<path>/page.tsx`; each imports a generated replica and exports its source metadata.

## Source of truth

- Page evidence: `/home/boxd/tano` (frozen 2026-11-26) and `docs/research/tano` (fresh captures).
- Motion law: `docs/research/tano/motion/{inventory.md,js-orchestration.md,scroll-and-states.md,keyframes.json,home-frames/}`.
- Responsive: `docs/research/tano/responsive/rules.md`.
- Interactions: `docs/research/tano/interactions/report.md`.
- Assets: `docs/research/tano/asset-map.json` → `public/sites/tano` and `public/brand-mark`.

## Code map

- `src/styles/tano/source.css`: merged live CSS chunks. If source CSS changes, re-collect the 14 chunks (see README) and keep page-specific chunks after base rules. The role-page `.hp-rp-hero-copy` override in `pages.css` exists because the merge order differs from the live page.
- `src/components/sites/tano/motion/index.ts`: every behaviour hook. `runtime.tsx` composes them.
- `src/components/sites/tano/replica/`: generated markup. Regenerate with `node scripts/generate-replicas.mjs`; never hand-edit.
- `src/components/sites/tano/shell/`: header/nav/mobile panel, footer, announcement, consent, drawer.
- `src/components/sites/tano/home/` + `pages/` + `media/` + `forms/`: family controllers owned by the workstream docs in `docs/coordination/`.
- `scripts/`: capture (`capture-source`, `capture-hero`), asset sync, replica generation, content extraction, `smoke-routes`, `compare-route`, `compare-motion`, `verify-all`.

## Measured results (1568 px)

- 176 route/width pairs (44 × 1568/1440/1024/390): median static diff 0.44%, mean 0.86%, 133/176 under 1%, 0 missing images.
- Per-width static mean/median: 1568 0.63/0.37, 1440 0.86/0.48, 1024 0.89/0.43, 390 1.07/0.79.
- Height parity: all pairs within 4 px; most 0.
- Motion best frames: hero 0.02%, experiments 0.05%, ground theme 0.15%, marquee 0.00%. Counters differ because live values tick on a wall clock.
- Theme tone sequence (dark/light at five scroll points) matches live on 11 audited routes.
- Lenis active, hero reels cycle four real campaigns at 8 s with playing videos and changing handle/avatar; drawer/consent/mobile menu/FAQ/forms verified.

## Black-page incident (fixed)

A stale dev/build state left the reveal stylesheet hiding all content because hydration never ran, producing a full-page dark rectangle. Fix: clean production rebuild and restart; the hero video now plays independently of the reel timer, and an inline fail-safe reveals content after ~3 s if `.rv-in` never lands. `npm run verify:visibility` guards all 44 routes.

## SPA and hostname incidents (fixed)

- Subpage content stayed at opacity 0 after in-app navigation because page hooks were mounted once. `runtime.tsx` now splits global (Lenis/GroundShift/client-nav) from page-scoped hooks keyed by `usePathname()`. `scripts/audit-client-nav.mjs` covers 44 routes + history.
- The Cloudflare hostname `dev.kaplun.tech` was missing from `allowedDevOrigins`; Next dev blocked its dev resources and hydration never ran (no nav/Lenis/animations). Added to `next.config.ts`; production is unaffected. `dev.kaplun.tech` now hydrates normally.
- Home steps cursor and use-case process scenes were restored: cursor moves across `[data-cursor]` targets; pitch-deck scenes get `data-running` and replay on step change.

## Residual work (prioritized)

1. `/case-studies` hub, role-hero width and playbook lead gates were fixed late (hub static 30.85→0.02, senior role +64 px→0, playbook mobile 5–10%→<0.5).
2. **HelloFresh films**: signed Mux streams cannot be fetched without a token that grants playback. Gates disclose this; posters are the 160×90 source thumbnails. If access is granted, add MP4s to `public/sites/tano/media` and map them in `media/case-films.tsx`.
3. **Mux chrome**: native `<video controls>` replaces the custom Mux player skin. Only a visual difference on played films.
4. **Brand-tab secondary nodes**: `/compare` cards 1+ retain study 0's stat/who/action; source data for those nodes is not in the capture. Extend `content/home-marks.ts` + `media-sections.tsx`.
5. **Use-case pitch-deck scenes 2–5**: step state advances; missing assets `comp-giftbox` and two creator portraits mean not every scene art swaps. Capture them from a live session and extend `pages/behaviours.tsx` + asset map.
6. **Talk-to-us success** is a local success panel; source redirects to a Superhuman booking URL. Add the redirect if product behavior matters more than a self-contained demo.
7. **For-creators closing** media entrance is a one-shot; the static harness catches phase and reports 7.95%, settled states match. Mark that band `motion` in the harness if it should not count as static.
8. Template residue: unused shadcn/Tailwind primitives and `src/components/ui/button.tsx` can be removed after confirming no future use.

## Attribution

Copy, logos, fonts, photography and video remain Tano Limited's property. This project is a local reverse-engineering reference; it must not be deployed as Tano or used for phishing/impersonation. See `README.md`.
