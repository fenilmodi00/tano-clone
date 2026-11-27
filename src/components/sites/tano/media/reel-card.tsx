import Link from "next/link";
import type { CSSProperties } from "react";

type ReelGlow = "rose" | "cyan" | "lime" | "orange";

export type ReelCardProps = {
  poster: string;
  filmLabel: string;
  logo: string;
  logoLabel: string;
  href?: string;
  cta?: string;
  avatar?: string;
  handle: string;
  brand: string;
  glow: ReelGlow;
  filmGlow?: string;
  front?: boolean;
  hidden?: boolean;
};

/**
 * One card in the case-study film reel. Extracted from 235 identical captured
 * instances; the runtime selects the front card and hydrates the video source.
 */
export function ReelCard({
  poster,
  filmLabel,
  logo,
  logoLabel,
  href,
  cta = "Read the Case Study",
  avatar,
  handle,
  brand,
  glow,
  filmGlow,
  front = false,
  hidden = true,
}: ReelCardProps) {
  const maskStyle = {
    maskImage: `url("${logo}")`,
    WebkitMaskImage: `url("${logo}")`,
  } as CSSProperties;

  return (
    <figure
      aria-hidden={hidden ? "true" : undefined}
      className="wire-reel-card"
      data-front={front ? "true" : "false"}
      data-glow={glow}
      style={filmGlow ? ({ "--film-glow": filmGlow } as CSSProperties) : undefined}
    >
      <div className="wire-reel-video" data-ready="false">
        <img
          alt=""
          className="wire-reel-poster"
          loading="lazy"
          decoding="async"
          draggable="false"
          src={poster}
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
        />
        <video
          aria-label={filmLabel}
          className="wire-reel-clip"
          loop
          muted
          playsInline
          preload="metadata"
        />
        <span aria-hidden="true" className="wire-reel-fade" />
        <span aria-label={logoLabel} className="wire-reel-logo" role="img" style={maskStyle} />
        {href ? (
          <Link className="wire-reel-cta tano-heading-xs" href={href} tabIndex={-1}>
            {cta}
          </Link>
        ) : null}
      </div>
      <figcaption className="wire-reel-lockup">
        <span className="wire-reel-who">
          <span aria-hidden="true" className="wire-reel-avatar">
            <span className="wire-reel-avatar-face">
              {avatar ? (
                <img
                  alt=""
                  decoding="async"
                  draggable="false"
                  loading="lazy"
                  src={avatar}
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
                />
              ) : null}
            </span>
          </span>
          <span className="wire-reel-mono">{handle}</span>
        </span>
        <span className="wire-reel-mono" data-quiet>
          {brand}
        </span>
      </figcaption>
    </figure>
  );
}
