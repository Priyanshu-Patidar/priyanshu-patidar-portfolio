import { useEffect, useState, useMemo } from 'react'
import { PERSONAL_INFO } from '@/data/constants'
import { projects } from '@/data/projects'
import { useVisitorCount, useResumeDownloadCount, useLeetCodeStats } from '@/hooks'
import { GithubIcon as TechGithubIcon, LinkedInIcon } from '@/components/ui/TechIcons'
import { OpenToWorkBadge } from '@/components/ui/RecruiterBadges'

interface Props {
  onClose: () => void
}

// Step 23 / Feature 4 — Recruiter Mode
// A floating, modal "executive summary" dashboard so a recruiter can evaluate
// the candidate in under 60 seconds without scrolling the full portfolio.
export default function RecruiterDashboard({ onClose }: Props) {
  const portfolioViews = useVisitorCount()
  const { count: resumeDownloads, increment: incrementResumeDownload } = useResumeDownloadCount()
  const leetcode = useLeetCodeStats()

  // Top 3 projects — featured first, then by category diversity
  const topProjects = useMemo(() => {
    const featured = projects.filter(p => p.featured)
    const rest = projects.filter(p => !p.featured)
    return [...featured, ...rest].slice(0, 3)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  const handleDownload = () => {
    incrementResumeDownload()
    const link = document.createElement('a')
    link.href = PERSONAL_INFO.resumePDF
    link.download = 'Priyanshu_Patidar_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const coreSkills = ['Java', 'Spring Boot', 'React.js', 'TypeScript', 'MySQL', 'REST APIs', 'JWT', 'AI Integration']

  const quickStats = [
    { label: 'Projects Completed', value: `${projects.length}+`, icon: '🚀', color: '#00d4ff' },
    { label: 'GitHub Repositories', value: '15+', icon: '📦', color: '#8b5cf6' },
    { label: 'Resume Downloads', value: resumeDownloads.toLocaleString(), icon: '📄', color: '#f59e0b' },
    { label: 'Portfolio Views', value: portfolioViews.toLocaleString(), icon: '👁', color: '#10b981' },
    { label: 'LeetCode Solved', value: leetcode.loading ? '…' : `${leetcode.totalSolved}+`, icon: '🧩', color: '#ec4899' },
  ]

  return (
    <div style={{ position:'fixed', inset:0, zIndex:8000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)' }} />

      <div style={{
        position:'relative', zIndex:1, width:'100%', maxWidth:'900px', maxHeight:'92vh', overflowY:'auto',
        background:'rgba(10,15,30,0.98)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:'22px',
        boxShadow:'0 0 60px rgba(0,212,255,0.08), 0 30px 80px rgba(0,0,0,0.6)',
        animation:'rd-up 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{ height:'3px', background:'linear-gradient(90deg,transparent,#00d4ff,#8b5cf6,transparent)', borderRadius:'22px 22px 0 0' }} />

        <div style={{ padding:'1.75rem 2rem 2rem' }}>

          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
            <div>
              <div style={{ fontSize:'0.65rem', fontWeight:'700', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00d4ff', marginBottom:'0.4rem' }}>
                Recruiter View
              </div>
              <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'1.4rem', color:'var(--text-primary)', margin:0 }}>
                60-Second Profile Summary
              </h2>
            </div>
            <button onClick={onClose} aria-label="Close recruiter dashboard" style={{
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

          {/* Profile Summary */}
          <div style={{
            display:'flex', gap:'1.25rem', alignItems:'center', flexWrap:'wrap',
            padding:'1.25rem', borderRadius:'14px', marginBottom:'1.5rem',
            background:'rgba(0,212,255,0.04)', border:'1px solid rgba(0,212,255,0.15)',
          }}>
            <div style={{
              width:'64px', height:'64px', borderRadius:'14px', flexShrink:0,
              background:'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(139,92,246,0.1))',
              border:'1px solid rgba(0,212,255,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Space Grotesk,sans-serif', fontWeight:'800', fontSize:'1.4rem', color:'#00d4ff',
            }}>
              {PERSONAL_INFO.initials}
            </div>
            <div style={{ flex:1, minWidth:'200px' }}>
              <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'1.15rem', color:'var(--text-primary)', margin:'0 0 0.3rem' }}>
                {PERSONAL_INFO.name}
              </h3>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', color:'#00d4ff', margin:'0 0 0.4rem', fontWeight:'600' }}>
                Java Full Stack Developer + AI
              </p>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.76rem', color:'var(--text-muted)', margin:0 }}>
                🎓 B.Tech + CDAC Bangalore (A+) &nbsp;·&nbsp; 📍 India
              </p>
            </div>
            <OpenToWorkBadge size="sm" />
          </div>

          {/* Quick Stats */}
          <SectionLabel>Quick Stats</SectionLabel>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'0.7rem', marginBottom:'1.5rem' }}>
            {quickStats.map(s => (
              <div key={s.label} style={{
                padding:'0.85rem', borderRadius:'12px', textAlign:'center',
                background:`rgba(${hexToRgb(s.color)},0.06)`, border:`1px solid ${s.color}20`,
              }}>
                <div style={{ fontSize:'1.1rem', marginBottom:'0.25rem' }}>{s.icon}</div>
                <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'800', fontSize:'1.25rem', color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.65rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Core Skills */}
          <SectionLabel>Core Skills</SectionLabel>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.45rem', marginBottom:'1.5rem' }}>
            {coreSkills.map(skill => (
              <span key={skill} style={{
                padding:'4px 11px', borderRadius:'7px',
                background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                fontSize:'0.75rem', fontWeight:'500', color:'var(--text-secondary)',
                fontFamily:'Space Grotesk,sans-serif',
              }}>
                {skill}
              </span>
            ))}
          </div>

          {/* Top Projects */}
          <SectionLabel>Top Projects</SectionLabel>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'0.9rem', marginBottom:'1.5rem' }}>
            {topProjects.map(p => (
              <div key={p.id} style={{
                padding:'1rem', borderRadius:'12px',
                background:'rgba(255,255,255,0.03)', border:`1px solid ${p.color}25`,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'0.5rem' }}>
                  <span style={{ fontSize:'1rem' }}>{p.icon}</span>
                  <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.82rem', color:'var(--text-primary)', lineHeight:1.3 }}>{p.title}</span>
                </div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:p.color, marginBottom:'0.5rem', fontWeight:'600' }}>{p.category}</div>
                {p.impact && (
                  <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', lineHeight:1.5, color:'var(--text-muted)', margin:'0 0 0.7rem' }}>
                    {p.impact.split('.')[0]}.
                  </p>
                )}
                <div style={{ display:'flex', gap:'0.4rem' }}>
                  <a href={p.github} target="_blank" rel="noopener noreferrer" style={miniBtnStyle('#94a3b8')}>
                    <TechGithubIcon size={11} /> Code
                  </a>
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer" style={miniBtnStyle(p.color)}>
                      ↗ Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Resume + Contact */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1rem' }}>
            {/* Resume */}
            <div style={{ padding:'1.1rem', borderRadius:'12px', background:'rgba(0,212,255,0.04)', border:'1px solid rgba(0,212,255,0.15)' }}>
              <SectionLabel noMargin>Resume</SectionLabel>
              <button onClick={handleDownload} style={{
                width:'100%', marginTop:'0.7rem', padding:'0.65rem 1rem', borderRadius:'10px', cursor:'pointer',
                background:'linear-gradient(135deg,#00d4ff,#0099cc)', border:'none', color:'#0a0f1e',
                fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.82rem',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                boxShadow:'0 0 16px rgba(0,212,255,0.3)', transition:'all 0.25s ease',
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 24px rgba(0,212,255,0.5)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 16px rgba(0,212,255,0.3)'}}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Resume
              </button>
            </div>

            {/* Contact */}
            <div style={{ padding:'1.1rem', borderRadius:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <SectionLabel noMargin>Contact</SectionLabel>
              <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.7rem' }}>
                <a href={`mailto:${PERSONAL_INFO.email}?subject=Job%20Opportunity`} style={contactIconStyle('#f59e0b')} aria-label="Email">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" style={contactIconStyle('#0a66c2')} aria-label="LinkedIn">
                  <LinkedInIcon size={15} />
                </a>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" style={contactIconStyle('#94a3b8')} aria-label="GitHub">
                  <TechGithubIcon size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            href={`mailto:${PERSONAL_INFO.email}?subject=Interview%20Opportunity&body=Hi%20Priyanshu%2C%20I'd%20like%20to%20schedule%20an%20interview...`}
            style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
              marginTop:'1.25rem', padding:'0.85rem 1.5rem', borderRadius:'12px',
              background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', border:'none', color:'white',
              textDecoration:'none', fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.9rem',
              boxShadow:'0 0 20px rgba(139,92,246,0.35)', transition:'all 0.25s ease',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 30px rgba(139,92,246,0.55)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 20px rgba(139,92,246,0.35)'}}
          >
            📅 Schedule an Interview
          </a>
        </div>
      </div>

      <style>{`@keyframes rd-up{from{opacity:0;transform:translateY(30px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  )
}

function SectionLabel({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--text-muted)', marginBottom: noMargin ? 0 : '0.6rem', fontWeight:'600' }}>
      {children}
    </div>
  )
}

function miniBtnStyle(color: string): React.CSSProperties {
  return {
    display:'inline-flex', alignItems:'center', gap:'4px',
    padding:'4px 9px', borderRadius:'6px',
    background: color+'14', border:`1px solid ${color}30`,
    color, textDecoration:'none', fontSize:'0.7rem', fontWeight:'600',
    fontFamily:'Space Grotesk,sans-serif',
  }
}

function contactIconStyle(color: string): React.CSSProperties {
  return {
    width:'36px', height:'36px', borderRadius:'9px',
    display:'flex', alignItems:'center', justifyContent:'center',
    background: color+'14', border:`1px solid ${color}30`, color,
    transition:'all 0.2s ease',
  }
}

function hexToRgb(hex: string) {
  const c = hex.replace('#','')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
