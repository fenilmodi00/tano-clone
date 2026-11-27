# Responsive rules — tano.ai

Measured against the live site (`https://www.tano.ai`) on 2026-11-27 with Playwright 1.65.1 / Chromium at **360, 390, 600, 768, 900, 1024, 1200, 1440, 1568, 1680 px** (height 900; 844 for widths ≤ 430), 15 routes = **150 captures, 0 failures**. Raw values are in `metrics.json`; every value below is a computed/observed value, not a guess.

The site is one design system (`.tano` tokens + `.wire` components) with page-specific sections. Numbers are CSS-ready; ranges are the actual `@media` ranges that produce them.

---

## 1. Breakpoint map

| Range (px) | What changes |
|---|---|
| **0–767** | Mobile: 16px page margin, mobile type scale, 1-column layouts, phone fields stack, 360px nav issue (§4). |
| **768–899** | 32px page margin, tablet type scale, 2-column grids, contact phone row becomes 2 columns. Nav is still hamburger-only. |
| **900–1023** | Nav switches to horizontal link mode. Type/layout are still tablet values (64/52 display). |
| **1024–1199** | Desktop type (80/68), 64px page margin, desktop section padding, 3/4-column grids, FAQ 2-col, use-case steps 3-col. Nav uses “More links”. |
| **1200–1279** | Full nav appears (measured 1200). Use-case steps become 4-col. Homepage XL stage still horizontally pannable. |
| **1280–1439** | Homepage XL stage finally fits (`1279` is the last pannable width). Closing section hides its 4th card ≤ 1279. |
| **1440–1599** | Page reaches max width. Nav top padding 80, legal layout becomes 3-column, case banner ratio becomes 4:13. Display type is still 80/68. |
| **≥ 1600** | Base type returns: display 96/80/64/48, heading 40/32, band spacing 84/60/40/32. |

`--page-breakpoint` is a **design-canvas token**, not a media boundary: 402 (<768), 768 (768–1023), 1024 (1024–1439), 1440 (≥1440). `--page-width` stays **1312px at every width**; the current content width is `min(1312px, 100vw − 2 × --page-margin)`.

---

## 2. Page frame / tokens

### 2.1 Effective tokens by width

| Viewport | `--page-margin` | content width | `--page-navpadding` | page opening* | `--container-full` | `--page-breakpoint` |
|---:|---:|---:|---:|---:|---:|---:|
| 360 | 16 | 328 | 70 | 106 | 428 | 402 |
| 390 | 16 | 358 | 70 | 106 | 428 | 402 |
| 600 | 16 | 568 | 70 | 106 | 428 | 402 |
| 768 | 32 | 704 | 70 | 106 | 428 | 768 |
| 900 | 32 | 836 | 70 | 106 | 428 | 768 |
| 1024 | 64 | 896 | 74 | 122 | 1024 | 1024 |
| 1200 | 64 | 1072 | 74 | 122 | 1024 | 1024 |
| 1440 | 64 | 1312 | 80 | 128 | 1280 | 1440 |
| 1568 | 64 | 1312 | 80 | 128 | 1280 | 1440 |
| 1680 | 64 | 1312 | 80 | 128 | 1280 | 1440 |

\* page opening = `--page-navpadding + --section-padding-sm`; the fixed chrome adds 4px above the document, and inner hero copy adds a 24px `--hero-shift` margin-top.

### 2.2 Tokens (effective values)

```css
.tano, .wire {
  --page-width: 1312px;        /* max width; constant at all breakpoints */
  --page-margin: 64px;
  --page-navpadding: 80px;
  --container-full: 1280px;
  --page-breakpoint: 1440px;   /* canvas label only */

  --size-display-lg: 96px;
  --size-display-md: 80px;
  --size-display-sm: 64px;
  --size-display-xs: 48px;
  --size-heading-lg: 40px;
  --size-heading-md: 32px;
  --size-heading-sm: 24px;
  --size-heading-xs: 16px;
  --size-body-lg: 20px;
  --size-body-md: 16px;
  --size-body-sm: 14px;
  --size-body-xs: 12px;

  --section-padding-xl: 128px;
  --section-padding-lg: 96px;
  --section-padding-md: 64px;
  --section-padding-sm: 48px;
  --section-padding-xs: 32px;

  --band-space-xl: 84px;
  --band-space-lg: 60px;
  --band-space-md: 40px;
  --band-space-sm: 32px;
}

@media (max-width: 1599px) {
  .tano, .wire {
    --size-display-lg: 80px; --size-display-md: 68px;
    --size-display-sm: 56px; --size-display-xs: 44px;
    --size-heading-lg: 36px; --size-heading-md: 30px;
    --size-heading-sm: 22px;
    --band-space-xl: 80px; --band-space-lg: 56px;
    --band-space-md: 36px; --band-space-sm: 28px;
  }
}

@media (max-width: 1439px) {
  .tano, .wire { --page-navpadding: 74px; --container-full: 1024px; }
}

@media (max-width: 1023px) {
  .tano, .wire {
    --page-margin: 32px;
    --page-navpadding: 70px;
    --container-full: 428px;
    --page-breakpoint: 768px;
    --size-display-lg: 64px; --size-display-md: 52px;
    --size-display-sm: 44px; --size-display-xs: 38px;
    --size-heading-lg: 32px; --size-heading-md: 26px;
    --size-heading-sm: 20px;
    --size-body-lg: 18px;
    --section-padding-xl: 96px; --section-padding-lg: 72px;
    --section-padding-md: 48px; --section-padding-sm: 36px;
    --section-padding-xs: 24px;
    --band-space-xl: 64px; --band-space-lg: 48px;
    --band-space-md: 32px; --band-space-sm: 24px;
  }
}

@media (max-width: 767px) {
  .tano, .wire {
    --page-margin: 16px;
    --page-breakpoint: 402px;
    --size-display-lg: 60px; --size-display-md: 50px;
    --size-heading-lg: 28px; --size-heading-md: 24px;
    --size-body-lg: 17px;
    --band-space-xl: 56px; --band-space-lg: 40px;
    --band-space-md: 24px; --band-space-sm: 20px;
  }
}
```

### 2.3 Containers

```css
.hp-container, .wire-container {
  width: 100%;
  max-width: var(--page-width);
  margin-inline: auto;
}
.hp-band {
  width: 100%;
  padding-inline: var(--page-margin);
  padding-block: var(--band-space-xl); /* data-padding=md/lg/sm switches token */
}
main > .hp-band:first-child { padding-top: var(--page-opening); }
```

Observed content widths: 328 (360), 358 (390), 568 (600), 704 (768), 836 (900), 896 (1024), 1072 (1200), 1312 (1440+). The max 1312 is reached exactly at 1440 and stays fixed.

---

## 3. Type scale

All display/heading classes are `font-weight: 500`; display line-height is `0.95`; heading line-height is `1.1`; both track `-0.04em` (values below are the resolved px).

| Class | 0–767 | 768–1023 | 1024–1599 | ≥1600 |
|---|---|---|---|---|
| `tano-display-lg` | 60 / 57 / −2.4 | 64 / 60.8 / −2.56 | 80 / 76 / −3.2 | 96 / 91.2 / −3.84 |
| `tano-display-md` | 50 / 47.5 / −2 | 52 / 49.4 / −2.08 | 68 / 64.6 / −2.72 | 80 / 76 / −3.2 |
| `tano-display-sm` | 44 / 41.8 / −1.76 | 44 / 41.8 / −1.76 | 56 / 53.2 / −2.24 | 64 / 60.8 / −2.56 |
| `tano-display-xs` | 38 / 36.1 / −1.52 | 38 / 36.1 / −1.52 | 44 / 41.8 / −1.76 | 48 / 45.6 / −1.92 |
| `tano-heading-lg` | 28 / 30.8 / −1.12 | 32 / 35.2 / −1.28 | 36 / 39.6 / −1.44 | 40 / 44 / −1.6 |
| `tano-heading-md` | 24 / 26.4 / −0.96 | 26 / 28.6 / −1.04 | 30 / 33 / −1.2 | 32 / 35.2 / −1.28 |
| `tano-heading-sm` | 20 / 22 / −0.8 | 20 / 22 / −0.8 | 22 / 24.2 / −0.88 | 24 / 26.4 / −0.96 |
| body-lg | 17 | 18 | 20 | 20 |
| body-md / body-sm | 16 / 14 | 16 / 14 | 16 / 14 | 16 / 14 |

Observed page titles:

| Page | H1 class | 360/390/600 | 768/900 | 1024–1599 | 1680 |
|---|---|---|---|---|---|
| `/` | `hp-hero-title tano-display-lg` | 60 | 64 | 80 | 96 |
| every other page | `hp-title tano-display-md` (or `tano-display-md`) | 50 | 52 | 68 | 80 |
| `/talk-to-us` form title | `tano-heading-md` | 20 (20/22) | 26 | 30 | 30 |

Section H2s use `tano-display-xs` (38 → 44 → 48); closing/“other case studies” H2s use `tano-display-sm` (44 → 56 → 64). Article H2s in `hp-prose` use `tano-heading-md` (24 → 26 → 30 → 32). Card titles use `heading-sm` / `heading-md` per component.

---

## 4. Header / navigation

Structure: `.wire-chrome` is `position: fixed; top: 4px; z-index: 20`, hiding on scroll-down (`data-hidden=true`). Inside it, `.wire-nav` is padded `12px 16/32/64px 0`, the glass bar is 68px tall (67.6px at ≥900 due to font metrics), radius 26px, padding 6px. Header total height: 88px (87.6 at ≥900). Logo mark is always **137.5 × 56** (glyph 25.6 × 24); CTA is **139 × 55.6**; nav links ~117–118 × 55.6.

```css
.wire-nav { padding: 12px var(--page-margin) 0; }
.wire-nav-inner { width: 100%; max-width: var(--page-width); margin-inline: auto; }
.wire-nav-bar { width: 100%; max-width: 100%; padding: 6px; border-radius: 26px; }

@media (max-width: 899px) {
  .wire-nav-links, .wire-nav-link.wire-nav-login { display: none; }
  .wire-nav-bar { display: flex; justify-content: flex-start; }
  .wire-nav-mobile { margin-inline-start: auto; }
  .wire-nav-mobile-toggle { width: 56px; height: 56px; }
}
@media (min-width: 900px) {
  .wire-nav-bar {
    display: grid;
    grid-template-columns: 1fr auto auto 1fr;
    column-gap: 0;
  }
  .wire-nav-mobile-toggle { width: 40px; height: 40px; }
}
```

### Nav visibility tiers (measured)

| Width | Visible items in bar | Toggle |
|---|---|---|
| 360–768 | logo, “Open menu”, “Get started” | 56 × 56 hamburger; “Creator Login” hidden |
| 900 | logo, Use Cases, Case Studies, “More links”, Creator Login, Get started | 40 × 40 “More links” |
| 1024 | logo, Use Cases, Case Studies, Resources, “More links”, Creator Login, Get started | 40 × 40 “More links”; For Creators is inside More |
| 1200+ | logo, Use Cases, Case Studies, Resources, For Creators, Creator Login, Get started | none |
| 1440 | same full set | none |

The 900/1024 “More links” control is a **fit-driven overflow**, not a CSS breakpoint: only the 900px hard rule hides the whole link cluster. At 1200 all six destinations fit and the control disappears.

### 360px nav defect (see `diffs.md`)

At 360: bar `x=16 w=328 right=344`; logo `right=159.5`; toggle `x=163.5 → 219.5`; CTA `x=223.5 → right=362.5`. The row needs 340.5px but the bar’s content box is 316px. The CTA therefore sits **18.5px outside the pill** and **2.5px outside the viewport**; the fixed chrome does not add page overflow (`scrollWidth` stays 360), but the right rounded edge is clipped. At 390 the CTA ends at 368 inside the bar (374). Supplementary probes: at 375 the CTA still protrudes 3.5px outside the pill; at 384–385 it fits. **Treat ~385px as the safe minimum for the current header** (or shrink/hide the wordmark / reduce CTA padding below 385).

---

## 5. Heroes

### 5.1 Inner-page hero

```css
.hp-uc-hero-field { display: flex; flex-direction: column; gap: var(--section-padding-lg); }
.hp-uc-hero-copy  { max-width: 880px; margin-inline: auto; text-align: center; }
.hp-uc-hero-sub   { max-width: 720px; }
/* page opening + 24px hero shift puts H1 at 134px (mobile/tablet), 150px (1024), 156px (1440) */
```

- 768 and below: single column, copy full width (minus margin), large H1 wraps freely.
- 1024+: copy max 880px, 24px extra top shift; H1 68px.
- 1440+: same layout; H1 68px; content max 1312.
- 1600+: H1 80px.

Measured H1 tops: 134 (360–768), 150 (1024/1200), 156 (1440/1568). Header bottom is 92 (fixed), so minimum clearance is 42px.

Page hero heights are content-driven; examples: `/use-cases/drive-revenue` 1032 / 790 / 1087 / 937 / 954 / 997 at 360 / 600 / 768 / 1024 / 1440 / 1680; `/case-studies` 456 / 387 / 346 / 424 / 430 / 453; `/case-studies/papier` 1115 / 1132 / 826 / 892 / 887 / 978. Do not hard-code a single hero height.

### 5.2 Home hero + camp

```css
.hp-hero { overflow: clip; }
.hp-hero-field {
  display: grid; grid-template-columns: minmax(0, 1fr);
  padding-top: 40px; padding-bottom: 80px;
}
.hp-hero-copy { max-width: 832px; gap: 24px; }
@media (max-width: 1023px) {
  .hp-hero-field { display: flex; flex-direction: column; gap: 40px; padding-block: 0; }
}
@media (max-width: 767px) { .hp-hero-field { gap: 0; } }
```

Camp (`hp-camp-sticky`):

| Range | Camp height | Post/video size | Notes |
|---|---|---|---|
| 0–767 | 744 | **240.75 × 428** | post top 104; card scale .74; sticky disabled (`top:auto`), 8px margin-top; `--camp-post-h:480` |
| 768–1023 | 600 | **261 × 464** | card scale .74 |
| 1024+ | `clamp(520px, 100svh − navpadding − 76 − 32, 720px)` | **~303–306 × 540–545** | sticky under nav (`top: var(--page-navpadding)`); 1024 uses 306.47 × 544.83, 1440 uses 303.56 × 539.66 |

Video is `aspect-ratio: 9/16`, `object-fit: cover`, radius `post-w × .09`; poster images use `object-fit: cover`. Hero section heights: 1249 (360/390), 1130 (600), 1206 (768), 1183 (900), 1392 (1024–1568), 1422 (1680).

The home page also has a fixed announcement (`hp-notify`): 358 × 88.8 at 360, 72px tall at ≥768, below the nav. It is home-only and does not affect document width; it increases the home hero’s opening offset.

### 5.3 Legal hero

`.wire-legal-hero` is `min-height: max(530px, 50svh)`, but the measured height is **530px at every width** (the 50svh term never wins at 900/844 viewport). H1 50/52/68/80; copy max 728px.

---

## 6. Grid collapses

All gaps/paddings use the tokens in §2. Measured column counts and widths:

| Component (page) | <768 | 768–1023 | 1024–1199 | 1200–1439 | ≥1440 |
|---|---|---|---|---|---|
| Link cards — guides, compare index (`--grid-columns:2`) | 1 col (328/358) | 2 cols (336 at 768, 402 at 900) gap 32 | 2 cols (432) gap 32 | 2 cols (520) gap 32 | 2 cols (640) gap 32 |
| Playbooks resource cards (`wire-grid` 3) | 1 col | 2 cols (336) gap 32 | 3 cols (277) gap 32 | 3 cols (336/416) gap 32 | 3 cols (416) gap 32 |
| For Creators step tiles (`hp-ct-row`) | 1 col | 2 cols (340 at 768, 406 at 900) gap 24 | 4 cols (206) gap 24 | 4 cols (250) gap 24 | 4 cols (310) gap 24 |
| For Creators profile card (`hp-cp`) | 1 col | 1 col | 2 cols (416) gap 64 | 2 cols (504) gap 64 | 2 cols (624) gap 64 |
| For Creators journey (`hp-cj-row`) | 1 col | 1 col | 3 cols (282) gap 24 | 3 cols (341) gap 24 | 3 cols (421) gap 24 |
| Home steps (`hp-steps-stage`) | 1 col | 1 col (640 max) | 2 cols 282 / 565 gap 24/48 | 2 cols 341 / 683 | 2 cols 421 / 843 |
| Home FAQ (`.hp-faq`) | 1 col | 1 col | 2 cols 5fr / 7fr (346 / 485) gap 64 | 2 cols 1fr / 1fr (426) | 2 cols 1fr / 1fr (624) |
| Home objectives (`.hp-objectives-row`) | 1 col | 1 col | 2 cols (436) gap 24 | 2 cols (524) | 2 cols (644) |
| Home comparison table | 1 col + H-scroll | table fits (704) | table fits (896) | table fits (1072) | table fits (1312) |
| Use-case process (`hp-uc-process-field`) | 1 col | 1 col | 2 cols 282 / 565 gap 24/48 | 2 cols 341 / 683 | 2 cols 421 / 843 |
| Use-case steps (`hp-uc-steps-row`) | 1 col | 2 cols gap 16 | 3 cols gap 16 | 4 cols (256) gap 16 | 4 cols (316) gap 16 |
| Use-case split (`hp-uc-split`) | 1 col | 1 col | 2 cols | 2 cols | 2 cols |
| Careers roles (`.hp-roles-list`) | 1 col | 1 col | 1 col | 1 col | 1 col |
| Careers team (`.hp-team-prints`) | **3 cols** (111) gap 16/12 | **3 cols** (219) gap 32/24 | **3 cols** (283) | **3 cols** (331) | **3 cols** (331); container max ~1040 |
| Case-study banner (`.wire-case-banner`) | 1 col | 1 col | 3fr / 11fr (164 / 603) | 3fr / 11fr (202 / 742 at 1200) | 4fr / 13fr (279 / 905) |
| Case-study “others” layout | 1 col | 1 col | 1 col | 1 col | 1 col (banner internal ratio above) |
| Privacy legal layout | 1 col | 1 col | 1 col | 1 col | 3 cols 256 / 736 / 256 gap 32 |
| Compare article columns (`hp-prose-columns[data-split]`) | 1 col | 2 cols (344) gap 16 | 2 cols (440) | 2 cols (528) | 2 cols (648) |

Rules of thumb: **768** turns most 1-column stacks into 2 columns; **1024** introduces 3/4-column desktop layouts; **1200** adds the 4th use-case step; **1440** is the only 3-column legal layout. A handful of components break the pattern and are listed explicitly above (careers team is always 3-col; playbooks goes 1→2→3; For Creators goes 1→2→4).

Section-level heading alignment also changes at 767: `.hp-band-heading` becomes `flex-direction: column; align-items: flex-start` (from a space-between row with 40px gap).

---

## 7. Tables

### 7.1 Home + `/compare/grin-vs-tano` comparison table

`.hp-table`: `table-layout: fixed`, `width:100%`, `border-collapse: collapse`; cells 20px vertical padding, 32px left padding between columns; highlighted column 24px inline padding; header row 68px; body row height `2lh + 40px`.

```css
.hp-table { min-width: 640px; }
@media (max-width: 767px) { .hp-table { min-width: 800px; } }
.hp-comparison-scroll { overflow-x: auto; padding-bottom: 40px; }
@media (max-width: 767px) {
  .hp-comparison-scroll {
    margin-inline: calc(var(--page-margin) * -1);
    padding-inline: var(--page-margin);
  }
  .hp-comparison-scroll::-webkit-scrollbar { display: none; }
}
.hp-table-info, .hp-table-note { display: none; }
@media (min-width: 1024px) { .hp-table-info, .hp-table-note { display: initial; } }
```

Measured: 800px wide at 360/600 (scrolls inside 328/568), 704 at 768, 836 at 900, 896 at 1024, 1072 at 1200, 1312 at 1440+. Home section 7 and the GRIN page share this component. At ≤767 the wrapper is 832px scroll width at 360; attribute column scrolls away (no sticky first column).

### 7.2 Guides article table

`.wire-table-scroll { overflow-x:auto }`; `.wire-table { width:100%; min-width:720px }`; `hp-prose-table .wire-table[data-wide] { min-width:520px }`. Measured `/guides/creator-ads`: **520px** at 360/390 (scroll inside 328/358), 568px at 600, 640px at 768+ (matches the 640px prose measure).

---

## 8. Forms

### 8.1 `/talk-to-us` (contact)

```css
.wire-contact {
  height: 100svh;
  padding: calc(var(--page-navpadding) + 8px) var(--page-margin) 24px;
  display: flex; align-items: center; justify-content: center;
}
.wire-contact-sheet { width: 100%; max-width: 512px; max-height: 100%; }
.wire-contact-sheet .wire-contact-card { padding: 32px; }
.wire-contact-form { display: flex; flex-direction: column; gap: 20px; }
.wire-contact-fields { display: flex; flex-wrap: wrap; gap: 12px; }
.wire-contact-field { flex: 1 0 0; min-width: 180px; }
.wire-contact-field input { height: 48px; }
.wire-contact-phone { display: flex; gap: 8px; }
.wire-contact-select[data-size=dial] { flex: none; width: 120px; }
@media (max-width: 767px) {
  .wire-contact-phone { flex-direction: column; }
  .wire-contact-select[data-size=dial], .wire-contact-phone input { width: 100%; flex: none; }
  .wire-contact-card[data-current-step] .wire-contact-head h1 { font-size: var(--size-heading-sm); }
}
```

Measured layout:

| Width | Sheet | Form | Fields | Title |
|---:|---|---|---|---|
| 360 | 328 wide at x16, y135, 651 tall | 264 wide at x48 | stacked, 48 high | 20 / 22 |
| 390 | 358 at x16, y135 | 294 at x48 | stacked, 48 | 20 / 22 |
| 600 | 512 at x44, y172 | 448 | stacked, 48 | 20 / 22 |
| 768 | 512 at x128, y192 | 448 | **phone row: 120 + 320** | 26 / 28.6 |
| 1024 | 512 at x256, y190 | 448 | phone row 120 + 320 | 30 / 33 |
| 1440 | 512 at x464, y193 | 448 | phone row 120 + 320 | 30 / 33 |

The page is viewport-locked (`bodyScrollHeight` = 844 at 360/390, 900 at ≥600); the form is step 1 of 2, so 9 controls are `display:none` (brand website, company type, ad spend, physical products, creator activity, role, hear-about, message, consent). Submit is full width, 48px high. At 360 the sheet bottom is 786.7 inside an 844 viewport (57px spare).

### 8.2 Home creator signup

`.hp-creator-form` is 2 columns at ≥1024 and 1 column ≤1023; `.hp-creator-signup` is a row at ≥768 and a column ≤767; inputs are 48px. The asset image changes from `aspect-ratio:1056/594` (88%/72% card widths) to `4/3` and a full-width card at ≤767.

---

## 9. Page-specific responsive changes

### `/` (home)
- 13 sections + one **unsectioned** `main > div[data-ground=light]` (case deck) of 2370px at 390 / 2256px at 1440; measure it as a block, not a `<section>`.
- Hero/camp: §5.2. H1 60→64→80→96.
- Logo marquees: `hp-figs` marks 300px wide / 72px plate desktop; 210px / 52px ≤1023; 260px cards ≤767; overflow clipped.
- Steps: 2-col at ≥1024, 1-col below; figure aspect 1280/640, 1:1 ≤1023; copy max 640.
- Conversations: `.hp-convo` is a fixed composition **800px wide ≤767, 1216px 768–1023**, in an `overflow-x:auto` frame (scrollWidth 928 at 360, 1376 at 768). At ≥1024 it fits as `1fr auto 1fr`; image 128×128.
- XL stage: **960px wide ≤767 (236px + rest), 1180px 768–1279**, inside `hp-xl-frame` with horizontal scroll (scrollWidth 992 at 360, 1244 at 768, 1308 at 1024/1200); fits at ≥1280.
- Stats: `.hp-stat-row` is `overflow:auto; scroll-snap-type:x` **only ≤767** (scrollWidth 595/883 at 360, 1487 at 600); at ≥768 it fits and `overflow` is visible.
- Comparison: table rules §7.1; section height 1200 at 360, 1257 at 768, 1043 at 1024, 1091 at 1440.
- Objectives: 2-col ≥1024, 1-col below.
- Creator band: asset/card widths 100% (≤767), 88% (768–1023), 72% (≥1024); form 1→2 columns at 1024.
- FAQ: 2-col ≥1024 with 5fr/7fr at 1024–1279, 1fr/1fr above; 1-col and non-sticky head ≤1023; art hidden ≤767.
- Closing: campaign-card cluster; 4th (`data-slot=code`) hidden ≤1279; mobile cards move to ±20/44px off-edge positions; section 669/603/635/695/695/718 at 360/390/768/1024/1440/1680.

### `/use-cases/drive-revenue`
Hero (H1 50/52/68/80, max copy 880). Process 2-col only ≥1024. Dashboard sections full width; steps 4→3→2→1 as §6. Split section 2-col ≥1024, 1-col ≤1023 (heading moves after media: `order:1`). Metric table/text sections stack at ≤1023.

### `/case-studies`
- Hero: H1 50/52/68/80; standfirst max width; height 456/386/346/424/430/453.
- Figures (`wire-fig`): **300 × 320**, gap 16, drifting marquee; **260 × 280** and 20px padding ≤767. 96s loop; masked edges; section 392px tall at ≥1024, 328px ≤767.
- Films rail (`wire-reel`): card `clamp(240px, 24vw, 340px)` with 24px gap; **64vw** and 16px gap ≤767. 9:16 video, `object-fit: cover`; track is draggable/clipped, not a document scrollbar. Observed card widths 230.4 (360), 249.6 (390), 240 (768/900), 245.75 (1024), 288 (1200), 340 (1440).
- Closing CTA standard.

### `/case-studies/papier`
- Hero: copy max 960; H1 50→80; hero height 1115/1079/1132/826/892/887/978.
- Film band: 1 film, max 1312; reel card 300 desktop / 62vw ≤767.
- “Other case studies”: headline + vertical stack of sticky case cards; card height `--case-h` 673 mobile / 512 desktop; banner 1-col ≤1023, 3fr/11fr 1024–1439, 4fr/13fr ≥1440; copy padding 48 → 40 (≤1439) → 20 (≤767); media inset 16 → 12 (≤767); media 16:9 when stacked. Section height ~2209 at ≥1024, 2362–3213 lower widths.

### `/guides`, `/compare`
- Standard inner hero; link-card grids are **2 columns from 768 up, 1 below**, gap 32, card padding 40. Measured card widths 336/402/432/520/640. No 3-column state.
- `/guides/creator-ads`: prose measure 640, 1 column; H2 heading-md 24→32; comparison table 520 with scroll at ≤767; FAQ 1-col; brands band 1-col.

### `/playbooks`
- Legal-style hero (530px high at all widths); H1 50→80.
- Resource grid is 1/2/3 columns at 767/1023/1024; gap 32; measured cards 568→336→277/416.
- Closing CTA H2 48px; section 520/492/416/416/340/384/336/344 at 360/390/600/768/900/1024/1200+/1680.

### `/compare/grin-vs-tano`
- Hero H1 50→80, 373/303/315/266/378/384/410 tall.
- Article splits into 2 columns at 768 (344/440/528/648), 1 below.
- Comparison table §7.1; at 360/600 it is 800px inside 328/568 and requires horizontal pan.
- FAQ 1-col below 1024, 2-col above; brands band.

### `/careers`
- Hero H1 50→80; heights 911/840/890/920/992/998/1013.
- Open roles: **single column at all widths**, 16px gap; role card padding 20 → 40 at 768; arrow target 40 → 48; internal copy stays one column.
- Team portraits: **always 3 columns**; 111px cards at 390 with 16/12 gap, 219px at 768 with 32/24 gap, 331px at 1440; team container max ~1040.

### `/careers/product-engineer`
- Hero H1 50→80, heights 494/457/373/385/432/438/454.
- Article column: 1-col full width ≤767, max 760px at ≥900; sticky H2 `tano-heading-md` 24→32; closing 292/268/285/326/338.

### `/news`
- Only hero + logo band; hero 336/346/393/399/414; no grid.

### `/for-creators`
- Hero H1 50→80; heights 1108/1060/968/978/956/1135/1141/1175.
- Steps tiles 1/2/4 (§6); profile card column order flips (stage first ≤1023); journey 1/3; FAQ 1/2 at 1024.
- Closing 893/869/745/712/800/840/848 at 360/390/600/768/1024/1440/1680.

### `/talk-to-us`
- No `main > section`; measure `main > .wire-contact-art` and `.wire-contact-sheet` (see §8.1). Viewport-locked 100svh; no page scroll at any width.
- Header is still present; nav 360 clip applies.

### `/privacy-policy`
- Only `main > section.wire-legal-hero`; the legal body is `main > div.wire-legal-body` (measure as a block).
- Hero 530 high at all widths.
- Legal layout: 3 columns **only ≥1440** (`256px 736px 256px`, gap 32, max 1312); 1 column ≤1439. Text measure max **640px** at ≥768; full width 328/358/568 below.
- H2s `tano-display-xs`: 38→44→48; body 16/14. Body height 8657 (768/900) → 9502 (1024) → 9374 (1440) → 9457 (1680).
- At 1440 the left rail is a TOC (256), center copy 736, right rail 256; at 1200 the copy is a single centered 640px column.

---

## 10. Horizontal scrollers (intentional, inside the page)

These are wider than their containers but **do not** make `document.scrollWidth` exceed `innerWidth`:

| Element | Width | Scroll range |
|---|---|---|
| `.hp-comparison-scroll` table | 832 scrollWidth at 360; 800 table | ≤767 only |
| `.hp-convo-frame` stage | 800 ≤767, 1216 768–1023 | ≤1023; fits ≥1024 |
| `.hp-xl-frame` stage | 960 ≤767, 1180 768–1279 | ≤1279; fits ≥1280 |
| `.hp-stat-row` | 595/883 at 360; 1487 at 600 | ≤767, scroll-snap x |
| `.wire-table-scroll` (guide) | 520 table at 360 | ≤767 |
| `.wire-reel` case films | track wider than viewport | all widths; draggable/clipped, not a scrollbar |
| `.wire-figs` marquee | track width max-content | all widths; drift animation |

If cloning literally, keep these as `overflow-x:auto` (or the reel's clipped/draggable track), not as page overflow. None produced horizontal document scroll.

---

## 11. What did NOT change

- `--page-width` (1312px), body-md 16px, body-sm 14px, max content width after 1440.
- Header logo size, CTA size, toggle shape (only 56→40 at 900).
- Contact input height 48px and form max 448px.
- `.hp-table` `table-layout: fixed` and 20px vertical cell padding.
- Case-study reel card aspect 9:16 and object-fit cover.

---

## 12. Files / verification

- `metrics.json` — 150 raw records: scroll metrics, overflow candidates, tokens, header/nav rects, every `main > section` (class/data attrs, rect, headings, containers, grids, media, tables), non-section main blocks, and forms.
- `diffs.md` — defects and overflow notes.
- `screenshots/nav-360.png`, `nav-360-cta-crop.png`, `nav-390.png`, `contact-360.png`, `privacy-1440.png`, `compare-table-360.png` — visual evidence.
- No application code was modified. Measurements reflect the live site with the cookie-consent overlay present (fixed bottom; it does not change document flow).
