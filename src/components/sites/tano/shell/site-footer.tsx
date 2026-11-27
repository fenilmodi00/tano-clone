"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Careers", href: "/careers" },
      { label: "For Creators", href: "/for-creators" },
      { label: "News", href: "/news" },
      { label: "Log in", href: "https://partners.tano.ai/partner/login", external: true },
      { label: "Get started", href: "/talk-to-us" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { label: "Drive Revenue", href: "/use-cases/drive-revenue" },
      { label: "Creative Velocity", href: "/use-cases/creative-velocity" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "All comparisons", href: "/compare" },
      { label: "Agentio vs Tano", href: "/compare/agentio-vs-tano" },
      { label: "GRIN vs Tano", href: "/compare/grin-vs-tano" },
      { label: "LTK vs Tano", href: "/compare/ltk-vs-tano" },
      { label: "ShopMy vs Tano", href: "/compare/shopmy-vs-tano" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "All guides", href: "/guides" },
      { label: "What a programme costs", href: "/guides/creator-programme-cost" },
      { label: "Agency or platform?", href: "/guides/influencer-agency-or-platform" },
      { label: "Outgrown your agency?", href: "/guides/outgrown-influencer-agency" },
      { label: "Scale without hiring", href: "/guides/scale-creator-programme-without-headcount" },
      { label: "Keep creators long term", href: "/guides/keep-creators-long-term" },
      { label: "Run creator content as ads", href: "/guides/creator-ads" },
      { label: "Price usage rights", href: "/guides/usage-rights-pricing" },
      { label: "Meta Creator Marketing Hub", href: "/guides/meta-creator-marketing-hub" },
      { label: "Trybe alternatives", href: "/guides/trybe-alternatives" },
    ],
  },
  {
    title: "Meta Muse",
    links: [
      { label: "What Muse means for you", href: "/guides/meta-muse-creator-marketing" },
      { label: "Change your programme for Muse", href: "/guides/win-on-meta-muse-with-creators" },
      { label: "Brief creators for Muse", href: "/guides/meta-muse-creators-brief" },
      { label: "Do follower counts matter?", href: "/guides/meta-muse-nano-micro-creators" },
      { label: "Is your UGC ready for AI agents?", href: "/guides/ugc-ai-shopping-agents" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "LinkedIn", href: "https://uk.linkedin.com/company/use-tano-ai", external: true },
      { label: "YouTube", href: "https://www.youtube.com/@Tano-AI", external: true },
    ],
  },
];

export function SiteFooter({ glyphSvg }: { glyphSvg: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = ref.current;
    if (!footer) return;
    const closing = document.querySelector(".hp-closing-band:last-of-type") as HTMLElement | null;
    if (!closing) return;
    const update = () => footer.style.setProperty("--closing-h", `${closing.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(closing);
    return () => ro.disconnect();
  }, []);

  return (
    <footer className="wire-footer" data-ground-dark="open" data-chrome-hide="" ref={ref}>
      <div aria-hidden="true" className="wire-footer-art">
        <img
          alt=""
          className="wire-footer-photo"
          loading="lazy"
          src="/sites/tano/images/footer-daylight-glass.jpg"
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            inset: 0,
            objectFit: "cover",
          }}
        />
        <div className="wire-footer-veil" />
      </div>
      <div aria-hidden="true" className="hp-hero-glow" data-from="bottom">
        <div className="hp-hero-glow-light">
          <div className="wire-spectrum-drift" />
          <div className="hp-hero-glow-folds" data-layer="a" />
          <div className="hp-hero-glow-folds" data-layer="b" />
        </div>
      </div>
      <div className="wire-footer-card">
        <Link aria-label="Tano, home" className="wire-footer-mark" href="/">
          <span
            aria-hidden="true"
            className="wire-footer-roll"
            dangerouslySetInnerHTML={{ __html: glyphSvg }}
          />
        </Link>
        <div className="wire-footer-top">
          <p className="wire-footer-tagline tano-heading-sm">The Creator Advertising Platform</p>
          {COLUMNS.map((column) => (
            <div className="wire-footer-column" key={column.title}>
              <p className="wire-footer-column-title tano-body-sm">{column.title}</p>
              {column.links.map((link) =>
                "external" in link && link.external ? (
                  <a
                    className="wire-footer-link tano-body-md"
                    href={link.href}
                    key={link.href + link.label}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    className="wire-footer-link tano-body-md"
                    href={link.href}
                    key={link.href + link.label}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
        <div className="wire-footer-legal">
          <p className="wire-footer-copyright tano-body-sm">© 2026 Tano Limited</p>
          <Link className="wire-footer-link tano-body-md" href="/privacy-policy">
            Privacy Policy
          </Link>
          <button className="wire-footer-link wire-footer-button" type="button">
            Cookie settings
          </button>
        </div>
      </div>
      <div className="wire-footer-rule">
        <div aria-hidden="true" className="wire-spectrum-rule" data-inview="true" />
      </div>
    </footer>
  );
}
