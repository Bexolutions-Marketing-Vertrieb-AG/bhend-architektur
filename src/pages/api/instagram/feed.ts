import type { APIRoute } from "astro"
import { fetchInstagramFeed } from "~/lib/instagram"

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const limit = Number(url.searchParams.get("limit") ?? "12")
  const username = url.searchParams.get("username") ?? undefined
  const feed = await fetchInstagramFeed({
    limit,
    username: username ?? undefined,
  })
  return new Response(JSON.stringify(feed), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  })
}
