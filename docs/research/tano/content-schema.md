# Tano source content schema

Generated editorial content for the local tano.ai clone. The extractor reads the
44 captured routes, normalises them into one JSON file per route, and writes the
typed registry used by the app.

```sh
node scripts/extract-source-content.mjs
```

The script prints `Extracted 44/44 routes` and fails non-zero if a route has no
hero title, no sections, a remote media URL, a missing local asset, or leaked
markup (`script`, `style`, `form`, `input`).

## Files

| Path | Purpose |
| --- | --- |
| `scripts/extract-source-content.mjs` | Reproducible extractor. |
| `src/content/tano/types.ts` | `Block`, `Page`, `Hero`, `PageSection`, `Card`. |
| `src/content/tano/pages/<slug>.json` | One extracted page per route. |
| `src/content/tano/pages/index.ts` | Typed `pages` registry plus `pageSlugs`/`getPage`. |
| `docs/research/tano/content-schema.md` | This document. |

Inputs are `docs/research/tano/<slug>/page.html` and
`docs/research/tano/routes.json`; `/home/boxd/tano/site/<route>.html` is the
fallback when a fresh capture is missing. Media URLs are resolved to the local
copies listed in `docs/research/tano/asset-map.json` (including images wrapped
by `/_next/image?url=...`). Assets are verified under `public/` before they are
written; unresolved decorative imagery is omitted rather than linked remotely.

## Model

```ts
type Block =
  | { type: 'prose'; html: string } // inline only: a, strong, em, br, sup, sub
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'cards'; items: CardBlockItem[] }
  | { type: 'quote'; text: string; name?: string; role?: string; image?: string }
  | { type: 'media'; src: string; alt?: string; poster?: string; href?: string }
  | { type: 'stats'; items: { value: string; label: string }[] };

type Page = {
  route: string;
  family: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow?: string;
    title: string;
    paragraphs: string[];
    actions: { label: string; href: string }[];
    media?: string;
    mediaPoster?: string;
  };
  sections: {
    id?: string;
    heading?: string;
    eyebrow?: string;
    variant?: string;
    blocks: Block[];
  }[];
  faq?: { q: string; a: string }[];
  closing?: { title: string; body: string; cta: { label: string; href: string } };
  cards?: { title: string; body?: string; href: string; group?: string }[];
};
```

`prose.html` is inline HTML only. Adjacent copy is split into separate prose
blocks at paragraph boundaries; links keep their real destination (internal
paths untouched, external URLs absolute with `target="_blank"` and
`rel="noreferrer noopener"`). Lists and table cells are plain text, matching the
schema; inline links inside a list item or table cell are therefore flattened to
their label. Card `body` strings are plain text as well.

`cards` at the page level is a flat index used for listing/search. It is
populated only for index routes (careers, case studies, compare, guides, news,
playbooks) and mirrors the cards in that page's sections, with the visual group
heading in `group`. Section-level `cards` remain the rendering source.

FAQ content is exposed twice by design: the structured `faq` array is the
canonical Q&A data, while the FAQ section also carries those questions as a
`cards` block so the section is renderable on its own.

### Families

`home`, `careers-index`, `career-role`, `case-studies-index`, `case-study`,
`compare-index`, `compare`, `guides-index`, `guide`, `news-index`,
`news-article`, `playbooks-index`, `playbook`, `for-creators`, `legal`,
`contact`, `use-case`, `webinars`.

### Section variants used

`logos`, `process`, `content`, `track`, `stats`, `comparison`, `objectives`,
`creator`, `faq`, `quote`, `case-cards`, `case-grid`, `results`, `films`,
`cards`, `prose`, `prose-column`, `subsection`, `legal`, `role`, `role-meta`,
`team`, `profile`, `steps`, `case-study`, `case-study-stats`, `hero-stats`,
`closing`, `contact`, `playbook-gate`.

## Coverage by route family

**Home.** Hero, both logo bands, loop/process cards, tracking cards, brand-side
and creator-side stats, comparison table, objective cards, creator invitation,
FAQ, testimonial deck/case cards, and closing CTA. The animated campaign,
conversation, and experiment mock-ups contribute their headings and framing
copy; their micro-UI labels/data are omitted (see below).

**Careers.** Index hero, careers film image, all open-role cards (also flattened
into `cards`), team copy and four team photos. Role pages carry the role-title
hero, a `role-meta` stats block (department, location, contract, openings), every
`hp-rp-section` including nested h3 subsections, bullets, process steps, team
cards, offer table, and the closing copy. The apply dialog/form is omitted.

**Case studies.** Index: hero, result figures as cards, four case cards (also
`page.cards`), and eight creator-film media blocks. Detail: hero, client/sector
facts and hero result stats, complete `wire-legal-body` article with
sections/subsections, solution step cards, result stats and pull-quote, all
recovered creator films (video + local poster), "other case studies" cards,
and closing CTA.

**Compare.** Index: hero and four comparison cards. Detail: hero plus "The
numbers" proof stats, every `hp-prose-row` (including split columns, row
headings, and row eyebrows), both comparison tables with the Tano wordmark
header recovered, FAQ, brand testimonial stat/quote, and closing CTA.

**Guides.** Index: three grouped card sections and 14 `page.cards`. Detail:
hero, every prose row with nested h3 subsections, ordered/unordered lists,
comparison tables, related-guide list, FAQ, brand quote, and closing CTA.

**News.** Index: hero/email CTA, press-logo strip, featured story card, and
`page.cards`. Article: hero, intro, and all legal-style article sections.

**Playbooks.** Index: hero, five resource cards, and closing CTA. Detail: hero,
gated-card copy and feature checklist (the email form itself is removed), and
the final CTA as `closing`.

**For creators.** Hero and actions, brand logo strip, four benefit cards,
profile copy plus the 79% stat, three join steps, FAQ, and the closing copy. The
creator signup form is removed, so that closing has no machine-usable CTA.

**Privacy policy.** Intro plus every legal section from definitions through
contact; h3 clauses become subsections with the parent heading as eyebrow. The
page's heading rail is intentionally skipped because it duplicates section
headings.

**Contact.** Hero and contact copy/email. The two-step lead form, its fields,
options, and validation copy are removed.

**Use cases.** Hero, hero proof stats, logo strip, process slides as cards,
feature headings/standfirsts, step cards, case-study card (media, stat, quote),
tracking cards, metric-group cards, and closing CTA.

**Webinars.** Hero, the webinar body (speakers, what was covered), and closing
CTA.

## Sanitisation and normalisation

- `script`, `style`, `template`, `svg`, `noscript`, `iframe`, `form`, `input`,
  `select`, `textarea`, `button`, `video`/`audio`, and embedded JSON-LD never
  enter the output.
- Inline prose keeps only `a`, `strong`, `em`, `br`, `sup`, `sub`; all other
  wrappers are unwrapped. External anchors are made absolute; internal links
  stay local.
- Cookie banners, navigation, footer, heading rails, and animation scaffolding
  (`rv-word` splits, duplicate marquees, visually-hidden screen-reader copies)
  are removed or de-duplicated.
- Word-split animation spans are re-joined with spaces for headings.
- `aria-hidden`/visually-hidden stat duplicates are collapsed so values read
  `22%`, not `22% 22%`.
- Source copy is preserved, including curly quotes, en/em dashes, ellipses, and
  the source's own inconsistencies. Only wrapper quotation marks around a
  pull-quote are removed from `quote.text`.

## Known omissions

- **Interactive product mock-ups.** Home campaign/conversation/experiment
  widgets, use-case dashboard screenshots, and creator-profile micro-data are
  visual demos rather than editorial copy. Their section headings and framing
  paragraphs are captured; internal demo labels and generated sample values are
  not treated as page copy.
- **Forms.** Contact, creator signup, playbook email gates, and role application
  dialogs contribute their surrounding copy but no fields, options, or submit
  actions. Playbook "Get free access" buttons have no href and are omitted.
- **Non-reel video players.** Case-study body players are hydrated by
  JavaScript and have no static `src`; only creator reels, whose `src`/poster
  pairs exist in the page data, are emitted as `media`. Reel videos and posters
  are local.
- **Unmapped decorative imagery.** Any image reference encountered while
  selecting media that has no downloaded local counterpart is omitted rather
  than emitted as a remote URL. Brand wordmarks are represented by their
  accessible names in logos cards. The extractor prints a note when any such
  reference is skipped.
- **Links inside list items/table cells/card bodies.** The schema types these as
  plain strings, so link labels are preserved but hrefs are not.
- **FAQ/table-of-contents rails.** Duplicated section headings in side rails are
  omitted; `sections` is the canonical order.
- **Videos in films without a recovered poster/src pair** are skipped. The
  extractor reports the number of unmapped media references on each run.
