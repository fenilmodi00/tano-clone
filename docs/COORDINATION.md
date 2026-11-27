# Clone coordination

Working dir: `/home/boxd/tano-clone`. Dev server: `http://127.0.0.1:3000` (already running; do not restart it).
Evidence is frozen: `/home/boxd/tano` (saved pages/assets/bundles) and `/home/boxd/tano-clone/docs/research/tano` (fresh captures, motion specs, responsive metrics, interactions).

## What exists

- Next.js 16 App Router, React 19, TS strict. Source CSS ported in `src/styles/tano/source.css`; reveal CSS in `src/styles/tano/reveal.css`; brand fonts + all assets local.
- 44 routes are rendered by generated replica components in `src/components/sites/tano/replica/` (one per route). They reproduce the source SSR markup, so all pages already match source section heights and static layout. Treat these files as content; do not rewrite them by hand unless your task owns one.
- Shell: `src/components/sites/tano/shell/*` (header, mobile panel, announcement, footer). `src/components/sites/tano/runtime.tsx` mounts page behaviours.
- Behaviour modules live in `src/components/sites/tano/motion/`. Each hook is called once in `SiteRuntime`; it runs a `useEffect`, applies DOM behaviour, and returns its cleanup from inside the effect.
- Motion laws: `docs/research/tano/motion/{js-orchestration.md,inventory.md,scroll-and-states.md,keyframes.json}`.
- Responsive truth: `docs/research/tano/responsive/{rules.md,metrics.json}`.
- Interaction evidence: `docs/research/tano/interactions/`.
- Page-frame evidence: `docs/research/tano/motion/home-frames/` (143 screenshots + JSON), `docs/research/tano/<slug>/page.{html,json,png}`.

## Non-negotiables

- Local assets only. Never add a runtime request to `cdn.sanity.io`, `www.tano.ai`, `_next/image`, Mux, or Google Fonts.
- Keep the source DOM class structure. CSS is already ported; add new CSS in your owned file rather than overriding unrelated rules.
- No page-level `min-height:100vh` on `.tano`; footer/announcement hidden on `.wire-contact` via existing global rule.
- Respect `prefers-reduced-motion`: no timers, no marquees, no auto-advance. Every auto-playing motion has a pause control where the source has one.
- Do not run `npm run check`, lint, typecheck, formatters, or git commands. The orchestrator verifies.
- Stay inside your owned files. Shared changes go through the orchestrator.
- Use the source's real values (8000 ms reels, 600 ms scene exit, 70 ms reveal stagger capped at 7, 46 ms word stagger, 26 px/s marquee, 4200 ms experiments, 6000 ms tabs/tracker, 600 ms ground tween, Lenis lerp .14).

## Workstreams and file ownership

| Agent | Owns | Job |
|---|---|---|
| `HeroCampaign` | `motion/use-hero-campaign.ts`, `home/hero-campaign.tsx`, `content/hero-campaigns.ts`, `styles/hero.css`, `scripts/capture-hero*.mjs`, `docs/coordination/HeroCampaign.md` | Four reels, real handle/avatar/video per reel, 8 s timer, 600 ms leaving, autoplay, pause offscreen, track buttons, no hover pause |
| `GroundTheme` | `motion/use-ground-tone.ts`, `motion/use-lenis.ts`, `lib/tano/motion.ts`, `styles/ground.css`, `docs/coordination/GroundTheme.md` | Lenis (lerp .14, reduced-motion off) + dark↔light ground tween at 45% viewport line, 600 ms, veil, `data-ground-tone`, fixed chrome |
| `ConvoExperiments` | `motion/use-conversations.ts`, `motion/use-experiments.ts`, `home/conversations.tsx`, `home/experiments.tsx`, `styles/conversations.css`, `styles/experiments.css`, `docs/coordination/ConvoExperiments.md` | Missing `.hp-convo-string` / `.hp-xl-string` / `.hp-xl-loop-dot`, 4.2 s rounds, 1 s jitter, chat/metric loops |
| `HomeMedia` | `motion/use-home-media.ts`, `home/media-sections.tsx`, `styles/home-media.css`, `docs/coordination/HomeMedia.md` | Missing logo marks, case deck `--cover`/`data-covered`, tracking copy buttons, creator band tabs 6 s, closing cards `data-seen` |
| `HomeInfo` | `motion/use-home-info.ts`, `home/info-sections.tsx`, `styles/home-info.css`, `docs/coordination/HomeInfo.md` | Steps/ProcessPlayer 11.6–12.2 s, two-sided tab logic, comparison note, objectives 5 s, FAQ search/tabs |
| `PageFamilies` | `motion/use-page-family.ts`, `pages/behaviours.tsx`, `styles/pages.css`, `docs/coordination/PageFamilies.md` | Ground tone on every route, hover/focus, guide FAQ, compare table, use-case flow, careers/news, route-specific misses |
| `CaseMedia` | `motion/use-case-media.ts`, `media/case-films.tsx`, `styles/media.css`, `docs/coordination/CaseMedia.md` | Replace Mux placeholders with real films, gates, posters, reel hover, case-study media |
| `Forms` | `motion/use-forms.ts`, `forms/forms.tsx`, `styles/forms.css`, `docs/coordination/Forms.md` | Talk-to-us + creator signup validation, submit state, drawer dialog, mobile menu focus trap |
| `VerifyHarness` | `scripts/compare-route.mjs`, `scripts/compare-motion.mjs`, `scripts/verify-all.mjs`, `docs/verify/**` | Build and run pixel/geometry/motion comparison; report only |

Placeholder CSS files are already imported in `src/app/globals.css`; replace their contents.

## Communication protocol

- Before starting, read this file and the evidence listed for your task.
- Post a one-screen status to `docs/coordination/<Agent>.md`: scope, files, current state, blockers, shared contracts you expose.
- Message a peer with `write agent://<Peer>` for cross-cutting contracts (e.g. HeroCampaign exposes the reel state; GroundTheme exposes `setGround`; Forms exposes drawer open). Prefix `[coord]`.
- Never message to announce an edit. Message only to unblock or to publish a contract.
- If a peer's file is missing a contract you need, state the required signature in `docs/coordination/<Agent>.md` and message them; do not edit their file.
- Orchestrator integrates and verifies; do not add imports to `runtime.tsx`, `layout.tsx`, or `globals.css` yourself.

## Acceptance

Each workstream reports: files changed, source evidence used, measured result (rect/opacity/frame), what still differs, and the exact selector/state for any remaining gap. No unverified "done".

## Architecture note (added after dispatch)

- Pages are **generated** from the frozen SSR captures by `scripts/generate-replicas.mjs`; do not hand-edit `replica/*.tsx`. The generator is the source of truth for markup and assets. Motion and interaction live in the `motion/*` modules and `styles/*` files owned by the workstreams.
- `SiteRuntime` calls every `use*` hook once. A hook must own its observers/timers and return cleanup from its own effect. No duplicate listeners across modules.
- The shared verification commands (orchestrator only) are `node scripts/compare-route.mjs`, `node scripts/compare-motion.mjs`, `node scripts/verify-all.mjs`, then `npm run check`.
