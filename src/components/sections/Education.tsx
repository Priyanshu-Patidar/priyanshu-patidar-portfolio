import { useRef, useState, useEffect } from 'react'
import { educations } from '@/data/experience'

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

export default function Education() {
  const { ref: sectionRef, visible } = useReveal(0.05)

  return (
    <section
      id="education"
      ref={sectionRef}
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Bg glow */}
      <div style={{ position:'absolute', bottom:'5%', left:'-5%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.04) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ marginBottom:'3.5rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(30px)', transition:'all 0.7s ease' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00d4ff', marginBottom:'0.75rem' }}>05 / Education</div>
          <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'clamp(2rem,4vw,3rem)', color:'var(--text-primary)', margin:0 }}>
            Academic Background
          </h2>
          <div style={{ width:'50px', height:'3px', background:'linear-gradient(90deg,#00d4ff,transparent)', borderRadius:'2px', marginTop:'12px' }} />
        </div>

        {/* Cards grid */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))',
          gap:'1.5rem',
        }}>
          {educations.map((edu, i) => (
            <EducationCard key={edu.id} edu={edu} index={i} visible={visible} />
          ))}
        </div>

        {/* Decorative graduation banner */}
        <GraduationBanner visible={visible} />
      </div>
    </section>
  )
}

function EducationCard({
  edu,
  index,
  visible,
}: {
  edu: typeof educations[0]
  index: number
  visible: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const rgb = hexToRgb(edu.color)

  // Skills tags per institution
  const skillTags: Record<number, string[]> = {
    1: ['Spring Boot', 'Microservices', 'Angular', 'Docker', 'AWS', 'MySQL', 'GitLab CI'],
    2: ['Java', 'Data Structures', 'DBMS', 'OS', 'Computer Networks', 'OOP'],
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:'relative',
        padding:'2rem',
        borderRadius:'22px',
        background: hovered
          ? `rgba(${rgb},0.07)`
          : 'rgba(255,255,255,0.03)',
        border:`1px solid ${hovered ? edu.color + '40' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter:'blur(16px)',
        transition:'all 0.4s cubic-bezier(0.34,1.2,0.64,1)',
        transform: visible
          ? hovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)'
          : `translateY(50px) scale(0.95)`,
        opacity: visible ? 1 : 0,
        transitionDelay: `${0.15 + index * 0.18}s`,
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.35), 0 0 40px rgba(${rgb},0.15)`
          : '0 4px 20px rgba(0,0,0,0.15)',
        overflow:'hidden',
      }}
    >
      {/* Gradient bg corner */}
      <div style={{
        position:'absolute', top:'-40px', right:'-40px',
        width:'160px', height:'160px', borderRadius:'50%',
        background:`radial-gradient(circle, rgba(${rgb},0.12) 0%, transparent 70%)`,
        pointerEvents:'none',
        transition:'opacity 0.3s ease',
        opacity: hovered ? 1 : 0.5,
      }} />

      {/* Top row — icon + period */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
        <div style={{
          width:'52px', height:'52px', borderRadius:'14px',
          background:`rgba(${rgb},0.12)`,
          border:`1px solid ${edu.color}30`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.5rem',
          boxShadow: hovered ? `0 0 20px rgba(${rgb},0.3)` : 'none',
          transition:'box-shadow 0.3s ease',
        }}>
          {edu.icon}
        </div>
        <span style={{
          padding:'4px 10px', borderRadius:'6px',
          background:'rgba(255,255,255,0.05)',
          border:'1px solid rgba(255,255,255,0.08)',
          fontSize:'0.72rem', fontWeight:'500',
          color:'var(--text-muted)',
          fontFamily:'JetBrains Mono,monospace',
        }}>
          {edu.period}
        </span>
      </div>

      {/* Institution */}
      <h3 style={{
        fontFamily:'Space Grotesk,sans-serif', fontWeight:'700',
        fontSize:'1.15rem', color:'var(--text-primary)',
        margin:'0 0 0.4rem', lineHeight:1.2,
      }}>
        {edu.institution}
      </h3>

      {/* Degree */}
      <p style={{
        fontFamily:'Inter,sans-serif', fontSize:'0.85rem',
        color:'var(--text-secondary)', margin:'0 0 1rem', lineHeight:1.5,
      }}>
        {edu.degree}
      </p>

      {/* Grade badge */}
      <div style={{
        display:'inline-flex', alignItems:'center', gap:'6px',
        padding:'5px 12px', borderRadius:'8px',
        background:`rgba(${rgb},0.12)`,
        border:`1px solid ${edu.color}35`,
        marginBottom:'1.25rem',
      }}>
        <span style={{ fontSize:'0.85rem' }}>⭐</span>
        <span style={{
          fontFamily:'Space Grotesk,sans-serif', fontWeight:'700',
          fontSize:'0.85rem', color: edu.color,
        }}>
          {edu.grade}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height:'1px', background:'rgba(255,255,255,0.06)', margin:'0 0 1.1rem' }} />

      {/* Skill tags */}
      <div>
        <div style={{ fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--text-muted)', marginBottom:'0.5rem' }}>
          Key Subjects / Skills
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
          {(skillTags[edu.id] || []).map(tag => (
            <span key={tag} style={{
              padding:'3px 9px', borderRadius:'6px',
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.08)',
              fontSize:'0.7rem', fontWeight:'500',
              color:'var(--text-muted)',
              fontFamily:'Inter,sans-serif',
              transition:'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background=`rgba(${rgb},0.1)`; e.currentTarget.style.borderColor=edu.color+'35'; e.currentTarget.style.color=edu.color }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='var(--text-muted)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Decorative banner ──────────────────────────────────────────────────── */
function GraduationBanner({ visible }: { visible: boolean }) {
  const stats = [
    { icon: '🎓', label: 'Degrees', value: '2' },
    { icon: '📅', label: 'Years of Study', value: '4+' },
    { icon: '🏆', label: 'Best Grade', value: 'A+ (78%)' },
    { icon: '💡', label: 'Specialization', value: 'Full Stack + AI' },
  ]

  return (
    <div style={{
      marginTop: '2.5rem',
      padding: '1.5rem 2rem',
      borderRadius: '18px',
      background: 'rgba(0,212,255,0.04)',
      border: '1px solid rgba(0,212,255,0.12)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      justifyContent: 'space-around',
      alignItems: 'center',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.7s ease 0.5s',
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          textAlign:'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: `all 0.5s ease ${0.55 + i * 0.08}s`,
        }}>
          <div style={{ fontSize:'1.4rem', marginBottom:'0.2rem' }}>{s.icon}</div>
          <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'1.1rem', color:'#00d4ff' }}>{s.value}</div>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

function hexToRgb(hex: string) {
  const c = hex.replace('#', '')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
