import { getOtherCaseStudies } from "@/components/media/case-studies";
import { CaseBannerDeck } from "@/components/sections/case-banners";
import { ClosingBand } from "@/components/sections/closing-band";
import { LegalLayout, LegalRail } from "@/components/sections/legal-shell";
import { StatDefs, StatItem } from "@/components/sections/stat";
import { StudyFilms } from "@/components/sections/study-films";
import { StudyHero } from "@/components/sections/study-hero";
import { StudyQuote } from "@/components/sections/study-quote";

const OTHER_CASE_STUDIES = getOtherCaseStudies("bloom-and-wild");
const [SKIN_AND_ME, HELLO_FRESH, PAPIER] = OTHER_CASE_STUDIES;
const CASE_DECK = [
  { ...HELLO_FRESH, hue: "cyan" },
  { ...SKIN_AND_ME, hue: "violet" },
  { ...PAPIER, hue: "lime" },
];

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <style
        dangerouslySetInnerHTML={{
          __html: ".wire-spectrum-rule::before{background:#661932;animation:none}",
        }}
      />
      <StudyHero accent="#661932" mark={{ alt: "Bloom & Wild logo", src: "/sites/tano/extras/4157105a5b600dfe1d7e18c844f2d3fe79c63264-1560x725.png", aspect: "2.1517241379310343" }} title="How Bloom & Wild made creators a revenue channel" lede="Creator partnerships drive monthly revenue across brands and markets." facts={[{ label: "Client", value: "Bloom & Wild" }, { label: "Sector", value: "Flowers and gifting" }]} backdropSrc="/sites/tano/extras/04c5a225549515a22c055892d4303e3d32d05276-2400x1400.jpg" figures={<><StatDefs /><ul className="wire-study-stats" data-count={2}><StatItem value="+125%" caption="Higher CTR" delayMs={0}><svg aria-hidden="true" className="hp-stat-graphic" data-graphic="incliningGraph" focusable="false" preserveAspectRatio="xMinYMid meet" viewBox="0 0 321 117"><path className="hp-stat-area" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6 L 313 105 L 8 105 Z" fill="url(#hp-stat-spectrum-svg1)" mask="url(#hp-stat-falloff-mask-svg6)" /><path className="hp-stat-line" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6" fill="none" pathLength={1} stroke="url(#hp-stat-spectrum-svg1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg></StatItem><StatItem value="−10%" caption="Lower CPA" delayMs={90}><svg aria-hidden="true" className="hp-stat-graphic" data-graphic="incliningGraph" focusable="false" preserveAspectRatio="xMinYMid meet" viewBox="0 0 321 117"><path className="hp-stat-area" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6 L 313 105 L 8 105 Z" fill="url(#hp-stat-spectrum-svg1)" mask="url(#hp-stat-falloff-mask-svg6)" /><path className="hp-stat-line" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6" fill="none" pathLength={1} stroke="url(#hp-stat-spectrum-svg1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg></StatItem></ul></>} />
      <LegalLayout
        study
        rail={
          <LegalRail
            items={[
              { id: "the-problem", label: "The Problem" },
              { id: "the-solution", label: "The Solution" },
              { id: "the-results", label: "The Results" },
              {
                id: "make-creators-part-of-your-acquisition-strategy",
                label: "Make creators part of your acquisition strategy",
              },
            ]}
          />
        }
      >
            <section className="wire-legal-section wire-study-section">
              <p className="tano-body-para-md wire-ink-soft">
                Bloom &amp; Wild’s seasonal products create a constant need to reach customers with
                fresh, relevant creative. Its brand team worked with creators through monthly
                gifting, while performance marketers wanted creator partnerships that could drive
                orders. The opportunity was to connect those activities into one acquisition
                programme.
              </p>
              <figure className="wire-study-video">
                <div className="wire-study-video-frame" style={{ aspectRatio: "16 / 9" }}>
                  <mux-player
                    data-mux-player-react-lazy-placeholder=""
                    placeholder=""
                    className="wire-study-video-player"
                    nohotkeys
                    aria-hidden
                    tabIndex={-1}
                  >
                    <div data-mux-player-react-lazy-placeholder-overlay="true" />
                  </mux-player>
                </div>
              </figure>
            </section>
            <section className="wire-legal-section wire-study-section" id="the-problem">
              <h2 className="tano-display-xs">The Problem</h2>
              <p className="tano-body-para-lg">
                The team wanted creator partnerships to drive orders, but slow onboarding,
                overlapping relationships and manual administration limited growth.
              </p>
              <div className="wire-legal-clauses">
                <div className="wire-legal-clause">
                  <h3 className="tano-heading-sm">Growing the affiliate programme</h3>
                  <p className="tano-body-para-md wire-ink-soft">
                    Traditional affiliate onboarding was slow. The team wanted to bring more
                    creators into performance activity without adding more manual work.
                  </p>
                </div>
                <div className="wire-legal-clause">
                  <h3 className="tano-heading-sm">Bringing brand and performance together</h3>
                  <p className="tano-body-para-md wire-ink-soft">
                    Brand and performance teams approached creators from different angles. They
                    needed to collaborate without competing for the same relationships.
                  </p>
                </div>
                <div className="wire-legal-clause">
                  <h3 className="tano-heading-sm">Removing work that limited growth</h3>
                  <p className="tano-body-para-md wire-ink-soft">
                    Outreach, fee negotiations, contracts, unique codes and commission calculations
                    were manual. Seasonal products also required fresh creative every month.
                  </p>
                </div>
              </div>
            </section>
            <section className="wire-legal-section wire-study-section" id="the-solution">
              <h2 className="tano-display-xs">The Solution</h2>
              <p className="tano-body-para-lg">
                Tano connected creator sourcing, content capture and affiliate activity around Bloom
                &amp; Wild’s existing teams. Automation removed repetitive work without making
                creator relationships feel impersonal.
              </p>
              <ol className="wire-study-steps">
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    01
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">Creator affiliate onboarding</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Tano gave the team a route to onboard creators for performance activity and
                      grow the affiliate programme.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    02
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">A continuing supply of creators</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Fresh creators supported monthly gifting and seasonal content needs, giving
                      brand and performance teams more room to collaborate.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    03
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">Choose content before buying rights</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      The team could review what creators produced, identify suitable content and
                      request advertising rights, instead of committing upfront to unseen creative.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    04
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">Captured content for paid media</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Captured posts created a content library the team could return to when
                      planning paid-media campaigns, rather than relying on screenshots and manual
                      filing.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    05
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">Reporting built around the business</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Campaign structures and reporting reflected Bloom &amp; Wild’s brands,
                      markets, teams and terminology.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    06
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">Less administration, familiar workflow</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Less repetitive administration freed up the team’s time. Slack kept
                      communication within its existing workflow, supported by responsive people who
                      understood the account.
                    </p>
                  </div>
                </li>
              </ol>
            </section>
            <section className="wire-legal-section wire-study-section" id="the-results">
              <h2 className="tano-display-xs">The Results</h2>
              <p className="tano-body-para-lg">
                Bloom &amp; Wild has established creators as a revenue-driving acquisition channel
                with Tano, generating revenue every month and achieving 125% higher click-through
                rates and 10% lower cost per acquisition.
              </p>
              <div className="wire-study-results" data-layout="collage">
                <img
                  alt=""
                  fetchPriority="auto"
                  decoding="async"
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
                  src="/sites/tano/extras/818d7cd48e800a9a72fde5b4ff77692ba33fafbc-1720x1720.jpg"
                  aria-hidden="true"
                  className="wire-study-results-backdrop hp-behind"
                  data-rv-skip
                />
                <ul className="wire-study-stats" data-count={3}>
                  <StatItem value="+125%" caption="Higher CTR" delayMs={0}>
                      <svg
                        aria-hidden="true"
                        className="hp-stat-graphic"
                        data-graphic="incliningGraph2"
                        focusable="false"
                        preserveAspectRatio="xMinYMid meet"
                        viewBox="0 0 321 117"
                      >
                        <path
                          className="hp-stat-area"
                          d="M 8 99 L 74 77 L 158 63 L 242 56 L 266 36 L 313 5 L 313 105 L 8 105 Z"
                          fill="url(#hp-stat-spectrum-svg1)"
                          mask="url(#hp-stat-falloff-mask-svg6)"
                        />
                        <path
                          className="hp-stat-line"
                          d="M 8 99 L 74 77 L 158 63 L 242 56 L 266 36 L 313 5"
                          fill="none"
                          pathLength={1}
                          stroke="url(#hp-stat-spectrum-svg1)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                        />
                      </svg>
                  </StatItem>
                  <StatItem value="−10%" caption="Lower CPA" delayMs={90}>
                      <svg
                        aria-hidden="true"
                        className="hp-stat-graphic"
                        data-graphic="barGraph"
                        focusable="false"
                        preserveAspectRatio="xMinYMid meet"
                        viewBox="0 0 321 117"
                      >
                        <g fill="url(#hp-stat-spectrum-up-svg3)">
                          <rect
                            className="hp-stat-bar"
                            height={87}
                            rx={7}
                            style={{ "--hp-stat-step": 0 }}
                            width={26}
                            x={18}
                            y={18}
                          />
                          <rect
                            className="hp-stat-bar"
                            height={47}
                            rx={7}
                            style={{ "--hp-stat-step": 1 }}
                            width={26}
                            x={50}
                            y={58}
                          />
                        </g>
                      </svg>
                  </StatItem>
                  <StatItem value="138+" caption="Team hours saved a month" delayMs={180}>
                      <svg
                        aria-hidden="true"
                        className="hp-stat-graphic"
                        data-graphic="twentyFourHour"
                        focusable="false"
                        preserveAspectRatio="xMinYMid meet"
                        viewBox="0 0 321 117"
                      >
                        <circle
                          className="hp-stat-cap"
                          cx={10}
                          cy={58}
                          fill="currentColor"
                          r={10}
                        />
                        <circle
                          className="hp-stat-cap"
                          cx={311}
                          cy={58}
                          fill="currentColor"
                          r={10}
                        />
                        <line
                          className="hp-stat-remaining"
                          stroke="currentColor"
                          strokeDasharray="2 7"
                          strokeLinecap="round"
                          strokeWidth={2}
                          x1={214}
                          x2={297}
                          y1={58}
                          y2={58}
                        />
                        <rect
                          className="hp-stat-run"
                          fill="url(#hp-stat-spectrum-svg1)"
                          height={7}
                          rx="3.5"
                          width={186}
                          x={20}
                          y="54.5"
                        />
                        <circle
                          className="hp-stat-marker"
                          cx={204}
                          cy={58}
                          fill="var(--surface-primary-default)"
                          r={8}
                          stroke="var(--spectrum-magenta)"
                          strokeWidth={3}
                        />
                      </svg>
                  </StatItem>
                </ul>
              </div>
              <p className="tano-body-para-md wire-ink-soft">
                The programme has expanded across brands and markets, bringing brand and performance
                teams together to drive acquisition through creator partnerships. Less time spent
                sourcing creators, managing communications and coordinating product sends means more
                capacity to grow the channel.
              </p>
              <p className="tano-body-para-md wire-ink-soft">
                Tano enables the team to operate at a scale that would otherwise require at least
                one additional hire.
              </p>
              <StudyQuote
                name="Yasmin MacDonnell"
                portrait={{ src: "/sites/tano/images/tano-30.jpg", alt: "" }}
                quote="We were trying to use a traditional affiliate platform to onboard influencers, and I think we got two in a month. […] I think we got like 130 something like that in a month, which is amazing."
                role="Marketing Manager · Bloom & Wild"
              />
            </section>
            <section
              className="wire-legal-section wire-study-section"
              id="make-creators-part-of-your-acquisition-strategy"
            >
              <h2 className="tano-display-xs">Make creators part of your acquisition strategy</h2>
              <p className="tano-body-para-md wire-ink-soft">
                Build a creator programme that supports affiliate revenue and paid-media
                performance—not just a folder of content.
              </p>
              <p className="tano-body-para-md wire-ink-soft">
                <a className="wire-contact-link" href="https://www.tano.ai/talk-to-us">
                  Talk to Tano
                </a>
              </p>
            </section>
      </LegalLayout>
      <StudyFilms backdropSrc="/sites/tano/extras/04c5a225549515a22c055892d4303e3d32d05276-2400x1400.jpg" films={[{"poster":"/sites/tano/images/tano-138.jpg","filmLabel":"@helenxkarim’s film for Bloom & Wild","logo":"/sites/tano/images/tano-2.png","logoLabel":"Bloom & Wild","avatar":"/sites/tano/images/tano-107.jpg","handle":"@helenxkarim","brand":"Bloom & Wild","glow":"rose","filmGlow":"#661932"},{"poster":"/sites/tano/images/tano-77.jpg","filmLabel":"@jadecrawfordtravels’s film for Bloom & Wild","logo":"/sites/tano/images/tano-2.png","logoLabel":"Bloom & Wild","avatar":"/sites/tano/images/tano-74.jpg","handle":"@jadecrawfordtravels","brand":"Bloom & Wild","glow":"rose","filmGlow":"#661932"},{"poster":"/sites/tano/images/tano-68.jpg","filmLabel":"@katieannwilson’s film for Bloom & Wild","logo":"/sites/tano/images/tano-2.png","logoLabel":"Bloom & Wild","avatar":"/sites/tano/images/tano-98.jpg","handle":"@katieannwilson","brand":"Bloom & Wild","glow":"rose","filmGlow":"#661932"},{"poster":"/sites/tano/images/tano-46.jpg","filmLabel":"@hanna__salem’s film for Bloom & Wild","logo":"/sites/tano/images/tano-2.png","logoLabel":"Bloom & Wild","avatar":"/sites/tano/images/tano-121.jpg","handle":"@hanna__salem","brand":"Bloom & Wild","glow":"rose","filmGlow":"#661932"},{"poster":"/sites/tano/images/tano-76.jpg","filmLabel":"@niamhamelia1’s film for Bloom & Wild","logo":"/sites/tano/images/tano-2.png","logoLabel":"Bloom & Wild","avatar":"/sites/tano/images/tano-109.jpg","handle":"@niamhamelia1","brand":"Bloom & Wild","glow":"rose","filmGlow":"#661932"},{"poster":"/sites/tano/images/tano-103.jpg","filmLabel":"@nicoleinlondon’s film for Bloom & Wild","logo":"/sites/tano/images/tano-2.png","logoLabel":"Bloom & Wild","avatar":"/sites/tano/images/tano-92.jpg","handle":"@nicoleinlondon","brand":"Bloom & Wild","glow":"rose","filmGlow":"#661932"},{"poster":"/sites/tano/images/tano-132.jpg","filmLabel":"@annabellegiselle’s film for Bloom & Wild","logo":"/sites/tano/images/tano-2.png","logoLabel":"Bloom & Wild","avatar":"/sites/tano/images/tano-58.jpg","handle":"@annabellegiselle","brand":"Bloom & Wild","glow":"rose","filmGlow":"#661932"},{"poster":"/sites/tano/images/tano-27.jpg","filmLabel":"@tilleeez’s film for Bloom & Wild","logo":"/sites/tano/images/tano-2.png","logoLabel":"Bloom & Wild","avatar":"/sites/tano/images/tano-102.jpg","handle":"@tilleeez","brand":"Bloom & Wild","glow":"rose","filmGlow":"#661932"},{"poster":"/sites/tano/images/tano-135.jpg","filmLabel":"@charhbooks’s film for Bloom & Wild","logo":"/sites/tano/images/tano-2.png","logoLabel":"Bloom & Wild","avatar":"/sites/tano/images/tano-111.jpg","handle":"@charhbooks","brand":"Bloom & Wild","glow":"rose","filmGlow":"#661932"},{"poster":"/sites/tano/images/tano-47.jpg","filmLabel":"@madelinejd’s film for Bloom & Wild","logo":"/sites/tano/images/tano-2.png","logoLabel":"Bloom & Wild","avatar":"/sites/tano/images/tano-60.jpg","handle":"@madelinejd","brand":"Bloom & Wild","glow":"rose","filmGlow":"#661932"}]} />
      <section className="wire-study-others" data-ground="light">
        <div className="wire-study-others-head">
          <h2 className="tano-display-sm">Read our other case studies</h2>
          <p className="tano-body-para-lg wire-ink-soft">
            More brands that turned creators into a channel that compounds.
          </p>
        </div>
        <section className="wire-band" data-padding="md" data-ruled="false">
          <div className="wire-container">
            <CaseBannerDeck items={CASE_DECK} />
          </div>
        </section>
      </section>
      <ClosingBand lines={["Why not see", "where your brand could win?"]} body="Access thousands of creators, with our in-house strategists steering every programme." cta={{ href: "/talk-to-us", label: "Get started" }} />
    </main>
  );
}
