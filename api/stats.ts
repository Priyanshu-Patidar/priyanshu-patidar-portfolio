// /api/stats — Real Global Counter API (using counterapi.dev)
// This service is 100% free, requires no signup, and no credit card.
// It provides a real global database for simple increments.

interface VercelRequest {
  method?: string
  query: Record<string, string | string[] | undefined>
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
}

const NAMESPACE = 'priyanshu-patidar-portfolio-v1'

// Baselines to add to the API count (so we don't start from 0)
const BASELINES: Record<string, number> = {
  views: 154,
  resume: 42
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { type, projectId } = req.query
  
  // Map our types to CounterAPI keys
  let key = 'portfolio-views'
  let baseline = BASELINES.views

  if (type === 'resume') {
    key = 'resume-downloads'
    baseline = BASELINES.resume
  } else if (type === 'project' && projectId) {
    key = `project-${projectId}-views`
    baseline = 0
  } else if (type === 'view') {
    key = 'portfolio-views'
    baseline = BASELINES.views
  }

  try {
    const isIncrement = req.method === 'POST'
    const url = `https://api.counterapi.dev/v1/${NAMESPACE}/${key}${isIncrement ? '/up' : ''}`

    const response = await fetch(url)
    if (!response.ok) throw new Error('CounterAPI failed')
    
    const data = await response.json()
    const count = (data.count || 0) + baseline

    return res.status(200).json({ count })
  } catch (error) {
    console.error('Counter Error:', error)
    // Fallback to baseline on error
    return res.status(200).json({ count: baseline })
  }
}
