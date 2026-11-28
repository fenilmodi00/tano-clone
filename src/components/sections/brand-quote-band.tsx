import { useId } from "react";
import type { CSSProperties, ReactElement } from "react";
import { ButtonLink } from "@/components/ui/button";

export type BrandQuoteMedia = { src: string; alt: string };

export type BrandPortrait = { src: string; alt: string } | { initials: string };

export type BrandQuoteTab = { label: string; mark: string };

export type BrandQuoteBandProps = {
  heading: string;
  ground: "light" | "dark";
  accent: string;
  stat: { prefix: string; suffix: string; caption: string };
  media: { live: BrandQuoteMedia; still?: BrandQuoteMedia; liveMark: string; stillMark?: string };
  ghosts: readonly string[];
  quote: {
    text: string;
    name?: string;
    role?: string;
    caseStudy: string;
    portrait?: BrandPortrait;
    initials?: string;
  };
  tabs: readonly BrandQuoteTab[];
  revealDelayMs?: number;
};

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

/** Animates the live quote one word at a time; `--d` is the per-word reveal delay. */
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
          key={`${index}-${word}`}
          style={{ "--d": `${(index + 1) * 40}ms` } as CSSProperties}
        >
          {word}
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
      <span
        aria-hidden="true"
        className="hp-brand-word hp-brand-quote-mark"
        style={{ "--d": `${(words.length + 1) * 40}ms` } as CSSProperties}
      >
        ”
      </span>
    </blockquote>
  );
}

/**
 * The brand quote carousel band shared by the guide and compare detail templates:
 * one media stage (live/still shot and mark pairs), a stat and quote card, and a
 * tab bar with a single initially active tab. The bar is driven by the existing
 * `.hp-brand-*` runtime; this component only emits its initial server markup.
 */
export function BrandQuoteBand({
  heading,
  ground,
  accent,
  stat,
  media,
  ghosts,
  quote,
  tabs,
  revealDelayMs = 140,
}: BrandQuoteBandProps): ReactElement {
  const panelId = `${useId().replace(/[^A-Za-z0-9_-]/g, "")}-brand-panel`;
  const firstTabId = `${panelId}-tab-0`;

  let initials = quote.initials;
  let portrait: { src: string; alt: string } | undefined;
  if (quote.portrait) {
    if ("initials" in quote.portrait) {
      initials = quote.portrait.initials;
    } else {
      portrait = quote.portrait;
    }
  }

  return (
    <section
      aria-labelledby="brands-title"
      className="hp-band hp-brands-band"
      data-ground={ground}
      data-ground-dark={ground === "dark" ? true : undefined}
      data-padding="xl"
      style={{ "--hp-accent": accent } as CSSProperties}
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
          style={{ "--hp-reveal-delay": `${revealDelayMs}ms` } as CSSProperties}
        >
          <div className="hp-brand-stage" data-rv-skip>
            <div className="hp-brand-media hp-behind wire-glass-edge" data-rim="true">
              <span aria-hidden="true" className="wire-glass-sheen" />
              <img
                alt={media.live.alt}
                className="hp-brand-shot"
                data-live="true"
                decoding="async"
                loading="lazy"
                src={media.live.src}
                style={ABSOLUTE_IMAGE_STYLE}
              />
              {media.still ? (
                <img
                  alt=""
                  aria-hidden="true"
                  className="hp-brand-shot"
                  data-live="false"
                  decoding="async"
                  loading="lazy"
                  src={media.still.src}
                  style={ABSOLUTE_IMAGE_STYLE}
                />
              ) : null}
              <span aria-hidden="true" className="hp-brand-media-dim" />
              <img
                alt=""
                aria-hidden="true"
                className="hp-brand-media-mark"
                data-live="true"
                decoding="async"
                height={80}
                loading="lazy"
                src={media.liveMark}
                style={{ color: "transparent" }}
                width={200}
              />
              {media.stillMark ? (
                <img
                  alt=""
                  aria-hidden="true"
                  className="hp-brand-media-mark"
                  data-live="false"
                  decoding="async"
                  height={80}
                  loading="lazy"
                  src={media.stillMark}
                  style={{ color: "transparent" }}
                  width={200}
                />
              ) : null}
            </div>
            <div
              aria-labelledby={firstTabId}
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
                      {stat.prefix}
                      <span className="hp-brand-stat-digits">0</span>
                      {stat.suffix}
                    </span>
                    <span className="hp-brand-caption tano-heading-mono-xs">{stat.caption}</span>
                  </p>
                </div>
                <div className="hp-brand-quote-slot">
                  {ghosts.map((ghost, index) => (
                    <p
                      aria-hidden="true"
                      className="hp-brand-quote hp-brand-quote-ghost tano-heading-md"
                      key={`${index}-${ghost}`}
                    >
                      “{ghost}”
                    </p>
                  ))}
                  <QuoteWords text={quote.text} />
                </div>
              </div>
              <div className="hp-brand-foot">
                <span className="hp-brand-who">
                  {initials ? (
                    <span aria-hidden="true" className="hp-brand-portrait" data-initials="true">
                      {initials}
                    </span>
                  ) : portrait ? (
                    <span className="hp-brand-portrait" data-initials="false">
                      <img
                        alt={portrait.alt}
                        decoding="async"
                        height={96}
                        loading="lazy"
                        src={portrait.src}
                        style={{ color: "transparent" }}
                        width={96}
                      />
                    </span>
                  ) : null}
                  <span className="hp-brand-who-name">
                    <span className="tano-body-md">{quote.name ?? ""}</span>
                    <span className="hp-sub tano-body-sm">{quote.role ?? ""}</span>
                  </span>
                </span>
                <ButtonLink href={quote.caseStudy} label="Read the case study" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="hp-reveal hp-brand-bar-reveal"
          data-rv-skip
          data-shown="false"
          style={{ "--hp-reveal-delay": `${revealDelayMs + 60}ms` } as CSSProperties}
        >
          <div aria-label="Choose a brand" className="hp-brand-bar" role="tablist">
            {tabs.map((tab, index) => {
              const active = index === 0;
              return (
                <button
                  aria-controls={panelId}
                  aria-selected={active}
                  className="hp-brand-tab"
                  data-active={active}
                  id={`${panelId}-tab-${index}`}
                  key={`${index}-${tab.label}`}
                  role="tab"
                  tabIndex={active ? 0 : -1}
                  type="button"
                >
                  <span aria-hidden="true" className="hp-brand-tab-rule">
                    {active ? (
                      <span
                        className="hp-brand-tab-fill"
                        data-paused="true"
                        style={
                          {
                            "--hp-brand-duration": "6000ms",
                            "--hp-brand-count": tabs.length,
                            "--hp-brand-index": 0,
                          } as CSSProperties
                        }
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
