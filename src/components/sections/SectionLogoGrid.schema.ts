import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const itemSchema = z.object({
  title: i18nStringSchema,
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  href: z.string().optional(),
})

export const sectionLogoGridSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema,
  heading: i18nStringSchema,
  items: z.array(itemSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionLogoGridSchema
