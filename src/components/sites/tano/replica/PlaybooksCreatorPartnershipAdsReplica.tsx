import { TanoButtonLink, TanoButton } from "@/components/sites/tano/ui/tano-button";
import Link from "next/link";

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/tano/source.css. */
export function PlaybooksCreatorPartnershipAdsReplica() {
  return (
    <main id="main">
      <section
        aria-labelledby="doc-title"
        className="wire-legal-hero wire-resource-hero"
        data-ground="dark"
        data-ground-dark
      >
        <div aria-hidden="true" className="hp-hero-glow">
          <div className="hp-hero-glow-light">
            <div className="wire-spectrum-drift" />
            <div className="hp-hero-glow-folds" data-layer="a" />
            <div className="hp-hero-glow-folds" data-layer="b" />
          </div>
        </div>
        <div className="wire-legal-hero-copy">
          <p className="wire-resource-kicker tano-body-mono-sm">FREE PLAYBOOK · 2026</p>
          <h1 className="tano-display-md" id="doc-title">
            The complete guide to creator partnership ads.
          </h1>
          <div className="wire-legal-hero-measure">
            <p className="tano-body-para-md wire-ink-soft">
              From creator selection to performance reporting — the complete playbook for running
              whitelisted ads on Meta in 2026.
            </p>
          </div>
        </div>
      </section>
      <section className="hp-band" data-ground="light" data-padding="xl">
        <div className="hp-container">
          <div className="wire-contact-card wire-lead-gate">
            <div className="wire-contact-head">
              <p className="tano-body-mono-xs wire-ink-soft">Creator Partnership Ads Playbook</p>
              <h2 className="tano-heading-md">Get free access in seconds.</h2>
              <p className="tano-body-md wire-ink-soft">
                Drop your work email and we'll unlock the full playbook instantly.
              </p>
              <ul className="wire-legal-list tano-body-md wire-ink-soft">
                <li>8-section guide</li>
                <li>Brief builder tool</li>
                <li>Pricing benchmarks</li>
              </ul>
            </div>
            <form className="wire-contact-form" noValidate>
              <div className="wire-contact-fields">
                <div className="wire-contact-field" data-span="wide">
                  <label htmlFor="_R_aav5ubpcnjb_-email">Work email address</label>
                  <input
                    autoComplete="email"
                    id="_R_aav5ubpcnjb_-email"
                    required
                    type="email"
                    name="email"
                  />
                </div>
              </div>
              <TanoButton type={"submit"} >Get free access</TanoButton>
              <p className="tano-body-sm wire-ink-soft">No spam. Unsubscribe any time.</p>
            </form>
          </div>
        </div>
      </section>
      <section className="hp-band" data-ground="light" data-padding="xl">
        <div className="hp-container">
          <div className="hp-band-heading" data-align="start">
            <div className="hp-band-heading-copy">
              <h2 className="hp-title tano-display-xs">
                <span className="hp-title-words">Ready to scale your creator ad programme?</span>
              </h2>
              <p className="hp-sub tano-body-para-md">
                Book a call with the Tano team to see how we run creator partnership ads for brands
                like Bloom &amp; Wild, IM8, and ElevenLabs.
              </p>
            </div>
            <div className="hp-band-actions">
              <TanoButtonLink href={"/talk-to-us"} label={"Book a Call"} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
