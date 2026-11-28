import type { ReactNode } from "react";

/**
 * Case-study banner inventory, derived from the captured `.wire-case-banners`
 * decks (home, the four detail pages, news) and the case-studies index cards.
 *
 * `accent` is brand-specific and is written to `--case-accent`; it matches the
 * index cards' `--cg-accent` and every captured banner. `data-hue` is
 * slot-positional in the source (slot 0 cyan, slot 1 violet, slot 2 lime) and
 * `data-accent` overrides it visually. Each brand carries the hue it has in
 * the home deck; Papier, absent from home, carries the lime it has in every
 * detail deck. Callers may override `hue`/`stats`/`level` when composing a deck.
 */

export type CaseStudyStat = {
  value: string;
  caption: string;
};

export type CaseStudyMark = {
  /** `aria-label` on the mask span. */
  label: string;
  /** Light-ground mask, written as `--mark-src`. */
  src: string;
  /** Dark-ground mask; falls back to `src` when omitted. */
  srcDark?: string;
  /** Source `--mark-aspect`, preserved as a string for verbatim CSS output. */
  aspect: string;
  /** Source `--mark-optical`, preserved as a string for verbatim CSS output. */
  optical: string;
};

/**
 * Broad item accepted by `CaseBannerDeck`, covering the brand cards and the
 * news banner variant. Optional facets are omitted from the DOM when absent
 * (`data-accent`/`--case-accent`, mark, stat strip).
 */
export type CaseBannerItem = {
  /** Route slug, e.g. `skin-and-me`. */
  key: string;
  /** Title link text. */
  title: string;
  href: string;
  /** Source `data-hue`. */
  hue: string;
  /** Source `--case-accent`; omit on the news card. */
  accent?: string;
  /**
   * News resource meta, rendered inside `.wire-case-copy` before the heading.
   * Pass a `<span>`/`<time>` fragment to match the captured news markup.
   */
  meta?: ReactNode;
  mark?: CaseStudyMark;
  stats?: readonly CaseStudyStat[];
  /** Heading level; defaults to 3. */
  level?: 2 | 3;
  /** Button label; defaults to "Read the case study". */
  actionLabel?: string;
  photoSrc: string;
  /** Alt text for the captured brand photo. */
  photoAlt?: string;
  /** Foot/body copy; the case-studies index version, identical in each deck. */
  foot: string;
};

/** A complete brand card from the case-study detail decks. */
export type CaseStudy = CaseBannerItem & {
  accent: string;
  mark: CaseStudyMark;
  stats: CaseStudyStat[];
  level: 3;
};

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    key: "skin-and-me",
    title: "How Skin+Me unlocked acquisition with overlooked creators",
    href: "/case-studies/skin-and-me",
    accent: "#f2c200",
    hue: "cyan",
    photoSrc: "/sites/tano/extras/2450c8c48710183ec7dedfe886db57bb75b8c583-1240x1240.jpg",
    photoAlt: "A Skin + Me prescription doser, personalised for its subscriber",
    mark: {
      label: "Skin+Me logo",
      src: "/sites/tano/images/tano-3.png",
      srcDark: "/sites/tano/images/tano-3.png",
      aspect: "5.430948419301164",
      optical: "0.743",
    },
    level: 3,
    foot: "Tano finds creators beyond Skin+Me’s usual profile, giving Katie more time to build ambassador relationships.",
    stats: [
      {
        value: "4 / 5",
        caption: "Top performers discovered and onboarded by Tano in a single month",
      },
    ],
  },
  {
    key: "hellofresh",
    title: "How HelloFresh lifted CVR 93% with a hybrid creator model",
    href: "/case-studies/hellofresh",
    accent: "#8bc220",
    hue: "lime",
    photoSrc: "/sites/tano/extras/9599a6222987cf7e9a8ab1a02cf7c1b5a7b97314-1240x1240.jpg",
    photoAlt: "A HelloFresh recipe box with the week’s ingredients",
    mark: {
      label: "HelloFresh logo",
      src: "/sites/tano/images/tano-9.png",
      srcDark: "/sites/tano/extras/d3a2cb0ec3e50f7e894dbd640373fe6fa3b2e58c-760x247.png",
      aspect: "3.076923076923077",
      optical: "0.987",
    },
    level: 3,
    foot: "Recipe boxes at national scale. HelloFresh needed more creator outreach without more manual work.",
    stats: [
      {
        value: "+93%",
        caption: "Uplift in CVR vs running the programme internally",
      },
    ],
  },
  {
    key: "bloom-and-wild",
    title: "How Bloom & Wild made creators a revenue channel",
    href: "/case-studies/bloom-and-wild",
    accent: "#661932",
    hue: "violet",
    photoSrc: "/sites/tano/extras/c1cd2ee5d91ca6b52ed6360a47d27429ac6a3cdf-1240x1240.jpg",
    photoAlt: "Bloom & Wild letterbox flowers arranged at home",
    mark: {
      label: "Bloom & Wild logo",
      src: "/sites/tano/images/tano-2.png",
      srcDark: "/sites/tano/extras/4157105a5b600dfe1d7e18c844f2d3fe79c63264-1560x725.png",
      aspect: "2.1517241379310343",
      optical: "1.181",
    },
    level: 3,
    foot: "Creator partnerships drive monthly revenue across brands and markets.",
    stats: [
      { value: "+125%", caption: "Higher CTR" },
      { value: "−10%", caption: "Lower CPA" },
    ],
  },
  {
    key: "papier",
    title: "How Papier cut CPA by 22%",
    href: "/case-studies/papier",
    accent: "#8a1c2b",
    hue: "lime",
    photoSrc: "/sites/tano/extras/4775a71fa05fd8ff0180b0d9e256e7723ef0d8d7-1240x1240.jpg",
    photoAlt: "A hand holding a Papier notebook with a sun on its cover",
    mark: {
      label: "Papier logo",
      src: "/sites/tano/images/tano-8.png",
      srcDark: "/sites/tano/extras/a14f4dde8bc9af1a8f4b4df200a18b5e8716f3c3-1146x240.png",
      aspect: "4.775",
      optical: "0.793",
    },
    level: 3,
    foot: "Seeded creator content outperformed Papier’s other Meta Partnership Ads.",
    stats: [
      {
        value: "22%",
        caption: "Lower CPA – seeded creator content vs Papier’s other Meta Partnership Ads",
      },
      {
        value: "34%",
        caption: "Higher ROAS – seeded creator content vs Papier’s other Meta Partnership Ads",
      },
    ],
  },
];

export function getOtherCaseStudies(key: string): CaseStudy[] {
  return CASE_STUDIES.filter((study) => study.key !== key);
}
