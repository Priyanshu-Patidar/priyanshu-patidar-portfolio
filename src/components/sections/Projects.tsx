import { ARCHITECTURE_NODES } from '@/data/architectureNodes'
import InteractiveArchitectureViewer from '@/components/ui/InteractiveArchitectureViewer'
import ScreenshotGallery from '@/components/ui/ScreenshotGallery'
import { CASE_STUDIES } from '@/data/caseStudies'
import { DEVELOPMENT_TIMELINES } from '@/data/developmentTimelines'
import DevelopmentTimeline from '@/components/ui/DevelopmentTimeline'
import { DATABASE_SCHEMAS } from '@/data/databaseSchemas'
import DatabaseSchemaViewer from '@/components/ui/DatabaseSchemaViewer'
import { useRef, useState, useEffect, useCallback, memo, useMemo, lazy, Suspense } from 'react'
import { useProjectViews } from '@/hooks'
const CaseStudyModal = lazy(() => import('@/components/ui/CaseStudyModal'))
import { projects } from '@/data/projects'
import type { ProjectFilter, Project } from '@/types'

const FILTERS: ProjectFilter[] = ['All', 'Java & Spring Boot', 'MERN Stack', 'AI & ML', 'Data Science', '.NET']
const FILTER_ICONS: Record<ProjectFilter, string> = {
  'All':'🗂️','Java & Spring Boot':'☕','MERN Stack':'🌿','AI & ML':'🤖','Data Science':'📊','.NET':'🔷'
}
const CAT_GRADIENTS: Record<string, string> = {
  'Java & Spring Boot':'linear-gradient(135deg,rgba(245,158,11,0.10) 0%,rgba(245,158,11,0.03) 100%)',
  'MERN Stack':'linear-gradient(135deg,rgba(16,185,129,0.10) 0%,rgba(16,185,129,0.03) 100%)',
  'AI & ML':'linear-gradient(135deg,rgba(139,92,246,0.10) 0%,rgba(139,92,246,0.03) 100%)',
  'Data Science':'linear-gradient(135deg,rgba(6,182,212,0.10) 0%,rgba(6,182,212,0.03) 100%)',
  '.NET':'linear-gradient(135deg,rgba(59,130,246,0.10) 0%,rgba(59,130,246,0.03) 100%)',
}

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

export default function Projects() {
  const { ref: sectionRef, visible } = useReveal(0.05)
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All')
  const [animating, setAnimating] = useState(false)
  const [displayedFilter, setDisplayedFilter] = useState<ProjectFilter>('All')
  const [modalProject, setModalProject] = useState<Project | null>(null)
  const [caseStudyProject, setCaseStudyProject] = useState<Project | null>(null)

  const handleFilterChange = useCallback((filter: ProjectFilter) => {
    if (filter === activeFilter || animating) return
    setAnimating(true)
    setTimeout(() => { setDisplayedFilter(filter); setActiveFilter(filter); setTimeout(() => setAnimating(false), 50) }, 200)
  }, [activeFilter, animating])

  const filtered = useMemo(() => displayedFilter === 'All' ? projects : projects.filter(p => p.category === displayedFilter), [displayedFilter])
  const featuredProject = projects.find(p => p.featured)

  return (
    <>
      <section id="projects" ref={sectionRef} style={{ padding:'6rem 1.5rem', background:'var(--bg-primary)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'15%', right:'-8%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.04) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'15%', left:'-8%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.04) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div style={{ marginBottom:'3rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(30px)', transition:'all 0.7s ease' }}>
            <div style={{ fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00d4ff', marginBottom:'0.75rem' }}>03 / Projects</div>
            <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'clamp(2rem,4vw,3rem)', color:'var(--text-primary)', margin:'0 0 0.5rem' }}>Featured Work</h2>
            <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.9rem', color:'var(--text-muted)', margin:'0.5rem 0 0', maxWidth:'500px' }}>
              6 production-ready applications — enterprise Java, .NET, MERN stack, AI/RAG systems, and data science.
            </p>
            <div style={{ width:'50px', height:'3px', background:'linear-gradient(90deg,#00d4ff,transparent)', borderRadius:'2px', marginTop:'14px' }} />
          </div>

          {/* Featured banner */}
          {featuredProject && visible && <FeaturedBanner project={featuredProject} onOpen={() => setModalProject(featuredProject)} />}

          {/* Filter tabs */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'2.5rem', opacity:visible?1:0, transition:'opacity 0.7s ease 0.2s' }}>
            {FILTERS.map(filter => {
              const cnt = filter === 'All' ? projects.length : projects.filter(p => p.category === filter).length
              if (cnt === 0 && filter !== 'All') return null
              return (
                <button key={filter} onClick={() => handleFilterChange(filter)} style={{
                  padding:'0.5rem 1.1rem', borderRadius:'999px', cursor:'pointer',
                  fontFamily:'Space Grotesk,sans-serif', fontSize:'0.8rem', fontWeight:'500',
                  border:`1px solid ${activeFilter===filter?'rgba(0,212,255,0.5)':'rgba(255,255,255,0.08)'}`,
                  background:activeFilter===filter?'rgba(0,212,255,0.12)':'rgba(255,255,255,0.03)',
                  color:activeFilter===filter?'#00d4ff':'var(--text-muted)',
                  transition:'all 0.25s ease', display:'flex', alignItems:'center', gap:'5px',
                  boxShadow:activeFilter===filter?'0 0 16px rgba(0,212,255,0.15)':'none',
                }}>
                  {FILTER_ICONS[filter]} {filter}
                  <span style={{ padding:'1px 7px', borderRadius:'999px', fontSize:'0.65rem', fontWeight:'600', background:activeFilter===filter?'rgba(0,212,255,0.2)':'rgba(255,255,255,0.06)', color:activeFilter===filter?'#00d4ff':'var(--text-muted)' }}>{cnt}</span>
                </button>
              )
            })}
          </div>

          {/* Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'1.5rem', opacity:animating?0:1, transition:'opacity 0.2s ease' }}>
            {filtered.map((project, i) => <ProjectCard key={project.id} project={project} index={i} visible={visible} onOpen={() => setModalProject(project)} onOpenCaseStudy={CASE_STUDIES[project.id] ? () => setCaseStudyProject(project) : undefined} />)}
          </div>
        </div>
      </section>

      {modalProject && <ProjectModal project={modalProject} onClose={() => setModalProject(null)} onOpenCaseStudy={CASE_STUDIES[modalProject.id] ? () => { setCaseStudyProject(modalProject) } : undefined} />}
      {caseStudyProject && (
        <Suspense fallback={null}>
          <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />
        </Suspense>
      )}
    </>
  )
}

/* ─── Featured Banner ─────────────────────────────────────────────────────── */
function FeaturedBanner({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ marginBottom:'2.5rem', padding:'2rem', borderRadius:'22px', cursor:'default',
        background:hovered?'rgba(139,92,246,0.08)':'rgba(139,92,246,0.04)',
        border:`1px solid ${hovered?'rgba(139,92,246,0.4)':'rgba(139,92,246,0.18)'}`,
        backdropFilter:'blur(16px)', transition:'all 0.35s ease', position:'relative', overflow:'hidden',
        boxShadow:hovered?'0 20px 60px rgba(0,0,0,0.35),0 0 40px rgba(139,92,246,0.15)':'0 4px 20px rgba(0,0,0,0.15)',
      }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#8b5cf6,transparent)' }} />
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'2rem' }}>
        <div style={{ flex:1, minWidth:'280px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'0.7rem' }}>
            <span style={{ padding:'3px 10px', borderRadius:'6px', background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', fontSize:'0.67rem', fontWeight:'700', color:'#8b5cf6' }}>⭐ FEATURED PROJECT</span>
            <span style={{ fontSize:'0.67rem', color:'var(--text-muted)' }}>AI & ML · Live on Vercel</span>
          </div>
          <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'1.35rem', color:'var(--text-primary)', margin:'0 0 0.7rem' }}>{project.title}</h3>

          {/* Key Highlights — short, recruiter-friendly. Full description lives in the Details modal. */}
          {project.features && project.features.length > 0 && (
            <ul style={{ margin:'0 0 1.1rem', padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.4rem', maxWidth:'520px' }}>
              {project.features.slice(0, 3).map((f, i) => (
                <li key={i} style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', fontFamily:'Inter,sans-serif', fontSize:'0.82rem', lineHeight:1.6, color:'var(--text-secondary)' }}>
                  <span style={{ color:'#8b5cf6', flexShrink:0, marginTop:'1px' }}>▸</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'1.1rem' }}>
            {project.tech.slice(0, 7).map(t => <span key={t} style={{ padding:'3px 9px', borderRadius:'6px', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', fontSize:'0.7rem', color:'#8b5cf6', fontWeight:'500' }}>{t}</span>)}
          </div>
          <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
            <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
              style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'0.5rem 1.1rem', borderRadius:'8px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'var(--text-secondary)', textDecoration:'none', fontSize:'0.78rem', fontWeight:'500', transition:'all 0.2s ease' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.color='var(--text-primary)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='var(--text-secondary)'}}>
              <GithubIcon size={13}/> GitHub
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'0.5rem 1.1rem', borderRadius:'8px', background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', border:'none', color:'white', textDecoration:'none', fontSize:'0.78rem', fontWeight:'600', transition:'all 0.2s ease', boxShadow:'0 0 16px rgba(139,92,246,0.4)' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 0 25px rgba(139,92,246,0.6)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 16px rgba(139,92,246,0.4)'}}>
                <ExternalLinkIcon size={13}/> Live Demo
              </a>
            )}
            <button onClick={onOpen} style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'0.5rem 1.1rem', borderRadius:'8px', background:'transparent', border:'1px solid rgba(139,92,246,0.35)', color:'#8b5cf6', cursor:'pointer', fontSize:'0.78rem', fontWeight:'500', transition:'all 0.2s ease' }}>
              Full Details →
            </button>
          </div>
        </div>
        {/* Placeholder art */}
        <div style={{ width:'clamp(200px,25vw,280px)', height:'170px', borderRadius:'14px', overflow:'hidden', flexShrink:0, background:'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(79,70,229,0.08))', border:'1px solid rgba(139,92,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
          <ProjectThumbnail src={project.thumbnail} alt={project.title} icon={project.icon} color={project.color}/>
        </div>
      </div>
    </div>
  )
}

/* ─── Project Card ─────────────────────────────────────────────────────────── */
const ProjectCard = memo(function ProjectCard({ project, index, visible, onOpen, onOpenCaseStudy }: { project:Project; index:number; visible:boolean; onOpen:()=>void; onOpenCaseStudy?:()=>void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x:0,y:0 })
  const catColor = project.color

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current; if (!card) return
    const rect = card.getBoundingClientRect()
    setTilt({ x:((e.clientY-rect.top-rect.height/2)/(rect.height/2))*-5, y:((e.clientX-rect.left-rect.width/2)/(rect.width/2))*5 })
  }, [])

  return (
    <div ref={cardRef} onMouseEnter={()=>setHovered(true)} onMouseMove={handleMouseMove}
      onMouseLeave={()=>{setHovered(false);setTilt({x:0,y:0})}}
      style={{
        position:'relative', borderRadius:'20px', overflow:'hidden',
        background:hovered?CAT_GRADIENTS[project.category]||'rgba(255,255,255,0.03)':'rgba(255,255,255,0.03)',
        border:`1px solid ${hovered?catColor+'35':'rgba(255,255,255,0.07)'}`,
        backdropFilter:'blur(16px)', padding:'1.75rem',
        transform:visible
          ?`perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered?-6:0}px) scale(${hovered?1.01:1})`
          :'translateY(40px) scale(0.95)',
        opacity:visible?1:0,
        transition:hovered?'transform 0.1s ease,box-shadow 0.3s ease,background 0.3s ease,border-color 0.3s ease'
          :`all 0.5s cubic-bezier(0.34,1.2,0.64,1) ${index*0.08}s`,
        boxShadow:hovered?`0 20px 60px rgba(0,0,0,0.4),0 0 30px ${catColor}20`:'0 4px 20px rgba(0,0,0,0.2)',
        cursor:'default', willChange:'transform',
      }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,transparent,${catColor},transparent)`, opacity:hovered?1:0, transition:'opacity 0.3s ease' }} />

      {/* Thumbnail */}
      <div style={{ height:'120px', borderRadius:'10px', overflow:'hidden', marginBottom:'1rem', background:`linear-gradient(135deg,${catColor}20,${catColor}06)`, border:`1px solid ${catColor}15`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
        <ProjectThumbnail src={project.thumbnail} alt={project.title} icon={project.icon} color={catColor}/>
      </div>

      {/* Header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'3px 9px', borderRadius:'6px', background:catColor+'18', border:`1px solid ${catColor}28`, fontSize:'0.64rem', fontWeight:'600', color:catColor }}>
          {FILTER_ICONS[project.category as ProjectFilter]} {project.category}
        </span>
        {project.featured && (
          <span style={{ padding:'2px 8px', borderRadius:'6px', background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', fontSize:'0.6rem', fontWeight:'700', color:'#8b5cf6' }}>⭐ Top Project</span>
        )}
      </div>

      <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.98rem', color:'var(--text-primary)', margin:'0 0 0.7rem', lineHeight:1.3 }}>{project.title}</h3>

      {/* Key Highlights — top 3 features only, full details in modal */}
      {project.features && project.features.length > 0 && (
        <ul style={{ margin:'0 0 0.9rem', padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.35rem' }}>
          {project.features.slice(0, 3).map((f, i) => (
            <li key={i} style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', fontFamily:'Inter,sans-serif', fontSize:'0.78rem', lineHeight:1.5, color:'var(--text-secondary)' }}>
              <span style={{ color:catColor, flexShrink:0, marginTop:'1px' }}>▸</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Tech badges */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem', marginBottom:'1.1rem' }}>
        {project.tech.slice(0,5).map(t=>(
          <span key={t} style={{ padding:'2px 8px', borderRadius:'5px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', fontSize:'0.67rem', fontWeight:'500', color:'var(--text-muted)', transition:'all 0.2s ease' }}
            onMouseEnter={e=>{e.currentTarget.style.background=catColor+'15';e.currentTarget.style.borderColor=catColor+'35';e.currentTarget.style.color=catColor}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.color='var(--text-muted)'}}>
            {t}
          </span>
        ))}
        {project.tech.length>5&&<span style={{ padding:'2px 8px', borderRadius:'5px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', fontSize:'0.67rem', color:'var(--text-muted)' }}>+{project.tech.length-5}</span>}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.5rem' }}>
        <a href={project.github} target="_blank" rel="noopener noreferrer"
          style={{ flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'5px', padding:'0.48rem 0.9rem', borderRadius:'8px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'var(--text-secondary)', textDecoration:'none', fontSize:'0.75rem', fontWeight:'500', transition:'all 0.25s ease' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.color='var(--text-primary)';e.currentTarget.style.transform='translateY(-1px)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='var(--text-secondary)';e.currentTarget.style.transform='none'}}>
          <GithubIcon size={12}/> GitHub
        </a>
        {project.live&&(
          <a href={project.live} target="_blank" rel="noopener noreferrer"
            style={{ flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'4px', padding:'0.48rem 0.9rem', borderRadius:'8px', background:`linear-gradient(135deg,${catColor},${catColor}99)`, border:'none', color:'#0a0f1e', textDecoration:'none', fontSize:'0.75rem', fontWeight:'600', transition:'all 0.25s ease', boxShadow:`0 0 12px ${catColor}40` }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow=`0 0 22px ${catColor}60`}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 0 12px ${catColor}40`}}>
            <ExternalLinkIcon size={11}/> Demo
          </a>
        )}
      </div>

      {/* View Details + Case Study */}
      <div style={{ display:'flex', gap:'0.5rem' }}>
        <button onClick={onOpen} style={{
          flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'6px',
          padding:'0.48rem 0.9rem', borderRadius:'8px', cursor:'pointer',
          background:'transparent', border:`1px solid ${catColor}30`, color:catColor,
          fontSize:'0.75rem', fontWeight:'600', fontFamily:'Space Grotesk,sans-serif',
          transition:'all 0.25s ease',
        }}
          onMouseEnter={e=>{e.currentTarget.style.background=catColor+'12';e.currentTarget.style.borderColor=catColor+'50'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor=catColor+'30'}}>
          View Details
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        {onOpenCaseStudy && (
          <button onClick={onOpenCaseStudy} title="View full case study" style={{
            flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'6px',
            padding:'0.48rem 0.9rem', borderRadius:'8px', cursor:'pointer',
            background:`linear-gradient(135deg,${catColor}22,${catColor}10)`, border:`1px solid ${catColor}45`, color:catColor,
            fontSize:'0.75rem', fontWeight:'700', fontFamily:'Space Grotesk,sans-serif',
            transition:'all 0.25s ease',
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow=`0 0 14px ${catColor}40`}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
            📋 Case Study
          </button>
        )}
      </div>
    </div>
  )
})

/* ─── Project Thumbnail ─────────────────────────────────────────────────────── */
const ProjectThumbnail = memo(function ProjectThumbnail({ src, alt, icon, color }: { src?:string; alt:string; icon:string; color:string }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  if (!src||errored) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', opacity:0.5 }}>
      <span style={{ fontSize:'2.2rem' }}>{icon}</span>
      <span style={{ fontSize:'0.6rem', color, fontFamily:'Inter,sans-serif', fontWeight:'500', textAlign:'center', maxWidth:'120px' }}>{alt}</span>
    </div>
  )
  return (
    <>
      {!loaded&&<div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:'2rem' }}>{icon}</span></div>}
      <img src={src} alt={alt} onLoad={()=>setLoaded(true)} onError={()=>setErrored(true)} loading="lazy"
        style={{ width:'100%', height:'100%', objectFit:'cover', opacity:loaded?1:0, transition:'opacity 0.4s ease' }}/>
    </>
  )
})

/* ─── Project Modal ─────────────────────────────────────────────────────────── */
function ProjectModal({ project, onClose, onOpenCaseStudy }: { project:Project; onClose:()=>void; onOpenCaseStudy?:()=>void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key==='Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow='' }
  }, [onClose])

  const c = project.color
  const views = useProjectViews(project.id, true)

  return (
    <div style={{ position:'fixed', inset:0, zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', animation:'mfade 0.3s ease' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(10px)' }}/>
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'820px', maxHeight:'92vh', overflowY:'auto', background:'rgba(10,15,30,0.98)', border:`1px solid ${c}28`, borderRadius:'22px', boxShadow:`0 0 60px rgba(0,0,0,0.6),0 0 30px ${c}15`, animation:'mup 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div style={{ height:'3px', background:`linear-gradient(90deg,transparent,${c},transparent)`, borderRadius:'22px 22px 0 0' }}/>

        <div style={{ padding:'2rem' }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem', marginBottom:'1.5rem' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                <span style={{ padding:'3px 10px', borderRadius:'6px', background:c+'18', border:`1px solid ${c}30`, fontSize:'0.67rem', fontWeight:'600', color:c }}>{FILTER_ICONS[project.category as ProjectFilter]} {project.category}</span>
                {project.featured&&<span style={{ padding:'3px 8px', borderRadius:'6px', background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', fontSize:'0.62rem', fontWeight:'700', color:'#8b5cf6' }}>⭐ Featured</span>}
                {project.live&&<span style={{ padding:'3px 8px', borderRadius:'6px', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.25)', fontSize:'0.62rem', fontWeight:'600', color:'#4ade80' }}>🟢 Live</span>}
              </div>
              <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'1.35rem', color:'var(--text-primary)', margin:0, lineHeight:1.2 }}>{project.icon} {project.title}</h2>
            </div>
            <button onClick={onClose} style={{ width:'36px', height:'36px', borderRadius:'8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s ease' }}
              onMouseEnter={e=>{e.currentTarget.style.color='#f87171';e.currentTarget.style.borderColor='rgba(248,113,113,0.3)';e.currentTarget.style.background='rgba(248,113,113,0.08)'}}
              onMouseLeave={e=>{e.currentTarget.style.color='var(--text-muted)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.background='rgba(255,255,255,0.05)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Screenshot Gallery */}
          <div style={{ marginBottom:'1.5rem', position:'relative' }}>
            <ScreenshotGallery images={project.screenshots || []} alt={project.title} color={c} />
            {/* View counter badge */}
            <div style={{
              position:'absolute', top:'10px', right:'10px', zIndex:3,
              display:'flex', alignItems:'center', gap:'5px',
              padding:'4px 10px', borderRadius:'8px',
              background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)',
              border:'1px solid rgba(255,255,255,0.12)',
              fontSize:'0.7rem', fontWeight:'600', color:'white',
              fontFamily:'JetBrains Mono,monospace',
            }}>
              👁 {views > 0 ? views.toLocaleString() : '—'} Project Views
            </div>
          </div>

          {/* Overview */}
          <ModalSection title="Overview">
            <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.85rem', lineHeight:1.85, color:'var(--text-secondary)', margin:0 }}>
              {project.longDescription || project.description}
            </p>
          </ModalSection>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <ModalSection title="Key Features">
              <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                {project.features.map((f,i) => (
                  <li key={i} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
                    <span style={{ color:c, flexShrink:0, marginTop:'2px' }}>▸</span>
                    <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.83rem', lineHeight:1.6, color:'var(--text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </ModalSection>
          )}

          {/* Challenges */}
          {project.challenges && project.challenges.length > 0 && (
            <ModalSection title="Engineering Challenges">
              <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem' }}>
                {project.challenges.map((ch,i) => (
                  <div key={i} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start', padding:'0.6rem 0.8rem', borderRadius:'8px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize:'0.85rem', flexShrink:0 }}>⚡</span>
                    <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', lineHeight:1.6, color:'var(--text-secondary)' }}>{ch}</span>
                  </div>
                ))}
              </div>
            </ModalSection>
          )}

          {/* Development Timeline */}
          {DEVELOPMENT_TIMELINES[project.id] && (
            <ModalSection title="Development Timeline">
              <DevelopmentTimeline phases={DEVELOPMENT_TIMELINES[project.id]} color={c} />
            </ModalSection>
          )}

          {/* Impact */}
          {project.impact && (
            <div style={{ padding:'1rem 1.25rem', borderRadius:'12px', background:`rgba(${hexToRgb(c)},0.07)`, border:`1px solid ${c}25`, marginBottom:'1.25rem' }}>
              <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', color:c, marginBottom:'0.4rem', fontWeight:'600' }}>Impact & Results</div>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.83rem', lineHeight:1.6, color:'var(--text-secondary)', margin:0 }}>{project.impact}</p>
            </div>
          )}

          {/* Key APIs */}
          {project.keyAPIs && project.keyAPIs.length > 0 && (
            <ModalSection title="API Endpoints">
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                {project.keyAPIs.map(api => <code key={api} style={{ fontSize:'0.68rem', padding:'3px 9px', borderRadius:'5px', background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', color:'#4fc3f7', fontFamily:'JetBrains Mono,monospace' }}>{api}</code>)}
              </div>
            </ModalSection>
          )}

          {/* Interactive Architecture Viewer — zoom/pan/fullscreen, clickable nodes */}
          {ARCHITECTURE_NODES[project.id] && (
            <ModalSection title="System Architecture">
              <InteractiveArchitectureViewer architecture={ARCHITECTURE_NODES[project.id]} color={c} />
            </ModalSection>
          )}

          {/* Database Schema / ER Viewer */}
          {DATABASE_SCHEMAS[project.id] && (
            <ModalSection title="Database Design">
              <DatabaseSchemaViewer schema={DATABASE_SCHEMAS[project.id]} color={c} />
            </ModalSection>
          )}

          <ModalSection title="Technology Stack">
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.45rem' }}>
              {project.tech.map(t => <span key={t} style={{ padding:'4px 10px', borderRadius:'7px', background:c+'12', border:`1px solid ${c}25`, fontSize:'0.75rem', fontWeight:'500', color:c }}>{t}</span>)}
            </div>
          </ModalSection>

          {/* Actions */}
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginTop:'0.5rem' }}>
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              style={{ flex:1, minWidth:'140px', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'0.75rem 1.25rem', borderRadius:'10px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.14)', color:'var(--text-secondary)', textDecoration:'none', fontSize:'0.85rem', fontWeight:'600', transition:'all 0.25s ease' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.12)';e.currentTarget.style.color='var(--text-primary)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='var(--text-secondary)'}}>
              <GithubIcon size={15}/> View on GitHub
            </a>
            {project.live&&(
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                style={{ flex:1, minWidth:'140px', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'0.75rem 1.25rem', borderRadius:'10px', background:`linear-gradient(135deg,${c},${c}bb)`, border:'none', color:'#0a0f1e', textDecoration:'none', fontSize:'0.85rem', fontWeight:'700', transition:'all 0.25s ease', boxShadow:`0 0 20px ${c}40` }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 0 30px ${c}60,0 10px 25px rgba(0,0,0,0.3)`}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 0 20px ${c}40`}}>
                <ExternalLinkIcon size={14}/> Live Demo
              </a>
            )}
            {onOpenCaseStudy && (
              <button onClick={onOpenCaseStudy}
                style={{ flex:1, minWidth:'140px', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'0.75rem 1.25rem', borderRadius:'10px', cursor:'pointer', background:`linear-gradient(135deg,${c}22,${c}10)`, border:`1px solid ${c}45`, color:c, fontSize:'0.85rem', fontWeight:'700', fontFamily:'Space Grotesk,sans-serif', transition:'all 0.25s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 0 25px ${c}40`}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
                📋 View Full Case Study
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes mfade{from{opacity:0}to{opacity:1}}@keyframes mup{from{opacity:0;transform:translateY(30px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  )
}

function ModalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:'1.25rem' }}>
      <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--text-muted)', marginBottom:'0.6rem', fontWeight:'600' }}>{title}</div>
      {children}
    </div>
  )
}

function hexToRgb(hex: string) {
  const c = hex.replace('#',''); return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
function GithubIcon({ size=16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
}
function ExternalLinkIcon({ size=14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
}
