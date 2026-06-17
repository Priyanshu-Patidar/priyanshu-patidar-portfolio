import { useRef, useState, useEffect } from 'react'
import { useLeetCodeStats, useCountUp } from '@/hooks'
import { PERSONAL_INFO } from '@/data/constants'

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

export default function Stats() {
  const { ref: sectionRef, visible } = useReveal(0.05)
  const leetcode = useLeetCodeStats()

  return (
    <section
      id="stats"
      ref={sectionRef}
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glows */}
      <div style={{ position:'absolute', top:'10%', left:'-5%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.04) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.04) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ marginBottom:'3.5rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(30px)', transition:'all 0.7s ease' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00d4ff', marginBottom:'0.75rem' }}>07 / Stats</div>
          <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'clamp(2rem,4vw,3rem)', color:'var(--text-primary)', margin:0 }}>
            Competitive Programming & GitHub
          </h2>
          <div style={{ width:'50px', height:'3px', background:'linear-gradient(90deg,#00d4ff,transparent)', borderRadius:'2px', marginTop:'12px' }} />
        </div>

        {/* Animated count-up hero stats */}
        <HeroStats visible={visible} />

        {/* LeetCode breakdown */}
        <LeetCodePanel stats={leetcode} visible={visible} />

        {/* GitHub stats images */}
        <GitHubPanel visible={visible} />

        {/* Profile links */}
        <ProfileLinks visible={visible} />
      </div>
    </section>
  )
}

/* ─── Hero count-up stats ─────────────────────────────────────────────── */
function HeroStats({ visible }: { visible: boolean }) {
  const stats = [
    { label: 'Problems Solved', value: 200, suffix: '+', icon: '🧩', color: '#f59e0b', description: 'on LeetCode' },
    { label: 'Projects Built', value: 5, suffix: '+', icon: '🚀', color: '#00d4ff', description: 'production-ready' },
    { label: 'Certifications', value: 3, suffix: '', icon: '🏅', color: '#8b5cf6', description: 'IBM + Acmegrade' },
    { label: 'Months Training', value: 6, suffix: '', icon: '🎓', color: '#10b981', description: 'CDAC Bangalore' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.25rem',
      marginBottom: '3rem',
    }}>
      {stats.map((s, i) => (
        <StatCountCard key={s.label} stat={s} index={i} visible={visible} />
      ))}
    </div>
  )
}

function StatCountCard({ stat, index, visible }: {
  stat: { label: string; value: number; suffix: string; icon: string; color: string; description: string }
  index: number
  visible: boolean
}) {
  const count = useCountUp(stat.value, 2000, visible)
  const [hovered, setHovered] = useState(false)
  const rgb = hexToRgb(stat.color)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '1.75rem',
        borderRadius: '18px',
        background: hovered ? `rgba(${rgb},0.08)` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? stat.color + '45' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(16px)',
        textAlign: 'center',
        transition: 'all 0.35s cubic-bezier(0.34,1.2,0.64,1)',
        transform: visible
          ? hovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)'
          : 'translateY(30px) scale(0.95)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${0.1 + index * 0.1}s`,
        boxShadow: hovered ? `0 15px 40px rgba(0,0,0,0.3), 0 0 25px rgba(${rgb},0.15)` : '0 4px 15px rgba(0,0,0,0.15)',
        cursor: 'default',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{stat.icon}</div>
      <div style={{
        fontFamily: 'Space Grotesk,sans-serif', fontWeight: '800',
        fontSize: '2.5rem', lineHeight: 1,
        color: stat.color,
        textShadow: hovered ? `0 0 20px ${stat.color}60` : 'none',
        transition: 'text-shadow 0.3s ease',
        marginBottom: '0.3rem',
      }}>
        {count}{stat.suffix}
      </div>
      <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
        {stat.label}
      </div>
      <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        {stat.description}
      </div>
    </div>
  )
}

/* ─── LeetCode Panel ──────────────────────────────────────────────────── */
// Consumes the new /api/leetcode-backed hook shape: { ...stats, lastUpdated,
// isStale, refresh }. Shows a skeleton while loading, animated count-up
// numbers once data arrives, a manual refresh button, and a clear (but
// non-alarming) stale/error indicator with a retry action — the UI never
// shows broken or empty 0/0/0 cards.
function LeetCodePanel({ stats, visible }: { stats: ReturnType<typeof useLeetCodeStats>; visible: boolean }) {
  const difficulties = [
    { label: 'Easy', value: stats.easySolved, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
    { label: 'Medium', value: stats.mediumSolved, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
    { label: 'Hard', value: stats.hardSolved, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  ]

  const lastUpdatedLabel = formatLastUpdated(stats.lastUpdated)

  return (
    <div style={{
      padding: '2rem',
      borderRadius: '20px',
      background: 'rgba(245,158,11,0.04)',
      border: '1px solid rgba(245,158,11,0.15)',
      marginBottom: '2.5rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(25px)',
      transition: 'all 0.7s ease 0.3s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
          }}>🏆</div>
          <div>
            <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>LeetCode Stats</h3>
            <a href={PERSONAL_INFO.leetcode} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: '#f59e0b', textDecoration: 'none', fontFamily: 'Inter,sans-serif' }}>
              @priyanshu1672 ↗
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          {/* Refresh button */}
          <button
            onClick={stats.refresh}
            disabled={stats.loading}
            aria-label="Refresh LeetCode stats"
            title="Refresh stats"
            style={{
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
              color: '#f59e0b', cursor: stats.loading ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: stats.loading ? 0.5 : 1, transition: 'all 0.2s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: stats.loading ? 'lc-spin 1s linear infinite' : 'none' }}>
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>

          {/* Total solved ring */}
          <div style={{ textAlign: 'center' }}>
            {stats.loading ? (
              <RingSkeleton />
            ) : (
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: `conic-gradient(#f59e0b 0% ${Math.min((stats.totalSolved / Math.max(stats.totalQuestions,1)) * 100, 100)}%, rgba(255,255,255,0.06) ${Math.min((stats.totalSolved / Math.max(stats.totalQuestions,1)) * 100, 100)}% 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', inset: '8px', borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                  <AnimatedNumber value={stats.totalSolved} active={visible} style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: '800', fontSize: '1rem', color: '#f59e0b', lineHeight: 1 }} />
                  <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.55rem', color: 'var(--text-muted)' }}>solved</span>
                </div>
              </div>
            )}
            {!stats.loading && stats.isStale && (
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {stats.error ? '⚠ showing cached data' : 'cached'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
        {difficulties.map(d => (
          <div key={d.label} style={{
            padding: '1rem', borderRadius: '12px',
            background: d.bg, border: `1px solid ${d.border}`,
            textAlign: 'center',
          }}>
            {stats.loading ? (
              <CardSkeleton color={d.color} />
            ) : (
              <AnimatedNumber value={d.value} active={visible} style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: '800', fontSize: '1.6rem', color: d.color, lineHeight: 1, marginBottom: '0.25rem', display:'block' }} />
            )}
            <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.75rem', fontWeight: '600', color: d.color }}>{d.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar across all */}
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Overall Progress</span>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.72rem', color: '#f59e0b' }}>
            {stats.loading ? '… / …' : `${stats.totalSolved} / ${stats.totalQuestions}`}
          </span>
        </div>
        <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '999px',
            background: 'linear-gradient(90deg,#22c55e,#f59e0b,#ef4444)',
            width: visible && !stats.loading ? `${Math.min((stats.totalSolved / Math.max(stats.totalQuestions,1)) * 100, 100)}%` : '0%',
            transition: 'width 1.5s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s',
          }} />
        </div>
      </div>

      {/* Footer: last updated + error/retry */}
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
          {stats.loading ? 'Fetching live stats…' : lastUpdatedLabel ? `Last updated ${lastUpdatedLabel}` : ''}
        </span>
        {!stats.loading && stats.error && (
          <button onClick={stats.refresh} style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '3px 10px', borderRadius: '7px', cursor: 'pointer',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', fontSize: '0.68rem', fontWeight: '600', fontFamily: 'Space Grotesk,sans-serif',
          }}>
            ⚠ Live fetch failed — Retry
          </button>
        )}
      </div>

      <style>{`@keyframes lc-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes lc-pulse{0%,100%{opacity:0.4}50%{opacity:0.8}}`}</style>
    </div>
  )
}

function RingSkeleton() {
  return <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.15)', animation:'lc-pulse 1.4s ease-in-out infinite' }} />
}

function CardSkeleton({ color }: { color: string }) {
  return <div style={{ height:'1.6rem', borderRadius:'6px', background:`${color}25`, marginBottom:'0.4rem', animation:'lc-pulse 1.4s ease-in-out infinite' }} />
}

// Lightweight count-up for a single number — separate from the page-level
// useCountUp (which is trigger-once on scroll); this one re-animates whenever
// `value` changes (e.g. after a manual refresh returns new data).
function AnimatedNumber({ value, active, style }: { value: number; active: boolean; style?: React.CSSProperties }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!active) { setDisplay(value); return }
    let raf: number
    const start = performance.now()
    const duration = 900
    const from = display
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, active])
  return <span style={style}>{display}</span>
}

function formatLastUpdated(iso: string | null): string {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

/* ─── GitHub Stats Images ──────────────────────────────────────────────── */
// ─── GitHub Stats via REST API + localStorage cache ─────────────────────────
// STEP 20 FIX:
// ❌ github-readme-stats.vercel.app — 3rd-party service, often rate-limited,
//    returns SVG images that don't match our dark theme perfectly, and can be
//    very slow or unavailable. No caching = re-fetched on every visit.
// ❌ github-readme-streak-stats.herokuapp.com — Heroku free tier was retired.
// ✅ api.github.com — official, free, 60 req/hr unauthenticated, returns JSON.
//    We fetch repos, profile stats, and top languages in parallel.
// ✅ localStorage cache (30-minute TTL) — repeat visitors see data instantly.
const GH_CACHE_KEY = 'gh-stats-cache'
const GH_CACHE_TTL = 30 * 60 * 1000 // 30 minutes
const GH_USERNAME = 'Priyanshu-Patidar'

interface GitHubData {
  publicRepos: number
  followers: number
  following: number
  stars: number
  topLangs: Record<string, number>
  loading: boolean
  error: boolean
}
const GH_FALLBACK: GitHubData = {
  publicRepos: 15, followers: 0, following: 0, stars: 3,
  topLangs: { Java: 40, JavaScript: 25, TypeScript: 20, Python: 15 },
  loading: false, error: true,
}

function useGitHubStats(): GitHubData {
  const [data, setData] = useState<GitHubData>({ ...GH_FALLBACK, loading: true, error: false })

  useEffect(() => {
    // Check cache first
    try {
      const raw = localStorage.getItem(GH_CACHE_KEY)
      if (raw) {
        const { d, ts } = JSON.parse(raw)
        if (Date.now() - ts < GH_CACHE_TTL) { setData({ ...d, loading: false, error: false }); return }
      }
    } catch {}

    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 6000)

    Promise.all([
      fetch(`https://api.github.com/users/${GH_USERNAME}`, { signal: ctrl.signal }).then(r => r.ok ? r.json() : Promise.reject()),
      fetch(`https://api.github.com/users/${GH_USERNAME}/repos?per_page=100&sort=updated`, { signal: ctrl.signal }).then(r => r.ok ? r.json() : Promise.reject()),
    ]).then(([user, repos]) => {
      clearTimeout(timeout)
      // Compute stars
      const stars = Array.isArray(repos) ? repos.reduce((s: number, r: { stargazers_count?: number }) => s + (r.stargazers_count || 0), 0) : 0
      // Compute top languages
      const langs: Record<string, number> = {}
      if (Array.isArray(repos)) {
        repos.forEach((r: { language?: string }) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1 })
      }
      const topLangs = Object.fromEntries(Object.entries(langs).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>[k, Math.round((v/Math.max(Object.values(langs).reduce((a,b)=>a+b,0),1))*100)]))
      const result: GitHubData = {
        publicRepos: user.public_repos ?? GH_FALLBACK.publicRepos,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        stars,
        topLangs,
        loading: false, error: false,
      }
      setData(result)
      try { localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ d: result, ts: Date.now() })) } catch {}
    }).catch(() => {
      clearTimeout(timeout)
      setData({ ...GH_FALLBACK, loading: false, error: true })
    })

    return () => { ctrl.abort(); clearTimeout(timeout) }
  }, [])

  return data
}

function GitHubPanel({ visible }: { visible: boolean }) {
  const gh = useGitHubStats()
  const LANG_COLORS: Record<string, string> = {
    Java:'#b07219', JavaScript:'#f1e05a', TypeScript:'#3178c6',
    Python:'#3572a5', CSS:'#563d7c', HTML:'#e34c26',
    'C#':'#178600', Shell:'#89e051',
  }

  const statBoxes = [
    { label:'Public Repos',  value: gh.loading ? '…' : `${gh.publicRepos}+`, icon:'📦', color:'#00d4ff' },
    { label:'Followers',     value: gh.loading ? '…' : String(gh.followers), icon:'👥', color:'#8b5cf6' },
    { label:'Stars Earned',  value: gh.loading ? '…' : String(gh.stars),     icon:'⭐', color:'#f59e0b' },
    { label:'Following',     value: gh.loading ? '…' : String(gh.following), icon:'🔗', color:'#10b981' },
  ]

  return (
    <div style={{ marginBottom:'2.5rem', opacity:visible?1:0, transition:'opacity 0.7s ease 0.45s' }}>
      <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--text-muted)', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'8px' }}>
        <span style={{ width:'14px', height:'14px', display:'inline-flex' }}><GithubSvg /></span>
        GitHub Activity
        {gh.error && <span style={{ fontSize:'0.6rem', color:'#f59e0b', marginLeft:'4px' }}>· cached data</span>}
      </div>

      {/* Stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'0.75rem', marginBottom:'1.25rem' }}>
        {statBoxes.map((s, i) => (
          <div key={s.label} style={{
            padding:'1rem', borderRadius:'12px',
            background:`rgba(${hexToRgb2(s.color)},0.06)`,
            border:`1px solid ${s.color}20`,
            textAlign:'center',
            opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(15px)',
            transition:`all 0.5s ease ${0.5+i*0.08}s`,
          }}>
            <div style={{ fontSize:'1.2rem', marginBottom:'0.3rem' }}>{s.icon}</div>
            <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'800', fontSize:'1.4rem', color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.68rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top Languages */}
      {!gh.loading && Object.keys(gh.topLangs).length > 0 && (
        <div style={{ padding:'1.25rem', borderRadius:'14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.8rem', color:'var(--text-primary)', marginBottom:'0.9rem' }}>Top Languages</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            {Object.entries(gh.topLangs).map(([lang, pct]) => (
              <div key={lang}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', color:'var(--text-secondary)' }}>{lang}</span>
                  <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.7rem', color:LANG_COLORS[lang]||'#00d4ff' }}>{pct}%</span>
                </div>
                <div style={{ height:'5px', borderRadius:'999px', background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:'999px', background:LANG_COLORS[lang]||'#00d4ff', width:`${pct}%`, transition:'width 1s ease 0.7s' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:'1rem', textAlign:'right' }}>
            <a href={`https://github.com/${GH_USERNAME}`} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'#00d4ff', textDecoration:'none' }}>
              View GitHub Profile ↗
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function hexToRgb2(hex: string) {
  const c = hex.replace('#','')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}

/* ─── Profile Links ───────────────────────────────────────────────────── */

/* ─── Premium Coding Profile Cards ──────────────────────────────────────── */
function ProfileLinks({ visible }: { visible: boolean }) {
  const profiles = [
    {
      label: 'LeetCode',
      href: PERSONAL_INFO.leetcode,
      username: 'priyanshu1672',
      stat: '200+ Problems',
      badge: '🏆 Active',
      color: '#FFA116',
      bg: 'rgba(255,161,22,0.07)',
      border: 'rgba(255,161,22,0.25)',
      description: 'Data Structures & Algorithms',
      icon: <LeetCodeSVG />,
    },
    {
      label: 'GeeksForGeeks',
      href: PERSONAL_INFO.geeksforgeeks,
      username: 'priyanshupamjl3',
      stat: 'Practice & Articles',
      badge: '📚 Active',
      color: '#2F8D46',
      bg: 'rgba(47,141,70,0.07)',
      border: 'rgba(47,141,70,0.25)',
      description: 'Interview Prep & DSA',
      icon: <GFGSvg />,
    },
    {
      label: 'CodeChef',
      href: PERSONAL_INFO.codechef,
      username: 'priyanshu1672',
      stat: 'Competitive Coder',
      badge: '⭐ Rated',
      color: '#8B6543',
      bg: 'rgba(139,101,67,0.07)',
      border: 'rgba(139,101,67,0.25)',
      description: 'Competitive Programming',
      icon: <CodeChefSvg />,
    },
    {
      label: 'GitHub',
      href: PERSONAL_INFO.github,
      username: 'Priyanshu-Patidar',
      stat: '15+ Repositories',
      badge: '🔥 Active',
      color: '#e6edf3',
      bg: 'rgba(230,237,243,0.05)',
      border: 'rgba(230,237,243,0.15)',
      description: 'Open Source Projects',
      icon: <GithubSvg />,
    },
  ]

  return (
    <div style={{ opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(20px)', transition:'all 0.7s ease 0.65s' }}>
      <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--text-muted)', marginBottom:'1.1rem', display:'flex', alignItems:'center', gap:'6px' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        Coding Profiles
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'0.9rem' }}>
        {profiles.map((p, i) => <PremiumProfileCard key={p.label} profile={p} index={i} visible={visible} />)}
      </div>
    </div>
  )
}

function PremiumProfileCard({ profile: p, index, visible }: {
  profile: { label:string; href:string; username:string; stat:string; badge:string; color:string; bg:string; border:string; description:string; icon:React.ReactNode }
  index: number; visible: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <a href={p.href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display:'flex', alignItems:'flex-start', gap:'0.9rem',
        padding:'1.1rem 1.2rem', borderRadius:'14px',
        background: hovered ? p.bg : 'rgba(255,255,255,0.03)',
        border:`1px solid ${hovered ? p.border : 'rgba(255,255,255,0.07)'}`,
        textDecoration:'none',
        transition:'all 0.35s cubic-bezier(0.34,1.2,0.64,1)',
        transform: visible ? (hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)') : 'translateY(20px) scale(0.96)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${0.7 + index * 0.07}s`,
        boxShadow: hovered ? `0 10px 30px rgba(0,0,0,0.3), 0 0 15px ${p.color}18` : 'none',
      }}>
      {/* Icon */}
      <div style={{ width:'42px', height:'42px', borderRadius:'10px', background:p.bg, border:`1px solid ${p.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'box-shadow 0.3s ease', boxShadow:hovered?`0 0 16px ${p.color}35`:'none' }}>
        {p.icon}
      </div>
      {/* Text */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.2rem' }}>
          <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.88rem', color:'var(--text-primary)' }}>{p.label}</span>
          <span style={{ fontSize:'0.62rem', fontWeight:'600', color:p.color, padding:'2px 7px', borderRadius:'5px', background:p.bg, border:`1px solid ${p.border}` }}>{p.badge}</span>
        </div>
        <div style={{ fontSize:'0.72rem', color:p.color, fontFamily:'JetBrains Mono,monospace', marginBottom:'0.15rem' }}>@{p.username}</div>
        <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)', fontFamily:'Inter,sans-serif', marginBottom:'0.15rem' }}>{p.stat}</div>
        <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Inter,sans-serif' }}>{p.description}</div>
      </div>
      {/* Arrow */}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={hovered?p.color:'var(--text-muted)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:'4px', transition:'stroke 0.25s ease, transform 0.25s ease', transform:hovered?'translate(2px,-2px)':'none' }}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
  )
}

function LeetCodeSVG() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13.5 3L7 10.5M7 10.5L13.5 18M7 10.5h10" stroke="#FFA116" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function GFGSvg() {
  return <svg width="22" height="22" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#2F8D46"/><text x="12" y="16.5" textAnchor="middle" fontSize="8" fontFamily="Arial" fontWeight="bold" fill="white">GFG</text></svg>
}
function CodeChefSvg() {
  return <svg width="22" height="22" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#5B4638"/><path d="M12 5c-2.2 0-4 2-4 4.5 0 1.2.4 2.3 1.1 3-.8.6-1.8 1.6-1.8 3C7.3 17.4 9.5 19 12 19s4.7-1.6 4.7-3.5c0-1.4-.9-2.4-1.8-3 .7-.7 1.1-1.8 1.1-3C16 7 14.2 5 12 5z" fill="white" opacity="0.9"/></svg>
}
function GithubSvg() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="#e6edf3"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
}

function hexToRgb(hex: string) {
  const c = hex.replace('#', '')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
