import { useRef, useState, useEffect } from 'react'
import { ACHIEVEMENT_TIMELINE } from '@/data/constants'

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

export default function AchievementTimeline() {
  const { ref: sectionRef, visible } = useReveal(0.05)

  return (
    <section
      id="timeline"
      ref={sectionRef}
      style={{ padding:'6rem 1.5rem', background:'var(--bg-secondary)', position:'relative', overflow:'hidden' }}
    >
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.03) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:'860px', margin:'0 auto' }}>
        {/* Heading */}
        <div style={{ marginBottom:'3.5rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(30px)', transition:'all 0.7s ease' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00d4ff', marginBottom:'0.75rem' }}>Journey</div>
          <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'clamp(2rem,4vw,3rem)', color:'var(--text-primary)', margin:0 }}>
            Achievement Timeline
          </h2>
          <div style={{ width:'50px', height:'3px', background:'linear-gradient(90deg,#00d4ff,transparent)', borderRadius:'2px', marginTop:'12px' }} />
        </div>

        {/* Timeline */}
        <div style={{ position:'relative' }}>
          {/* Center vertical line */}
          <div style={{
            position:'absolute', left:'50%', top:0, bottom:0,
            width:'2px', transform:'translateX(-50%)',
            background:visible?'linear-gradient(180deg,#00d4ff 0%,rgba(0,212,255,0.2) 80%,transparent 100%)':'transparent',
            transition:'background 1s ease 0.3s',
          }} />

          <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
            {ACHIEVEMENT_TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0
              return (
                <TimelineItem key={i} item={item} index={i} visible={visible} isLeft={isLeft} />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ item, index, visible, isLeft }: {
  item: typeof ACHIEVEMENT_TIMELINE[0]
  index: number
  visible: boolean
  isLeft: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const rgb = hexToRgb(item.color)
  const delay = 0.15 + index * 0.12

  return (
    <div style={{
      display:'flex', alignItems:'center', position:'relative',
      justifyContent: isLeft ? 'flex-start' : 'flex-end',
      paddingBottom:'2rem',
    }}>
      {/* Card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width:'calc(50% - 40px)',
          padding:'1.25rem 1.5rem',
          borderRadius:'16px',
          background: hovered ? `rgba(${rgb},0.08)` : 'rgba(255,255,255,0.03)',
          border:`1px solid ${hovered ? item.color+'40' : 'rgba(255,255,255,0.07)'}`,
          backdropFilter:'blur(12px)',
          transition:'all 0.35s cubic-bezier(0.34,1.2,0.64,1)',
          transform: visible
            ? hovered ? `translateX(${isLeft?'4px':'-4px'}) scale(1.02)` : 'translate(0) scale(1)'
            : `translateX(${isLeft?'-40px':'40px'}) scale(0.95)`,
          opacity: visible ? 1 : 0,
          transitionDelay:`${delay}s`,
          boxShadow: hovered ? `0 8px 30px rgba(0,0,0,0.3),0 0 20px rgba(${rgb},0.12)` : 'none',
        }}
      >
        {/* Year badge */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:'5px',
          padding:'2px 10px', borderRadius:'999px',
          background:`rgba(${rgb},0.12)`, border:`1px solid ${item.color}30`,
          fontSize:'0.7rem', fontWeight:'700', color:item.color,
          marginBottom:'0.5rem',
        }}>
          {item.year}
        </div>

        <div style={{ display:'flex', alignItems:'flex-start', gap:'0.6rem' }}>
          <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{item.icon}</span>
          <div>
            <h4 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.95rem', color:'var(--text-primary)', margin:'0 0 0.3rem' }}>{item.event}</h4>
            <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', lineHeight:1.6, color:'var(--text-secondary)', margin:0 }}>{item.detail}</p>
          </div>
        </div>
      </div>

      {/* Center dot */}
      <div style={{
        position:'absolute', left:'50%', transform:'translateX(-50%)',
        width:'14px', height:'14px', borderRadius:'50%',
        background:item.color,
        border:`3px solid var(--bg-secondary)`,
        boxShadow: visible ? `0 0 12px ${item.color}80` : 'none',
        transition:`all 0.4s ease ${delay}s`,
        zIndex:1,
        opacity: visible ? 1 : 0,
      }} />
    </div>
  )
}

function hexToRgb(hex: string) {
  const c = hex.replace('#','')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
