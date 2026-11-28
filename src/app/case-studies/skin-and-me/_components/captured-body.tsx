import { getOtherCaseStudies } from "@/components/media/case-studies";
import { CaseBannerDeck } from "@/components/sections/case-banners";
import { ClosingBand } from "@/components/sections/closing-band";
import { LegalLayout, LegalRail } from "@/components/sections/legal-shell";
import { StatDefs, StatItem } from "@/components/sections/stat";
import { StudyFilms } from "@/components/sections/study-films";
import { StudyHero } from "@/components/sections/study-hero";
import { StudyQuote } from "@/components/sections/study-quote";

const OTHER_CASE_STUDIES = getOtherCaseStudies("skin-and-me");
const [HELLO_FRESH, BLOOM_AND_WILD, PAPIER] = OTHER_CASE_STUDIES;
const CASE_DECK = [
  { ...HELLO_FRESH, hue: "cyan" },
  { ...BLOOM_AND_WILD, hue: "violet" },
  { ...PAPIER, hue: "lime" },
];

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <style
        dangerouslySetInnerHTML={{
          __html: ".wire-spectrum-rule::before{background:#f2c200;animation:none}",
        }}
      />
      <StudyHero accent="#f2c200" mark={{ alt: "Skin+Me logo", src: "/sites/tano/images/tano-3.png", aspect: "5.430948419301164" }} title="How Skin+Me unlocked acquisition with overlooked creators" lede="Tano finds creators beyond Skin+Me’s usual profile, giving Katie more time to build ambassador relationships." facts={[{ label: "Client", value: "Skin+Me" }, { label: "Sector", value: "Skincare" }]} backdropSrc="/sites/tano/extras/6cf37868d2534de40a0dd86a8700678e540ede63-2400x1543.jpg" figures={<><StatDefs /><ul className="wire-study-stats" data-count={1}><StatItem value="4 / 5" caption="Top performers discovered and onboarded by Tano in a single month" delayMs={0}><svg aria-hidden="true" className="hp-stat-graphic" data-graphic="incliningGraph" focusable="false" preserveAspectRatio="xMinYMid meet" viewBox="0 0 321 117"><path className="hp-stat-area" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6 L 313 105 L 8 105 Z" fill="url(#hp-stat-spectrum-svg1)" mask="url(#hp-stat-falloff-mask-svg6)" /><path className="hp-stat-line" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6" fill="none" pathLength={1} stroke="url(#hp-stat-spectrum-svg1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg></StatItem></ul></>} />
      <LegalLayout
        study
        rail={
          <LegalRail
            items={[
              { id: "the-problem", label: "The Problem" },
              { id: "the-solution", label: "The Solution" },
              { id: "the-results", label: "The Results" },
              {
                id: "grow-your-ambassador-programme-without-losing-the-personal-touch",
                label: "Grow your ambassador programme without losing the personal touch",
              },
            ]}
          />
        }
      >
            <section className="wire-legal-section wire-study-section">
              <p className="tano-body-para-md wire-ink-soft">
                Skin+Me provides personalised skincare on subscription. Its ambassador programme
                connects the business with creators who introduce customers to its products. Growing
                that channel means finding more suitable partners while maintaining the personal
                relationships that help ambassadors succeed.
              </p>
            </section>
            <section className="wire-legal-section wire-study-section" id="the-problem">
              <h2 className="tano-display-xs">The Problem</h2>
              <p className="tano-body-para-lg">
                Skin+Me wanted creator partnerships to drive customer acquisition, but manual work
                limited both discovery and the time available to develop promising relationships.
              </p>
              <div className="wire-legal-clauses">
                <div className="wire-legal-clause">
                  <h3 className="tano-heading-sm">Looking beyond the usual creator profile</h3>
                  <p className="tano-body-para-md wire-ink-soft">
                    Potential performers were easy to pass over when the team had limited time to
                    assess creators outside its usual profile of partners.
                  </p>
                </div>
                <div className="wire-legal-clause">
                  <h3 className="tano-heading-sm">Manual work competing with growth</h3>
                  <p className="tano-body-para-md wire-ink-soft">
                    Sourcing profiles was only the start. Outreach, follow-ups, programme questions,
                    tracking links and codes all needed attention before a creator could become an
                    active ambassador.
                  </p>
                </div>
                <div className="wire-legal-clause">
                  <h3 className="tano-heading-sm">Too little time for relationships</h3>
                  <p className="tano-body-para-md wire-ink-soft">
                    Katie was balancing discovery and onboarding with managing the programme.
                    Repetitive administration left less time to engage ambassadors, recognise strong
                    performers and develop new ideas.
                  </p>
                </div>
              </div>
            </section>
            <section className="wire-legal-section wire-study-section" id="the-solution">
              <h2 className="tano-display-xs">The Solution</h2>
              <p className="tano-body-para-lg">
                Tano combines broader creator discovery with managed sourcing, outreach and
                onboarding. Katie keeps the judgement and personal relationships that turn promising
                creators into productive ambassadors.
              </p>
              <ol className="wire-study-steps">
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    01
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">Discover overlooked creators</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Tano brings creators beyond the usual profile into consideration. Katie can
                      assess promising candidates without first investing her time in every sourcing
                      and outreach conversation.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    02
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">Turn interest into active partnerships</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Tano handles sourcing, outreach, follow-ups and routine programme questions,
                      with support for links, codes and onboarding. The focus is getting suitable
                      creators into the acquisition programme.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    03
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">Give relationships dedicated attention</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Katie can focus on VIP relationships, personalised gifts, handwritten notes
                      and direct engagement—making ambassadors feel valued and giving them reasons
                      to stay involved.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    04
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">Combine AI scale with human judgement</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Katie was initially sceptical about AI in a relationship-led channel. Working
                      with Tano changed her mind: automation supports her judgement and personal
                      touch rather than replacing them.
                    </p>
                  </div>
                </li>
              </ol>
            </section>
            <section className="wire-legal-section wire-study-section" id="the-results">
              <h2 className="tano-display-xs">The Results</h2>
              <p className="tano-body-para-lg">
                Skin+Me has unlocked a source of customer acquisition through creators the team
                might otherwise have overlooked. In a single month, four of Skin+Me’s five
                top-performing creators were discovered and onboarded by Tano.
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
                  src="/sites/tano/extras/1d4a291f069d01e6a24ee406d9519401d998dea3-1720x1720.jpg"
                  aria-hidden="true"
                  className="wire-study-results-backdrop hp-behind"
                  data-rv-skip
                />
                <ul className="wire-study-stats" data-count={3}>
                  <StatItem value="4 / 5" caption="Top-performing creators discovered and onboarded by Tano in a single month" delayMs={0}>
                      <svg
                        aria-hidden="true"
                        className="hp-stat-graphic"
                        data-graphic="pieChart"
                        focusable="false"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 116 117"
                      >
                        <circle
                          cx={58}
                          cy={58}
                          fill="none"
                          opacity="0.12"
                          r={36}
                          stroke="currentColor"
                          strokeWidth={14}
                        />
                        <circle
                          className="hp-stat-sweep"
                          cx={58}
                          cy={58}
                          fill="none"
                          pathLength={1}
                          r={36}
                          stroke="url(#hp-stat-spectrum-up-svg3)"
                          strokeDasharray="0.72 1"
                          strokeLinecap="round"
                          strokeWidth={14}
                          transform="rotate(-90 58 58)"
                        />
                      </svg>
                  </StatItem>
                  <StatItem value="3.5×" caption="Growth in sign-ups and revenue" delayMs={90}>
                      <svg
                        aria-hidden="true"
                        className="hp-stat-graphic"
                        data-graphic="incliningGraph"
                        focusable="false"
                        preserveAspectRatio="xMinYMid meet"
                        viewBox="0 0 321 117"
                      >
                        <path
                          className="hp-stat-area"
                          d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6 L 313 105 L 8 105 Z"
                          fill="url(#hp-stat-spectrum-svg1)"
                          mask="url(#hp-stat-falloff-mask-svg6)"
                        />
                        <path
                          className="hp-stat-line"
                          d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6"
                          fill="none"
                          pathLength={1}
                          stroke="url(#hp-stat-spectrum-svg1)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                        />
                      </svg>
                  </StatItem>
                  <StatItem value="3×" caption="Lower CAC" delayMs={180}>
                      <svg
                        aria-hidden="true"
                        className="hp-stat-graphic"
                        data-graphic="barGraphDecline"
                        focusable="false"
                        preserveAspectRatio="xMinYMid meet"
                        viewBox="0 0 321 117"
                      >
                        <g fill="url(#hp-stat-spectrum-svg1)">
                          <rect
                            className="hp-stat-bar"
                            height={89}
                            rx="2.5"
                            style={{ "--hp-stat-step": 0 }}
                            width={5}
                            x={10}
                            y={16}
                          />
                          <rect
                            className="hp-stat-bar"
                            height="84.7066549512984"
                            rx="2.5"
                            style={{ "--hp-stat-step": 1 }}
                            width={5}
                            x="19.6"
                            y="20.293345048701596"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="80.49833474434466"
                            rx="2.5"
                            style={{ "--hp-stat-step": 2 }}
                            width={5}
                            x="29.2"
                            y="24.50166525565534"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="76.3762005355431"
                            rx="2.5"
                            style={{ "--hp-stat-step": 3 }}
                            width={5}
                            x="38.8"
                            y="28.623799464456894"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="72.34147096012161"
                            rx="2.5"
                            style={{ "--hp-stat-step": 4 }}
                            width={5}
                            x="48.4"
                            y="32.65852903987839"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="68.39542719001233"
                            rx="2.5"
                            style={{ "--hp-stat-step": 5 }}
                            width={5}
                            x={58}
                            y="36.60457280998767"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="64.5394186464529"
                            rx="2.5"
                            style={{ "--hp-stat-step": 6 }}
                            width={5}
                            x="67.6"
                            y="40.4605813535471"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="60.77486948136503"
                            rx="2.5"
                            style={{ "--hp-stat-step": 7 }}
                            width={5}
                            x="77.2"
                            y="44.22513051863497"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="57.10328596696737"
                            rx="2.5"
                            style={{ "--hp-stat-step": 8 }}
                            width={5}
                            x="86.8"
                            y="47.89671403303263"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="53.5262649654747"
                            rx="2.5"
                            style={{ "--hp-stat-step": 9 }}
                            width={5}
                            x="96.39999999999999"
                            y="51.4737350345253"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="50.04550369245446"
                            rx="2.5"
                            style={{ "--hp-stat-step": 10 }}
                            width={5}
                            x={106}
                            y="54.95449630754554"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="46.6628110417042"
                            rx="2.5"
                            style={{ "--hp-stat-step": 11 }}
                            width={5}
                            x="115.6"
                            y="58.3371889582958"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="43.380120810982156"
                            rx="2.5"
                            style={{ "--hp-stat-step": 12 }}
                            width={5}
                            x="125.19999999999999"
                            y="61.619879189017844"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="40.199507263179335"
                            rx="2.5"
                            style={{ "--hp-stat-step": 13 }}
                            width={5}
                            x="134.8"
                            y="64.80049273682067"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="37.12320358622937"
                            rx="2.5"
                            style={{ "--hp-stat-step": 14 }}
                            width={5}
                            x="144.4"
                            y="67.87679641377062"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="34.15362399159335"
                            rx="2.5"
                            style={{ "--hp-stat-step": 15 }}
                            width={5}
                            x={154}
                            y="70.84637600840665"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="31.29339043737093"
                            rx="2.5"
                            style={{ "--hp-stat-step": 16 }}
                            width={5}
                            x="163.6"
                            y="73.70660956262907"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="28.545365311890404"
                            rx="2.5"
                            style={{ "--hp-stat-step": 17 }}
                            width={5}
                            x="173.2"
                            y="76.45463468810959"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="25.912691921012073"
                            rx="2.5"
                            style={{ "--hp-stat-step": 18 }}
                            width={5}
                            x="182.79999999999998"
                            y="79.08730807898793"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="23.39884537574671"
                            rx="2.5"
                            style={{ "--hp-stat-step": 19 }}
                            width={5}
                            x="192.4"
                            y="81.6011546242533"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="21.007697625551355"
                            rx="2.5"
                            style={{ "--hp-stat-step": 20 }}
                            width={5}
                            x={202}
                            y="83.99230237444864"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="18.743602188641244"
                            rx="2.5"
                            style={{ "--hp-stat-step": 21 }}
                            width={5}
                            x="211.6"
                            y="86.25639781135875"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="16.61150707226827"
                            rx="2.5"
                            style={{ "--hp-stat-step": 22 }}
                            width={5}
                            x="221.2"
                            y="88.38849292773173"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="14.617109371151466"
                            rx="2.5"
                            style={{ "--hp-stat-step": 23 }}
                            width={5}
                            x="230.79999999999998"
                            y="90.38289062884853"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="12.767073947769271"
                            rx="2.5"
                            style={{ "--hp-stat-step": 24 }}
                            width={5}
                            x="240.39999999999998"
                            y="92.23292605223072"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="11.069355505596267"
                            rx="2.5"
                            style={{ "--hp-stat-step": 25 }}
                            width={5}
                            x={250}
                            y="93.93064449440374"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="9.533697952606946"
                            rx="2.5"
                            style={{ "--hp-stat-step": 26 }}
                            width={5}
                            x="259.6"
                            y="95.46630204739306"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="8.172462973500624"
                            rx="2.5"
                            style={{ "--hp-stat-step": 27 }}
                            width={5}
                            x="269.2"
                            y="96.82753702649937"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="7.002140650731823"
                            rx="2.5"
                            style={{ "--hp-stat-step": 28 }}
                            width={5}
                            x="278.8"
                            y="97.99785934926818"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="6.046522497542043"
                            rx="2.5"
                            style={{ "--hp-stat-step": 29 }}
                            width={5}
                            x="288.4"
                            y="98.95347750245796"
                          />
                          <rect
                            className="hp-stat-bar"
                            height="5.345223678577133"
                            rx="2.5"
                            style={{ "--hp-stat-step": 30 }}
                            width={5}
                            x={298}
                            y="99.65477632142287"
                          />
                          <rect
                            className="hp-stat-bar"
                            height={5}
                            rx="2.5"
                            style={{ "--hp-stat-step": 31 }}
                            width={5}
                            x="307.59999999999997"
                            y={100}
                          />
                        </g>
                      </svg>
                  </StatItem>
                </ul>
              </div>
              <p className="tano-body-para-md wire-ink-soft">
                Broader discovery brought productive ambassadors into the programme, including
                creators Katie might not have prioritised if she had needed to source and manage
                every conversation herself.
              </p>
              <p className="tano-body-para-md wire-ink-soft">
                With Tano handling sourcing, outreach and onboarding, Katie has more time to develop
                relationships and engage the ambassadors already in the programme.
              </p>
              <p className="tano-body-para-md wire-ink-soft">
                Personalised gifting, handwritten notes and a dedicated VIP group give the programme
                a human touch. AI supports that relationship work by taking repetitive tasks off
                Katie’s plate.
              </p>
              <StudyQuote
                name="Katie McKane"
                portrait={{ src: "/sites/tano/images/tano-110.jpg", alt: "" }}
                quote="AI doesn’t replace the human; it unlocks the human."
                role="Influencer Executive · Skin+Me"
              />
            </section>
            <section
              className="wire-legal-section wire-study-section"
              id="grow-your-ambassador-programme-without-losing-the-personal-touch"
            >
              <h2 className="tano-display-xs">
                Grow your ambassador programme without losing the personal touch
              </h2>
              <p className="tano-body-para-md wire-ink-soft">
                Find more suitable creators and give your team more time to build the relationships
                that turn partnerships into customer acquisition.
              </p>
              <p className="tano-body-para-md wire-ink-soft">
                <a className="wire-contact-link" href="https://www.tano.ai/talk-to-us">
                  Talk to Tano
                </a>
              </p>
            </section>
      </LegalLayout>
      <StudyFilms
              backdropSrc="/sites/tano/extras/6cf37868d2534de40a0dd86a8700678e540ede63-2400x1543.jpg"
              films={[
        { poster: "/sites/tano/images/tano-61.jpg", filmLabel: "@noturbasicmama’s film for Skin+Me", logo: "/sites/tano/images/tano-3.png", logoLabel: "Skin+Me", avatar: "/sites/tano/images/tano-100.jpg", handle: "@noturbasicmama", brand: "Skin+Me", glow: "orange", filmGlow: "#f2c200" },
        { poster: "/sites/tano/images/tano-97.jpg", filmLabel: "@getgorgeouswithme_ugc’s film for Skin+Me", logo: "/sites/tano/images/tano-3.png", logoLabel: "Skin+Me", avatar: "/sites/tano/images/tano-104.jpg", handle: "@getgorgeouswithme_ugc", brand: "Skin+Me", glow: "orange", filmGlow: "#f2c200" },
        { poster: "/sites/tano/images/tano-33.jpg", filmLabel: "@elliegeorginateague’s film for Skin+Me", logo: "/sites/tano/images/tano-3.png", logoLabel: "Skin+Me", avatar: "/sites/tano/images/tano-66.jpg", handle: "@elliegeorginateague", brand: "Skin+Me", glow: "orange", filmGlow: "#f2c200" },
        { poster: "/sites/tano/images/tano-48.jpg", filmLabel: "@pietra.pilao’s film for Skin+Me", logo: "/sites/tano/images/tano-3.png", logoLabel: "Skin+Me", avatar: "/sites/tano/images/tano-129.jpg", handle: "@pietra.pilao", brand: "Skin+Me", glow: "orange", filmGlow: "#f2c200" },
        { poster: "/sites/tano/images/tano-120.jpg", filmLabel: "@amycatriona’s film for Skin+Me", logo: "/sites/tano/images/tano-3.png", logoLabel: "Skin+Me", avatar: "/sites/tano/images/tano-101.jpg", handle: "@amycatriona", brand: "Skin+Me", glow: "orange", filmGlow: "#f2c200" },
        { poster: "/sites/tano/images/tano-49.jpg", filmLabel: "@demileebuchanan’s film for Skin+Me", logo: "/sites/tano/images/tano-3.png", logoLabel: "Skin+Me", avatar: "/sites/tano/images/tano-34.jpg", handle: "@demileebuchanan", brand: "Skin+Me", glow: "orange", filmGlow: "#f2c200" },
        { poster: "/sites/tano/images/tano-106.jpg", filmLabel: "@the.tradie.wife’s film for Skin+Me", logo: "/sites/tano/images/tano-3.png", logoLabel: "Skin+Me", avatar: "/sites/tano/images/tano-70.jpg", handle: "@the.tradie.wife", brand: "Skin+Me", glow: "orange", filmGlow: "#f2c200" },
        { poster: "/sites/tano/images/tano-137.jpg", filmLabel: "@imjustimmy’s film for Skin+Me", logo: "/sites/tano/images/tano-3.png", logoLabel: "Skin+Me", avatar: "/sites/tano/images/tano-42.jpg", handle: "@imjustimmy", brand: "Skin+Me", glow: "orange", filmGlow: "#f2c200" },
        { poster: "/sites/tano/images/tano-36.jpg", filmLabel: "@thecraftedstudio_soma’s film for Skin+Me", logo: "/sites/tano/images/tano-3.png", logoLabel: "Skin+Me", avatar: "/sites/tano/images/tano-75.jpg", handle: "@thecraftedstudio_soma", brand: "Skin+Me", glow: "orange", filmGlow: "#f2c200" },
        { poster: "/sites/tano/images/tano-29.jpg", filmLabel: "@chaneljamesx’s film for Skin+Me", logo: "/sites/tano/images/tano-3.png", logoLabel: "Skin+Me", avatar: "/sites/tano/images/tano-113.jpg", handle: "@chaneljamesx", brand: "Skin+Me", glow: "orange", filmGlow: "#f2c200" },
              ]}
            />
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
