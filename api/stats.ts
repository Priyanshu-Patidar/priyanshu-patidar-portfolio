import { kv } from '@vercel/kv'

interface VercelRequest {
  method?: string
  query: Record<string, string | string[] | undefined>
  body?: any
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
}

const KEYS = {
  VIEWS: 'stats:portfolio_views',
  DOWNLOADS: 'stats:resume_downloads',
  PROJECT_PREFIX: 'stats:project_views:'
}

// Baselines to ensure we don't start from 0 if the DB is fresh
const BASELINES = {
  VIEWS: 100,
  DOWNLOADS: 25
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { type, projectId } = req.query

  try {
    // 1. GET Stats
    if (req.method === 'GET') {
      if (type === 'resume') {
        const count = await kv.get<number>(KEYS.DOWNLOADS)
        return res.status(200).json({ count: Math.max(count || 0, BASELINES.DOWNLOADS) })
      }

      if (type === 'project' && projectId) {
        const count = await kv.get<number>(`${KEYS.PROJECT_PREFIX}${projectId}`)
        return res.status(200).json({ count: count || 0 })
      }

      // Default: Portfolio Views
      const count = await kv.get<number>(KEYS.VIEWS)
      return res.status(200).json({ count: Math.max(count || 0, BASELINES.VIEWS) })
    }

    // 2. POST Increment
    if (req.method === 'POST') {
      if (type === 'resume') {
        const newCount = await kv.incr(KEYS.DOWNLOADS)
        return res.status(200).json({ count: Math.max(newCount, BASELINES.DOWNLOADS) })
      }

      if (type === 'project' && projectId) {
        const newCount = await kv.incr(`${KEYS.PROJECT_PREFIX}${projectId}`)
        return res.status(200).json({ count: newCount })
      }

      if (type === 'view') {
        const newCount = await kv.incr(KEYS.VIEWS)
        return res.status(200).json({ count: Math.max(newCount, BASELINES.VIEWS) })
      }
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (error) {
    console.error('KV Error:', error)
    return res.status(500).json({ error: 'Failed to process stats' })
  }
}
