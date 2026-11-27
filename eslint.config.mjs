import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: { "@next/next/no-img-element": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated from the frozen source capture; regenerate with
    // scripts/generate-replicas.mjs instead of editing these files.
    "src/components/sites/tano/replica/**",
    "src/content/tano/**",
    "docs/**",
    "public/**",
  ]),
]);

export default eslintConfig;
