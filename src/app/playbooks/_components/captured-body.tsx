import { ButtonLink } from "@/components/ui/button";
import { BandHeading } from "@/components/sections/band-heading";
import { ResourceHero } from "@/components/sections/resource-hero";
import Link from "next/link";

const HERO_PARAGRAPHS = [
  "Free AI frameworks and workflows for influencer marketing teams. Drawn from running 500+ campaigns across consumer brands.",
];

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <ResourceHero
        eyebrow="Free · Playbooks & frameworks"
        groundDark="open"
        paragraphs={HERO_PARAGRAPHS}
        title="Frameworks for creator-led growth."
      />
      <section className="hp-band tano" data-ground="dark" data-padding="xl">
        <div className="hp-container">
          <ul className="wire-grid">
            <li className="wire-grid-item">
              <article className="wire-resource-card">
                <p className="wire-resource-meta tano-body-mono-xs">
                  <span>AI Tools</span>
                </p>
                <h3 className="tano-heading-sm wire-grid-title">
                  <Link className="wire-case-link" href="/playbooks/content-analysis-framework">
                    Content Analysis Framework
                  </Link>
                </h3>
                <p className="wire-resource-standfirst tano-body-sm wire-ink-soft">
                  Use Claude Skills and Gemini to analyse your best-performing influencer content in
                  under an hour. Includes skill files, prompt templates, and a full how-to guide.
                </p>
              </article>
            </li>
            <li className="wire-grid-item">
              <article className="wire-resource-card">
                <p className="wire-resource-meta tano-body-mono-xs">
                  <span>Strategy</span>
                </p>
                <h3 className="tano-heading-sm wire-grid-title">
                  <Link className="wire-case-link" href="/playbooks/creator-discovery">
                    The Creator Discovery Guide
                  </Link>
                </h3>
                <p className="wire-resource-standfirst tano-body-sm wire-ink-soft">
                  Find the 3–5 creators who drive 80% of revenue. A data-backed guide to creator
                  selection, tiering, and management — based on 10,000+ creator seedings.
                </p>
              </article>
            </li>
            <li className="wire-grid-item">
              <article className="wire-resource-card">
                <p className="wire-resource-meta tano-body-mono-xs">
                  <span>Paid Media</span>
                </p>
                <h3 className="tano-heading-sm wire-grid-title">
                  <Link className="wire-case-link" href="/playbooks/creator-partnership-ads">
                    Creator Partnership Ads Playbook
                  </Link>
                </h3>
                <p className="wire-resource-standfirst tano-body-sm wire-ink-soft">
                  The complete guide to running creator-led ads on Meta. Covering creator selection,
                  briefing, pricing, performance reporting, and timelines — with a Bloom &amp; Wild
                  case study.
                </p>
              </article>
            </li>
            <li className="wire-grid-item">
              <article className="wire-resource-card">
                <p className="wire-resource-meta tano-body-mono-xs">
                  <span>Seeding</span>
                </p>
                <h3 className="tano-heading-sm wire-grid-title">
                  <Link className="wire-case-link" href="/playbooks/self-funding-seeding-affiliate">
                    The Seeding → Affiliate Playbook
                  </Link>
                </h3>
                <p className="wire-resource-standfirst tano-body-sm wire-ink-soft">
                  How to build a creator programme that pays for itself — from gifting to affiliates
                  to whitelisted ads. Includes the break-even formula, posting rate benchmarks, and
                  the seeding → affiliate → whitelist pyramid.
                </p>
              </article>
            </li>
            <li className="wire-grid-item">
              <article className="wire-resource-card">
                <p className="wire-resource-meta tano-body-mono-xs">
                  <span>Paid Media</span>
                </p>
                <h3 className="tano-heading-sm wire-grid-title">
                  <Link className="wire-case-link" href="/playbooks/rebriefing">
                    The Rebriefing Playbook
                  </Link>
                </h3>
                <p className="wire-resource-standfirst tano-body-sm wire-ink-soft">
                  How to turn your best organic creators into a high-converting paid ads engine —
                  without cold outreach, guesswork, or wasted spend. Covers warm rebriefing, the
                  seeding-to-paid flow, product type considerations, and scaling the programme.
                </p>
              </article>
            </li>
          </ul>
        </div>
      </section>
      <section className="hp-band tano" data-ground="dark" data-padding="xl">
        <div className="hp-container">
          <BandHeading
            subtitle="The playbooks are a head start. Want us to run it? 30-minute intro, no slides — we'll tell you whether Tano fits."
            actions={
              <>
                <ButtonLink href="/talk-to-us" label="Book a call" />
                <ButtonLink href="/case-studies" label="See our work" variant="secondary" />
              </>
            }
          >
            <span className="hp-title-words">Let's scale your creator programme.</span>
          </BandHeading>
        </div>
      </section>
    </main>
  );
}
