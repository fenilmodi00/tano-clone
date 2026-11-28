import { HeroGlow } from "@/components/sections/hero-glow";

export type ResourceHeroProps = {
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  groundDark?: boolean | "open";
  id?: string;
};

/**
 * Shared resource hero for the playbook index and detail pages: the legal-hero
 * shell with the drifting glow, optional kicker, title and measured lead.
 */
export function ResourceHero({
  eyebrow,
  title,
  paragraphs,
  groundDark = true,
  id = "doc-title",
}: ResourceHeroProps) {
  return (
    <section
      aria-labelledby={id}
      className="wire-legal-hero wire-resource-hero"
      data-ground="dark"
      data-ground-dark={groundDark === false ? undefined : groundDark}
    >
      <HeroGlow />
      <div className="wire-legal-hero-copy">
        {eyebrow ? <p className="wire-resource-kicker tano-body-mono-sm">{eyebrow}</p> : null}
        <h1 className="tano-display-md" id={id}>
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
