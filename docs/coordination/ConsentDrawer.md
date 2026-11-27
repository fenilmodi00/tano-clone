# ConsentDrawer status

Scope: restore the client-only cookie consent banner and the site-wide Get started drawer. Owned files only:

- `src/components/sites/tano/shell/consent.tsx` — `SiteConsent`
- `src/components/sites/tano/shell/site-drawer.tsx` — `SiteDrawer` + source form markup
- `src/styles/tano/consent.css` — exit state only (rest is in `source.css`)
- `src/styles/tano/drawer.css` — integration states only (rest is in `source.css`)
- this doc

## Integration lines (orchestrator)

Layout mounts `<SiteConsent />` and `<SiteDrawer />`. `src/app/globals.css` now imports both stylesheets after `forms.css` (verified lines 12–13):

```css
@import "../styles/tano/drawer.css";
@import "../styles/tano/consent.css";
```

## Source evidence

- Live DOM captured at 1568×900 and 390×844 from `https://www.tano.ai/` (Playwright, 2026-11-27):
  - consent outer HTML: `<div aria-label="Cookie consent" class="wire-consent" role="region" tabindex="-1">…` with copy and Reject/Accept `tano-button` markup.
  - open drawer outer HTML: `<dialog aria-label="Get started" class="wire-drawer" data-phase="open">` → `.wire-drawer-sheet` → `.wire-drawer-rule > .wire-spectrum-rule` → `.wire-drawer-close` → `.wire-drawer-scroll` → `.wire-contact-card[data-current-step="1"]` → `.wire-contact-form`.
  - form fields/options captured from live drawer HTML: name, email, brandWebsite, companyType, monthlyAdSpendBand, sellsPhysicalProducts, creatorActivity, role, countryCode, phoneNumber, hearAboutUs, message, consent.
- Client implementation: `js/42y6g8l4st9_s.js` / `3odhfznqaqz-h.js` (`TalkToUsDrawer`) and `js/0ef8lriq_goox.js` / `2ar8d4imj4yf_.js` (`ConsentBanner`).
- CSS: `site/css/all.css` + ported `src/styles/tano/source.css`. Every drawer/consent/form selector, keyframe, mobile rule and reduced-motion rule is already present in `source.css`; verified via selector diff. Our two CSS files only add:
  - consent close state (`wire-consent-close`, 220ms) and reduced-motion fade-out;
  - `[open]` display guarantee and `pointer-events:none` while closing.

## Behaviour / contracts

Consent:
- Renders after hydration only when `localStorage["tano-consent"]` is absent; values `accepted` / `rejected` (assignment contract; source used cookie `tano_consent=granted|denied`).
- Reject/Accept write immediately, set `data-phase="closing"`, then unmount after 220ms (0ms under reduced motion). Source entrance animation is preserved.
- Footer `.wire-footer-button` where text is `Cookie settings` reopens and focuses the region. Also listens for `window` event `tano-consent-open` (source parity).
- `role="region"`, `aria-label="Cookie consent"`, `tabIndex={-1}`. Initial display does not steal focus (source behaviour); reopen focuses the region.

Drawer:
- One `<dialog>` always in the layout; content mounts on first open. `data-phase` sequence: `closed → opening → open → closing → closed` (measured 15ms opening→open).
- Captures same-origin unmodified left clicks on `a[href="/talk-to-us"]` (trailing slash accepted), prevents navigation, opens drawer, URL unchanged. Skips modified/middle clicks, `target` other than `_self`, `download`, `data-no-drawer`, links already inside `.wire-drawer`, and all interception on `/talk-to-us` (source behaviour; direct page stays fully usable).
- Close: close button, Escape (`cancel` + keydown), backdrop click, same-origin link inside the sheet. Exit uses source 220ms animation with 400ms timeout fallback. Focus restored to the trigger; body overflow restored.
- Focus trap cycles only visible dialog focusables; initial focus close button. Focus trace at 1568: Close → team@tano.ai → name → email → countryCode → phoneNumber → Continue → Close (never outside).
- Body scroll locked while open; `ShowModal` handles top layer.
- Form ownership to Forms via `motion/use-forms.ts`. I render `.wire-contact-card[data-current-step="1"]`, `.wire-contact-form#tano-drawer-form` with exact field names/classes/`data-field`/`data-step` and ids `tano-drawer-*`; no submit handler, no step logic, no fetch. After `showModal()` I dispatch `tano:drawer-open` with `{ detail: { dialog } }`; the dialog/open/data-phase mutations remain observable. Forms confirmed path 2 and owns step/validation/success.

## Verification

Harness: components bundled with the real React 19 + full ported `source.css` served locally; integrated run against `http://127.0.0.1:3000`.

Desktop 1568:
- Consent rect `x=64, y=744.40625, w=400, h=139.59375`, radius 32, fixed/left/bottom 16, dark surface token, source opening animation. Exact match to live source. Dismiss computes `0.22s cubic-bezier(0.4,0,1,1) forwards wire-consent-close`; `closing` → removed after 220ms.
- Reject → `localStorage=rejected`, `data-phase=closing`, gone after transition; reload renders no banner. Footer reopen → present + focused; Accept → `localStorage=accepted`.
- Drawer sheet rect `x=528, y=132.5158, w=512, h=634.96875`, radius 28, white sheet; URL stayed `/`; 13 form controls with all source names; initial focus close button; `body`/`html` overflow hidden while open, restored to visible on close.
- 16-Tab trace never left the dialog; Shift+Tab from Close wraps to Continue. Escape → closing → closed, focus returns to `.wire-nav-action`, overflow restored. Backdrop and close-button close both verified.

Mobile 390 (retested after header fix):
- Consent rect `x=16, y=671.609375, w=358, h=156.390625`, right 16, radius 28; exact match to live source.
- In-menu Get started now opens the drawer: URL `/`, phase `open`, sheet rect `x=8, y=80.3125, w=374, h=683.375`, max-height `742.72px`, 13 form controls, initial focus close. Overflow hidden while open and visible after Escape; focus falls back to `.wire-nav-mobile-toggle` (`aria-label="Open menu"`) because the menu trigger is hidden after the panel closes.

Reduced motion:
- Consent computed animation `0.15s both wire-consent-fade`, `transform:none`; drawer `0.001s`, sheet `transform:matrix(1,0,0,1,0,0)`. No travel/timers.

Network/console:
- Integrated run: `remoteRequests=[]`, `consoleErrors=[]`, `warnings=[]`, `pageErrors=[]` (335 local requests, all 127.0.0.1:3000).
- `/talk-to-us`: 200, page form present (`_R_2klubpcnjb_-form`), drawer closed, no console errors.
- Screenshots/evidence: `/tmp/harness/integrated-consent-1568.png`, `integrated-drawer-1568.png`, `retest-drawer-390.png`, `consent-mobile.png`, plus `results.json`, `integrated.json`, `retest-final.out` in the same throwaway harness (not committed).

## Status

Closed. Both integration gaps found during verification are fixed and re-tested: the two stylesheet imports are in `globals.css`, and the mobile menu now treats `#tano-mobile-menu` as inside so its Get started tap opens the drawer. Remaining differences: none observed against the captured source states.
