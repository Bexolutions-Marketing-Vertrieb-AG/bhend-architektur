import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionLehrstelleSplitSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  subheading: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  ctaLabel: i18nStringSchema.optional(),
  dialogId: z.string().min(1).optional(),
  defaultApplicationType: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionLehrstelleSplitSchema
