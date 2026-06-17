import { useRef, useState, useEffect } from 'react'
import { experiences } from '@/data/experience'

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

export default function Experience() {
  const { ref: sectionRef, visible } = useReveal(0.05)

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{ position:'absolute', top:'10%', right:'-5%', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.04) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ marginBottom:'3.5rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(30px)', transition:'all 0.7s ease' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00d4ff', marginBottom:'0.75rem' }}>04 / Experience</div>
          <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'clamp(2rem,4vw,3rem)', color:'var(--text-primary)', margin:0 }}>
            Professional Journey
          </h2>
          <div style={{ width:'50px', height:'3px', background:'linear-gradient(90deg,#00d4ff,transparent)', borderRadius:'2px', marginTop:'12px' }} />
        </div>

        {/* Timeline */}
        <div style={{ position:'relative' }}>

          {/* Vertical line */}
          <div style={{
            position:'absolute',
            left: '28px',
            top: '16px',
            bottom: '16px',
            width: '2px',
            background: visible
              ? 'linear-gradient(180deg, #00d4ff 0%, rgba(0,212,255,0.3) 60%, transparent 100%)'
              : 'transparent',
            transition: 'background 1s ease 0.5s',
            borderRadius: '2px',
          }} />

          {/* Timeline entries */}
          <div style={{ display:'flex', flexDirection:'column', gap:'2.5rem' }}>
            {experiences.map((exp, i) => (
              <TimelineEntry key={exp.id} exp={exp} index={i} visible={visible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineEntry({
  exp,
  index,
  visible,
}: {
  exp: typeof experiences[0]
  index: number
  visible: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [pointsVisible, setPointsVisible] = useState(false)
  const entryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = entryRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setPointsVisible(true); obs.unobserve(el) } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const rgb = hexToRgb(exp.color)

  return (
    <div
      ref={entryRef}
      style={{
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'flex-start',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-40px)',
        transition: `all 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${0.2 + index * 0.2}s`,
      }}
    >
      {/* Timeline node */}
      <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
        {/* Outer pulse ring */}
        <div style={{
          position: 'absolute',
          inset: '-6px',
          borderRadius: '50%',
          border: `1px solid ${exp.color}40`,
          animation: visible ? `node-pulse-${index} 3s ease-in-out ${index * 0.5}s infinite` : 'none',
        }} />
        {/* Node dot */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: `rgba(${rgb},0.12)`,
          border: `2px solid ${exp.color}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          boxShadow: visible ? `0 0 20px rgba(${rgb},0.25)` : 'none',
          transition: 'all 0.4s ease',
          backdropFilter: 'blur(8px)',
        }}>
          {exp.type === 'training' ? '🎓' : '💼'}
        </div>
      </div>

      {/* Card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          flex: 1,
          padding: '1.75rem',
          borderRadius: '18px',
          background: hovered
            ? `rgba(${rgb},0.07)`
            : 'rgba(255,255,255,0.03)',
          border: `1px solid ${hovered ? exp.color + '35' : 'rgba(255,255,255,0.07)'}`,
          backdropFilter: 'blur(16px)',
          transition: 'all 0.35s ease',
          boxShadow: hovered
            ? `0 12px 40px rgba(0,0,0,0.3), 0 0 25px rgba(${rgb},0.12)`
            : '0 4px 20px rgba(0,0,0,0.15)',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute',
          top: 0, left: '20px', right: '20px',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${exp.color}, transparent)`,
          borderRadius: '2px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }} />

        {/* Header row */}
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-start', gap:'0.5rem', marginBottom:'0.5rem' }}>
          <div>
            <h3 style={{
              fontFamily:'Space Grotesk,sans-serif', fontWeight:'700',
              fontSize:'1.1rem', color:'var(--text-primary)',
              margin:'0 0 0.25rem', lineHeight:1.2,
            }}>
              {exp.company}
            </h3>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'6px',
              padding:'3px 10px', borderRadius:'6px',
              background: `rgba(${rgb},0.12)`,
              border: `1px solid ${exp.color}30`,
              fontSize:'0.75rem', fontWeight:'600',
              color: exp.color,
            }}>
              {exp.type === 'training' ? '🏫 Training' : '💼 Internship'}
            </div>
          </div>

          <div style={{ textAlign:'right' }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'5px',
              padding:'4px 10px', borderRadius:'6px',
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.08)',
              fontSize:'0.75rem', color:'var(--text-muted)',
              fontFamily:'JetBrains Mono,monospace',
              whiteSpace:'nowrap',
            }}>
              <CalendarIcon /> {exp.period}
            </div>
          </div>
        </div>

        {/* Role */}
        <p style={{
          fontFamily:'Space Grotesk,sans-serif', fontWeight:'500',
          fontSize:'0.9rem', color:'var(--text-secondary)',
          margin:'0.75rem 0 1.1rem',
        }}>
          {exp.role}
        </p>

        {/* Bullet points */}
        <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:'0.6rem' }}>
          {exp.points.map((point, pi) => (
            <li key={pi} style={{
              display:'flex', gap:'0.7rem', alignItems:'flex-start',
              opacity: pointsVisible ? 1 : 0,
              transform: pointsVisible ? 'translateX(0)' : 'translateX(-15px)',
              transition: `all 0.5s ease ${0.1 + pi * 0.1}s`,
            }}>
              <span style={{
                width:'6px', height:'6px', borderRadius:'50%',
                background: exp.color,
                boxShadow: `0 0 6px ${exp.color}80`,
                flexShrink:0, marginTop:'6px',
              }} />
              <span style={{
                fontFamily:'Inter,sans-serif', fontSize:'0.83rem',
                lineHeight:1.7, color:'var(--text-secondary)',
              }}>
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes node-pulse-${index} {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function hexToRgb(hex: string) {
  const c = hex.replace('#', '')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
