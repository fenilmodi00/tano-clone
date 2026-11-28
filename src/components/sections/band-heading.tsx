import type { ReactNode } from "react";

export type BandHeadingProps = {
  align?: "start" | "centre";
  cue?: boolean;
  /** Renders the captured `.hp-swipe-cue` paragraph inside the heading. */
  cueText?: string;
  titleId?: string;
  children: ReactNode;
  subtitle?: ReactNode;
  subtitleClassName?: string;
  actions?: ReactNode;
};

/**
 * Band heading shell from the 46 captured `hp-band-heading` instances: a title
 * line, an optional subtitle and optional trailing band actions.
 */
export function BandHeading({
  align = "start",
  cue = false,
  cueText,
  titleId,
  children,
  subtitle,
  subtitleClassName = "hp-sub tano-body-para-md",
  actions,
}: BandHeadingProps) {
  const showCue = cue || cueText != null;
  return (
    <div className="hp-band-heading" data-align={align} data-cue={showCue ? "" : undefined}>
      <div className="hp-band-heading-copy">
        <h2 className="hp-title tano-display-xs" id={titleId}>
          {children}
        </h2>
        {subtitle != null ? <p className={subtitleClassName}>{subtitle}</p> : null}
      </div>
      {actions != null ? <div className="hp-band-actions">{actions}</div> : null}
      {cueText ? (
        <p aria-hidden="true" className="hp-swipe-cue tano-body-sm">
          {cueText}
        </p>
      ) : null}
    </div>
  );
}
