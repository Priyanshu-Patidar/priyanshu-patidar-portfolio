import { useRef, useState, useEffect } from 'react'
import { RECRUITER_QUICK_VIEW, PERSONAL_INFO } from '@/data/constants'
import { OpenToWorkBadge, OpenToRelocationBadge, AvailableNowBadge, JavaFullStackBadge, EnterpriseBuilderBadge } from '@/components/ui/RecruiterBadges'
import { getTechIcon } from '@/components/ui/TechIcons'

export default function RecruiterQuickView() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el) } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '3rem 1.5rem 4rem',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle divider glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Label */}
        <div style={{
          textAlign: 'center', marginBottom: '2rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
          }}>
            ⚡ Recruiter Quick View
          </span>
        </div>

        {/* Recruiter badge row */}
        <div style={{
          display:'flex', flexWrap:'wrap', gap:'0.6rem', justifyContent:'center', marginBottom:'1.75rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.6s ease 0.1s',
        }}>
          <OpenToWorkBadge size="sm" />
          <OpenToRelocationBadge size="sm" />
          <AvailableNowBadge size="sm" />
          <JavaFullStackBadge size="sm" />
          <EnterpriseBuilderBadge size="sm" />
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.9rem',
          marginBottom: '1.75rem',
        }}>
          {RECRUITER_QUICK_VIEW.map((card, i) => (
            <QuickCard key={card.label} card={card} index={i} visible={visible} />
          ))}
        </div>

        {/* Quick tech stack chips */}
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.6s ease 0.4s', textAlign:'center',
        }}>
          <div style={{ fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
            Core Tech Stack
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', justifyContent:'center' }}>
            {['Java','Spring Boot','React','Angular','MySQL','MongoDB','AWS','Docker'].map(tech => (
              <span key={tech} style={{
                display:'inline-flex', alignItems:'center', gap:'5px',
                padding:'4px 11px', borderRadius:'7px',
                background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                fontSize:'0.72rem', fontWeight:'500', color:'var(--text-secondary)',
                fontFamily:'Space Grotesk,sans-serif',
              }}>
                {getTechIcon(tech, 13)} {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface Card {
  icon: string; label: string; value: string; color: string
}

function QuickCard({ card, index, visible }: { card: Card; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '1.2rem 1rem',
        borderRadius: '16px',
        background: hovered
          ? `rgba(${hexToRgb(card.color)},0.08)`
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? card.color + '40' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(12px)',
        cursor: 'default',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        transform: visible
          ? hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)'
          : 'translateY(30px) scale(0.9)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.08}s`,
        boxShadow: hovered
          ? `0 12px 40px rgba(${hexToRgb(card.color)},0.2), 0 0 20px rgba(${hexToRgb(card.color)},0.1)`
          : '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{card.icon}</div>
      <div style={{
        fontSize: '0.65rem', fontWeight: '500', letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--text-muted)',
        marginBottom: '0.25rem',
      }}>
        {card.label}
      </div>
      <div style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '0.85rem', fontWeight: '600',
        color: hovered ? card.color : 'var(--text-primary)',
        transition: 'color 0.3s ease',
        lineHeight: 1.3,
      }}>
        {card.value}
      </div>
    </div>
  )
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `${r},${g},${b}`
}
