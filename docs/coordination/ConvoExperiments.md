# ConvoExperiments status

Scope: home conversation figure strings and the `.hp-xl` experiment loop.
Owner files only: `home/conversations.tsx`, `home/experiments.tsx`,
`motion/use-conversations.ts`, `motion/use-experiments.ts`,
`styles/conversations.css`, `styles/experiments.css`, this note.

## What ships

- **`.hp-convo`**: 14 measured `.hp-convo-string` groups (7 chip → agent icon,
  7 agent icon → fact-mark bubble), exact source pointer highlight contract
  (`data-active` on `.hp-convo`, `data-lit` on chips/marks/groups), resize and
  font-ready re-measure, offscreen pause of `.hp-convo-agent` via
  `data-inview` (200 px margin, same as source `OffscreenPause`).
- **`.hp-xl`**: 10 `.hp-xl-string` paths (2×3 source routes + 3 result routes
  + 1 loop) and 12 `.hp-xl-loop-dot` SMIL travellers (9 route + 3 loop).
  Rounds advance every **4200 ms**, displayed rates/CAC re-jitter every
  **1000 ms**, round + tick reset when the play zone leaves, SMIL pauses
  offscreen, reduced motion renders round 0 with no dots.
- Typed source data lives in `home/conversations.tsx` (`CONVERSATION_FIGURE`,
  chip/fact order, route geometry) and `home/experiments.tsx` (six rounds,
  personas, headers, jitter/rate/CAC math, CAC sparkline, wire geometry).
- Hooks key their effect on `usePathname()` so client-side route re-entry
  re-mounts the behaviour; cleanup removes every injected node and timer.

## Evidence (1568 × 900, local replica vs live source)

| Check | Local | Source |
|---|---:|---:|
| `.hp-convo-string` | 14 | 14 |
| `.hp-xl-string` | 10 | 10 |
| `.hp-xl-loop-dot` | 12 | 12 |
| `.hp-convo-strings` outerHTML | 2908 chars | 2908 chars, byte-identical |
| `.hp-xl-wires` outerHTML (round 0) | 4516 chars | 4516 chars, byte-identical |
| `.hp-xl-wires` outerHTML (round 1) | equal | equal (persona route re-measured to `M 317 …`) |
| `.hp-convo` textContent | 562 chars | 562 chars, equal |
| `.hp-xl` textContent | 598 chars | 598 chars, equal |

The live SVG captures are `/tmp/source-convo-svg.txt` and
`/tmp/source-xl-svg.txt` from `https://www.tano.ai/` at 1568×900 (captured
during this task); the replica SVG was re-captured after each change.
Gradient ids are the same except the source's React `useId` suffix, which was
normalized only for the diff. Round-1 wire geometry was also captured from
both pages while both showed “Trying this round: New parents” and compared
byte-identical.

Measured loop cadence at scrollY 4000 (10 samples, 1 s apart): base
4.3/3.6/2.4 % and £32.10 at tick 0, then 4.4/3.5/2.4 % / £32.21, 4.4/3.5/2.3 %
/ £32.29, 4.4/3.7/2.5 % / £32.08, 4.2/3.7/2.3 % / £31.77, then round 1 at
4.9/3.9/3.1 % / £30.40. A 27 s run advanced personas Home → New parents →
Gift givers → Plant lovers → Dinner hosts → Home → Home with CAC bases
32.10 → 30.40 → 28.90 → 27.60 → 26.20 → 24.80 and then jitter again, i.e.
4.2 s rounds without drift.

Offscreen / reduced motion: `.hp-xl` wires report `animationsPaused() === true`
and rates stay frozen; leaving resets the round to 0 and re-entry resumes at
round 0. `prefers-reduced-motion` renders 10 strings / 0 dots, static rates,
`hp-convo-glow` animation `none`, camp turn/metric animations `none`; toggling
the media query live stops/restores timers and removes/re-adds the 12 dots.
No page errors or console errors were observed in any run.

HMR / route re-entry: two client-side `/ → /case-studies → /` round trips plus
two resize cycles 1568 → 1280 → 1568 kept exactly 14/10/12 nodes and one
`.hp-xl-wires`; a Fast Refresh edit to the hook (`[Fast Refresh] rebuilding`
→ `done`) kept 14/10/12 with 23 SVG children. Cleanup disconnects
`IntersectionObserver`s, `ResizeObserver`, media-query listener, scroll/resize
listeners, clears both experiment timers, and removes all injected paths/dots.

## Cadence note (7.2 s / 9 s / 6.4 s)

The ticket's chat-turn/metric/bar cadences are the `.hp-camp` card loops, not
`.hp-convo`: source CSS sets `--camp-chat-loop: 7.2s`,
`--camp-metric-loop: 9s`, `--camp-field-loop: 6.4s`. The source conversation
thread is static after its one-shot reveal (handbook §5, home-frame evidence:
all six turns share one fade, no per-turn timer). This workstream therefore
leaves the camp cadence to `source.css` and owns its pause contract, publishing
`data-inview` on `.hp-camp` with the source's 200 px observer alongside the
agent glow. Verified: camp turn opacities change on the 7.2 s loop, metric
opacities cross-fade on 9 s, bar fill transforms on 6.4 s, and all report
`animation-play-state: paused` when `.hp-camp[data-inview=false]`.

## Shared contracts

None. The experiment section has no state contract with `HomeInfo`; it is a
self-contained `.hp-xl` timer. No peer messages required.

## Remaining differences

None found in scope. No extra CSS was needed: `.hp-convo-strings` and
`.hp-xl-wires` already receive geometry from measured SVG attributes, and
`source.css` owns stroke/fill/pointer-events/transitions. The two owned CSS
files only document that split.
