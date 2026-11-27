import { ButtonLink } from "@/components/ui/button"

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/tano/source.css. */
export function WebinarsReplica() {
  return (
    <main id="main">
      <section
        aria-labelledby="doc-title"
        className="wire-legal-hero wire-resource-hero"
        data-ground="dark"
        data-ground-dark="open"
      >
        <div aria-hidden="true" className="hp-hero-glow">
          <div className="hp-hero-glow-light">
            <div className="wire-spectrum-drift" />
            <div className="hp-hero-glow-folds" data-layer="a" />
            <div className="hp-hero-glow-folds" data-layer="b" />
          </div>
        </div>
        <div className="wire-legal-hero-copy">
          <p className="wire-resource-kicker tano-body-mono-sm">Webinars</p>
          <h1 className="tano-display-md" id="doc-title">
            Lessons from the operators.
          </h1>
          <div className="wire-legal-hero-measure">
            <p className="tano-body-para-md wire-ink-soft">
              Conversations with the marketers and founders building the most profitable creator
              programmes in consumer.
            </p>
          </div>
        </div>
      </section>
      <div className="wire-legal-body">
        <div className="wire-legal-layout">
          <nav aria-label="On this page" className="wire-rail">
            <ul className="wire-rail-list">
              <li>
                <a
                  className="wire-rail-link"
                  href="#turning-influencer-ambassadors-into-a-revenue-machine-lessons-from-runna"
                  aria-current="true"
                >
                  Turning influencer ambassadors into a revenue machine — lessons from Runna.
                </a>
              </li>
            </ul>
          </nav>
          <article className="wire-legal-measure">
            <section
              className="wire-legal-section"
              id="turning-influencer-ambassadors-into-a-revenue-machine-lessons-from-runna"
            >
              <h2 className="tano-display-xs">
                Turning influencer ambassadors into a revenue machine — lessons from Runna.
              </h2>
              <div className="wire-article-prose">
                <p className="tano-body-para-md wire-ink-soft">
                  <strong>Webinar complete</strong> · Wed, Aug 13 · 3pm BST
                </p>
                <ul className="wire-legal-list tano-body-para-md wire-ink-soft">
                  <li>
                    <strong>Caitlin Buckley</strong>, Head of Ambassadors, Runna
                  </li>
                  <li>
                    <strong>Will Caplan</strong>, CEO &amp; Co-founder, Tano
                  </li>
                </ul>
                <h3 className="tano-heading-sm">
                  How Runna's ambassador team scaled to a 9-figure exit.
                </h3>
                <p className="tano-body-para-md wire-ink-soft">
                  Runna was acquired by Strava in June 2025 for a nine-figure sum. Caitlin's
                  ambassador team played a pivotal role — scaling to hundreds of active ambassadors
                  generating significant, directly attributable revenue.
                </p>
                <h3 className="tano-heading-sm">What we covered</h3>
                <ul className="wire-legal-list tano-body-para-md wire-ink-soft">
                  <li>How to recruit top ambassadors</li>
                  <li>How to incentivise them</li>
                  <li>The best tech stack to use</li>
                  <li>How to scale a team through high-growth periods</li>
                </ul>
              </div>
            </section>
          </article>
          <div aria-hidden="true" />
        </div>
      </div>
      <section className="hp-band tano" data-ground="dark" data-padding="xl">
        <div className="hp-container">
          <div className="hp-band-heading" data-align="start">
            <div className="hp-band-heading-copy">
              <h2 className="hp-title tano-display-xs">
                <span className="hp-title-words">Let's scale your creator programme.</span>
              </h2>
              <p className="hp-sub tano-body-para-md">
                Get on a 30-minute intro — no slides, just a conversation.
              </p>
            </div>
            <div className="hp-band-actions">
              <ButtonLink href={"/talk-to-us"} label={"Book a call"} />
              <ButtonLink href={"/playbooks"} label={"Read the playbooks"} variant={"secondary"} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
