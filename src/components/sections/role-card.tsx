import Link from "next/link";
import type { CSSProperties } from "react";
import { RoleTags } from "./role-hero";

export type RoleCardProps = {
  href: string;
  title: string;
  summary: string;
  openingsLabel?: string;
  department: string;
  location: string;
  employmentType: string;
  delayMs?: number;
};

/** One role card in the careers index list. */
export function RoleCard({
  href,
  title,
  summary,
  openingsLabel,
  department,
  location,
  employmentType,
  delayMs = 0,
}: RoleCardProps) {
  return (
    <li
      className="hp-reveal"
      data-rv-skip
      data-shown="false"
      style={{ "--hp-reveal-delay": `${delayMs}ms` } as CSSProperties}
    >
      <Link className="hp-role" href={href}>
        <div className="hp-role-copy">
          <div className="hp-role-head">
            <h3 className="hp-role-title tano-heading-sm">{title}</h3>
            {openingsLabel ? (
              <span className="hp-role-openings tano-body-mono-sm">{openingsLabel}</span>
            ) : null}
          </div>
          <p className="hp-role-summary tano-body-para-sm">{summary}</p>
          <RoleTags department={department} location={location} employmentType={employmentType} />
        </div>
        <span aria-hidden="true" className="hp-role-go">
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
      </Link>
    </li>
  );
}

export type TeamPrintProps = {
  src: string;
  alt: string;
  delayMs?: number;
};

/** One offsite photo in the careers "Life at Tano" print strip. */
export function TeamPrint({ src, alt, delayMs = 0 }: TeamPrintProps) {
  return (
    <div
      className="hp-reveal hp-team-print"
      data-rv-skip
      data-shown="false"
      style={{ "--hp-reveal-delay": `${delayMs}ms` } as CSSProperties}
    >
      <img
        alt={alt}
        decoding="async"
        className="hp-team-shot"
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
        src={src}
        loading="lazy"
      />
    </div>
  );
}
