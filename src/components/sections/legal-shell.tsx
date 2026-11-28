import type { ReactNode } from "react";

import { HeroGlow } from "@/components/sections/hero-glow";

export type LegalHeroProps = {
  titleId?: string;
  kicker?: string;
  title: string;
  paragraphs: readonly string[];
  resource?: boolean;
  /** `true` renders a bare boolean attribute, `"open"` renders the captured variant. */
  groundDark?: boolean | "open";
};

/** Dark hero shared by the privacy, news-article and webinar pages. */
export function LegalHero({
  titleId,
  kicker,
  title,
  paragraphs,
  resource = false,
  groundDark = true,
}: LegalHeroProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={resource ? "wire-legal-hero wire-resource-hero" : "wire-legal-hero"}
      data-ground="dark"
      data-ground-dark={groundDark === "open" ? "open" : groundDark ? true : undefined}
    >
      <HeroGlow variant="spectrum" />
      <div className="wire-legal-hero-copy">
        {kicker ? <p className="wire-resource-kicker tano-body-mono-sm">{kicker}</p> : null}
        <h1 className="tano-display-md" id={titleId}>
          {title}
        </h1>
        <div className="wire-legal-hero-measure">
          {paragraphs.map((paragraph) => (
            <p className="tano-body-para-md wire-ink-soft" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export type LegalRailItem = {
  id: string;
  label: string;
};

export type LegalRailProps = {
  items: readonly LegalRailItem[];
};

/** Sticky "On this page" rail; the first entry is marked as the current section. */
export function LegalRail({ items }: LegalRailProps) {
  return (
    <nav aria-label="On this page" className="wire-rail">
      <ul className="wire-rail-list">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              className="wire-rail-link"
              href={`#${item.id}`}
              aria-current={index === 0 ? "true" : "false"}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export type LegalLayoutProps = {
  study?: boolean;
  rail: ReactNode;
  children: ReactNode;
};

/** Two-column legal body: rail, measured article column and the captured spacer. */
export function LegalLayout({ study = false, rail, children }: LegalLayoutProps) {
  return (
    <div className={study ? "wire-legal-body wire-study-body" : "wire-legal-body"}>
      <div className="wire-legal-layout">
        {rail}
        <article className="wire-legal-measure">{children}</article>
        <div aria-hidden="true" />
      </div>
    </div>
  );
}
