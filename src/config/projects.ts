/**
 * Architectural project listing categories (page slug = category value).
 * Phase: `aktuell` = under construction; others = finished (Referenzen).
 */
export const PROJECT_CATEGORIES = [
  "aktuell",
  "wohnen",
  "industrie-gewerbe",
  "oeffentliche-bauten",
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export function isProjectCategory(value: string): value is ProjectCategory {
  return (PROJECT_CATEGORIES as readonly string[]).includes(value)
}

export function projectPhase(
  category: ProjectCategory,
): "aktuell" | "referenz" {
  return category === "aktuell" ? "aktuell" : "referenz"
}

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  aktuell: "Aktuell",
  wohnen: "Wohnen",
  "industrie-gewerbe": "Industrie Gewerbe",
  "oeffentliche-bauten": "Öffentliche Bauten",
}
