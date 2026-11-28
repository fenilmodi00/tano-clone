import Link from "next/link";
import type { CSSProperties } from "react";
import type { LogoMark } from "./brand-marks";
import { LogoBandMotion } from "./logo-band-motion";

interface LogoBandProps {
  caption: string;
  marks: readonly LogoMark[];
  ground?: "dark" | "light";
  revealDelayMs?: number;
}

function LogoMarkItem({ mark, decorative }: { mark: LogoMark; decorative: boolean }) {
  const scale = mark.opticalScale / Math.sqrt(mark.aspect / 3);
  const hued = mark.hue !== null;

  const rootStyle = hued ? ({ "--mark-hue": mark.hue } as CSSProperties) : undefined;
  const imageStyle = {
    maskImage: `url("${mark.src}")`,
    WebkitMaskImage: `url("${mark.src}")`,
    height: `calc(var(--mark-base) * ${scale.toFixed(3)})`,
    "--mark-aspect": String(mark.aspect),
    "--mark-width": `calc(var(--mark-base) * ${(scale * mark.aspect).toFixed(3)})`,
  } as CSSProperties;

  const content = (
    <>
      <span className="wire-cases-mark-plate">
        <span
          aria-hidden={decorative ? "true" : undefined}
          aria-label={decorative ? undefined : mark.name}
          className="wire-cases-mark-image"
          role={decorative ? undefined : "img"}
          style={imageStyle}
        />
      </span>
      {mark.category !== null ? (
        <span className="wire-cases-mark-category tano-body-mono-xs">{mark.category}</span>
      ) : null}
      {mark.href ? (
        <span className="wire-cases-mark-read tano-body-mono-xs">
          Read the case study
          <span aria-hidden="true" className="wire-cases-mark-read-chevron">
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
        </span>
      ) : null}
    </>
  );

  if (mark.href) {
    return (
      <Link
        aria-hidden={decorative ? "true" : undefined}
        className="wire-cases-mark"
        data-hued={hued ? "" : undefined}
        draggable="false"
        href={mark.href}
        style={rootStyle}
        tabIndex={decorative ? -1 : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      aria-hidden={decorative ? "true" : undefined}
      className="wire-cases-mark"
      data-hued={hued ? "" : undefined}
      style={rootStyle}
    >
      {content}
    </span>
  );
}

/**
 * The `.hp-logo-band` marquee shell. Server-renders two copies of the marks and
 * hands the marquee behaviour to `LogoBandMotion` for this band only.
 */
export function LogoBand({ caption, marks, ground = "dark", revealDelayMs = 0 }: LogoBandProps) {
  return (
    <section
      className="hp-band hp-logo-band"
      data-ground={ground}
      data-ground-dark={ground === "dark" ? "" : undefined}
      data-padding="md"
    >
      <div
        className="hp-reveal"
        data-rv-skip
        data-shown="false"
        style={{ "--hp-reveal-delay": `${revealDelayMs}ms` } as CSSProperties}
      >
        <div className="wire-cases-marks">
          <p className="wire-cases-marks-caption tano-body-mono-sm">{caption}</p>
          <div className="wire-cases-marks-strip">
            <div className="wire-cases-marks-run">
              <div className="wire-cases-marks-copy">
                {marks.map((mark) => (
                  <LogoMarkItem decorative={false} key={mark.id} mark={mark} />
                ))}
              </div>
              <div aria-hidden="true" className="wire-cases-marks-copy">
                {marks.map((mark) => (
                  <LogoMarkItem decorative key={mark.id} mark={mark} />
                ))}
              </div>
            </div>
          </div>
          <LogoBandMotion marks={marks} />
        </div>
      </div>
    </section>
  );
}
