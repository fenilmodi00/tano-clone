import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import {
  GuideBrands,
  isDarkBrandRoute,
  type GuideBrandQuote,
  type GuideBrandStat,
} from "./guide-brands";
import { FaqRow } from "@/components/ui/faq-row";
import { ButtonLink } from "@/components/ui/button";
import { PageEffects } from "@/app/_runtime/page-effects";

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

const GLOW = (
  <div aria-hidden="true" className="hp-hero-glow">
    <div className="hp-hero-glow-light">
      <div className="wire-spectrum-drift" />
      <div className="hp-hero-glow-folds" data-layer="a" />
      <div className="hp-hero-glow-folds" data-layer="b" />
    </div>
  </div>
);

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

function replicaName(route: string): string {
  const slug = route.split("/").filter(Boolean).pop() ?? "guide";
  return `guides${slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
    .toLowerCase()}replica`;
}

function GuideClosing({
  closing,
  glyphBase,
  metricId,
}: {
  closing: NonNullable<GuideContent["closing"]>;
  glyphBase: string;
  metricId: string;
}) {
  const splitAt = closing.title.lastIndexOf(" your ");
  const firstLine = splitAt === -1 ? closing.title : closing.title.slice(0, splitAt);
  const secondLine = splitAt === -1 ? "" : closing.title.slice(splitAt + 1);

  return (
    <section
      aria-labelledby="closing-title"
      className="hp-band hp-closing-band"
      data-ground="dark"
      data-ground-dark="open"
      data-padding="xl"
    >
      <div className="hp-container hp-closing">
        <div aria-hidden="true" className="hp-closing-cards">
          <div className="hp-camp-card" data-slot="send">
            <div className="hp-camp-brief">
              <span className="hp-camp-chips">
                <span className="hp-camp-chip" data-picked="true">
                  Affiliate revenue
                </span>
                <span className="hp-camp-chip">Share of voice</span>
              </span>
              <span className="hp-camp-mono" data-quiet>
                Product to gift
              </span>
              <span className="hp-camp-gift">
                <span className="hp-camp-tile" style={{ backgroundColor: "#d9a48f" }}>
                  <img
                    alt="Wellness Journal"
                    decoding="async"
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      color: "transparent",
                    }}
                    src="/sites/tano/images/tano-123.jpg"
                    loading="lazy"
                  />
                </span>
                <span className="hp-camp-gift-name">Wellness Journal</span>
              </span>
              <span className="hp-camp-targets">
                <span className="hp-camp-target">
                  <span className="hp-camp-mono" data-quiet>
                    Revenue target
                  </span>
                  <span className="hp-camp-target-value">
                    <span aria-hidden="true" className="hp-camp-redacted" data-size="md" />
                  </span>
                </span>
                <span className="hp-camp-target">
                  <span className="hp-camp-mono" data-quiet>
                    Target CAC
                  </span>
                  <span className="hp-camp-target-value">
                    <span aria-hidden="true" className="hp-camp-redacted" data-size="md" />
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div className="hp-camp-card" data-slot="library">
            <div className="hp-camp-field">
              <span className="hp-camp-field-head">
                <span className="hp-camp-mono" data-quiet>
                  Creator score
                </span>
                <span className="hp-camp-match-figure">0.00</span>
              </span>
              <span className="hp-camp-score">
                <span className="hp-camp-score-row" style={{ "--row": 0 }}>
                  <span className="hp-camp-score-label">Persona fit</span>
                  <span aria-hidden="true" className="hp-camp-bar" style={{ "--share": "0.9" }} />
                </span>
                <span className="hp-camp-score-row" style={{ "--row": 1 }}>
                  <span className="hp-camp-score-label">World fit</span>
                  <span aria-hidden="true" className="hp-camp-bar" style={{ "--share": "0.82" }} />
                </span>
                <span className="hp-camp-score-row" data-win="true" style={{ "--row": 2 }}>
                  <span className="hp-camp-score-label">Purchase intent</span>
                  <span
                    aria-hidden="true"
                    className="hp-camp-bar"
                    data-win="true"
                    style={{ "--share": 1 }}
                  />
                </span>
                <span className="hp-camp-score-row" style={{ "--row": 3 }}>
                  <span className="hp-camp-score-label">Brand safety</span>
                  <span aria-hidden="true" className="hp-camp-bar" style={{ "--share": "0.96" }} />
                </span>
              </span>
              <span className="hp-camp-field-foot">
                <span className="wire-lockup" data-size="sm">
                  <span className="wire-lockup-ring">
                    <img
                      alt=""
                      width={72}
                      height={72}
                      decoding="async"
                      style={{ color: "transparent" }}
                      src="/sites/tano/images/tano-94.jpg"
                      loading="lazy"
                    />
                  </span>
                  <span className="wire-lockup-who">
                    <span className="wire-lockup-handle">@reginafoster.us</span>
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div className="hp-camp-card" data-slot="metric">
            <ol className="hp-camp-chat">
              <li className="hp-camp-turn" data-from="agent">
                <span aria-hidden="true" className="hp-camp-turn-mark">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 222 208"
                    overflow="visible"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient
                        cx={0}
                        cy={0}
                        gradientTransform="matrix(-73.3295 -212.012 181.351 -72.7727 153.8000 189.9900)"
                        gradientUnits="userSpaceOnUse"
                        id={`${glyphBase}-1`}
                        r={1}
                      >
                        <stop offset={0} stopColor="var(--spectrum-cyan, #46b7d1)" />
                        <stop offset="0.5" stopColor="var(--spectrum-magenta, #cc6add)" />
                        <stop offset={1} stopColor="var(--spectrum-orange, #fb751f)" />
                      </radialGradient>
                    </defs>
                    <path
                      d="M88.0338 4.00741C94.2708 -1.07111 103.169 -0.35695 113.68 0.954679C124.143 2.59856 132.893 4.37172 137.492 10.9771C142.074 17.5585 141.747 29.3607 140.316 40.69C140.299 40.7994 139.455 46.8137 138.263 55.3068C138.066 56.7112 139.348 57.871 140.72 57.5277C158.642 53.0441 177.219 48.3977 177.41 48.3473C188.497 45.7363 200.169 44.1752 207.176 48.0563C214.209 51.9519 216.882 60.4922 219.606 70.7545C222.006 81.0979 223.645 89.8961 219.26 96.6461C214.89 103.371 203.853 107.488 192.84 110.402C192.649 110.447 174.818 114.9 157.244 119.29C155.723 119.67 155.214 121.579 156.341 122.67C167.99 133.945 178.721 144.331 178.849 144.452C186.933 152.496 194.438 161.595 194.868 169.61C195.3 177.654 189.494 184.452 182.258 192.207C174.781 199.728 168.207 205.784 160.174 205.632C152.17 205.48 142.84 198.277 134.54 190.458C134.357 190.276 110.985 167.638 95.749 152.879C94.8364 151.995 93.3481 152.183 92.6759 153.262C82.6871 169.296 72.0716 186.34 71.965 186.516C65.798 196.117 58.4822 205.369 50.7527 207.458C42.9946 209.554 35.1552 205.272 26.0855 199.788C17.1935 194.019 9.91902 188.831 8.39701 180.922C6.88068 173.04 11.9679 162.392 17.8709 152.626C18.0005 152.424 32.9447 128.454 44.0686 110.613C44.5958 109.767 44.4196 108.663 43.6575 108.022C30.5698 97.0155 17.998 86.4428 17.8505 86.3219C9.2263 78.8625 1.10598 70.3116 0.119118 62.3463C-0.871353 54.3518 4.44807 47.1643 11.1271 38.9225C18.0624 30.8963 24.1984 24.3953 32.2226 23.985C40.2175 23.5762 50.0271 30.1093 58.8513 37.3297C58.9474 37.4127 64.3671 41.9737 71.7693 48.2037C72.9695 49.2138 74.8114 48.5053 75.0292 46.9494C76.2575 38.1756 77.1354 31.9084 77.1505 31.7897C78.8896 20.5037 81.8197 9.06748 88.0338 4.00741Z"
                      fill={`url(#${glyphBase}-1)`}
                    />
                  </svg>
                </span>
                <span className="hp-camp-bubble">
                  Loved your last post. Could we send you Papier’s Wellness Journal?
                </span>
              </li>
              <li className="hp-camp-turn" data-from="creator">
                <span aria-hidden="true" className="hp-camp-turn-face">
                  <span
                    aria-label="@reginafoster.us"
                    className="wire-lockup"
                    data-size="xs"
                    role="img"
                  >
                    <span className="wire-lockup-ring">
                      <img
                        alt=""
                        width={48}
                        height={48}
                        decoding="async"
                        style={{ color: "transparent" }}
                        src="/sites/tano/images/tano-94.jpg"
                        loading="lazy"
                      />
                    </span>
                  </span>
                </span>
                <span className="hp-camp-bubble">I’d love that. Perfect for my next post.</span>
              </li>
              <li className="hp-camp-turn" data-from="agent">
                <span aria-hidden="true" className="hp-camp-turn-mark">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 222 208"
                    overflow="visible"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient
                        cx={0}
                        cy={0}
                        gradientTransform="matrix(-73.3295 -212.012 181.351 -72.7727 153.8000 189.9900)"
                        gradientUnits="userSpaceOnUse"
                        id={`${glyphBase}-2`}
                        r={1}
                      >
                        <stop offset={0} stopColor="var(--spectrum-cyan, #46b7d1)" />
                        <stop offset="0.5" stopColor="var(--spectrum-magenta, #cc6add)" />
                        <stop offset={1} stopColor="var(--spectrum-orange, #fb751f)" />
                      </radialGradient>
                    </defs>
                    <path
                      d="M88.0338 4.00741C94.2708 -1.07111 103.169 -0.35695 113.68 0.954679C124.143 2.59856 132.893 4.37172 137.492 10.9771C142.074 17.5585 141.747 29.3607 140.316 40.69C140.299 40.7994 139.455 46.8137 138.263 55.3068C138.066 56.7112 139.348 57.871 140.72 57.5277C158.642 53.0441 177.219 48.3977 177.41 48.3473C188.497 45.7363 200.169 44.1752 207.176 48.0563C214.209 51.9519 216.882 60.4922 219.606 70.7545C222.006 81.0979 223.645 89.8961 219.26 96.6461C214.89 103.371 203.853 107.488 192.84 110.402C192.649 110.447 174.818 114.9 157.244 119.29C155.723 119.67 155.214 121.579 156.341 122.67C167.99 133.945 178.721 144.331 178.849 144.452C186.933 152.496 194.438 161.595 194.868 169.61C195.3 177.654 189.494 184.452 182.258 192.207C174.781 199.728 168.207 205.784 160.174 205.632C152.17 205.48 142.84 198.277 134.54 190.458C134.357 190.276 110.985 167.638 95.749 152.879C94.8364 151.995 93.3481 152.183 92.6759 153.262C82.6871 169.296 72.0716 186.34 71.965 186.516C65.798 196.117 58.4822 205.369 50.7527 207.458C42.9946 209.554 35.1552 205.272 26.0855 199.788C17.1935 194.019 9.91902 188.831 8.39701 180.922C6.88068 173.04 11.9679 162.392 17.8709 152.626C18.0005 152.424 32.9447 128.454 44.0686 110.613C44.5958 109.767 44.4196 108.663 43.6575 108.022C30.5698 97.0155 17.998 86.4428 17.8505 86.3219C9.2263 78.8625 1.10598 70.3116 0.119118 62.3463C-0.871353 54.3518 4.44807 47.1643 11.1271 38.9225C18.0624 30.8963 24.1984 24.3953 32.2226 23.985C40.2175 23.5762 50.0271 30.1093 58.8513 37.3297C58.9474 37.4127 64.3671 41.9737 71.7693 48.2037C72.9695 49.2138 74.8114 48.5053 75.0292 46.9494C76.2575 38.1756 77.1354 31.9084 77.1505 31.7897C78.8896 20.5037 81.8197 9.06748 88.0338 4.00741Z"
                      fill={`url(#${glyphBase}-2)`}
                    />
                  </svg>
                </span>
                <span className="hp-camp-bubble">
                  Wonderful. It arrives Monday, with your code to share.
                </span>
              </li>
            </ol>
          </div>
          <div className="hp-camp-card" data-slot="code">
            <div className="hp-camp-metrics">
              <span className="hp-camp-metric" data-turn={0}>
                <span className="hp-camp-mono" data-quiet>
                  New customer LTV
                </span>
                <span className="hp-camp-metric-row">
                  <svg
                    aria-hidden="true"
                    className="hp-camp-metric-trend"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 40"
                  >
                    <defs>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id={metricId}
                        x1={0}
                        x2={100}
                        y1={0}
                        y2={0}
                      >
                        <stop offset={0} style={{ stopColor: "var(--spectrum-yellow)" }} />
                        <stop offset="0.3" style={{ stopColor: "var(--spectrum-lime)" }} />
                        <stop offset="0.58" style={{ stopColor: "var(--spectrum-cyan)" }} />
                        <stop offset="0.8" style={{ stopColor: "var(--spectrum-violet)" }} />
                        <stop offset={1} style={{ stopColor: "var(--spectrum-magenta)" }} />
                      </linearGradient>
                    </defs>
                    <path
                      className="hp-camp-metric-line"
                      d="M 0 28.96 Q 0 28.96 5.555555555555555 27.68 Q 11.11111111111111 26.4 16.666666666666664 26.72 Q 22.22222222222222 27.04 27.777777777777775 25.119999999999997 Q 33.33333333333333 23.2 38.888888888888886 22.240000000000002 Q 44.44444444444444 21.28 50 21.6 Q 55.55555555555556 21.92 61.11111111111111 19.68 Q 66.66666666666666 17.44 72.22222222222221 16.16 Q 77.77777777777777 14.879999999999999 83.33333333333333 13.92 Q 88.88888888888889 12.96 100 9.120000000000001"
                      stroke={`url(#${metricId})`}
                    />
                  </svg>
                  <span aria-hidden="true" className="hp-camp-redacted" data-size="md" />
                </span>
              </span>
              <span className="hp-camp-metric" data-turn={1}>
                <span className="hp-camp-mono" data-quiet>
                  CAC
                </span>
                <span className="hp-camp-metric-row">
                  <svg
                    aria-hidden="true"
                    className="hp-camp-metric-trend"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 40"
                  >
                    <path
                      className="hp-camp-metric-line"
                      d="M 0 8.48 Q 0 8.48 5.555555555555555 9.44 Q 11.11111111111111 10.399999999999999 16.666666666666664 10.08 Q 22.22222222222222 9.760000000000002 27.777777777777775 11.680000000000001 Q 33.33333333333333 13.600000000000001 38.888888888888886 14.56 Q 44.44444444444444 15.52 50 16.16 Q 55.55555555555556 16.8 61.11111111111111 18.4 Q 66.66666666666666 20 72.22222222222221 20.96 Q 77.77777777777777 21.92 83.33333333333333 23.200000000000003 Q 88.88888888888889 24.48 100 27.68"
                      stroke={`url(#${metricId})`}
                    />
                  </svg>
                  <span aria-hidden="true" className="hp-camp-redacted" data-size="md" />
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="hp-closing-copy">
          <h2 className="hp-closing-title tano-display-sm" id="closing-title">
            <span>{firstLine}</span>
            {secondLine ? <span>{secondLine}</span> : null}
          </h2>
          <p className="hp-sub tano-body-para-md">{closing.body}</p>
          <div className="hp-band-actions">
            <ButtonLink href={closing.cta.href} label={closing.cta.label} />
          </div>
        </div>
      </div>
    </section>
  );
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
  const dark = isDarkBrandRoute(page.route);
  const glyphBase = `tano-glyph-spectrum-${replicaName(page.route)}`;
  const metricId = dark ? "hp-camp-metric-_R_266lubpcnjb_" : "hp-camp-metric-_R_26mlubpcnjb_";
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
    <main id="main">
      <section
        aria-labelledby="use-case-title"
        className="hp-band hp-uc-hero"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        {GLOW}
        <div className="hp-container hp-uc-hero-field">
          <div className="hp-uc-hero-copy">
            <h1 className="hp-title tano-display-md" id="use-case-title">
              <span className="hp-title-words">{page.hero.title}</span>
            </h1>
            {page.hero.paragraphs.map((paragraph) => (
              <p className="hp-uc-hero-sub tano-body-para-md" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

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
        <section
          aria-labelledby="faq-title"
          className="hp-band"
          data-ground="dark"
          data-ground-dark
          data-padding="xl"
        >
          <div className="hp-container hp-faq">
            <div className="hp-faq-head">
              <div className="hp-band-heading" data-align="start">
                <div className="hp-band-heading-copy">
                  <h2 className="hp-title tano-display-xs" id="faq-title">
                    <span className="hp-title-words">{faqSection.heading}</span>
                  </h2>
                </div>
              </div>
            </div>
            <div
              className="hp-reveal hp-faq-stack"
              data-rv-skip
              data-shown="false"
              style={{ "--hp-reveal-delay": "80ms" }}
            >
              <div className="hp-faq-art hp-behind wire-glass-edge" data-rim="true" />
              <div className="hp-faq-card">
                <div className="hp-faq-tools">
                  <div className="hp-faq-search">
                    <label className="wire-visually-hidden" htmlFor="faq-search">
                      Search the questions
                    </label>
                    <span aria-hidden="true" className="hp-faq-search-icon">
                      <svg
                        viewBox="0 0 14 14"
                        width="100%"
                        height="100%"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M2 6C2 3.79086 3.79086 2 6 2C8.20914 2 10 3.79086 10 6C10 8.20914 8.20914 10 6 10C3.79086 10 2 8.20914 2 6ZM6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12C7.29578 12 8.49562 11.5892 9.47642 10.8908L12.2929 13.7073C12.6834 14.0978 13.3166 14.0978 13.7071 13.7073C14.0976 13.3168 14.0976 12.6836 13.7071 12.2931L10.8907 9.47665C11.5892 8.49581 12 7.29588 12 6C12 2.68629 9.31371 0 6 0Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <input
                      autoComplete="off"
                      className="hp-faq-search-input tano-body-md"
                      enterKeyHint="search"
                      id="faq-search"
                      placeholder="Search questions"
                      type="search"
                      defaultValue=""
                    />
                  </div>
                </div>
                <p aria-live="polite" className="wire-visually-hidden" />
                <div id="faq-panel">
                  <ul className="hp-faq-rows">
                    {faq.map((item, index) => (
                      <FaqRow
                        id={`${faqPrefix(page.route)}-${String(index + 1).padStart(2, "0")}`}
                        key={item.q}
                        question={item.q}
                        answer={item.a}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {quoteSection && quote && brandStat ? (
        <GuideBrands
          heading={quoteSection.heading ?? "In their words."}
          quote={quote}
          route={page.route}
          stat={brandStat}
        />
      ) : null}

      {page.closing ? (
        <GuideClosing closing={page.closing} glyphBase={glyphBase} metricId={metricId} />
      ) : null}
      <PageEffects />
    </main>
  );
}
