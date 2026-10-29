/**
 * Instagram media for careers / social sections.
 * Prefer Graph API when tokens are set; optional JSON feed URL as fallback.
 */
import { PUBLIC_INSTAGRAM_USERNAME } from "astro:env/client"
import {
  INSTAGRAM_ACCESS_TOKEN,
  INSTAGRAM_FEED_JSON_URL,
  INSTAGRAM_USER_ID,
} from "astro:env/server"

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

async function fetchJsonFeed(feedUrl: string): Promise<InstagramPost[]> {
  const res = await fetch(feedUrl, {
    headers: {
      Accept: "application/json",
      // rss.app sometimes answers 402 to bare Node fetches without a UA.
      "User-Agent":
        "Mozilla/5.0 (compatible; BhendArchitekturBot/1.0; +https://www.bhend-architektur.ch)",
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    console.error(
      "[instagram] JSON feed failed:",
      res.status,
      body.slice(0, 120),
    )
    return []
  }
  const raw = (await res.json()) as unknown
  // JSON Feed 1.1 (e.g. rss.app) puts posts under `items`, with `url` as the permalink.
  const isJsonFeed = Array.isArray((raw as { items?: unknown }).items)
  const list = Array.isArray(raw)
    ? raw
    : isJsonFeed
      ? (raw as { items: unknown[] }).items
      : Array.isArray((raw as { posts?: unknown }).posts)
        ? (raw as { posts: unknown[] }).posts
        : Array.isArray((raw as { data?: unknown }).data)
          ? (raw as { data: unknown[] }).data
          : []

  return list.flatMap((item, index) => {
    if (!item || typeof item !== "object") return []
    const row = item as Record<string, unknown>
    const mediaUrl = String(
      row.mediaUrl ??
        row.media_url ??
        row.image ??
        (isJsonFeed ? "" : row.url) ??
        "",
    )
    const permalink = String(
      row.permalink ??
        row.link ??
        row.href ??
        (isJsonFeed ? row.url : "") ??
        "",
    )
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
    const caption = [row.caption, row.content_text, row.title].find(
      (value): value is string =>
        typeof value === "string" && value.trim() !== "",
    )
    if (caption) post.caption = caption
    const timestamp = row.timestamp ?? row.date_published
    if (typeof timestamp === "string") post.timestamp = timestamp
    return [post]
  })
}

async function mediaUrlReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(2500),
      headers: {
        Accept: "image/*,*/*",
        Referer: "https://www.instagram.com/",
        "User-Agent":
          "Mozilla/5.0 (compatible; BhendArchitekturBot/1.0; +https://www.bhend-architektur.ch)",
      },
    })
    if (res.body) {
      await res.body.cancel().catch(() => undefined)
    }
    return res.ok
  } catch {
    return false
  }
}

/** Keep posts whose image still loads; preserve order; stop at `limit`. */
async function pickReachablePosts(
  posts: InstagramPost[],
  limit: number,
): Promise<InstagramPost[]> {
  // Probe in small batches so one slow CDN host cannot block the whole page.
  const out: InstagramPost[] = []
  const batchSize = 6
  for (let i = 0; i < posts.length && out.length < limit; i += batchSize) {
    const batch = posts.slice(i, i + batchSize)
    const checks = await Promise.all(
      batch.map(async (post) => ({
        post,
        ok: await mediaUrlReachable(post.thumbnailUrl || post.mediaUrl),
      })),
    )
    for (const entry of checks) {
      if (!entry.ok) continue
      out.push(entry.post)
      if (out.length >= limit) break
    }
  }
  return out
}

/** Load latest posts for SSR. Never invents fake media. */
export async function fetchInstagramFeed(options?: {
  limit?: number
  username?: string
}): Promise<FetchResult> {
  const limit = Math.min(24, Math.max(1, options?.limit ?? 6))
  const profile = instagramProfile(options?.username)

  const token = (INSTAGRAM_ACCESS_TOKEN ?? "").trim()
  const userId = (INSTAGRAM_USER_ID ?? "").trim()
  const feedUrl = (INSTAGRAM_FEED_JSON_URL ?? "").trim()

  if (token && userId) {
    try {
      // Over-fetch so dead CDN URLs can be replaced within `limit`.
      const candidates = await fetchGraphMedia(
        userId,
        token,
        Math.min(24, limit * 2),
      )
      const posts = await pickReachablePosts(candidates, limit)
      if (posts.length > 0) {
        return { profile, posts, source: "graph" }
      }
    } catch (error) {
      console.error("[instagram] Graph fetch error:", error)
    }
  }

  if (feedUrl) {
    try {
      const candidates = await fetchJsonFeed(feedUrl)
      const posts = await pickReachablePosts(candidates, limit)
      if (posts.length > 0) {
        return { profile, posts, source: "json" }
      }
    } catch (error) {
      console.error("[instagram] JSON feed error:", error)
    }
  }

  return { profile, posts: [], source: "empty" }
}
