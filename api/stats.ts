// /api/stats — Real Global Counter API (using counterapi.dev)
// This service is 100% free, requires no signup, and no credit card.

interface VercelRequest {
  method?: string
  query: Record<string, string | string[] | undefined>
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
}

const NAMESPACE = 'priyanshu-patidar-portfolio-v2' // Incremented version to be safe

// Baselines to ensure professional look
const BASELINES: Record<string, number> = {
  views: 182,
  resume: 48,
  project: 14 // Base views for projects
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { type, projectId } = req.query
  const method = req.method?.toUpperCase() || 'GET'
  
  let key = 'portfolio-views'
  let baseline = BASELINES.views

  if (type === 'resume') {
    key = 'resume-downloads'
    baseline = BASELINES.resume
  } else if (type === 'project' && projectId) {
    key = `project-${projectId}-views`
    baseline = BASELINES.project
  } else if (type === 'view') {
    key = 'portfolio-views'
    baseline = BASELINES.views
  }

  try {
    // If it's a POST, we hit the /up endpoint to increment.
    // If it's a GET, we hit the base endpoint to just read.
    const isIncrement = method === 'POST'
    const url = `https://api.counterapi.dev/v1/${NAMESPACE}/${key}${isIncrement ? '/up' : ''}`

    console.log(`[Stats] ${method} ${url}`)

    const response = await fetch(url)
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Stats] CounterAPI Error: ${response.status} ${errorText}`)
      throw new Error(`CounterAPI responded with ${response.status}`)
    }
    
    const data = await response.json()
    const count = (data.count || 0) + baseline

    return res.status(200).json({ count })
  } catch (error) {
    console.error('[Stats] Final Error:', error)
    // Fallback to baseline so the UI doesn't break
    return res.status(200).json({ count: baseline })
  }
}
