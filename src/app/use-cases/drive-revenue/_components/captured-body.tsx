import { ButtonLink } from "@/components/ui/button"
import { BRAND_BAND_CAPTION, BRAND_MARKS } from "@/components/media/brand-marks";
import { LogoBand } from "@/components/media/logo-band";
import { BandHeading } from "@/components/sections/band-heading";
import { ClosingBand } from "@/components/sections/closing-band";
import { StatDefs, StatGroup, StatItem } from "@/components/sections/stat";
import { UseCaseHero } from "@/components/sections/use-case-hero";

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <UseCaseHero
        titleLines={["Creators can be your best revenue channel.", "We make them one."]}
        actions={[
          { href: "/talk-to-us", label: "Get started" },
          { href: "/case-studies", label: "See the case studies", variant: "secondary" },
        ]}
        paragraphs={[
          "Tano builds large-scale creator programmes that drive new customer acquisition. Recruitment, seeding, incentives and payouts are all handled for you, with our in-house strategists steering the programme with care.",
        ]}
        proof={
          <>
            <StatDefs />
            <StatGroup label="What brands get:">
                <StatItem caption="Growth in sign-ups and revenue at Skin+Me." delayMs={0} value="3.5×">
                    <span
                      aria-label="Skin + Me"
                      className="hp-stat-mark-frame"
                      role="img"
                      style={{ "--mark-optical": "0.742", "--mark-aspect": "5.447" }}
                    >
                      <span
                        className="hp-stat-mark"
                        data-colour
                        style={{
                          backgroundImage:
                            'url("/brand-mark/669e03ced1a3526eec5e27862281f1969cfa8a5d-1400x257.png")',
                        }}
                      />
                    </span>
                </StatItem>
                <StatItem caption="Increase in revenue in two months at Fussy." delayMs={90} value="+175%">
                    <span
                      aria-label="Fussy"
                      className="hp-stat-mark"
                      role="img"
                      style={{
                        maskImage:
                          'url("/brand-mark/d10e5d21ed3fb43e628fb8d618ab4e1815f7f83d-1400x747.svg")',
                        WebkitMaskImage:
                          'url("/brand-mark/d10e5d21ed3fb43e628fb8d618ab4e1815f7f83d-1400x747.svg")',
                        "--mark-optical": "1.139",
                        "--mark-aspect": "1.874",
                      }}
                    />
                </StatItem>
                <StatItem caption="Uplift in conversion rate at HelloFresh." delayMs={180} value="+93%">
                    <span
                      aria-label="HelloFresh"
                      className="hp-stat-mark-frame"
                      role="img"
                      style={{ "--mark-optical": "0.987", "--mark-aspect": "3.077" }}
                    >
                      <span
                        className="hp-stat-mark"
                        data-colour
                        data-for="light"
                        style={{
                          backgroundImage:
                            'url("/brand-mark/eb38a51363759ba206612b684fc7d888953a892f-760x247.png")',
                        }}
                      />
                      <span
                        className="hp-stat-mark"
                        data-colour
                        data-for="dark"
                        style={{
                          backgroundImage:
                            'url("/brand-mark/f49bb20d04c6f37f32698eaecdcd1d3704688682-760x247.png")',
                        }}
                      />
                    </span>
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
            subtitle="Your customers’ favourite creators, found, set up with a code and a link, and coached on what sells. Every order lands in your own reporting."
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
                <ol className="hp-steps-track hp-pp-track" style={{ "--hp-steps-count": 4 }}>
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
                      aria-label="Step 03: Incentivisation"
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
                      aria-label="Step 04: Tracking and measurement"
                      className="hp-steps-seg-button"
                      data-state="idle"
                      type="button"
                    >
                      <span aria-hidden="true" className="hp-steps-seg-rule">
                        <span
                          className="hp-steps-seg-fill"
                          data-paused="true"
                          style={{ "--hp-steps-index": 3, "--hp-steps-duration": "10400ms" }}
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
                    style={{ "--hp-steps-count": 4, "--hp-steps-index": 0 }}
                  >
                    <span>01</span>
                    <span>Run by Tano</span>
                  </p>
                  <h3 className="hp-steps-label tano-heading-md">Sourcing</h3>
                  <p className="hp-steps-body tano-body-para-md">
                    Tano finds creators whose audiences are new to you and already buy through
                    links, working from your creator personas and within your guardrails. Each is
                    scored on how likely they are to bring new customers, and only those above the
                    threshold go forward.
                  </p>
                </div>
                <div aria-hidden="true" className="hp-pp-slide" data-live="false">
                  <p
                    className="hp-pp-owner tano-body-mono-sm"
                    data-owner="tano"
                    style={{ "--hp-steps-count": 4, "--hp-steps-index": 1 }}
                  >
                    <span>02</span>
                    <span>Run by Tano</span>
                  </p>
                  <h3 className="hp-steps-label tano-heading-md">Onboarding</h3>
                  <p className="hp-steps-body tano-body-para-md">
                    Every creator gets a code and a tracking link, connected to your Shopify store
                    and placed in the commission group that suits them, such as 15% of every
                    attributed order. Each sale they drive is attributed to them, and a customer’s
                    first order is marked as new.
                  </p>
                </div>
                <div aria-hidden="true" className="hp-pp-slide" data-live="false">
                  <p
                    className="hp-pp-owner tano-body-mono-sm"
                    data-owner="tano"
                    style={{ "--hp-steps-count": 4, "--hp-steps-index": 2 }}
                  >
                    <span>03</span>
                    <span>Run by Tano</span>
                  </p>
                  <h3 className="hp-steps-label tano-heading-md">Incentivisation</h3>
                  <p className="hp-steps-body tano-body-para-md">
                    Tano’s agents coach every creator one to one, from how to use the link sticker
                    to what to post next, working from your incentives and the sales in your
                    affiliate reporting. Bonuses and higher commission go to what you want more of,
                    such as new customers, so effort follows results.
                  </p>
                </div>
                <div aria-hidden="true" className="hp-pp-slide" data-live="false">
                  <p
                    className="hp-pp-owner tano-body-mono-sm"
                    data-owner="tano"
                    style={{ "--hp-steps-count": 4, "--hp-steps-index": 3 }}
                  >
                    <span>04</span>
                    <span>Run by Tano</span>
                  </p>
                  <h3 className="hp-steps-label tano-heading-md">Tracking and measurement</h3>
                  <p className="hp-steps-body tano-body-para-md">
                    Revenue, new customers, CAC and lifetime value update live from your own
                    affiliate reporting, measured against the objective you set. You see which
                    creators and incentives are paying back, and Tano shifts the programme towards
                    them.
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
                style={{ "--hp-steps-count": 4, "--hp-steps-active": 0 }}
              >
                <div
                  aria-hidden="true"
                  className="hp-pp-frame"
                  data-direction={1}
                  data-room=""
                  style={
                    {
                      "--room": "135px",
                      "--room-delay": "360ms",
                      "--card-foot": "465px",
                    } as React.CSSProperties
                  }
                >
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
                    data-scene="revenue-source"
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
                                id="tano-glyph-spectrum-usecasesdriverevenuereplica-1"
                                r={1}
                              >
                                <stop offset={0} stopColor="var(--spectrum-cyan, #46b7d1)" />
                                <stop offset="0.5" stopColor="var(--spectrum-magenta, #cc6add)" />
                                <stop offset={1} stopColor="var(--spectrum-orange, #fb751f)" />
                              </radialGradient>
                            </defs>
                            <path
                              d="M88.0338 4.00741C94.2708 -1.07111 103.169 -0.35695 113.68 0.954679C124.143 2.59856 132.893 4.37172 137.492 10.9771C142.074 17.5585 141.747 29.3607 140.316 40.69C140.299 40.7994 139.455 46.8137 138.263 55.3068C138.066 56.7112 139.348 57.871 140.72 57.5277C158.642 53.0441 177.219 48.3977 177.41 48.3473C188.497 45.7363 200.169 44.1752 207.176 48.0563C214.209 51.9519 216.882 60.4922 219.606 70.7545C222.006 81.0979 223.645 89.8961 219.26 96.6461C214.89 103.371 203.853 107.488 192.84 110.402C192.649 110.447 174.818 114.9 157.244 119.29C155.723 119.67 155.214 121.579 156.341 122.67C167.99 133.945 178.721 144.331 178.849 144.452C186.933 152.496 194.438 161.595 194.868 169.61C195.3 177.654 189.494 184.452 182.258 192.207C174.781 199.728 168.207 205.784 160.174 205.632C152.17 205.48 142.84 198.277 134.54 190.458C134.357 190.276 110.985 167.638 95.749 152.879C94.8364 151.995 93.3481 152.183 92.6759 153.262C82.6871 169.296 72.0716 186.34 71.965 186.516C65.798 196.117 58.4822 205.369 50.7527 207.458C42.9946 209.554 35.1552 205.272 26.0855 199.788C17.1935 194.019 9.91902 188.831 8.39701 180.922C6.88068 173.04 11.9679 162.392 17.8709 152.626C18.0005 152.424 32.9447 128.454 44.0686 110.613C44.5958 109.767 44.4196 108.663 43.6575 108.022C30.5698 97.0155 17.998 86.4428 17.8505 86.3219C9.2263 78.8625 1.10598 70.3116 0.119118 62.3463C-0.871353 54.3518 4.44807 47.1643 11.1271 38.9225C18.0624 30.8963 24.1984 24.3953 32.2226 23.985C40.2175 23.5762 50.0271 30.1093 58.8513 37.3297C58.9474 37.4127 64.3671 41.9737 71.7693 48.2037C72.9695 49.2138 74.8114 48.5053 75.0292 46.9494C76.2575 38.1756 77.1354 31.9084 77.1505 31.7897C78.8896 20.5037 81.8197 9.06748 88.0338 4.00741Z"
                              fill="url(#tano-glyph-spectrum-usecasesdriverevenuereplica-1)"
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
                            Little overlap with your customers
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
                            Followers shop through their links
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
        aria-labelledby="dashboard-title-dr-funnel"
        className="hp-band"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        <div className="hp-container hp-dash-band">
          <BandHeading
            align="centre"
            subtitle="Two funnels from your affiliate reporting. One follows creators from first message to first sale. The other follows their posts from impressions to new customers."
            titleId="dashboard-title-dr-funnel"
          >
                <span className="hp-title-words">See where every creator</span>
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
                    <span className="hp-title-words">and</span>
                  </span>
                  <span className="hp-title-words"> every customer drops off.</span>
                </span>
          </BandHeading>
          <div className="hp-dash-stage" data-dashboard="funnel">
            <span
              aria-hidden="true"
              className="hp-dash-print"
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
                src="/sites/tano/extras/89e6fe16e98dec354300e54b9efbb4f96436f7d8-560x560.jpg"
               loading="lazy"/>
            </span>
            <span
              aria-hidden="true"
              className="hp-dash-print"
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
                src="/sites/tano/extras/81103aecf1a9c65b7f4b1355cbdc454abed8ec98-560x560.jpg"
               loading="lazy"/>
            </span>
            <div className="hp-dash">
              <div className="hp-dash-pair">
                <div
                  className="hp-reveal hp-dash-panel"
                  data-rv-skip
                  data-shown="false"
                  style={{ "--hp-reveal-delay": "0ms" }}
                >
                  <p className="hp-dash-head">
                    <span className="tano-body-mono-xs">Creator funnel</span>
                    <span className="tano-body-mono-xs hp-dash-soft">Creators</span>
                  </p>
                  <ol className="hp-dash-rows">
                    <li className="hp-dash-row" style={{ "--row-delay": "0ms" }}>
                      <p className="hp-dash-row-copy">
                        <span className="tano-body-sm">Contacted</span>
                      </p>
                      <span aria-hidden="true" className="hp-dash-bar">
                        <span className="hp-dash-bar-fill" style={{ "--share": 1 }} />
                      </span>
                      <span className="hp-dash-figure-cell">
                        <span className="hp-dash-value tano-body-mono-sm">
                          <span aria-hidden="true">3,140</span>
                          <span className="wire-visually-hidden">3,140</span>
                        </span>
                      </span>
                    </li>
                    <li className="hp-dash-row" style={{ "--row-delay": "120ms" }}>
                      <p className="hp-dash-row-copy">
                        <span className="tano-body-sm">Engaged</span>
                      </p>
                      <span aria-hidden="true" className="hp-dash-bar">
                        <span className="hp-dash-bar-fill" style={{ "--share": "0.4" }} />
                      </span>
                      <span className="hp-dash-figure-cell">
                        <span className="hp-dash-rate tano-body-mono-xs">
                          <span aria-hidden="true">↓</span> 40%
                        </span>
                        <span className="hp-dash-value tano-body-mono-sm">
                          <span aria-hidden="true">1,256</span>
                          <span className="wire-visually-hidden">1,256</span>
                        </span>
                      </span>
                    </li>
                    <li className="hp-dash-row" style={{ "--row-delay": "240ms" }}>
                      <p className="hp-dash-row-copy">
                        <span className="tano-body-sm">Posting</span>
                      </p>
                      <span aria-hidden="true" className="hp-dash-bar">
                        <span className="hp-dash-bar-fill" style={{ "--share": "0.4" }} />
                      </span>
                      <span className="hp-dash-figure-cell">
                        <span className="hp-dash-rate tano-body-mono-xs">
                          <span aria-hidden="true">↓</span> 40%
                        </span>
                        <span className="hp-dash-value tano-body-mono-sm">
                          <span aria-hidden="true">503</span>
                          <span className="wire-visually-hidden">503</span>
                        </span>
                      </span>
                    </li>
                    <li className="hp-dash-row" style={{ "--row-delay": "360ms" }}>
                      <p className="hp-dash-row-copy">
                        <span className="tano-body-sm">Selling</span>
                      </p>
                      <span aria-hidden="true" className="hp-dash-bar">
                        <span
                          className="hp-dash-bar-fill"
                          data-lit="true"
                          style={{ "--share": "0.43" }}
                        />
                      </span>
                      <span className="hp-dash-figure-cell">
                        <span className="hp-dash-rate tano-body-mono-xs">
                          <span aria-hidden="true">↓</span> 43%
                        </span>
                        <span className="hp-dash-value tano-body-mono-sm">
                          <span aria-hidden="true">214</span>
                          <span className="wire-visually-hidden">214</span>
                        </span>
                      </span>
                    </li>
                  </ol>
                </div>
                <div
                  className="hp-reveal hp-dash-panel"
                  data-rv-skip
                  data-shown="false"
                  style={{ "--hp-reveal-delay": "140ms" }}
                >
                  <p className="hp-dash-head">
                    <span className="tano-body-mono-xs">Audience funnel</span>
                    <span className="tano-body-mono-xs hp-dash-soft">Shoppers</span>
                  </p>
                  <ol className="hp-dash-rows">
                    <li className="hp-dash-row" style={{ "--row-delay": "0ms" }}>
                      <p className="hp-dash-row-copy">
                        <span className="tano-body-sm">Impressions</span>
                      </p>
                      <span aria-hidden="true" className="hp-dash-bar">
                        <span className="hp-dash-bar-fill" style={{ "--share": 1 }} />
                      </span>
                      <span className="hp-dash-figure-cell">
                        <span className="hp-dash-value tano-body-mono-sm">
                          <span aria-hidden="true">4.2M</span>
                          <span className="wire-visually-hidden">4.2M</span>
                        </span>
                      </span>
                    </li>
                    <li className="hp-dash-row" style={{ "--row-delay": "120ms" }}>
                      <p className="hp-dash-row-copy">
                        <span className="tano-body-sm">Link clicks</span>
                      </p>
                      <span aria-hidden="true" className="hp-dash-bar">
                        <span className="hp-dash-bar-fill" style={{ "--share": "0.014" }} />
                      </span>
                      <span className="hp-dash-figure-cell">
                        <span className="hp-dash-rate tano-body-mono-xs">
                          <span aria-hidden="true">↓</span> 1.4%
                        </span>
                        <span className="hp-dash-value tano-body-mono-sm">
                          <span aria-hidden="true">58,800</span>
                          <span className="wire-visually-hidden">58,800</span>
                        </span>
                      </span>
                    </li>
                    <li className="hp-dash-row" style={{ "--row-delay": "240ms" }}>
                      <p className="hp-dash-row-copy">
                        <span className="tano-body-sm">Orders</span>
                      </p>
                      <span aria-hidden="true" className="hp-dash-bar">
                        <span className="hp-dash-bar-fill" style={{ "--share": "0.04" }} />
                      </span>
                      <span className="hp-dash-figure-cell">
                        <span className="hp-dash-rate tano-body-mono-xs">
                          <span aria-hidden="true">↓</span> 4.0%
                        </span>
                        <span className="hp-dash-value tano-body-mono-sm">
                          <span aria-hidden="true">2,352</span>
                          <span className="wire-visually-hidden">2,352</span>
                        </span>
                      </span>
                    </li>
                    <li className="hp-dash-row" style={{ "--row-delay": "360ms" }}>
                      <p className="hp-dash-row-copy">
                        <span className="tano-body-sm">New customers</span>
                      </p>
                      <span aria-hidden="true" className="hp-dash-bar">
                        <span
                          className="hp-dash-bar-fill"
                          data-lit="true"
                          style={{ "--share": "0.7" }}
                        />
                      </span>
                      <span className="hp-dash-figure-cell">
                        <span className="hp-dash-rate tano-body-mono-xs">
                          <span aria-hidden="true">↓</span> 70%
                        </span>
                        <span className="hp-dash-value tano-body-mono-sm">
                          <span aria-hidden="true">1,646</span>
                          <span className="wire-visually-hidden">1,646</span>
                        </span>
                      </span>
                    </li>
                  </ol>
                </div>
                <div
                  className="hp-reveal hp-dash-result"
                  data-rv-skip
                  data-shown="false"
                  style={{ "--hp-reveal-delay": "1320ms" }}
                >
                  <span aria-hidden="true" className="hp-dash-result-rule" />
                  <span className="hp-dash-result-copy">
                    <span className="tano-heading-lg hp-dash-figure">
                      <span aria-hidden="true">+175%</span>
                      <span className="wire-visually-hidden">+175%</span>
                    </span>
                    <span className="tano-body-sm hp-dash-result-label">
                      Increase in revenue in two months
                    </span>
                  </span>
                  <span
                    aria-label="Fussy"
                    className="hp-dash-result-logo"
                    role="img"
                    style={{
                      maskImage:
                        'url("/sites/tano/extras/d10e5d21ed3fb43e628fb8d618ab4e1815f7f83d-1400x747.svg")',
                      WebkitMaskImage:
                        'url("/sites/tano/extras/d10e5d21ed3fb43e628fb8d618ab4e1815f7f83d-1400x747.svg")',
                      aspectRatio: "1.8741633199464525",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="dashboard-title-dr-lifetime"
        className="hp-band"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        <div className="hp-container hp-dash-band">
          <BandHeading
            align="centre"
            subtitle="Your new customers from creators, compared with every other new customer your store won in the same window. Like for like, from Shopify’s own lifetime spend."
            titleId="dashboard-title-dr-lifetime"
          >
                <span className="hp-title-words">Customers from creators</span>
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
                            d="M3.75545 1.50869C4.66246 1.57431 5.604 2.01198 6.50387 2.89114C7.40374 2.01198 8.34527 1.57431 9.25228 1.50869C10.2861 1.43389 11.2006 1.8485 11.8619 2.50417C12.805 3.43935 13.2783 4.92691 12.8482 6.29065C12.4063 6.38106 11.9922 6.62072 11.6884 7.0005L8.89934 10.4868L8.45012 10.1499C7.56646 9.48717 6.31286 9.66626 5.65012 10.5499C5.42321 10.8525 5.29498 11.1984 5.25993 11.5491L1.07602 7.76475C1.06991 7.75922 1.06395 7.75355 1.05812 7.74774C-0.561308 6.13063 -0.153882 3.7929 1.14586 2.50417C1.80713 1.8485 2.72166 1.43389 3.75545 1.50869ZM13.8357 8.71855C14.0945 8.3951 14.042 7.92313 13.7186 7.66438C13.3951 7.40562 12.9232 7.45806 12.6644 7.78151L9.1185 12.2139L7.70004 11.15C7.36867 10.9015 6.89857 10.9687 6.65004 11.3C6.40152 11.6314 6.46867 12.1015 6.80004 12.35L8.80004 13.85C9.12412 14.0931 9.58264 14.0349 9.8357 13.7185L13.8357 8.71855Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="hp-title-words">are</span>
                  </span>
                  <span className="hp-title-words"> worth more. Here’s the proof.</span>
                </span>
          </BandHeading>
          <div className="hp-dash-stage" data-dashboard="lifetime">
            <span
              aria-hidden="true"
              className="hp-dash-print"
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
                src="/sites/tano/extras/32798127947f7e7f46e77002cd1340d5219b4d3e-560x560.jpg"
               loading="lazy"/>
            </span>
            <span
              aria-hidden="true"
              className="hp-dash-print"
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
                src="/sites/tano/extras/d1128f29b4c32fa2539bde196da21b0d9ee7aae1-560x560.jpg"
               loading="lazy"/>
            </span>
            <div className="hp-dash">
              <div className="hp-dash-split">
                <div className="hp-dash-lead">
                  <div
                    className="hp-reveal hp-dash-panel"
                    data-rv-skip
                    data-shown="false"
                    style={{ "--hp-reveal-delay": "0ms" }}
                  >
                    <p className="hp-dash-head">
                      <span className="tano-body-mono-xs">Lifetime spend per new customer</span>
                      <span className="tano-body-mono-xs hp-dash-soft">Last 59 days</span>
                    </p>
                    <ol className="hp-dash-rows">
                      <li className="hp-dash-row" style={{ "--row-delay": "0ms" }}>
                        <p className="hp-dash-row-copy">
                          <span className="tano-body-sm">From creators</span>
                        </p>
                        <span aria-hidden="true" className="hp-dash-bar">
                          <span
                            className="hp-dash-bar-fill"
                            data-lit="true"
                            style={{ "--share": 1 }}
                          />
                        </span>
                        <span className="hp-dash-figure-cell">
                          <span className="hp-dash-value tano-body-mono-sm" data-greek>
                            <span aria-hidden="true">£96.40</span>
                            <span className="wire-visually-hidden">£96.40</span>
                          </span>
                        </span>
                      </li>
                      <li className="hp-dash-row" style={{ "--row-delay": "120ms" }}>
                        <p className="hp-dash-row-copy">
                          <span className="tano-body-sm">Everyone else</span>
                        </p>
                        <span aria-hidden="true" className="hp-dash-bar">
                          <span className="hp-dash-bar-fill" style={{ "--share": "0.74" }} />
                        </span>
                        <span className="hp-dash-figure-cell">
                          <span className="hp-dash-value tano-body-mono-sm" data-greek>
                            <span aria-hidden="true">£71.20</span>
                            <span className="wire-visually-hidden">£71.20</span>
                          </span>
                        </span>
                      </li>
                    </ol>
                  </div>
                  <div
                    className="hp-reveal hp-dash-result"
                    data-rv-skip
                    data-shown="false"
                    style={{ "--hp-reveal-delay": "1040ms" }}
                  >
                    <span aria-hidden="true" className="hp-dash-result-rule" />
                    <span className="hp-dash-result-copy">
                      <span className="tano-heading-lg hp-dash-figure">
                        <span aria-hidden="true">3.5×</span>
                        <span className="wire-visually-hidden">3.5×</span>
                      </span>
                      <span className="tano-body-sm hp-dash-result-label">
                        Growth in sign-ups and revenue
                      </span>
                    </span>
                    <span
                      aria-label="Skin + Me"
                      className="hp-dash-result-logo"
                      role="img"
                      style={{
                        maskImage:
                          'url("/sites/tano/extras/3edac718fbd3e8fe217646ae2a617c5785a6818a-1400x257.svg")',
                        WebkitMaskImage:
                          'url("/sites/tano/extras/3edac718fbd3e8fe217646ae2a617c5785a6818a-1400x257.svg")',
                        aspectRatio: "5.447470817120623",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="hp-reveal hp-dash-panel hp-dash-stats"
                  data-rv-skip
                  data-shown="false"
                  style={{ "--hp-reveal-delay": "140ms" }}
                >
                  <ul className="hp-dash-stat-list">
                    <li className="hp-dash-stat">
                      <span className="hp-dash-stat-copy">
                        <span className="tano-body-mono-xs hp-dash-soft">LTV to CAC</span>
                        <span className="tano-heading-sm hp-dash-figure" data-greek>
                          <span aria-hidden="true">6.8×</span>
                          <span className="wire-visually-hidden">6.8×</span>
                        </span>
                        <span className="tano-body-xs hp-dash-soft">
                          Lifetime spend against what each one cost
                        </span>
                      </span>
                      <svg
                        aria-hidden="true"
                        className="hp-dash-trend"
                        data-lit="true"
                        viewBox="0 0 88 28"
                      >
                        <path d="M1.5 26.5 L13.6 22.6 L25.8 23.9 L37.9 17.3 L50.1 13.3 L62.2 10.7 L74.4 6.8 L86.5 1.5" />
                      </svg>
                    </li>
                    <li className="hp-dash-stat">
                      <span className="hp-dash-stat-copy">
                        <span className="tano-body-mono-xs hp-dash-soft">Orders per customer</span>
                        <span className="tano-heading-sm hp-dash-figure">
                          <span aria-hidden="true">1.9</span>
                          <span className="wire-visually-hidden">1.9</span>
                        </span>
                        <span className="tano-body-xs hp-dash-soft">Against everyone else</span>
                      </span>
                      <svg aria-hidden="true" className="hp-dash-trend" viewBox="0 0 88 28">
                        <path d="M1.5 26.5 L13.6 23.4 L25.8 20.2 L37.9 21.5 L50.1 14.0 L62.2 10.2 L74.4 6.5 L86.5 1.5" />
                      </svg>
                    </li>
                    <li className="hp-dash-stat">
                      <span className="hp-dash-stat-copy">
                        <span className="tano-body-mono-xs hp-dash-soft">Repeat rate</span>
                        <span className="tano-heading-sm hp-dash-figure">
                          <span aria-hidden="true">31%</span>
                          <span className="wire-visually-hidden">31%</span>
                        </span>
                        <span className="tano-body-xs hp-dash-soft">Placed a second order</span>
                      </span>
                      <svg aria-hidden="true" className="hp-dash-trend" viewBox="0 0 88 28">
                        <path d="M1.5 26.5 L13.6 23.7 L25.8 18.2 L37.9 20.9 L50.1 15.4 L62.2 9.8 L74.4 7.1 L86.5 1.5" />
                      </svg>
                    </li>
                  </ul>
                </div>
              </div>
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
            subtitle="Every programme teaches us what to improve: which creators reach the right people, what motivates them to post, and which activity leads to first-time orders. Those signals shape the next round."
            titleId="programme-title"
          >
                <span className="hp-title-words">Incentivise, coach, reward. Then do it</span>
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
                          d="M2 6.5C2 4.01472 4.01472 2 6.5 2S11 4.01472 11 6.5c0 1.08654-.3851 2.08313-1.02621 2.86076C9.02696 8.58862 7.81746 8.125 6.49995 8.125c-1.31748 0-2.52696.4636-3.47378 1.23571C2.38507 8.58309 2 7.58652 2 6.5Zm.30134 4.2862C1.18974 9.69712.5 8.17911.5 6.5c0-3.31371 2.68629-6 6-6s6 2.68629 6 6c0 1.29583-.4108 2.49571-1.1092 3.47653l1.8164 1.81627c.3905.3905.3905 1.0237 0 1.4142-.3905.3906-1.0237.3906-1.4142.0001l-1.81646-1.8164c-.90224.6426-1.98986 1.0416-3.16701 1.1015-.10252.0052-.20572.0078-.30953.0078-1.6346 0-3.11653-.6537-4.19866-1.7138ZM8.25 5.375c0 .9665-.7835 1.75-1.75 1.75s-1.75-.7835-1.75-1.75.7835-1.75 1.75-1.75 1.75.7835 1.75 1.75Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>
                  <h3 className="tano-heading-sm">
                    We learn what the ideal creator profile looks like
                  </h3>
                  <p className="hp-sub tano-body-md">
                    We start from your customers, their interests, their routines, and then find
                    compatible creators for your identity. From there we build your Creator
                    Personas: matching audience fit, content quality, and brand-safety criteria that
                    every later recruit is measured against.
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
                          d="M.000976562 6.99996C.000976562 3.13469 3.13439.00128174 6.99965.00128174c3.86525 0 6.99865 3.13340826 6.99865 6.99867826 0 3.86524-3.1334 6.99864-6.99865 6.99864-3.86526 0-6.998673438-3.1334-6.998673438-6.99864ZM9.25201 11.0643l1.04509-7.93259-8.16526 3.93534 2.41772.87612L7.2348 5.86744c.21848-.16889.5325-.12869.70139.08979.16888.21848.12868.5325-.0898.70138L5.61843 8.38087l.00003 2.72603 1.68508-1.60386 1.94847 1.56126Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>
                  <h3 className="tano-heading-sm">We recruit, gift, and get creators posting</h3>
                  <p className="hp-sub tano-body-md">
                    Tano finds creators who fit your personas, then manages outreach, onboarding,
                    product gifting and guidance. We track each creator from first contact through
                    posting and sales, so your team can see what’s happening across the programme.
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
                          d="M5.65796 0h2.68413c-.02712.0894741-.04726.181794-.05988.276263L7.91858 3H6.08146L5.71783.276263C5.70522.181794 5.68508.0894741 5.65796 0Zm5.62384 9.70615c0-2.36479-1.91706-4.28183-4.28185-4.28183S2.71812 7.34136 2.71812 9.70615c0 2.36475 1.91704 4.28185 4.28183 4.28185s4.28185-1.9171 4.28185-4.28185Zm-4.90723-.81644.48212-.96985c.01395-.02694.03515-.04944.06122-.06495.02606-.01552.05595-.02343.08628-.02285.03033.00058.05989.00964.08534.02615.02545.0165.04577.0398.05867.06726l.48212.96984c.01078.02453.02788.04576.04955.06152.02167.01576.04713.02548.07379.02818l1.07075.15697c.02946.00477.05704.01756.07971.03697.02268.0194.03957.04468.04883.07305.00927.02837.01054.05874.00369.08779-.00685.02904-.02157.05564-.04253.07688l-.79046.75683c-.01633.0201-.02744.0439-.03233.0693-.00489.0255-.00341.0517.0043.0764l.1794 1.0652c.00646.0308.00384.0628-.00752.0921-.01137.0293-.031.0547-.05652.0731s-.05582.029-.08725.0306c-.03142.0015-.0626-.0062-.08977-.022l-.95303-.5046c-.02466-.0111-.05142-.0169-.07848-.0169-.02707 0-.05382.0058-.07849.0169l-.95302.5046c-.02717.0158-.05836.0235-.08978.022-.03142-.0016-.06173-.0122-.08725-.0306-.02551-.0184-.04515-.0438-.05651-.0731-.01137-.0293-.01398-.0613-.00752-.0921l.15136-1.0652c.01178-.0224.01794-.0474.01794-.0728 0-.0254-.00616-.0504-.01794-.0729l-.79045-.75122c-.02262-.02102-.03878-.04804-.0466-.0779-.00782-.02986-.00698-.06133.00243-.09074.00941-.0294.027-.05551.0507-.07529.02371-.01977.05255-.03239.08316-.03637l1.07076-.16258c.02665-.0027.05212-.01242.07379-.02818.02166-.01576.03876-.03699.04954-.06151ZM9.82138.0408243C9.65027.10628 9.52867.260069 9.50442.441655L8.95848 4.53097c1.20352.45572 2.20662 1.31923 2.84052 2.4219l1.6249-2.43727c.4212-.63182.3038-1.47875-.2734-1.97219L10.3249.127773c-.1392-.11904402-.33242-.1524041-.50352-.0869487ZM5.0416 4.5309c-1.20356.45568-2.20665 1.31916-2.84065 2.42181L.576204 4.5156C.154989 3.88378.272379 3.03685.84956 2.54341L3.67516.127773c.13925-.11904402.33245-.1524041.50355-.0869487.17111.0654557.29272.2192447.31696.4008307L5.0416 4.5309Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>
                  <h3 className="tano-heading-sm">We reward what sells, and recruit more of it</h3>
                  <p className="hp-sub tano-body-md">
                    Creators earn commission on sales, with agreed milestones unlocking further
                    rewards. We compare first-time orders and acquisition cost across Creator
                    Personas: where a persona beats your CAC target, our agents recruit more of it;
                    and where it doesn’t, the budget moves to match.
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
                  <h3 className="tano-heading-sm">We keep testing what leads to purchases</h3>
                  <p className="hp-sub tano-body-md">
                    Our agents test outreach, products, content formats and incentives within your
                    guidelines. Each creator’s response helps shape their follow-up, while creator
                    sentiment shows us which rewards and support encourage people to keep posting.
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
                  <span className="hp-uc-grid-action tano-body-sm">Tracking link sent</span>
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
                      Posted, sharing tips
                    </span>
                  </span>
                  <span className="hp-uc-grid-action tano-body-sm">Content ideas sent</span>
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
            subtitle="One is waiting on a delivery, one has posted without a sale, and one is a single post away from their next reward. Tano holds the whole history of every creator: products, posts, payouts and conversations. Tano agents act on it, one creator at a time."
            titleId="creator-grid-title"
          >
                <span className="hp-title-words">
                  Thousands of creators. No-one treated like a number.
                </span>
          </BandHeading>
        </div>
      </section>
      <section
        aria-labelledby="case-feature-title"
        className="hp-band"
        data-ground="light"
        data-padding="xl"
      >
        <div className="hp-container">
          <div className="hp-uc-case-wrap" style={{ "--uc-case-accent": "#f2c200" }}>
            <div
              className="hp-reveal hp-uc-case"
              data-rv-skip
              data-shown="false"
              style={{ "--hp-reveal-delay": "0ms" }}
            >
              <div className="hp-uc-case-media">
                <span className="hp-uc-case-ground hp-behind">
                  <img
                    alt="A Skin + Me prescription doser, personalised for its subscriber"
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
                    src="/sites/tano/extras/2450c8c48710183ec7dedfe886db57bb75b8c583-1240x1240.jpg"
                   loading="lazy"/>
                </span>
                <span className="hp-uc-tile" data-slot="case">
                  <span aria-hidden="true" className="hp-uc-tile-rule" />
                  <span className="hp-uc-tile-stack">
                    <span className="hp-uc-tile-figure tano-heading-lg">
                      <span>
                        <span aria-hidden="true">4 / 5</span>
                        <span className="wire-visually-hidden">4 / 5</span>
                      </span>
                    </span>
                    <span className="hp-uc-tile-note tano-body-sm">
                      Top performers in a single month
                    </span>
                  </span>
                </span>
              </div>
              <div className="hp-uc-case-copy">
                <div className="hp-uc-case-head">
                  <span
                    aria-label="Skin+Me"
                    className="hp-uc-case-logo"
                    role="img"
                    style={{
                      "--logo":
                        'url("/sites/tano/extras/5be8e63efa7157aa8f1f18c82e3fa1cf99ff368d-6528x1202.png")',
                      "--logo-aspect": "5.430948419301164",
                    }}
                  />
                  <h2 className="tano-heading-lg" id="case-feature-title">
                    How Skin+Me unlocked acquisition with overlooked creators
                  </h2>
                </div>
                <span aria-hidden="true" className="hp-uc-case-divider" />
                <blockquote className="hp-uc-case-quote tano-body-para-lg">
                  “You’ve removed all the admin stuff. I finally have time to focus on engagement —
                  and we’re on track for our biggest month ever.”
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
                        src="/sites/tano/images/tano-110.jpg"
                       loading="lazy"/>
                    </span>
                    <span className="hp-uc-tile-stack">
                      <span className="tano-body-sm">Katie McKane</span>
                      <span className="hp-sub tano-body-sm">Influencer Executive · Skin+Me</span>
                    </span>
                  </span>
                  <span className="hp-uc-case-actions">
                    <ButtonLink href={"/case-studies/skin-and-me"} label={"Read the case study"} />
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
                subtitle="Connect Tano with our Shopify app or API, and every creator action is attributed automatically."
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
                    <div className="hp-tm" data-micro="link">
                      <span className="hp-tm-label tano-body-mono-xs">Tracked link</span>
                      <span className="hp-tm-field">
                        <span className="hp-tm-field-value tano-body-sm">
                          www.tano.link/x7Kp9q2mWd
                        </span>
                        <button
                          aria-label="Copy the tracked link"
                          className="hp-tm-copy"
                          type="button"
                        >
                          <svg
                            viewBox="0 0 14 14"
                            width="100%"
                            height="100%"
                            fill="none"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path
                              d="M2.75 0C1.7835 0 1 .783502 1 1.75v8.5c0 .4142.33579.75.75.75s.75-.3358.75-.75v-8.5c0-.13807.11193-.25.25-.25h5c.41421 0 .75-.33579.75-.75C8.5.335786 8.16421 0 7.75 0h-5ZM5 2.5h3.875V6c0 .34518.27982.625.625.625H13V12.5c0 .8284-.6716 1.5-1.5 1.5H5c-.82843 0-1.5-.6716-1.5-1.5V4c0-.82843.67157-1.5 1.5-1.5Zm7.8536 2.64645c.0636.06369.1084.1428.1305.22855H10.125V2.51588c.0858.02214.1649.06687.2286.13057l2.5 2.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                      <span className="hp-tm-figure">
                        <span className="hp-tm-figure-value">312</span>
                        <span className="hp-tm-unit tano-body-sm">clicks</span>
                      </span>
                    </div>
                  </div>
                  <div className="hp-track-note">
                    <h3 className="tano-heading-sm">Link tracking</h3>
                    <p className="hp-sub tano-body-sm">
                      Every click attributed to the creator who drove it.
                    </p>
                  </div>
                </article>
                <article aria-hidden="true" className="hp-track-card" data-live="false" inert>
                  <div className="hp-track-product">
                    <div className="hp-tm" data-micro="code">
                      <span className="hp-tm-label tano-body-mono-xs">Discount code</span>
                      <span className="hp-tm-field">
                        <span className="hp-tm-field-value tano-body-sm">TANOCAMPAIGN</span>
                        <button aria-label="Copy the code" className="hp-tm-copy" type="button">
                          <svg
                            viewBox="0 0 14 14"
                            width="100%"
                            height="100%"
                            fill="none"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path
                              d="M2.75 0C1.7835 0 1 .783502 1 1.75v8.5c0 .4142.33579.75.75.75s.75-.3358.75-.75v-8.5c0-.13807.11193-.25.25-.25h5c.41421 0 .75-.33579.75-.75C8.5.335786 8.16421 0 7.75 0h-5ZM5 2.5h3.875V6c0 .34518.27982.625.625.625H13V12.5c0 .8284-.6716 1.5-1.5 1.5H5c-.82843 0-1.5-.6716-1.5-1.5V4c0-.82843.67157-1.5 1.5-1.5Zm7.8536 2.64645c.0636.06369.1084.1428.1305.22855H10.125V2.51588c.0858.02214.1649.06687.2286.13057l2.5 2.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                      <span className="hp-tm-figure">
                        <span className="hp-tm-figure-value">14</span>
                        <span className="hp-tm-unit tano-body-sm">orders</span>
                      </span>
                    </div>
                  </div>
                  <div className="hp-track-note">
                    <h3 className="tano-heading-sm">Code redemption</h3>
                    <p className="hp-sub tano-body-sm">Attribution on coupon use at checkout.</p>
                  </div>
                </article>
                <article aria-hidden="true" className="hp-track-card" data-live="false" inert>
                  <div className="hp-track-product">
                    <div className="hp-tm" data-micro="post">
                      <span className="hp-tm-label tano-body-mono-xs">Post logged</span>
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
                        </span>
                        <ul className="hp-tm-checklist">
                          <li className="tano-body-sm">
                            <svg
                              viewBox="0 0 14 14"
                              width="100%"
                              height="100%"
                              fill="none"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                d="M13.6333 1.33716c.4274.34972.4904.97975.1407 1.40719L5.92852 12.3332c-.71588.875-2.01412.9832-2.86492.2387L.341509 10.1901c-.4156366-.3637-.457754-.99546-.094072-1.4111s.995443-.45776 1.411083-.09407l2.72209 2.38187 7.84549-9.58892c.3497-.42745.9797-.490451 1.4072-.14072Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                            Rights logged
                          </li>
                          <li>
                            <svg
                              viewBox="0 0 14 14"
                              width="100%"
                              height="100%"
                              fill="none"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                d="M13.6333 1.33716c.4274.34972.4904.97975.1407 1.40719L5.92852 12.3332c-.71588.875-2.01412.9832-2.86492.2387L.341509 10.1901c-.4156366-.3637-.457754-.99546-.094072-1.4111s.995443-.45776 1.411083-.09407l2.72209 2.38187 7.84549-9.58892c.3497-.42745.9797-.490451 1.4072-.14072Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span
                              aria-hidden="true"
                              className="hp-tm-greek"
                              style={{ width: "72%" }}
                            />
                          </li>
                          <li>
                            <svg
                              viewBox="0 0 14 14"
                              width="100%"
                              height="100%"
                              fill="none"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                d="M13.6333 1.33716c.4274.34972.4904.97975.1407 1.40719L5.92852 12.3332c-.71588.875-2.01412.9832-2.86492.2387L.341509 10.1901c-.4156366-.3637-.457754-.99546-.094072-1.4111s.995443-.45776 1.411083-.09407l2.72209 2.38187 7.84549-9.58892c.3497-.42745.9797-.490451 1.4072-.14072Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span
                              aria-hidden="true"
                              className="hp-tm-greek"
                              style={{ width: "54%" }}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="hp-track-note">
                    <h3 className="tano-heading-sm">Post monitoring</h3>
                    <p className="hp-sub tano-body-sm">
                      Every creator post detected and stored, with usage rights logged.
                    </p>
                  </div>
                </article>
                <article aria-hidden="true" className="hp-track-card" data-live="false" inert>
                  <div className="hp-track-product">
                    <div className="hp-tm" data-micro="seeding">
                      <span className="hp-tm-label tano-body-mono-xs">Products sent</span>
                      <ul className="hp-tm-rows">
                        <li className="hp-tm-row">
                          <span className="hp-tm-packshot" style={{ backgroundColor: "#f5c451" }}>
                            <img
                              alt=""
                              width={96}
                              height={96}
                              decoding="async"
                              style={{ color: "transparent" }}
                              src="/sites/tano/images/sunshine-glass.jpg"
                             loading="lazy"/>
                          </span>
                          <span className="hp-tm-row-name tano-body-mono-xs">Sunshine Bouquet</span>
                          <span className="hp-tm-chip tano-body-xs" data-done>
                            <svg
                              viewBox="0 0 14 14"
                              width="100%"
                              height="100%"
                              fill="none"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                d="M13.6333 1.33716c.4274.34972.4904.97975.1407 1.40719L5.92852 12.3332c-.71588.875-2.01412.9832-2.86492.2387L.341509 10.1901c-.4156366-.3637-.457754-.99546-.094072-1.4111s.995443-.45776 1.411083-.09407l2.72209 2.38187 7.84549-9.58892c.3497-.42745.9797-.490451 1.4072-.14072Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                            Delivered
                          </span>
                        </li>
                        <li className="hp-tm-row">
                          <span className="hp-tm-packshot" style={{ backgroundColor: "#f2a98a" }}>
                            <img
                              alt=""
                              width={96}
                              height={96}
                              decoding="async"
                              style={{ color: "transparent" }}
                              src="/sites/tano/images/peach-glass.jpg"
                             loading="lazy"/>
                          </span>
                          <span className="hp-tm-row-name tano-body-mono-xs">Peach Roses</span>
                          <span className="hp-tm-chip tano-body-xs" data-done>
                            <svg
                              viewBox="0 0 14 14"
                              width="100%"
                              height="100%"
                              fill="none"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                d="M13.6333 1.33716c.4274.34972.4904.97975.1407 1.40719L5.92852 12.3332c-.71588.875-2.01412.9832-2.86492.2387L.341509 10.1901c-.4156366-.3637-.457754-.99546-.094072-1.4111s.995443-.45776 1.411083-.09407l2.72209 2.38187 7.84549-9.58892c.3497-.42745.9797-.490451 1.4072-.14072Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                            Delivered
                          </span>
                        </li>
                        <li className="hp-tm-row">
                          <span className="hp-tm-packshot" style={{ backgroundColor: "#ddd3c4" }}>
                            <img
                              alt=""
                              width={96}
                              height={96}
                              decoding="async"
                              style={{ color: "transparent" }}
                              src="/sites/tano/images/vase-glass-2.jpg"
                             loading="lazy"/>
                          </span>
                          <span className="hp-tm-row-name tano-body-mono-xs">Stoneware Vase</span>
                          <span className="hp-tm-chip tano-body-xs">On its way</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="hp-track-note">
                    <h3 className="tano-heading-sm">Product seeding</h3>
                    <p className="hp-sub tano-body-sm">Seeding levels monitored across SKUs.</p>
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
              <h3 className="hp-uc-metrics-label tano-heading-sm">Participation</h3>
              <ul className="hp-uc-metrics-list">
                <li className="hp-sub tano-body-md">Creators posting</li>
                <li className="hp-sub tano-body-md">Posts published</li>
                <li className="hp-sub tano-body-md">Creators returning</li>
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
              <h3 className="hp-uc-metrics-label tano-heading-sm">Sales</h3>
              <ul className="hp-uc-metrics-list">
                <li className="hp-sub tano-body-md">First-time orders</li>
                <li className="hp-sub tano-body-md">New customer rate</li>
                <li className="hp-sub tano-body-md">Tracked revenue</li>
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
              </div>
              <h3 className="hp-uc-metrics-label tano-heading-sm">Costs</h3>
              <ul className="hp-uc-metrics-list">
                <li className="hp-sub tano-body-md">CAC</li>
                <li className="hp-sub tano-body-md">ROAS</li>
                <li className="hp-sub tano-body-md">CPA</li>
                <li className="hp-sub tano-body-md">Every cost includes the Tano fee</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>
      <ClosingBand
        body="Share your CAC target and see what your potential for creator activity could be. Our strategists will come back with the recruitment, rewards, and support it would take to hit it."
        cta={{ href: "/talk-to-us", label: "Get started" }}
        lines={["See where your brand", "could win."]}
      />
    </main>
  );
}
