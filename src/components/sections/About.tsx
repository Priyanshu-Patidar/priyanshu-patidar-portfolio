import { useRef, useState, useEffect } from 'react'
import { PERSONAL_INFO, ABOUT_HIGHLIGHTS } from '@/data/constants'

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

export default function About() {
  const { ref: sectionRef, visible } = useReveal(0.1)

  const storyLines = [
    { text: '"Transforming Ideas Into Scalable Software Solutions"', big: true },
    { text: "I'm Priyanshu Patidar, a Java Full Stack Developer passionate about building enterprise-grade applications, AI-powered solutions, and modern web experiences.", big: false },
    { text: 'From solving 200+ coding challenges to developing production-ready applications with Spring Boot, MERN Stack, and AI technologies, I focus on creating software that delivers real business impact.', big: false },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Section heading */}
        <div style={{
          marginBottom: '4rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s ease',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00d4ff', marginBottom: '0.75rem' }}>
            01 / About Me
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: '700',
            fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)',
            margin: 0, lineHeight: 1.1,
          }}>
            Who I Am
          </h2>
          <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg,#00d4ff,transparent)', borderRadius: '2px', marginTop: '12px' }} />
        </div>

        {/* Main grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'start',
        }}>
          {/* Left — Story text */}
          <div>
            {storyLines.map((line, i) => (
              <div key={i} style={{
                marginBottom: i === 0 ? '1.75rem' : '1.25rem',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-40px)',
                transition: `all 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${0.15 + i * 0.12}s`,
              }}>
                {line.big ? (
                  <h3 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                    fontWeight: '700', lineHeight: 1.3,
                    color: '#00d4ff',
                    textShadow: '0 0 20px rgba(0,212,255,0.3)',
                    margin: 0,
                    borderLeft: '3px solid #00d4ff',
                    paddingLeft: '1rem',
                  }}>
                    {line.text}
                  </h3>
                ) : (
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem', lineHeight: 1.8,
                    color: 'var(--text-secondary)', margin: 0,
                  }}>
                    {line.text}
                  </p>
                )}
              </div>
            ))}

            {/* Info pills */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '2rem',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.7s ease 0.55s',
            }}>
              {[
                { icon: '📍', text: PERSONAL_INFO.location },
                { icon: '📧', text: PERSONAL_INFO.email },
                { icon: '📱', text: PERSONAL_INFO.phone },
              ].map(item => (
                <span key={item.text} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.78rem', color: 'var(--text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {item.icon} {item.text}
                </span>
              ))}
            </div>

            {/* Social links row */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.25rem',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.7s ease 0.65s',
            }}>
              {[
                { href: PERSONAL_INFO.github, label: 'GitHub', color: '#e6edf3' },
                { href: PERSONAL_INFO.linkedin, label: 'LinkedIn', color: '#0a66c2' },
                { href: PERSONAL_INFO.leetcode, label: 'LeetCode', color: '#ffa116' },
                { href: PERSONAL_INFO.geeksforgeeks, label: 'GeeksForGeeks', color: '#2f8d46' },
                { href: PERSONAL_INFO.codechef, label: 'CodeChef', color: '#5b4638' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '5px 12px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '0.75rem', fontWeight: '500',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = link.color
                    e.currentTarget.style.borderColor = link.color + '44'
                    e.currentTarget.style.background = link.color + '11'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.transform = 'none'
                  }}
                >
                  ↗ {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — Highlight cards */}
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.85rem',
            }}>
              {ABOUT_HIGHLIGHTS.map((h, i) => (
                <HighlightCard key={h.label} highlight={h} index={i} visible={visible} />
              ))}
            </div>

            {/* Code snippet decorative block */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem 1.5rem',
              borderRadius: '14px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              lineHeight: 1.8,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s ease 0.7s',
              overflowX: 'auto',
            }}>
              <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>{'// Currently seeking opportunities'}</div>
              <div>
                <span style={{ color: '#8b5cf6' }}>const</span>
                <span style={{ color: '#e2e8f0' }}> developer </span>
                <span style={{ color: '#64748b' }}>=</span>
                <span style={{ color: '#e2e8f0' }}> {'{'}</span>
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#00d4ff' }}>name</span>
                <span style={{ color: '#64748b' }}>: </span>
                <span style={{ color: '#86efac' }}>"Priyanshu Patidar"</span><span style={{ color: '#64748b' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#00d4ff' }}>stack</span>
                <span style={{ color: '#64748b' }}>: </span>
                <span style={{ color: '#86efac' }}>"Java Full Stack"</span><span style={{ color: '#64748b' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#00d4ff' }}>openToWork</span>
                <span style={{ color: '#64748b' }}>: </span>
                <span style={{ color: '#fb923c' }}>true</span><span style={{ color: '#64748b' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#00d4ff' }}>location</span>
                <span style={{ color: '#64748b' }}>: </span>
                <span style={{ color: '#86efac' }}>"Bangalore, IN"</span>
              </div>
              <div><span style={{ color: '#e2e8f0' }}>{'}'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface Highlight { icon: string; label: string; value: string; color: string }

function HighlightCard({ highlight: h, index, visible }: { highlight: Highlight; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false)
  const rgb = hexToRgb(h.color)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '1.1rem',
        borderRadius: '14px',
        background: hovered ? `rgba(${rgb},0.08)` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? h.color + '40' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(12px)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        transform: visible
          ? hovered ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)'
          : 'translateY(25px) scale(0.95)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${0.1 + index * 0.07}s`,
        boxShadow: hovered ? `0 10px 30px rgba(${rgb},0.15)` : 'none',
        cursor: 'default',
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{h.icon}</div>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{h.label}</div>
      <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: '600', fontSize: '0.85rem', color: hovered ? h.color : 'var(--text-primary)', transition: 'color 0.3s ease' }}>{h.value}</div>
    </div>
  )
}

function hexToRgb(hex: string) {
  const c = hex.replace('#', '')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
