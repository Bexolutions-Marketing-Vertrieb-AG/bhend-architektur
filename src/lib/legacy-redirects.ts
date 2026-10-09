/**
 * Legacy WordPress URL → permanent destination map (one hop, final paths).
 * Never mass-redirect unknowns to `/` (soft-404).
 * Old paths identical to new ones (`/wohnen/`, `/Kontakt`) are handled by
 * {@link canonicalRequestPath}, not listed here.
 *
 * @see docs/template/SEO.md
 */

export type LegacyRedirect = {
  /** Final path (one hop), starting with `/` */
  to: string
}

const TEAM = { to: "/ueber-uns/team" }
const AKTUELL = { to: "/aktuell" }
const PRESSE = { to: "/ueber-uns/presse-extern" }
const MITGLIEDSCHAFTEN = { to: "/ueber-uns/mitgliedschaften" }
const JOBS = { to: "/bei-uns-arbeiten" }
const LEHRSTELLE = { to: "/architektur-erleben" }
const BLOG = { to: "/blog" }
const SITEMAP = { to: "/sitemap.xml" }

/** Path keys must be normalized via {@link normalizeLegacyPath}. */
export const LEGACY_REDIRECTS: Readonly<Record<string, LegacyRedirect>> = {
  "/team": TEAM,
  "/ueber-bhend-architektur": TEAM,
  "/ueber-bhend-architektur/team": TEAM,
  "/mitarbeiter": TEAM,
  "/aktuelle": AKTUELL,
  "/bhend-architektur-2": AKTUELL,
  "/category/aktuell": AKTUELL,
  "/projekt": AKTUELL,
  "/projekte": AKTUELL,
  "/presse-extern": PRESSE,
  "/ueber-bhend-architektur/presse-extern": PRESSE,
  "/mitgliedschaften": MITGLIEDSCHAFTEN,
  "/ueber-bhend-architektur/mitgliedschaften": MITGLIEDSCHAFTEN,
  "/ueber-bhend-architektur__trashed/mitgliedschaften": MITGLIEDSCHAFTEN,
  "/dienstleistung": { to: "/planung" },
  "/leistungen": { to: "/planung" },
  "/dienstleistung/planung": { to: "/planung" },
  "/dienstleistung/realisierung": { to: "/realisierung" },
  "/dienstleistung/beratung": { to: "/beratung" },
  "/dienstleistung/brandschutz": { to: "/brandschutz" },
  "/dienstleistung/energieberatung": { to: "/energieberatung" },
  "/dienstleistung/bauherrenberatung": { to: "/bauherrenberatung" },
  "/referenzen": { to: "/wohnen" },
  "/referenzen/wohnen": { to: "/wohnen" },
  "/referenzen/industrie-gewerbe": { to: "/industrie-gewerbe" },
  "/referenzen/oeffentliche-bauten": { to: "/oeffentliche-bauten" },
  "/category/wohnen": { to: "/wohnen" },
  "/category/industrie": { to: "/industrie-gewerbe" },
  "/category/oeffentlich": { to: "/oeffentliche-bauten" },
  "/freie-stellen": JOBS,
  "/freie-stellen-bhend": JOBS,
  "/freie-stelle": JOBS,
  "/bei-uns-arbeiten/freie-stellen": JOBS,
  "/bei-uns-arbeiten/freie-stellen-bhend": JOBS,
  "/bei-uns-arbeiten/vakanzen": JOBS,
  "/bei-uns-arbeiten/bewerbung": JOBS,
  "/lehrstelle": LEHRSTELLE,
  "/bei-uns-arbeiten/lehrstelle": LEHRSTELLE,
  "/freie-stelle/zeichner-in-schnuppertag": LEHRSTELLE,
  "/bhend-architektur-blog": BLOG,
  "/category/uncategorized": BLOG,
  "/feed": BLOG,
  "/datenschutz": { to: "/impressum" },
  "/sitemap_index.xml": SITEMAP,
  "/post-sitemap.xml": SITEMAP,
  "/page-sitemap.xml": SITEMAP,
  "/freie-stelle-sitemap.xml": SITEMAP,
  "/category-sitemap.xml": SITEMAP,
  "/author-sitemap.xml": SITEMAP,
  "/projekt-sitemap.xml": SITEMAP,
  "/wp-content/uploads/2025/08/bhend-architektur-werkliste.pdf": {
    to: "/downloads/Bhend-Architektur-Werkliste.pdf",
  },
  "/wp-content/uploads/2025/08/geak-muster-beratungsbericht.pdf": {
    to: "/energieberatung",
  },
  "/checkliste-fur-den-umbau": {
    to: "/posts/checkliste-fuer-den-umbau/checkliste-f-r-den-umbau",
  },
  "/10-inspirierende-ideen-fur-moderne-einfamilienhauser": {
    to: "/posts/10-inspirierende-ideen-fuer-moderne-einfamilienhaeuser/10-inspirierende-ideen-f-r-moderne-einfamilienh-user",
  },
  "/mitarbeiterzufriedenheit-als-erfolgsfaktor": {
    to: "/posts/mitarbeiterzufriedenheit-als-erfolgsfaktor/mitarbeiterzufriedenheit-als-erfolgsfaktor",
  },
  "/was-flache-hierarchie-bei-bhend-architektur-konkret-bedeutet": {
    to: "/posts/was-flache-hierarchie-bei-bhend-architektur-konkret-bedeutet/was-flache-hierarchie-bei-bhend-architektur-konkret-bedeutet",
  },
  "/so-entsteht-ein-grundriss-der-zu-ihrer-lebensweise-passt": {
    to: "/posts/so-entsteht-ein-grundriss-der-zu-ihrer-lebensweise-passt/so-entsteht-ein-grundriss-der-zu-ihrer-lebensweise-passt",
  },
  "/was-macht-ein-nachhaltiges-zuhause-aus": {
    to: "/posts/was-macht-ein-nachhaltiges-zuhause-aus/was-macht-ein-nachhaltiges-zuhause-aus",
  },
  "/umbau-und-sanierung-mit-weitblick": {
    to: "/posts/umbau-und-sanierung-mit-weitblick/umbau-und-sanierung-mit-weitblick",
  },
  "/mitarbeiter-erzahlen-was-teamspirit-fur-uns-ausmacht": {
    to: "/posts/mitarbeiter-erzaehlen-was-teamspirit-fuer-uns-ausmacht/mitarbeiter-erz-hlen-was-teamspirit-f-r-uns-ausmacht",
  },
  "/5-haufige-fehler-bei-sanierungen-und-wie-bhend-architektur-sie-vermeidet": {
    to: "/posts/5-haeufige-fehler-bei-sanierungen-und-wie-bhend-architektur-sie-vermeidet/5-h-ufige-fehler-bei-sanierungen-und-wie-bhend-architektur-sie-vermeidet",
  },
  "/wie-viel-planung-steckt-hinter-einer-erfolgreichen-sanierung": {
    to: "/posts/wie-viel-planung-steckt-hinter-einer-erfolgreichen-sanierung/wie-viel-planung-steckt-hinter-einer-erfolgreichen-sanierung",
  },
  "/wertschatzung-im-alltag": {
    to: "/posts/wertschaetzung-im-alltag/wertsch-tzung-im-alltag",
  },
  "/architektur-auf-augenhohe": {
    to: "/posts/architektur-auf-augenhoehe/architektur-auf-augenh-he",
  },
  "/ihr-individuelles-einfamilienhaus": {
    to: "/posts/ihr-individuelles-einfamilienhaus/ihr-individuelles-einfamilienhaus",
  },
  "/wie-beeinflusst-die-wohnraumgestaltung-ihre-lebensqualitat": BLOG,
}

/** Whole subtrees; exact entries in {@link LEGACY_REDIRECTS} win. */
export const LEGACY_PREFIX_REDIRECTS: ReadonlyArray<
  readonly [prefix: string, redirect: LegacyRedirect]
> = [
  ["/mitarbeiter/", TEAM],
  ["/freie-stelle/", JOBS],
  ["/bhend-architektur-blog/", BLOG],
  ["/author/", BLOG],
  ["/category/", BLOG],
  ["/feed/", BLOG],
]

/**
 * Normalize a request pathname for map lookup.
 * - lowercase
 * - collapse duplicate slashes
 * - strip trailing slash (except `/`)
 * - drop query/hash (caller should pass pathname only)
 */
export function normalizeLegacyPath(pathname: string): string {
  let path = pathname.split("?")[0]?.split("#")[0] ?? "/"
  path = path.replace(/\/{2,}/g, "/")
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1)
  }
  if (!path.startsWith("/")) path = `/${path}`
  return path.toLowerCase()
}

export function lookupLegacyRedirect(
  pathname: string,
): LegacyRedirect | undefined {
  const path = normalizeLegacyPath(pathname)
  const exact = LEGACY_REDIRECTS[path]
  if (exact) return exact
  return LEGACY_PREFIX_REDIRECTS.find(([prefix]) =>
    path.startsWith(prefix),
  )?.[1]
}

/**
 * Canonical form of a live path: no trailing slash, and lowercase for CMS
 * page paths. Post ids (`3ClhWZ`) and file names are case-sensitive.
 */
export function canonicalRequestPath(pathname: string): string {
  let path = pathname.replace(/\/{2,}/g, "/")
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1)
  const caseSensitive = path.startsWith("/posts/") || /\.[a-z0-9]+$/i.test(path)
  return caseSensitive ? path : path.toLowerCase()
}
