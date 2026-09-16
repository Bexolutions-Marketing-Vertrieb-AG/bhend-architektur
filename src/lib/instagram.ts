/**
 * Instagram media for careers / social sections.
 * Prefer Graph API when tokens are set; optional JSON feed URL as fallback.
 */
import { PUBLIC_INSTAGRAM_USERNAME } from "astro:env/client"

export type InstagramPost = {
  id: string
  permalink: string
  mediaUrl: string
  thumbnailUrl?: string
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | string
  caption?: string
  timestamp?: string
}

export type InstagramProfile = {
  username: string
  profileUrl: string
  biography?: string
  profilePictureUrl?: string
}

type FetchResult = {
  profile: InstagramProfile
  posts: InstagramPost[]
  source: "graph" | "json" | "empty"
}

function readSecret(name: string): string {
  if (typeof process === "undefined") return ""
  return (process.env[name] ?? "").trim()
}

function usernameFromEnv(fallback = "bhend.architektur"): string {
  const raw = (PUBLIC_INSTAGRAM_USERNAME || fallback).replace(/^@/, "").trim()
  return raw || fallback
}

export function instagramProfile(
  username = usernameFromEnv(),
): InstagramProfile {
  const handle = username.replace(/^@/, "")
  return {
    username: handle,
    profileUrl: `https://www.instagram.com/${handle}/`,
    biography: "Bauen für Menschen, gestalten für Generationen.",
  }
}

async function fetchGraphMedia(
  userId: string,
  token: string,
  limit: number,
): Promise<InstagramPost[]> {
  const fields =
    "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp"
  const url = new URL(`https://graph.instagram.com/${userId}/media`)
  url.searchParams.set("fields", fields)
  url.searchParams.set("limit", String(limit))
  url.searchParams.set("access_token", token)

  const res = await fetch(url, { headers: { Accept: "application/json" } })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    console.error(
      "[instagram] Graph API failed:",
      res.status,
      body.slice(0, 200),
    )
    return []
  }
  const data = (await res.json()) as {
    data?: Array<{
      id: string
      caption?: string
      media_type?: string
      media_url?: string
      permalink?: string
      thumbnail_url?: string
      timestamp?: string
    }>
  }
  return (data.data ?? []).flatMap((item) => {
    const mediaUrl = item.media_url || item.thumbnail_url || ""
    if (!mediaUrl || !item.permalink) return []
    const post: InstagramPost = {
      id: item.id,
      permalink: item.permalink,
      mediaUrl,
      mediaType: item.media_type ?? "IMAGE",
    }
    if (item.thumbnail_url) post.thumbnailUrl = item.thumbnail_url
    if (item.caption) post.caption = item.caption
    if (item.timestamp) post.timestamp = item.timestamp
    return [post]
  })
}

async function fetchJsonFeed(
  feedUrl: string,
  limit: number,
): Promise<InstagramPost[]> {
  const res = await fetch(feedUrl, { headers: { Accept: "application/json" } })
  if (!res.ok) {
    console.error("[instagram] JSON feed failed:", res.status)
    return []
  }
  const raw = (await res.json()) as unknown
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { posts?: unknown }).posts)
      ? (raw as { posts: unknown[] }).posts
      : Array.isArray((raw as { data?: unknown }).data)
        ? (raw as { data: unknown[] }).data
        : []

  return list.slice(0, limit).flatMap((item, index) => {
    if (!item || typeof item !== "object") return []
    const row = item as Record<string, unknown>
    const mediaUrl = String(
      row.mediaUrl ?? row.media_url ?? row.image ?? row.url ?? "",
    )
    const permalink = String(row.permalink ?? row.link ?? row.href ?? "")
    if (!mediaUrl || !permalink) return []
    const post: InstagramPost = {
      id: String(row.id ?? `json-${index}`),
      permalink,
      mediaUrl,
      mediaType: String(row.mediaType ?? row.media_type ?? "IMAGE"),
    }
    if (typeof row.thumbnailUrl === "string")
      post.thumbnailUrl = row.thumbnailUrl
    else if (typeof row.thumbnail_url === "string")
      post.thumbnailUrl = row.thumbnail_url
    if (typeof row.caption === "string") post.caption = row.caption
    else if (typeof row.title === "string") post.caption = row.title
    if (typeof row.timestamp === "string") post.timestamp = row.timestamp
    return [post]
  })
}

/** Load latest posts for SSR. Never invents fake media. */
export async function fetchInstagramFeed(options?: {
  limit?: number
  username?: string
}): Promise<FetchResult> {
  const limit = Math.min(24, Math.max(1, options?.limit ?? 12))
  const profile = instagramProfile(options?.username)

  const token = readSecret("INSTAGRAM_ACCESS_TOKEN")
  const userId = readSecret("INSTAGRAM_USER_ID")
  const feedUrl = readSecret("INSTAGRAM_FEED_JSON_URL")

  if (token && userId) {
    try {
      const posts = await fetchGraphMedia(userId, token, limit)
      if (posts.length > 0) {
        return { profile, posts, source: "graph" }
      }
    } catch (error) {
      console.error("[instagram] Graph fetch error:", error)
    }
  }

  if (feedUrl) {
    try {
      const posts = await fetchJsonFeed(feedUrl, limit)
      if (posts.length > 0) {
        return { profile, posts, source: "json" }
      }
    } catch (error) {
      console.error("[instagram] JSON feed error:", error)
    }
  }

  return { profile, posts: [], source: "empty" }
}
