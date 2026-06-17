import { useRef, useState, useEffect } from 'react'

function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

interface ServiceItem {
  icon: string
  title: string
  description: string
  deliverables: string[]
  timeline: string
  color: string
}

const SERVICES: ServiceItem[] = [
  {
    icon: '☕',
    title: 'Java Full Stack Development',
    description: 'Building robust, scalable web applications using Spring Boot, Spring MVC, REST APIs, Hibernate, and JPA with MySQL databases.',
    deliverables: ['Spring Boot web applications', 'RESTful API development', 'Database design and ORM mapping', 'JWT-based authentication', 'Microservices architecture', 'Unit & integration testing'],
    timeline: '4-8 weeks',
    color: '#f59e0b',
  },
  {
    icon: '🤖',
    title: 'AI Application Development',
    description: 'Building intelligent applications with LLM integration, RAG pipelines, vector search, and AI-powered automation workflows.',
    deliverables: ['OpenAI / LLM API integration', 'RAG pipeline development', 'Vector database setup (pgvector)', 'AI agent orchestration (LangGraph)', 'Prompt engineering & tuning', 'Streaming chat interfaces'],
    timeline: '3-6 weeks',
    color: '#8b5cf6',
  },
  {
    icon: '⚙️',
    title: 'Backend Development',
    description: 'Designing and developing secure, well-documented REST APIs with proper authentication, authorization, and data validation.',
    deliverables: ['RESTful API design', 'API documentation (Swagger/OpenAPI)', 'Authentication (JWT, OAuth)', 'Database schema design', 'Query optimization', 'Role-based access control'],
    timeline: '2-4 weeks',
    color: '#00d4ff',
  },
  {
    icon: '🌐',
    title: 'Responsive Web Development',
    description: 'Building modern, responsive, and performant user interfaces using React.js, TypeScript, HTML5, CSS3, and Tailwind CSS.',
    deliverables: ['React.js single page applications', 'Mobile-first responsive UI', 'Interactive user interfaces', 'SEO-friendly markup', 'Accessibility best practices', 'Cross-browser compatibility'],
    timeline: '3-6 weeks',
    color: '#10b981',
  },
  {
    icon: '✨',
    title: 'Frontend Development',
    description: 'Specializing in creating high-fidelity, interactive frontends with advanced animations and predictable state management.',
    deliverables: ['Advanced Framer Motion animations', 'Redux / Context API state management', 'Complex UI component architecture', 'Pixel-perfect CSS/Tailwind execution', 'Frontend performance profiling', 'Headless CMS integration'],
    timeline: '2-5 weeks',
    color: '#38bdf8',
  },
  {
    icon: '🚀',
    title: 'Deployment & Optimization',
    description: 'Production deployment, performance optimization, and CI/CD pipeline setup for fast, reliable, and scalable web applications.',
    deliverables: ['Vercel / cloud deployment', 'Performance optimization', 'CI/CD pipeline setup (GitHub Actions)', 'Docker containerization', 'Lighthouse score optimization', 'Production monitoring'],
    timeline: 'Ongoing',
    color: '#ec4899',
  },
]

export default function Services() {
  const { ref: sectionRef, visible } = useReveal(0.05)

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ padding:'6rem 1.5rem', background:'var(--bg-primary)', position:'relative', overflow:'hidden' }}
    >
      {/* Ambient glows */}
      <div style={{ position:'absolute', top:'10%', left:'-8%', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.04) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'-8%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.04) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:'1280px', margin:'0 auto' }}>

        {/* Heading */}
        <div style={{
          textAlign:'center', marginBottom:'3.5rem',
          opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(30px)', transition:'all 0.7s ease',
        }}>
          <div style={{ fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00d4ff', marginBottom:'0.75rem' }}>What I Offer</div>
          <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'clamp(2rem,4vw,3rem)', color:'var(--text-primary)', margin:'0 0 0.6rem' }}>Services</h2>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.9rem', color:'var(--text-muted)', margin:0 }}>How I can help bring your vision to life</p>
          <div style={{ width:'50px', height:'3px', background:'linear-gradient(90deg,#00d4ff,transparent)', borderRadius:'2px', margin:'14px auto 0' }} />
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'1.5rem' }}>
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, index, visible }: { service: ServiceItem; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const rgb = hexToRgb(service.color)
  const visibleDeliverables = expanded ? service.deliverables : service.deliverables.slice(0, 3)
  const remaining = service.deliverables.length - 3

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:'relative', borderRadius:'20px', padding:'1.75rem',
        background: hovered ? `rgba(${rgb},0.07)` : 'rgba(255,255,255,0.03)',
        border:`1px solid ${hovered ? service.color+'40' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter:'blur(16px)',
        transition:'all 0.4s cubic-bezier(0.34,1.2,0.64,1)',
        transform: visible
          ? hovered ? 'translateY(-8px) scale(1.015)' : 'translateY(0) scale(1)'
          : 'translateY(40px) scale(0.96)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.1}s`,
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.35), 0 0 35px rgba(${rgb},0.18)`
          : '0 4px 20px rgba(0,0,0,0.15)',
        display:'flex', flexDirection:'column',
        overflow:'hidden',
      }}
    >
      {/* Top accent line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,transparent,${service.color},transparent)`, opacity:hovered?1:0, transition:'opacity 0.35s ease' }} />

      {/* Corner glow */}
      <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:`radial-gradient(circle, rgba(${rgb},0.15) 0%, transparent 70%)`, opacity:hovered?1:0.35, transition:'opacity 0.3s ease', pointerEvents:'none' }} />

      {/* Icon */}
      <div style={{
        width:'52px', height:'52px', borderRadius:'14px',
        background:`rgba(${rgb},0.12)`, border:`1px solid ${service.color}30`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'1.6rem', marginBottom:'1.1rem',
        boxShadow: hovered ? `0 0 20px rgba(${rgb},0.3)` : 'none',
        transition:'box-shadow 0.3s ease',
      }}>
        {service.icon}
      </div>

      {/* Title */}
      <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'1.05rem', color:'var(--text-primary)', margin:'0 0 0.6rem', lineHeight:1.3 }}>
        {service.title}
      </h3>

      {/* Description */}
      <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.83rem', lineHeight:1.7, color:'var(--text-secondary)', margin:'0 0 1.1rem' }}>
        {service.description}
      </p>

      {/* Deliverables */}
      <div style={{ marginBottom:'1.1rem', flex:1 }}>
        <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.78rem', color:'var(--text-primary)', marginBottom:'0.5rem' }}>
          Deliverables:
        </div>
        <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
          {visibleDeliverables.map((d, i) => (
            <li key={i} style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', fontFamily:'Inter,sans-serif', fontSize:'0.78rem', lineHeight:1.5, color:'var(--text-secondary)' }}>
              <span style={{ color:service.color, flexShrink:0, marginTop:'1px', fontWeight:'700' }}>✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        {!expanded && remaining > 0 && (
          <button onClick={() => setExpanded(true)} style={{
            background:'none', border:'none', cursor:'pointer', padding:'0.4rem 0 0',
            fontFamily:'Inter,sans-serif', fontSize:'0.76rem', fontStyle:'italic',
            color:'var(--text-muted)', textAlign:'left',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = service.color }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            +{remaining} more…
          </button>
        )}
      </div>

      {/* Timeline */}
      <div style={{
        paddingTop:'0.9rem', borderTop:'1px solid rgba(255,255,255,0.06)',
        display:'flex', alignItems:'center', gap:'6px',
      }}>
        <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.78rem', color:'var(--text-primary)' }}>Timeline:</span>
        <span style={{
          fontFamily:'JetBrains Mono,monospace', fontSize:'0.75rem', color:service.color,
          padding:'2px 9px', borderRadius:'6px', background:`rgba(${rgb},0.1)`, border:`1px solid ${service.color}25`,
        }}>
          {service.timeline}
        </span>
      </div>
    </div>
  )
}

function hexToRgb(hex: string) {
  const c = hex.replace('#','')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
