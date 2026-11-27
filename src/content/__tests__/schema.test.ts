import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CONTENT_DIR,
  collectPageFiles,
  validateContent,
  validatePages,
  type PageEntry,
} from "../../../scripts/validate-content";
import { blockSchema, pageSchema } from "../schema";

const pageBase = {
  family: "guide",
  meta: { title: "Title", description: "Description" },
  hero: { title: "Hero", paragraphs: ["Intro copy"], actions: [] },
  sections: [],
};

describe("page schema", () => {
  it("parses every captured page", () => {
    const files = collectPageFiles(CONTENT_DIR);
    expect(files).toHaveLength(44);

    const failures: string[] = [];
    for (const file of files) {
      const data: unknown = JSON.parse(readFileSync(file, "utf8"));
      const result = pageSchema.safeParse(data);
      if (!result.success) {
        failures.push(`${path.basename(file)}: ${JSON.stringify(result.error.issues)}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("rejects a page without meta", () => {
    const withoutMeta = {
      route: "/no-meta",
      family: pageBase.family,
      hero: pageBase.hero,
      sections: pageBase.sections,
    };

    const result = pageSchema.safeParse(withoutMeta);
    expect(result.success).toBe(false);
  });

  it("rejects a duplicate route", () => {
    const entries: PageEntry[] = [
      { file: "first.json", data: { ...pageBase, route: "/duplicate" } },
      { file: "second.json", data: { ...pageBase, route: "/duplicate" } },
    ];

    const { pages, errors } = validatePages(entries);

    expect(pages).toHaveLength(1);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("duplicate route");
    expect(errors[0]).toContain("/duplicate");
  });

  it("accepts the whole content tree", () => {
    const { pages, errors } = validateContent();

    expect(errors).toEqual([]);
    expect(pages).toHaveLength(44);
    expect(pages.some((page) => page.route === "/")).toBe(true);
  });
});

const blockFixtures = [
  { type: "prose", html: "<p>Hello <strong>world</strong></p>" },
  { type: "list", ordered: true, items: ["One", "Two"] },
  { type: "quotes", items: ["A line worth quoting."] },
  { type: "table", head: ["Metric", "Value"], rows: [["Reach", "1M"]] },
  {
    type: "cards",
    items: [
      {
        title: "Card",
        body: "Body",
        href: "/card",
        image: "/card.png",
        meta: "Meta",
      },
    ],
  },
  {
    type: "quote",
    text: "Words",
    name: "Ada",
    role: "Founder",
    image: "/ada.png",
  },
  {
    type: "media",
    src: "/clip.mp4",
    alt: "Clip",
    poster: "/poster.jpg",
    href: "/watch",
  },
  { type: "stats", items: [{ value: "79%", label: "Faster" }] },
] as const;

describe("block schema", () => {
  for (const fixture of blockFixtures) {
    it(`parses the ${fixture.type} block`, () => {
      const result = blockSchema.safeParse(fixture);
      expect(result.success).toBe(true);
    });
  }

  it("rejects an unknown block type", () => {
    const result = blockSchema.safeParse({ type: "video", src: "/clip.mp4" });
    expect(result.success).toBe(false);
  });
});
