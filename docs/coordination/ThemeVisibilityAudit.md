# ThemeVisibilityAudit

Owner: `ThemeVisibilityAudit` (report-only; no app edits).

## Scope

Find every page where content is hidden, covered, or unreadable because of the
reveal layer, ground/theme tokens, the ground veil, or an overlay.

Owned files:

- `scripts/audit-visibility-theme.mjs`
- `docs/verify/theme/**`
- `docs/coordination/ThemeVisibilityAudit.md`

Dev server: `http://127.0.0.1:3100` only.

## Detector

For all 44 routes × 1568×829 / 390×844 × direct load / SPA navigation from `/`,
at scroll 0, 25%, 50%, 75% and max:

- expected vs actual pathname and hash;
- first `main h1/h2` own + ancestor-product opacity + split `.rv-word` opacity;
- `main .rv-in` count;
- `data-ground-tone`, computed `--ground-t` / `--ink-t`, expected tone from
  `[data-ground-dark]` at the 45% line;
- `.wire-ground-veil` computed opacity, `data-tone`, moving/swap attributes;
- `.wire-nav` visibility and rect;
- each visible `main`/`footer` `h1/h2/p`: text colour parsed through canvas
  (`oklab`/`color(srgb …)`), ancestor background composited to the first opaque
  layer, WCAG contrast, effective opacity, transparent fill, conservative
  opaque-overlay hit-test.

Flags: contrast < 2.0; text opacity < 0.05; text alpha < 0.05; reveal missing;
ground/tone disagreement; veil > 0.05 after settle; hash target absent or off
screen; pathname mismatch; pageerror.

Explicit coverage: `/guides#link-cards-gh-muse` (direct + SPA), `/compare` and
`/compare/*`, `/guides`, `/use-cases/*`, `/for-creators`, `/talk-to-us`,
`/privacy-policy`, and a two-viewport SPA push/back/forward/direct history run.
`/book` is not an implemented route (verified 404); `/talk-to-us` is the
book-like light page.

A `--negative-control` mode forces opacity 0 and low-contrast text to prove the
detector can go red.

## Status

- Script written; single-route and SPA/hash smoke tests in progress.
- Full 44-route × 2-viewport × 2-mode run pending.
- No app files touched; no coordination contracts exposed.

## Concrete finding (pre-full-run)

The reveal layer hides `li` elements but the runtime never reveals them:

- `src/styles/tano/reveal.css` base rule includes `li` in the hidden
  `opacity: 0` selector and in `.rv-in { opacity: 1 }`.
- `src/components/sites/tano/motion/use-reveal.ts` `revealSelector` omits
  `"li"`, both in the observer set and in the above-fold
  `requestAnimationFrame` set.
- Therefore every visible `main li` stays at computed opacity 0. Descendant
  `h1/h2/p` receive `.rv-in` individually, but the parent `li` opacity still
  multiplies the whole card/list row to 0.
- Confirmed on `/guides` (`li.wire-grid-item`, 17/17 hidden at 1568×829),
  `/compare` (7/7), `/for-creators` (56/56), `/privacy-policy` (54/61),
  `/webinars` (6/7). Child paragraph opacity 0 is a consequence, not a second
  cause.
- The same asymmetry exists for footer content: CSS hides
  `.rv-scope footer … li …`, while `use-reveal.ts` only queries
  `main :is(...)`. No footer `li` exists in the current shell, so this is a
  latent second gap.
- `.wire-button-row` is also in the CSS hidden set but absent from
  `revealSelector`; no current replica uses it.

`/talk-to-us` has no `main li`, so it is a clean page for the negative control.
