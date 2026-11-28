import { BandHeading } from "@/components/sections/band-heading"
import { LegalHero, LegalLayout, LegalRail } from "@/components/sections/legal-shell"
import { ButtonLink } from "@/components/ui/button"

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <LegalHero
        groundDark="open"
        kicker="Webinars"
        paragraphs={[
          "Conversations with the marketers and founders building the most profitable creator programmes in consumer.",
        ]}
        resource
        title="Lessons from the operators."
        titleId="doc-title"
      />
      <LegalLayout
        rail={
          <LegalRail
            items={[
              {
                id: "turning-influencer-ambassadors-into-a-revenue-machine-lessons-from-runna",
                label: "Turning influencer ambassadors into a revenue machine — lessons from Runna.",
              },
            ]}
          />
        }
      >
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
      </LegalLayout>
      <section className="hp-band tano" data-ground="dark" data-padding="xl">
        <div className="hp-container">
          <BandHeading
            actions={
              <>
                <ButtonLink href={"/talk-to-us"} label={"Book a call"} />
                <ButtonLink href={"/playbooks"} label={"Read the playbooks"} variant={"secondary"} />
              </>
            }
            subtitle="Get on a 30-minute intro — no slides, just a conversation."
          >
            <span className="hp-title-words">Let's scale your creator programme.</span>
          </BandHeading>
        </div>
      </section>
    </main>
  );
}
