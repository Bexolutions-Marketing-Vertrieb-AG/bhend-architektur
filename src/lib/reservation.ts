/**
 * Typed CTA / reservation contract — no label heuristics.
 * @see docs/template/PROMPTS.md / PATCHES §6
 */
export const RESERVATION_MODES = [
  "opentable",
  "mailto",
  "anchor",
  "path",
  "url",
] as const

export type ReservationMode = (typeof RESERVATION_MODES)[number]

export type ReservationFields = {
  reservationMode?: ReservationMode | null
  reservationTarget?: string | null
  /** Legacy fallback when mode unset */
  ctaHref?: string | null
}

/**
 * Resolve CTA href from explicit mode + target (never from visible CTA text).
 */
export function resolveReservationHref(fields: ReservationFields): string {
  const mode = fields.reservationMode
  const target = (fields.reservationTarget ?? "").trim()

  if (!mode) {
    return (fields.ctaHref ?? "#").trim() || "#"
  }

  switch (mode) {
    case "opentable":
    case "url":
      return target || (fields.ctaHref ?? "#") || "#"
    case "mailto":
      if (!target) return fields.ctaHref?.trim() || "#"
      return target.startsWith("mailto:") ? target : `mailto:${target}`
    case "anchor":
      if (!target) return "#"
      return target.startsWith("#") ? target : `#${target}`
    case "path":
      if (!target) return fields.ctaHref?.trim() || "/"
      return target.startsWith("/") ? target : `/${target}`
    default: {
      const _exhaustive: never = mode
      return _exhaustive
    }
  }
}
