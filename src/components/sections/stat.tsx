import type { CSSProperties, ReactNode } from "react";

export type StatItemProps = {
  value: string;
  caption: string;
  delayMs?: number;
  children: ReactNode;
};

export type StatGroupProps = {
  label: string;
  children: ReactNode;
};

/**
 * Shared gradient/mask defs for the stat charts. The literal ids are referenced
 * by chart markup in page bodies, so they stay fixed per document.
 */
export function StatDefs() {
  return (
    <svg aria-hidden="true" className="hp-stat-defs" focusable="false">
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="hp-stat-spectrum-svg1"
          x1={0}
          x2={321}
          y1={0}
          y2={0}
        >
          <stop offset="8.65%" stopColor="var(--spectrum-yellow)" />
          <stop offset="30.77%" stopColor="var(--spectrum-lime)" />
          <stop offset="58.65%" stopColor="var(--spectrum-cyan)" />
          <stop offset="79.33%" stopColor="var(--spectrum-violet)" />
          <stop offset="100%" stopColor="var(--spectrum-magenta)" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="hp-stat-spectrum-warm-svg2"
          x1={0}
          x2={321}
          y1={0}
          y2={0}
        >
          <stop offset="0%" stopColor="var(--spectrum-orange)" />
          <stop offset="22%" stopColor="var(--spectrum-yellow)" />
          <stop offset="44%" stopColor="var(--spectrum-lime)" />
          <stop offset="70%" stopColor="var(--spectrum-cyan)" />
          <stop offset="100%" stopColor="var(--spectrum-violet)" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="hp-stat-spectrum-up-svg3"
          x1={0}
          x2={0}
          y1={0}
          y2={105}
        >
          <stop offset="0%" stopColor="var(--spectrum-violet)" />
          <stop offset="100%" stopColor="var(--spectrum-cyan)" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="hp-stat-spectrum-ring-svg4"
          x1={0}
          x2={0}
          y1={20}
          y2={100}
        >
          <stop offset="0%" stopColor="var(--spectrum-magenta)" />
          <stop offset="100%" stopColor="var(--spectrum-violet)" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="hp-stat-falloff-svg5"
          x1={0}
          x2={0}
          y1={10}
          y2={105}
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
        <mask id="hp-stat-falloff-mask-svg6">
          <rect fill="url(#hp-stat-falloff-svg5)" height={117} width={321} x={0} y={0} />
        </mask>
      </defs>
    </svg>
  );
}

/** One stat card: chart/brand mark, big value, caption. */
export function StatItem({ value, caption, delayMs = 0, children }: StatItemProps) {
  return (
    <li
      className="hp-reveal hp-stat"
      data-rv-skip
      data-shown="false"
      style={{ "--hp-reveal-delay": `${delayMs}ms` } as CSSProperties}
    >
      <div className="hp-stat-head">{children}</div>
      <span className="hp-stat-value tano-heading-lg">
        <span aria-hidden="true">{value}</span>
        <span className="wire-visually-hidden">{value}</span>
      </span>
      <p className="hp-stat-caption hp-sub tano-body-md">{caption}</p>
    </li>
  );
}

/** Labelled row of stat cards. */
export function StatGroup({ label, children }: StatGroupProps) {
  return (
    <div className="hp-stat-group">
      <p className="hp-stat-group-label tano-body-mono-sm">{label}</p>
      <ul className="hp-stat-row">{children}</ul>
    </div>
  );
}
