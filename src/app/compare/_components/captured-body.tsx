import { ClosingBand } from "@/components/sections/closing-band";
import { LinkCardGrid } from "@/components/sections/link-card-grid";
import { UseCaseHero } from "@/components/sections/use-case-hero";

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <UseCaseHero
        paragraphs={[
          "These pages are written for brands weighing up how to run creator marketing.",
        ]}
        titleLines={["Compare Tano with the alternatives"]}
      />
      <LinkCardGrid
        cta="Read the comparison →"
        ground="light"
        heading="Head-to-head comparisons"
        headingId="link-cards-ch-list"
        items={[
          {
            title:
              "ShopMy vs Tano: creator discovery for today, or a programme that compounds over time?",
            body: "ShopMy and Tano can both help a brand work with creators, drive affiliate sales and get product into the hands of people with influence. But they are built for different creator operating models.",
            href: "/compare/shopmy-vs-tano",
          },
          {
            title:
              "LTK vs Tano: marketplace reach, or a creator programme that compounds on your site?",
            body: "LTK and Tano both help brands generate sales through creators, but they are built for different jobs. LTK is a shopping marketplace with a consumer app. Tano is the operating layer for a creator programme that belongs to your brand. Plenty of brands run both.",
            href: "/compare/ltk-vs-tano",
          },
          {
            title:
              "Agentio vs Tano: buy creator placements, or build a creator programme?",
            body: "Both make creator marketing programmatic, but they automate different things. Agentio automates the media buy: you set a budget and it matches you with creators whose content runs as ads. Tano automates the programme: finding, briefing, paying and re-engaging creators who stay with your brand. So the real question is what you are buying: a placement or a relationship.",
            href: "/compare/agentio-vs-tano",
          },
          {
            title: "GRIN vs Tano: software you run, or a programme run for you?",
            body: "GRIN is creator marketing software that a brand's own team runs. Tano is a creator advertising platform: it pairs specialist AI agents with a senior in-house team to run an always-on creator programme for a brand.",
            href: "/compare/grin-vs-tano",
          },
        ]}
      />
      <ClosingBand
        body="Share where your creator programme is today. Our strategists will come back with what it would take to run it always-on, with the relationships and content rights staying with your brand."
        cta={{ href: "/talk-to-us", label: "Get started" }}
        lines={["See if Tano fits", "your programme."]}
      />
    </main>
  );
}
