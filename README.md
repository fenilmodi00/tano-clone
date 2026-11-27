# Tano.ai — local reference clone

A working Next.js rebuild of the Tano marketing site (44 routes, the real copy, local media, source-faithful layout, motion and interactions). This is a **local reference/study build**, not a deployment of Tano and not affiliated with Tano Limited. All brand assets and copy belong to their owners; do not publish or use the clone to impersonate Tano.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + production build
```

Production: `npm run build && npm run start` (or `node .next/standalone/server.js` if using the template's standalone output).

## What is implemented

- **44 routes** with the source pathnames: home, two use cases, case-study hub + four studies, guides hub + 14 guides, playbooks hub + 5, compare hub + 4, careers hub + 3 roles, news hub + article, webinars, privacy, for creators, talk to us.
- **Source design system** ported into `src/styles/tano/source.css` (tokens, grid, typography, 129 keyframes, responsive rules). Fonts are the real ABC Whyte files served locally.
- **Shell**: fixed glass nav with the four-stage entrance, dropdowns, mobile menu with focus trap, announcement toast (entry, dismiss, scroll-hide), footer, cookie consent, and the site-wide `/talk-to-us` drawer.
- **Motion**: Lenis smooth scroll (disabled for coarse pointer / reduced motion / contact page); GroundShift dark↔light page transitions at the source's 45%-viewport line with the 600 ms veil; RevealMotion word-splitting + 95% release line + 70/46 ms staggers; 8 s hero campaign reels with real handles/avatars/videos and 600 ms scene exits; counters, ticker, logo marquee (26 px/s), case deck scroll math, FAQ/tabs/trackers, experiments (4.2 s), closing cards, case-study films and reels.
- **Forms**: source field sets and validation for talk-to-us (two-step), creator signup and the drawer form, with local success states (no backend calls).

## Architecture

```
src/app/<route>/page.tsx        route + per-route metadata
src/components/sites/tano/
  replica/                      generated SSR content (one component per route)
  shell/                        nav, footer, announcement, consent, drawer, logos
  motion/                       one hook per behaviour, composed by SiteRuntime
  home/                         hero campaign, conversations, experiments, media/info sections
  pages/                        non-home page behaviour
  media/                        case-study films/gates/reels
  forms/                        shared form components
src/content/tano/               extracted content model (typed) for future data-driven refactors
src/styles/tano/                ported source CSS + per-workstream CSS
scripts/                        capture, asset sync, replica generation, verification
docs/research/tano/             frozen evidence (44 captures, motion laws, responsive, interactions)
docs/verify/                    comparison reports and diff images
```

Page markup is **generated** from the frozen SSR captures, so it should not be hand-edited. Change the capture or `scripts/generate-replicas.mjs` instead, then regenerate. Behaviour lives in the `motion/*` hooks; each owns its observers/timers and returns cleanup. `SiteRuntime` only calls the hooks.

### Regenerate content from the evidence

```bash
node scripts/capture-source.mjs            # refresh page/DOM evidence (live)
node scripts/download-assets.mjs           # refresh local assets
node scripts/generate-replicas.mjs         # rebuild replica components
```

`scripts/extract-source-content.mjs` produces the typed content model in `src/content/tano/pages` (used for metadata and future data-driven pages).

## Client-side navigation and Cloudflare

Page-scoped hooks are keyed by `usePathname()`: `SiteRuntime` keeps Lenis and GroundShift mounted, while `<PageRuntime key={pathname}>` remounts reveal, hero, media and page behaviours after the App Router commits a route. This is what prevents the “subpage turns black until refresh” failure. Regression: `npm run verify:client-nav` (44 routes + history; exits non-zero on a hidden page).

When serving through a tunnel or custom hostname in **dev**, list that hostname in `next.config.ts` → `allowedDevOrigins`; otherwise Next blocks its dev resources and the page can arrive without hydration (no nav, no Lenis, no animations). The production server has no such restriction. Current config includes `127.0.0.1`, `localhost`, and `dev.kaplun.tech`.

## Blank/black page guard

The source hides reveal content with CSS until JS adds `.rv-in`. If a stale dev cache or a failed chunk leaves hydration off, the page shows the dark ground only. The app now includes an inline fail-safe that reveals all content after ~3 s when `.rv-in` is missing, and `npm run verify:visibility` checks every route for visible above-fold content and console errors.

If the site ever looks blank after a build: stop the server, remove `.next`, rebuild, and restart. Never run `next build` while a `next dev`/`next start` process is serving the same `.next` directory.

```bash
npm run verify:visibility
```

## Verification

The harness compares the clone against the live source at matched viewport, scroll and state:

```bash
npm run verify          # 44 routes × 1568 px, summary + report
npm run verify:motion   # hero/counters/experiments/marquee/ground-theme
npm run verify:visibility  # 44-route blank-page/hydration guard
npm run verify:client-nav  # 44-route SPA navigation + history audit
```

Latest 1568 baseline (`docs/verify/REPORT.md`, 2026-11-27):

| Metric                      |                          Value |
| --------------------------- | -----------------------------: |
| Route/width pairs captured  |             176 / 176 (44 × 4) |
| Median static-band diff     |                      **0.44%** |
| Mean static-band diff       |                      **0.86%** |
| Median whole-page diff      |                      **0.58%** |
| Pairs under 1% static       |                      133 / 176 |
| Missing images (both sides) |                              0 |
| Height deltas               | 10 pairs, all ≤4 px (rounding) |

Per-width static mean/median: **1568** 0.63%/0.37%, **1440** 0.86%/0.48%, **1024** 0.89%/0.43%, **390** 1.07%/0.79%.

Motion best-frame diffs: hero **0.02%**, experiments **0.05%**, ground theme **0.15%**, marquee **0.00%**; counters differ by design because the live values tick on a wall clock. Mobile widths were measured at 390, 1024 and 1440; no horizontal overflow was found.

## Known differences

- **HelloFresh case-study films** are private/signed Mux assets; they are not mirrored. The three gates are present, validate locally, and disclose the missing film. Other case films are real local MP4s.
- Native `<video controls>` replaces Mux's custom player chrome.
- Brand-tab cards 1+ on `/compare` pages swap quote/media/tab but not the secondary stat/who/action nodes (the replica capture only carried study 0 for those three nodes).
- Use-case pitch-deck scenes 2–5 advance their step state but not every scene asset (`comp-giftbox`, two creator portraits) because those assets were not in the public capture.
- `/talk-to-us` success is local-only instead of redirecting to the source booking calendar.
- `/for-creators` closing media is a one-shot entrance; the static metric catches it mid-phase, so its 6–8% figure reflects animation phase, not settled content (settled states match). All other routes are under 5% at every width.
- The template's unused shadcn/Tailwind primitives remain installed from the scaffold.

## Tooling

- Playwright + Chromium: capture and verification.
- Chrome DevTools MCP: added to `~/.omp/agent/mcp.json` as `chrome-devtools` (`--headless --isolated`); restart the client to load it.
- Lenis: smooth scroll, matching the source options.
- GSAP is intentionally not used — the source's motion is CSS keyframes plus small state machines, and the clone reproduces those directly; adding GSAP would duplicate the timers.

# tano-clone
