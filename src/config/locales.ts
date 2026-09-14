/**
 * Single source of truth for locales, imported by both `astro.config.ts` and
 * the type layer.
 *
 * To change the shipped language, edit `LOCALES` and `DEFAULT_LOCALE`.
 *
 * To add a second locale, add it to `LOCALES` and set `i18n.routing` to
 * `"manual"` in `astro.config.ts`. Astro's built-in i18n is folder-based and
 * does not combine with the root `[...slug]` catch-all a CMS-driven site
 * needs, so this template derives the locale from URL segments itself.
 * See docs/00-TEMPLATE-BLUEPRINT.md §7.6 and ADR-0006.
 */
export const LOCALES = ["de"] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "de"

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}
