import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const blogCardSchema = z.object({
  id: z.string().min(1),
  title: i18nStringSchema,
  lead: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  href: z.string().optional(),
  publishedAt: z.string().optional(),
  ctaLabel: i18nStringSchema.optional(),
})

export const sectionBlogFeedSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  /** Injected at render by [...slug].astro */
  posts: z.array(blogCardSchema).optional(),
  emptyMessage: i18nStringSchema.optional(),
  _orbi: orbiSchema,
})

export default sectionBlogFeedSchema
