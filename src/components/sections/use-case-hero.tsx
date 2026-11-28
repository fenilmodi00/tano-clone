import type { ReactNode } from "react";
import { HeroGlow } from "@/components/sections/hero-glow";
import { ButtonLink } from "@/components/ui/button";

export type UseCaseHeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  /** Trailing chevron; defaults to the first action only. */
  icon?: boolean;
};

export type UseCaseHeroProps = {
  titleLines: readonly string[];
  paragraphs: readonly string[];
  actions?: readonly UseCaseHeroAction[];
  proof?: ReactNode;
  id?: string;
};

/**
 * Shared use-case hero: the dark band with the drifting glow, split title,
 * supporting paragraphs, optional actions and an optional proof panel.
 */
export function UseCaseHero({
  titleLines,
  paragraphs,
  actions,
  proof,
  id = "use-case-title",
}: UseCaseHeroProps) {
  return (
    <section
      aria-labelledby={id}
      className="hp-band hp-uc-hero"
      data-ground="dark"
      data-ground-dark
      data-padding="xl"
    >
      <HeroGlow />
      <div className="hp-container hp-uc-hero-field">
        <div className="hp-uc-hero-copy">
          <h1 className="hp-title tano-display-md" id={id}>
            {titleLines.map((line) => (
              <span className="hp-title-words" key={line}>
                {line}
              </span>
            ))}
          </h1>
          {paragraphs.map((paragraph) => (
            <p className="hp-uc-hero-sub tano-body-para-md" key={paragraph}>
              {paragraph}
            </p>
          ))}
          {actions?.length ? (
            <div className="hp-uc-hero-actions">
              {actions.map((action, index) => (
                <ButtonLink
                  href={action.href}
                  icon={action.icon ?? (index === 0 ? undefined : false)}
                  key={`${action.href}-${action.label}`}
                  label={action.label}
                  variant={action.variant ?? (index === 0 ? "primary" : "secondary")}
                />
              ))}
            </div>
          ) : null}
        </div>
        {proof != null ? <div className="hp-uc-hero-proof">{proof}</div> : null}
      </div>
    </section>
  );
}
