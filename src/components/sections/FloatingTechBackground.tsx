import { useEffect, useRef, useState, memo } from 'react'
import { TECH_ICON_MAP, getTechIcon } from '@/components/ui/TechIcons'

// Map each floating logo to the skill category it should highlight on hover.
// Category names must match `category` strings in src/data/skills.ts.
const TECH_TO_CATEGORY: Record<string, string> = {
  'Java': 'Languages',
  'TypeScript': 'Languages',
  'Python': 'Languages',
  'Spring Boot': 'Frameworks',
  'React': 'Frameworks',
  'Angular': 'Frameworks',
  'Node.js': 'Frameworks',
  'Hibernate': 'Frameworks',
  'MySQL': 'Databases',
  'MongoDB': 'Databases',
  'JWT': 'Web & APIs',
  'Postman': 'Web & APIs',
  'Docker': 'Tools & DevOps',
  'Git': 'Tools & DevOps',
  'GitHub': 'Tools & DevOps',
  'AWS': 'Tools & DevOps',
  'LangChain': 'AI / ML',
  'LangGraph': 'AI / ML',
  // New additions (Floating Tech Background Enhancement)
  'LeetCode': 'Concepts',
  'LinkedIn': 'Concepts',
}

interface FloatingLogo {
  name: string
  top: string
  left: string
  size: number
  duration: number
  delay: number
  driftX: number
  driftY: number
  rotate: number
  depth: number      // 0=far/dim/small-drift, 1=near/bold/large-drift — adds a parallax depth feel
  variant: number     // which keyframe path (0-7) — avoids synchronized/identical motion
}

// Curated set — 14 logos, positioned to avoid the center content column
const DESKTOP_LOGOS: FloatingLogo[] = [
  { name:'Java',        top:'8%',  left:'4%',  size:44, duration:13, delay:0,    driftX:30, driftY:22, rotate:10, depth:0.9, variant:0 },
  { name:'React',       top:'18%', left:'90%', size:48, duration:16, delay:1.1, driftX:-26,driftY:30, rotate:-13,depth:1.0, variant:1 },
  { name:'Spring Boot', top:'62%', left:'3%',  size:41, duration:14, delay:0.6, driftX:24, driftY:-28,rotate:8,  depth:0.85,variant:2 },
  { name:'TypeScript',  top:'78%', left:'92%', size:39, duration:11, delay:1.7, driftX:-22,driftY:-20,rotate:-11,depth:0.7, variant:3 },
  { name:'MySQL',       top:'4%',  left:'45%', size:35, duration:18, delay:0.3, driftX:18, driftY:26, rotate:6,  depth:0.6, variant:4 },
  { name:'Docker',      top:'88%', left:'48%', size:39, duration:12, delay:0.8, driftX:-20,driftY:-24,rotate:-9, depth:0.8, variant:5 },
  { name:'Git',         top:'40%', left:'1%',  size:32, duration:15, delay:1.4, driftX:26, driftY:16, rotate:12, depth:0.5, variant:6 },
  { name:'GitHub',      top:'50%', left:'95%', size:37, duration:10, delay:0.4, driftX:-28,driftY:18, rotate:-12,depth:0.95,variant:7 },
  { name:'Node.js',     top:'30%', left:'15%', size:30, duration:17, delay:2.0, driftX:16, driftY:-16,rotate:7,  depth:0.45,variant:1 },
  { name:'MongoDB',     top:'70%', left:'18%', size:32, duration:13, delay:1.0, driftX:-16,driftY:22, rotate:-7, depth:0.65,variant:3 },
  { name:'AWS',         top:'12%', left:'70%', size:35, duration:16, delay:0.7, driftX:22, driftY:-18,rotate:9,  depth:0.75,variant:5 },
  { name:'Python',      top:'85%', left:'78%', size:37, duration:12, delay:1.5, driftX:-22,driftY:16, rotate:-8, depth:0.8, variant:0 },
  { name:'JWT',         top:'45%', left:'82%', size:28, duration:19, delay:1.2, driftX:18, driftY:18, rotate:10, depth:0.4, variant:6 },
  { name:'LangChain',   top:'58%', left:'60%', size:30, duration:14, delay:0.2, driftX:-16,driftY:-22,rotate:-7, depth:0.55,variant:2 },
  // New additions ↓ (Floating Tech Background Enhancement)
  { name:'Angular',     top:'25%', left:'38%', size:34, duration:15, delay:1.9, driftX:20, driftY:24, rotate:11, depth:0.6, variant:4 },
  { name:'Hibernate',   top:'68%', left:'88%', size:30, duration:11, delay:0.5, driftX:-18,driftY:-20,rotate:-10,depth:0.5, variant:7 },
  { name:'Postman',     top:'35%', left:'8%',  size:32, duration:17, delay:1.3, driftX:24, driftY:-14,rotate:8,  depth:0.65,variant:1 },
  { name:'LeetCode',    top:'92%', left:'28%', size:30, duration:13, delay:2.1, driftX:-14,driftY:18, rotate:-9, depth:0.5, variant:3 },
  { name:'LinkedIn',    top:'2%',  left:'18%', size:32, duration:18, delay:0.9, driftX:16, driftY:20, rotate:7,  depth:0.55,variant:5 },
  { name:'CodeChef',    top:'55%', left:'30%', size:28, duration:14, delay:1.6, driftX:-20,driftY:-16,rotate:-8, depth:0.45,variant:0 },
]

// Reduced set for mobile — fewer, smaller, simpler
const MOBILE_LOGOS: FloatingLogo[] = [
  { name:'Java',        top:'6%',  left:'8%',  size:30, duration:14, delay:0,   driftX:14, driftY:11, rotate:6, depth:0.7, variant:0 },
  { name:'React',       top:'15%', left:'80%', size:32, duration:16, delay:1,   driftX:-12,driftY:14, rotate:-6,depth:0.9, variant:1 },
  { name:'Spring Boot', top:'85%', left:'10%', size:28, duration:13, delay:0.6, driftX:11, driftY:-11,rotate:5, depth:0.6, variant:2 },
  { name:'Docker',      top:'90%', left:'75%', size:28, duration:12, delay:1.4, driftX:-11,driftY:-11,rotate:-5,depth:0.8, variant:5 },
  { name:'MySQL',       top:'45%', left:'88%', size:25, duration:17, delay:0.3, driftX:9,  driftY:11, rotate:4, depth:0.5, variant:4 },
  { name:'TypeScript',  top:'50%', left:'4%',  size:25, duration:15, delay:0.9, driftX:-9, driftY:-11,rotate:-4,depth:0.55,variant:3 },
  { name:'Angular',     top:'30%', left:'40%', size:26, duration:14, delay:1.6, driftX:10, driftY:13, rotate:5, depth:0.45,variant:6 },
  { name:'LeetCode',    top:'70%', left:'40%', size:25, duration:16, delay:0.5, driftX:-10,driftY:9,  rotate:-5,depth:0.5, variant:7 },
]

interface Props {
  activeCategory: string
  onHoverCategory: (category: string | null) => void
}

const FloatingTechBackground = memo(function FloatingTechBackground({ activeCategory, onHoverCategory }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const [parallax, setParallax] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Gentle parallax on scroll — only active on desktop, lightweight (rAF-throttled)
  useEffect(() => {
    if (isMobile || prefersReduced) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const el = containerRef.current
        if (el) {
          const rect = el.getBoundingClientRect()
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
          setParallax((progress - 0.5) * 20) // small ±10px shift
        }
        raf = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [isMobile, prefersReduced])

  const logos = isMobile ? MOBILE_LOGOS : DESKTOP_LOGOS
  // Skip rendering entirely for prefers-reduced-motion — fully static, no animation
  const animate = !prefersReduced

  return (
    <div ref={containerRef} aria-hidden="true" style={{
      position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0,
    }}>
      {logos.map((logo, i) => {
        const Icon = TECH_ICON_MAP[logo.name]
        if (!Icon) return null
        const category = TECH_TO_CATEGORY[logo.name]
        const isHighlighted = category === activeCategory
        return (
          <div
            key={logo.name + i}
            style={{
              position:'absolute',
              top: logo.top, left: logo.left,
              width: logo.size, height: logo.size,
              // Base opacity raised to ~40% per enhancement request; depth adds
              // subtle per-logo variance (0.32–0.44) for a parallax-like layering feel
              opacity: isHighlighted ? 0.65 : 0.32 + logo.depth * 0.12,
              '--dx': `${logo.driftX}px`,
              '--dy': `${logo.driftY}px`,
              '--r': `${logo.rotate}deg`,
              '--parallax': `${parallax * (0.5 + logo.depth * 0.5)}px`,
              transform: animate ? undefined : `translateY(${parallax}px)`,
              transition: 'opacity 0.4s ease',
              // Each logo uses its own variant (0-7) + unique duration + delay,
              // so no two logos ever move in sync — organic, unstructured motion
              animation: animate ? `tech-float-${logo.variant} ${logo.duration}s ease-in-out ${logo.delay}s infinite` : 'none',
              pointerEvents: 'auto', // allow hover even though container is pointer-events:none
              filter: isHighlighted
                ? `drop-shadow(0 0 10px currentColor)`
                : `drop-shadow(0 0 ${(1 - logo.depth) * 2}px rgba(0,0,0,0.3))`,
              cursor: 'default',
            } as React.CSSProperties}
            onMouseEnter={() => category && onHoverCategory(category)}
            onMouseLeave={() => onHoverCategory(null)}
          >
            <div style={{ width:'100%', height:'100%', transform: animate ? `translateY(var(--parallax))` : undefined }}>
              {getTechIcon(logo.name, logo.size)}
            </div>
          </div>
        )
      })}

      {/* 8 distinct organic motion paths — each multi-stop, not simple mirrors,
          so no two logos ever trace the same shape (unstructured movement) */}
      <style>{`
        @keyframes tech-float-0 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          25% { transform: translate(var(--dx),calc(var(--dy) * -0.6)) rotate(calc(var(--r) * 0.5)); }
          50% { transform: translate(calc(var(--dx) * 1.3),var(--dy)) rotate(var(--r)); }
          75% { transform: translate(calc(var(--dx) * 0.4),calc(var(--dy) * 1.1)) rotate(calc(var(--r) * 0.3)); }
        }
        @keyframes tech-float-1 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          30% { transform: translate(calc(var(--dx) * -1),calc(var(--dy) * 0.7)) rotate(calc(var(--r) * -1)); }
          60% { transform: translate(calc(var(--dx) * -0.3),calc(var(--dy) * -0.9)) rotate(calc(var(--r) * -0.4)); }
        }
        @keyframes tech-float-2 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          20% { transform: translate(var(--dx),calc(var(--dy) * -1)) rotate(var(--r)); }
          55% { transform: translate(calc(var(--dx) * -0.5),calc(var(--dy) * -0.3)) rotate(calc(var(--r) * -0.6)); }
          80% { transform: translate(calc(var(--dx) * 0.7),var(--dy)) rotate(calc(var(--r) * 0.8)); }
        }
        @keyframes tech-float-3 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          35% { transform: translate(calc(var(--dx) * -1),calc(var(--dy) * -1)) rotate(calc(var(--r) * -1)); }
          70% { transform: translate(calc(var(--dx) * 0.6),calc(var(--dy) * -0.4)) rotate(calc(var(--r) * 0.5)); }
        }
        @keyframes tech-float-4 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          25% { transform: translate(calc(var(--dx) * 0.8),var(--dy)) rotate(calc(var(--r) * 0.6)); }
          50% { transform: translate(var(--dx),calc(var(--dy) * -0.5)) rotate(var(--r)); }
          75% { transform: translate(calc(var(--dx) * -0.4),calc(var(--dy) * -1)) rotate(calc(var(--r) * -0.3)); }
        }
        @keyframes tech-float-5 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          40% { transform: translate(calc(var(--dx) * -0.7),calc(var(--dy) * 1.2)) rotate(calc(var(--r) * -0.8)); }
          70% { transform: translate(var(--dx),calc(var(--dy) * 0.3)) rotate(var(--r)); }
        }
        @keyframes tech-float-6 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          30% { transform: translate(var(--dx),var(--dy)) rotate(var(--r)); }
          55% { transform: translate(calc(var(--dx) * 0.2),calc(var(--dy) * -1)) rotate(calc(var(--r) * -0.4)); }
          85% { transform: translate(calc(var(--dx) * -0.8),calc(var(--dy) * 0.4)) rotate(calc(var(--r) * 0.6)); }
        }
        @keyframes tech-float-7 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          20% { transform: translate(calc(var(--dx) * -0.5),calc(var(--dy) * -0.8)) rotate(calc(var(--r) * -0.5)); }
          50% { transform: translate(calc(var(--dx) * -1),var(--dy)) rotate(calc(var(--r) * -1)); }
          80% { transform: translate(calc(var(--dx) * 0.5),calc(var(--dy) * 0.6)) rotate(calc(var(--r) * 0.4)); }
        }
      `}</style>
    </div>
  )
})

export default FloatingTechBackground
