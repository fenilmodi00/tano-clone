# HomeInfo — steps, FAQ, comparison, tracker

Status: implemented, measured on the dev server at http://127.0.0.1:3000.
Owner files: `src/components/sites/tano/motion/use-home-info.ts`,
`src/components/sites/tano/home/info-sections.tsx`,
`src/styles/tano/home-info.css`, this note.

## Source truth used

- Live `https://www.tano.ai/` rendered in Chromium (1568x900 and 390x844), plus
  the frozen captures in `/home/boxd/tano`.
- Four step scenes serialized from the live `.hp-pp-stage`: `inputs`, `source`,
  `outreach`, `optimise`. All image URLs were rewritten to local
  `/sites/tano/...` assets before gzip+base64 storage in `info-sections.tsx`.
- FAQ: live page renders 18 questions across the three tabs; the SSR capture
  contains only the first six. All 18 rows were serialized.
- Home uses the pitch-deck ProcessPlayer (`.hp-steps` + `.hp-pp`), not the
  `.hp-flow` player from the use-case pages. The live bundle sets
  `HIW_BEAT_MS = 1200` and `HIW_TAIL_MS = 3200`, so the observed durations are
  `7.5*1200+3200 = 12200 ms` and `7*1200+3200 = 11600 ms`. The 2800 ms beat in
  `inventory.md` belongs to `.hp-flow`; it is not the home player. Scene
  `--beat` is therefore 1200 ms, exactly as captured live.
- `Sort by` state names verified on the clone: `data-state` on step buttons,
  `data-live` on segments/slides, `data-direction` and `data-leaving` on frames,
  `data-paused` on `.hp-steps-seg-fill`, `data-running`/`data-reduced` on
  `.hp-pp-scene`.

## Steps / ProcessPlayer

Implemented in `setupSteps`:

- Timer durations `[12200, 11600, 11600, 11600]`; `remaining` survives pause and
  page visibility changes; manual selection resets the next beat to the full
  duration; auto advance does not.
- Arrows and step buttons set direction (`next - current`, `+1/-1` for arrows),
  update copy `data-live`/`aria-hidden`, `data-state` (`done|live|idle`),
  `aria-current="step"`, stage `--hp-steps-active`, and `aria-live` (polite
  after a manual selection, off after auto).
- Incoming frame is appended; outgoing frame gets `data-leaving` and is removed
  after 420 ms. Both the frame animation (CSS) and cleanup timer are cleaned up
  on unmount.
- Play/pause toggles both control clusters and the fill `data-paused`; glyph and
  `aria-label` switch between Pause and Play.
- Play zone uses the source's `0px 0px -40% 0px` observer; offscreen the timer
  and CSS animation pause. Re-entry remounts the scene at step 0, take++.
- Reduced motion: no timer, `data-reduced` set, scene animations removed by the
  source CSS, manual navigation still snaps. Verified no advance after 6 s.

Measured (1568x900, real clone DOM, `--hp-steps-active` mutation timestamps):

| Beat | Measured | Scene |
|---|---:|---|
| 1 -> 2 | 12 244 ms | source |
| 2 -> 3 | 11 588 ms | outreach |
| 3 -> 4 | 11 583 ms | optimise |
| 4 -> 1 | 11 628 ms | inputs |

After each advance, frame count was back to 1 by +430 ms (420 ms cleanup).
Pause test: pause at +3 s, wait 2 s, resume -> advanced after 9 209 ms
(12.2 s - 3 s), with the active step unchanged while paused.

All four scenes render their content and local images (`naturalWidth > 0`):
- inputs: Objective / Products to gift / Revenue target / Guardrails / Handed to Tano
- source: Creators scored / 12 480 / compatibility rows / Shortlisted to gift
- outreach: creator chat, matched products, Agent actions
- optimise: Tests running against your objective, three test tables, What's working

## FAQ

- Injected the missing two categories (12 rows) into the home FAQ only; other
  routes keep their SSR rows.
- Category tabs filter `question + answer`, use roving tabindex, and
  ArrowLeft/Right/Up/Down, Home and End select and move focus (source
  `useTabList` semantics). Clicking a tab clears search.
- Search lowercases and normalises `’`, splits on whitespace and ANDs every
  token across question + answer. Measured: `shopify` -> 1, `creator` -> 15,
  `creator shopify` -> 0. `data-searching` on the tablist, `N questions match`
  live-region text, empty state with `/talk-to-us`, and clear control are
  maintained. Selecting a tab restores the 6-row category.
- Existing global accordion remains in charge of open/close; injected rows use
  the same ids and `aria-controls`/`inert` state.

## Comparison notes

The global handler already toggles `aria-expanded` and note `data-open`.
`setupComparison` adds the missing source semantics: hover/focus dismissal,
Escape (`data-dismissed`), outside pointerdown close, blur reset, and click
reset of `data-dismissed`. Measured open: `aria-expanded=true`,
`data-open=true`, opacity 1; Escape: both false and the note dismissed.

## 5 s card advance

The home's only 5 s card advance is `.hp-track` ("Everything tracked in one
place"). `.hp-objectives-row` is a static two-up grid in the source (reveal
only, no timer), so no fake auto-advance was added there.

Implemented in `setupTracks` for every `.hp-track`: 5000 ms while in view,
manual arrows, play/pause, remaining-time preservation, offscreen pause, reduced
motion static. Measured on home: live card changed at 4.45 s and 9.45 s (two
consecutive 5 s beats); pause held the active card for 1.5 s.

## Brand / creator two-sided tabs

These are owned by `HomeMedia` in `home/media-sections.tsx` and already measured
there (6 s cadence, `data-active`/`aria-selected`/roving tabindex, 260 ms fade).
HomeInfo deliberately does not attach a second timer: doing so would double
advance and fight focus. After removing the duplicate, ArrowLeft on the second
brand tab returned focus and active state to tab 0 correctly. Our captured
second-card payloads remain available as `BRAND_CARDS_GZ` in
`info-sections.tsx` for the owner who wants to fill HomeMedia's noted
stat/speaker/action gap.

## Targeted CSS

`styles/home-info.css` only adds: hidden FAQ rows/empty/clear (`display:none`,
needed because the clear button is `display:grid`), non-interactive
`data-fading` brand card, and non-interactive leaving frame. No source rules
were overridden.

## Remaining differences / gaps

- Home scene `--beat` is 1200 ms, not the 2800 ms `.hp-flow` value; changing it
  would make scene beats exceed the 11.6 s step.
- `.hp-objective-card` has no carousel in the source; the 5 s advance is
  `.hp-track`.
- HomeMedia still owns the second-brand stat/speaker/action swap; our hook and
  CSS do not touch `.hp-brand-bar`.
- Scenes are serialized DOM from the live page, so they are static content until
  the client expansion runs; SSR still shows the first inputs scene only, as in
  the source.
