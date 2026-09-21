/** Split a photo credit so the leading "Fotograf" label can be bolded. */
export function fotografCreditParts(
  credit: string,
): { label: string; rest: string } | null {
  const match = /^(Fotograf)([\s\S]*)$/.exec(credit)
  if (!match?.[1]) return null
  return { label: match[1], rest: match[2] ?? "" }
}

export type CreditLine = { label: string; rest: string }

function parseCreditSegment(segment: string): CreditLine {
  const line = segment.trim()
  const match = /^([A-Za-zÄÖÜäöüß]+)(:?\s*)(.*)$/u.exec(line)
  if (!match?.[1]) return { label: "", rest: line }
  return {
    label: `${match[1]}${match[2] ?? ""}`,
    rest: match[3] ?? "",
  }
}

/**
 * Parse credits like:
 * - "Fotograf: …\nArchitektur: …"
 * - "Fotograf: … | Architektur: …"
 */
export function creditLines(credit: string): CreditLine[] {
  return credit
    .split(/\n+|\s*\|\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map(parseCreditSegment)
}
