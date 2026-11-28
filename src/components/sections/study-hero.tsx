import type { CSSProperties, ReactNode } from "react";

import { HeroGlow } from "@/components/sections/hero-glow";

export type StudyHeroMark = {
  alt: string;
  src: string;
  aspect: string;
};

export type StudyHeroFact = {
  label: string;
  value: string;
};

export type StudyHeroProps = {
  accent: string;
  mark: StudyHeroMark;
  title: string;
  lede: string;
  facts: readonly StudyHeroFact[];
  backdropSrc?: string;
  /** Stats rendered inside the results panel, after its backdrop image. */
  figures?: ReactNode;
};

const BACKDROP_STYLE: CSSProperties = {
  position: "absolute",
  height: "100%",
  width: "100%",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  color: "transparent",
};

/** Dark case-study hero: brand mark, title, facts and an optional results panel. */
export function StudyHero({
  accent,
  mark,
  title,
  lede,
  facts,
  backdropSrc,
  figures,
}: StudyHeroProps) {
  const markStyle = {
    "--mark-src": `url("${mark.src}")`,
    "--mark-aspect": mark.aspect,
  } as CSSProperties;

  return (
    <section
      className="wire-study-hero"
      data-ground="dark"
      data-ground-dark
      style={{ "--study-accent": accent } as CSSProperties}
    >
      <HeroGlow variant="study" />
      <div className="wire-study-hero-copy">
        <span aria-label={mark.alt} className="wire-study-hero-mark" role="img" style={markStyle} />
        <h1 className="wire-study-title tano-display-md">{title}</h1>
        <p className="wire-study-hero-lede tano-body-para-md wire-ink-soft">{lede}</p>
        <dl className="wire-study-facts">
          {facts.map((fact) => (
            <div className="wire-study-fact" key={fact.label}>
              <dt className="tano-body-mono-xs wire-ink-soft">{fact.label}</dt>
              <dd className="tano-body-mono-xs">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {backdropSrc != null || figures != null ? (
        <div className="wire-study-hero-figures">
          <div className="wire-study-results" data-layout="row">
            {backdropSrc != null ? (
              <img
                alt=""
                aria-hidden="true"
                className="wire-study-results-backdrop hp-behind"
                data-rv-skip
                decoding="async"
                fetchPriority="high"
                src={backdropSrc}
                style={BACKDROP_STYLE}
              />
            ) : null}
            {figures}
          </div>
        </div>
      ) : null}
    </section>
  );
}
