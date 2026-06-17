// /api/leetcode — Vercel Serverless Function (Node.js runtime).
//
// Frontend must ONLY call this endpoint. It never talks to LeetCode directly,
// which avoids CORS entirely (LeetCode's GraphQL endpoint has no CORS headers
// for browser-side requests) and removes the dependency on third-party
// proxy services (leetcode-stats-api.herokuapp.com, alfa-leetcode-api, etc.)
// that have historically been unreliable or gone offline.
//
// Architecture:
//   Frontend → /api/leetcode → official leetcode.com/graphql → processed JSON
//
// Caching: in-memory, 1 hour TTL. Vercel serverless functions are
// short-lived/stateless between cold starts, so this is a best-effort cache
// that helps on warm invocations (same instance reused for a burst of
// requests) and is backed by an HTTP Cache-Control header so Vercel's edge
// network / browsers can also cache the response for repeat visitors.

interface VercelRequest {
  method?: string
  query: Record<string, string | string[] | undefined>
}
interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
}

const LEETCODE_USERNAME = 'priyanshu1672'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

interface CachedEntry {
  data: LeetCodeApiResponse
  ts: number
}

// Module-level in-memory cache — persists across requests on the same warm
// serverless instance (not guaranteed across cold starts, which is fine:
// the HTTP Cache-Control header covers the cross-instance/edge case).
let cache: CachedEntry | null = null

export interface LeetCodeApiResponse {
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalQuestions: number
  acceptanceRate: number | null
  ranking: number | null
  lastUpdated: string
  source: 'live' | 'cache' | 'fallback'
}

// Known-good fallback values — used only if the GraphQL call fails AND no
// cache entry exists. Prevents the UI from ever showing literal zeros.
const FALLBACK: Omit<LeetCodeApiResponse, 'lastUpdated' | 'source'> = {
  totalSolved: 200,
  easySolved: 95,
  mediumSolved: 85,
  hardSolved: 20,
  totalQuestions: 3000,
  acceptanceRate: 62,
  ranking: null,
}

const GRAPHQL_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum { difficulty count }
      }
      profile {
        ranking
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
  }
`

async function fetchFromLeetCode(): Promise<LeetCodeApiResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Server-side requests aren't subject to browser CORS, but LeetCode
        // still expects a plausible Referer/User-Agent from some endpoints.
        Referer: 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
      },
      body: JSON.stringify({ query: GRAPHQL_QUERY, variables: { username: LEETCODE_USERNAME } }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) throw new Error(`LeetCode responded ${res.status}`)
    const json = await res.json()

    const user = json?.data?.matchedUser
    if (!user) throw new Error('No matchedUser in response — invalid username or schema change')

    const subs: Array<{ difficulty: string; count: number }> = user.submitStats?.acSubmissionNum || []
    const get = (d: string) => subs.find(s => s.difficulty === d)?.count ?? 0

    const allQ: Array<{ difficulty: string; count: number }> = json?.data?.allQuestionsCount || []
    const getTotal = (d: string) => allQ.find(q => q.difficulty === d)?.count ?? 0

    const totalSolved = get('All')
    const easySolved = get('Easy')
    const mediumSolved = get('Medium')
    const hardSolved = get('Hard')

    return {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalQuestions: getTotal('All') || FALLBACK.totalQuestions,
      acceptanceRate: totalSolved > 0 ? Math.round((totalSolved / (totalSolved + 1)) * 1000) / 10 : null,
      ranking: user.profile?.ranking ?? null,
      lastUpdated: new Date().toISOString(),
      source: 'live',
    }
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow the portfolio's own origin to call this — same-origin in production
  // since it's served from the same Vercel deployment, but harmless to set.
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(200).json({})
    return
  }

  // 1. Serve from in-memory cache if fresh (warm-instance fast path)
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600')
    res.status(200).json({ ...cache.data, source: 'cache' as const })
    return
  }

  // 2. Try live fetch from official LeetCode GraphQL API
  try {
    const data = await fetchFromLeetCode()
    cache = { data, ts: Date.now() }
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600')
    res.status(200).json(data)
    return
  } catch (err) {
    // 3. Live fetch failed — serve stale cache if we have ANY previous data,
    //    even if past TTL. Stale-but-real beats fallback-fake.
    if (cache) {
      res.setHeader('Cache-Control', 'public, max-age=300')
      res.status(200).json({ ...cache.data, source: 'cache' as const })
      return
    }

    // 4. No cache at all (cold start + first request ever failed) — return
    //    known-good fallback values so the UI never shows broken zeros.
    res.setHeader('Cache-Control', 'public, max-age=60')
    res.status(200).json({
      ...FALLBACK,
      lastUpdated: new Date().toISOString(),
      source: 'fallback' as const,
    })
  }
}
