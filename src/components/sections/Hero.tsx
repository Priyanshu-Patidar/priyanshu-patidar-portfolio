import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { PERSONAL_INFO } from '@/data/constants'
import { scrollToSection } from '@/utils/helpers'
import ResumeModal from '@/components/ui/ResumeModal'
import { getTechIcon } from '@/components/ui/TechIcons'
import { useVisitorCount } from '@/hooks'
import { OpenToRelocationBadge } from '@/components/ui/RecruiterBadges'
const RecruiterDashboard = lazy(() => import('@/components/ui/RecruiterDashboard'))

const ROLES = [
  'Java Full Stack Developer',
  'Spring Boot Engineer',
  'MERN Stack Developer',
  'AI & RAG Systems Builder',
]

// Particle system
interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; alpha: number; color: string
}

function initParticles(canvas: HTMLCanvasElement): Particle[] {
  // Reduce particles on mobile and for users who prefer reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.innerWidth < 768
  if (prefersReduced) return [] // no animation at all
  const density = isMobile ? 28000 : 14000
  const cap = isMobile ? 25 : 60 // fewer particles on mobile
  const cols = ['#00d4ff', '#4fc3f7', '#0099cc', '#00bcd4']
  const count = Math.floor((canvas.width * canvas.height) / density)
  return Array.from({ length: Math.min(count, cap) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.4 + 0.1,
    color: cols[Math.floor(Math.random() * cols.length)],
  }))
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const photoRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showResume, setShowResume] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const [showBurst, setShowBurst] = useState(false)
  const [showRecruiterMode, setShowRecruiterMode] = useState(false)
  const portfolioViews = useVisitorCount()

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particlesRef.current = initParticles(canvas)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const pts = particlesRef.current
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })
      // Draw connecting lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(0,212,255,${0.07 * (1 - dist / 80)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Typewriter
  useEffect(() => {
    const role = ROLES[roleIdx]
    const speed = isDeleting ? 40 : 80
    const delay = isDeleting ? speed : (displayText === role ? 1800 : speed)

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === role) {
        setIsDeleting(true)
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false)
        setRoleIdx(i => (i + 1) % ROLES.length)
      } else {
        setDisplayText(prev =>
          isDeleting ? prev.slice(0, -1) : role.slice(0, prev.length + 1)
        )
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, roleIdx])

  // 3D tilt + parallax + light reflection on photo
  useEffect(() => {
    const el = photoRef.current
    const glow = glowRef.current
    if (!el) return
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      el.style.transform = `perspective(700px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) scale(1.04)`
      // Light reflection follows cursor
      if (glow) {
        const px = ((e.clientX - rect.left) / rect.width) * 100
        const py = ((e.clientY - rect.top) / rect.height) * 100
        glow.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.18) 0%, transparent 55%)`
        glow.style.opacity = '1'
      }
    }
    const handleEnter = () => {
      setShowBurst(true)
      setBurstKey(k => k + 1)
      setTimeout(() => setShowBurst(false), 900)
    }
    const handleLeave = () => {
      el.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)'
      if (glow) glow.style.opacity = '0'
    }
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseenter', handleEnter)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseenter', handleEnter)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <>
      <section
        id="home"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: 'var(--bg-primary)',
          paddingTop: '64px',
        }}
      >
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        />

        {/* Gradient mesh overlays */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,212,255,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(79,195,247,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '4rem 1.5rem',
          width: '100%',
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
        }}>

          {/* LEFT — Text content */}
          <div style={{ animation: 'slide-up-hero 0.9s cubic-bezier(0.25,0.46,0.45,0.94) both' }}>

            {/* Open to Work badge */}
            <div style={{ marginBottom: '1.5rem', animation: 'fade-in-hero 0.6s ease 0.1s both' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px', borderRadius: '999px',
                background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                fontSize: '0.75rem', fontWeight: '600', color: '#4ade80',
              }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80',
                  boxShadow: '0 0 8px rgba(74,222,128,0.7)',
                  animation: 'green-pulse 2s ease-in-out infinite',
                  display: 'inline-block',
                }} />
                Open to Work
              </span>
            </div>

            {/* Greeting */}
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '1rem', fontWeight: '400',
              color: 'var(--text-muted)',
              marginBottom: '0.4rem',
              letterSpacing: '0.05em',
              animation: 'fade-in-hero 0.6s ease 0.2s both',
            }}>
              Hello, I'm
            </div>

            {/* Name — cinematic reveal */}
            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
              fontWeight: '700',
              lineHeight: 1.05,
              marginBottom: '1rem',
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              animation: 'name-reveal 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s both',
            }}>
              Priyanshu{' '}
              <span style={{
                color: '#00d4ff',
                textShadow: '0 0 30px rgba(0,212,255,0.5)',
              }}>
                Patidar
              </span>
            </h1>

            {/* Typewriter role */}
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
              minHeight: '2rem',
              animation: 'fade-in-hero 0.6s ease 0.5s both',
              display: 'flex', alignItems: 'center', gap: '2px',
            }}>
              <span>{displayText}</span>
              <span style={{
                display: 'inline-block', width: '2px', height: '1.2em',
                background: '#00d4ff', marginLeft: '2px',
                animation: 'cursor-blink 1s step-end infinite',
                verticalAlign: 'middle',
              }} />
            </div>

            {/* Bio */}
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              maxWidth: '540px',
              marginBottom: '2.5rem',
              animation: 'fade-in-hero 0.6s ease 0.6s both',
            }}>
              {PERSONAL_INFO.bio}
            </p>

            {/* Location */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--text-muted)', fontSize: '0.82rem',
              marginBottom: '2rem',
              animation: 'fade-in-hero 0.6s ease 0.65s both',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {PERSONAL_INFO.location}
            </div>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
              animation: 'fade-in-hero 0.6s ease 0.75s both',
            }}>
              <button
                onClick={() => scrollToSection('#projects')}
                style={{
                  padding: '0.7rem 1.6rem', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                  color: '#0a0f1e', border: 'none', cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: '600',
                  fontSize: '0.88rem', transition: 'all 0.3s ease',
                  boxShadow: '0 0 20px rgba(0,212,255,0.3)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 35px rgba(0,212,255,0.5), 0 10px 30px rgba(0,0,0,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.3)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                View Projects
              </button>

              <button
                data-resume-trigger
                onClick={() => setShowResume(true)}
                style={{
                  padding: '0.7rem 1.6rem', borderRadius: '10px',
                  background: 'transparent',
                  color: '#00d4ff', border: '1.5px solid rgba(0,212,255,0.4)',
                  cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: '600', fontSize: '0.88rem',
                  transition: 'all 0.3s ease',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                View Resume
              </button>

              <button
                onClick={() => scrollToSection('#contact')}
                style={{
                  padding: '0.7rem 1.6rem', borderRadius: '10px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1.5px solid var(--border-glass)',
                  cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: '600', fontSize: '0.88rem',
                  transition: 'all 0.3s ease',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Contact Me
              </button>
            </div>

            {/* Social links */}
            <div style={{
              display: 'flex', gap: '0.6rem', marginTop: '2rem',
              animation: 'fade-in-hero 0.6s ease 0.9s both',
            }}>
              {[
                { href: PERSONAL_INFO.github, label: 'GitHub', icon: <GithubIcon /> },
                { href: PERSONAL_INFO.linkedin, label: 'LinkedIn', icon: <LinkedinIcon /> },
                { href: PERSONAL_INFO.leetcode, label: 'LeetCode', icon: <CodeIcon /> },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  title={s.label}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-muted)',
                    transition: 'all 0.25s ease', textDecoration: 'none',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.color = '#00d4ff'; el.style.borderColor = 'rgba(0,212,255,0.4)'; el.style.background = 'rgba(0,212,255,0.08)'; el.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.color = 'var(--text-muted)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.background = 'rgba(255,255,255,0.04)'; el.style.transform = 'none' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Recruiter Action Bar — GitHub / LinkedIn / Contact, above the fold */}
            {/* Recruiter Mode CTA — opens floating 60-second profile dashboard */}
            <button
              onClick={() => setShowRecruiterMode(true)}
              style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                width:'100%', marginTop:'1rem', padding:'0.7rem 1.5rem', borderRadius:'12px',
                background:'linear-gradient(135deg,rgba(0,212,255,0.12),rgba(139,92,246,0.1))',
                border:'1px solid rgba(0,212,255,0.3)', color:'#00d4ff', cursor:'pointer',
                fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.85rem',
                transition:'all 0.25s ease', boxShadow:'0 0 18px rgba(0,212,255,0.12)',
                animation: 'fade-in-hero 0.6s ease 0.9s both',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 28px rgba(0,212,255,0.28)'; e.currentTarget.style.borderColor='rgba(0,212,255,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 0 18px rgba(0,212,255,0.12)'; e.currentTarget.style.borderColor='rgba(0,212,255,0.3)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Recruiter View — 60-Second Summary
            </button>

            <div className="recruiter-action-bar" style={{
              display:'flex', gap:'0.6rem', marginTop:'0.7rem', flexWrap:'wrap',
              animation: 'fade-in-hero 0.6s ease 1s both',
            }}>
              <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer"
                style={{
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                  padding:'0.6rem 1.2rem', borderRadius:'10px', flex:'1 1 0',
                  background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
                  color:'var(--text-secondary)', textDecoration:'none',
                  fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.82rem',
                  transition:'all 0.25s ease', whiteSpace:'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.color='var(--text-primary)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'; e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.transform='none' }}
              >
                <GithubIcon /> GitHub
              </a>
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer"
                style={{
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                  padding:'0.6rem 1.2rem', borderRadius:'10px', flex:'1 1 0',
                  background:'rgba(10,102,194,0.08)', border:'1px solid rgba(10,102,194,0.25)',
                  color:'#0a66c2', textDecoration:'none',
                  fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.82rem',
                  transition:'all 0.25s ease', whiteSpace:'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(10,102,194,0.16)'; e.currentTarget.style.borderColor='rgba(10,102,194,0.4)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(10,102,194,0.08)'; e.currentTarget.style.borderColor='rgba(10,102,194,0.25)'; e.currentTarget.style.transform='none' }}
              >
                <LinkedinIcon /> LinkedIn
              </a>
              <button onClick={() => scrollToSection('#contact')}
                style={{
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                  padding:'0.6rem 1.2rem', borderRadius:'10px', flex:'1 1 0',
                  background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.3)',
                  color:'#00d4ff', cursor:'pointer',
                  fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.82rem',
                  transition:'all 0.25s ease', whiteSpace:'nowrap',
                  boxShadow:'0 0 14px rgba(0,212,255,0.15)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(0,212,255,0.18)'; e.currentTarget.style.borderColor='rgba(0,212,255,0.5)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 24px rgba(0,212,255,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(0,212,255,0.1)'; e.currentTarget.style.borderColor='rgba(0,212,255,0.3)'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 0 14px rgba(0,212,255,0.15)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Contact Me
              </button>
            </div>
          </div>

          {/* RIGHT — Profile photo */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            animation: 'photo-reveal 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.4s both',
          }}>
            <div
              ref={photoRef}
              style={{ position: 'relative', transition: 'transform 0.15s ease', cursor: 'default' }}
            >
              {/* Outer rotating gradient ring */}
              <div style={{
                position: 'absolute', inset: '-4px', borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #00d4ff, #4fc3f7, #0099cc, #00d4ff)',
                animation: 'spin-border 6s linear infinite',
                zIndex: 0,
              }} />

              {/* Middle glow ring */}
              <div style={{
                position: 'absolute', inset: '-2px', borderRadius: '50%',
                background: 'var(--bg-primary)', zIndex: 1,
              }} />

              {/* Inner border */}
              <div style={{
                position: 'absolute', inset: '3px', borderRadius: '50%',
                border: '2px solid rgba(0,212,255,0.2)', zIndex: 3,
                boxShadow: '0 0 30px rgba(0,212,255,0.25), inset 0 0 30px rgba(0,212,255,0.05)',
              }} />

              {/* Secondary pulsing glow ring */}
              <div style={{
                position: 'absolute', inset: '-14px', borderRadius: '50%',
                border: '1px solid rgba(0,212,255,0.12)',
                animation: 'glow-pulse-ring 3s ease-in-out infinite',
                zIndex: -1,
              }} />

              {/* Particle burst on hover */}
              {showBurst && (
                <div key={burstKey} style={{ position:'absolute', inset:0, zIndex:12, pointerEvents:'none' }}>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2
                    const dist = 90 + Math.random() * 40
                    const tx = Math.cos(angle) * dist
                    const ty = Math.sin(angle) * dist
                    return (
                      <span key={i} style={{
                        position:'absolute', top:'50%', left:'50%',
                        width:'4px', height:'4px', borderRadius:'50%',
                        background: i % 2 === 0 ? '#00d4ff' : '#4fc3f7',
                        boxShadow:'0 0 6px currentColor',
                        animation: `particle-burst 0.9s ease-out forwards`,
                        '--tx': `${tx}px`, '--ty': `${ty}px`,
                      } as React.CSSProperties} />
                    )
                  })}
                </div>
              )}

              {/* Photo */}
              <div style={{
                width: 'clamp(310px, 38vw, 440px)',
                height: 'clamp(310px, 38vw, 440px)',
                borderRadius: '50%', overflow: 'hidden',
                position: 'relative', zIndex: 2,
                background: 'linear-gradient(135deg, #0d1530, #1a2340)',
              }}>
                <img
                  src={PERSONAL_INFO.profilePhoto}
                  alt="Priyanshu Patidar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => {
                    // Fallback avatar if photo missing
                    const t = e.currentTarget
                    t.style.display = 'none'
                    const parent = t.parentElement
                    if (parent && !parent.querySelector('.fallback-avatar')) {
                      const fb = document.createElement('div')
                      fb.className = 'fallback-avatar'
                      fb.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:Space Grotesk,sans-serif;font-size:5rem;font-weight:700;color:#00d4ff;text-shadow:0 0 30px rgba(0,212,255,0.5);'
                      fb.textContent = 'PP'
                      parent.appendChild(fb)
                    }
                  }}
                />
                {/* Dynamic light reflection */}
                <div ref={glowRef} style={{
                  position:'absolute', inset:0, borderRadius:'50%',
                  opacity:0, transition:'opacity 0.3s ease',
                  pointerEvents:'none', mixBlendMode:'overlay',
                }} />
              </div>

              {/* Floating glassmorphism badges */}
              <div style={{
                position: 'absolute', top: '-6%', left: '-8%', zIndex: 10,
                background: 'rgba(13,21,48,0.85)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px',
                padding: '8px 14px',
                animation: 'float-badge 5.5s ease-in-out 0.3s infinite',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                whiteSpace: 'nowrap',
              }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Inter,sans-serif' }}>Portfolio Views</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f59e0b', fontFamily: 'Space Grotesk,sans-serif', lineHeight: 1 }}>{portfolioViews.toLocaleString()} 👁</div>
              </div>

              <div style={{
                position: 'absolute', top: '10%', right: '-12%', zIndex: 10,
                background: 'rgba(13,21,48,0.85)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(0,212,255,0.2)', borderRadius: '12px',
                padding: '8px 14px',
                animation: 'float-badge 5s ease-in-out infinite',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                whiteSpace: 'nowrap',
              }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Inter,sans-serif' }}>Problems Solved</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#00d4ff', fontFamily: 'Space Grotesk,sans-serif', lineHeight: 1 }}>200+ 🚀</div>
              </div>

              <div style={{
                position: 'absolute', bottom: '12%', left: '-14%', zIndex: 10,
                background: 'rgba(13,21,48,0.85)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px',
                padding: '8px 14px',
                animation: 'float-badge 6s ease-in-out 1.5s infinite',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                whiteSpace: 'nowrap',
              }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Inter,sans-serif' }}>CDAC Grade</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#8b5cf6', fontFamily: 'Space Grotesk,sans-serif', lineHeight: 1 }}>A+ ✨</div>
              </div>

              <div style={{
                position: 'absolute', bottom: '30%', right: '-16%', zIndex: 10,
                background: 'rgba(13,21,48,0.85)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px',
                padding: '8px 14px',
                animation: 'float-badge 7s ease-in-out 0.8s infinite',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                whiteSpace: 'nowrap',
              }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Inter,sans-serif' }}>Projects Built</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981', fontFamily: 'Space Grotesk,sans-serif', lineHeight: 1 }}>10+ 💼</div>
              </div>

              {/* Orbiting tech icons */}
              {[
                { icon: 'Java', angle: 0, radius: '52%' },
                { icon: 'React', angle: 90, radius: '52%' },
                { icon: 'Spring Boot', angle: 180, radius: '52%' },
                { icon: 'Docker', angle: 270, radius: '52%' },
              ].map((t, i) => (
                <div key={t.icon} style={{
                  position:'absolute', top:'50%', left:'50%', marginTop:'-19px', marginLeft:'-19px', zIndex: 11,
                  width:'38px', height:'38px', borderRadius:'10px',
                  background:'rgba(13,21,48,0.9)', backdropFilter:'blur(12px)',
                  border:'1px solid rgba(0,212,255,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 4px 16px rgba(0,0,0,0.4)',
                  animation:`orbit-${i} 16s linear infinite`,
                  transformOrigin:'center',
                }}>
                  {getTechIcon(t.icon, 18)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          animation: 'fade-in-hero 0.6s ease 1.2s both',
          zIndex: 1,
        }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{
            width: '20px', height: '32px', border: '1.5px solid rgba(0,212,255,0.3)',
            borderRadius: '10px', display: 'flex', justifyContent: 'center', paddingTop: '5px',
          }}>
            <div style={{
              width: '3px', height: '7px', borderRadius: '2px',
              background: '#00d4ff',
              animation: 'scroll-dot 2s ease-in-out infinite',
            }} />
          </div>
        </div>

        <style>{`
          @keyframes slide-up-hero {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in-hero {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes name-reveal {
            from { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(4px); }
            to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes photo-reveal {
            from { opacity: 0; transform: scale(0.85) translateX(30px); }
            to { opacity: 1; transform: scale(1) translateX(0); }
          }
          @keyframes spin-border {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes orbit-0 {
            from { transform: rotate(0deg) translateX(180px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
          }
          @keyframes orbit-1 {
            from { transform: rotate(90deg) translateX(180px) rotate(-90deg); }
            to { transform: rotate(450deg) translateX(180px) rotate(-450deg); }
          }
          @keyframes orbit-2 {
            from { transform: rotate(180deg) translateX(180px) rotate(-180deg); }
            to { transform: rotate(540deg) translateX(180px) rotate(-540deg); }
          }
          @keyframes orbit-3 {
            from { transform: rotate(270deg) translateX(180px) rotate(-270deg); }
            to { transform: rotate(630deg) translateX(180px) rotate(-630deg); }
          }
          @media (max-width: 480px) {
            .recruiter-action-bar { flex-direction: column; }
            .recruiter-action-bar > * { flex: 1 1 100% !important; }
          }
          @keyframes float-badge {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes glow-pulse-ring {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.04); }
          }
          @keyframes particle-burst {
            0% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
            100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
          }
          @keyframes cursor-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes green-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); opacity: 1; }
            50% { box-shadow: 0 0 0 5px rgba(74,222,128,0); opacity: 0.75; }
          }
          @keyframes scroll-dot {
            0% { transform: translateY(0); opacity: 1; }
            80% { transform: translateY(10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 0; }
          }
        `}</style>
      </section>

      {/* Resume Modal */}
      {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
      {showRecruiterMode && (
        <Suspense fallback={null}>
          <RecruiterDashboard onClose={() => setShowRecruiterMode(false)} />
        </Suspense>
      )}
    </>
  )
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}
function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  )
}
