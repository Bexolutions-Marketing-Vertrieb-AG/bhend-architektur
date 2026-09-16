import type { I18nString } from "./i18n"
import type { Section } from "./section"
import type { ProjectCategory } from "~/config/projects"

export type PostStatus = {
  options?: string[]
  value: string
}

export type Post = {
  id: string
  title: I18nString
  lead?: I18nString
  img?: string
  status?: PostStatus
  sections: Section[]
  keywords?: string[]
  /** Listing category for architectural projects; null/undefined = blog post */
  category?: ProjectCategory | string | null
  /** Sort key for projects (DESC) */
  year?: number | null
  created_at?: string
  updated_at?: string
}
