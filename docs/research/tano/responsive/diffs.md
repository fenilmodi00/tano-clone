# Responsive diffs / defects — tano.ai

**Coverage:** 15 routes × 10 widths = 150 captures, **150 succeeded, 0 failed**. Widths 360, 390, 600, 768, 900, 1024, 1200, 1440, 1568, 1680 (mobile height 844, otherwise 900).

**Bottom line:** There is **no page-level horizontal overflow** at any tested width: `document.scrollWidth === innerWidth` for all 150 captures. There is **one visual overflow defect** (the 360px header CTA is clipped), plus several **intentional horizontal panes** (comparison table, homepage stages, guide table, case-study reels). The fixed cookie panel covers real content on first visit, including the contact form submit area at 360/390.

---

## D1 — Mobile header CTA clipped at 360px  `[layout bug, severity: medium-low]`

At 360px the fixed header row is wider than its glass pill and wider than the viewport:

| Element | x | width | right | vs viewport (360) | vs bar right (344) |
|---|---:|---:|---:|---:|---:|
| `.wire-nav-bar` | 16 | 328 | **344** | 16 inset | — |
| `.wire-nav-mark` | 22 | 137.53 | 159.53 | inside | 6px inset |
| `.wire-nav-mobile-toggle` (“Open menu”) | 163.53 | 56 | 219.53 | inside | 4px gap |
| `.wire-nav-action` (“Get started”) | 223.53 | 138.97 | **362.5** | **2.5px beyond** | **18.5px beyond** |

The bar’s content box is 316px wide; logo + 4px gap + 56px toggle + 4px gap + 139px CTA requires 340.5px. The row overflows instead of shrinking. Because the header lives in `position: fixed .wire-chrome`, this does **not** create a page scrollbar (`scrollWidth` remains 360), but the CTA’s right rounded edge is visibly cut at the screen edge. See `screenshots/nav-360.png` and `screenshots/nav-360-cta-crop.png`.

At 390px it is inside the viewport and pill: CTA right **368**, bar right **374**. Supplementary probes: at 375 CTA right 362.5 vs bar right 359 (3.5px outside pill, still inside viewport); at 384/385 it fits. **Safe minimum for the current header is ~385px.** At 402 (the design canvas) it fits with 22px to spare.

No other tested width has this header overflow; the header is shared by every route, so the 360px geometry above applies site-wide.

**CSS-ready mitigation (for the clone):**
```css
@media (max-width: 384px) {
  /* one of: */
  .wire-nav-mark-word { display: none; }          /* frees ~80px */
  /* or */
  .wire-nav-action { padding-inline: 12px; }      /* shrinks CTA below 130px */
  /* or */
  .wire-nav { padding-inline: 8px; }
}
```

---

## D2 — First-visit consent panel covers the contact form and page content  `[overlay / UX, not layout width]`

The fixed `.wire-consent` is **328 × 156.4** at 360 and **358 × 156.4** at 390, positioned `x=16, y=671.6 → 828`; at 600 it is **568 × 139.6** (y744.4–884), and at 768+ **400 × 139.6** at `x=page-margin` (y744.4–884). It never participates in document flow (no scroll-width effect).

Consequences:
- At 360/390, `/talk-to-us` is a viewport-locked screen; the form ends at **y=762.7**, so the consent panel (starting y=671.6) **covers the bottom fields and the 48px submit button** (`screenshots/contact-360.png`). The page cannot scroll because `bodyScrollHeight = 844`; the user must dismiss consent first.
- On `/` and case-study pages, the panel covers the lower hero/cards in screenshots and first-visit visual QA.
- On `/privacy-policy` at 1440 the panel covers the lower-left TOC/legal text until dismissed.

This is expected consent behavior, not an overflow defect, but a pixel clone must reproduce the panel (or dismiss it during screenshot comparison); otherwise every lower-viewport comparison will differ.

---

## D3 — Comparison table requires horizontal pan below 768px  `[intentional overflow; usability note]`

Affected: `/` (section 7) and `/compare/grin-vs-tano` (section 3), using `.hp-table` inside `.hp-comparison-scroll`.

| Width | Viewport | Table width | Wrapper scrollWidth | Table fits? |
|---:|---:|---:|---:|---|
| 360 | 360 | **800** | 832 | no — 2.3 screens |
| 390 | 390 | **800** | 832 | no — 2.1 screens |
| 600 | 600 | **800** | 832 | no — 1.4 screens |
| 768 | 768 | 704 | 704 | yes |
| 900 | 900 | 836 | 836 | yes |
| 1024 | 1024 | 896 | 896 | yes |
| 1440 | 1440 | 1312 | 1312 | yes |

At ≤767 the table has `min-width: 800px`; at 768–1023 it drops to `min-width: 640px` and fits. The wrapper is `overflow-x:auto`, hides its scrollbar in WebKit, and expands edge-to-edge with negative page margin. It has **no sticky first column**, so after swiping right the “Attribute / Core model / Best at / Brand’s role / AI” labels scroll out of view. For a clone, keep the horizontal wrapper; consider a sticky first column or a visible scroll affordance.

This is intentional — the wrapper keeps `document.scrollWidth` at the viewport width. `screenshots/compare-table-360.png` shows the partial table.

---

## D4 — Homepage scrollytelling stages are panned, not scaled  `[intentional overflow; verify clone]`

| Element | 360 / 390 | 600 | 768 / 900 | 1024 / 1200 | 1280+ |
|---|---|---|---|---|---|
| `.hp-convo-frame` stage width | 800 | 800 | 1216 | fits 896/1072 | fits |
| frame scrollWidth | 928 | 928 | 1376 | 896/1072 | fits |
| `.hp-xl-frame` stage width | 960 | 960 | 1180 | 1180 | fits (1152 at 1280) |
| frame scrollWidth | 992 | 992 | 1244 | 1308 | fits |
| `.hp-stat-row` scrollWidth | 595 / 883 | 1487 | fits (704/836) | fits | fits |

All three have `overflow-x:auto` (or a draggable track); none increases document scroll width. The pages do include swipe cues at the relevant ranges (`hp-swipe-cue` displayed for conversations/comparison ≤1023, XL ≤1279, stats ≤767), but scrollbars are hidden. This is by design, but at 360 the conversations stage shows only ~45% of its 800px composition; a clone that simply scales it instead of reproducing the 800/1216/1180 fixed widths will look different at every scroll stop.

---

## D5 — Guide comparison table below 768px  `[intentional overflow]`

`/guides/creator-ads` prose table: **520px** at 360/390 inside **328/358** content; **568** at 600 (fits); **640** at 768+. Wrapper `.wire-table-scroll` is `overflow-x:auto`. No document overflow. Same class of issue as D3 but shorter; no sticky column.

---

## D6 — Case-study reels / figure marquees clip at every width  `[intentional]`

- `wire-figs` is a `width:max-content` marquee with a mask; cards **300 × 320** (desktop) or **260 × 280** (≤767), gap 16. At 360 the track is 4620px wide (scrollWidth of `.wire-cases-marks-run`) and clipped; document width stays 360.
- `wire-reel` cards are `clamp(240px, 24vw, 340px)` (64vw ≤767), gap 24 (16 mobile); the track is transformed/draggable and clipped. Observed cards 230.4 (360), 249.6 (390), 240 (768/900), 245.75 (1024), 288 (1200), 340 (1440).
- This is expected for these components; do not “fix” the document overflow by widening the page. Do verify drag/snap affordances because there is no scrollbar.

---

## D7 — Legal layout jumps from 1 to 3 columns at exactly 1440  `[intentional; large layout change]`

`/privacy-policy`:

| Width | `.wire-legal-layout` | Text measure |
|---:|---|---:|
| 360–1200 | 1 column (328/358/568/704/836/896/1072) | 328/358/568, then 640 centered |
| 1440+ | **256px / 736px / 256px**, gap 32, max 1312 | 640 inside the 736 track |

The transition is at 1440, not 1439; at 1439 the file is still a single 640px column. Body height changes 8657 (768/900) → 9502 (1024) → 9374 (1440). No overflow, but a clone that switches at 1024 will be visibly wrong at 1200/1440. This is the only 3-column legal layout; do not generalize it to other “legal” pages.

---

## D8 — 1680px home H1 is wider than its 832px copy box  `[no overflow; note]`

At 1680 the homepage H1 is **874.2px** wide (`x=402.9, right=1277.1`) while `.hp-hero-copy` has `max-width:832px`. The H1 is a flex item with min-content width, so it exceeds the copy box but remains far inside the viewport (page right edge 1680, content max 1312 centered 184–1496). No clipping/scroll. If the clone enforces a hard 832px H1 max-width, line breaks at 1680 may differ from the live site.

---

## D9 — 40px “More links” target at 900/1024  `[accessibility, not layout]`

At 900 and 1024 the compact nav shows a **40 × 40** “More links” button; at ≤899 the hamburger is **56 × 56**. All links remain 55.6px tall, CTA 55.6. The 40px control is below the 44px recommended touch target. If extracting behavior, preserve the 40px visual but consider a 44px hit area.

---

## D10 — No other overflow or clipping found

- All 150 records: `scrollWidth == innerWidth`; every `scroll.overflowX` is false.
- Elements with `right > innerWidth` and not clipped by an ancestor: only the 360px header row (`wire-nav-end`, CTA, CTA slot) — D1. The several-thousand-pixel-wide elements (marquee tracks, reels) are all inside `overflow:hidden/auto` ancestors.
- No section text was clipped by its container at tested widths; H1/H2 rects stay inside their sections. No `main > section` had negative left or right beyond viewport.
- The only non-`section` main blocks are `/`’s case-deck wrapper (`main > div[data-ground=light]`, 2370px at 390 / 2256px at 1440) and `/privacy-policy`’s `.wire-legal-body`; both were measured separately. `/talk-to-us` has **zero** `main > section` elements — the form/art are direct main children.
- Failures: **none**. HTTP 200 for every route/width.

---

## Cross-check table — body height (px) at tested widths

| Route | 360 | 390 | 600 | 768 | 900 | 1024 | 1200 | 1440 | 1568 | 1680 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 15925 | 15690 | 15553 | 16681 | 17188 | 14302 | 14250 | 14433 | 14433 | 14641 |
| `/use-cases/drive-revenue` | 12282 | 11928 | 11025 | 11434 | 11581 | 10011 | 9127 | 9099 | 9099 | 9298 |
| `/case-studies` | 5752 | 5692 | 6231 | 4364 | 4409 | 4579 | 4644 | 4819 | 4819 | 4898 |
| `/case-studies/papier` | 12074 | 11792 | 11556 | 11392 | 11413 | 11226 | 11238 | 11243 | 11243 | 11484 |
| `/guides` | 6836 | 6540 | 5875 | 5235 | 5002 | 5217 | 5094 | 4920 | 4920 | 5051 |
| `/guides/creator-ads` | 12035 | 11457 | 9476 | 9541 | 9669 | 9855 | 9783 | 9813 | 9813 | 9989 |
| `/playbooks` | 3747 | 3594 | 3377 | 2814 | 2678 | 2585 | 2453 | 2355 | 2355 | 2371 |
| `/compare` | 4236 | 4117 | 3747 | 3238 | 3116 | 3269 | 3129 | 3063 | 3063 | 3134 |
| `/compare/grin-vs-tano` | 13771 | 13218 | 11118 | 11980 | 11457 | 11365 | 10766 | 10381 | 10381 | 10525 |
| `/careers` | 4505 | 4358 | 4153 | 3989 | 4096 | 4230 | 4290 | 4257 | 4257 | 4303 |
| `/careers/product-engineer` | 6665 | 6415 | 5295 | 4771 | 4704 | 5111 | 5053 | 5021 | 5021 | 5072 |
| `/news` | 2984 | 2959 | 2988 | 2891 | 2965 | 2644 | 2586 | 2554 | 2554 | 2585 |
| `/for-creators` | 8475 | 8269 | 7511 | 7335 | 7422 | 6692 | 6438 | 6368 | 6368 | 6499 |
| `/talk-to-us` | 844 | 844 | 900 | 900 | 900 | 900 | 900 | 900 | 900 | 900 |
| `/privacy-policy` | 11843 | 11207 | 9336 | 8657 | 8657 | 9502 | 9444 | 9374 | 9374 | 9457 |

The drops at 1024 (e.g. `/` 17188 → 14302, `/for-creators` 7422 → 6692, `/use-cases/drive-revenue` 11581 → 10011) are the intended multi-column collapses; they are useful regression markers for the clone.

---

## Evidence

- `metrics.json` — raw measurements for every route/width.
- `screenshots/nav-360.png` — full 360 header with clipped CTA.
- `screenshots/nav-360-cta-crop.png` — 180px right-edge crop showing the cut corner.
- `screenshots/nav-390.png` — 390 header, CTA fully inside pill.
- `screenshots/compare-table-360.png` — 800px comparison table inside 360px viewport.
- `screenshots/contact-360.png` — viewport-locked contact form with consent panel over submit.
- `screenshots/privacy-1440.png` — 3-column legal layout at 1440.
