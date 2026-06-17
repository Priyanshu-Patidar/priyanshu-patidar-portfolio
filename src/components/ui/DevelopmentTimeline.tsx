import { useRef, useState, useEffect } from 'react'
import type { TimelinePhase } from '@/data/developmentTimelines'

interface Props {
  phases: TimelinePhase[]
  color: string
}

// Step 23 / Feature 2 — Project Development Timeline.
// Vertical timeline with scroll-reveal animation, shown inside the project
// details modal. Each phase shows: Tasks Completed, Technologies Used,
// Key Challenge, and Deliverable.
export default function DevelopmentTimeline({ phases, color }: Props) {
  return (
    <div style={{ position:'relative', paddingLeft:'1.75rem' }}>
      {/* Vertical line */}
      <div style={{ position:'absolute', left:'7px', top:'10px', bottom:'10px', width:'2px', background:`linear-gradient(180deg,${color},${color}40,transparent)` }} />

      {phases.map((phase, i) => (
        <TimelinePhaseItem key={i} phase={phase} color={color} index={i} isLast={i === phases.length - 1} />
      ))}
    </div>
  )
}

function TimelinePhaseItem({ phase, color, index, isLast }: { phase: TimelinePhase; color: string; index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position:'relative',
        marginBottom: isLast ? 0 : '1.5rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-16px)',
        transition: `all 0.5s ease ${index * 0.1}s`,
      }}
    >
      {/* Dot */}
      <div style={{
        position:'absolute', left:'-1.75rem', top:'4px',
        width:'14px', height:'14px', borderRadius:'50%',
        background: color,
        boxShadow: visible ? `0 0 10px ${color}90` : 'none',
        border:'2px solid var(--bg-primary)',
        transition:'box-shadow 0.4s ease',
      }} />

      {/* Card */}
      <div style={{
        padding:'1rem 1.1rem', borderRadius:'12px',
        background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.85rem', color:'var(--text-primary)', marginBottom:'0.6rem' }}>
          {phase.phase}
        </div>

        {/* Tasks Completed */}
        <div style={{ marginBottom:'0.7rem' }}>
          <div style={{ fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:'0.35rem', fontWeight:'600' }}>Tasks Completed</div>
          <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.3rem' }}>
            {phase.tasks.map((task, j) => (
              <li key={j} style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', fontFamily:'Inter,sans-serif', fontSize:'0.78rem', lineHeight:1.55, color:'var(--text-secondary)' }}>
                <span style={{ color, flexShrink:0 }}>▸</span><span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Used */}
        {phase.tech && phase.tech.length > 0 && (
          <div style={{ marginBottom:'0.7rem' }}>
            <div style={{ fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:'0.35rem', fontWeight:'600' }}>Technologies Used</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem' }}>
              {phase.tech.map(t => (
                <span key={t} style={{ padding:'2px 8px', borderRadius:'5px', background:color+'12', border:`1px solid ${color}25`, fontSize:'0.68rem', fontWeight:'500', color }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Key Challenge */}
        {phase.challenge && (
          <div style={{ marginBottom:'0.7rem', display:'flex', gap:'0.5rem', alignItems:'flex-start' }}>
            <span style={{ fontSize:'0.8rem', flexShrink:0 }}>⚠</span>
            <div>
              <span style={{ fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', fontWeight:'600' }}>Key Challenge: </span>
              <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.76rem', lineHeight:1.55, color:'var(--text-secondary)' }}>{phase.challenge}</span>
            </div>
          </div>
        )}

        {/* Deliverable */}
        <div style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', paddingTop:'0.6rem', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize:'0.8rem', flexShrink:0 }}>📦</span>
          <div>
            <span style={{ fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', color, fontWeight:'600' }}>Deliverable: </span>
            <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.76rem', lineHeight:1.55, color:'var(--text-secondary)' }}>{phase.deliverable}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
