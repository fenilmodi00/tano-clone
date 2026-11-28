import { Button, ButtonLink } from "@/components/ui/button";
import { BandHeading } from "@/components/sections/band-heading";
import { ResourceHero } from "@/components/sections/resource-hero";
import { PageShell } from "@/components/page-shell";

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
    <PageShell>
      <main id="main">
        <ResourceHero
          eyebrow={page.hero.eyebrow}
          id="doc-title"
          paragraphs={page.hero.paragraphs}
          title={page.hero.title}
        />

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
              <BandHeading
                subtitle={page.closing.body}
                actions={<ButtonLink href={page.closing.cta.href} label={page.closing.cta.label} />}
              >
                <span className="hp-title-words">{page.closing.title}</span>
              </BandHeading>
            </div>
          </section>
        ) : null}
      </main>
    </PageShell>
  );
}
