import { useEffect } from 'react'
import type { Project } from '@/types'
import { CASE_STUDIES } from '@/data/caseStudies'
import { ARCHITECTURE_NODES } from '@/data/architectureNodes'
import InteractiveArchitectureViewer from '@/components/ui/InteractiveArchitectureViewer'
import ScreenshotGallery from '@/components/ui/ScreenshotGallery'
import { DATABASE_SCHEMAS } from '@/data/databaseSchemas'
import DatabaseSchemaViewer from '@/components/ui/DatabaseSchemaViewer'

interface Props {
  project: Project
  onClose: () => void
}

// Step 23 / Feature 5 — Case Study Pages.
// Full 12-section production-grade case study, opened as a modal overlay
// (no navigation away from the current page). Reuses ScreenshotGallery and
// ARCHITECTURE_NODES from the existing project modal so visuals stay consistent.
export default function CaseStudyModal({ project, onClose }: Props) {
  const study = CASE_STUDIES[project.id]
  const architecture = ARCHITECTURE_NODES[project.id]
  const c = project.color
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  if (!study) return null

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding: isMobile ? '0' : '1rem' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.9)', backdropFilter:'blur(10px)' }} />

      <div style={{
        position:'relative', zIndex:1, width:'100%', maxWidth:'920px', 
        height: isMobile ? '100%' : '94vh', overflowY:'auto',
        background:'rgba(8,12,26,0.98)', 
        border: isMobile ? 'none' : `1px solid ${c}30`, 
        borderRadius: isMobile ? '0' : '22px',
        boxShadow:`0 0 70px ${c}15, 0 30px 90px rgba(0,0,0,0.7)`,
        animation:'cs-up 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{ height:'3px', background:`linear-gradient(90deg,transparent,${c},transparent)`, borderRadius: isMobile ? '0' : '22px 22px 0 0' }} />

        {/* Sticky header */}
        <div style={{
          position:'sticky', top:0, zIndex:2, 
          padding: isMobile ? '1.25rem 1.5rem 1rem' : '1.5rem 2rem 1.25rem',
          background:'rgba(8,12,26,0.97)', backdropFilter:'blur(12px)',
          borderBottom:'1px solid rgba(255,255,255,0.06)',
          display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem',
        }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'0.5rem', flexWrap: 'wrap' }}>
              <span style={{ padding:'3px 10px', borderRadius:'6px', background:c+'18', border:`1px solid ${c}30`, fontSize:'0.65rem', fontWeight:'700', color:c, textTransform:'uppercase', letterSpacing:'0.1em' }}>
                Case Study
              </span>
              <span style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{project.category}</span>
            </div>
            <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize: isMobile ? '1.1rem' : '1.3rem', color:'var(--text-primary)', margin:0, lineHeight:1.25 }}>
              {project.icon} {project.title}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close case study" style={{
            width:'36px', height:'36px', borderRadius:'8px', flexShrink:0,
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            color:'var(--text-muted)', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s ease',
          }}
            onMouseEnter={e=>{e.currentTarget.style.color='#f87171';e.currentTarget.style.borderColor='rgba(248,113,113,0.3)';e.currentTarget.style.background='rgba(248,113,113,0.08)'}}
            onMouseLeave={e=>{e.currentTarget.style.color='var(--text-muted)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding: isMobile ? '1.5rem 1rem 2rem' : '1.75rem 2rem 2.5rem' }}>

          {/* 1. Problem Statement */}
          <CSSection num={1} title="Problem Statement" color={c}>
            <p style={pStyle}>{study.problemStatement}</p>
          </CSSection>

          {/* 2. Business Need */}
          <CSSection num={2} title="Business Need" color={c}>
            <p style={pStyle}>{study.businessNeed}</p>
          </CSSection>

          {/* 3. System Design — Interactive Architecture Viewer */}
          <CSSection num={3} title="System Design" color={c}>
            {architecture ? (
              <InteractiveArchitectureViewer architecture={architecture} color={c} />
            ) : (
              <p style={pStyle}>Architecture diagram not available for this project.</p>
            )}
          </CSSection>

          {/* 4. Database Design */}
          <CSSection num={4} title="Database Design" color={c}>
            {DATABASE_SCHEMAS[project.id] ? (
              <DatabaseSchemaViewer schema={DATABASE_SCHEMAS[project.id]} color={c} />
            ) : (
              <p style={pStyle}>Database schema not available for this project.</p>
            )}
          </CSSection>

          {/* 5. Technology Selection */}
          <CSSection num={5} title="Technology Selection" color={c}>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {study.technologySelection.map((t, i) => (
                <div key={i} style={{ padding:'0.8rem 1rem', borderRadius:'10px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.85rem', color:c, marginBottom:'0.3rem' }}>{t.tech}</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', lineHeight:1.6, color:'var(--text-secondary)' }}>{t.why}</div>
                </div>
              ))}
            </div>
          </CSSection>

          {/* 6. Development Process / Timeline */}
          <CSSection num={6} title="Development Process" color={c}>
            <div style={{ position:'relative', paddingLeft:'1.5rem' }}>
              <div style={{ position:'absolute', left:'5px', top:'8px', bottom:'8px', width:'2px', background:`linear-gradient(180deg,${c},transparent)` }} />
              {study.developmentTimeline.map((phase, i) => (
                <div key={i} style={{ position:'relative', marginBottom: i < study.developmentTimeline.length - 1 ? '1.25rem' : 0 }}>
                  <div style={{ position:'absolute', left:'-1.5rem', top:'4px', width:'12px', height:'12px', borderRadius:'50%', background:c, boxShadow:`0 0 8px ${c}80` }} />
                  <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.85rem', color:'var(--text-primary)', marginBottom:'0.4rem' }}>{phase.phase}</div>
                  <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.3rem' }}>
                    {phase.tasks.map((task, j) => (
                      <li key={j} style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', fontFamily:'Inter,sans-serif', fontSize:'0.78rem', lineHeight:1.55, color:'var(--text-secondary)' }}>
                        <span style={{ color:c, flexShrink:0 }}>▸</span><span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CSSection>

          {/* 7 & 8. Challenges Faced + Solutions Implemented */}
          <CSSection num={7} title="Challenges Faced & Solutions Implemented" color={c}>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
              {study.challengesAndSolutions.map((cs, i) => (
                <div key={i} style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ padding:'0.75rem 1rem', background:'rgba(248,113,113,0.06)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'#f87171', marginBottom:'0.3rem', fontWeight:'700' }}>⚠ Challenge</div>
                    <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', lineHeight:1.6, color:'var(--text-secondary)' }}>{cs.challenge}</div>
                  </div>
                  <div style={{ padding:'0.75rem 1rem', background:'rgba(74,222,128,0.05)' }}>
                    <div style={{ fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'#4ade80', marginBottom:'0.3rem', fontWeight:'700' }}>✓ Solution</div>
                    <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', lineHeight:1.6, color:'var(--text-secondary)' }}>{cs.solution}</div>
                  </div>
                </div>
              ))}
            </div>
          </CSSection>

          {/* 9. Performance Optimizations */}
          <CSSection num={9} title="Performance Optimizations" color={c}>
            <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {study.performanceOptimizations.map((p, i) => (
                <li key={i} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
                  <span style={{ fontSize:'0.85rem', flexShrink:0 }}>⚡</span>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', lineHeight:1.6, color:'var(--text-secondary)' }}>{p}</span>
                </li>
              ))}
            </ul>
          </CSSection>

          {/* 10. Results & Outcomes */}
          <CSSection num={10} title="Results & Outcomes" color={c}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'0.6rem' }}>
              {study.resultsAndOutcomes.map((r, i) => (
                <div key={i} style={{ padding:'0.75rem 1rem', borderRadius:'10px', background:`rgba(${hexToRgb(c)},0.06)`, border:`1px solid ${c}20`, display:'flex', gap:'0.5rem', alignItems:'flex-start' }}>
                  <span style={{ color:c, flexShrink:0 }}>✓</span>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', lineHeight:1.55, color:'var(--text-secondary)' }}>{r}</span>
                </div>
              ))}
            </div>
          </CSSection>

          {/* 11. Screenshots Gallery */}
          <CSSection num={11} title="Screenshots Gallery" color={c}>
            <ScreenshotGallery images={project.screenshots || []} alt={project.title} color={c} />
          </CSSection>

          {/* 12. Future Improvements */}
          <CSSection num={12} title="Future Improvements" color={c} last>
            <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {study.futureImprovements.map((f, i) => (
                <li key={i} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
                  <span style={{ fontSize:'0.85rem', flexShrink:0 }}>🔭</span>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', lineHeight:1.6, color:'var(--text-secondary)' }}>{f}</span>
                </li>
              ))}
            </ul>
          </CSSection>

          {/* Footer actions */}
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginTop:'0.5rem' }}>
            <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
              flex:1, minWidth:'140px', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'7px',
              padding:'0.75rem 1.25rem', borderRadius:'10px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.14)',
              color:'var(--text-secondary)', textDecoration:'none', fontSize:'0.85rem', fontWeight:'600', transition:'all 0.25s ease',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.12)';e.currentTarget.style.color='var(--text-primary)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='var(--text-secondary)'}}
            >
              View Source Code
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" style={{
                flex:1, minWidth:'140px', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'7px',
                padding:'0.75rem 1.25rem', borderRadius:'10px', background:`linear-gradient(135deg,${c},${c}bb)`, border:'none',
                color:'#0a0f1e', textDecoration:'none', fontSize:'0.85rem', fontWeight:'700', transition:'all 0.25s ease', boxShadow:`0 0 20px ${c}40`,
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 0 30px ${c}60`}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 0 20px ${c}40`}}
              >
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes cs-up{from{opacity:0;transform:translateY(30px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  )
}

const pStyle: React.CSSProperties = { fontFamily:'Inter,sans-serif', fontSize:'0.85rem', lineHeight:1.85, color:'var(--text-secondary)', margin:0 }

function CSSection({ num, title, color, children, last }: { num:number; title:string; color:string; children:React.ReactNode; last?:boolean }) {
  return (
    <div style={{ marginBottom: last ? '1.5rem' : '1.75rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
        <span style={{
          width:'24px', height:'24px', borderRadius:'7px', flexShrink:0,
          background:color+'18', border:`1px solid ${color}30`, color,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'JetBrains Mono,monospace', fontSize:'0.7rem', fontWeight:'700',
        }}>
          {num}
        </span>
        <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.95rem', color:'var(--text-primary)', margin:0 }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function hexToRgb(hex: string) {
  const c = hex.replace('#','')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
