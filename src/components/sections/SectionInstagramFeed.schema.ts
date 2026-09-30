import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const instagramPostSchema = z.object({
  id: z.string(),
  permalink: z.string(),
  mediaUrl: z.string(),
  thumbnailUrl: z.string().optional(),
  mediaType: z.string(),
  caption: z.string().optional(),
  timestamp: z.string().optional(),
})

const instagramProfileSchema = z.object({
  username: z.string(),
  profileUrl: z.string(),
  biography: z.string().optional(),
  profilePictureUrl: z.string().optional(),
})

export const sectionInstagramFeedSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  username: z.string().optional(),
  biography: i18nStringSchema.optional(),
  limit: z.number().int().min(1).max(24).optional(),
  // Injected at request time by enrichInstagramFeedSections.
  profile: instagramProfileSchema.optional(),
  posts: z.array(instagramPostSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionInstagramFeedSchema
