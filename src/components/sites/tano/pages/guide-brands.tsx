import { TanoButtonLink } from "@/components/sites/tano/ui/tano-button";

export type GuideBrandStat = { value: string; label: string };
export type GuideBrandQuote = { text: string; name?: string; role?: string };

type BrandPortrait = { src: string; alt: string } | { initials: string };

type BrandProfile = {
  name: string;
  accent: string;
  mark: string;
  image: { src: string; alt: string };
  portrait: BrandPortrait;
  href: string;
};

const BRANDS: Readonly<Record<string, BrandProfile>> = {
  "Yasmin MacDonnell": {
    name: "Bloom & Wild",
    accent: "#661932",
    mark: "/sites/tano/images/tano-2.png",
    image: {
      src: "/sites/tano/extras/c1cd2ee5d91ca6b52ed6360a47d27429ac6a3cdf-1240x1240.jpg",
      alt: "Bloom & Wild letterbox flowers arranged at home",
    },
    portrait: {
      src: "/sites/tano/images/tano-30.jpg",
      alt: "Yasmin MacDonnell, Marketing Manager at Bloom & Wild",
    },
    href: "/case-studies/bloom-and-wild",
  },
  "Katie McKane": {
    name: "Skin+Me",
    accent: "#f2c200",
    mark: "/sites/tano/images/tano-3.png",
    image: {
      src: "/sites/tano/extras/2450c8c48710183ec7dedfe886db57bb75b8c583-1240x1240.jpg",
      alt: "A Skin + Me prescription doser, personalised for its subscriber",
    },
    portrait: {
      src: "/sites/tano/images/tano-110.jpg",
      alt: "Katie McKane, Influencer Executive at Skin + Me",
    },
    href: "/case-studies/skin-and-me",
  },
  "Amirah Hussain": {
    name: "Papier",
    accent: "#8a1c2b",
    mark: "/sites/tano/images/tano-8.png",
    image: {
      src: "/sites/tano/extras/4775a71fa05fd8ff0180b0d9e256e7723ef0d8d7-1240x1240.jpg",
      alt: "A hand holding a Papier notebook with a sun on its cover",
    },
    portrait: { initials: "AH" },
    href: "/case-studies/papier",
  },
  "Stephanie Terziyski": {
    name: "HelloFresh",
    accent: "#8bc220",
    mark: "/sites/tano/images/tano-9.png",
    image: {
      src: "/sites/tano/extras/9599a6222987cf7e9a8ab1a02cf7c1b5a7b97314-1240x1240.jpg",
      alt: "A HelloFresh recipe box with the week’s ingredients",
    },
    portrait: {
      src: "/sites/tano/images/tano-50.jpg",
      alt: "Stephanie Terziyski, Growth Influencer Marketing Manager at HelloFresh",
    },
    href: "/case-studies/hellofresh",
  },
};

const DARK_ROUTES: Readonly<Record<string, true>> = {
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

/**
 * The quote/statistics band shared by every guide detail page. Brand assets and
 * the light/dark ground are the only facts the captured JSON does not carry.
 */
export function GuideBrands({
  heading,
  quote,
  stat,
  route,
}: {
  heading: string;
  quote: GuideBrandQuote;
  stat: GuideBrandStat;
  route: string;
}) {
  const brand = quote.name ? BRANDS[quote.name] : undefined;
  if (!brand) return null;

  const dark = Boolean(DARK_ROUTES[route]);
  const idPrefix = dark ? "_R_1mlubpcnjb_" : "_R_26lubpcnjb_";
  const panelId = `${idPrefix}-panel`;
  const tabId = `${idPrefix}-tab-0`;
  const words = quote.text.split(" ");
  const statParts = splitStat(stat.value);
  const name = quote.name ?? "";
  const role = quote.role ?? "";

  return (
    <section
      aria-labelledby="brands-title"
      className="hp-band hp-brands-band"
      data-ground={dark ? "dark" : "light"}
      data-ground-dark={dark || undefined}
      data-padding="xl"
      style={{ "--hp-accent": brand.accent }}
    >
      <div className="hp-container hp-brands">
        <div>
          <div className="hp-band-heading" data-align="centre">
            <div className="hp-band-heading-copy">
              <h2 className="hp-title tano-display-xs" id="brands-title">
                <span className="hp-title-words">{heading}</span>
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
                alt={brand.image.alt}
                data-live="true"
                decoding="async"
                className="hp-brand-shot"
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
                src={brand.image.src}
                loading="lazy"
              />
              <span aria-hidden="true" className="hp-brand-media-dim" />
              <img
                alt=""
                aria-hidden="true"
                data-live="true"
                width={200}
                height={80}
                decoding="async"
                className="hp-brand-media-mark"
                style={{ color: "transparent" }}
                src={brand.mark}
                loading="lazy"
              />
            </div>
            <div
              aria-labelledby={tabId}
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
                      {statParts.prefix}
                      <span className="hp-brand-stat-digits">0</span>
                      {statParts.suffix}
                    </span>
                    <span className="hp-brand-caption tano-heading-mono-xs">{stat.label}</span>
                  </p>
                </div>
                <div className="hp-brand-quote-slot">
                  <p
                    aria-hidden="true"
                    className="hp-brand-quote hp-brand-quote-ghost tano-heading-md"
                  >
                    “{quote.text}”
                  </p>
                  <blockquote
                    className="hp-brand-quote hp-brand-quote-live tano-heading-md"
                    data-reduced="false"
                  >
                    <span aria-hidden="true" className="hp-brand-word hp-brand-quote-mark">
                      “
                    </span>
                    {words.map((word, index) => (
                      <span
                        className="hp-brand-word"
                        key={`${index}-${word}`}
                        style={{ "--d": `${(index + 1) * 40}ms` }}
                      >
                        {word}
                        {index < words.length - 1 ? " " : null}
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
                </div>
              </div>
              <div className="hp-brand-foot">
                <span className="hp-brand-who">
                  <span
                    aria-hidden={"initials" in brand.portrait ? "true" : undefined}
                    className="hp-brand-portrait"
                    data-initials={"initials" in brand.portrait ? "true" : "false"}
                  >
                    {"initials" in brand.portrait ? (
                      brand.portrait.initials
                    ) : (
                      <img
                        alt={brand.portrait.alt}
                        width={96}
                        height={96}
                        decoding="async"
                        style={{ color: "transparent" }}
                        src={brand.portrait.src}
                        loading="lazy"
                      />
                    )}
                  </span>
                  <span className="hp-brand-who-name">
                    <span className="tano-body-md">{name}</span>
                    <span className="hp-sub tano-body-sm">{role}</span>
                  </span>
                </span>
                <TanoButtonLink href={brand.href} label="Read the case study" />
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
            <button
              aria-controls={panelId}
              aria-selected="true"
              className="hp-brand-tab"
              data-active="true"
              id={tabId}
              role="tab"
              tabIndex={0}
              type="button"
            >
              <span aria-hidden="true" className="hp-brand-tab-rule">
                <span
                  className="hp-brand-tab-fill"
                  data-paused="true"
                  style={{
                    "--hp-brand-duration": "6000ms",
                    "--hp-brand-count": 1,
                    "--hp-brand-index": 0,
                  }}
                />
              </span>
              <span className="hp-brand-tab-mark-box">
                <img
                  alt={brand.name}
                  width={160}
                  height={40}
                  decoding="async"
                  className="hp-brand-tab-mark"
                  style={{ color: "transparent" }}
                  src={brand.mark}
                  loading="lazy"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
