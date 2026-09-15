import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"
import { RESERVATION_MODES } from "~/lib/reservation"

export const sectionServiceIntroSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  lead: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  ctaLabel: i18nStringSchema.optional(),
  ctaHref: z.string().optional(),
  reservationMode: z.enum(RESERVATION_MODES).optional(),
  reservationTarget: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionServiceIntroSchema
