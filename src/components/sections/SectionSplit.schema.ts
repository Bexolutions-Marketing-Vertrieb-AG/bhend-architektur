import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"
import { RESERVATION_MODES } from "~/lib/reservation"

const itemSchema = z.object({
  text: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
})

export const sectionSplitSchema = z.object({
  id: z.string().optional(),
  heading: i18nStringSchema,
  title: i18nStringSchema,
  body: i18nStringSchema.optional(),
  lead: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  imagePosition: z.enum(["left", "right"]).optional(),
  caption: i18nStringSchema.optional(),
  items: z.array(itemSchema).optional(),
  ctaLabel: i18nStringSchema.optional(),
  ctaHref: z.string().optional(),
  reservationMode: z.enum(RESERVATION_MODES).optional(),
  reservationTarget: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionSplitSchema
