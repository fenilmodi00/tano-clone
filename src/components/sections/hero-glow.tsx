export type HeroGlowProps = {
  variant?: "spectrum" | "study";
  /** The footer glow reads from the bottom edge. */
  from?: "bottom";
  className?: string;
};

/**
 * Decorative hero wash shared by the 22 captured heroes. `spectrum` is the
 * default drifting gradient; `study` swaps in the wire study wash.
 */
export function HeroGlow({ variant = "spectrum", from, className }: HeroGlowProps) {
  const rootClassName = ["hp-hero-glow", variant === "study" ? "wire-study-glow" : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div aria-hidden="true" className={rootClassName} data-from={from}>
      <div className="hp-hero-glow-light">
        {variant === "study" ? (
          <div className="wire-study-wash" />
        ) : (
          <div className="wire-spectrum-drift" />
        )}
        <div className="hp-hero-glow-folds" data-layer="a" />
        <div className="hp-hero-glow-folds" data-layer="b" />
      </div>
    </div>
  );
}
