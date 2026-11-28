import Link from "next/link";
import type { ReactNode } from "react";
import { BandHeading } from "@/components/sections/band-heading";
import { BrandQuoteBand } from "@/components/sections/brand-quote-band";
import { ClosingBand } from "@/components/sections/closing-band";
import { FaqSection } from "@/components/sections/faq-section";
import { StatDefs, StatGroup, StatItem } from "@/components/sections/stat";
import { UseCaseHero } from "@/components/sections/use-case-hero";
import { PageShell } from "@/components/page-shell";
import { ButtonLink } from "@/components/ui/button";

type Ground = "light" | "dark";

type BlockItem = string | { title: string; body?: string } | { value: string; label: string };

type CompareBlock = {
  type: string;
  html?: string;
  ordered?: boolean;
  items?: ReadonlyArray<BlockItem>;
  head?: ReadonlyArray<string>;
  rows?: ReadonlyArray<ReadonlyArray<string>>;
};

type CompareSection = {
  heading?: string;
  eyebrow?: string;
  variant?: string;
  blocks: ReadonlyArray<CompareBlock>;
};

type CompareContent = {
  route: string;
  hero: {
    title: string;
    paragraphs: ReadonlyArray<string>;
    actions: ReadonlyArray<{ label: string; href: string }>;
  };
  sections: ReadonlyArray<CompareSection>;
  faq?: ReadonlyArray<{ q: string; a: string }>;
  closing?: {
    title: string;
    body: string;
    cta: { label: string; href: string };
  };
};

type ProseRow =
  | { kind: "labelled"; section: number }
  | { kind: "columns"; sections: ReadonlyArray<number>; eyebrow?: boolean }
  | { kind: "text"; section: number; head?: boolean }
  | { kind: "blocks"; section: number };

type PageBlock =
  | {
      kind: "prose";
      id?: string;
      title?: string;
      titleSection?: number;
      ground: Ground;
      rows: ReadonlyArray<ProseRow>;
    }
  | { kind: "comparison"; section: number; ordinal: number; ground: Ground }
  | { kind: "faq"; ground: Ground }
  | { kind: "brands" };

type BrandStrip = {
  slug: string;
  ground: Ground;
  accent: string;
  stat: { prefix: string; suffix: string; caption: string };
  media: {
    live: { src: string; alt: string };
    still: { src: string };
    liveMark: string;
    stillMark: string;
  };
  ghosts: readonly [string, string];
  quote: {
    text: string;
    name: string;
    role: string;
    caseStudy: string;
    portrait?: { src: string; alt: string };
    initials?: string;
  };
  tabs: readonly [{ label: string; mark: string }, { label: string; mark: string }];
};

type CompareLayout = {
  slug: string;
  faqTabs?: boolean;
  faqIds: ReadonlyArray<string>;
  brands: BrandStrip;
  blocks: ReadonlyArray<PageBlock>;
};

const TANO_WORDMARK = (
  <svg
    aria-hidden="true"
    className="hp-table-wordmark"
    fill="none"
    overflow="visible"
    viewBox="0 0 606.001 208"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M280.001 40C282.21 40.0003 284.001 41.791 284.001 44V199.861C284.001 202.07 282.209 203.861 280 203.861H252C249.791 203.861 248.001 202.07 248.001 199.861V196C248.001 195.176 247.056 194.704 246.386 195.183C234.859 203.417 222.565 207.77 206.001 208C182.028 207.623 159.051 205.328 145.666 190.082C133.745 176.505 130.353 149.638 130.001 122C130.353 94.3625 133.828 67.5345 146.666 54.8213C161.051 40.5757 182.028 40.3767 206.001 40C222.502 40.2294 235.67 41.8333 246.385 48.8818C247.068 49.331 248.001 48.8534 248.001 48.0361V44C248.001 41.7909 249.792 40 252.001 40H280.001ZM207.001 76C176.001 76 166.001 80 166.001 124C166.001 168 176.001 172 207.001 172C238.001 172 248.001 168 248.001 124C248.001 80.0002 238.001 76 207.001 76Z"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M530.001 40C553.974 40.3767 577.95 41.5767 590.335 54.8223C602.675 68.0194 605.649 96.3628 606.001 122C605.649 147.637 602.675 177.885 590.335 191.082C577.95 204.327 553.974 207.623 530.001 208C506.028 207.623 482.052 204.327 469.667 191.082C457.327 177.885 454.353 147.638 454.001 122C454.353 96.3626 457.327 68.0193 469.667 54.8223C482.052 41.5769 506.028 40.3767 530.001 40ZM530.001 76C499.001 76 489.001 80 489.001 124C489.001 168 499.001 172 530.001 172C561.001 172 571.001 168 571.001 124C571.001 80.0002 561.001 76 530.001 76Z"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M72.001 0C74.2099 0.000263219 76.001 1.79102 76.001 4V42C76.001 43.1046 76.8964 44 78.001 44H116.001C118.21 44.0003 120.001 45.791 120.001 48V76C120.001 78.2091 118.209 80 116 80H78.001C76.8964 80 76.001 80.8954 76.001 82V152C76.001 164.25 79.0002 168 92.001 168H120.001C122.21 168 124.001 169.791 124.001 172V200C124.001 202.209 122.21 204 120.001 204H74.001C44.999 204 32.001 191.305 32.001 164V82C32.001 80.8956 31.1053 80.0003 30.001 80H4.00098C1.79184 80 1.61047e-08 78.2091 0 76V48C0 45.7909 1.79184 44 4.00098 44H30.001C31.1053 43.9997 32.001 43.1044 32.001 42V4C32.001 1.79086 33.7918 0 36.001 0H72.001Z"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M371.001 40C396.591 40.3767 415.95 42.0001 428.335 56C439.992 69.1771 444.001 95.0002 444.001 122V199.992C444.001 202.201 442.209 204 440 204H412.001C409.792 204 408.001 202.21 408.001 200.001V126C408.001 83.0002 402.59 76.0001 371.001 76C342.591 76 334.001 83 334.001 126C334.001 150.157 334 182.038 334 200.011C334 202.22 332.21 204 330.001 204H302.001C299.792 204 298.001 202.211 298.001 200.002V122C298.001 95 300.804 69 313.667 56C326.611 42.0002 346.591 40.3767 371.001 40Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const LAYOUTS: Record<string, CompareLayout> = {
  "/compare/agentio-vs-tano": {
    slug: "compareagentiovstanoreplica",
    faqTabs: true,
    faqIds: [
      "faq.compare-agentio-01",
      "faq.compare-agentio-06",
      "faq.compare-agentio-07",
      "faq.compare-agentio-08",
      "faq.compare-agentio-09",
      "faq.compare-agentio-11",
      "faq.compare-agentio-13",
    ],
    brands: {
      slug: "compare-agentio",
      ground: "light",
      accent: "#661932",
      stat: { prefix: "+", suffix: "%", caption: "Higher CTR" },
      media: {
        live: {
          src: "/sites/tano/extras/c1cd2ee5d91ca6b52ed6360a47d27429ac6a3cdf-1240x1240.jpg",
          alt: "Bloom & Wild letterbox flowers arranged at home",
        },
        still: {
          src: "/sites/tano/extras/9599a6222987cf7e9a8ab1a02cf7c1b5a7b97314-1240x1240.jpg",
        },
        liveMark: "/sites/tano/images/tano-2.png",
        stillMark: "/sites/tano/images/tano-9.png",
      },
      ghosts: [
        "We were trying to use a traditional affiliate platform to onboard influencers, and I think we got two in a month. […] I think we got like 130 something like that in a month, which is amazing.",
        "Partnering with Tano on a hybrid model completely transformed our micro-influencer strategy.",
      ],
      quote: {
        text: "We were trying to use a traditional affiliate platform to onboard influencers, and I think we got two in a month. […] I think we got like 130 something like that in a month, which is amazing.",
        name: "Yasmin MacDonnell",
        role: "Marketing Manager · Bloom & Wild",
        caseStudy: "/case-studies/bloom-and-wild",
        portrait: {
          src: "/sites/tano/images/tano-30.jpg",
          alt: "Yasmin MacDonnell, Marketing Manager at Bloom & Wild",
        },
      },
      tabs: [
        { label: "Bloom & Wild", mark: "/sites/tano/images/tano-2.png" },
        { label: "HelloFresh", mark: "/sites/tano/images/tano-9.png" },
      ],
    },
    blocks: [
      {
        kind: "prose",
        id: "prose-ag-diff",
        title: "How are they different?",
        ground: "light",
        rows: [
          { kind: "labelled", section: 1 },
          { kind: "labelled", section: 2 },
          { kind: "labelled", section: 3 },
        ],
      },
      {
        kind: "prose",
        id: "prose-ag-choose",
        title: "Which should you choose?",
        ground: "dark",
        rows: [{ kind: "columns", sections: [4, 5], eyebrow: true }],
      },
      { kind: "comparison", section: 6, ordinal: 0, ground: "light" },
      { kind: "faq", ground: "dark" },
      { kind: "brands" },
    ],
  },
  "/compare/grin-vs-tano": {
    slug: "comparegrinvstanoreplica",
    faqIds: [
      "faq.compare-grin-01",
      "faq.compare-grin-06",
      "faq.compare-grin-07",
      "faq.compare-grin-08",
      "faq.compare-grin-09",
      "faq.compare-grin-10",
      "faq.compare-grin-11",
      "faq.compare-grin-12",
      "faq.compare-grin-13",
      "faq.compare-grin-14",
    ],
    brands: {
      slug: "compare-grin",
      ground: "dark",
      accent: "#f2c200",
      stat: { prefix: "", suffix: " / 5", caption: "Top performers in a single month" },
      media: {
        live: {
          src: "/sites/tano/extras/2450c8c48710183ec7dedfe886db57bb75b8c583-1240x1240.jpg",
          alt: "A Skin + Me prescription doser, personalised for its subscriber",
        },
        still: {
          src: "/sites/tano/extras/4775a71fa05fd8ff0180b0d9e256e7723ef0d8d7-1240x1240.jpg",
        },
        liveMark: "/sites/tano/images/tano-3.png",
        stillMark: "/sites/tano/images/tano-8.png",
      },
      ghosts: [
        "AI doesn’t replace the human; it unlocks the human.",
        "Our seeded partnership ads are delivering a 22% cheaper CPA and 34% increased ROAS versus our previous partnership ads and also versus in-house ads, they're much more efficient.",
      ],
      quote: {
        text: "AI doesn’t replace the human; it unlocks the human.",
        name: "Katie McKane",
        role: "Influencer Executive · Skin+Me",
        caseStudy: "/case-studies/skin-and-me",
        portrait: {
          src: "/sites/tano/images/tano-110.jpg",
          alt: "Katie McKane, Influencer Executive at Skin + Me",
        },
      },
      tabs: [
        { label: "Skin+Me", mark: "/sites/tano/images/tano-3.png" },
        { label: "Papier", mark: "/sites/tano/images/tano-8.png" },
      ],
    },
    blocks: [
      {
        kind: "prose",
        id: "prose-gr-p1",
        title: "Two ways to run a creator programme",
        ground: "light",
        rows: [{ kind: "columns", sections: [1, 2], eyebrow: false }],
      },
      {
        kind: "prose",
        id: "prose-gr-p2",
        title: "How are GRIN and Tano different?",
        ground: "dark",
        rows: [
          { kind: "text", section: 3, head: true },
          { kind: "text", section: 4, head: true },
          { kind: "text", section: 5, head: true },
          { kind: "text", section: 6, head: true },
        ],
      },
      { kind: "comparison", section: 7, ordinal: 0, ground: "light" },
      {
        kind: "prose",
        id: "prose-gr-p4",
        title: "Which should you choose?",
        ground: "dark",
        rows: [{ kind: "columns", sections: [8, 9], eyebrow: true }],
      },
      { kind: "faq", ground: "light" },
      { kind: "brands" },
    ],
  },
  "/compare/ltk-vs-tano": {
    slug: "compareltkvstanoreplica",
    faqIds: [
      "faq.compare-ltk-01",
      "faq.compare-ltk-07",
      "faq.compare-ltk-08",
      "faq.compare-ltk-09",
      "faq.compare-ltk-10",
      "faq.compare-ltk-11",
      "faq.compare-ltk-12",
      "faq.compare-ltk-13",
      "faq.compare-ltk-14",
    ],
    brands: {
      slug: "compare-ltk",
      ground: "light",
      accent: "#8a1c2b",
      stat: { prefix: "", suffix: "%", caption: "Lower CPA on seeded Partnership Ads" },
      media: {
        live: {
          src: "/sites/tano/extras/4775a71fa05fd8ff0180b0d9e256e7723ef0d8d7-1240x1240.jpg",
          alt: "A hand holding a Papier notebook with a sun on its cover",
        },
        still: {
          src: "/sites/tano/extras/c1cd2ee5d91ca6b52ed6360a47d27429ac6a3cdf-1240x1240.jpg",
        },
        liveMark: "/sites/tano/images/tano-8.png",
        stillMark: "/sites/tano/images/tano-2.png",
      },
      ghosts: [
        "Our seeded partnership ads are delivering a 22% cheaper CPA and 34% increased ROAS versus our previous partnership ads and also versus in-house ads, they're much more efficient.",
        "We were trying to use a traditional affiliate platform to onboard influencers, and I think we got two in a month. […] I think we got like 130 something like that in a month, which is amazing.",
      ],
      quote: {
        text: "Our seeded partnership ads are delivering a 22% cheaper CPA and 34% increased ROAS versus our previous partnership ads and also versus in-house ads, they're much more efficient.",
        name: "Amirah Hussain",
        role: "Senior Paid Social Manager · Papier",
        caseStudy: "/case-studies/papier",
        initials: "AH",
      },
      tabs: [
        { label: "Papier", mark: "/sites/tano/images/tano-8.png" },
        { label: "Bloom & Wild", mark: "/sites/tano/images/tano-2.png" },
      ],
    },
    blocks: [
      {
        kind: "prose",
        id: "prose-lt-p1",
        titleSection: 2,
        ground: "light",
        rows: [
          { kind: "labelled", section: 1 },
          { kind: "blocks", section: 2 },
        ],
      },
      {
        kind: "prose",
        id: "prose-lt-p2",
        title: "Two creator operating models",
        ground: "dark",
        rows: [{ kind: "columns", sections: [3, 4], eyebrow: true }],
      },
      { kind: "comparison", section: 5, ordinal: 0, ground: "light" },
      {
        kind: "prose",
        id: "prose-lt-p4",
        title: "Which should you choose?",
        ground: "dark",
        rows: [{ kind: "columns", sections: [6, 7], eyebrow: true }],
      },
      {
        kind: "prose",
        id: "prose-lt-p5",
        titleSection: 8,
        ground: "light",
        rows: [{ kind: "blocks", section: 8 }],
      },
      { kind: "comparison", section: 9, ordinal: 1, ground: "dark" },
      { kind: "faq", ground: "light" },
      {
        kind: "prose",
        id: "prose-lt-p8",
        titleSection: 11,
        ground: "dark",
        rows: [{ kind: "blocks", section: 11 }],
      },
      { kind: "brands" },
    ],
  },
  "/compare/shopmy-vs-tano": {
    slug: "compareshopmyvstanoreplica",
    faqIds: [
      "faq.compare-shopmy-01",
      "faq.compare-shopmy-06",
      "faq.compare-shopmy-07",
      "faq.compare-shopmy-08",
      "faq.compare-shopmy-09",
      "faq.compare-shopmy-10",
      "faq.compare-shopmy-11",
      "faq.compare-shopmy-12",
      "faq.compare-shopmy-13",
      "faq.compare-shopmy-14",
      "faq.compare-shopmy-15",
      "faq.compare-shopmy-16",
      "faq.compare-shopmy-17",
    ],
    brands: {
      slug: "compare-shopmy",
      ground: "dark",
      accent: "#f2c200",
      stat: { prefix: "", suffix: " / 5", caption: "Top performers in a single month" },
      media: {
        live: {
          src: "/sites/tano/extras/2450c8c48710183ec7dedfe886db57bb75b8c583-1240x1240.jpg",
          alt: "A Skin + Me prescription doser, personalised for its subscriber",
        },
        still: {
          src: "/sites/tano/extras/9599a6222987cf7e9a8ab1a02cf7c1b5a7b97314-1240x1240.jpg",
        },
        liveMark: "/sites/tano/images/tano-3.png",
        stillMark: "/sites/tano/images/tano-9.png",
      },
      ghosts: [
        "AI doesn’t replace the human; it unlocks the human.",
        "Partnering with Tano on a hybrid model completely transformed our micro-influencer strategy.",
      ],
      quote: {
        text: "AI doesn’t replace the human; it unlocks the human.",
        name: "Katie McKane",
        role: "Influencer Executive · Skin+Me",
        caseStudy: "/case-studies/skin-and-me",
        portrait: {
          src: "/sites/tano/images/tano-110.jpg",
          alt: "Katie McKane, Influencer Executive at Skin + Me",
        },
      },
      tabs: [
        { label: "Skin+Me", mark: "/sites/tano/images/tano-3.png" },
        { label: "HelloFresh", mark: "/sites/tano/images/tano-9.png" },
      ],
    },
    blocks: [
      {
        kind: "prose",
        id: "prose-sm-p1",
        titleSection: 3,
        ground: "light",
        rows: [
          { kind: "columns", sections: [1, 2], eyebrow: true },
          { kind: "blocks", section: 3 },
        ],
      },
      {
        kind: "prose",
        id: "prose-sm-p2",
        titleSection: 4,
        ground: "dark",
        rows: [{ kind: "blocks", section: 4 }],
      },
      { kind: "comparison", section: 5, ordinal: 0, ground: "light" },
      {
        kind: "prose",
        id: "prose-sm-p4",
        title: "Which should you choose?",
        ground: "dark",
        rows: [{ kind: "columns", sections: [6, 7], eyebrow: true }],
      },
      {
        kind: "prose",
        id: "prose-sm-p5",
        titleSection: 8,
        ground: "light",
        rows: [{ kind: "blocks", section: 8 }],
      },
      { kind: "faq", ground: "dark" },
      {
        kind: "prose",
        ground: "light",
        rows: [{ kind: "blocks", section: 10 }],
      },
      { kind: "brands" },
    ],
  },
};

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripMarkup(html: string): string {
  return decodeEntities(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")).trim();
}

type InlineFrame = {
  tag: "a" | "strong" | null;
  href?: string;
  target?: string;
  rel?: string;
  children: ReactNode[];
};

/** Renders the sanitized inline subset used by the captured prose: links and bold. */
function renderInline(html: string, keyPrefix: string): ReactNode {
  const root: InlineFrame = { tag: null, children: [] };
  const stack: InlineFrame[] = [root];
  const pattern = /<a\b([^>]*)>|<\/a>|<strong>|<\/strong>/g;
  let lastIndex = 0;
  let nodeKey = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html))) {
    const text = html.slice(lastIndex, match.index);
    if (text) {
      stack[stack.length - 1]?.children.push(decodeEntities(text));
    }
    lastIndex = pattern.lastIndex;
    const token = match[0];

    if (token === "</a>" || token === "</strong>") {
      const frame = stack.pop();
      if (!frame || frame.tag === null) {
        continue;
      }
      const key = `${keyPrefix}-${nodeKey++}`;
      if (frame.tag === "strong") {
        stack[stack.length - 1]?.children.push(<strong key={key}>{frame.children}</strong>);
      } else {
        const href = frame.href ?? "#";
        stack[stack.length - 1]?.children.push(
          href.startsWith("/") ? (
            <Link className="wire-contact-link" href={href} key={key}>
              {frame.children}
            </Link>
          ) : (
            <a
              className="wire-contact-link"
              href={href}
              key={key}
              rel={frame.rel}
              target={frame.target}
            >
              {frame.children}
            </a>
          ),
        );
      }
    } else if (token === "<strong>") {
      stack.push({ tag: "strong", children: [] });
    } else {
      const attributes = match[1] ?? "";
      stack.push({
        tag: "a",
        href: /href="([^"]*)"/.exec(attributes)?.[1] ?? "#",
        target: /target="([^"]*)"/.exec(attributes)?.[1],
        rel: /rel="([^"]*)"/.exec(attributes)?.[1],
        children: [],
      });
    }
  }

  const tail = html.slice(lastIndex);
  if (tail) {
    root.children.push(decodeEntities(tail));
  }
  return root.children;
}

const CASE_STUDY_LINKS = [
  { phrase: "Skin+Me case study", href: "/case-studies/skin-and-me" },
  { phrase: "Bloom & Wild", href: "/case-studies/bloom-and-wild" },
  { phrase: "HelloFresh", href: "/case-studies/hellofresh" },
  { phrase: "Skin+Me", href: "/case-studies/skin-and-me" },
] as const;

/** List copy lost its inline case-study anchors in the JSON capture. */
function renderListItem(item: string, keyPrefix: string): ReactNode {
  let nodes: ReactNode[] = [item];
  let linkKey = 0;

  for (const { phrase, href } of CASE_STUDY_LINKS) {
    const next: ReactNode[] = [];
    for (const node of nodes) {
      if (typeof node !== "string") {
        next.push(node);
        continue;
      }
      const parts = node.split(phrase);
      parts.forEach((part, index) => {
        if (part) {
          next.push(part);
        }
        if (index < parts.length - 1) {
          next.push(
            <Link className="wire-contact-link" href={href} key={`${keyPrefix}-${linkKey++}`}>
              {phrase}
            </Link>,
          );
        }
      });
    }
    nodes = next;
  }

  return nodes;
}

function ProseBlocks({
  blocks,
  keyPrefix,
}: {
  blocks: ReadonlyArray<CompareBlock>;
  keyPrefix: string;
}) {
  return (
    <div className="wire-article-prose">
      {blocks.map((block, index) => {
        if (block.type === "prose") {
          return (
            <p className="tano-body-para-md wire-ink-soft" key={`${keyPrefix}-${index}`}>
              {renderInline(block.html ?? "", `${keyPrefix}-${index}`)}
            </p>
          );
        }
        if (block.type === "list") {
          const items = (block.items ?? []).filter(
            (item): item is string => typeof item === "string",
          );
          const itemNodes = items.map((item, itemIndex) => (
            <li key={`${keyPrefix}-${index}-${itemIndex}`}>
              {renderListItem(item, `${keyPrefix}-${index}-${itemIndex}`)}
            </li>
          ));

          return block.ordered ? (
            <ol
              className="wire-legal-list wire-article-numbered tano-body-para-md wire-ink-soft"
              key={`${keyPrefix}-${index}`}
            >
              {itemNodes}
            </ol>
          ) : (
            <ul
              className="wire-legal-list tano-body-para-md wire-ink-soft"
              key={`${keyPrefix}-${index}`}
            >
              {itemNodes}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}

type LabelledColumn = { label: string | null; blocks: ReadonlyArray<CompareBlock> };

function splitLabelled(blocks: ReadonlyArray<CompareBlock>): ReadonlyArray<LabelledColumn> | null {
  const columns: LabelledColumn[] = [];
  let current: { label: string; blocks: CompareBlock[] } | null = null;

  for (const block of blocks) {
    const html = block.html;
    if (block.type === "prose" && html && !html.includes("<")) {
      const label = stripMarkup(html);
      if (label.length > 0 && label.length <= 24 && !/[.!?]/.test(label)) {
        if (current) {
          columns.push(current);
        }
        current = { label, blocks: [] };
        continue;
      }
    }
    if (!current) {
      return null;
    }
    current.blocks.push(block);
  }

  if (current) {
    columns.push(current);
  }

  return columns.length > 1 && columns.every((column) => column.blocks.length > 0) ? columns : null;
}

function sectionAt(page: CompareContent, index: number): CompareSection {
  const section = page.sections[index];
  if (!section) {
    throw new Error(`Missing compare section at index ${index}`);
  }
  return section;
}

function bandTitle(page: CompareContent, block: Extract<PageBlock, { kind: "prose" }>) {
  if (block.title) {
    return block.title;
  }
  if (block.titleSection !== undefined) {
    return sectionAt(page, block.titleSection).heading;
  }
  return undefined;
}

const BRAND_MARKS = {
  bloom: (
    <span
      aria-label="Bloom & Wild"
      className="hp-stat-mark"
      role="img"
      style={{
        maskImage: 'url("/brand-mark/2e92941ac79b8c30ad141495c8265df5930917fd-1400x647.svg")',
        WebkitMaskImage: 'url("/brand-mark/2e92941ac79b8c30ad141495c8265df5930917fd-1400x647.svg")',
        "--mark-optical": "1.107",
        "--mark-aspect": "2.164",
      }}
    />
  ),
  hellofresh: (
    <span
      aria-label="HelloFresh"
      className="hp-stat-mark-frame"
      role="img"
      style={{ "--mark-optical": "0.987", "--mark-aspect": "3.077" }}
    >
      <span
        className="hp-stat-mark"
        data-colour
        data-for="light"
        style={{
          backgroundImage:
            'url("/brand-mark/eb38a51363759ba206612b684fc7d888953a892f-760x247.png")',
        }}
      />
      <span
        className="hp-stat-mark"
        data-colour
        data-for="dark"
        style={{
          backgroundImage:
            'url("/brand-mark/f49bb20d04c6f37f32698eaecdcd1d3704688682-760x247.png")',
        }}
      />
    </span>
  ),
  skinme: (
    <span
      aria-label="Skin + Me"
      className="hp-stat-mark-frame"
      role="img"
      style={{ "--mark-optical": "0.742", "--mark-aspect": "5.447" }}
    >
      <span
        className="hp-stat-mark"
        data-colour
        style={{
          backgroundImage:
            'url("/brand-mark/669e03ced1a3526eec5e27862281f1969cfa8a5d-1400x257.png")',
        }}
      />
    </span>
  ),
};

function statMark(label: string) {
  if (/HelloFresh/.test(label)) {
    return BRAND_MARKS.hellofresh;
  }
  if (/Bloom\s*&\s*Wild/.test(label)) {
    return BRAND_MARKS.bloom;
  }
  if (/Skin\s*\+?\s*Me/.test(label)) {
    return BRAND_MARKS.skinme;
  }
  return null;
}

type CompareStatItem = { value: string; label: string };

function isCompareStatItem(item: BlockItem): item is CompareStatItem {
  return typeof item === "object" && "value" in item && "label" in item;
}

function Hero({ page }: { page: CompareContent }) {
  const { hero } = page;
  const statsSection = page.sections.find((section) => section.variant === "hero-stats");
  const stats = statsSection?.blocks.find((block) => block.type === "stats");
  const statItems = (stats?.items ?? []).filter(isCompareStatItem);
  const colon = hero.title.indexOf(": ");
  const titleParts =
    colon === -1 ? [hero.title] : [hero.title.slice(0, colon + 1), hero.title.slice(colon + 2)];

  return (
    <UseCaseHero
      actions={hero.actions}
      paragraphs={hero.paragraphs}
      proof={
        <>
          <StatDefs />
          {statItems.length ? (
            <StatGroup label={statsSection?.heading ?? ""}>
              {statItems.map((item, index) => (
                <StatItem
                  caption={item.label}
                  delayMs={index * 90}
                  key={`${item.value}-${index}`}
                  value={item.value}
                >
                  {statMark(item.label)}
                </StatItem>
              ))}
            </StatGroup>
          ) : null}
        </>
      }
      titleLines={titleParts}
    />
  );
}

function ProseRowView({
  page,
  row,
  sectionIndex,
}: {
  page: CompareContent;
  row: ProseRow;
  sectionIndex: number;
}) {
  if (row.kind === "labelled") {
    const section = sectionAt(page, row.section);
    const columns = splitLabelled(section.blocks) ?? [{ label: null, blocks: section.blocks }];
    return (
      <div className="hp-prose-row">
        {section.eyebrow || section.heading ? (
          <div className="hp-prose-row-head">
            {section.eyebrow ? (
              <p className="tano-body-mono-sm wire-ink-soft">{section.eyebrow}</p>
            ) : null}
            {section.heading ? <h3 className="tano-heading-md">{section.heading}</h3> : null}
          </div>
        ) : null}
        <div className="hp-prose-columns" data-split>
          {columns.map((column, index) => (
            <div className="hp-prose-column" data-card key={`${sectionIndex}-${index}`}>
              {column.label ? (
                <p className="tano-body-mono-xs wire-ink-soft">{column.label}</p>
              ) : null}
              <ProseBlocks blocks={column.blocks} keyPrefix={`${sectionIndex}-${index}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (row.kind === "columns") {
    return (
      <div className="hp-prose-row">
        <div className="hp-prose-columns" data-split>
          {row.sections.map((sectionIndexValue, index) => {
            const section = sectionAt(page, sectionIndexValue);
            return (
              <div className="hp-prose-column" data-card key={`${sectionIndexValue}-${index}`}>
                {row.eyebrow && section.eyebrow ? (
                  <p className="tano-body-mono-xs wire-ink-soft">{section.eyebrow}</p>
                ) : null}
                {section.heading ? <h3 className="tano-heading-sm">{section.heading}</h3> : null}
                <ProseBlocks blocks={section.blocks} keyPrefix={`${sectionIndexValue}`} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const section = sectionAt(page, row.section);
  return (
    <div className="hp-prose-row">
      {row.kind === "text" && row.head && (section.eyebrow || section.heading) ? (
        <div className="hp-prose-row-head">
          {section.eyebrow ? (
            <p className="tano-body-mono-sm wire-ink-soft">{section.eyebrow}</p>
          ) : null}
          {section.heading ? <h3 className="tano-heading-md">{section.heading}</h3> : null}
        </div>
      ) : null}
      <div className="hp-prose-columns">
        <div className="hp-prose-column">
          <ProseBlocks blocks={section.blocks} keyPrefix={`${sectionIndex}`} />
        </div>
      </div>
    </div>
  );
}

function ProseBand({
  page,
  block,
}: {
  page: CompareContent;
  block: Extract<PageBlock, { kind: "prose" }>;
}) {
  const title = bandTitle(page, block);
  return (
    <section
      aria-labelledby={title ? block.id : undefined}
      className="hp-band"
      data-ground={block.ground}
      data-ground-dark={block.ground === "dark" ? true : undefined}
      data-padding="xl"
    >
      <div className="hp-container hp-prose">
        {title && block.id ? (
          <BandHeading titleId={block.id}>
            <span className="hp-title-words">{title}</span>
          </BandHeading>
        ) : null}
        <div className="hp-prose-rows">
          {block.rows.map((row, index) => (
            <ProseRowView
              key={`${block.id ?? "prose"}-${index}`}
              page={page}
              row={row}
              sectionIndex={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection({
  section,
  ordinal,
  ground,
}: {
  section: CompareSection;
  ordinal: number;
  ground: Ground;
}) {
  const table = section.blocks.find((block) => block.type === "table");
  const head = table?.head;
  const rows = table?.rows;
  if (!head || !rows) {
    return null;
  }
  const headingId = ordinal === 0 ? "comparison-title" : `comparison-title-${ordinal + 1}`;
  const caption = `${head[1] ?? "Tano"}, Tano compared`;

  return (
    <section
      aria-labelledby={headingId}
      className="hp-band"
      data-ground={ground}
      data-ground-dark={ground === "dark" ? true : undefined}
      data-padding="xl"
    >
      <div className="hp-container hp-comparison">
        <BandHeading
          align="start"
          cue
          cueText="Swipe to see how they compare →"
          titleId={headingId}
          actions={<ButtonLink href={"/talk-to-us"} label={"Get started"} />}
        >
          <span className="hp-title-words">{section.heading}</span>
        </BandHeading>
        <div
          className="hp-reveal hp-comparison-card"
          data-rv-skip
          data-shown="false"
          style={{ "--hp-reveal-delay": "60ms" }}
        >
          <div aria-label="Comparison table" className="hp-comparison-scroll" role="region">
            <table className="hp-table">
              <caption className="wire-visually-hidden">{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="wire-visually-hidden">Attribute</span>
                  </th>
                  <th className="hp-table-head tano-body-md" data-highlight="false" scope="col">
                    {head[1]}
                  </th>
                  <th className="hp-table-head tano-body-md" data-highlight="true" scope="col">
                    <span className="wire-visually-hidden">Tano</span>
                    {TANO_WORDMARK}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => {
                  const [label, ...cells] = row;
                  return (
                    <tr key={`${headingId}-${rowIndex}`}>
                      <th className="hp-table-label tano-body-md" scope="row">
                        {label}
                      </th>
                      {cells.map((cell, cellIndex) => (
                        <td
                          className="tano-body-md"
                          data-highlight={cellIndex === 0 ? "false" : "true"}
                          key={`${headingId}-${rowIndex}-${cellIndex}`}
                        >
                          <span className="hp-table-answer">
                            <span className="hp-table-cell">{cell}</span>
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function compareClosingLines(title: string): string[] {
  const trimmed = title.trim().replace(/\.$/, "");
  const splitAt = trimmed.lastIndexOf(" your ");
  if (splitAt === -1) return [title];
  return [trimmed.slice(0, splitAt), `${trimmed.slice(splitAt + 1)}.`];
}

/**
 * One compare detail page. Copy comes from each route's JSON; the layout map
 * below supplies only ordering, grounds and the bands the capture did not
 * extract (band headings and the brand quote carousel).
 */
export function CompareTemplate({ page }: { page: CompareContent }) {
  const layout = LAYOUTS[page.route];
  if (!layout) {
    throw new Error(`No compare layout for ${page.route}`);
  }
  const quoteTitle =
    page.sections.find((section) => section.variant === "quote")?.heading ?? "In their words.";
  const faqSection = page.sections.find((section) => section.variant === "faq");
  const faqIntro = faqSection?.blocks.find((block) => block.type === "prose" && block.html);

  return (
    <PageShell>
      <main id="main">
        <Hero page={page} />
        {layout.blocks.map((block, index) => {
          if (block.kind === "prose") {
            return <ProseBand block={block} key={`prose-${index}`} page={page} />;
          }
          if (block.kind === "comparison") {
            return (
              <ComparisonSection
                ground={block.ground}
                key={`comparison-${index}`}
                ordinal={block.ordinal}
                section={sectionAt(page, block.section)}
              />
            );
          }
          if (block.kind === "faq") {
            return (
              <FaqSection
                ground={block.ground}
                heading={<span className="hp-title-words">{faqSection?.heading}</span>}
                intro={faqIntro?.html ? stripMarkup(faqIntro.html) : undefined}
                key={`faq-${index}`}
                rows={(page.faq ?? []).map((item, rowIndex) => ({
                  id: layout.faqIds[rowIndex] ?? `faq-${rowIndex}`,
                  question: item.q,
                  answer: item.a,
                }))}
                tabs={
                  layout.faqTabs
                    ? [
                        { id: "faq-tab-start", label: "Getting started" },
                        { id: "faq-tab-results", label: "Content and results" },
                      ]
                    : undefined
                }
              />
            );
          }
          const brand = layout.brands;
          return (
            <BrandQuoteBand
              accent={brand.accent}
              ghosts={brand.ghosts}
              ground={brand.ground}
              heading={quoteTitle}
              key={`brands-${index}`}
              media={{
                live: brand.media.live,
                liveMark: brand.media.liveMark,
                still: { alt: "", src: brand.media.still.src },
                stillMark: brand.media.stillMark,
              }}
              quote={brand.quote}
              stat={brand.stat}
              tabs={brand.tabs}
            />
          );
        })}
        {page.closing ? (
          <ClosingBand
            body={page.closing.body}
            cta={page.closing.cta}
            lines={compareClosingLines(page.closing.title)}
          />
        ) : null}
      </main>
    </PageShell>
  );
}
