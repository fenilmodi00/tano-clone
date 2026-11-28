import type { CSSProperties, ReactNode } from "react";
import { FaqRow } from "@/components/ui/faq-row";

export type FaqSectionTab = {
  id: string;
  label: string;
};

export type FaqSectionRow = {
  id: string;
  question: string;
  answer: string;
};

export type FaqSectionArt = {
  src?: string;
  alt?: string;
};

export type FaqSectionProps = {
  titleId?: string;
  /** Contents of the `h2`; wrap plain titles in `hp-title-words` to match captured pages. */
  heading: ReactNode;
  subtitle?: string;
  intro?: string;
  art?: FaqSectionArt;
  tabs?: FaqSectionTab[];
  rows: FaqSectionRow[];
  revealDelayMs?: number;
  /** Captured compare pages include a light FAQ band; everything else is dark. */
  ground?: "dark" | "light";
};

/**
 * FAQ band shared by home, for-creators, guides and compare pages.
 * Tabs are rendered only when supplied; the panel gets the tabpanel role in that case.
 */
export function FaqSection({
  titleId = "faq-title",
  heading,
  subtitle,
  intro,
  art,
  tabs,
  rows,
  revealDelayMs = 80,
  ground = "dark",
}: FaqSectionProps) {
  const tabList = tabs && tabs.length > 0 ? tabs : undefined;

  return (
    <section
      aria-labelledby={titleId}
      className="hp-band"
      data-ground={ground}
      data-ground-dark={ground === "dark" ? true : undefined}
      data-padding="xl"
    >
      <div className="hp-container hp-faq">
        <div className="hp-faq-head">
          <div className="hp-band-heading" data-align="start">
            <div className="hp-band-heading-copy">
              <h2 className="hp-title tano-display-xs" id={titleId}>
                {heading}
              </h2>
              {subtitle ? <p className="hp-sub tano-body-para-md">{subtitle}</p> : null}
              {intro ? <p className="hp-sub tano-body-para-md">{intro}</p> : null}
            </div>
          </div>
        </div>
        <div
          className="hp-reveal hp-faq-stack"
          data-rv-skip
          data-shown="false"
          style={{ "--hp-reveal-delay": `${revealDelayMs}ms` } as CSSProperties}
        >
          <div className="hp-faq-art hp-behind wire-glass-edge" data-rim="true">
            {art?.src ? (
              <img
                alt={art.alt ?? ""}
                aria-hidden={art.alt ? undefined : "true"}
                decoding="async"
                className="hp-faq-shot"
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
                src={art.src}
                loading="lazy"
              />
            ) : null}
          </div>
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
              {tabList ? (
                <div
                  aria-label="Question topics"
                  className="hp-faq-tabs"
                  data-searching="false"
                  role="tablist"
                >
                  {tabList.map((tab, index) => (
                    <button
                      aria-controls="faq-panel"
                      aria-selected={index === 0}
                      className="hp-faq-tab tano-body-sm"
                      data-active={index === 0 ? "true" : "false"}
                      id={tab.id}
                      key={tab.id}
                      role="tab"
                      tabIndex={index === 0 ? 0 : -1}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <p aria-live="polite" className="wire-visually-hidden" />
            {tabList ? (
              <div aria-labelledby={tabList[0].id} id="faq-panel" role="tabpanel">
                <ul className="hp-faq-rows">
                  {rows.map((row) => (
                    <FaqRow id={row.id} key={row.id} question={row.question} answer={row.answer} />
                  ))}
                </ul>
              </div>
            ) : (
              <div id="faq-panel">
                <ul className="hp-faq-rows">
                  {rows.map((row) => (
                    <FaqRow id={row.id} key={row.id} question={row.question} answer={row.answer} />
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
