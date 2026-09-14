import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"
import { RESERVATION_MODES } from "~/lib/reservation"

export const sectionHeroSchema = z.object({
  title: i18nStringSchema,
  lead: i18nStringSchema.optional(),
  ctaLabel: i18nStringSchema.optional(),
  ctaHref: z.string().optional(),
  reservationMode: z.enum(RESERVATION_MODES).optional(),
  reservationTarget: z.string().optional(),
  img: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionHeroSchema
