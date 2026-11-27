# Forms — talk-to-us, creator signup, drawer form, mobile menu

Status: **complete** (validation, local success, drawer-form attachment, mobile menu focus/inert/stagger). No backend calls.

## Files

- `src/components/sites/tano/forms/forms.tsx` — shared validation (source rules, work-email/public-domain list, URL normaliser, error order), success copy, `TANO_DRAWER_OPEN_EVENT`.
- `src/components/sites/tano/motion/use-forms.ts` — DOM enhancement for every `.wire-contact-form` and `.hp-cl-form`; two-step talk flow; Back button; inline errors/focus; submitting/sent states; creator signup; mobile menu trap/inert/Escape/stagger; `tano:drawer-open` listener + MutationObserver.
- `src/styles/tano/forms.css` — local success panels, error/focus polish, menu layering/focus.
- `docs/coordination/Forms/` — screenshots (01–11).

Source evidence: `docs/research/tano/interactions/shots/forms*`, `mobile-nav/`, `docs/research/tano/{talk-to-us,for-creators}/page.html`, bundle validation strings (`js/0xfhbjw8jumf0.js`, `js/3wa99p2ledxp-.js`), `/api/contact` + `/api/creator-signup` schemas in `~/tano/openapi.json`, and `docs/research/tano/motion/inventory.md` (§ drawer/menu timings).

## Contract exposed

- Custom event: **`tano:drawer-open`**, dispatched on `document` with `{ detail: { dialog } }`. My runtime also watches dialog insertion, `open`, and `data-phase` via MutationObserver, so the event is a fast path, not a requirement.
- Any `<form class="wire-contact-form">` is enhanced in place (11 fields + consent); any `<form class="hp-cl-form">` gets creator validation. Already-bound forms are skipped (WeakMap).
- Drawer shell/open-close/focus trap/scroll lock/400 ms close remain **ConsentDrawer’s** (`shell/site-drawer.tsx`); Forms only enhances `#tano-drawer-form` when its content mounts. No second dialog or navigation interception here.
- Success is local only. Talk success panel: `.wire-contact-success` inside the form’s card; creator status: `.hp-cl-status` + `.wire-forms-demo-note`.

## Behaviour

- Talk step 1: name + work email + optional phone. Step 2: brand website, company type, monthly ad spend, physical products, creator activity, role, source, message, consent. Source error strings; focus first invalid; select placeholders restored after React hydration; Enter submits; Back keeps values.
- Public email domains (`gmail.com`, `outlook.com`, `qq.com`, …) rejected: “Please use a work email.” URL accepts `yourbrand.com` (normalised) and rejects non-http(s).
- Creator: valid email → consent → submitting → source “on the list” message + “Local demo — nothing was sent.”; email/consent/button disabled; no reload.
- Menu closed: `inert`, `aria-hidden=true`, hidden, no scroll lock. Open: first link focused from keyboard, `main` + chrome siblings inert, body locked, Escape closes and returns focus to the toggle, links stagger `90 ms + i × 45 ms` (last 405 ms). Closed toggles clear the temporary z-index used to sit above the consent/announcement surfaces.

## Measured (1568 × 900 unless noted; 390 × 844 for menu/mobile)

| Check | Result |
|---|---|
| Talk default | card `512 × 603` at `(528, 193)`; every required select value `""` |
| Empty submit | errors “Enter your name”, “Enter your work email”; focus `name`; status “Check the highlighted fields.”; URL `/talk-to-us` |
| Step 2 | `data-current-step=2`; buttons Back + Get started (both opacity 1); focus `brandWebsite`; 8 fields visible |
| Talk success | `.wire-contact-success` `448 × 135`; form `hidden`; card `data-state=sent`; focus panel; no `/api/*` requests |
| Creator invalid | “Enter a valid email address”, `data-tone=error`, `aria-invalid=true`, focus email |
| Creator success | source sent copy + demo note; email/consent/button disabled; URL `/for-creators`; no requests |
| Menu 390 closed | panel inert/aria-hidden/visibility hidden; body overflow `""`; page width 390 |
| Menu 390 open | panel `0,0,390,844`; body `hidden`; `main` inert; first focus “Drive Revenue”; delays `.09s`/`.405s`; z 55 chrome 60 |
| Menu trap | Tab from last link → toggle (“Close menu”); Escape → closed, focus toggle, body overflow restored |
| Drawer form | `data-phase=open`, `#tano-drawer-form` bound, focus Close; empty step 2 lists 8 errors; Escape → `closing` (open still true at 150 ms) → `closed` after 400 ms, focus back on “Get started”; no requests |
| Console | no Forms-related console/page errors in the above runs |

Screenshots: `Forms/01-talk-default.png`, `02-talk-errors.png`, `03-talk-step2.png`, `04-talk-success.png`, `05-creator-error.png`, `06-creator-success.png`, `07-drawer-success.png`, `08-menu-closed-390.png`, `09-menu-open-390.png`, `10-menu-closed-after-escape-390.png`, `11-talk-errors-390.png`.

## Remaining gaps / notes

- Talk success deliberately does **not** redirect to the source booking calendar; it states nothing was sent. Same for creator (source message + explicit demo note).
- Validation runs on submit only (source behaviour); errors clear on input/change.
- `forms.css` is served by the current dev CSS chunk; menu layering also has an inline z-index fallback so the sheet stays above fixed announcement/consent surfaces.
- Cookie consent is a global overlay owned elsewhere; it can intercept pointer clicks until dismissed. The open mobile menu now sits above it, and keyboard submit is unaffected.
