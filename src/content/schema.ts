/**
 * Runtime schemas for the captured page content.
 *
 * `scripts/validate-content.ts` parses every JSON under ./pages with
 * `pageSchema`, and ./types re-exports the inferred types so route code keeps
 * importing the content model rather than Zod.
 */

import { z } from "zod";

export const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const cardBlockItemSchema = z.object({
  title: z.string(),
  body: z.string().optional(),
  href: z.string().optional(),
  image: z.string().optional(),
  meta: z.string().optional(),
});

export const cardSchema = z.object({
  title: z.string(),
  body: z.string().optional(),
  href: z.string(),
  group: z.string().optional(),
});

export const statSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("prose"), html: z.string() }),
  z.object({
    type: z.literal("list"),
    ordered: z.boolean(),
    items: z.array(z.string()),
  }),
  z.object({ type: z.literal("quotes"), items: z.array(z.string()) }),
  z.object({
    type: z.literal("table"),
    head: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  z.object({ type: z.literal("cards"), items: z.array(cardBlockItemSchema) }),
  z.object({
    type: z.literal("quote"),
    text: z.string(),
    name: z.string().optional(),
    role: z.string().optional(),
    image: z.string().optional(),
  }),
  z.object({
    type: z.literal("media"),
    src: z.string(),
    alt: z.string().optional(),
    poster: z.string().optional(),
    href: z.string().optional(),
  }),
  z.object({ type: z.literal("stats"), items: z.array(statSchema) }),
]);

export const heroSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  paragraphs: z.array(z.string()),
  actions: z.array(linkSchema),
  media: z.string().optional(),
  mediaPoster: z.string().optional(),
});

export const pageSectionSchema = z.object({
  id: z.string().optional(),
  heading: z.string().optional(),
  eyebrow: z.string().optional(),
  variant: z.string().optional(),
  blocks: z.array(blockSchema),
});

export const faqItemSchema = z.object({
  q: z.string(),
  a: z.string(),
});

export const closingSchema = z.object({
  title: z.string(),
  body: z.string(),
  cta: linkSchema,
});

export const pageSchema = z.object({
  route: z.string(),
  family: z.string(),
  meta: z.object({ title: z.string(), description: z.string() }),
  hero: heroSchema,
  sections: z.array(pageSectionSchema),
  faq: z.array(faqItemSchema).optional(),
  closing: closingSchema.optional(),
  cards: z.array(cardSchema).optional(),
});

export type Block = z.infer<typeof blockSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type PageSection = z.infer<typeof pageSectionSchema>;
export type Card = z.infer<typeof cardSchema>;
export type Page = z.infer<typeof pageSchema>;
