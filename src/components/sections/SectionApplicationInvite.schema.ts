import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionApplicationInviteSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
  ctaLabel: i18nStringSchema,
  /** Opens application dialog by id */
  dialogId: z.string().min(1),
  defaultApplicationType: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionApplicationInviteSchema
