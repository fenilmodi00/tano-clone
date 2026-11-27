import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: { "@next/next/no-img-element": "off" } },
  {
    // Captured marketing copy legitimately contains apostrophes and quotes;
    // escaping them would change the rendered text.
    files: ["src/app/**/_components/captured-body.tsx", "src/app/_home/captured-body.tsx"],
    rules: { "react/no-unescaped-entities": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "docs/**",
    "public/**",
  ]),
]);

export default eslintConfig;
