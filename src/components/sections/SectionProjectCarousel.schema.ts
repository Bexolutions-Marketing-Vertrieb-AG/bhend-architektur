import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const itemSchema = z.object({
  title: i18nStringSchema,
  text: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
})

export const sectionProjectCarouselSchema = z.object({
  id: z.string().optional(),
  items: z.array(itemSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionProjectCarouselSchema
