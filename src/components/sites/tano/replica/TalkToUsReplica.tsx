import { TanoButton } from "@/components/sites/tano/ui/tano-button";
import Link from "next/link";

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/tano/source.css. */
export function TalkToUsReplica() {
  return (
    <main className="wire-contact" id="main">
      <div aria-hidden="true" className="wire-contact-art">
        <picture>
          <source media="(max-width: 767px)" />
          <img
            alt=""
            fetchPriority="high"
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
            src="/sites/tano/images/talk-to-us-glass.jpg"
            className="wire-contact-photo"
          />
        </picture>
      </div>
      <div className="wire-contact-sheet">
        <div className="wire-drawer-rule">
          <div className="wire-spectrum-rule" aria-hidden="true" />
        </div>
        <div className="wire-drawer-scroll">
          <div className="wire-contact-card" data-current-step={1}>
            <div className="wire-contact-head">
              <h1 className="tano-heading-md">
                Tell us about your brand, and we’ll tell you how we can help.
              </h1>
              <p className="tano-body-md wire-ink-soft">
                Want to reach out by email? Find us at{" "}
                <a className="wire-contact-link" href="mailto:team@tano.ai">
                  team@tano.ai
                </a>
              </p>
            </div>
            <form className="wire-contact-form" id="_R_2klubpcnjb_-form" noValidate>
              <div className="wire-contact-fields">
                <p
                  className="wire-contact-group tano-heading-xs"
                  data-field="group-you"
                  data-step={1}
                >
                  <span className="wire-contact-step tano-body-sm">Step 1 of 2</span>About you
                </p>
                <div
                  className="wire-contact-field"
                  data-field="name"
                  data-span="half"
                  data-step={1}
                >
                  <label htmlFor="_R_2klubpcnjb_-name">Name</label>
                  <div className="wire-contact-control">
                    <input
                      id="_R_2klubpcnjb_-name"
                      type="text"
                      required
                      autoComplete="name"
                      name="name"
                    />
                  </div>
                </div>
                <div
                  className="wire-contact-field"
                  data-field="email"
                  data-span="half"
                  data-step={1}
                >
                  <label htmlFor="_R_2klubpcnjb_-email">Work email</label>
                  <div className="wire-contact-control">
                    <input
                      id="_R_2klubpcnjb_-email"
                      type="email"
                      required
                      autoComplete="email"
                      name="email"
                    />
                  </div>
                </div>
                <p
                  className="wire-contact-group tano-heading-xs"
                  data-field="group-brand"
                  data-step={2}
                >
                  <span className="wire-contact-step tano-body-sm">Step 2 of 2</span>About your
                  brand
                </p>
                <div
                  className="wire-contact-field"
                  data-field="brandWebsite"
                  data-span="half"
                  data-step={2}
                >
                  <label htmlFor="_R_2klubpcnjb_-brandWebsite">Brand website</label>
                  <div className="wire-contact-control">
                    <input
                      id="_R_2klubpcnjb_-brandWebsite"
                      type="text"
                      required
                      autoComplete="url"
                      inputMode="url"
                      placeholder="yourbrand.com"
                      name="brandWebsite"
                    />
                  </div>
                </div>
                <div
                  className="wire-contact-field"
                  data-field="companyType"
                  data-span="half"
                  data-step={2}
                >
                  <label htmlFor="_R_2klubpcnjb_-companyType">Company type</label>
                  <div className="wire-contact-control">
                    <span className="wire-contact-select" data-empty="true">
                      <select id="_R_2klubpcnjb_-companyType" name="companyType" required>
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="DTC or consumer brand">DTC or consumer brand</option>
                        <option value="Agency">Agency</option>
                        <option value="SaaS or tech">SaaS or tech</option>
                        <option value="Creator">Creator</option>
                        <option value="Student">Student</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="wire-nav-icon" data-direction="down">
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
                    </span>
                  </div>
                </div>
                <div
                  className="wire-contact-field"
                  data-field="monthlyAdSpendBand"
                  data-span="half"
                  data-step={2}
                >
                  <label htmlFor="_R_2klubpcnjb_-monthlyAdSpendBand">Monthly ad spend</label>
                  <div className="wire-contact-control">
                    <span className="wire-contact-select" data-empty="true">
                      <select
                        id="_R_2klubpcnjb_-monthlyAdSpendBand"
                        name="monthlyAdSpendBand"
                        required
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="Under $35k">Under $35k</option>
                        <option value="$35k to $75k">$35k to $75k</option>
                        <option value="$75k to $150k">$75k to $150k</option>
                        <option value="$150k to $300k">$150k to $300k</option>
                        <option value="$300k to $1M">$300k to $1M</option>
                        <option value="$1M+">$1M+</option>
                      </select>
                      <span className="wire-nav-icon" data-direction="down">
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
                    </span>
                  </div>
                </div>
                <div
                  className="wire-contact-field"
                  data-field="sellsPhysicalProducts"
                  data-span="half"
                  data-step={2}
                >
                  <label htmlFor="_R_2klubpcnjb_-sellsPhysicalProducts">
                    Do you sell physical products online?
                  </label>
                  <div className="wire-contact-control">
                    <span className="wire-contact-select" data-empty="true">
                      <select
                        id="_R_2klubpcnjb_-sellsPhysicalProducts"
                        name="sellsPhysicalProducts"
                        required
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <span className="wire-nav-icon" data-direction="down">
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
                    </span>
                  </div>
                </div>
                <div
                  className="wire-contact-field"
                  data-field="creatorActivity"
                  data-span="half"
                  data-step={2}
                >
                  <label htmlFor="_R_2klubpcnjb_-creatorActivity">
                    Current creator or affiliate activity
                  </label>
                  <div className="wire-contact-control">
                    <span className="wire-contact-select" data-empty="true">
                      <select id="_R_2klubpcnjb_-creatorActivity" name="creatorActivity" required>
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="None">None</option>
                        <option value="Gifting only">Gifting only</option>
                        <option value="Paid creators">Paid creators</option>
                        <option value="Affiliate programme">Affiliate programme</option>
                      </select>
                      <span className="wire-nav-icon" data-direction="down">
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
                    </span>
                  </div>
                </div>
                <div
                  className="wire-contact-field"
                  data-field="role"
                  data-span="half"
                  data-step={2}
                >
                  <label htmlFor="_R_2klubpcnjb_-role">Your role</label>
                  <div className="wire-contact-control">
                    <span className="wire-contact-select" data-empty="true">
                      <select id="_R_2klubpcnjb_-role" name="role" required>
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="Founder">Founder</option>
                        <option value="Growth">Growth</option>
                        <option value="Ecommerce or Performance">Ecommerce or Performance</option>
                        <option value="Influencer or Social">Influencer or Social</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="wire-nav-icon" data-direction="down">
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
                    </span>
                  </div>
                </div>
                <div
                  className="wire-contact-field"
                  data-field="phoneNumber"
                  data-span="full"
                  data-step={1}
                >
                  <label htmlFor="_R_2klubpcnjb_-phoneNumber">Phone number (optional)</label>
                  <div className="wire-contact-control">
                    <div className="wire-contact-phone">
                      <span className="wire-contact-select" data-size="dial">
                        <select
                          aria-label="Country code"
                          aria-describedby="_R_2klubpcnjb_-country-name"
                          name="countryCode"
                        >
                          <option value="GB">🇬🇧 +44</option>
                          <option value="US">🇺🇸 +1</option>
                          <option value="CA">🇨🇦 +1</option>
                          <option value="AU">🇦🇺 +61</option>
                          <option value="DE">🇩🇪 +49</option>
                          <option value="FR">🇫🇷 +33</option>
                          <option value="NL">🇳🇱 +31</option>
                          <option value="IE">🇮🇪 +353</option>
                        </select>
                        <span className="wire-nav-icon" data-direction="down">
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
                      </span>
                      <input
                        id="_R_2klubpcnjb_-phoneNumber"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="+44 7700 900123"
                        name="phoneNumber"
                      />
                    </div>
                    <p className="wire-visually-hidden" id="_R_2klubpcnjb_-country-name">
                      United Kingdom
                    </p>
                  </div>
                </div>
                <div
                  className="wire-contact-field"
                  data-field="hearAboutUs"
                  data-span="full"
                  data-step={2}
                >
                  <label htmlFor="_R_2klubpcnjb_-hearAboutUs">Where did you hear about us?</label>
                  <div className="wire-contact-control">
                    <span className="wire-contact-select" data-empty="true">
                      <select id="_R_2klubpcnjb_-hearAboutUs" name="hearAboutUs" required>
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="Google Web Search">Google Web Search</option>
                        <option value="Google AI Overview">Google AI Overview</option>
                        <option value="Instagram">Instagram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="AI assistant (ChatGPT, Claude, etc.)">
                          AI assistant (ChatGPT, Claude, etc.)
                        </option>
                        <option value="Word of mouth">Word of mouth</option>
                        <option value="Event / conference">Event / conference</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="wire-nav-icon" data-direction="down">
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
                    </span>
                  </div>
                </div>
                <div
                  className="wire-contact-field"
                  data-field="message"
                  data-span="full"
                  data-step={2}
                >
                  <label htmlFor="_R_2klubpcnjb_-message">Message (optional)</label>
                  <div className="wire-contact-control">
                    <textarea id="_R_2klubpcnjb_-message" name="message" defaultValue={""} />
                  </div>
                </div>
              </div>
              <div className="wire-contact-closing" data-step={2}>
                <label className="wire-contact-consent" htmlFor="_R_2klubpcnjb_-consent">
                  <input id="_R_2klubpcnjb_-consent" required type="checkbox" name="consent" />
                  <span>
                    I agree to Tano storing and processing these details in order to respond to this
                    request, as described in the{" "}
                    <Link className="wire-contact-link" href="/privacy-policy">
                      privacy policy
                    </Link>
                    .
                  </span>
                </label>
              </div>
              <p className="wire-visually-hidden" role="status" />
              <div className="wire-contact-actions">
                <span className="wire-spectrum-glow wire-contact-submit">
                  <TanoButton type={"submit"} >Continue</TanoButton>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
