import { ButtonLink } from "@/components/ui/button"
import { HeroGlow } from "@/components/sections/hero-glow";
import { BandHeading } from "@/components/sections/band-heading";
import { RoleCard, TeamPrint } from "@/components/sections/role-card";

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <section
        aria-labelledby="careers-title"
        className="hp-band hp-uc-hero"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        <HeroGlow />
        <div className="hp-container hp-uc-hero-field">
          <div className="hp-uc-hero-copy">
            <p className="hp-careers-eyebrow tano-body-mono-sm">Join the team</p>
            <h1 className="hp-title tano-display-md" id="careers-title">
              <span className="hp-title-words">Careers at Tano</span>
            </h1>
            <p className="hp-uc-hero-sub tano-body-para-md">
              Tano is an AI-native influencer marketing company. We pair human experts with AI
              agents to run influencer and affiliate campaigns for consumer brands end-to-end. We're
              a small, fast-growing team in London, working with brands like Hello Fresh, Bloom
              &amp; Wild and Unilever. We're hiring across engineering and client growth.
            </p>
            <div className="hp-uc-hero-actions">
              <ButtonLink href={"#roles"} label={"See open roles"} />
            </div>
          </div>
          <div className="hp-careers-film">
            <a
              className="hp-careers-film-shot"
              href="https://www.youtube.com/watch?v=oETf0gCPzWE"
              rel="noopener noreferrer"
              target="_blank"
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
                src="/sites/tano/images/maxresdefault.jpg"
              />
              <span aria-hidden="true" className="hp-careers-film-play">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                </svg>
              </span>
            </a>
            <div className="hp-careers-film-foot">
              <a
                className="hp-careers-film-title tano-heading-xs"
                href="https://www.youtube.com/watch?v=oETf0gCPzWE"
                rel="noopener noreferrer"
                target="_blank"
              >
                We Gave 30 Engineers 8 Hours to Build a Product
              </a>
              <a
                className="hp-careers-film-channel tano-body-sm"
                href="https://www.youtube.com/@Tano-AI"
                rel="noopener noreferrer"
                target="_blank"
              >
                Our channel
              </a>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="roles-title"
        className="hp-band"
        data-ground="light"
        data-padding="xl"
        id="roles"
      >
        <div className="hp-container hp-roles">
          <BandHeading align="start" titleId="roles-title" subtitle="7 positions open">
            <span className="hp-title-words">Open roles</span>
          </BandHeading>
          <ul className="hp-roles-list">
            <RoleCard
              href="/careers/product-engineer"
              title="Product Engineer"
              summary="Own the agent that runs influencer marketing end-to-end, in production, for paying brands."
              openingsLabel="3 openings"
              department="Engineering"
              location="Central London · In person"
              employmentType="Full-time"
              delayMs={0}
            />
            <RoleCard
              href="/careers/product-security-engineer"
              title="Product Security Engineer"
              summary="Our agents talk to tens of thousands of people and spend live brand budgets, with no person in the loop. Own the security of all of it."
              department="Engineering"
              location="Central London · In person"
              employmentType="Full-time"
              delayMs={80}
            />
            <RoleCard
              href="/careers/senior-account-manager"
              title="Senior Account Manager, Creator Growth"
              summary="Own a portfolio of creator programmes as growth channels in their own right: part strategist, part operator, part account manager, with agentic AI doing the work that used to need a team."
              openingsLabel="3 openings"
              department="Client"
              location="London · In person"
              employmentType="Full-time"
              delayMs={160}
            />
          </ul>
        </div>
      </section>
      <section
        aria-labelledby="team-photos-title"
        className="hp-band"
        data-ground="dark"
        data-ground-dark
        data-padding="xl"
      >
        <div className="hp-container hp-team">
          <div className="hp-team-head">
            <p className="hp-careers-eyebrow tano-body-mono-sm">Life at Tano</p>
            <BandHeading
              align="centre"
              titleId="team-photos-title"
              subtitle="A small team in London that ships fast and gets out of the building now and then. Here we are on our last company offsite in Italy."
            >
              <span className="hp-title-words">We work hard, together.</span>
            </BandHeading>
          </div>
          <div className="hp-team-prints" data-count={4}>
            <TeamPrint src="/sites/tano/images/team-colosseum.jpg" alt="Six of the team standing together inside the Colosseum in Rome" delayMs={0} />
            <TeamPrint src="/sites/tano/images/team-dinner.jpg" alt="The team around a long dinner table under an olive tree" delayMs={80} />
            <TeamPrint src="/sites/tano/images/team-pizza-steps.jpg" alt="The team sharing pizza on stone steps by a lake at sunset" delayMs={160} />
            <TeamPrint src="/sites/tano/images/pasta.jpg" alt="Plates of pasta passed across a candlelit table" delayMs={240} />
          </div>
        </div>
      </section>
    </main>
  );
}
