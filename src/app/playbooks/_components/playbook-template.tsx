import { Button, ButtonLink } from "@/components/ui/button";
import { PageEffects } from "@/app/_runtime/page-effects";

type PlaybookBlock = { type: string; html?: string; items?: ReadonlyArray<{ title: string }> };
type PlaybookSection = {
  eyebrow?: string;
  heading?: string;
  variant?: string;
  blocks: ReadonlyArray<PlaybookBlock>;
};
type PlaybookContent = {
  route: string;
  hero: { eyebrow?: string; title: string; paragraphs: ReadonlyArray<string> };
  sections: ReadonlyArray<PlaybookSection>;
  closing?: { title: string; body: string; cta: { label: string; href: string } };
};

const GLOW = (
  <div aria-hidden="true" className="hp-hero-glow">
    <div className="hp-hero-glow-light">
      <div className="wire-spectrum-drift" />
      <div className="hp-hero-glow-folds" data-layer="a" />
      <div className="hp-hero-glow-folds" data-layer="b" />
    </div>
  </div>
);

function stripMarkup(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/**
 * One playbook detail page: hero, lead gate and closing CTA. Five routes share
 * this exact structure; their copy lives in src/content/pages/*.json.
 */
export function PlaybookTemplate({ page }: { page: PlaybookContent }) {
  const gate =
    page.sections.find((section) => section.variant === "playbook-gate") ?? page.sections[0];
  const gateBodyBlock = gate?.blocks.find((block) => block.type === "prose" && block.html);
  const gateCards = gate?.blocks.find((block) => block.type === "cards" && block.items);
  const gateBody = gateBodyBlock?.html ? stripMarkup(gateBodyBlock.html) : "";
  const gateItems = gateCards?.items?.map((item) => item.title) ?? [];
  const emailId = `${page.route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}-email`;

  return (
    <main id="main">
      <section
        aria-labelledby="doc-title"
        className="wire-legal-hero wire-resource-hero"
        data-ground="dark"
        data-ground-dark
      >
        {GLOW}
        <div className="wire-legal-hero-copy">
          {page.hero.eyebrow ? (
            <p className="wire-resource-kicker tano-body-mono-sm">{page.hero.eyebrow}</p>
          ) : null}
          <h1 className="tano-display-md" id="doc-title">
            {page.hero.title}
          </h1>
          <div className="wire-legal-hero-measure">
            {page.hero.paragraphs.map((paragraph) => (
              <p className="tano-body-para-md wire-ink-soft" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-band" data-ground="light" data-padding="xl">
        <div className="hp-container">
          <div className="wire-contact-card wire-lead-gate">
            <div className="wire-contact-head">
              {gate?.eyebrow ? (
                <p className="tano-body-mono-xs wire-ink-soft">{gate.eyebrow}</p>
              ) : null}
              {gate?.heading ? <h2 className="tano-heading-md">{gate.heading}</h2> : null}
              {gateBody ? <p className="tano-body-md wire-ink-soft">{gateBody}</p> : null}
              {gateItems.length ? (
                <ul className="wire-legal-list tano-body-md wire-ink-soft">
                  {gateItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            <form action={page.route} className="wire-contact-form" method="post" noValidate>
              <div className="wire-contact-fields">
                <div className="wire-contact-field" data-span="wide">
                  <label htmlFor={emailId}>Work email address</label>
                  <input autoComplete="email" id={emailId} name="email" required type="email" />
                </div>
              </div>
              <Button type="submit">Get free access</Button>
              <p className="tano-body-sm wire-ink-soft">No spam. Unsubscribe any time.</p>
            </form>
          </div>
        </div>
      </section>

      {page.closing ? (
        <section className="hp-band" data-ground="light" data-padding="xl">
          <div className="hp-container">
            <div className="hp-band-heading" data-align="start">
              <div className="hp-band-heading-copy">
                <h2 className="hp-title tano-display-xs">
                  <span className="hp-title-words">{page.closing.title}</span>
                </h2>
                <p className="hp-sub tano-body-para-md">{page.closing.body}</p>
              </div>
              <div className="hp-band-actions">
                <ButtonLink href={page.closing.cta.href} label={page.closing.cta.label} />
              </div>
            </div>
          </div>
        </section>
      ) : null}
      <PageEffects />
    </main>
  );
}
