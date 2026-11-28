import Link from "next/link";
import type { CSSProperties } from "react";
import type { CaseBannerItem } from "@/components/media/case-studies";

const PHOTO_STYLE: CSSProperties = {
  position: "absolute",
  height: "100%",
  width: "100%",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  color: "transparent",
};

export type CaseBannerDeckProps = {
  items: readonly CaseBannerItem[];
  /** Written to the first slot's `--stack-index`; defaults to 0. */
  startIndex?: number;
};

/**
 * The scroll-stacked `.wire-case-banners` deck. Covers all captured variants:
 * the news card (`meta`, no mark/strip/accent, h2) and the brand cards
 * (mark + strip + accent, h2 on home and h3 on the detail pages). Callers
 * compose `items` and may override `stats`/`hue`/`level` per deck.
 */
export function CaseBannerDeck({ items, startIndex = 0 }: CaseBannerDeckProps) {
  return (
    <div className="wire-case-banners">
      {items.map((item, index) => {
        const Heading = item.level === 2 ? "h2" : "h3";
        const stats = item.stats ?? [];

        return (
          <div
            className="wire-case-slot"
            key={item.key}
            style={{ "--stack-index": startIndex + index } as CSSProperties}
          >
            <span aria-hidden="true" className="wire-case-tick" />
            <div className="wire-case-card">
              <article
                className="wire-case-banner"
                data-hue={item.hue}
                data-accent={item.accent === undefined ? undefined : ""}
                style={
                  item.accent === undefined
                    ? undefined
                    : ({ "--case-accent": item.accent } as CSSProperties)
                }
              >
                <span className="wire-case-media">
                  <img
                    alt=""
                    decoding="async"
                    className="wire-case-photo"
                    style={PHOTO_STYLE}
                    src={item.photoSrc}
                    loading="lazy"
                  />
                </span>
                <div className="wire-case-copy">
                  {item.meta ? (
                    <p className="wire-resource-meta tano-body-mono-xs">{item.meta}</p>
                  ) : null}
                  {item.mark ? (
                    <span
                      aria-label={item.mark.label}
                      className="wire-case-mark"
                      data-dark=""
                      role="img"
                      style={
                        {
                          "--mark-src": `url(${item.mark.src})`,
                          "--mark-src-dark": `url(${item.mark.srcDark ?? item.mark.src})`,
                          "--mark-aspect": item.mark.aspect,
                          "--mark-optical": item.mark.optical,
                        } as CSSProperties
                      }
                    />
                  ) : null}
                  <Heading className="tano-heading-lg wire-case-title">
                    <Link className="wire-case-link" href={item.href}>
                      {item.title}
                    </Link>
                  </Heading>
                  {stats.length > 0 ? (
                    <div
                      className="wire-case-strip"
                      style={
                        {
                          "--n": stats.length,
                          "--hold": "3.6s",
                        } as CSSProperties
                      }
                    >
                      {stats.map((stat, statIndex) => (
                        <div
                          className="wire-case-stat"
                          key={statIndex}
                          style={{ "--i": statIndex } as CSSProperties}
                        >
                          <span aria-hidden="true" className="wire-case-stat-rule" />
                          <div className="wire-case-stat-figure">
                            <p className="tano-heading-md">
                              <span>
                                <span aria-hidden="true">{stat.value}</span>
                                <span className="wire-visually-hidden">{stat.value}</span>
                              </span>
                            </p>
                            <p className="tano-body-sm wire-ink-soft">{stat.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="wire-case-foot">
                    <p className="tano-body-md wire-ink-soft">{item.foot}</p>
                    <span
                      className="tano-button wire-case-action"
                      data-variant="primary"
                      data-size="md"
                      data-material="surface"
                    >
                      <span className="tano-button__glow" aria-hidden="true" />
                      <span className="tano-button__edge" aria-hidden="true" />
                      <span className="tano-button__fill" aria-hidden="true" />
                      <span className="tano-button__label">
                        {item.actionLabel ?? "Read the case study"}
                        <span
                          className="tano-button__icon tano-button__icon--chevron"
                          aria-hidden="true"
                        >
                          <svg
                            aria-hidden="true"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.1"
                            viewBox="0 0 8 12"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M1.6 1.4 6.2 6l-4.6 4.6" />
                          </svg>
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        );
      })}
      <span aria-hidden="true" className="wire-case-tail" />
    </div>
  );
}
