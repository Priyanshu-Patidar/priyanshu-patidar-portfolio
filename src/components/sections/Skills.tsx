import { useRef, useState, useEffect, memo } from 'react'
import { skillCategories, techCloudItems } from '@/data/skills'
import { getTechIcon } from '@/components/ui/TechIcons'
import FloatingTechBackground from './FloatingTechBackground'

function useReveal(threshold = 0.1) {
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

export default function Skills() {
  const { ref: sectionRef, visible: sectionVisible } = useReveal(0.05)
  const [activeCategory, setActiveCategory] = useState(0)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ padding: '6rem 1.5rem', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Bg glow */}
      <div style={{ position:'absolute', bottom:'10%', left:'-5%', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.03) 0%,transparent 70%)', pointerEvents:'none' }} />

      {/* Floating tech logo background — decorative, hover highlights category below */}
      <FloatingTechBackground
        activeCategory={hoveredCategory ?? ''}
        onHoverCategory={setHoveredCategory}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position:'relative', zIndex:1 }}>

        {/* Heading */}
        <div style={{ marginBottom: '3.5rem', opacity: sectionVisible ? 1:0, transform: sectionVisible?'translateY(0)':'translateY(30px)', transition:'all 0.7s ease' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00d4ff', marginBottom:'0.75rem' }}>02 / Skills</div>
          <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'clamp(2rem,4vw,3rem)', color:'var(--text-primary)', margin:0 }}>Technical Expertise</h2>
          <div style={{ width:'50px', height:'3px', background:'linear-gradient(90deg,#00d4ff,transparent)', borderRadius:'2px', marginTop:'12px' }} />
        </div>

        {/* Tech Cloud */}
        <TechCloud visible={sectionVisible} />

        {/* Category tabs */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'2.5rem', opacity: sectionVisible?1:0, transition:'opacity 0.7s ease 0.3s' }}>
          {skillCategories.map((cat, i) => {
            const isHoverHighlighted = hoveredCategory === cat.category && activeCategory !== i
            return (
              <button key={cat.category} onClick={() => setActiveCategory(i)} style={{
                padding:'0.45rem 1rem', borderRadius:'8px', cursor:'pointer',
                fontFamily:'Space Grotesk,sans-serif', fontSize:'0.8rem', fontWeight:'500',
                border:`1px solid ${activeCategory===i ? 'rgba(0,212,255,0.5)' : isHoverHighlighted ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                background: activeCategory===i ? 'rgba(0,212,255,0.1)' : isHoverHighlighted ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.03)',
                color: activeCategory===i ? '#00d4ff' : isHoverHighlighted ? '#4fc3f7' : 'var(--text-muted)',
                transition:'all 0.25s ease',
                boxShadow: isHoverHighlighted ? '0 0 14px rgba(0,212,255,0.15)' : 'none',
              }}>
                {cat.icon} {cat.category}
              </button>
            )
          })}
        </div>

        {/* Skills grid — active category bars + all categories compact */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:'1.5rem' }}>
          {/* Active category — full bars */}
          <SkillBarPanel category={skillCategories[activeCategory]} visible={sectionVisible} highlighted={hoveredCategory === skillCategories[activeCategory].category} />

          {/* Overview panel — all categories radar-style */}
          <AllSkillsOverview visible={sectionVisible} activeIdx={activeCategory} onSelect={setActiveCategory} />
        </div>
      </div>
    </section>
  )
}

/* ─── Tech Cloud ─────────────────────────────────────────────────────────── */
function TechCloud({ visible }: { visible: boolean }) {
  return (
    <div style={{
      marginBottom: '3.5rem',
      padding: '2rem',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.7s ease 0.15s',
    }}>
      <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--text-muted)', marginBottom:'1.25rem', textAlign:'center' }}>
        Technology Stack
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.65rem', justifyContent:'center' }}>
        {techCloudItems.map((item, i) => (
          <TechPill key={item.name} item={item} delay={i * 0.04} visible={visible} />
        ))}
      </div>
    </div>
  )
}

interface TechItem { name: string; color: string; size: string }

const TechPill = memo(function TechPill({ item, delay, visible }: { item: TechItem; delay: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false)
  const sizeMap: Record<string, string> = { lg: '0.9rem', md: '0.8rem', sm: '0.72rem' }
  const padMap: Record<string, string> = { lg: '8px 16px', md: '6px 13px', sm: '5px 11px' }
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:'inline-flex', alignItems:'center', gap:'5px',
        padding: padMap[item.size] || '6px 13px',
        borderRadius:'8px',
        background: hovered ? item.color + '18' : 'rgba(255,255,255,0.04)',
        border:`1px solid ${hovered ? item.color + '60' : 'rgba(255,255,255,0.08)'}`,
        fontSize: sizeMap[item.size] || '0.8rem',
        fontWeight:'500', fontFamily:'Space Grotesk,sans-serif',
        color: hovered ? item.color : 'var(--text-secondary)',
        transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        transform: visible ? (hovered ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)') : 'translateY(15px) scale(0.9)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}s`,
        cursor:'default',
        boxShadow: hovered ? `0 4px 15px ${item.color}25` : 'none',
        whiteSpace:'nowrap',
      }}
    >
      {getTechIcon(item.name, item.size === 'lg' ? 16 : 14) || (
        <span style={{ width:'7px', height:'7px', borderRadius:'50%', background: hovered ? item.color : 'rgba(255,255,255,0.2)', transition:'background 0.25s ease', flexShrink:0 }} />
      )}
      {item.name}
    </span>
  )
})

/* ─── Skill Bar Panel ─────────────────────────────────────────────────────── */
function SkillBarPanel({ category, visible, highlighted }: { category: typeof skillCategories[0]; visible: boolean; highlighted?: boolean }) {
  const { ref, visible: panelVisible } = useReveal(0.1)

  return (
    <div
      ref={ref}
      style={{
        padding:'1.75rem',
        borderRadius:'18px',
        background: highlighted ? 'rgba(0,212,255,0.05)' : 'rgba(255,255,255,0.03)',
        border: highlighted ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.07)',
        backdropFilter:'blur(12px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-30px)',
        transition:'all 0.4s ease, background 0.3s ease, border-color 0.3s ease',
        boxShadow: highlighted ? '0 0 30px rgba(0,212,255,0.12)' : 'none',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1.75rem' }}>
        <span style={{ fontSize:'1.3rem' }}>{category.icon}</span>
        <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'1rem', color:'var(--text-primary)', margin:0 }}>{category.category}</h3>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
        {category.skills.map((skill, i) => (
          <SkillBar key={skill.name} skill={skill} index={i} trigger={panelVisible && visible} />
        ))}
      </div>
    </div>
  )
}

interface Skill { name: string; level: number }

const SkillBar = memo(function SkillBar({ skill, index, trigger }: { skill: Skill; index: number; trigger: boolean }) {
  const [filled, setFilled] = useState(false)
  useEffect(() => {
    if (!trigger) return
    const t = setTimeout(() => setFilled(true), 100 + index * 120)
    return () => clearTimeout(t)
  }, [trigger, index])

  const getColor = (lvl: number) => {
    if (lvl >= 85) return '#00d4ff'
    if (lvl >= 75) return '#4fc3f7'
    if (lvl >= 65) return '#38bdf8'
    return '#7dd3fc'
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
        <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.83rem', fontWeight:'500', color:'var(--text-secondary)' }}>{skill.name}</span>
        <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.72rem', color: getColor(skill.level), fontWeight:'600', transition:'color 0.3s ease' }}>{skill.level}%</span>
      </div>
      <div style={{ height:'7px', borderRadius:'999px', background:'rgba(255,255,255,0.06)', overflow:'hidden', position:'relative' }}>
        <div style={{
          height:'100%', borderRadius:'999px',
          background:`linear-gradient(90deg, ${getColor(skill.level)}, ${getColor(skill.level)}99)`,
          boxShadow: filled ? `0 0 8px ${getColor(skill.level)}66` : 'none',
          width: filled ? `${skill.level}%` : '0%',
          transition:`width 1.1s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 0.1}s`,
        }} />
        {/* Shimmer on filled bar */}
        {filled && (
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%)',
            backgroundSize:'200% 100%',
            animation:'bar-shimmer 2s linear infinite',
            borderRadius:'999px',
          }} />
        )}
      </div>
    </div>
  )
})

/* ─── All Skills Overview ─────────────────────────────────────────────────── */
function AllSkillsOverview({ visible, activeIdx, onSelect }: { visible: boolean; activeIdx: number; onSelect: (i: number) => void }) {
  return (
    <div style={{
      padding:'1.75rem',
      borderRadius:'18px',
      background:'rgba(255,255,255,0.03)',
      border:'1px solid rgba(255,255,255,0.07)',
      backdropFilter:'blur(12px)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(30px)',
      transition:'all 0.7s ease 0.45s',
    }}>
      <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'1rem', color:'var(--text-primary)', margin:'0 0 1.5rem' }}>All Categories</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        {skillCategories.map((cat, i) => {
          const avg = Math.round(cat.skills.reduce((s, sk) => s + sk.level, 0) / cat.skills.length)
          const isActive = i === activeIdx
          return (
            <button key={cat.category} onClick={() => onSelect(i)} style={{
              display:'flex', alignItems:'center', gap:'0.75rem',
              padding:'0.65rem 0.9rem', borderRadius:'10px',
              background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
              border:`1px solid ${isActive ? 'rgba(0,212,255,0.25)' : 'transparent'}`,
              cursor:'pointer', transition:'all 0.25s ease', textAlign:'left', width:'100%',
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' } }}
            >
              <span style={{ fontSize:'1rem', flexShrink:0 }}>{cat.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', fontWeight:'500', color: isActive?'#00d4ff':'var(--text-secondary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{cat.category}</span>
                  <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.68rem', color: isActive?'#00d4ff':'var(--text-muted)', marginLeft:'0.5rem', flexShrink:0 }}>{avg}%</span>
                </div>
                <div style={{ height:'4px', borderRadius:'999px', background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:'999px',
                    background: isActive ? 'linear-gradient(90deg,#00d4ff,#4fc3f7)' : 'rgba(255,255,255,0.15)',
                    width: visible ? `${avg}%` : '0%',
                    transition:`width 1s ease ${0.5 + i*0.05}s`,
                  }} />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop:'1.5rem', paddingTop:'1.25rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginBottom:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>Proficiency</div>
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
          {[{ label:'Expert 85%+', color:'#00d4ff'}, {label:'Advanced 75%+', color:'#4fc3f7'}, {label:'Proficient 65%+', color:'#38bdf8'}].map(l => (
            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:l.color }} />
              <span style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
