import { LogoBand } from "@/components/media/logo-band";
import { FEATURED_BAND_CAPTION, FEATURED_MARKS } from "@/components/media/brand-marks";
import type { CaseBannerItem } from "@/components/media/case-studies";
import { CaseBannerDeck } from "@/components/sections/case-banners";
import { UseCaseHero } from "@/components/sections/use-case-hero";

const newsItem: CaseBannerItem = {
  key: "tano-raises-4m-seed-round",
  title: "Tano has raised $5m to make creators a true advertising channel.",
  href: "/news/tano-raises-4m-seed-round",
  hue: "cyan",
  level: 2,
  actionLabel: "Read the story",
  meta: (
    <>
      <span>News</span>
      <time dateTime="2026-11-11">11 November 2026</time>
    </>
  ),
  photoSrc: "/sites/tano/extras/028bdd527688ad6e54c46eb4cf586effe86e4b05-1240x827.jpg",
  foot: "We've raised a $4M seed led by Cherry Ventures, to make creators a performance advertising channel brands can buy like Meta or Google ads. Bringing our total funding to $5M thanks to earlier backing from Seedcamp and The Players Fund",
};

/* Generated from the captured Tano SSR markup. Edit with care: styles live in src/styles/design-system.css. */
export function CapturedBody() {
  return (
    <main id="main">
      <UseCaseHero
        actions={[{ href: "mailto:team@tano.ai", label: "Email the team", icon: false }]}
        paragraphs={["Get in touch at team@tano.ai"]}
        titleLines={["News"]}
      />
      <LogoBand caption={FEATURED_BAND_CAPTION} marks={FEATURED_MARKS} />
      <div data-ground="light">
        <section className="wire-band" data-padding="md" data-ruled="false">
          <div className="wire-container">
            <CaseBannerDeck items={[newsItem]} />
          </div>
        </section>
      </div>
    </main>
  );
}
