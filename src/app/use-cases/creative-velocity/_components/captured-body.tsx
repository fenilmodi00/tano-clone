import { ButtonLink } from "@/components/ui/button"
import { LogoBand } from "@/components/media/logo-band";
import { BRAND_BAND_CAPTION, BRAND_MARKS } from "@/components/media/brand-marks";
import { BandHeading } from "@/components/sections/band-heading";
import { ClosingBand } from "@/components/sections/closing-band";
import { StatDefs, StatGroup, StatItem } from "@/components/sections/stat";
import { UseCaseHero } from "@/components/sections/use-case-hero";

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <UseCaseHero
        titleLines={["Run hundreds of new ads a month,", "with no two the same."]}
        actions={[
          { href: "/talk-to-us", label: "Get started" },
          { href: "/case-studies", label: "See the case studies", variant: "secondary" },
        ]}
        paragraphs={[
          "Scale to thousands of organic posts a month, from creators chosen for audience fit and content quality. Your paid team picks the best-performing creative from creators who already know your product.",
        ]}
        proof={
          <>
            <StatDefs />
            <StatGroup label="What brands get:">
                <StatItem caption="Higher CTR than non-Tano ads at Bloom & Wild." delayMs={0} value="+125%">
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
                <StatItem caption="Lower CPA than non-Tano ads at Bloom & Wild." delayMs={90} value="−18%">
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
                <StatItem caption="Team hours saved each month at Bloom & Wild." delayMs={180} value="138+">
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
            </StatGroup>
          </>
        }
      />
      <LogoBand caption={BRAND_BAND_CAPTION} marks={BRAND_MARKS} />
      <section
        aria-labelledby="use-case-process-title"
        className="hp-band hp-uc-process"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        <div className="hp-container hp-uc-process-field">
          <BandHeading
            align="centre"
            subtitle="Your next ads, from creators whose posts already sell. Each is a post a creator chose to make for their own audience, so it reads as theirs, not as an ad. You license the best of them, with every fee and term agreed inside the rules you set."
            titleId="use-case-process-title"
          >
                <span className="hp-title-words">How it works.</span>
          </BandHeading>
          <div className="hp-uc-process-player">
            <div
              className="hp-reveal hp-pp"
              data-rv-skip
              data-shown="false"
              style={{ "--hp-reveal-delay": "60ms" }}
            >
              <div className="hp-pp-track-wrap">
                <ol className="hp-steps-track hp-pp-track" style={{ "--hp-steps-count": 5 }}>
                  <li className="hp-steps-seg" data-live="true">
                    <button
                      aria-current="step"
                      aria-label="Step 01: Sourcing"
                      className="hp-steps-seg-button"
                      data-state="live"
                      type="button"
                    >
                      <span aria-hidden="true" className="hp-steps-seg-rule">
                        <span
                          className="hp-steps-seg-fill"
                          data-paused="true"
                          style={{ "--hp-steps-index": 0, "--hp-steps-duration": "11600ms" }}
                        />
                      </span>
                    </button>
                  </li>
                  <li className="hp-steps-seg">
                    <button
                      aria-label="Step 02: Onboarding"
                      className="hp-steps-seg-button"
                      data-state="idle"
                      type="button"
                    >
                      <span aria-hidden="true" className="hp-steps-seg-rule">
                        <span
                          className="hp-steps-seg-fill"
                          data-paused="true"
                          style={{ "--hp-steps-index": 1, "--hp-steps-duration": "11600ms" }}
                        />
                      </span>
                    </button>
                  </li>
                  <li className="hp-steps-seg">
                    <button
                      aria-label="Step 03: Post recommendation"
                      className="hp-steps-seg-button"
                      data-state="idle"
                      type="button"
                    >
                      <span aria-hidden="true" className="hp-steps-seg-rule">
                        <span
                          className="hp-steps-seg-fill"
                          data-paused="true"
                          style={{ "--hp-steps-index": 2, "--hp-steps-duration": "11600ms" }}
                        />
                      </span>
                    </button>
                  </li>
                  <li className="hp-steps-seg">
                    <button
                      aria-label="Step 04: Invitations"
                      className="hp-steps-seg-button"
                      data-state="idle"
                      type="button"
                    >
                      <span aria-hidden="true" className="hp-steps-seg-rule">
                        <span
                          className="hp-steps-seg-fill"
                          data-paused="true"
                          style={{ "--hp-steps-index": 3, "--hp-steps-duration": "11600ms" }}
                        />
                      </span>
                    </button>
                  </li>
                  <li className="hp-steps-seg">
                    <button
                      aria-label="Step 05: Whitelisting and licence"
                      className="hp-steps-seg-button"
                      data-state="idle"
                      type="button"
                    >
                      <span aria-hidden="true" className="hp-steps-seg-rule">
                        <span
                          className="hp-steps-seg-fill"
                          data-paused="true"
                          style={{ "--hp-steps-index": 4, "--hp-steps-duration": "12200ms" }}
                        />
                      </span>
                    </button>
                  </li>
                </ol>
                <div className="hp-pp-arrows">
                  <button
                    aria-label="Previous step"
                    className="hp-arrow-button"
                    data-direction="previous"
                    type="button"
                  >
                    <span aria-hidden="true">
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
                  </button>
                  <button
                    aria-label="Pause"
                    className="hp-arrow-button"
                    data-control="play"
                    type="button"
                  >
                    <span aria-hidden="true">
                      <svg
                        aria-hidden="true"
                        fill="none"
                        focusable="false"
                        height="100%"
                        viewBox="0 0 14 14"
                        width="100%"
                      >
                        <rect fill="currentColor" height={13} rx="1.25" width={4} x={2} y="0.5" />
                        <rect fill="currentColor" height={13} rx="1.25" width={4} x={8} y="0.5" />
                      </svg>
                    </span>
                  </button>
                  <button
                    aria-label="Next step"
                    className="hp-arrow-button"
                    data-direction="next"
                    type="button"
                  >
                    <span aria-hidden="true">
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
                  </button>
                </div>
              </div>
              <div aria-live="off" className="hp-pp-copy">
                <div className="hp-pp-slide" data-live="true">
                  <p
                    className="hp-pp-owner tano-body-mono-sm"
                    data-owner="tano"
                    style={{ "--hp-steps-count": 5, "--hp-steps-index": 0 }}
                  >
                    <span>01</span>
                    <span>Run by Tano</span>
                  </p>
                  <h3 className="hp-steps-label tano-heading-md">Sourcing</h3>
                  <p className="hp-steps-body tano-body-para-md">
                    Tano finds creators whose audiences buy from you and whose posts already work as
                    ads, working from your creator personas and within your guardrails. Each is
                    scored on how likely they are to post and sell, so the creators you gift to are
                    the ones whose content is most likely to work in your ads.
                  </p>
                </div>
                <div aria-hidden="true" className="hp-pp-slide" data-live="false">
                  <p
                    className="hp-pp-owner tano-body-mono-sm"
                    data-owner="tano"
                    style={{ "--hp-steps-count": 5, "--hp-steps-index": 1 }}
                  >
                    <span>02</span>
                    <span>Run by Tano</span>
                  </p>
                  <h3 className="hp-steps-label tano-heading-md">Onboarding</h3>
                  <p className="hp-steps-body tano-body-para-md">
                    Tano’s agents write to each creator personally, choose a gift from your products
                    and set them up with a code and link connected to your Shopify store. A portal
                    invite follows for sales and payouts, so the first post can follow within days
                    of delivery.
                  </p>
                </div>
                <div aria-hidden="true" className="hp-pp-slide" data-live="false">
                  <p
                    className="hp-pp-owner tano-body-mono-sm"
                    data-owner="tano"
                    style={{ "--hp-steps-count": 5, "--hp-steps-index": 2 }}
                  >
                    <span>03</span>
                    <span>Run by Tano</span>
                  </p>
                  <h3 className="hp-steps-label tano-heading-md">Post recommendation</h3>
                  <p className="hp-steps-body tano-body-para-md">
                    Tano reviews every post against your ad account and content library: the sales
                    it drove, how it ranks across the programme, how quickly the product appears and
                    whether it is clear of music, stickers and other brands. The posts that already
                    sell and pass are put forward for you to license.
                  </p>
                </div>
                <div aria-hidden="true" className="hp-pp-slide" data-live="false">
                  <p
                    className="hp-pp-owner tano-body-mono-sm"
                    data-owner="tano"
                    style={{ "--hp-steps-count": 5, "--hp-steps-index": 3 }}
                  >
                    <span>04</span>
                    <span>Run by Tano</span>
                  </p>
                  <h3 className="hp-steps-label tano-heading-md">Invitations</h3>
                  <p className="hp-steps-body tano-body-para-md">
                    Your best performers from the last 30 days are invited to make something
                    specific for your content library, each invitation with the reward, the deadline
                    and the usage rights, such as two months as a partnership ad, agreed before they
                    say yes. Creators know what they are making and what it is for.
                  </p>
                </div>
                <div aria-hidden="true" className="hp-pp-slide" data-live="false">
                  <p
                    className="hp-pp-owner tano-body-mono-sm"
                    data-owner="tano"
                    style={{ "--hp-steps-count": 5, "--hp-steps-index": 4 }}
                  >
                    <span>05</span>
                    <span>Run by Tano</span>
                  </p>
                  <h3 className="hp-steps-label tano-heading-md">Whitelisting and licence</h3>
                  <p className="hp-steps-body tano-body-para-md">
                    You set a rate card and Tano negotiates inside it, agreeing the fee, the
                    contract and the usage period with each creator from your contract templates.
                    Once it is signed, the ad code is delivered and the post goes live as a
                    partnership ad, with the licence period starting that day.
                  </p>
                </div>
              </div>
              <div className="hp-pp-foot-arrows">
                <div className="hp-pp-arrows">
                  <button
                    aria-label="Previous step"
                    className="hp-arrow-button"
                    data-direction="previous"
                    type="button"
                  >
                    <span aria-hidden="true">
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
                  </button>
                  <button
                    aria-label="Pause"
                    className="hp-arrow-button"
                    data-control="play"
                    type="button"
                  >
                    <span aria-hidden="true">
                      <svg
                        aria-hidden="true"
                        fill="none"
                        focusable="false"
                        height="100%"
                        viewBox="0 0 14 14"
                        width="100%"
                      >
                        <rect fill="currentColor" height={13} rx="1.25" width={4} x={2} y="0.5" />
                        <rect fill="currentColor" height={13} rx="1.25" width={4} x={8} y="0.5" />
                      </svg>
                    </span>
                  </button>
                  <button
                    aria-label="Next step"
                    className="hp-arrow-button"
                    data-direction="next"
                    type="button"
                  >
                    <span aria-hidden="true">
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
                  </button>
                </div>
              </div>
              <div
                className="hp-pp-stage"
                data-rv-skip
                style={{ "--hp-steps-count": 5, "--hp-steps-active": 0 }}
              >
                <div aria-hidden="true" className="hp-pp-frame" data-direction={1}>
                  <span
                    aria-hidden="true"
                    className="hp-pp-print"
                    data-slot="top-right"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    <img
                      alt=""
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
                      src="/sites/tano/images/print-bouquet-glass.jpg"
                     loading="lazy"/>
                  </span>
                  <span
                    aria-hidden="true"
                    className="hp-pp-print"
                    data-slot="bottom-left"
                    style={{ aspectRatio: "4 / 3" }}
                  >
                    <img
                      alt=""
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
                      src="/sites/tano/images/print-letterbox-glass.jpg"
                     loading="lazy"/>
                  </span>
                  <div
                    className="hp-pp-scene"
                    data-scene="velocity-source"
                    style={{ "--beat": "1200ms" }}
                  >
                    <div className="hp-pp-window" data-slot="main" data-tone="app">
                      <div className="hp-pp-head" data-baseline>
                        <p className="hp-pp-label">Creators scored</p>
                        <p className="hp-pp-label">Compatibility</p>
                      </div>
                      <ul className="hp-pp-scores" style={{ "--threshold": "0.7" }}>
                        <li
                          className="hp-pp-score hp-pp-in"
                          data-kept="true"
                          style={{ "--at": "0.8", "--keep": "3.4", "--score": "0.92" }}
                        >
                          <span className="hp-pp-creator">
                            <span className="hp-pp-face" data-size="sm">
                              <img
                                alt=""
                                aria-hidden="true"
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-03-2.jpg"
                               loading="lazy"/>
                            </span>
                            <span className="hp-pp-creator-copy">
                              <span className="hp-pp-handle">@slowsundayhome</span>
                              <span className="hp-pp-meta">24k · home and flowers</span>
                            </span>
                          </span>
                          <span aria-hidden="true" className="hp-pp-bar">
                            <span
                              className="hp-pp-bar-fill"
                              style={{ "--at": "0.8", "--share": "0.92" }}
                            />
                          </span>
                          <span className="hp-pp-value">0.92</span>
                        </li>
                        <li
                          className="hp-pp-score hp-pp-in"
                          data-kept="true"
                          style={{ "--at": "1.05", "--keep": "3.4", "--score": "0.85" }}
                        >
                          <span className="hp-pp-creator">
                            <span className="hp-pp-face" data-size="sm">
                              <img
                                alt=""
                                aria-hidden="true"
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-05.jpg"
                               loading="lazy"/>
                            </span>
                            <span className="hp-pp-creator-copy">
                              <span className="hp-pp-handle">@thepetalpost</span>
                              <span className="hp-pp-meta">58k · seasonal styling</span>
                            </span>
                          </span>
                          <span aria-hidden="true" className="hp-pp-bar">
                            <span
                              className="hp-pp-bar-fill"
                              style={{ "--at": "1.05", "--share": "0.85" }}
                            />
                          </span>
                          <span className="hp-pp-value">0.85</span>
                        </li>
                        <li
                          className="hp-pp-score hp-pp-in"
                          data-kept="true"
                          style={{ "--at": "1.3", "--keep": "3.4", "--score": "0.78" }}
                        >
                          <span className="hp-pp-creator">
                            <span className="hp-pp-face" data-size="sm">
                              <img
                                alt=""
                                aria-hidden="true"
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-08.jpg"
                               loading="lazy"/>
                            </span>
                            <span className="hp-pp-creator-copy">
                              <span className="hp-pp-handle">@mabelandmoss</span>
                              <span className="hp-pp-meta">11k · cottage garden</span>
                            </span>
                          </span>
                          <span aria-hidden="true" className="hp-pp-bar">
                            <span
                              className="hp-pp-bar-fill"
                              style={{ "--at": "1.3", "--share": "0.78" }}
                            />
                          </span>
                          <span className="hp-pp-value">0.78</span>
                        </li>
                        <li
                          className="hp-pp-score hp-pp-in"
                          style={{ "--at": "1.55", "--keep": "3.4", "--score": "0.54" }}
                        >
                          <span className="hp-pp-creator">
                            <span className="hp-pp-face" data-size="sm">
                              <img
                                alt=""
                                aria-hidden="true"
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-17.jpg"
                               loading="lazy"/>
                            </span>
                            <span className="hp-pp-creator-copy">
                              <span className="hp-pp-handle">@citybreakcara</span>
                              <span className="hp-pp-meta">36k · travel</span>
                            </span>
                          </span>
                          <span aria-hidden="true" className="hp-pp-bar">
                            <span
                              className="hp-pp-bar-fill"
                              style={{ "--at": "1.55", "--share": "0.54" }}
                            />
                          </span>
                          <span className="hp-pp-value">0.54</span>
                        </li>
                        <li
                          className="hp-pp-score hp-pp-in"
                          style={{ "--at": "1.8", "--keep": "3.4", "--score": "0.31" }}
                        >
                          <span className="hp-pp-creator">
                            <span className="hp-pp-face" data-size="sm">
                              <img
                                alt=""
                                aria-hidden="true"
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-11-2.jpg"
                               loading="lazy"/>
                            </span>
                            <span className="hp-pp-creator-copy">
                              <span className="hp-pp-handle">@glowhaul</span>
                              <span className="hp-pp-meta">140k · beauty</span>
                            </span>
                          </span>
                          <span aria-hidden="true" className="hp-pp-bar">
                            <span
                              className="hp-pp-bar-fill"
                              style={{ "--at": "1.8", "--share": "0.31" }}
                            />
                          </span>
                          <span className="hp-pp-value">0.31</span>
                        </li>
                      </ul>
                    </div>
                    <div className="hp-pp-aside-stack">
                      <div
                        className="hp-pp-window hp-pp-in hp-pp-gone"
                        data-slot="aside"
                        data-tone="paper"
                        style={{ "--at": "0.3", "--gone": "4.4" }}
                      >
                        <ul aria-hidden="true" className="hp-pp-field">
                          <li className="hp-pp-field-row">
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-ghost
                              style={{ "--at": "0.88" }}
                            />
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.76", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-01.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.64", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-02.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.76", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-04.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-ghost
                              style={{ "--at": "0.88" }}
                            />
                          </li>
                          <li className="hp-pp-field-row" data-offset="true">
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.76", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-06.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-fit
                              style={{ "--at": "0.64", "--fit": "0.92" }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-03-2.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.52", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-07-2.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-fit
                              style={{ "--at": "0.64", "--fit": "0.85" }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-05.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-ghost
                              style={{ "--at": "0.76" }}
                            />
                          </li>
                          <li className="hp-pp-field-row">
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-ghost
                              style={{ "--at": "0.64" }}
                            />
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.52", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-09.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-fit
                              style={{ "--at": "0.4", "--fit": "0.78" }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-08.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.52", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-10.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.64", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-12.jpg"
                               loading="lazy"/>
                            </span>
                          </li>
                          <li className="hp-pp-field-row" data-offset="true">
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.76", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-13.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.64", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-14-2.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-fit
                              style={{ "--at": "0.52", "--fit": "0.54" }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-17.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.64", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-15-2.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-ghost
                              style={{ "--at": "0.76" }}
                            />
                          </li>
                          <li className="hp-pp-field-row">
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-ghost
                              style={{ "--at": "0.88" }}
                            />
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.76", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-16.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.64", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-18-2.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              style={{ "--at": "0.76", "--fit": 0 }}
                            >
                              <img
                                alt=""
                                width={96}
                                height={96}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-19.jpg"
                               loading="lazy"/>
                            </span>
                            <span
                              className="hp-pp-field-cell hp-pp-in"
                              data-ghost
                              style={{ "--at": "0.88" }}
                            />
                          </li>
                        </ul>
                      </div>
                      <div
                        className="hp-pp-window hp-pp-in"
                        data-slot="aside"
                        data-tone="paper"
                        style={{ "--at": "4.4" }}
                      >
                        <p className="hp-pp-label" data-tano>
                          <svg
                            aria-hidden="true"
                            className="hp-pp-mark"
                            fill="none"
                            viewBox="0 0 222 208"
                            overflow="visible"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <defs>
                              <radialGradient
                                cx={0}
                                cy={0}
                                gradientTransform="matrix(-73.3295 -212.012 181.351 -72.7727 153.8000 189.9900)"
                                gradientUnits="userSpaceOnUse"
                                id="tano-glyph-spectrum-usecasescreativevelocityreplica-1"
                                r={1}
                              >
                                <stop offset={0} stopColor="var(--spectrum-cyan, #46b7d1)" />
                                <stop offset="0.5" stopColor="var(--spectrum-magenta, #cc6add)" />
                                <stop offset={1} stopColor="var(--spectrum-orange, #fb751f)" />
                              </radialGradient>
                            </defs>
                            <path
                              d="M88.0338 4.00741C94.2708 -1.07111 103.169 -0.35695 113.68 0.954679C124.143 2.59856 132.893 4.37172 137.492 10.9771C142.074 17.5585 141.747 29.3607 140.316 40.69C140.299 40.7994 139.455 46.8137 138.263 55.3068C138.066 56.7112 139.348 57.871 140.72 57.5277C158.642 53.0441 177.219 48.3977 177.41 48.3473C188.497 45.7363 200.169 44.1752 207.176 48.0563C214.209 51.9519 216.882 60.4922 219.606 70.7545C222.006 81.0979 223.645 89.8961 219.26 96.6461C214.89 103.371 203.853 107.488 192.84 110.402C192.649 110.447 174.818 114.9 157.244 119.29C155.723 119.67 155.214 121.579 156.341 122.67C167.99 133.945 178.721 144.331 178.849 144.452C186.933 152.496 194.438 161.595 194.868 169.61C195.3 177.654 189.494 184.452 182.258 192.207C174.781 199.728 168.207 205.784 160.174 205.632C152.17 205.48 142.84 198.277 134.54 190.458C134.357 190.276 110.985 167.638 95.749 152.879C94.8364 151.995 93.3481 152.183 92.6759 153.262C82.6871 169.296 72.0716 186.34 71.965 186.516C65.798 196.117 58.4822 205.369 50.7527 207.458C42.9946 209.554 35.1552 205.272 26.0855 199.788C17.1935 194.019 9.91902 188.831 8.39701 180.922C6.88068 173.04 11.9679 162.392 17.8709 152.626C18.0005 152.424 32.9447 128.454 44.0686 110.613C44.5958 109.767 44.4196 108.663 43.6575 108.022C30.5698 97.0155 17.998 86.4428 17.8505 86.3219C9.2263 78.8625 1.10598 70.3116 0.119118 62.3463C-0.871353 54.3518 4.44807 47.1643 11.1271 38.9225C18.0624 30.8963 24.1984 24.3953 32.2226 23.985C40.2175 23.5762 50.0271 30.1093 58.8513 37.3297C58.9474 37.4127 64.3671 41.9737 71.7693 48.2037C72.9695 49.2138 74.8114 48.5053 75.0292 46.9494C76.2575 38.1756 77.1354 31.9084 77.1505 31.7897C78.8896 20.5037 81.8197 9.06748 88.0338 4.00741Z"
                              fill="url(#tano-glyph-spectrum-usecasescreativevelocityreplica-1)"
                            />
                          </svg>
                          <span className="hp-pp-label-tano">Shortlisted</span>
                        </p>
                        <ul className="hp-pp-checks">
                          <li className="hp-pp-check hp-pp-in" style={{ "--at": 5 }}>
                            <span aria-hidden="true" className="hp-pp-tick">
                              <svg
                                viewBox="0 0 14 14"
                                width="100%"
                                height="100%"
                                fill="none"
                                aria-hidden="true"
                                focusable="false"
                              >
                                <path
                                  d="M13.2455 1.76848c-.8642-.68787-2.1225-.54488-2.8103.31936L5.24008 8.61501 3.31704 6.93234c-.83128-.72736-2.0948-.64313-2.822166.18815-.727364.83127-.643129 2.09479.188144 2.82216L3.39454 12.3152c1.28819 1.1272 3.25684.9498 4.32279-.3895l5.84757-7.34688c.6878-.86424.5449-2.12247-.3194-2.81034Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                            Looks like the people you want to reach
                          </li>
                          <li className="hp-pp-check hp-pp-in" style={{ "--at": "5.3" }}>
                            <span aria-hidden="true" className="hp-pp-tick">
                              <svg
                                viewBox="0 0 14 14"
                                width="100%"
                                height="100%"
                                fill="none"
                                aria-hidden="true"
                                focusable="false"
                              >
                                <path
                                  d="M13.2455 1.76848c-.8642-.68787-2.1225-.54488-2.8103.31936L5.24008 8.61501 3.31704 6.93234c-.83128-.72736-2.0948-.64313-2.822166.18815-.727364.83127-.643129 2.09479.188144 2.82216L3.39454 12.3152c1.28819 1.1272 3.25684.9498 4.32279-.3895l5.84757-7.34688c.6878-.86424.5449-2.12247-.3194-2.81034Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                            Followers shop through their links
                          </li>
                          <li className="hp-pp-check hp-pp-in" style={{ "--at": "5.6" }}>
                            <span aria-hidden="true" className="hp-pp-tick">
                              <svg
                                viewBox="0 0 14 14"
                                width="100%"
                                height="100%"
                                fill="none"
                                aria-hidden="true"
                                focusable="false"
                              >
                                <path
                                  d="M13.2455 1.76848c-.8642-.68787-2.1225-.54488-2.8103.31936L5.24008 8.61501 3.31704 6.93234c-.83128-.72736-2.0948-.64313-2.822166.18815-.727364.83127-.643129 2.09479.188144 2.82216L3.39454 12.3152c1.28819 1.1272 3.25684.9498 4.32279-.3895l5.84757-7.34688c.6878-.86424.5449-2.12247-.3194-2.81034Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                            Posts already look like good ads
                          </li>
                          <li className="hp-pp-check hp-pp-in" style={{ "--at": "5.9" }}>
                            <span aria-hidden="true" className="hp-pp-tick">
                              <svg
                                viewBox="0 0 14 14"
                                width="100%"
                                height="100%"
                                fill="none"
                                aria-hidden="true"
                                focusable="false"
                              >
                                <path
                                  d="M13.2455 1.76848c-.8642-.68787-2.1225-.54488-2.8103.31936L5.24008 8.61501 3.31704 6.93234c-.83128-.72736-2.0948-.64313-2.822166.18815-.727364.83127-.643129 2.09479.188144 2.82216L3.39454 12.3152c1.28819 1.1272 3.25684.9498 4.32279-.3895l5.84757-7.34688c.6878-.86424.5449-2.12247-.3194-2.81034Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                            Clears every guardrail
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="signals-title"
        className="hp-band"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        <div className="hp-container hp-signals">
          <BandHeading
            align="centre"
            subtitle="Every post your creators publish lands in your content library. Tano puts forward the ones worth licensing on two signals, performance and content fit, and checks each one is ready to run on Meta."
            titleId="signals-title"
          >
                <span className="hp-title-words">License the posts</span>
                <span className="hp-title-group">
                  <span className="hp-title-bind">
                    <span aria-hidden="true" className="hp-inline-icon" data-size="sm">
                      <span className="tano-title-mark" data-tone="fill">
                        <svg
                          viewBox="0 0 14 14"
                          width="100%"
                          height="100%"
                          fill="none"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M12.25 5.25c0 2.8995-2.3505 5.25-5.25 5.25S1.75 8.1495 1.75 5.25C1.75 2.35051 4.1005 0 7 0s5.25 2.35051 5.25 5.25ZM7.2 2.54136l.6827 1.37335c.01527.03473.03948.06479.07016.08711.03068.02231.06674.03608.10449.0399l1.51624.23022c.04334.00564.08419.02351.11776.05151.03356.028.05847.06498.07179.10661.01332.04164.01452.0862.00344.12849-.01107.04229-.03396.08055-.06598.11031L8.58128 5.73261c-.01669.03184-.02541.06725-.02541.1032 0 .03595.00872.07136.02541.1032l.21434 1.5083c.00915.04359.00545.08891-.01065.13044-.0161.04154-.0439.07751-.08003.10356-.03614.02605-.07905.04106-.12355.04321-.04449.00214-.08865-.00867-.12712-.03112l-1.34953-.71446c-.03493-.01578-.07282-.02394-.11114-.02394-.03833 0-.07621.00816-.11114.02394l-1.34953.71446c-.03847.02245-.08264.03326-.12713.03112-.04449-.00215-.08741-.01716-.12354-.04321-.03614-.02605-.06394-.06202-.08003-.10356-.0161-.04153-.0198-.08685-.01065-.13044l.25403-1.5083c.01092-.03501.01301-.07218.00609-.10819-.00693-.03601-.02266-.06975-.04579-.09821L4.2866 4.66092c-.02969-.03007-.05053-.06774-.06023-.10887-.00971-.04114-.0079-.08415.00522-.12432.01311-.04017.03704-.07596.06914-.10344.03211-.02748.07116-.04559.11288-.05235l1.51624-.22228c.03775-.00382.0738-.01759.10449-.0399.03068-.02232.05489-.05238.07016-.08711l.6827-1.37335c.01827-.03888.04705-.07187.08309-.09524.03603-.02337.07789-.0362.12084-.03703.04295-.00082.08527.01038.12218.03236.03691.02197.06694.05383.08669.09197ZM.0712536 11.4928 1.62406 8.90479c.88729 1.30261 2.23565 2.26601 3.8103 2.65541l-1.25024 2.1879c-.09149.1601-.26367.2569-.44799.2517-.18433-.0051-.35088-.1112-.43334-.2762l-.84409-1.6881-1.903484.2115c-.188906.021-.373377-.067-.4760269-.2269-.1026497-.16-.1057249-.3643-.0079355-.5273ZM9.81581 13.7481l-1.25023-2.1879c1.57462-.3894 2.92302-1.3528 3.81032-2.65536l1.5528 2.58796c.0978.163.0947.3673-.008.5273-.1026.1599-.2871.2479-.476.2269l-1.9035-.2115-.8441 1.6881c-.0824.165-.249.2711-.4333.2762-.1843.0052-.3565-.0916-.44799-.2517Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="hp-title-words">that</span>
                  </span>
                  <span className="hp-title-words"> already sell.</span>
                </span>
          </BandHeading>
          <ul className="hp-signals-row" style={{ "--signals": 3 }}>
            <li
              className="hp-reveal hp-signal"
              data-rv-skip
              data-shown="false"
              style={{ "--hp-reveal-delay": "0ms" }}
            >
              <span aria-hidden="true" className="hp-signal-icon">
                <span className="tano-title-mark" data-tone="fill">
                  <svg
                    viewBox="0 0 14 14"
                    width="100%"
                    height="100%"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M2 1.25C2 .835786 1.66421.5 1.25.5.835786.5.5.835786.5 1.25v11.5c0 .4142.335786.75.75.75h11.5c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75H2V1.25Zm11.3569 2.98698c.2853-.47289.1332-1.08752-.3396-1.37282-.4729-.2853-1.0876-.13323-1.3729.33965L9.83395 6.2047 6.3639 4.73654c-.42925-.18161-.92704-.0426-1.20009.33513L2.85448 8.26639c-.32354.44759-.22298 1.07272.22461 1.39627.44759.32354 1.07272.22298 1.39626-.22461L6.3181 6.8888l3.53473 1.49552c.45807.19381.98897.0215 1.24587-.40437l2.2582-3.74297Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </span>
              <h3 className="tano-heading-sm">Posts that already sell</h3>
              <p className="hp-sub tano-body-para-sm">
                Ranked on the orders each creator’s code and link have driven for you. £1,240 in 14
                days puts a post in the top 10% of your programme.
              </p>
            </li>
            <li
              className="hp-reveal hp-signal"
              data-rv-skip
              data-shown="false"
              style={{ "--hp-reveal-delay": "90ms" }}
            >
              <span aria-hidden="true" className="hp-signal-icon">
                <span className="tano-title-mark" data-tone="fill">
                  <svg
                    viewBox="0 0 14 14"
                    width="100%"
                    height="100%"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M1 .5C.723858.5.5.723858.5 1v12c0 .2761.223858.5.5.5h12c.2761 0 .5-.2239.5-.5V1c0-.276142-.2239-.5-.5-.5H1ZM10.5 2h-7v4.25h7V2Zm-7 5.75h7V12h-7V7.75Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </span>
              <h3 className="tano-heading-sm">Posts built to run as ads</h3>
              <p className="hp-sub tano-body-para-sm">
                Format and craft that already work on your account: a hook in the first two seconds,
                product on screen throughout, no on-screen text to re-cut.
              </p>
            </li>
            <li
              className="hp-reveal hp-signal"
              data-rv-skip
              data-shown="false"
              style={{ "--hp-reveal-delay": "180ms" }}
            >
              <span aria-hidden="true" className="hp-signal-icon">
                <span className="tano-title-mark" data-tone="fill">
                  <svg
                    viewBox="0 0 14 14"
                    width="100%"
                    height="100%"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M.5 2C.5 1.17157 1.17157.5 2 .5h10c.8284 0 1.5.67157 1.5 1.5v2.67544c0 3.99218-2.5546 7.53646-6.34189 8.79886-.10263.0343-.21359.0343-.31622 0C3.05457 12.2119.5 8.66762.5 4.67544V2Zm10.0606 2.49828c.2751-.30959.2473-.78364-.0623-1.05883-.3096-.27519-.78367-.2473-1.05886.06229L5.89792 7.48595 4.45 6.40001c-.33137-.24853-.80147-.18137-1.05.15-.24853.33137-.18137.80147.15 1.05l2 1.5c.31205.23404.75141.18981 1.01056-.10173l4.00004-4.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </span>
              <h3 className="tano-heading-sm">Cleared for Meta before you see them</h3>
              <p className="hp-sub tano-body-para-sm">
                Licensed music checked against Instagram’s own post data. No link stickers, no TV or
                film on screen, and no other brand in the frame.
              </p>
            </li>
          </ul>
        </div>
      </section>
      <section
        aria-labelledby="adloop-title"
        className="hp-band"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        <div className="hp-container hp-adloop-band">
          <BandHeading
            align="centre"
            cue
            cueText="Swipe to follow the ad →"
            subtitle="Run creator ads from your own Meta account and compare them creator by creator in the Tano Meta app. Tano reads every result and feeds it back, so winning hooks, formats and creators shape your next invitations, recommendations and licences."
            titleId="adloop-title"
          >
                <span className="hp-title-words">Every winning ad</span>
                <span className="hp-title-group">
                  <span className="hp-title-bind">
                    <span aria-hidden="true" className="hp-inline-icon" data-size="sm">
                      <span className="tano-title-mark" data-tone="fill">
                        <svg
                          viewBox="0 0 14 14"
                          width="100%"
                          height="100%"
                          fill="none"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M5.8335 1.25C5.8335 0.835786 5.49771 0.5 5.0835 0.5C4.66928 0.5 4.3335 0.835786 4.3335 1.25V12.7501C4.3335 13.1643 4.66928 13.5001 5.0835 13.5001C5.49771 13.5001 5.8335 13.1643 5.8335 12.7501V1.25ZM2 6.25C2 5.83579 1.66421 5.5 1.25 5.5C0.835786 5.5 0.5 5.83579 0.5 6.25V12.75C0.5 13.1642 0.835786 13.5 1.25 13.5C1.66421 13.5 2 13.1642 2 12.75V6.25ZM8.91699 5.5C9.33121 5.5 9.66699 5.83579 9.66699 6.25V12.75C9.66699 13.1642 9.33121 13.5 8.91699 13.5C8.50278 13.5 8.16699 13.1642 8.16699 12.75V6.25C8.16699 5.83579 8.50278 5.5 8.91699 5.5ZM13.5005 1.25C13.5005 0.835786 13.1647 0.5 12.7505 0.5C12.3363 0.5 12.0005 0.835786 12.0005 1.25V12.7501C12.0005 13.1643 12.3363 13.5001 12.7505 13.5001C13.1647 13.5001 13.5005 13.1643 13.5005 12.7501V1.25Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="hp-title-words">finds</span>
                  </span>
                  <span className="hp-title-words"> the next one.</span>
                </span>
          </BandHeading>
          <div className="hp-adloop-scroll">
            <div className="hp-adloop">
              <svg aria-hidden="true" className="hp-adloop-path" />
              <ol className="hp-adloop-steps">
                <li
                  className="hp-reveal hp-adloop-step"
                  data-rv-skip
                  data-shown="false"
                  style={{ "--hp-reveal-delay": "0ms" }}
                >
                  <p className="hp-adloop-label tano-body-mono-xs">
                    <span>01</span>Code shared
                  </p>
                  <div aria-hidden="true" className="hp-adloop-figure-wrap">
                    <div className="hp-adloop-card">
                      <span className="wire-lockup" data-size="md">
                        <span className="wire-lockup-ring">
                          <img
                            alt=""
                            width={96}
                            height={96}
                            decoding="async"
                            style={{ color: "transparent" }}
                            src="/sites/tano/images/avatar-03.jpg"
                           loading="lazy"/>
                        </span>
                        <span className="wire-lockup-who">
                          <span className="wire-lockup-handle">@slowsundayhome</span>
                        </span>
                      </span>
                      <p className="hp-adloop-code">
                        <span className="tano-body-mono-xs hp-adloop-soft">
                          Partnership ad code
                        </span>
                        <span className="tano-body-mono-sm">adcode-••••7F2K</span>
                      </p>
                    </div>
                  </div>
                  <p className="tano-body-sm hp-sub hp-adloop-caption">
                    Each creator shares a partnership ad code with their post, in the creator
                    portal.
                  </p>
                </li>
                <li
                  className="hp-reveal hp-adloop-step"
                  data-rv-skip
                  data-shown="false"
                  style={{ "--hp-reveal-delay": "140ms" }}
                >
                  <p className="hp-adloop-label tano-body-mono-xs">
                    <span>02</span>Ad measured
                  </p>
                  <div aria-hidden="true" className="hp-adloop-figure-wrap">
                    <div className="hp-adloop-card hp-adloop-paper">
                      <p className="hp-adloop-status tano-body-sm">
                        Active · partnership ad
                        <span aria-hidden="true" className="hp-adloop-switch" />
                      </p>
                      <div className="hp-adloop-figure">
                        <p className="hp-adloop-copy">
                          <span className="tano-body-sm hp-adloop-soft">Purchase ROAS</span>
                          <span className="tano-display-xs">3.40</span>
                        </p>
                        <p className="hp-adloop-copy hp-adloop-right">
                          <span className="tano-body-sm hp-adloop-soft">142 purchases</span>
                          <span className="tano-body-sm hp-adloop-soft" data-greek>
                            £1,840.00 spent
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="tano-body-sm hp-sub hp-adloop-caption">
                    Every ad is matched to its creator and post through the code, every day.
                  </p>
                </li>
                <li
                  className="hp-reveal hp-adloop-step"
                  data-rv-skip
                  data-shown="false"
                  style={{ "--hp-reveal-delay": "280ms" }}
                >
                  <p className="hp-adloop-label tano-body-mono-xs">
                    <span>03</span>Next round
                  </p>
                  <div aria-hidden="true" className="hp-adloop-figure-wrap">
                    <div className="hp-adloop-card">
                      <p className="hp-adloop-winner tano-body-mono-xs">Winner</p>
                      <p className="tano-body-lg hp-adloop-title">
                        Unboxing with the product in the first two seconds
                      </p>
                      <p className="hp-adloop-row tano-body-sm">
                        <span>Next invitation</span>
                        <span className="hp-adloop-next">
                          <span aria-hidden="true" className="hp-adloop-faces">
                            <span className="hp-adloop-face">
                              <img
                                alt=""
                                width={48}
                                height={48}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-05.jpg"
                               loading="lazy"/>
                            </span>
                            <span className="hp-adloop-face">
                              <img
                                alt=""
                                width={48}
                                height={48}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-08.jpg"
                               loading="lazy"/>
                            </span>
                            <span className="hp-adloop-face">
                              <img
                                alt=""
                                width={48}
                                height={48}
                                decoding="async"
                                style={{ color: "transparent" }}
                                src="/sites/tano/images/avatar-12.jpg"
                               loading="lazy"/>
                            </span>
                          </span>
                          <span className="hp-adloop-soft">12 creators</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="tano-body-sm hp-sub hp-adloop-caption">
                    What wins sets your next invitations, posts and licences.
                  </p>
                </li>
              </ol>
              <p className="hp-adloop-back tano-body-mono-xs">
                <span>More winners in the next round</span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="programme-title"
        className="hp-band"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        <div className="hp-container hp-uc-steps">
          <BandHeading
            align="centre"
            subtitle="Every round of creator content shapes the next. Tano’s agents manage thousands of creator relationships, with your team setting the creative direction and choosing what goes behind paid spend."
            titleId="programme-title"
          >
                <span className="hp-title-words">Recruit, post, amplify. Then do it</span>
                <span className="hp-title-group">
                  <span className="hp-title-bind">
                    <span aria-hidden="true" className="hp-inline-icon" data-size="sm">
                      <span className="tano-title-mark" data-tone="fill">
                        <svg
                          viewBox="0 0 14 14"
                          width="100%"
                          height="100%"
                          fill="none"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M2 1.25C2 .835786 1.66421.5 1.25.5.835786.5.5.835786.5 1.25v11.5c0 .4142.335786.75.75.75h11.5c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75H2V1.25Zm11.3569 2.98698c.2853-.47289.1332-1.08752-.3396-1.37282-.4729-.2853-1.0876-.13323-1.3729.33965L9.83395 6.2047 6.3639 4.73654c-.42925-.18161-.92704-.0426-1.20009.33513L2.85448 8.26639c-.32354.44759-.22298 1.07272.22461 1.39627.44759.32354 1.07272.22298 1.39626-.22461L6.3181 6.8888l3.53473 1.49552c.45807.19381.98897.0215 1.24587-.40437l2.2582-3.74297Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="hp-title-words">again,</span>
                  </span>
                  <span className="hp-title-words"> and again.</span>
                </span>
          </BandHeading>
          <div className="hp-uc-steps-track" style={{ "--uc-steps": 4 }}>
            <span aria-hidden="true" className="hp-uc-steps-line" />
            <ol className="hp-uc-steps-row">
              <li
                className="hp-reveal hp-uc-step"
                data-rv-skip
                data-shown="false"
                style={{ "--hp-reveal-delay": "0ms" }}
              >
                <span aria-hidden="true" className="hp-uc-step-node tano-body-mono-sm">
                  01
                </span>
                <div className="hp-uc-step-card">
                  <span aria-hidden="true" className="hp-uc-step-icon">
                    <span className="tano-title-mark" data-tone="fill">
                      <svg
                        viewBox="0 0 14 14"
                        width="100%"
                        height="100%"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M7.32399.694879c.02871.413221-.283.771471-.69622.800171-1.05236.07311-2.06161.44677-2.90786 1.07658-.84624.6298-1.4939 1.48929-1.86603 2.47634-.37214.98705-.45311 2.06018-.23329 3.09189.21982 1.03172.73119 1.97864 1.47336 2.72834.62062.6268 1.38083 1.0937 2.21519 1.3644.10698.4314.3577.83.74098 1.1175l.8679.6509c-.4816-.0063-.96349-.0622-1.43796-.1683-1.30973-.2929-2.50787-.9555-3.45208-1.9092S.433189 9.76503.153524 8.45244c-.279665-1.31259-.1766554-2.67787.29679-3.93363.473445-1.25577 1.297426-2.34924 2.374046-3.1505C3.90098.567044 5.18498.0916706 6.52382-.00133992c.41322-.02870658.77147.28300092.80017.69621892ZM8.6142 10.2731c.26638-.1315.51668-.29562.74485-.48942.46103-.39159.81715-.89192 1.03625-1.45575.15-.38609-.0414-.82069-.42748-.9707-.3861-.15001-.8207.04137-.97071.42747-.12877.33143-.33812.62553-.60912.85572-.27101.23018-.59512.38919-.94302.46263-.34791.07345-.70864.05902-1.04956-.04198-.34093-.10101-.6513-.2854-.90305-.53649-.25175-.2511-.43694-.56099-.53882-.90164-.10188-.34066-.11724-.70133-.04469-1.04941.07255-.34808.23072-.67259.46021-.94418s.52306-.4817.85417-.61132c.38571-.151.57598-.58608.42498-.97179-.15099-.38571-.58608-.57599-.97179-.42499-.56327.22051-1.06269.57794-1.4531 1.03997-.39041.46202-.65949 1.01408-.78291 1.60624-.12343.59217-.0973 1.20575.07602 1.78528.17332.57952.48837 1.1067.91664 1.53387.37373.37276.8234.65909 1.31728.84019.68295-.77574 1.85886-.9074 2.69977-.2767l.16408.123ZM11.1346.0181538c.1736.0480841.308.1858342.3516.3605932l.4273 1.708953 1.7089.42724c.1747.04369.3125.17801.3605.3516.0481.1736-.0009.35964-.1282.48702l-2 2c-.1242.12419-.3044.17412-.4748.13152l-1.44254-.36064L7.80497 7.2569c-.29289.29289-.76777.2929-1.06066.00001-.2929-.29289-.29291-.76776-.00002-1.06066l2.13247-2.13253-.36061-1.44244c-.04259-.17039.00733-.35063.13152-.47482L10.6476.146464c.1274-.127379.3134-.1763944.487-.1283102ZM13.8357 8.71855c.2588-.32345.2063-.79542-.1171-1.05417-.3235-.25876-.7954-.20632-1.0542.11713L9.1185 12.2139 7.70004 11.15c-.33137-.2485-.80147-.1813-1.05.15-.24852.3314-.18137.8015.15 1.05l2 1.5c.32408.2431.7826.1849 1.03566-.1315l4-4.99995Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>
                  <h3 className="tano-heading-sm">We set the standard for content</h3>
                  <p className="hp-sub tano-body-md">
                    Tell us what your team needs: demonstrations, tutorials, and everyday product
                    stories. You review the first creators and their work, and your feedback becomes
                    Creator Personas: the quality standard every later recruit is measured against.
                  </p>
                </div>
              </li>
              <li
                className="hp-reveal hp-uc-step"
                data-rv-skip
                data-shown="false"
                style={{ "--hp-reveal-delay": "90ms" }}
              >
                <span aria-hidden="true" className="hp-uc-step-node tano-body-mono-sm">
                  02
                </span>
                <div className="hp-uc-step-card">
                  <span aria-hidden="true" className="hp-uc-step-icon">
                    <span className="tano-title-mark" data-tone="fill">
                      <svg
                        viewBox="0 0 14 14"
                        width="100%"
                        height="100%"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M5.65796 0h2.68413c-.02712.0894741-.04726.181794-.05988.276263L7.91858 3H6.08146L5.71783.276263C5.70522.181794 5.68508.0894741 5.65796 0Zm5.62384 9.70615c0-2.36479-1.91706-4.28183-4.28185-4.28183S2.71812 7.34136 2.71812 9.70615c0 2.36475 1.91704 4.28185 4.28183 4.28185s4.28185-1.9171 4.28185-4.28185Zm-4.90723-.81644.48212-.96985c.01395-.02694.03515-.04944.06122-.06495.02606-.01552.05595-.02343.08628-.02285.03033.00058.05989.00964.08534.02615.02545.0165.04577.0398.05867.06726l.48212.96984c.01078.02453.02788.04576.04955.06152.02167.01576.04713.02548.07379.02818l1.07075.15697c.02946.00477.05704.01756.07971.03697.02268.0194.03957.04468.04883.07305.00927.02837.01054.05874.00369.08779-.00685.02904-.02157.05564-.04253.07688l-.79046.75683c-.01633.0201-.02744.0439-.03233.0693-.00489.0255-.00341.0517.0043.0764l.1794 1.0652c.00646.0308.00384.0628-.00752.0921-.01137.0293-.031.0547-.05652.0731s-.05582.029-.08725.0306c-.03142.0015-.0626-.0062-.08977-.022l-.95303-.5046c-.02466-.0111-.05142-.0169-.07848-.0169-.02707 0-.05382.0058-.07849.0169l-.95302.5046c-.02717.0158-.05836.0235-.08978.022-.03142-.0016-.06173-.0122-.08725-.0306-.02551-.0184-.04515-.0438-.05651-.0731-.01137-.0293-.01398-.0613-.00752-.0921l.15136-1.0652c.01178-.0224.01794-.0474.01794-.0728 0-.0254-.00616-.0504-.01794-.0729l-.79045-.75122c-.02262-.02102-.03878-.04804-.0466-.0779-.00782-.02986-.00698-.06133.00243-.09074.00941-.0294.027-.05551.0507-.07529.02371-.01977.05255-.03239.08316-.03637l1.07076-.16258c.02665-.0027.05212-.01242.07379-.02818.02166-.01576.03876-.03699.04954-.06151ZM9.82138.0408243C9.65027.10628 9.52867.260069 9.50442.441655L8.95848 4.53097c1.20352.45572 2.20662 1.31923 2.84052 2.4219l1.6249-2.43727c.4212-.63182.3038-1.47875-.2734-1.97219L10.3249.127773c-.1392-.11904402-.33242-.1524041-.50352-.0869487ZM5.0416 4.5309c-1.20356.45568-2.20665 1.31916-2.84065 2.42181L.576204 4.5156C.154989 3.88378.272379 3.03685.84956 2.54341L3.67516.127773c.13925-.11904402.33245-.1524041.50355-.0869487.17111.0654557.29272.2192447.31696.4008307L5.0416 4.5309Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>
                  <h3 className="tano-heading-sm">We keep creators posting with rewards</h3>
                  <p className="hp-sub tano-body-md">
                    Creators choose from an agreed product range and share their experience in their
                    own words. Tano manages outreach, onboarding, gifting and follow-up, whilst
                    rewards give creators a reason to return. Monthly output targets are set against
                    what your product costs to seed, so your volume never outruns your margin.
                  </p>
                </div>
              </li>
              <li
                className="hp-reveal hp-uc-step"
                data-rv-skip
                data-shown="false"
                style={{ "--hp-reveal-delay": "180ms" }}
              >
                <span aria-hidden="true" className="hp-uc-step-node tano-body-mono-sm">
                  03
                </span>
                <div className="hp-uc-step-card">
                  <span aria-hidden="true" className="hp-uc-step-icon">
                    <span className="tano-title-mark" data-tone="fill">
                      <svg
                        viewBox="0 0 14 14"
                        width="100%"
                        height="100%"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M1 .5C.723858.5.5.723858.5 1v12c0 .2761.223858.5.5.5h12c.2761 0 .5-.2239.5-.5V1c0-.276142-.2239-.5-.5-.5H1ZM10.5 2h-7v4.25h7V2Zm-7 5.75h7V12h-7V7.75Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>
                  <h3 className="tano-heading-sm">We turn the strongest content into ads</h3>
                  <p className="hp-sub tano-body-md">
                    Shop organic posts to test, or invite a proven creator to make something
                    specific. Tano manages the invitation, delivery, payment, and usage rights. Fees
                    and licence terms are agreed before content runs.
                  </p>
                </div>
              </li>
              <li
                className="hp-reveal hp-uc-step"
                data-rv-skip
                data-shown="false"
                style={{ "--hp-reveal-delay": "270ms" }}
              >
                <span aria-hidden="true" className="hp-uc-step-node tano-body-mono-sm">
                  04
                </span>
                <div className="hp-uc-step-card">
                  <span aria-hidden="true" className="hp-uc-step-icon">
                    <span className="tano-title-mark" data-tone="fill">
                      <svg
                        viewBox="0 0 14 14"
                        width="100%"
                        height="100%"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M5.8335 1.25C5.8335 0.835786 5.49771 0.5 5.0835 0.5C4.66928 0.5 4.3335 0.835786 4.3335 1.25V12.7501C4.3335 13.1643 4.66928 13.5001 5.0835 13.5001C5.49771 13.5001 5.8335 13.1643 5.8335 12.7501V1.25ZM2 6.25C2 5.83579 1.66421 5.5 1.25 5.5C0.835786 5.5 0.5 5.83579 0.5 6.25V12.75C0.5 13.1642 0.835786 13.5 1.25 13.5C1.66421 13.5 2 13.1642 2 12.75V6.25ZM8.91699 5.5C9.33121 5.5 9.66699 5.83579 9.66699 6.25V12.75C9.66699 13.1642 9.33121 13.5 8.91699 13.5C8.50278 13.5 8.16699 13.1642 8.16699 12.75V6.25C8.16699 5.83579 8.50278 5.5 8.91699 5.5ZM13.5005 1.25C13.5005 0.835786 13.1647 0.5 12.7505 0.5C12.3363 0.5 12.0005 0.835786 12.0005 1.25V12.7501C12.0005 13.1643 12.3363 13.5001 12.7505 13.5001C13.1647 13.5001 13.5005 13.1643 13.5005 12.7501V1.25Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>
                  <h3 className="tano-heading-sm">We iterate on your programme over time</h3>
                  <p className="hp-sub tano-body-md">
                    Your team’s selections and paid results help refine future recruitment, coaching
                    and invitations. Tano also tests outreach, gifting, and rewards to learn what
                    keeps the right creators contributing.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="creator-grid-title"
        className="hp-band"
        data-ground="light"
        data-padding="xl"
      >
        <div className="hp-container hp-uc-split">
          <div
            className="hp-reveal hp-uc-grid-card-wrap"
            data-rv-skip
            data-shown="false"
            style={{ "--hp-reveal-delay": "0ms" }}
          >
            <span aria-hidden="true" className="hp-uc-grid-ground wire-glass" data-rim="true">
              <img
                alt=""
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
                src="/sites/tano/images/occasion-glass.jpg"
               loading="lazy"/>
            </span>
            <div aria-hidden="true" className="hp-uc-grid-card">
              <span className="hp-uc-tile-label">Creators this week</span>
              <ul className="hp-uc-grid-rows">
                <li className="hp-uc-grid-row" data-picked>
                  <span className="hp-objective-ring">
                    <img
                      alt=""
                      width={88}
                      height={88}
                      decoding="async"
                      style={{ color: "transparent" }}
                      src="/sites/tano/images/jessebuck.jpg"
                     loading="lazy"/>
                  </span>
                  <span className="hp-uc-grid-who">
                    <span className="hp-uc-grid-handle tano-body-mono-xs">@jessebuck_</span>
                    <span className="hp-uc-grid-state tano-body-sm" data-tone="waiting">
                      Waiting on delivery
                    </span>
                  </span>
                  <span className="hp-uc-grid-action tano-body-sm">Tracking update sent</span>
                </li>
                <li className="hp-uc-grid-row" data-picked>
                  <span className="hp-objective-ring">
                    <img
                      alt=""
                      width={88}
                      height={88}
                      decoding="async"
                      style={{ color: "transparent" }}
                      src="/sites/tano/images/cherrrymyint.jpg"
                     loading="lazy"/>
                  </span>
                  <span className="hp-uc-grid-who">
                    <span className="hp-uc-grid-handle tano-body-mono-xs">@cherrrymyint</span>
                    <span className="hp-uc-grid-state tano-body-sm" data-tone="attention">
                      Posted, no reply yet
                    </span>
                  </span>
                  <span className="hp-uc-grid-action tano-body-sm">Feedback on the post sent</span>
                </li>
                <li className="hp-uc-grid-row" data-picked>
                  <span className="hp-objective-ring">
                    <img
                      alt=""
                      width={88}
                      height={88}
                      decoding="async"
                      style={{ color: "transparent" }}
                      src="/sites/tano/images/reginafoster.jpg"
                     loading="lazy"/>
                  </span>
                  <span className="hp-uc-grid-who">
                    <span className="hp-uc-grid-handle tano-body-mono-xs">@reginafoster.us</span>
                    <span className="hp-uc-grid-state tano-body-sm" data-tone="progress">
                      One post from a reward
                    </span>
                  </span>
                  <span className="hp-uc-grid-action tano-body-sm">Reward reminder sent</span>
                </li>
                <li className="hp-uc-grid-row" data-crowd>
                  <span className="hp-uc-grid-greek-face" />
                  <span className="hp-uc-grid-greek-lines">
                    <span className="hp-uc-grid-greek" style={{ width: "44%" }} />
                    <span className="hp-uc-grid-greek" style={{ width: "30%" }} />
                  </span>
                </li>
                <li className="hp-uc-grid-row" data-crowd>
                  <span className="hp-uc-grid-greek-face" />
                  <span className="hp-uc-grid-greek-lines">
                    <span className="hp-uc-grid-greek" style={{ width: "36%" }} />
                    <span className="hp-uc-grid-greek" style={{ width: "26%" }} />
                  </span>
                </li>
                <li className="hp-uc-grid-row" data-crowd>
                  <span className="hp-uc-grid-greek-face" />
                  <span className="hp-uc-grid-greek-lines">
                    <span className="hp-uc-grid-greek" style={{ width: "48%" }} />
                    <span className="hp-uc-grid-greek" style={{ width: "34%" }} />
                  </span>
                </li>
                <li className="hp-uc-grid-row" data-crowd>
                  <span className="hp-uc-grid-greek-face" />
                  <span className="hp-uc-grid-greek-lines">
                    <span className="hp-uc-grid-greek" style={{ width: "32%" }} />
                    <span className="hp-uc-grid-greek" style={{ width: "24%" }} />
                  </span>
                </li>
                <li className="hp-uc-grid-row" data-crowd>
                  <span className="hp-uc-grid-greek-face" />
                  <span className="hp-uc-grid-greek-lines">
                    <span className="hp-uc-grid-greek" style={{ width: "40%" }} />
                    <span className="hp-uc-grid-greek" style={{ width: "28%" }} />
                  </span>
                </li>
                <li className="hp-uc-grid-row" data-crowd>
                  <span className="hp-uc-grid-greek-face" />
                  <span className="hp-uc-grid-greek-lines">
                    <span className="hp-uc-grid-greek" style={{ width: "44%" }} />
                    <span className="hp-uc-grid-greek" style={{ width: "30%" }} />
                  </span>
                </li>
                <li className="hp-uc-grid-row" data-crowd>
                  <span className="hp-uc-grid-greek-face" />
                  <span className="hp-uc-grid-greek-lines">
                    <span className="hp-uc-grid-greek" style={{ width: "36%" }} />
                    <span className="hp-uc-grid-greek" style={{ width: "26%" }} />
                  </span>
                </li>
                <li className="hp-uc-grid-row" data-crowd>
                  <span className="hp-uc-grid-greek-face" />
                  <span className="hp-uc-grid-greek-lines">
                    <span className="hp-uc-grid-greek" style={{ width: "48%" }} />
                    <span className="hp-uc-grid-greek" style={{ width: "34%" }} />
                  </span>
                </li>
                <li className="hp-uc-grid-row" data-crowd>
                  <span className="hp-uc-grid-greek-face" />
                  <span className="hp-uc-grid-greek-lines">
                    <span className="hp-uc-grid-greek" style={{ width: "32%" }} />
                    <span className="hp-uc-grid-greek" style={{ width: "24%" }} />
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <BandHeading
            align="start"
            subtitle="One is waiting on a delivery, one has posted and heard nothing back, and one is a single post away from their next reward. Tano holds the whole history of every creator: products, posts, payouts and conversations, so our agents can follow up with support that fits, and every interaction is measured in your reporting."
            titleId="creator-grid-title"
          >
                <span className="hp-title-words">
                  Thousands of creators. Personal support at every stage.
                </span>
          </BandHeading>
        </div>
      </section>
      <section
        aria-labelledby="licences-title"
        className="hp-band"
        data-ground="light"
        data-padding="xl"
      >
        <div className="hp-container hp-uc-split">
          <BandHeading
            align="start"
            subtitle="Pick a post, or take one of Tano’s recommendations. We check ad suitability, agree the fee and usage period, collect the signed licence, and pay the creator. You can see when every licence expires, and renew before it does."
            titleId="licences-title"
          >
                <span className="hp-title-words">Usage rights, cleared before anything runs.</span>
          </BandHeading>
          <div
            className="hp-reveal hp-uc-licence-card-wrap"
            data-rv-skip
            data-shown="false"
            style={{ "--hp-reveal-delay": "0ms" }}
          >
            <span aria-hidden="true" className="hp-uc-licence-ground wire-glass" data-rim="true">
              <img
                alt=""
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
                src="/sites/tano/images/products-glass.jpg"
               loading="lazy"/>
            </span>
            <div aria-hidden="true" className="hp-uc-licence-card">
              <span className="hp-uc-tile-label">Usage licences</span>
              <ul className="hp-uc-licence-rows">
                <li className="hp-uc-licence-row" data-soon="true">
                  <span className="hp-uc-licence-post">
                    <span className="hp-uc-licence-thumb">
                      <img
                        alt=""
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
                        src="/sites/tano/images/papier.jpg"
                       loading="lazy"/>
                    </span>
                    <span className="hp-uc-tile-stack">
                      <span className="hp-uc-licence-title tano-body-sm">Desk set-up</span>
                      <span className="hp-uc-licence-ends" data-soon="true">
                        <span aria-hidden="true" className="hp-uc-licence-dot" />
                        Ends in 9 days
                      </span>
                    </span>
                  </span>
                  <span className="hp-uc-licence-lane">
                    <span
                      className="hp-uc-licence-bar"
                      style={{ "--uc-start": 0, "--uc-span": "0.04" }}
                    />
                  </span>
                  <span className="hp-uc-licence-renew">Renew</span>
                </li>
                <li className="hp-uc-licence-row">
                  <span className="hp-uc-licence-post">
                    <span className="hp-uc-licence-thumb">
                      <img
                        alt=""
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
                        src="/sites/tano/images/bloom-and-wild-2.jpg"
                       loading="lazy"/>
                    </span>
                    <span className="hp-uc-tile-stack">
                      <span className="hp-uc-licence-title tano-body-sm">Bouquet unboxing</span>
                      <span className="hp-uc-licence-ends">
                        <span aria-hidden="true" className="hp-uc-licence-dot" />
                        Ends 30 Jan
                      </span>
                    </span>
                  </span>
                  <span className="hp-uc-licence-lane">
                    <span
                      className="hp-uc-licence-bar"
                      style={{ "--uc-start": 0, "--uc-span": "0.5" }}
                    />
                  </span>
                </li>
                <li className="hp-uc-licence-row">
                  <span className="hp-uc-licence-post">
                    <span className="hp-uc-licence-thumb">
                      <img
                        alt=""
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
                        src="/sites/tano/images/peachies.jpg"
                       loading="lazy"/>
                    </span>
                    <span className="hp-uc-tile-stack">
                      <span className="hp-uc-licence-title tano-body-sm">Bath-time routine</span>
                      <span className="hp-uc-licence-ends">
                        <span aria-hidden="true" className="hp-uc-licence-dot" />
                        Ends 14 Mar
                      </span>
                    </span>
                  </span>
                  <span className="hp-uc-licence-lane">
                    <span
                      className="hp-uc-licence-bar"
                      style={{ "--uc-start": 0, "--uc-span": "0.78" }}
                    />
                  </span>
                </li>
                <li className="hp-uc-licence-row" data-crowd>
                  <span className="hp-uc-licence-greek-thumb" />
                  <span className="hp-uc-tile-stack">
                    <span className="hp-uc-licence-greek" style={{ width: "52%" }} />
                    <span className="hp-uc-licence-greek" style={{ width: "30%" }} />
                  </span>
                </li>
                <li className="hp-uc-licence-row" data-crowd>
                  <span className="hp-uc-licence-greek-thumb" />
                  <span className="hp-uc-tile-stack">
                    <span className="hp-uc-licence-greek" style={{ width: "44%" }} />
                    <span className="hp-uc-licence-greek" style={{ width: "26%" }} />
                  </span>
                </li>
                <li className="hp-uc-licence-row" data-crowd>
                  <span className="hp-uc-licence-greek-thumb" />
                  <span className="hp-uc-tile-stack">
                    <span className="hp-uc-licence-greek" style={{ width: "58%" }} />
                    <span className="hp-uc-licence-greek" style={{ width: "32%" }} />
                  </span>
                </li>
                <li className="hp-uc-licence-row" data-crowd>
                  <span className="hp-uc-licence-greek-thumb" />
                  <span className="hp-uc-tile-stack">
                    <span className="hp-uc-licence-greek" style={{ width: "40%" }} />
                    <span className="hp-uc-licence-greek" style={{ width: "24%" }} />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="case-feature-title"
        className="hp-band"
        data-ground="light"
        data-padding="xl"
      >
        <div className="hp-container">
          <div className="hp-uc-case-wrap" style={{ "--uc-case-accent": "#661932" }}>
            <div
              className="hp-reveal hp-uc-case"
              data-rv-skip
              data-shown="false"
              style={{ "--hp-reveal-delay": "0ms" }}
            >
              <div className="hp-uc-case-media">
                <span className="hp-uc-case-ground hp-behind">
                  <img
                    alt="Bloom & Wild letterbox flowers arranged at home"
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
                    src="/sites/tano/extras/c1cd2ee5d91ca6b52ed6360a47d27429ac6a3cdf-1240x1240.jpg"
                   loading="lazy"/>
                </span>
                <span className="hp-uc-tile" data-slot="case">
                  <span aria-hidden="true" className="hp-uc-tile-rule" />
                  <span className="hp-uc-tile-stack">
                    <span className="hp-uc-tile-figure tano-heading-lg">
                      <span>
                        <span aria-hidden="true">+125%</span>
                        <span className="wire-visually-hidden">+125%</span>
                      </span>
                    </span>
                    <span className="hp-uc-tile-note tano-body-sm">Higher CTR</span>
                  </span>
                </span>
              </div>
              <div className="hp-uc-case-copy">
                <div className="hp-uc-case-head">
                  <span
                    aria-label="Bloom & Wild"
                    className="hp-uc-case-logo"
                    role="img"
                    style={{
                      "--logo":
                        'url("/sites/tano/extras/4429822d71913b1f6b59672b8e6a3556abf46296-1560x725.png")',
                      "--logo-aspect": "2.1517241379310343",
                    }}
                  />
                  <h2 className="tano-heading-lg" id="case-feature-title">
                    How Bloom &amp; Wild made creators a revenue channel
                  </h2>
                </div>
                <span aria-hidden="true" className="hp-uc-case-divider" />
                <blockquote className="hp-uc-case-quote tano-body-para-lg">
                  “Loving this — the ease of requesting paid ads and the clean view of exactly what
                  we have the rights to is brilliant.”
                </blockquote>
                <div className="hp-uc-case-foot">
                  <span className="hp-uc-case-who">
                    <span className="hp-uc-face">
                      <img
                        alt=""
                        width={72}
                        height={72}
                        decoding="async"
                        style={{ color: "transparent" }}
                        src="/sites/tano/images/tano-30.jpg"
                       loading="lazy"/>
                    </span>
                    <span className="hp-uc-tile-stack">
                      <span className="tano-body-sm">Yasmin MacDonnell</span>
                      <span className="hp-sub tano-body-sm">
                        Marketing Manager · Bloom &amp; Wild
                      </span>
                    </span>
                  </span>
                  <span className="hp-uc-case-actions">
                    <ButtonLink href={"/case-studies/bloom-and-wild"} label={"Read the case study"} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="tracking-title"
        className="hp-band"
        data-ground="light"
        data-padding="xl"
      >
        <div className="hp-container">
          <div className="hp-track">
            <div className="hp-track-copy">
              <BandHeading
                align="start"
                subtitle="Inform every decision with real-time data, all in Tano."
                titleId="tracking-title"
              >
                    <span className="hp-title-words">Everything</span>
                    <span className="hp-title-group">
                      <span className="hp-title-bind">
                        <span aria-hidden="true" className="hp-inline-icon" data-size="sm">
                          <span className="tano-title-mark" data-tone="fill">
                            <svg
                              viewBox="0 0 14 14"
                              width="100%"
                              height="100%"
                              fill="none"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                d="M5.8335 1.25C5.8335 0.835786 5.49771 0.5 5.0835 0.5C4.66928 0.5 4.3335 0.835786 4.3335 1.25V12.7501C4.3335 13.1643 4.66928 13.5001 5.0835 13.5001C5.49771 13.5001 5.8335 13.1643 5.8335 12.7501V1.25ZM2 6.25C2 5.83579 1.66421 5.5 1.25 5.5C0.835786 5.5 0.5 5.83579 0.5 6.25V12.75C0.5 13.1642 0.835786 13.5 1.25 13.5C1.66421 13.5 2 13.1642 2 12.75V6.25ZM8.91699 5.5C9.33121 5.5 9.66699 5.83579 9.66699 6.25V12.75C9.66699 13.1642 9.33121 13.5 8.91699 13.5C8.50278 13.5 8.16699 13.1642 8.16699 12.75V6.25C8.16699 5.83579 8.50278 5.5 8.91699 5.5ZM13.5005 1.25C13.5005 0.835786 13.1647 0.5 12.7505 0.5C12.3363 0.5 12.0005 0.835786 12.0005 1.25V12.7501C12.0005 13.1643 12.3363 13.5001 12.7505 13.5001C13.1647 13.5001 13.5005 13.1643 13.5005 12.7501V1.25Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </span>
                        <span className="hp-title-words">tracked</span>
                      </span>
                    </span>
                    <span className="hp-title-words">in one place.</span>
              </BandHeading>
              <div className="hp-track-arrows">
                <button
                  aria-label="Previous"
                  className="hp-arrow-button"
                  data-direction="previous"
                  type="button"
                >
                  <span aria-hidden="true">
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
                </button>
                <button
                  aria-label="Pause"
                  className="hp-arrow-button"
                  data-control="play"
                  type="button"
                >
                  <span aria-hidden="true">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      focusable="false"
                      height="100%"
                      viewBox="0 0 14 14"
                      width="100%"
                    >
                      <rect fill="currentColor" height={13} rx="1.25" width={4} x={2} y="0.5" />
                      <rect fill="currentColor" height={13} rx="1.25" width={4} x={8} y="0.5" />
                    </svg>
                  </span>
                </button>
                <button
                  aria-label="Next"
                  className="hp-arrow-button"
                  data-direction="next"
                  type="button"
                >
                  <span aria-hidden="true">
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
                </button>
              </div>
            </div>
            <div className="hp-track-stage">
              <span aria-hidden="true" className="hp-track-ground wire-glass" data-rim="true">
                <img
                  alt=""
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
                  src="/sites/tano/extras/1d409d97d28fbe2eb6df78b95f3c1452248f6b21-400x400.jpg"
                 loading="lazy"/>
              </span>
              <div className="hp-track-cards">
                <article className="hp-track-card" data-live="true">
                  <div className="hp-track-product">
                    <div className="hp-tm" data-micro="recommendation">
                      <span className="hp-tm-label tano-body-mono-xs">Post recommended</span>
                      <div className="hp-tm-split">
                        <span className="hp-tm-reel">
                          <img
                            alt=""
                            width={135}
                            height={240}
                            decoding="async"
                            className="hp-tm-reel-poster"
                            style={{ color: "transparent" }}
                            src="/sites/tano/images/comp-vase-glass.jpg"
                           loading="lazy"/>
                          <span aria-hidden="true" className="hp-tm-play">
                            <svg
                              viewBox="0 0 14 14"
                              width="100%"
                              height="100%"
                              fill="none"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                d="M3.00283.5c-.27961 0-.55454.071214-.7989.206831-.24906.127096-.45929.319089-.60841.555799-.1514.24031-.23403.51751-.23893.80149l-.00007 0v9.86318h-.00007l.00014.0086c.0049.284.08753.5612.23893.8015.14912.2367.35935.4287.60841.5558.24436.1356.51929.2068.7989.2068.2838 0 .56278-.0734.80987-.213.00575-.0032.01143-.0066.01704-.0101L11.806 8.34363c.2475-.12503.4564-.3152.604-.55027.1528-.24322.2339-.52462.2339-.81185s-.0811-.56863-.2339-.81185c-.1478-.23533-.357-.42566-.6048-.55069L3.82831.722179C3.82317.719019 3.81796.715952 3.8127.71298 3.56561.573367 3.28663.5 3.00283.5Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span className="hp-tm-chip hp-tm-badge tano-body-xs" data-done>
                            Top pick
                          </span>
                        </span>
                        <span className="hp-tm-lines">
                          <span
                            aria-hidden="true"
                            className="hp-tm-greek"
                            style={{ width: "84%" }}
                          />
                          <span
                            aria-hidden="true"
                            className="hp-tm-greek"
                            style={{ width: "62%" }}
                          />
                          <span
                            aria-hidden="true"
                            className="hp-tm-greek"
                            style={{ width: "72%" }}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hp-track-note">
                    <h3 className="tano-heading-sm">Get recommendations</h3>
                    <p className="hp-sub tano-body-sm">
                      The strongest posts are surfaced for you, ranked on content fit and organic
                      performance. Your team still chooses what goes behind spend.
                    </p>
                  </div>
                </article>
                <article aria-hidden="true" className="hp-track-card" data-live="false" inert>
                  <div className="hp-track-product">
                    <div className="hp-tm" data-micro="meta">
                      <span className="hp-tm-label tano-body-mono-xs">Meta Ads</span>
                      <span className="hp-tm-ad">
                        <span className="tano-body-sm">Ad set · creator-led</span>
                        <span className="hp-tm-chip tano-body-xs">
                          <span aria-hidden="true" className="hp-tm-live-dot" />
                          Live in Meta
                        </span>
                      </span>
                      <span className="hp-tm-lines">
                        <span aria-hidden="true" className="hp-tm-greek" style={{ width: "90%" }} />
                        <span aria-hidden="true" className="hp-tm-greek" style={{ width: "64%" }} />
                      </span>
                    </div>
                  </div>
                  <div className="hp-track-note">
                    <h3 className="tano-heading-sm">Meta integration</h3>
                    <p className="hp-sub tano-body-sm">
                      Creator ads run and report inside your own ad account, with performance
                      tracked creator by creator and licence end dates enforced automatically.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="metrics-title"
        className="hp-band"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        <div className="hp-container hp-stats hp-uc-metrics">
          <BandHeading
            align="centre"
            cue
            cueText="Swipe to see every metric →"
            titleId="metrics-title"
          >
                <span className="hp-title-words">Key</span>
                <span className="hp-title-group">
                  <span className="hp-title-bind">
                    <span aria-hidden="true" className="hp-inline-icon" data-size="sm">
                      <span className="tano-title-mark" data-tone="fill">
                        <svg
                          viewBox="0 0 14 14"
                          width="100%"
                          height="100%"
                          fill="none"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M12.75 12C13.1642 12 13.5 12.3358 13.5 12.75C13.5 13.1642 13.1642 13.5 12.75 13.5H12.2502C12.2501 13.5 12.2501 13.5 12.25 13.5H10.75C10.7499 13.5 10.7497 13.5 10.7496 13.5H8.75058C8.75039 13.5 8.75019 13.5 8.75 13.5H7.25C7.24977 13.5 7.24955 13.5 7.24932 13.5L5.2508 13.5C5.25053 13.5 5.25027 13.5 5.25 13.5H3.75C3.74971 13.5 3.74942 13.5 3.74914 13.5H1.25C0.835787 13.5 0.5 13.1642 0.5 12.75V1.25C0.5 0.835787 0.835787 0.5 1.25 0.5C1.66421 0.5 2 0.835787 2 1.25L2 12H3.25L3.25 4.5C3.25 4.36739 3.30268 4.24022 3.39645 4.14645C3.49021 4.05268 3.61739 4 3.75 4H5.25C5.52614 4 5.75 4.22386 5.75 4.5L5.75 12H6.75L6.75 1C6.75 0.723859 6.97386 0.5 7.25 0.5H8.75C8.88261 0.5 9.00978 0.552679 9.10355 0.646447C9.19732 0.740215 9.25 0.867392 9.25 1V12H10.25V7C10.25 6.86739 10.3027 6.74022 10.3964 6.64645C10.4902 6.55268 10.6174 6.5 10.75 6.5H12.25C12.3826 6.5 12.5098 6.55268 12.6036 6.64645C12.6973 6.74022 12.75 6.86739 12.75 7V12Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="hp-title-words">metrics,</span>
                  </span>
                </span>
                <span className="hp-title-words">reported for you monthly.</span>
          </BandHeading>
          <ul className="hp-stat-row hp-uc-metrics-row">
            <li
              className="hp-reveal hp-stat"
              data-rv-skip
              data-shown="false"
              style={{ "--hp-reveal-delay": "0ms" }}
            >
              <div className="hp-stat-head">
                <svg
                  aria-hidden="true"
                  className="hp-stat-graphic"
                  data-graphic="barGraphIncline"
                  focusable="false"
                  preserveAspectRatio="xMinYMid meet"
                  viewBox="0 0 321 117"
                >
                  <g fill="url(#hp-stat-spectrum-svg1)">
                    <rect
                      className="hp-stat-bar"
                      height={5}
                      rx="2.5"
                      style={{ "--hp-stat-step": 0 }}
                      width={5}
                      x={10}
                      y={100}
                    />
                    <rect
                      className="hp-stat-bar"
                      height="5.345223678577133"
                      rx="2.5"
                      style={{ "--hp-stat-step": 1 }}
                      width={5}
                      x="19.6"
                      y="99.65477632142287"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="6.046522497542043"
                      rx="2.5"
                      style={{ "--hp-stat-step": 2 }}
                      width={5}
                      x="29.2"
                      y="98.95347750245796"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="7.002140650731823"
                      rx="2.5"
                      style={{ "--hp-stat-step": 3 }}
                      width={5}
                      x="38.8"
                      y="97.99785934926818"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="8.172462973500624"
                      rx="2.5"
                      style={{ "--hp-stat-step": 4 }}
                      width={5}
                      x="48.4"
                      y="96.82753702649937"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="9.533697952606946"
                      rx="2.5"
                      style={{ "--hp-stat-step": 5 }}
                      width={5}
                      x={58}
                      y="95.46630204739306"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="11.069355505596267"
                      rx="2.5"
                      style={{ "--hp-stat-step": 6 }}
                      width={5}
                      x="67.6"
                      y="93.93064449440374"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="12.767073947769271"
                      rx="2.5"
                      style={{ "--hp-stat-step": 7 }}
                      width={5}
                      x="77.2"
                      y="92.23292605223072"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="14.617109371151466"
                      rx="2.5"
                      style={{ "--hp-stat-step": 8 }}
                      width={5}
                      x="86.8"
                      y="90.38289062884853"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="16.61150707226827"
                      rx="2.5"
                      style={{ "--hp-stat-step": 9 }}
                      width={5}
                      x="96.39999999999999"
                      y="88.38849292773173"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="18.743602188641244"
                      rx="2.5"
                      style={{ "--hp-stat-step": 10 }}
                      width={5}
                      x={106}
                      y="86.25639781135875"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="21.007697625551355"
                      rx="2.5"
                      style={{ "--hp-stat-step": 11 }}
                      width={5}
                      x="115.6"
                      y="83.99230237444864"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="23.39884537574671"
                      rx="2.5"
                      style={{ "--hp-stat-step": 12 }}
                      width={5}
                      x="125.19999999999999"
                      y="81.6011546242533"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="25.912691921012073"
                      rx="2.5"
                      style={{ "--hp-stat-step": 13 }}
                      width={5}
                      x="134.8"
                      y="79.08730807898793"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="28.545365311890404"
                      rx="2.5"
                      style={{ "--hp-stat-step": 14 }}
                      width={5}
                      x="144.4"
                      y="76.45463468810959"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="31.29339043737093"
                      rx="2.5"
                      style={{ "--hp-stat-step": 15 }}
                      width={5}
                      x={154}
                      y="73.70660956262907"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="34.15362399159335"
                      rx="2.5"
                      style={{ "--hp-stat-step": 16 }}
                      width={5}
                      x="163.6"
                      y="70.84637600840665"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="37.12320358622937"
                      rx="2.5"
                      style={{ "--hp-stat-step": 17 }}
                      width={5}
                      x="173.2"
                      y="67.87679641377062"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="40.199507263179335"
                      rx="2.5"
                      style={{ "--hp-stat-step": 18 }}
                      width={5}
                      x="182.79999999999998"
                      y="64.80049273682067"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="43.380120810982156"
                      rx="2.5"
                      style={{ "--hp-stat-step": 19 }}
                      width={5}
                      x="192.4"
                      y="61.619879189017844"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="46.6628110417042"
                      rx="2.5"
                      style={{ "--hp-stat-step": 20 }}
                      width={5}
                      x={202}
                      y="58.3371889582958"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="50.04550369245446"
                      rx="2.5"
                      style={{ "--hp-stat-step": 21 }}
                      width={5}
                      x="211.6"
                      y="54.95449630754554"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="53.5262649654747"
                      rx="2.5"
                      style={{ "--hp-stat-step": 22 }}
                      width={5}
                      x="221.2"
                      y="51.4737350345253"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="57.10328596696737"
                      rx="2.5"
                      style={{ "--hp-stat-step": 23 }}
                      width={5}
                      x="230.79999999999998"
                      y="47.89671403303263"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="60.77486948136503"
                      rx="2.5"
                      style={{ "--hp-stat-step": 24 }}
                      width={5}
                      x="240.39999999999998"
                      y="44.22513051863497"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="64.5394186464529"
                      rx="2.5"
                      style={{ "--hp-stat-step": 25 }}
                      width={5}
                      x={250}
                      y="40.4605813535471"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="68.39542719001233"
                      rx="2.5"
                      style={{ "--hp-stat-step": 26 }}
                      width={5}
                      x="259.6"
                      y="36.60457280998767"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="72.34147096012161"
                      rx="2.5"
                      style={{ "--hp-stat-step": 27 }}
                      width={5}
                      x="269.2"
                      y="32.65852903987839"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="76.3762005355431"
                      rx="2.5"
                      style={{ "--hp-stat-step": 28 }}
                      width={5}
                      x="278.8"
                      y="28.623799464456894"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="80.49833474434466"
                      rx="2.5"
                      style={{ "--hp-stat-step": 29 }}
                      width={5}
                      x="288.4"
                      y="24.50166525565534"
                    />
                    <rect
                      className="hp-stat-bar"
                      height="84.7066549512984"
                      rx="2.5"
                      style={{ "--hp-stat-step": 30 }}
                      width={5}
                      x={298}
                      y="20.293345048701596"
                    />
                    <rect
                      className="hp-stat-bar"
                      height={89}
                      rx="2.5"
                      style={{ "--hp-stat-step": 31 }}
                      width={5}
                      x="307.59999999999997"
                      y={16}
                    />
                  </g>
                </svg>
              </div>
              <h3 className="hp-uc-metrics-label tano-heading-sm">Organic supply</h3>
              <ul className="hp-uc-metrics-list">
                <li className="hp-sub tano-body-md">Posts published</li>
                <li className="hp-sub tano-body-md">Active creators</li>
                <li className="hp-sub tano-body-md">Returning posters</li>
                <li className="hp-sub tano-body-md">Views and engagement</li>
              </ul>
            </li>
            <li
              className="hp-reveal hp-stat"
              data-rv-skip
              data-shown="false"
              style={{ "--hp-reveal-delay": "90ms" }}
            >
              <div className="hp-stat-head">
                <svg
                  aria-hidden="true"
                  className="hp-stat-graphic"
                  data-graphic="dotRing"
                  focusable="false"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 116 117"
                >
                  <circle
                    className="hp-stat-dot"
                    cx={58}
                    cy={22}
                    data-empty="true"
                    fill="currentColor"
                    r={9}
                    style={{ "--hp-stat-step": 0 }}
                  />
                  <circle
                    className="hp-stat-dot"
                    cx="79.16026908252903"
                    cy="28.87538820250189"
                    fill="url(#hp-stat-spectrum-ring-svg4)"
                    r={9}
                    style={{ "--hp-stat-step": 1 }}
                  />
                  <circle
                    className="hp-stat-dot"
                    cx="92.23803458662553"
                    cy="46.875388202501895"
                    fill="url(#hp-stat-spectrum-ring-svg4)"
                    r={9}
                    style={{ "--hp-stat-step": 2 }}
                  />
                  <circle
                    className="hp-stat-dot"
                    cx="92.23803458662553"
                    cy="69.1246117974981"
                    fill="url(#hp-stat-spectrum-ring-svg4)"
                    r={9}
                    style={{ "--hp-stat-step": 3 }}
                  />
                  <circle
                    className="hp-stat-dot"
                    cx="79.16026908252903"
                    cy="87.1246117974981"
                    fill="url(#hp-stat-spectrum-ring-svg4)"
                    r={9}
                    style={{ "--hp-stat-step": 4 }}
                  />
                  <circle
                    className="hp-stat-dot"
                    cx={58}
                    cy={94}
                    fill="url(#hp-stat-spectrum-ring-svg4)"
                    r={9}
                    style={{ "--hp-stat-step": 5 }}
                  />
                  <circle
                    className="hp-stat-dot"
                    cx="36.83973091747097"
                    cy="87.1246117974981"
                    fill="url(#hp-stat-spectrum-ring-svg4)"
                    r={9}
                    style={{ "--hp-stat-step": 6 }}
                  />
                  <circle
                    className="hp-stat-dot"
                    cx="23.761965413374476"
                    cy="69.1246117974981"
                    fill="url(#hp-stat-spectrum-ring-svg4)"
                    r={9}
                    style={{ "--hp-stat-step": 7 }}
                  />
                  <circle
                    className="hp-stat-dot"
                    cx="23.76196541337447"
                    cy="46.875388202501895"
                    fill="url(#hp-stat-spectrum-ring-svg4)"
                    r={9}
                    style={{ "--hp-stat-step": 8 }}
                  />
                  <circle
                    className="hp-stat-dot"
                    cx="36.83973091747096"
                    cy="28.875388202501895"
                    fill="url(#hp-stat-spectrum-ring-svg4)"
                    r={9}
                    style={{ "--hp-stat-step": 9 }}
                  />
                </svg>
              </div>
              <h3 className="hp-uc-metrics-label tano-heading-sm">Content for paid</h3>
              <ul className="hp-uc-metrics-list">
                <li className="hp-sub tano-body-md">Posts selected</li>
                <li className="hp-sub tano-body-md">Rights secured</li>
                <li className="hp-sub tano-body-md">Assets delivered as agreed</li>
              </ul>
            </li>
            <li
              className="hp-reveal hp-stat"
              data-rv-skip
              data-shown="false"
              style={{ "--hp-reveal-delay": "180ms" }}
            >
              <div className="hp-stat-head">
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
              </div>
              <h3 className="hp-uc-metrics-label tano-heading-sm">Paid results</h3>
              <ul className="hp-uc-metrics-list">
                <li className="hp-sub tano-body-md">Spend</li>
                <li className="hp-sub tano-body-md">Hook rate</li>
                <li className="hp-sub tano-body-md">Hold rate</li>
                <li className="hp-sub tano-body-md">CTR</li>
                <li className="hp-sub tano-body-md">ROAS</li>
                <li className="hp-sub tano-body-md">CPA</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>
      <ClosingBand
        body="Share your monthly content needs and the campaign dates that matter. Our strategists will come back with the recruitment, repeat posting and briefs it would take to cover them."
        cta={{ href: "/talk-to-us", label: "Get started" }}
        lines={["Give your next campaign", "a community."]}
      />
    </main>
  );
}
