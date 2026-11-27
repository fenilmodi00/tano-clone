#!/usr/bin/env node
/**
 * Validate the captured page content under src/content/pages.
 *
 * Every JSON file is parsed with the Zod page schema. The command fails when a
 * file is malformed, a route is declared twice, the page count does not match
 * the generated route manifest, or the required `/` route is missing.
 *
 * Run with: npx tsx scripts/validate-content.ts
 */

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pageSchema, type Page } from "../src/content/schema";
import { ROUTES } from "../src/content/routes";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const CONTENT_DIR = path.join(ROOT, "src/content/pages");

export type PageEntry = {
  /** Path shown in validation errors. */
  file: string;
  data: unknown;
};

export type ContentValidation = {
  pages: Page[];
  errors: string[];
};

function display(file: string): string {
  return path.relative(ROOT, file) || file;
}

export function collectPageFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((entry) => entry.endsWith(".json"))
    .map((entry) => path.join(dir, entry))
    .sort();
}

/** Parse entries and reject schema errors plus duplicate routes. */
export function validatePages(entries: PageEntry[]): ContentValidation {
  const pages: Page[] = [];
  const errors: string[] = [];
  const routes = new Map<string, string>();

  for (const { file, data } of entries) {
    const result = pageSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const location = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        errors.push(`${file}: ${location}: ${issue.message}`);
      }
      continue;
    }

    const route = result.data.route;
    const existing = routes.get(route);
    if (existing !== undefined) {
      errors.push(
        `${file}: duplicate route ${JSON.stringify(route)} (already declared in ${existing})`,
      );
      continue;
    }

    routes.set(route, file);
    pages.push(result.data);
  }

  return { pages, errors };
}

/** Walk a content directory and validate every page inside it. */
export function validateContent(dir = CONTENT_DIR): ContentValidation {
  let files: string[];
  try {
    files = collectPageFiles(dir);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { pages: [], errors: [`${display(dir)}: ${message}`] };
  }

  const errors: string[] = [];
  const entries: PageEntry[] = [];
  for (const file of files) {
    try {
      entries.push({
        file: display(file),
        data: JSON.parse(readFileSync(file, "utf8")),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${display(file)}: invalid JSON: ${message}`);
    }
  }

  const { pages, errors: pageErrors } = validatePages(entries);
  errors.push(...pageErrors);

  if (errors.length === 0) {
    if (pages.length !== ROUTES.length) {
      errors.push(`expected ${ROUTES.length} pages, found ${pages.length}`);
    }
    if (!pages.some((page) => page.route === "/")) {
      errors.push('missing required route "/"');
    }
  }

  return { pages, errors };
}

export function main(): number {
  const { pages, errors } = validateContent();
  if (errors.length > 0) {
    console.error("Content validation failed:");
    for (const error of errors) {
      console.error(`  ${error}`);
    }
    return 1;
  }

  console.log(`content OK: ${pages.length} pages`);
  return 0;
}

const entry = process.argv.at(1);
const invokedDirectly =
  entry !== undefined && pathToFileURL(path.resolve(entry)).href === import.meta.url;

if (invokedDirectly) {
  process.exitCode = main();
}
