/**
 * Owner: HomeMedia. Captured from the live home page at 1568x900.
 *
 * The live DOM ships two marquee bands. The "As featured in" band contains the
 * five press marks below; at 1568px the source MarkMarquee appends a third copy
 * of that five-mark set (3 x 5 = 15 `.wire-cases-mark` nodes). The replica SSR
 * ships two copies (10); `home/media-sections.tsx` recreates the source copy
 * math from this set, so the same viewport reaches 15 without duplicating data.
 *
 * All masks resolve to local `/brand-mark/...` files. `aspect` and
 * `opticalScale` are the values the source writes inline as `--mark-aspect`,
 * `--mark-width` and `height: calc(var(--mark-base) * ...)`.
 */

export type HomeMarkBandId = "brands" | "featured";

export interface HomeMark {
  id: string;
  name: string;
  /** Local mask asset path. */
  src: string;
  /** Intrinsic width / height from the source asset filename. */
  aspect: number;
  /** Optical size correction applied by the source mark component. */
  opticalScale: number;
  /** Source `--mark-hue`; null for press marks (no `data-hued`). */
  hue: string | null;
  /** Source category caption; null for press marks. */
  category: string | null;
  /** Internal case-study route when the mark is a link. */
  href?: string;
}

export interface HomeMarkBand {
  id: HomeMarkBandId;
  caption: string;
  marks: readonly HomeMark[];
}

const BRAND_MARKS: readonly HomeMark[] = [
  {
    id: "unilever",
    name: "Unilever",
    src: "/brand-mark/caa7ef22433fd46306b23988171816fd6a9323e8-1000x214.svg",
    aspect: 4.672897196261682,
    opticalScale: 1.05,
    hue: "#1F36C7",
    category: "Consumer goods",
  },
  {
    id: "hellofresh",
    name: "HelloFresh",
    src: "/brand-mark/cd40d195f13b7aa095c439d2212e9a1cb84c1751-1400x456.svg",
    aspect: 3.0701754385964914,
    opticalScale: 1,
    hue: "#729F1A",
    category: "Food & meal kits",
    href: "/case-studies/hellofresh",
  },
  {
    id: "perfectted",
    name: "PerfectTed",
    src: "/brand-mark/9ef673c0cb44db6b9bd0c071047bd058b7bb27dc-944x503.svg",
    aspect: 1.8767395626242545,
    opticalScale: 1,
    hue: "#046A38",
    category: "Energy drinks",
  },
  {
    id: "bloom-and-wild",
    name: "Bloom & Wild",
    src: "/brand-mark/2e92941ac79b8c30ad141495c8265df5930917fd-1400x647.svg",
    aspect: 2.1638330757341575,
    opticalScale: 0.94,
    hue: "#661932",
    category: "Flowers & gifting",
    href: "/case-studies/bloom-and-wild",
  },
  {
    id: "mother-root",
    name: "Mother Root",
    src: "/brand-mark/58e535e6090310e8418b907e4abfd1c346b99593-1456x192.svg",
    aspect: 7.583333333333333,
    opticalScale: 1,
    hue: "#B88C23",
    category: "Non-alcoholic drinks",
  },
  {
    id: "neom",
    name: "NEOM",
    src: "/brand-mark/6df020bd5cd89e90fd6fd3d90d805051ddd1aa4a-1400x476.svg",
    aspect: 2.9411764705882355,
    opticalScale: 1.06,
    hue: "#683D5E",
    category: "Wellbeing",
  },
  {
    id: "fussy",
    name: "Fussy",
    src: "/brand-mark/d10e5d21ed3fb43e628fb8d618ab4e1815f7f83d-1400x747.svg",
    aspect: 1.8741633199464525,
    opticalScale: 0.9,
    hue: "#195FCB",
    category: "Personal care",
  },
  {
    id: "sult",
    name: "SULT",
    src: "/brand-mark/d9e92072ad595f834f221f42af8e77cd3a5157e7-1954x694.png",
    aspect: 2.8155619596541785,
    opticalScale: 0.85,
    hue: "#7F9E00",
    category: "Hydration & electrolytes",
  },
  {
    id: "skin-and-me",
    name: "Skin + Me",
    src: "/brand-mark/3edac718fbd3e8fe217646ae2a617c5785a6818a-1400x257.svg",
    aspect: 5.447470817120623,
    opticalScale: 1,
    hue: "#B39000",
    category: "Skincare",
    href: "/case-studies/skin-and-me",
  },
  {
    id: "peachies",
    name: "Peachies",
    src: "/brand-mark/205aff3ba9d73ea058e4466f0a1eec53b84335ce-1400x222.svg",
    aspect: 6.306306306306307,
    opticalScale: 1.04,
    hue: "#8C8BDA",
    category: "Baby care",
  },
  {
    id: "hair-and-me",
    name: "Hair+Me",
    src: "/brand-mark/79cc6a6f4028695f9ef6dfe6b2097890da4be319-594x108.png",
    aspect: 5.5,
    opticalScale: 1,
    hue: "#1B31AF",
    category: "Haircare",
  },
];

const FEATURED_MARKS: readonly HomeMark[] = [
  {
    id: "adage",
    name: "AdAge",
    src: "/brand-mark/1dea93f0ab1119dfc83cc66e8404f4d91d620d5a-360x120.svg",
    aspect: 3,
    opticalScale: 1,
    hue: null,
    category: null,
  },
  {
    id: "campaign",
    name: "Campaign",
    src: "/brand-mark/af5056033a40fffffcb758e40cdd05cc63458331-356x74.svg",
    aspect: 4.8108108108108105,
    opticalScale: 1,
    hue: null,
    category: null,
  },
  {
    id: "net-influencer",
    name: "Net Influencer",
    src: "/brand-mark/93825b4691aa0b1a54be3f2f61a0d36e3eebdd34-2300x376.svg",
    aspect: 6.117021276595745,
    opticalScale: 1,
    hue: null,
    category: null,
  },
  {
    id: "yahoo-finance",
    name: "Yahoo Finance",
    src: "/brand-mark/d049902fc17d01c2051af08a217b978e2a98fbaa-1284x181.svg",
    aspect: 7.093922651933702,
    opticalScale: 1,
    hue: null,
    category: null,
  },
  {
    id: "etn",
    name: "ETN",
    src: "/brand-mark/0ef9fca64d96303e0fa2cc89bbd1411bebb399e1-259x240.svg",
    aspect: 1.0791666666666666,
    opticalScale: 1,
    hue: null,
    category: null,
  },
];

export const HOME_MARK_BANDS: readonly HomeMarkBand[] = [
  {
    id: "brands",
    caption: "The worlds most ambitious consumer brands build their creator programmes with Tano",
    marks: BRAND_MARKS,
  },
  {
    id: "featured",
    caption: "As featured in",
    marks: FEATURED_MARKS,
  },
];

export const HOME_FEATURED_MARKS = FEATURED_MARKS;

export function findHomeMarkBand(caption: string | null | undefined): HomeMarkBand | undefined {
  const normalized = (caption ?? "").trim().toLowerCase();
  if (!normalized) return undefined;
  return HOME_MARK_BANDS.find((band) => band.caption.trim().toLowerCase() === normalized);
}
