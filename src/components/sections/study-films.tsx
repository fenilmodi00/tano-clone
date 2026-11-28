import type { CSSProperties } from "react";

import { ReelCard } from "@/components/media/reel-card";
import type { ReelCardProps } from "@/components/media/reel-card";

export type StudyFilm = {
  poster: string;
  filmLabel: string;
  logo: string;
  logoLabel: string;
  avatar: string;
  handle: string;
  brand: string;
  glow: ReelCardProps["glow"];
  filmGlow: string;
};

export type StudyFilmsProps = {
  backdropSrc: string;
  films: readonly StudyFilm[];
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

/** The runtime tracks five copies of the reel so the marquee can loop. */
const REEL_COPIES = 5;
/** Zero-based copy whose first card is marked as the visible front card. */
const LEAD_COPY = 2;

/** Light case-study film reel with its backdrop, looping track and transport controls. */
export function StudyFilms({ backdropSrc, films }: StudyFilmsProps) {
  const reel = Array.from({ length: REEL_COPIES }, (_, copyIndex) =>
    films.map((film, filmIndex) => {
      const leads = copyIndex === LEAD_COPY && filmIndex === 0;

      return (
        <ReelCard
          avatar={film.avatar}
          brand={film.brand}
          filmGlow={film.filmGlow}
          filmLabel={film.filmLabel}
          glow={film.glow}
          handle={film.handle}
          key={`${copyIndex}-${filmIndex}`}
          logo={film.logo}
          logoLabel={film.logoLabel}
          poster={film.poster}
          {...(leads ? { front: true, hidden: false } : {})}
        />
      );
    }),
  );

  return (
    <section className="wire-study-films" data-ground="light">
      <div className="wire-study-film">
        <img
          alt=""
          aria-hidden="true"
          className="wire-study-film-backdrop"
          data-rv-skip
          decoding="async"
          fetchPriority="auto"
          src={backdropSrc}
          style={BACKDROP_STYLE}
        />
        <span aria-hidden="true" className="wire-study-film-veil" />
        <div className="wire-reel" data-rv-skip>
          <div className="wire-reel-track">{reel}</div>
        </div>
        <div className="wire-reel-controls">
          <button
            aria-label="Previous film"
            className="wire-icon-button"
            data-direction="previous"
            type="button"
          >
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
          </button>
          <button aria-label="Pause" className="wire-icon-button" data-control="play" type="button">
            <svg
              aria-hidden="true"
              fill="none"
              focusable="false"
              height="100%"
              viewBox="0 0 14 14"
              width="100%"
            >
              <rect fill="currentColor" height={13} rx="1.25" width={4} x={2} y="0.5" />
              <rect fill="currentColor" height={13} rx="1.25" width={4} x={8} y="0.5" />
            </svg>
          </button>
          <button
            aria-label="Next film"
            className="wire-icon-button"
            data-direction="next"
            type="button"
          >
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
          </button>
          <p aria-live="polite" className="wire-visually-hidden" />
        </div>
      </div>
    </section>
  );
}
