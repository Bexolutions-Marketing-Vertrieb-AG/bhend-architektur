import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionInstagramFeedSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  username: z.string().optional(),
  biography: i18nStringSchema.optional(),
  limit: z.number().int().min(1).max(24).optional(),
  _orbi: orbiSchema,
})

export default sectionInstagramFeedSchema
