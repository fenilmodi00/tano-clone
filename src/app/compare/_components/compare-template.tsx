import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { FaqRow } from "@/components/ui/faq-row";
import { ButtonLink } from "@/components/ui/button";
import { PageEffects } from "@/app/_runtime/page-effects";

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

const GLOW = (
  <div aria-hidden="true" className="hp-hero-glow">
    <div className="hp-hero-glow-light">
      <div className="wire-spectrum-drift" />
      <div className="hp-hero-glow-folds" data-layer="a" />
      <div className="hp-hero-glow-folds" data-layer="b" />
    </div>
  </div>
);

const STAT_DEFS = (
  <svg aria-hidden="true" className="hp-stat-defs" focusable="false">
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="hp-stat-spectrum"
        x1={0}
        x2={321}
        y1={0}
        y2={0}
      >
        <stop offset="8.65%" stopColor="var(--spectrum-yellow)" />
        <stop offset="30.77%" stopColor="var(--spectrum-lime)" />
        <stop offset="58.65%" stopColor="var(--spectrum-cyan)" />
        <stop offset="79.33%" stopColor="var(--spectrum-violet)" />
        <stop offset="100%" stopColor="var(--spectrum-magenta)" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="hp-stat-spectrum-warm"
        x1={0}
        x2={321}
        y1={0}
        y2={0}
      >
        <stop offset="0%" stopColor="var(--spectrum-orange)" />
        <stop offset="22%" stopColor="var(--spectrum-yellow)" />
        <stop offset="44%" stopColor="var(--spectrum-lime)" />
        <stop offset="70%" stopColor="var(--spectrum-cyan)" />
        <stop offset="100%" stopColor="var(--spectrum-violet)" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="hp-stat-spectrum-up"
        x1={0}
        x2={0}
        y1={0}
        y2={105}
      >
        <stop offset="0%" stopColor="var(--spectrum-violet)" />
        <stop offset="100%" stopColor="var(--spectrum-cyan)" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="hp-stat-spectrum-ring"
        x1={0}
        x2={0}
        y1={20}
        y2={100}
      >
        <stop offset="0%" stopColor="var(--spectrum-magenta)" />
        <stop offset="100%" stopColor="var(--spectrum-violet)" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="hp-stat-falloff"
        x1={0}
        x2={0}
        y1={10}
        y2={105}
      >
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
      </linearGradient>
      <mask id="hp-stat-falloff-mask">
        <rect fill="url(#hp-stat-falloff)" height={117} width={321} x={0} y={0} />
      </mask>
    </defs>
  </svg>
);

const SEARCH_ICON = (
  <span aria-hidden="true" className="hp-faq-search-icon">
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="100%"
      viewBox="0 0 14 14"
      width="100%"
    >
      <path
        clipRule="evenodd"
        d="M2 6C2 3.79086 3.79086 2 6 2C8.20914 2 10 3.79086 10 6C10 8.20914 8.20914 10 6 10C3.79086 10 2 8.20914 2 6ZM6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12C7.29578 12 8.49562 11.5892 9.47642 10.8908L12.2929 13.7073C12.6834 14.0978 13.3166 14.0978 13.7071 13.7073C14.0976 13.3168 14.0976 12.6836 13.7071 12.2931L10.8907 9.47665C11.5892 8.49581 12 7.29588 12 6C12 2.68629 9.31371 0 6 0Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  </span>
);

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

const ABSOLUTE_IMAGE_STYLE: CSSProperties = {
  position: "absolute",
  height: "100%",
  width: "100%",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  color: "transparent",
};

const CLOSING_GLYPH_PATH =
  "M88.0338 4.00741C94.2708 -1.07111 103.169 -0.35695 113.68 0.954679C124.143 2.59856 132.893 4.37172 137.492 10.9771C142.074 17.5585 141.747 29.3607 140.316 40.69C140.299 40.7994 139.455 46.8137 138.263 55.3068C138.066 56.7112 139.348 57.871 140.72 57.5277C158.642 53.0441 177.219 48.3977 177.41 48.3473C188.497 45.7363 200.169 44.1752 207.176 48.0563C214.209 51.9519 216.882 60.4922 219.606 70.7545C222.006 81.0979 223.645 89.8961 219.26 96.6461C214.89 103.371 203.853 107.488 192.84 110.402C192.649 110.447 174.818 114.9 157.244 119.29C155.723 119.67 155.214 121.579 156.341 122.67C167.99 133.945 178.721 144.331 178.849 144.452C186.933 152.496 194.438 161.595 194.868 169.61C195.3 177.654 189.494 184.452 182.258 192.207C174.781 199.728 168.207 205.784 160.174 205.632C152.17 205.48 142.84 198.277 134.54 190.458C134.357 190.276 110.985 167.638 95.749 152.879C94.8364 151.995 93.3481 152.183 92.6759 153.262C82.6871 169.296 72.0716 186.34 71.965 186.516C65.798 196.117 58.4822 205.369 50.7527 207.458C42.9946 209.554 35.1552 205.272 26.0855 199.788C17.1935 194.019 9.91902 188.831 8.39701 180.922C6.88068 173.04 11.9679 162.392 17.8709 152.626C18.0005 152.424 32.9447 128.454 44.0686 110.613C44.5958 109.767 44.4196 108.663 43.6575 108.022C30.5698 97.0155 17.998 86.4428 17.8505 86.3219C9.2263 78.8625 1.10598 70.3116 0.119118 62.3463C-0.871353 54.3518 4.44807 47.1643 11.1271 38.9225C18.0624 30.8963 24.1984 24.3953 32.2226 23.985C40.2175 23.5762 50.0271 30.1093 58.8513 37.3297C58.9474 37.4127 64.3671 41.9737 71.7693 48.2037C72.9695 49.2138 74.8114 48.5053 75.0292 46.9494C76.2575 38.1756 77.1354 31.9084 77.1505 31.7897C78.8896 20.5037 81.8197 9.06748 88.0338 4.00741Z";

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

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <div className="hp-band-heading" data-align="start">
      <div className="hp-band-heading-copy">
        <h2 className="hp-title tano-display-xs" id={id}>
          <span className="hp-title-words">{title}</span>
        </h2>
      </div>
    </div>
  );
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

type StatItem = { value: string; label: string };

function isStatItem(item: BlockItem): item is StatItem {
  return typeof item === "object" && "value" in item && "label" in item;
}

function Hero({ page }: { page: CompareContent }) {
  const { hero } = page;
  const statsSection = page.sections.find((section) => section.variant === "hero-stats");
  const stats = statsSection?.blocks.find((block) => block.type === "stats");
  const statItems = (stats?.items ?? []).filter(isStatItem);
  const colon = hero.title.indexOf(": ");
  const titleParts =
    colon === -1 ? [hero.title] : [hero.title.slice(0, colon + 1), hero.title.slice(colon + 2)];

  return (
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
            {titleParts.map((part) => (
              <span className="hp-title-words" key={part}>
                {part}
              </span>
            ))}
          </h1>
          {hero.paragraphs.map((paragraph) => (
            <p className="hp-uc-hero-sub tano-body-para-md" key={paragraph}>
              {paragraph}
            </p>
          ))}
          <div className="hp-uc-hero-actions">
            {hero.actions.map((action, index) => (
              <ButtonLink
                href={action.href}
                icon={index === 0 ? undefined : false}
                key={`${action.href}-${action.label}`}
                label={action.label}
                variant={index === 0 ? undefined : "secondary"}
              />
            ))}
          </div>
        </div>
        <div className="hp-uc-hero-proof">
          {STAT_DEFS}
          {statItems.length ? (
            <div className="hp-stat-group">
              <p className="hp-stat-group-label tano-body-mono-sm">{statsSection?.heading}</p>
              <ul className="hp-stat-row">
                {statItems.map((item, index) => (
                  <li
                    className="hp-reveal hp-stat"
                    data-rv-skip
                    data-shown="false"
                    key={`${item.value}-${index}`}
                    style={{ "--hp-reveal-delay": `${index * 90}ms` }}
                  >
                    <div className="hp-stat-head">{statMark(item.label)}</div>
                    <span className="hp-stat-value tano-heading-lg">
                      <span aria-hidden="true">{item.value}</span>
                      <span className="wire-visually-hidden">{item.value}</span>
                    </span>
                    <p className="hp-stat-caption hp-sub tano-body-md">{item.label}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
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
        {title && block.id ? <SectionHeading id={block.id} title={title} /> : null}
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
        <div className="hp-band-heading" data-align="start" data-cue>
          <div className="hp-band-heading-copy">
            <h2 className="hp-title tano-display-xs" id={headingId}>
              <span className="hp-title-words">{section.heading}</span>
            </h2>
          </div>
          <div className="hp-band-actions">
            <ButtonLink href={"/talk-to-us"} label={"Get started"} />
          </div>
          <p aria-hidden="true" className="hp-swipe-cue tano-body-sm">
            Swipe to see how they compare →
          </p>
        </div>
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

function FaqSection({
  page,
  ground,
  tabs,
  ids,
}: {
  page: CompareContent;
  ground: Ground;
  tabs?: boolean;
  ids: ReadonlyArray<string>;
}) {
  const faqSection = page.sections.find((section) => section.variant === "faq");
  const intro = faqSection?.blocks.find((block) => block.type === "prose" && block.html);
  const items = page.faq ?? [];

  return (
    <section
      aria-labelledby="faq-title"
      className="hp-band"
      data-ground={ground}
      data-ground-dark={ground === "dark" ? true : undefined}
      data-padding="xl"
    >
      <div className="hp-container hp-faq">
        <div className="hp-faq-head">
          <div className="hp-band-heading" data-align="start">
            <div className="hp-band-heading-copy">
              <h2 className="hp-title tano-display-xs" id="faq-title">
                <span className="hp-title-words">{faqSection?.heading}</span>
              </h2>
              {intro && intro.html ? (
                <p className="hp-sub tano-body-para-md">{stripMarkup(intro.html)}</p>
              ) : null}
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
                {SEARCH_ICON}
                <input
                  autoComplete="off"
                  className="hp-faq-search-input tano-body-md"
                  defaultValue=""
                  enterKeyHint="search"
                  id="faq-search"
                  placeholder="Search questions"
                  type="search"
                />
              </div>
              {tabs ? (
                <div
                  aria-label="Question topics"
                  className="hp-faq-tabs"
                  data-searching="false"
                  role="tablist"
                >
                  <button
                    aria-controls="faq-panel"
                    aria-selected="true"
                    className="hp-faq-tab tano-body-sm"
                    data-active="true"
                    id="faq-tab-start"
                    role="tab"
                    tabIndex={0}
                    type="button"
                  >
                    Getting started
                  </button>
                  <button
                    aria-controls="faq-panel"
                    aria-selected="false"
                    className="hp-faq-tab tano-body-sm"
                    data-active="false"
                    id="faq-tab-results"
                    role="tab"
                    tabIndex={-1}
                    type="button"
                  >
                    Content and results
                  </button>
                </div>
              ) : null}
            </div>
            <p aria-live="polite" className="wire-visually-hidden" />
            {tabs ? (
              <div aria-labelledby="faq-tab-start" id="faq-panel" role="tabpanel">
                <ul className="hp-faq-rows">
                  {items.map((item, index) => (
                    <FaqRow
                      answer={item.a}
                      id={ids[index] ?? `faq-${index}`}
                      key={item.q}
                      question={item.q}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <div id="faq-panel">
                <ul className="hp-faq-rows">
                  {items.map((item, index) => (
                    <FaqRow
                      answer={item.a}
                      id={ids[index] ?? `faq-${index}`}
                      key={item.q}
                      question={item.q}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <blockquote className="hp-brand-quote hp-brand-quote-live tano-heading-md" data-reduced="false">
      <span aria-hidden="true" className="hp-brand-word hp-brand-quote-mark">
        “
      </span>
      {words.map((word, index) => (
        <span
          className="hp-brand-word"
          key={`${word}-${index}`}
          style={{ "--d": `${(index + 1) * 40}ms` }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
      <span
        aria-hidden="true"
        className="hp-brand-word hp-brand-quote-mark"
        style={{ "--d": `${(words.length + 1) * 40}ms` }}
      >
        ”
      </span>
    </blockquote>
  );
}

function BrandStripSection({ brand, title }: { brand: BrandStrip; title: string }) {
  const panelId = `${brand.slug}-brand-panel`;

  return (
    <section
      aria-labelledby="brands-title"
      className="hp-band hp-brands-band"
      data-ground={brand.ground}
      data-ground-dark={brand.ground === "dark" ? true : undefined}
      data-padding="xl"
      style={{ "--hp-accent": brand.accent }}
    >
      <div className="hp-container hp-brands">
        <div>
          <div className="hp-band-heading" data-align="centre">
            <div className="hp-band-heading-copy">
              <h2 className="hp-title tano-display-xs" id="brands-title">
                <span className="hp-title-words">{title}</span>
              </h2>
            </div>
          </div>
        </div>
        <div
          className="hp-reveal"
          data-rv-skip
          data-shown="false"
          style={{ "--hp-reveal-delay": "140ms" }}
        >
          <div className="hp-brand-stage" data-rv-skip>
            <div className="hp-brand-media hp-behind wire-glass-edge" data-rim="true">
              <span aria-hidden="true" className="wire-glass-sheen" />
              <img
                alt={brand.media.live.alt}
                className="hp-brand-shot"
                data-live="true"
                decoding="async"
                loading="lazy"
                src={brand.media.live.src}
                style={ABSOLUTE_IMAGE_STYLE}
              />
              <img
                alt=""
                aria-hidden="true"
                className="hp-brand-shot"
                data-live="false"
                decoding="async"
                loading="lazy"
                src={brand.media.still.src}
                style={ABSOLUTE_IMAGE_STYLE}
              />
              <span aria-hidden="true" className="hp-brand-media-dim" />
              <img
                alt=""
                aria-hidden="true"
                className="hp-brand-media-mark"
                data-live="true"
                decoding="async"
                height={80}
                loading="lazy"
                src={brand.media.liveMark}
                style={{ color: "transparent" }}
                width={200}
              />
              <img
                alt=""
                aria-hidden="true"
                className="hp-brand-media-mark"
                data-live="false"
                decoding="async"
                height={80}
                loading="lazy"
                src={brand.media.stillMark}
                style={{ color: "transparent" }}
                width={200}
              />
            </div>
            <div
              aria-labelledby={`${panelId}-tab-0`}
              className="hp-brand-card"
              data-fading="false"
              id={panelId}
              role="tabpanel"
              tabIndex={-1}
            >
              <div className="hp-brand-top">
                <div className="hp-brand-stat-row">
                  <span aria-hidden="true" className="hp-brand-stat-rule" />
                  <p className="hp-brand-figure">
                    <span className="hp-brand-stat tano-display-xs">
                      {brand.stat.prefix}
                      <span className="hp-brand-stat-digits">0</span>
                      {brand.stat.suffix}
                    </span>
                    <span className="hp-brand-caption tano-heading-mono-xs">
                      {brand.stat.caption}
                    </span>
                  </p>
                </div>
                <div className="hp-brand-quote-slot">
                  {brand.ghosts.map((ghost) => (
                    <p
                      aria-hidden="true"
                      className="hp-brand-quote hp-brand-quote-ghost tano-heading-md"
                      key={ghost}
                    >
                      “{ghost}”
                    </p>
                  ))}
                  <QuoteWords text={brand.quote.text} />
                </div>
              </div>
              <div className="hp-brand-foot">
                <span className="hp-brand-who">
                  {brand.quote.initials ? (
                    <span aria-hidden="true" className="hp-brand-portrait" data-initials="true">
                      {brand.quote.initials}
                    </span>
                  ) : (
                    <span className="hp-brand-portrait" data-initials="false">
                      <img
                        alt={brand.quote.portrait?.alt ?? brand.quote.name}
                        decoding="async"
                        height={96}
                        loading="lazy"
                        src={brand.quote.portrait?.src}
                        style={{ color: "transparent" }}
                        width={96}
                      />
                    </span>
                  )}
                  <span className="hp-brand-who-name">
                    <span className="tano-body-md">{brand.quote.name}</span>
                    <span className="hp-sub tano-body-sm">{brand.quote.role}</span>
                  </span>
                </span>
                <ButtonLink href={brand.quote.caseStudy} label={"Read the case study"} />
              </div>
            </div>
          </div>
        </div>
        <div
          className="hp-reveal hp-brand-bar-reveal"
          data-rv-skip
          data-shown="false"
          style={{ "--hp-reveal-delay": "200ms" }}
        >
          <div aria-label="Choose a brand" className="hp-brand-bar" role="tablist">
            {brand.tabs.map((tab, index) => (
              <button
                aria-controls={panelId}
                aria-selected={index === 0}
                className="hp-brand-tab"
                data-active={index === 0}
                id={`${panelId}-tab-${index}`}
                key={tab.label}
                role="tab"
                tabIndex={index === 0 ? 0 : -1}
                type="button"
              >
                <span aria-hidden="true" className="hp-brand-tab-rule">
                  {index === 0 ? (
                    <span
                      className="hp-brand-tab-fill"
                      data-paused="true"
                      style={{
                        "--hp-brand-duration": "6000ms",
                        "--hp-brand-count": 2,
                        "--hp-brand-index": 0,
                      }}
                    />
                  ) : null}
                </span>
                <span className="hp-brand-tab-mark-box">
                  <img
                    alt={tab.label}
                    className="hp-brand-tab-mark"
                    decoding="async"
                    height={40}
                    loading="lazy"
                    src={tab.mark}
                    style={{ color: "transparent" }}
                    width={160}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingSection({ page, slug }: { page: CompareContent; slug: string }) {
  const closing = page.closing;
  if (!closing) {
    return null;
  }
  const trimmedTitle = closing.title.trim().replace(/\.$/, "");
  const splitAt = trimmedTitle.lastIndexOf(" your ");
  const lines =
    splitAt === -1
      ? [closing.title]
      : [trimmedTitle.slice(0, splitAt), `${trimmedTitle.slice(splitAt + 1)}.`];

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
                    loading="lazy"
                    src="/sites/tano/images/tano-123.jpg"
                    style={ABSOLUTE_IMAGE_STYLE}
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
                      decoding="async"
                      height={72}
                      loading="lazy"
                      src="/sites/tano/images/tano-94.jpg"
                      style={{ color: "transparent" }}
                      width={72}
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
                    overflow="visible"
                    viewBox="0 0 222 208"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient
                        cx={0}
                        cy={0}
                        gradientTransform="matrix(-73.3295 -212.012 181.351 -72.7727 153.8000 189.9900)"
                        gradientUnits="userSpaceOnUse"
                        id={`tano-glyph-spectrum-${slug}-1`}
                        r={1}
                      >
                        <stop offset={0} stopColor="var(--spectrum-cyan, #46b7d1)" />
                        <stop offset="0.5" stopColor="var(--spectrum-magenta, #cc6add)" />
                        <stop offset={1} stopColor="var(--spectrum-orange, #fb751f)" />
                      </radialGradient>
                    </defs>
                    <path d={CLOSING_GLYPH_PATH} fill={`url(#tano-glyph-spectrum-${slug}-1)`} />
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
                        decoding="async"
                        height={48}
                        loading="lazy"
                        src="/sites/tano/images/tano-94.jpg"
                        style={{ color: "transparent" }}
                        width={48}
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
                    overflow="visible"
                    viewBox="0 0 222 208"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient
                        cx={0}
                        cy={0}
                        gradientTransform="matrix(-73.3295 -212.012 181.351 -72.7727 153.8000 189.9900)"
                        gradientUnits="userSpaceOnUse"
                        id={`tano-glyph-spectrum-${slug}-2`}
                        r={1}
                      >
                        <stop offset={0} stopColor="var(--spectrum-cyan, #46b7d1)" />
                        <stop offset="0.5" stopColor="var(--spectrum-magenta, #cc6add)" />
                        <stop offset={1} stopColor="var(--spectrum-orange, #fb751f)" />
                      </radialGradient>
                    </defs>
                    <path d={CLOSING_GLYPH_PATH} fill={`url(#tano-glyph-spectrum-${slug}-2)`} />
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
                        id={`hp-camp-metric-${slug}`}
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
                      stroke={`url(#hp-camp-metric-${slug})`}
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
                      stroke={`url(#hp-camp-metric-${slug})`}
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
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
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

  return (
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
              ids={layout.faqIds}
              key={`faq-${index}`}
              page={page}
              tabs={layout.faqTabs}
            />
          );
        }
        return (
          <BrandStripSection brand={layout.brands} key={`brands-${index}`} title={quoteTitle} />
        );
      })}
      <ClosingSection page={page} slug={layout.slug} />
      <PageEffects />
    </main>
  );
}
