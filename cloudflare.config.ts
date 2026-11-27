import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "tano-clone",
    domains: ["app.kaplun.tech"],
    entrypoint: "./worker/index.js",
    compatibilityDate: "2026-11-27",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: [
        "/*",
        "!/_next/static/*",
        "!/*/_next/static/*",
        "!/sites/tano/fonts/*",
        "!/sites/tano/images/*",
        "!/brand-mark/*",
      ],
    },
    env: {
      ASSETS: bindings.assets(),
    },
    observability: {
      enabled: true,
      logs: { enabled: true, invocationLogs: true },
      traces: { enabled: true },
    },
  }),
});
