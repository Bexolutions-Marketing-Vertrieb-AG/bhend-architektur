import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const jobItemSchema = z.object({
  id: z.string().min(1),
  title: i18nStringSchema,
  body: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  ctaLabel: i18nStringSchema,
  /** Matches dialog data-application-dialog value */
  dialogId: z.string().min(1),
})

export const sectionJobOpeningsSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  items: z.array(jobItemSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionJobOpeningsSchema
