/** Split a photo credit so the leading "Fotograf" label can be bolded. */
export function fotografCreditParts(
  credit: string,
): { label: string; rest: string } | null {
  const match = /^(Fotograf)([\s\S]*)$/.exec(credit)
  if (!match?.[1]) return null
  return { label: match[1], rest: match[2] ?? "" }
}
