import { ButtonLink } from "@/components/ui/button"
import Link from "next/link";
import { LogoBand } from "@/components/media/logo-band";
import { FEATURED_BAND_CAPTION, FEATURED_MARKS } from "@/components/media/brand-marks";

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <section
        aria-labelledby="use-case-title"
        className="hp-band hp-uc-hero"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        <div aria-hidden="true" className="hp-hero-glow">
          <div className="hp-hero-glow-light">
            <div className="wire-spectrum-drift" />
            <div className="hp-hero-glow-folds" data-layer="a" />
            <div className="hp-hero-glow-folds" data-layer="b" />
          </div>
        </div>
        <div className="hp-container hp-uc-hero-field">
          <div className="hp-uc-hero-copy">
            <h1 className="hp-title tano-display-md" id="use-case-title">
              <span className="hp-title-words">News</span>
            </h1>
            <p className="hp-uc-hero-sub tano-body-para-md">Get in touch at team@tano.ai</p>
            <div className="hp-uc-hero-actions">
              <ButtonLink href={"mailto:team@tano.ai"} label={"Email the team"} icon={false} />
            </div>
          </div>
        </div>
      </section>
      <LogoBand caption={FEATURED_BAND_CAPTION} marks={FEATURED_MARKS} />
      <div data-ground="light">
        <section className="wire-band" data-padding="md" data-ruled="false">
          <div className="wire-container">
            <div className="wire-case-banners">
              <div className="wire-case-slot" style={{ "--stack-index": 0 }}>
                <span aria-hidden="true" className="wire-case-tick" />
                <div className="wire-case-card">
                  <article className="wire-case-banner" data-hue="cyan">
                    <span className="wire-case-media">
                      <img
                        alt=""
                        decoding="async"
                        className="wire-case-photo"
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
                        src="/sites/tano/extras/028bdd527688ad6e54c46eb4cf586effe86e4b05-1240x827.jpg"
                       loading="lazy"/>
                    </span>
                    <div className="wire-case-copy">
                      <p className="wire-resource-meta tano-body-mono-xs">
                        <span>News</span>
                        <time dateTime="2026-11-11">11 November 2026</time>
                      </p>
                      <h2 className="tano-heading-lg wire-case-title">
                        <Link className="wire-case-link" href="/news/tano-raises-4m-seed-round">
                          Tano has raised $5m to make creators a true advertising channel.
                        </Link>
                      </h2>
                      <div className="wire-case-foot">
                        <p className="tano-body-md wire-ink-soft">
                          We've raised a $4M seed led by Cherry Ventures, to make creators a
                          performance advertising channel brands can buy like Meta or Google ads.
                          Bringing our total funding to $5M thanks to earlier backing from Seedcamp
                          and The Players Fund
                        </p>
                        <span
                          className="tano-button wire-case-action"
                          data-variant="primary"
                          data-size="md"
                          data-material="surface"
                        >
                          <span className="tano-button__glow" aria-hidden="true" />
                          <span className="tano-button__edge" aria-hidden="true" />
                          <span className="tano-button__fill" aria-hidden="true" />
                          <span className="tano-button__label">
                            Read the story
                            <span
                              className="tano-button__icon tano-button__icon--chevron"
                              aria-hidden="true"
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
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
              <span aria-hidden="true" className="wire-case-tail" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
