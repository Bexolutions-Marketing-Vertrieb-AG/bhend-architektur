import { defineConfig, envField } from "astro/config"
import vercel from "@astrojs/vercel"
import { cacheVercel } from "@astrojs/vercel/cache"
import tailwindcss from "@tailwindcss/vite"

import { DEFAULT_LOCALE, LOCALES } from "./src/config/locales"

// `astro:env` is a virtual module and is unavailable here, so this file reads
// process.env directly. See docs/DEVIATIONS.md V-03.
const renderMode = process.env["RENDER_MODE"] === "static" ? "static" : "server"

export default defineConfig({
  site: process.env["PUBLIC_SITE_URL"] ?? "http://localhost:4321",
  output: renderMode,
  // Skew Protection must also be enabled in the Vercel project UI.
  // Short HTML swr avoids serving HTML that points at rotated /_astro hashes.
  // See docs/template/CACHE.md and ADR-0005.
  adapter: vercel({ skewProtection: true }),

  // Inert under `output: "static"` — prerendered pages never enter the
  // caching pipeline, so this costs nothing in that mode.
  cache: { provider: cacheVercel() },

  // Every rule sets maxAge: the runtime gate checks `maxAge` and `tags` but
  // never `swr`, so a rule carrying only `swr` emits no headers at all.
  // Keep HTML swr ≤ 60 — long SWR + hashed assets causes deploy-skew CSS 404s.
  // The `/[...slug]` catch-all also matches /api/**, which src/middleware.ts
  // guards at runtime. See docs/DEVIATIONS.md D-07.
  routeRules: {
    "/": { maxAge: 60, swr: 60, tags: ["cms", "page:home"] },
    "/posts": { maxAge: 120, swr: 60, tags: ["cms", "posts"] },
    "/posts/[id]/[...slug]": { maxAge: 300, swr: 60, tags: ["cms", "posts"] },
    "/[...slug]": { maxAge: 300, swr: 60, tags: ["cms", "pages"] },
  },

  vite: { plugins: [tailwindcss()] },

  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: {
      prefixDefaultLocale: false,
      // Default flipped true -> false in Astro 6; set explicitly so a future
      // default change cannot move it back under us.
      redirectToDefaultLocale: false,
    },
  },

  env: {
    schema: {
      ORBITYPE_API_SQL_URL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        default: "https://core.orbitype.com/api/sql/v1",
      }),
      ORBITYPE_API_SQL_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      ORBITYPE_MOCK: envField.boolean({
        context: "server",
        access: "public",
        optional: true,
        default: false,
      }),
      RENDER_MODE: envField.enum({
        context: "server",
        access: "public",
        values: ["server", "static"],
        default: "server",
      }),
      REVALIDATE_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),

      MAIL_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      MAIL_FROM_EMAIL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      MAIL_FROM_NAME: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      MAIL_TO_EMAIL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),

      INSTAGRAM_ACCESS_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      INSTAGRAM_USER_ID: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      INSTAGRAM_FEED_JSON_URL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      PUBLIC_INSTAGRAM_USERNAME: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "bhend.architektur",
      }),

      PUBLIC_SITE_URL: envField.string({ context: "client", access: "public" }),
      PUBLIC_SITE_NAME: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_SITE_DESCRIPTION: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_ORGANIZATION_NAME: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_ORGANIZATION_LOGO: envField.string({
        context: "client",
        access: "public",
        default: "/favicon.png",
      }),
      PUBLIC_OG_LOGO_PATH: envField.string({
        context: "client",
        access: "public",
        default: "/favicon.png",
      }),
      PUBLIC_OG_IMAGE_ENABLED: envField.boolean({
        context: "client",
        access: "public",
        default: true,
      }),
      PUBLIC_COMMENTS_ENABLED: envField.boolean({
        context: "client",
        access: "public",
        default: false,
      }),
      PUBLIC_GTM_ID: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "",
      }),
      PUBLIC_TWITTER_SITE: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "",
      }),
      PUBLIC_TWITTER_CREATOR: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "",
      }),
    },
  },
})
