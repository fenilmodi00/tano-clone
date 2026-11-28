import { ClosingBand } from "@/components/sections/closing-band";
import { LinkCardGrid } from "@/components/sections/link-card-grid";
import { UseCaseHero } from "@/components/sections/use-case-hero";

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <UseCaseHero
        paragraphs={[
          "Practical guides for brands deciding how to run and scale a creator programme.",
        ]}
        titleLines={["Guides"]}
      />
      <LinkCardGrid
        heading="Running a creator programme"
        headingId="link-cards-gh-list"
        items={[
          {
            title: "What does a creator programme cost?",
            body: "What a creator programme costs in-house, through an agency or with a managed partner, and why the gap widens as you grow from 100 to 1,000 creators.",
            href: "/guides/creator-programme-cost",
          },
          {
            title: "Influencer agency or platform: which model fits your brand?",
            body: "Once a creator programme grows past what your team can run by hand, you have three options: automate some of the work with a platform, hand it to an agency, or hand it to a creator programme partner.",
            href: "/guides/influencer-agency-or-platform",
          },
          {
            title: "Outgrown your influencer agency? How to choose your next one",
            body: "Why an influencer agency that suits you at 100 creators can struggle at 1,000, what to look for in your next one, and how to switch without losing your creators.",
            href: "/guides/outgrown-influencer-agency",
          },
          {
            title: "How to scale a creator programme without adding headcount",
            body: "One person can look after about 100 creators. Where the time goes as a programme grows, and four ways to scale past a few hundred creators without hiring.",
            href: "/guides/scale-creator-programme-without-headcount",
          },
          {
            title: "How to keep creators for the long term",
            body: "Why creators drift away from brand programmes, why long-running creators are worth more than new ones, and how to keep more of them posting.",
            href: "/guides/keep-creators-long-term",
          },
        ]}
        ground="light"
      />
      <LinkCardGrid
        heading="Creator ads and platforms"
        headingId="link-cards-gh-ads"
        items={[
          {
            title: "How to run creator content as ads",
            body: "How to run creator content as paid ads on Meta and TikTok: usage rights, Partnership Ads and Spark Ads codes, briefing creators, and a steady monthly supply.",
            href: "/guides/creator-ads",
          },
          {
            title: "How to price whitelisting and usage rights fees for creators",
            body: "How to price usage rights and whitelisting for a winning creator post: whether to license it, what you pay for, typical rates, product-paid creators and renewals.",
            href: "/guides/usage-rights-pricing",
          },
          {
            title: "Meta Creator Marketing Hub: do you still need an influencer platform?",
            body: "What Meta's free Creator Marketing Hub does, the two gaps it leaves (TikTok and YouTube, and running the programme), and when you still need a platform.",
            href: "/guides/meta-creator-marketing-hub",
          },
          {
            title: "Trybe alternatives: when DTC brands outgrow it and where they go",
            body: "What Trybe is good at, the signs a brand has outgrown it, and the three paths brands take next: Aspire or GRIN, ShopMy Spotlights, or a partner like Tano.",
            href: "/guides/trybe-alternatives",
          },
        ]}
        ground="dark"
      />
      <LinkCardGrid
        heading="Meta Muse"
        headingId="link-cards-gh-muse"
        items={[
          {
            title: "What does Meta Muse mean for DTC creator marketing?",
            body: "Meta Muse, Meta's personal AI agent, is now live in the UK. What it changes about shopping, and what it means for DTC brands and their creator programmes.",
            href: "/guides/meta-muse-creator-marketing",
          },
          {
            title: "How DTC brands should change their creator programme for Meta Muse",
            body: "Muse is live in the UK after early lessons in North America. Six changes for DTC brands, from always-on seeding to the product facts agents check.",
            href: "/guides/win-on-meta-muse-with-creators",
          },
          {
            title: "What DTC brands should tell their creators about Meta Muse",
            body: "What Meta Muse means for creators, what DTC brands should tell them, how to label posts, and a ready-made brief and creator pack to send today.",
            href: "/guides/meta-muse-creators-brief",
          },
          {
            title: "Do follower counts matter on Meta Muse? A guide for DTC brands",
            body: "What early evidence says about creator size on Meta Muse, and why DTC brands still gain from a broad base of nano and micro creators.",
            href: "/guides/meta-muse-nano-micro-creators",
          },
          {
            title: "Is your DTC brand's UGC ready for AI shopping agents like Meta Muse?",
            body: "DTC UGC that only runs as ads misses what Meta Muse works from: posts shoppers save. How to add organic creator posts, then amplify the winners.",
            href: "/guides/ugc-ai-shopping-agents",
          },
        ]}
        ground="light"
      />
      <ClosingBand
        body="Share where your creator programme is today. Our strategists will come back with what it would take to run it always-on, with the relationships and content rights staying with your brand."
        cta={{ href: "/talk-to-us", label: "Get started" }}
        lines={["See if Tano fits", "your programme."]}
      />
    </main>
  );
}
