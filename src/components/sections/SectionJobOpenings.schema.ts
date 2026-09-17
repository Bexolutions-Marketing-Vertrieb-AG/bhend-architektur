import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const jobItemSchema = z.object({
  id: z.string().min(1),
  title: i18nStringSchema,
  body: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  ctaLabel: i18nStringSchema,
  /** Opens application dialog when set (and no path CTA) */
  dialogId: z.string().min(1).optional(),
  reservationMode: z.enum(["path", "url", "mailto", "anchor"]).optional(),
  reservationTarget: z.string().optional(),
  ctaHref: z.string().optional(),
})

export const sectionJobOpeningsSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  items: z.array(jobItemSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionJobOpeningsSchema
