# RouteLifecycle — page runtime remounts per route

Status: complete. Files changed: `src/components/sites/tano/runtime.tsx`,
`scripts/check-client-nav.mjs`, this report (+ `RouteLifecycle/` evidence).
No files outside this list were edited.

## Root cause

`SiteRuntime` called every hook once with `useEffect([])`. `useClientNav` pushes
through the App Router, which swaps `<main>` without unmounting the layout, so
`useReveal` had already run against the home DOM. The new page's headings never
got `.rv-in`, and `reveal.css` keeps every reveal target at `opacity: 0` until
that class arrives. Direct loads worked because the runtime mounted after the
subpage DOM existed.

## Change

`runtime.tsx` now has two lifetimes:

- **Global** — `SiteRuntime` calls `useLenisScroll()`, `useGroundTone()` and
  `useClientNav()` and sets `data-nav-ready` / `data-ground-ready` in a one-time
  effect. These stay mounted across navigation, so one Lenis instance, one
  `.wire-ground-veil` and one `window.__tanoGround` API exist for the session;
  `GroundTheme`'s route dependency still re-measures bands without recreating
  the veil.
- **Page-scoped** — a child `<PageRuntime key={pathname} />` calls
  `useHeroCampaign`, `useConversations`, `useExperiments`, `useHomeMedia`,
  `useHomeInfo`, `usePageFamily`, `useCaseMedia`, `useForms`, `useCounters`,
  `useReveal`, plus the reveal-target/`data-shown`, band-inview and
  video-autoplay effect (moved out of the global mount). Keying by pathname
  unmounts the previous page's hooks and mounts new ones after React commits
  the new route DOM, so `useReveal` observes the new elements. Every page
  cleanup disconnects its IntersectionObservers and pauses its videos; the
  per-hook effects return their own cleanups, so repeat navigation cannot stack
  observers.

The reveal observers are created inside the keyed mount (after commit), and the
above-fold `requestAnimationFrame` path in `useReveal` runs in the same mount.

## Check (`scripts/check-client-nav.mjs`)

Real UI clicks, no test-only escape hatches:

1. direct load `/` — asserts heading opacity > 0, first `.rv-word` opacity > 0
   where split, `.rv-in` > 0, main text > 20, one veil, ground API/tone,
   `html.lenis`, readiness flags;
2. hover the **Use Cases** menu, click **Drive Revenue**;
3. scroll to footer, click **All guides**;
4. browser **Back** to Drive Revenue;
5. direct load `/guides` (fresh document);
6. repeat SPA navigation — header logo back to `/`, then Use Cases → Drive
   Revenue — to prove remounts do not stack observers or a second veil.

Each stage re-asserts the same visibility/global-runtime invariants, plus
`no pageerror/console error` for the whole flow. Prints `ok  `/`FAIL` per check,
then `PASS` or `FAIL` with exit code 1.

Base URL: `BASE_URL` env or first argument, default
`http://127.0.0.1:3000` — override for another port:
`BASE_URL=http://127.0.0.1:3100 node scripts/check-client-nav.mjs`.

## Measured result

Before the split: every SPA stage printed `h1.op=0`, `rv=0` (direct loads
passed). After:

| stage | path | h1 opacity | first word | `.rv-in` | veil | ground API | lenis | errors |
|---|---|---|---|---|---|---|---|---|
| home (direct) | `/` | 1 | n/a (not split) | 5 | 1 | yes | yes | 0 |
| Use Cases → Drive Revenue (SPA) | `/use-cases/drive-revenue` | 1 | 1 | 6 | 1 | yes | yes | 0 |
| footer Guides (SPA) | `/guides` | 1 | 1 | 9 | 1 | yes | yes | 0 |
| Browser Back | `/use-cases/drive-revenue` | 1 | 1 | 43 (scroll restored to y=8180) | 1 | yes | yes | 0 |
| direct `/guides` | `/guides` | 1 | 1 | 9 | 1 | yes | yes | 0 |
| repeat SPA ×3 → Drive Revenue | `/use-cases/drive-revenue` | 1 | 1 | 6 | 1 | yes | yes | 0 |

Final `node scripts/check-client-nav.mjs` (port 3000): **PASS**, 9.1 s.

Screenshots (1568×829) and raw states: `RouteLifecycle/states.json`,
`RouteLifecycle/01-home.png`, `02-use-cases-drive-revenue-spa.png`,
`03-guides-spa.png`, `04-drive-revenue-back.png`, `05-guides-direct.png`,
`06-repeat-nav.png`.

## Contract for other workstreams

- Any new page-level hook goes in `PageRuntime`, not `SiteRuntime`; it must
  return a cleanup and must tolerate being mounted once per route.
- Global singletons (Lenis, ground veil/API, client-nav listener) stay in
  `SiteRuntime`; do not add another document-level listener there without
  cleanup.
- Existing hooks' own dependency arrays are unchanged; keying only adds the
  route lifecycle around them. `useForms`'s render-time mount is unchanged and
  still keyed by its `WeakMap`, so new route DOM binds once.
- No CSS or shell changes were needed; reveal CSS and the inline fail-safe in
  `layout.tsx` are untouched.

## Remaining gaps

None observed for this bug. Direct loads, SPA pushes and Back all reveal the
new page; the only behavioural change is that page hooks now re-initialize on
route change, which is the intended source-equivalent lifecycle.
