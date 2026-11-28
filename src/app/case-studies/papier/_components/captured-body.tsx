import { getOtherCaseStudies } from "@/components/media/case-studies";
import { CaseBannerDeck } from "@/components/sections/case-banners";
import { ClosingBand } from "@/components/sections/closing-band";
import { LegalLayout, LegalRail } from "@/components/sections/legal-shell";
import { StatDefs, StatItem } from "@/components/sections/stat";
import { StudyFilms } from "@/components/sections/study-films";
import { StudyHero } from "@/components/sections/study-hero";
import { StudyQuote } from "@/components/sections/study-quote";

const OTHER_CASE_STUDIES = getOtherCaseStudies("papier");
const [SKIN_AND_ME, HELLO_FRESH, BLOOM_AND_WILD] = OTHER_CASE_STUDIES;
const CASE_DECK = [
  { ...HELLO_FRESH, hue: "cyan" },
  { ...BLOOM_AND_WILD, hue: "violet" },
  { ...SKIN_AND_ME, hue: "lime" },
];

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <style
        dangerouslySetInnerHTML={{
          __html: ".wire-spectrum-rule::before{background:#8a1c2b;animation:none}",
        }}
      />
      <StudyHero accent="#8a1c2b" mark={{ alt: "Papier logo", src: "/sites/tano/extras/a14f4dde8bc9af1a8f4b4df200a18b5e8716f3c3-1146x240.png", aspect: "4.775" }} title="How Papier cut CPA by 22%" lede="Seeded creator content outperformed Papier’s other Meta Partnership Ads." facts={[{ label: "Client", value: "Papier" }, { label: "Sector", value: "Stationery" }]} backdropSrc="/sites/tano/extras/ad67a79c464ea3ea983aeabfdaaeab8e866ec692-2400x1542.jpg" figures={<><StatDefs /><ul className="wire-study-stats" data-count={2}><StatItem value="22%" caption="Lower CPA – seeded creator content vs Papier’s other Meta Partnership Ads" delayMs={0}><svg aria-hidden="true" className="hp-stat-graphic" data-graphic="incliningGraph" focusable="false" preserveAspectRatio="xMinYMid meet" viewBox="0 0 321 117"><path className="hp-stat-area" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6 L 313 105 L 8 105 Z" fill="url(#hp-stat-spectrum-svg1)" mask="url(#hp-stat-falloff-mask-svg6)" /><path className="hp-stat-line" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6" fill="none" pathLength={1} stroke="url(#hp-stat-spectrum-svg1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg></StatItem><StatItem value="34%" caption="Higher ROAS – seeded creator content vs Papier’s other Meta Partnership Ads" delayMs={90}><svg aria-hidden="true" className="hp-stat-graphic" data-graphic="incliningGraph" focusable="false" preserveAspectRatio="xMinYMid meet" viewBox="0 0 321 117"><path className="hp-stat-area" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6 L 313 105 L 8 105 Z" fill="url(#hp-stat-spectrum-svg1)" mask="url(#hp-stat-falloff-mask-svg6)" /><path className="hp-stat-line" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6" fill="none" pathLength={1} stroke="url(#hp-stat-spectrum-svg1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg></StatItem></ul></>} />
      <LegalLayout
        study
        rail={
          <LegalRail
            items={[
              { id: "the-problem", label: "The Problem" },
              { id: "the-solution", label: "The Solution" },
              { id: "the-results", label: "The Results" },
              {
                id: "make-creators-your-most-efficient-paid-social-channel",
                label: "Make creators your most efficient paid social channel",
              },
            ]}
          />
        }
      >
            <section className="wire-legal-section wire-study-section">
              <p className="tano-body-para-md wire-ink-soft">
                Papier is a lifestyle and stationery brand known for personalised notebooks, photo
                books and gifts. Creator content is a core part of its paid social strategy across
                Meta and TikTok, supporting everything from product discovery through to conversion.
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
                Creator content was central to Papier’s paid social, but commissioning it was slow,
                limited in volume and increasingly repetitive—holding back performance.
              </p>
              <div className="wire-legal-clauses">
                <div className="wire-legal-clause">
                  <h3 className="tano-heading-sm">Limited creative supply</h3>
                  <p className="tano-body-para-md wire-ink-soft">
                    Commissioned UGC meant a small number of new assets each month, each costing
                    £400–£550 once creator fees and usage were included. Briefing and outreach took
                    up the team’s time and could not scale without a dedicated role.
                  </p>
                </div>
                <div className="wire-legal-clause">
                  <h3 className="tano-heading-sm">Missing campaign moments</h3>
                  <p className="tano-body-para-md wire-ink-soft">
                    Going from brief to live ad could take weeks or even months of back-and-forth.
                    Waiting that long meant missing campaign moments the team needed to jump on, and
                    made it hard to be reactive.
                  </p>
                </div>
                <div className="wire-legal-clause">
                  <h3 className="tano-heading-sm">Repetitive angles hurting performance</h3>
                  <p className="tano-body-para-md wire-ink-soft">
                    Briefing in-house tends to return to the same angles. As Amirah puts it, “It
                    starts to get very repetitive. The algorithms know that it gets repetitive and
                    it does hurt your performance.”
                  </p>
                </div>
              </div>
            </section>
            <section className="wire-legal-section wire-study-section" id="the-solution">
              <h2 className="tano-display-xs">The Solution</h2>
              <p className="tano-body-para-lg">
                Tano runs a seeded creator affiliate programme for Papier, producing a constant
                stream of diverse creator content that the paid social team can select, license and
                scale through Meta Partnership Ads.
              </p>
              <ol className="wire-study-steps">
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    01
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">
                      Seed creators across lifestyles and audiences
                    </h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Instead of briefing a handful of creators, Papier gifts products to a broad
                      community. With around 900 creatives from roughly 290 creators to draw on, the
                      team can test far more concepts at the same budget.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    02
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">Let creators find angles no brief would</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Creator freedom revealed use cases the team would never have briefed—like a
                      photo book documenting a creator’s puppy growing up. Content feels relatable
                      and natural rather than like an ad, and photo-book ads have shown real
                      longevity.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    03
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">
                      Select and license winners for Partnership Ads
                    </h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Tano captures the content creators post, so the team can choose the strongest
                      pieces, secure whitelisting and put spend behind proven creative—rather than
                      paying upfront for assets it hasn’t seen.
                    </p>
                  </div>
                </li>
                <li className="wire-study-step">
                  <span aria-hidden="true" className="wire-study-step-index tano-body-mono-sm">
                    04
                  </span>
                  <div className="wire-study-step-copy">
                    <h3 className="tano-heading-sm">An affiliate model that funds itself</h3>
                    <p className="tano-body-para-md wire-ink-soft">
                      Creators earn commission on the sales they drive. That affiliate revenue
                      covers the cost of the Tano platform and whitelisting, leaving in-platform ad
                      spend as Papier’s main additional cost.
                    </p>
                  </div>
                </li>
              </ol>
            </section>
            <section className="wire-legal-section wire-study-section" id="the-results">
              <h2 className="tano-display-xs">The Results</h2>
              <p className="tano-body-para-lg">
                Seeded creator content has become one of Papier’s most efficient paid social assets.
                Running as Meta Partnership Ads, it delivers a 22% lower CPA and 34% higher ROAS
                than Papier’s other Partnership Ads.
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
                  src="/sites/tano/extras/fbc3ce7296b00bd05821869996075084042bb393-1720x1720.jpg"
                  aria-hidden="true"
                  className="wire-study-results-backdrop hp-behind"
                  data-rv-skip
                />
                <ul className="wire-study-stats" data-count={2}>
                  <StatItem value="22%" caption="Lower CPA: £19.66 vs £25.09 for Papier’s other Partnership Ads" delayMs={0}>
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
                  <StatItem value="34%" caption="Higher ROAS: 2.46 vs 1.84 for Papier’s other Partnership Ads" delayMs={90}>
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
                </ul>
              </div>
              <p className="tano-body-para-md wire-ink-soft">
                In a measured comparison, seeded Partnership Ads achieved a £19.66 CPA and 2.46
                ROAS, against £25.09 and 1.84 for Papier’s other Partnership Ads. Amirah also
                describes them as much more efficient than Papier’s in-house ads.
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
              <p className="tano-body-para-md wire-ink-soft">
                Partnership Ads have grown from around 9% to around 20% of Papier’s Meta
                investment—a benchmark the team had set itself, reached within the first few months
                of the programme.
              </p>
              <p className="tano-body-para-md wire-ink-soft">
                Separately from paid media, the affiliate programme has driven more than 1,000
                orders, around 60% from new customers.
              </p>
              <p className="tano-body-para-md wire-ink-soft">
                Affiliate revenue covers the cost of the Tano platform and whitelisting, so the
                programme supports itself while supplying high-performing creative to paid social.
              </p>
              <StudyQuote
                initials="AH"
                name="Amirah Hussain"
                quote="Our seeded partnership ads are delivering a 22% cheaper CPA and 34% increased ROAS versus our previous partnership ads and also versus in-house ads, they're much more efficient. In terms of the affiliate revenue that's brought in, it actually covers the cost of the platform. It covers the cost of our whitelisting."
                role="Senior Paid Social Manager · Papier"
              />
            </section>
            <section
              className="wire-legal-section wire-study-section"
              id="make-creators-your-most-efficient-paid-social-channel"
            >
              <h2 className="tano-display-xs">
                Make creators your most efficient paid social channel
              </h2>
              <p className="tano-body-para-md wire-ink-soft">
                Build a creator programme that lowers acquisition costs, lifts ROAS and pays for
                itself through affiliate revenue.
              </p>
              <p className="tano-body-para-md wire-ink-soft">
                <a className="wire-contact-link" href="https://www.tano.ai/talk-to-us">
                  Talk to Tano
                </a>
              </p>
            </section>
      </LegalLayout>
      <StudyFilms
              backdropSrc="/sites/tano/extras/ad67a79c464ea3ea983aeabfdaaeab8e866ec692-2400x1542.jpg"
              films={[
        { poster: "/sites/tano/images/tano-59.jpg", filmLabel: "@thejackielin’s film for Papier", logo: "/sites/tano/images/tano-8.png", logoLabel: "Papier", avatar: "", handle: "@thejackielin", brand: "Papier", glow: "cyan", filmGlow: "#8a1c2b" },
        { poster: "/sites/tano/images/tano-91.jpg", filmLabel: "@eleanorhudson_singer’s film for Papier", logo: "/sites/tano/images/tano-8.png", logoLabel: "Papier", avatar: "/sites/tano/images/tano-40.jpg", handle: "@eleanorhudson_singer", brand: "Papier", glow: "cyan", filmGlow: "#8a1c2b" },
        { poster: "/sites/tano/images/tano-84.jpg", filmLabel: "@mal_hoovs’s film for Papier", logo: "/sites/tano/images/tano-8.png", logoLabel: "Papier", avatar: "/sites/tano/images/tano-125.jpg", handle: "@mal_hoovs", brand: "Papier", glow: "cyan", filmGlow: "#8a1c2b" },
        { poster: "/sites/tano/images/tano-78.jpg", filmLabel: "@chardonnayhanson’s film for Papier", logo: "/sites/tano/images/tano-8.png", logoLabel: "Papier", avatar: "/sites/tano/images/tano-55.jpg", handle: "@chardonnayhanson", brand: "Papier", glow: "cyan", filmGlow: "#8a1c2b" },
        { poster: "/sites/tano/images/tano-56.jpg", filmLabel: "@miss_csw’s film for Papier", logo: "/sites/tano/images/tano-8.png", logoLabel: "Papier", avatar: "/sites/tano/images/tano-72.jpg", handle: "@miss_csw", brand: "Papier", glow: "cyan", filmGlow: "#8a1c2b" },
        { poster: "/sites/tano/images/tano-90.jpg", filmLabel: "@flowerb0x’s film for Papier", logo: "/sites/tano/images/tano-8.png", logoLabel: "Papier", avatar: "", handle: "@flowerb0x", brand: "Papier", glow: "cyan", filmGlow: "#8a1c2b" },
        { poster: "/sites/tano/images/tano-119.jpg", filmLabel: "@mikaellaaz’s film for Papier", logo: "/sites/tano/images/tano-8.png", logoLabel: "Papier", avatar: "/sites/tano/images/tano-126.jpg", handle: "@mikaellaaz", brand: "Papier", glow: "cyan", filmGlow: "#8a1c2b" },
        { poster: "/sites/tano/images/tano-39.jpg", filmLabel: "@bels.booktok1’s film for Papier", logo: "/sites/tano/images/tano-8.png", logoLabel: "Papier", avatar: "/sites/tano/images/tano-65.jpg", handle: "@bels.booktok1", brand: "Papier", glow: "cyan", filmGlow: "#8a1c2b" },
        { poster: "/sites/tano/images/tano-44.jpg", filmLabel: "@ashley_dxb’s film for Papier", logo: "/sites/tano/images/tano-8.png", logoLabel: "Papier", avatar: "", handle: "@ashley_dxb", brand: "Papier", glow: "cyan", filmGlow: "#8a1c2b" },
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
