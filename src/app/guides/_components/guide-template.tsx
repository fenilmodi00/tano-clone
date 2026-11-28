import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { CASE_STUDIES } from "@/components/media/case-studies";
import { BrandQuoteBand } from "@/components/sections/brand-quote-band";
import { ClosingBand } from "@/components/sections/closing-band";
import { FaqSection } from "@/components/sections/faq-section";
import { UseCaseHero } from "@/components/sections/use-case-hero";
import { PageShell } from "@/components/page-shell";

type GuideCardItem = { title: string; body?: string };
type GuideStatItem = { value: string; label: string };

type GuideBlock = {
  type: string;
  html?: string;
  ordered?: boolean;
  items?: ReadonlyArray<string | GuideCardItem | GuideStatItem>;
  head?: ReadonlyArray<string>;
  rows?: ReadonlyArray<ReadonlyArray<string>>;
  text?: string;
  name?: string;
  role?: string;
};

type GuideSection = {
  heading?: string;
  eyebrow?: string;
  variant?: string;
  blocks: ReadonlyArray<GuideBlock>;
};

export type GuideContent = {
  route: string;
  hero: { title: string; paragraphs: ReadonlyArray<string> };
  sections: ReadonlyArray<GuideSection>;
  faq?: ReadonlyArray<{ q: string; a: string }>;
  closing?: { title: string; body: string; cta: { label: string; href: string } };
};

type GuideBrandStat = { value: string; label: string };
type GuideBrandQuote = { text: string; name?: string; role?: string };

type GuideBrandPortrait = { src: string; alt: string } | { initials: string };

/**
 * Per-author quote data for the guide band: the case-study key that supplies
 * the brand name/accent/mark/photo/link, plus the author portrait. The brand
 * name is `CaseStudyMark.label` without its `" logo"` suffix.
 */
type GuideBrandProfile = {
  key: string;
  portrait: GuideBrandPortrait;
};

const GUIDE_BRANDS: Readonly<Record<string, GuideBrandProfile>> = {
  "Yasmin MacDonnell": {
    key: "bloom-and-wild",
    portrait: {
      src: "/sites/tano/images/tano-30.jpg",
      alt: "Yasmin MacDonnell, Marketing Manager at Bloom & Wild",
    },
  },
  "Katie McKane": {
    key: "skin-and-me",
    portrait: {
      src: "/sites/tano/images/tano-110.jpg",
      alt: "Katie McKane, Influencer Executive at Skin + Me",
    },
  },
  "Amirah Hussain": {
    key: "papier",
    portrait: { initials: "AH" },
  },
  "Stephanie Terziyski": {
    key: "hellofresh",
    portrait: {
      src: "/sites/tano/images/tano-50.jpg",
      alt: "Stephanie Terziyski, Growth Influencer Marketing Manager at HelloFresh",
    },
  },
};

const DARK_BRAND_ROUTES: Readonly<Record<string, true>> = {
  "/guides/creator-programme-cost": true,
  "/guides/outgrown-influencer-agency": true,
  "/guides/scale-creator-programme-without-headcount": true,
};

/** Split the captured counter value around its first number: `+125%` → `+` / `%`. */
function splitStat(value: string): { prefix: string; suffix: string } {
  const match = /\d+/.exec(value);
  if (!match || match.index === undefined) return { prefix: value, suffix: "" };
  return {
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + match[0].length),
  };
}

/* Captured list lead-ins are not in JSON; each list either emphasises its lead sentence or not. */
const LIST_EMPHASIS: Readonly<Record<string, ReadonlyArray<boolean>>> = {
  "/guides/creator-ads": [true, false, true, true, false],
  "/guides/creator-programme-cost": [true, true, false],
  "/guides/influencer-agency-or-platform": [false, false, false, false, false],
  "/guides/keep-creators-long-term": [false, false, true, false],
  "/guides/meta-creator-marketing-hub": [false, false],
  "/guides/meta-muse-creator-marketing": [false, true],
  "/guides/meta-muse-creators-brief": [false, false, false, false, true],
  "/guides/meta-muse-nano-micro-creators": [true, true],
  "/guides/outgrown-influencer-agency": [true, false, false, false],
  "/guides/scale-creator-programme-without-headcount": [true, false],
  "/guides/trybe-alternatives": [false, false],
  "/guides/ugc-ai-shopping-agents": [true, true],
  "/guides/usage-rights-pricing": [true, true, true, false],
  "/guides/win-on-meta-muse-with-creators": [true, true],
};

const BOLD_PREFIX_OVERRIDES: Readonly<Record<string, string>> = {
  "Grow your own team, if you want full control and can keep hiring as the programme grows.":
    "Grow your own team",
  "Use creator software such as GRIN to make your team's time go further. It handles the admin, but your team still does the relationship work.":
    "Use creator software",
  "Use an agency for extra hands, usually paid by the brief or on a retainer.": "Use an agency",
  "Use a managed partner that runs the programme for you, while your team approves the key decisions.":
    "Use a managed partner",
};

const LIST_LINKS: ReadonlyArray<{ text: string; href: string }> = [
  {
    text: "FTC's guidance",
    href: "https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers",
  },
  {
    text: "ASA's guidance",
    href: "https://www.asa.org.uk/advice-online/recognising-ads-social-media.html",
  },
  {
    text: "Influencer Marketing Hub, citing Statusphere",
    href: "https://influencermarketinghub.com/product-seeding/",
  },
  {
    text: "Later warns",
    href: "https://later.com/blog/influencer-solutions-in-house-vs-agency/",
  },
  { text: "GRIN", href: "https://grin.co/" },
  {
    text: "how to change your creator programme for Meta Muse",
    href: "/guides/win-on-meta-muse-with-creators",
  },
  { text: "What to tell your creators about Meta Muse", href: "/guides/meta-muse-creators-brief" },
  {
    text: "Viral Nation publishes a $250,000 minimum",
    href: "https://www.viralnation.com/pricing",
  },
  {
    text: "Digiday reports",
    href: "https://digiday.com/marketing/the-creator-agency-of-record-is-now-part-of-the-core-marketing-stack/",
  },
  {
    text: "Influencer Marketing Hub says spreadsheets and direct messages stop working",
    href: "https://influencermarketinghub.com/end-to-end-creator-operations/",
  },
];

const RELATED_LINKS: Readonly<Record<string, string>> = {
  "Keep creators for the long term": "/guides/keep-creators-long-term",
  "Pricing usage rights and whitelisting": "/guides/usage-rights-pricing",
  "Outgrown your influencer agency?": "/guides/outgrown-influencer-agency",
  "Influencer agency or platform": "/guides/influencer-agency-or-platform",
  "What does a creator programme cost?": "/guides/creator-programme-cost",
  "Meta Creator Marketing Hub: do you still need an influencer platform?":
    "/guides/meta-creator-marketing-hub",
  "What does Meta Muse mean for DTC creator marketing?": "/guides/meta-muse-creator-marketing",
  "How to run creator content as ads": "/guides/creator-ads",
  "How to price whitelisting and usage rights fees": "/guides/usage-rights-pricing",
  "What DTC brands should tell their creators about Meta Muse": "/guides/meta-muse-creators-brief",
  "Trybe alternatives: when DTC brands outgrow it": "/guides/trybe-alternatives",
  "Do follower counts matter on Meta Muse?": "/guides/meta-muse-nano-micro-creators",
};

const FAQ_PREFIX_OVERRIDES: Readonly<Record<string, string>> = {
  "/guides/creator-ads": "faq.guide-ads",
  "/guides/influencer-agency-or-platform": "faq.guide-agency",
  "/guides/keep-creators-long-term": "faq.guide-keep",
  "/guides/meta-creator-marketing-hub": "faq.guide-meta",
  "/guides/trybe-alternatives": "faq.guide-trybe",
  "/guides/usage-rights-pricing": "faq.guide-rights",
};

const ENTITIES: Readonly<Record<string, string>> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: "\u00a0",
  quot: '"',
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith("#")) {
      const numeric =
        code[1] === "x" || code[1] === "X"
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10);
      return Number.isFinite(numeric) ? String.fromCodePoint(numeric) : entity;
    }
    return ENTITIES[code.toLowerCase()] ?? entity;
  });
}

type InlineElement = {
  kind: "element";
  tag: "a" | "em" | "strong";
  attrs: Readonly<Record<string, string>>;
  children: InlineContent[];
};
type InlineContent = { kind: "br" } | InlineElement | string;
type InlineFrame = {
  tag: "a" | "em" | "root" | "strong";
  attrs: Readonly<Record<string, string>>;
  children: InlineContent[];
};

const INLINE_TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
const INLINE_ATTR = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*"([^"]*)"/g;

function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of source.matchAll(INLINE_ATTR)) {
    attrs[match[1]] = decodeEntities(match[2]);
  }
  return attrs;
}

function parseInline(html: string): InlineContent[] {
  const root: InlineFrame = { tag: "root", attrs: {}, children: [] };
  const stack: InlineFrame[] = [root];
  let cursor = 0;

  for (const match of html.matchAll(INLINE_TAG)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      stack[stack.length - 1].children.push(decodeEntities(html.slice(cursor, index)));
    }
    cursor = index + match[0].length;

    const closing = match[1] === "/";
    const tag = match[2].toLowerCase();
    if (tag !== "a" && tag !== "em" && tag !== "strong" && tag !== "br") continue;

    if (closing) {
      for (let position = stack.length - 1; position > 0; position -= 1) {
        if (stack[position].tag === tag) {
          stack.length = position;
          break;
        }
      }
      continue;
    }

    if (tag === "br") {
      stack[stack.length - 1].children.push({ kind: "br" });
      continue;
    }

    const element: InlineElement = {
      kind: "element",
      tag,
      attrs: parseAttrs(match[3]),
      children: [],
    };
    stack[stack.length - 1].children.push(element);
    stack.push({ tag, attrs: element.attrs, children: element.children });
  }

  if (cursor < html.length) {
    stack[stack.length - 1].children.push(decodeEntities(html.slice(cursor)));
  }
  return root.children;
}

function renderInlineContent(content: InlineContent, key: string): ReactNode {
  if (typeof content === "string") return content;
  if (content.kind === "br") return <br key={key} />;

  const children = content.children.map((child, index) =>
    renderInlineContent(child, `${key}-${index}`),
  );
  if (content.tag === "strong") return <strong key={key}>{children}</strong>;
  if (content.tag === "em") return <em key={key}>{children}</em>;

  const href = content.attrs.href ?? "";
  const external = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href) || /^(?:mailto|tel):/i.test(href);
  if (external) {
    return (
      <a
        className="wire-contact-link"
        href={href}
        key={key}
        rel={content.attrs.rel ?? "noreferrer noopener"}
        target={content.attrs.target ?? "_blank"}
      >
        {children}
      </a>
    );
  }
  return (
    <Link className="wire-contact-link" href={href} key={key}>
      {children}
    </Link>
  );
}

function renderInline(html: string): ReactNode {
  return parseInline(html).map((content, index) => renderInlineContent(content, `inline-${index}`));
}

function boldPrefix(text: string): string {
  const override = BOLD_PREFIX_OVERRIDES[text];
  if (override) return override;
  const colon = text.indexOf(":");
  const sentence = text.indexOf(". ");
  if (colon !== -1 && (sentence === -1 || colon < sentence)) return text.slice(0, colon + 1);
  if (sentence !== -1) return text.slice(0, sentence + 1);
  return "";
}

function linkify(text: string): string {
  let cursor = 0;
  let output = "";
  while (cursor < text.length) {
    let best: { index: number; href: string; text: string } | undefined;
    for (const link of LIST_LINKS) {
      const index = text.indexOf(link.text, cursor);
      if (index !== -1 && (!best || index < best.index)) best = { ...link, index };
    }
    if (!best) {
      output += text.slice(cursor);
      break;
    }
    output += text.slice(cursor, best.index);
    output += `<a href="${best.href}">${best.text}</a>`;
    cursor = best.index + best.text.length;
  }
  return output;
}

function listItemHtml(item: string, emphasize: boolean, related: boolean): string {
  if (related && RELATED_LINKS[item]) return `<a href="${RELATED_LINKS[item]}">${item}</a>`;
  const html = linkify(item);
  if (!emphasize) return html;
  const prefix = boldPrefix(item);
  return prefix ? `<strong>${prefix}</strong>${html.slice(prefix.length)}` : html;
}

function renderBlock(block: GuideBlock, emphasize: boolean, related: boolean): ReactNode {
  if (block.type === "subheading") return <h3 className="tano-heading-sm">{block.html}</h3>;
  if (block.type === "prose") {
    return block.html ? (
      <p className="tano-body-para-md wire-ink-soft">{renderInline(block.html)}</p>
    ) : null;
  }
  if (block.type === "list") {
    const items = (block.items ?? []).filter((item): item is string => typeof item === "string");
    if (!items.length) return null;
    const rows = items.map((item, index) => (
      <li key={`${index}-${item.slice(0, 24)}`}>
        {renderInline(listItemHtml(item, emphasize, related))}
      </li>
    ));
    return block.ordered ? (
      <ol className="wire-legal-list wire-article-numbered tano-body-para-md wire-ink-soft">
        {rows}
      </ol>
    ) : (
      <ul className="wire-legal-list tano-body-para-md wire-ink-soft">{rows}</ul>
    );
  }
  if (block.type === "quotes") {
    const items = (block.items ?? []).filter((item): item is string => typeof item === "string");
    return items.map((item, index) => (
      <blockquote className="wire-article-quote tano-heading-md" key={index}>
        {item}
      </blockquote>
    ));
  }
  if (block.type === "table") {
    const head = block.head ?? [];
    const body = block.rows ?? [];
    if (!head.length) return null;
    return (
      <div className="wire-table-scroll hp-prose-table">
        <table className="wire-table" data-wide={head.length >= 3 || undefined}>
          <thead>
            <tr>
              {head.map((cell, index) => (
                <th key={index} scope="col">
                  {cell || null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th key={cellIndex} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={cellIndex}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

type ProseRow = { heading?: string; blocks: GuideBlock[] };

function proseRows(sections: ReadonlyArray<GuideSection>): ProseRow[] {
  const rows: ProseRow[] = [];
  for (const section of sections) {
    if (section.variant === "subsection") {
      const row = rows[rows.length - 1];
      const blocks: GuideBlock[] = [
        { type: "subheading", html: section.heading ?? "" },
        ...section.blocks,
      ];
      if (row) row.blocks.push(...blocks);
      else rows.push({ heading: section.eyebrow, blocks });
      continue;
    }
    if (section.variant === "prose") {
      rows.push({ heading: section.heading, blocks: [...section.blocks] });
    }
  }
  return rows;
}

function faqPrefix(route: string): string {
  const override = FAQ_PREFIX_OVERRIDES[route];
  if (override) return override;
  const slug = route.split("/").filter(Boolean).pop() ?? "guide";
  return `faq.guide-${slug}`;
}

function closingLines(title: string): string[] {
  const splitAt = title.lastIndexOf(" your ");
  if (splitAt === -1) return [title];
  return [title.slice(0, splitAt), title.slice(splitAt + 1)];
}

/**
 * One guide detail page: hero, prose rows and subsections, FAQ, quote/stat band
 * and closing CTA. Fourteen routes share this structure; copy lives in JSON.
 */
export function GuideTemplate({ page }: { page: GuideContent }) {
  const rows = proseRows(page.sections);
  const faqSection = page.sections.find((section) => section.variant === "faq");
  const faq =
    page.faq ??
    faqSection?.blocks
      .flatMap((block) => (block.type === "cards" ? (block.items ?? []) : []))
      .filter(
        (item): item is GuideCardItem =>
          typeof item === "object" && item !== null && "title" in item,
      )
      .map((item) => ({ q: item.title, a: item.body ?? "" })) ??
    [];
  const quoteSection = page.sections.find((section) => section.variant === "quote");
  const stat = quoteSection?.blocks
    .flatMap((block) => (block.type === "stats" ? (block.items ?? []) : []))
    .find(
      (item): item is GuideStatItem =>
        typeof item === "object" && item !== null && "value" in item && "label" in item,
    );
  const quoteBlock = quoteSection?.blocks.find(
    (block) => block.type === "quote" && typeof block.text === "string",
  );
  const quote: GuideBrandQuote | undefined = quoteBlock
    ? { text: quoteBlock.text ?? "", name: quoteBlock.name, role: quoteBlock.role }
    : undefined;
  const brandStat: GuideBrandStat | undefined = stat;
  const brandProfile = quote?.name ? GUIDE_BRANDS[quote.name] : undefined;
  const study = brandProfile
    ? CASE_STUDIES.find((candidate) => candidate.key === brandProfile.key)
    : undefined;
  const brand =
    brandProfile && study
      ? {
          name: study.mark.label.replace(/ logo$/, ""),
          accent: study.accent,
          mark: study.mark.src,
          image: { src: study.photoSrc, alt: study.photoAlt ?? "" },
          portrait: brandProfile.portrait,
          href: study.href,
        }
      : undefined;
  const emphasis = LIST_EMPHASIS[page.route] ?? [];
  const listIndexByPosition = new Map(
    rows
      .flatMap((row, rowIndex) =>
        row.blocks.map((block, blockIndex) =>
          block.type === "list" ? { rowIndex, blockIndex } : null,
        ),
      )
      .filter((position): position is { rowIndex: number; blockIndex: number } => position !== null)
      .map((position, index) => [`${position.rowIndex}-${position.blockIndex}`, index]),
  );

  return (
    <PageShell>
      <main id="main">
        <UseCaseHero paragraphs={page.hero.paragraphs} titleLines={[page.hero.title]} />

        {rows.length ? (
          <section className="hp-band" data-ground="light" data-padding="xl">
            <div className="hp-container hp-prose">
              <div className="hp-prose-rows">
                {rows.map((row, rowIndex) => {
                  const related = row.heading === "Related guides";
                  return (
                    <div className="hp-prose-row" key={`${rowIndex}-${row.heading ?? ""}`}>
                      <div className="hp-prose-row-head">
                        <h2 className="tano-heading-md">{row.heading}</h2>
                      </div>
                      <div className="hp-prose-columns">
                        <div className="hp-prose-column">
                          <div className="wire-article-prose">
                            {row.blocks.map((block, blockIndex) => {
                              const list = block.type === "list";
                              const activeList = list
                                ? (listIndexByPosition.get(`${rowIndex}-${blockIndex}`) ?? -1)
                                : -1;
                              return (
                                <Fragment key={`${rowIndex}-${blockIndex}`}>
                                  {renderBlock(block, emphasis[activeList] ?? false, related)}
                                </Fragment>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {faqSection && faq.length ? (
          <FaqSection
            heading={<span className="hp-title-words">{faqSection.heading}</span>}
            rows={faq.map((item, index) => ({
              id: `${faqPrefix(page.route)}-${String(index + 1).padStart(2, "0")}`,
              question: item.q,
              answer: item.a,
            }))}
          />
        ) : null}

        {quoteSection && quote && brandStat && brand ? (
          <BrandQuoteBand
            accent={brand.accent}
            ghosts={[quote.text]}
            ground={DARK_BRAND_ROUTES[page.route] ? "dark" : "light"}
            heading={quoteSection.heading ?? "In their words."}
            media={{ live: brand.image, liveMark: brand.mark }}
            quote={{
              caseStudy: brand.href,
              name: quote.name,
              role: quote.role,
              text: quote.text,
              ...("initials" in brand.portrait
                ? { initials: brand.portrait.initials }
                : { portrait: brand.portrait }),
            }}
            stat={{ caption: brandStat.label, ...splitStat(brandStat.value) }}
            tabs={[{ label: brand.name, mark: brand.mark }]}
          />
        ) : null}

        {page.closing ? (
          <ClosingBand
            body={page.closing.body}
            cta={page.closing.cta}
            lines={closingLines(page.closing.title)}
          />
        ) : null}
      </main>
    </PageShell>
  );
}
