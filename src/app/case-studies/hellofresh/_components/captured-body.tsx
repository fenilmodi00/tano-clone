import { Button } from "@/components/ui/button";
import { getOtherCaseStudies } from "@/components/media/case-studies";
import { CaseBannerDeck } from "@/components/sections/case-banners";
import { ClosingBand } from "@/components/sections/closing-band";
import { LegalLayout, LegalRail } from "@/components/sections/legal-shell";
import { StatDefs, StatItem } from "@/components/sections/stat";
import { StudyFilms } from "@/components/sections/study-films";
import { StudyHero } from "@/components/sections/study-hero";
import { StudyQuote } from "@/components/sections/study-quote";

const OTHER_CASE_STUDIES = getOtherCaseStudies("hellofresh");
const [SKIN_AND_ME, BLOOM_AND_WILD, PAPIER] = OTHER_CASE_STUDIES;
const CASE_DECK = [
  { ...BLOOM_AND_WILD, hue: "cyan" },
  { ...SKIN_AND_ME, hue: "violet" },
  { ...PAPIER, hue: "lime" },
];

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <style
        dangerouslySetInnerHTML={{
          __html: ".wire-spectrum-rule::before{background:#8bc220;animation:none}",
        }}
      />
      <StudyHero accent="#8bc220" mark={{ alt: "HelloFresh logo", src: "/sites/tano/extras/d3a2cb0ec3e50f7e894dbd640373fe6fa3b2e58c-760x247.png", aspect: "3.076923076923077" }} title="How HelloFresh lifted CVR 93% with a hybrid creator model" lede="Recipe boxes at national scale. HelloFresh needed more creator outreach without more manual work." facts={[{ label: "Client", value: "HelloFresh" }, { label: "Sector", value: "Meal kits" }]} backdropSrc="/sites/tano/extras/4de259484f00862b365ecbd6289a62ad5095cdd6-2400x1600.jpg" figures={<><StatDefs /><ul className="wire-study-stats" data-count={1}><StatItem value="+93%" caption="Uplift in CVR vs running the programme internally" delayMs={0}><svg aria-hidden="true" className="hp-stat-graphic" data-graphic="incliningGraph" focusable="false" preserveAspectRatio="xMinYMid meet" viewBox="0 0 321 117"><path className="hp-stat-area" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6 L 313 105 L 8 105 Z" fill="url(#hp-stat-spectrum-svg1)" mask="url(#hp-stat-falloff-mask-svg6)" /><path className="hp-stat-line" d="M 8 93 L 96 85 L 152 70 L 208 44 L 313 6" fill="none" pathLength={1} stroke="url(#hp-stat-spectrum-svg1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg></StatItem></ul></>} />
      <LegalLayout
        study
        rail={<LegalRail items={[{ id: "what-ran", label: "What Ran" }]} />}
      >
            <section className="wire-legal-section wire-study-section" id="what-ran">
              <h2 className="tano-display-xs">What Ran</h2>
              <figure className="wire-study-video">
                <div
                  className="wire-study-video-frame"
                  data-gated="true"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <span aria-hidden="true" className="wire-study-video-poster">
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
                      src="/sites/tano/media/mux-01DdTUelFSpsNr8AETwFidGf4xvGbOcsRnu6WVftAzhs.webp"
                     loading="lazy"/>
                  </span>
                  <div className="wire-study-video-gate">
                    <p className="tano-heading-sm">HelloFresh on lowering CAC with creators</p>
                    <p className="tano-body-md wire-ink-soft">
                      Leave your work email and the film plays straight away.
                    </p>
                    <form className="wire-study-video-gate-form">
                      <label className="wire-visually-hidden" htmlFor="_R_4jcjav5ubpcnjb_-email">
                        Work email
                      </label>
                      <input
                        autoComplete="email"
                        id="_R_4jcjav5ubpcnjb_-email"
                        placeholder="you@company.com"
                        required
                        type="email"
                        defaultValue=""
                      />
                      <Button type={"submit"} icon={false}>Watch</Button>
                      <label
                        className="wire-study-video-gate-check tano-body-sm"
                        htmlFor="_R_4jcjav5ubpcnjb_-share"
                      >
                        <input id="_R_4jcjav5ubpcnjb_-share" type="checkbox" />
                        Send me Tano’s other case studies
                      </label>
                    </form>
                  </div>
                </div>
              </figure>
              <ul className="wire-legal-list wire-study-bullets">
                <li className="tano-body-para-md">
                  Automated the manual workload behind the programme.
                </li>
                <li className="tano-body-para-md">
                  Scaled outreach volume beyond in-house capacity.
                </li>
                <li className="tano-body-para-md">
                  Fed learnings back into targeting and briefing.
                </li>
              </ul>
              <figure className="wire-study-video">
                <div
                  className="wire-study-video-frame"
                  data-gated="true"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <span aria-hidden="true" className="wire-study-video-poster">
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
                      src="/sites/tano/media/mux-Plle4M8YSPKN3SqQt1OjGcoYkiWLuNZmffuM6Dxkzhg.webp"
                     loading="lazy"/>
                  </span>
                  <div className="wire-study-video-gate">
                    <p className="tano-heading-sm">How Tano runs HelloFresh’s creator programme</p>
                    <p className="tano-body-md wire-ink-soft">
                      Leave your work email and the film plays straight away.
                    </p>
                    <form className="wire-study-video-gate-form">
                      <label className="wire-visually-hidden" htmlFor="_R_4ncjav5ubpcnjb_-email">
                        Work email
                      </label>
                      <input
                        autoComplete="email"
                        id="_R_4ncjav5ubpcnjb_-email"
                        placeholder="you@company.com"
                        required
                        type="email"
                        defaultValue=""
                      />
                      <Button type={"submit"} icon={false}>Watch</Button>
                      <label
                        className="wire-study-video-gate-check tano-body-sm"
                        htmlFor="_R_4ncjav5ubpcnjb_-share"
                      >
                        <input id="_R_4ncjav5ubpcnjb_-share" type="checkbox" />
                        Send me Tano’s other case studies
                      </label>
                    </form>
                  </div>
                </div>
              </figure>
              <figure className="wire-study-video">
                <div
                  className="wire-study-video-frame"
                  data-gated="true"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <span aria-hidden="true" className="wire-study-video-poster">
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
                      src="/sites/tano/media/mux-3Na00d8aF00OqBo4eaqWkSCpSyG3O0101hYZcOIa101onvpQ.webp"
                     loading="lazy"/>
                  </span>
                  <div className="wire-study-video-gate">
                    <p className="tano-heading-sm">HelloFresh on working with Tano’s AI agents</p>
                    <p className="tano-body-md wire-ink-soft">
                      Leave your work email and the film plays straight away.
                    </p>
                    <form className="wire-study-video-gate-form">
                      <label className="wire-visually-hidden" htmlFor="_R_4pcjav5ubpcnjb_-email">
                        Work email
                      </label>
                      <input
                        autoComplete="email"
                        id="_R_4pcjav5ubpcnjb_-email"
                        placeholder="you@company.com"
                        required
                        type="email"
                        defaultValue=""
                      />
                      <Button type={"submit"} icon={false}>Watch</Button>
                      <label
                        className="wire-study-video-gate-check tano-body-sm"
                        htmlFor="_R_4pcjav5ubpcnjb_-share"
                      >
                        <input id="_R_4pcjav5ubpcnjb_-share" type="checkbox" />
                        Send me Tano’s other case studies
                      </label>
                    </form>
                  </div>
                </div>
              </figure>
              <StudyQuote
                name="Stephanie Terziyski"
                portrait={{ src: "/sites/tano/images/tano-50.jpg", alt: "" }}
                quote="Partnering with Tano on a hybrid model completely transformed our micro-influencer strategy. By automating the manual workload, scaling our outreach volume, and leveraging smart learnings, they helped us achieve a 93% uplift in CVR compared to running the programme internally."
                role="Growth Influencer Marketing Manager · HelloFresh"
              />
            </section>
      </LegalLayout>
      <StudyFilms
              backdropSrc="/sites/tano/extras/4de259484f00862b365ecbd6289a62ad5095cdd6-2400x1600.jpg"
              films={[
        { poster: "/sites/tano/images/tano-136.jpg", filmLabel: "@taylorfrances_’s film for HelloFresh", logo: "/sites/tano/images/tano-9.png", logoLabel: "HelloFresh", avatar: "/sites/tano/images/tano-79.jpg", handle: "@taylorfrances_", brand: "HelloFresh", glow: "lime", filmGlow: "#8bc220" },
        { poster: "/sites/tano/images/tano-82.jpg", filmLabel: "@artbyronel’s film for HelloFresh", logo: "/sites/tano/images/tano-9.png", logoLabel: "HelloFresh", avatar: "/sites/tano/images/tano-83.jpg", handle: "@artbyronel", brand: "HelloFresh", glow: "lime", filmGlow: "#8bc220" },
        { poster: "/sites/tano/images/tano-117.jpg", filmLabel: "@_baileymoorex’s film for HelloFresh", logo: "/sites/tano/images/tano-9.png", logoLabel: "HelloFresh", avatar: "/sites/tano/images/tano-99.jpg", handle: "@_baileymoorex", brand: "HelloFresh", glow: "lime", filmGlow: "#8bc220" },
        { poster: "/sites/tano/images/tano-124.jpg", filmLabel: "@rosieryan_x’s film for HelloFresh", logo: "/sites/tano/images/tano-9.png", logoLabel: "HelloFresh", avatar: "/sites/tano/images/tano-122.jpg", handle: "@rosieryan_x", brand: "HelloFresh", glow: "lime", filmGlow: "#8bc220" },
        { poster: "/sites/tano/images/tano-41.jpg", filmLabel: "@olivialinch’s film for HelloFresh", logo: "/sites/tano/images/tano-9.png", logoLabel: "HelloFresh", avatar: "", handle: "@olivialinch", brand: "HelloFresh", glow: "lime", filmGlow: "#8bc220" },
        { poster: "/sites/tano/images/tano-51.jpg", filmLabel: "@mary_h761’s film for HelloFresh", logo: "/sites/tano/images/tano-9.png", logoLabel: "HelloFresh", avatar: "/sites/tano/images/tano-28.jpg", handle: "@mary_h761", brand: "HelloFresh", glow: "lime", filmGlow: "#8bc220" },
        { poster: "/sites/tano/images/tano-86.jpg", filmLabel: "@samanthajtarkowski’s film for HelloFresh", logo: "/sites/tano/images/tano-9.png", logoLabel: "HelloFresh", avatar: "", handle: "@samanthajtarkowski", brand: "HelloFresh", glow: "lime", filmGlow: "#8bc220" },
        { poster: "/sites/tano/images/tano-32.jpg", filmLabel: "@erinmcclean1’s film for HelloFresh", logo: "/sites/tano/images/tano-9.png", logoLabel: "HelloFresh", avatar: "", handle: "@erinmcclean1", brand: "HelloFresh", glow: "lime", filmGlow: "#8bc220" },
        { poster: "/sites/tano/images/tano-108.jpg", filmLabel: "@snehasunny30_’s film for HelloFresh", logo: "/sites/tano/images/tano-9.png", logoLabel: "HelloFresh", avatar: "", handle: "@snehasunny30_", brand: "HelloFresh", glow: "lime", filmGlow: "#8bc220" },
        { poster: "/sites/tano/images/tano-62.jpg", filmLabel: "@erinmcclean1’s film for HelloFresh", logo: "/sites/tano/images/tano-9.png", logoLabel: "HelloFresh", avatar: "", handle: "@erinmcclean1", brand: "HelloFresh", glow: "lime", filmGlow: "#8bc220" },
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
