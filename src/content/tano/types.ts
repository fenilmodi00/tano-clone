/**
 * Typed content model for the tano.ai route captures.
 *
 * Generated JSON pages live in ./pages/<slug>.json; the route/SEO manifest
 * lives in ./routes.ts. Keep this file in sync with
 * docs/research/tano/content-schema.md and scripts/extract-source-content.mjs.
 */

export type Block =
  | { type: "prose"; html: string } // sanitized inline: a, strong, em, br, sup, sub
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | {
      type: "cards";
      items: {
        title: string;
        body?: string;
        href?: string;
        image?: string;
        meta?: string;
      }[];
    }
  | {
      type: "quote";
      text: string;
      name?: string;
      role?: string;
      image?: string;
    }
  | { type: "media"; src: string; alt?: string; poster?: string; href?: string }
  | { type: "stats"; items: { value: string; label: string }[] };

export type Hero = {
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  actions: { label: string; href: string }[];
  media?: string;
  mediaPoster?: string;
};

export type PageSection = {
  id?: string;
  heading?: string;
  eyebrow?: string;
  variant?: string;
  blocks: Block[];
};

export type Card = {
  title: string;
  body?: string;
  href: string;
  group?: string;
};

export type Page = {
  route: string;
  family: string;
  meta: { title: string; description: string };
  hero: Hero;
  sections: PageSection[];
  faq?: { q: string; a: string }[];
  closing?: { title: string; body: string; cta: { label: string; href: string } };
  cards?: Card[];
};
