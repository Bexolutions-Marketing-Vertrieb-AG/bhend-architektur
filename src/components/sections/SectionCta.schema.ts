import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"
import { RESERVATION_MODES } from "~/lib/reservation"

export const sectionCtaSchema = z.object({
  title: i18nStringSchema,
  text: i18nStringSchema.optional(),
  lead: i18nStringSchema.optional(),
  ctaLabel: i18nStringSchema,
  ctaHref: z.string().optional(),
  reservationMode: z.enum(RESERVATION_MODES).optional(),
  reservationTarget: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionCtaSchema
