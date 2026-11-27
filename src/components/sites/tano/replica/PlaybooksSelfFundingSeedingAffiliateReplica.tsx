import { TanoButtonLink, TanoButton } from "@/components/sites/tano/ui/tano-button";

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/tano/source.css. */
export function PlaybooksSelfFundingSeedingAffiliateReplica() {
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
          <p className="wire-resource-kicker tano-body-mono-sm">Free · Playbook</p>
          <h1 className="tano-display-md" id="doc-title">
            The seeding programme that pays for itself.
          </h1>
          <div className="wire-legal-hero-measure">
            <p className="tano-body-para-md wire-ink-soft">
              From gifting to affiliates to whitelisted ads — the complete playbook for 2026.
            </p>
          </div>
        </div>
      </section>
      <section className="hp-band" data-ground="light" data-padding="xl">
        <div className="hp-container">
          <div className="wire-contact-card wire-lead-gate">
            <div className="wire-contact-head">
              <p className="tano-body-mono-xs wire-ink-soft">Free · Instant access</p>
              <h2 className="tano-heading-md">Get the playbook.</h2>
              <p className="tano-body-md wire-ink-soft">
                Drop your work email and we'll send it over.
              </p>
              <ul className="wire-legal-list tano-body-md wire-ink-soft">
                <li>6 sections</li>
                <li>Break-even formula</li>
                <li>Posting rate benchmarks</li>
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
                <span className="hp-title-words">
                  Ready to build a programme that pays for itself?
                </span>
              </h2>
              <p className="hp-sub tano-body-para-md">
                Book a call with the Tano team to see how we run seeding-to-affiliate programmes for
                brands like Bloom &amp; Wild, Skin+Me, and Gousto.
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
