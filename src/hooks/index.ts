import { useState, useEffect, useRef, useCallback } from 'react'
import type { Theme, LeetCodeStats } from '@/types'
import { FALLBACK_LEETCODE_STATS } from '@/data/constants'

// ─── useTheme ─────────────────────────────────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem('portfolio-theme') as Theme) || 'dark' } catch { return 'dark' }
  })
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    try { localStorage.setItem('portfolio-theme', theme) } catch {}
  }, [theme])
  const toggleTheme = useCallback(() => setTheme(p => p === 'dark' ? 'light' : 'dark'), [])
  return { theme, toggleTheme }
}

// ─── useScrollProgress ────────────────────────────────────────────────────────
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handler = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docH > 0 ? Math.min((window.scrollY / docH) * 100, 100) : 0)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return progress
}

// ─── useScrollY ───────────────────────────────────────────────────────────────
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return scrollY
}

// ─── useReveal ────────────────────────────────────────────────────────────────
export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── useCountUp ───────────────────────────────────────────────────────────────
export function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

// ─── useLeetCodeStats ────────────────────────────────────────────────────────
// CRITICAL FIX (LeetCode Integration Replacement):
// ❌ Removed entirely: leetcode-stats-api.herokuapp.com (unreliable, returning
//    application errors) and alfa-leetcode-api.onrender.com (third-party proxy).
// ❌ The browser NEVER calls LeetCode directly anymore — that was the root
//    cause of CORS failures, since leetcode.com/graphql has no
//    Access-Control-Allow-Origin header for browser-side requests.
// ✅ The frontend now ONLY calls our own /api/leetcode serverless function,
//    which calls the official LeetCode GraphQL API server-side (no CORS
//    issue — server-to-server requests aren't subject to browser CORS) and
//    returns clean, pre-processed JSON with built-in caching and fallback.
// ✅ localStorage is still used as a *client-side* cache layer on top of the
//    server's own cache, so repeat visits within an hour render instantly.
const LEETCODE_CACHE_KEY = 'lc-stats-cache-v2'
const LEETCODE_CACHE_TTL = 60 * 60 * 1000 // 1 hour — matches server cache TTL

interface LeetCodeApiResult {
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

export interface UseLeetCodeStatsResult extends LeetCodeStats {
  lastUpdated: string | null
  isStale: boolean        // true if data came from server/client cache or fallback, not a fresh live call
  refresh: () => void      // manual retry / refresh button
}

export function useLeetCodeStats(): UseLeetCodeStatsResult {
  const [stats, setStats] = useState<LeetCodeStats & { lastUpdated: string | null; isStale: boolean }>({
    ...FALLBACK_LEETCODE_STATS, loading: true, error: false, lastUpdated: null, isStale: false,
  })

  const load = useCallback((opts?: { forceRefresh?: boolean }) => {
    // 1. Check client-side localStorage cache first, unless forcing a refresh
    if (!opts?.forceRefresh) {
      try {
        const raw = localStorage.getItem(LEETCODE_CACHE_KEY)
        if (raw) {
          const { data, ts } = JSON.parse(raw) as { data: LeetCodeApiResult; ts: number }
          if (Date.now() - ts < LEETCODE_CACHE_TTL) {
            setStats({
              totalSolved: data.totalSolved, easySolved: data.easySolved,
              mediumSolved: data.mediumSolved, hardSolved: data.hardSolved,
              totalQuestions: data.totalQuestions, ranking: data.ranking ?? undefined,
              acceptanceRate: data.acceptanceRate ?? undefined,
              loading: false, error: false,
              lastUpdated: data.lastUpdated, isStale: data.source !== 'live',
            })
            return // serve from client cache, skip the network call entirely
          }
        }
      } catch {}
    }

    setStats(s => ({ ...s, loading: true }))

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 9000)

    // 2. Single call to our own server-side endpoint — never LeetCode directly
    fetch('/api/leetcode', { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((data: LeetCodeApiResult) => {
        clearTimeout(timeout)
        setStats({
          totalSolved: data.totalSolved, easySolved: data.easySolved,
          mediumSolved: data.mediumSolved, hardSolved: data.hardSolved,
          totalQuestions: data.totalQuestions, ranking: data.ranking ?? undefined,
          acceptanceRate: data.acceptanceRate ?? undefined,
          loading: false, error: data.source === 'fallback',
          lastUpdated: data.lastUpdated, isStale: data.source !== 'live',
        })
        try { localStorage.setItem(LEETCODE_CACHE_KEY, JSON.stringify({ data, ts: Date.now() })) } catch {}
      })
      .catch(() => {
        clearTimeout(timeout)
        // 3. /api/leetcode itself was unreachable (network down, deployment
        //    issue, etc). Fall back to last known client cache regardless of
        //    age, or to static known-good values as the final safety net —
        //    the UI must never show broken/empty cards.
        try {
          const raw = localStorage.getItem(LEETCODE_CACHE_KEY)
          if (raw) {
            const { data } = JSON.parse(raw) as { data: LeetCodeApiResult; ts: number }
            setStats({
              totalSolved: data.totalSolved, easySolved: data.easySolved,
              mediumSolved: data.mediumSolved, hardSolved: data.hardSolved,
              totalQuestions: data.totalQuestions, ranking: data.ranking ?? undefined,
              acceptanceRate: data.acceptanceRate ?? undefined,
              loading: false, error: true,
              lastUpdated: data.lastUpdated, isStale: true,
            })
            return
          }
        } catch {}
        setStats({ ...FALLBACK_LEETCODE_STATS, loading: false, error: true, lastUpdated: null, isStale: true })
      })

    return () => { controller.abort(); clearTimeout(timeout) }
  }, [])

  useEffect(() => { load() }, [load])

  const refresh = useCallback(() => load({ forceRefresh: true }), [load])

  return { ...stats, refresh }
}

// ─── View Counters (Centralized via Vercel KV) ──────────────────────────────────
const VISITOR_SESSION_FLAG = 'portfolio-session-counted'

export function useVisitorCount() {
  const [count, setCount] = useState(100)

  useEffect(() => {
    const alreadyCounted = sessionStorage.getItem(VISITOR_SESSION_FLAG) === '1'

    const sync = async () => {
      try {
        const method = alreadyCounted ? 'GET' : 'POST'
        const res = await fetch(`/api/stats?type=view`, { 
          method,
          body: method === 'POST' ? JSON.stringify({}) : undefined,
          headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {}
        })
        if (res.ok) {
          const data = await res.json()
          setCount(data.count)
          if (!alreadyCounted) sessionStorage.setItem(VISITOR_SESSION_FLAG, '1')
        }
      } catch (err) {
        // Fallback to local if API fails
        const stored = parseInt(localStorage.getItem('portfolio-visits') || '100')
        setCount(stored)
      }
    }

    sync()
  }, [])

  return count
}

export function useProjectViews(projectId: number, trigger: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return

    const sessionKey = `project-${projectId}-counted`
    const alreadyCounted = sessionStorage.getItem(sessionKey) === '1'

    const sync = async () => {
      try {
        const method = alreadyCounted ? 'GET' : 'POST'
        const res = await fetch(`/api/stats?type=project&projectId=${projectId}`, { 
          method,
          // POST requests sometimes require a body in certain environments
          body: method === 'POST' ? JSON.stringify({}) : undefined,
          headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {}
        })
        if (res.ok) {
          const data = await res.json()
          setCount(data.count)
          if (!alreadyCounted) sessionStorage.setItem(sessionKey, '1')
        }
      } catch {}
    }

    sync()
  }, [projectId, trigger])

  return count
}

// ─── useResumeDownloadCount ───────────────────────────────────────────────────
const RESUME_BASELINE = 25

export function useResumeDownloadCount() {
  const [count, setCount] = useState(RESUME_BASELINE)
  const firing = useRef(false)

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await fetch('/api/stats?type=resume')
        if (res.ok) {
          const data = await res.json()
          setCount(data.count)
        }
      } catch {}
    }
    fetchInitial()
  }, [])

  const increment = useCallback(async () => {
    if (firing.current) return
    firing.current = true

    try {
      const res = await fetch('/api/stats?type=resume', { 
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        const data = await res.json()
        setCount(data.count)
      }
    } catch {}
    
    setTimeout(() => { firing.current = false }, 1000)
  }, [])

  return { count, increment }
}

// ─── useMediaQuery ────────────────────────────────────────────────────────────
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

// ─── useActiveSection ─────────────────────────────────────────────────────────
export function useActiveSection(sections: string[]) {
  const [activeSection, setActiveSection] = useState('home')
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.forEach(id => {
      const el = document.getElementById(id); if (!el) return
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveSection(id) }, { threshold: 0.35 })
      obs.observe(el); observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [sections])
  return activeSection
}
