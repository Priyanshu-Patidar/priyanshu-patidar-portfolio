import { useState, useEffect, useRef, useCallback } from 'react'
import { scrollToSection } from '@/utils/helpers'
import { PERSONAL_INFO } from '@/data/constants'

interface CommandItem {
  id: string
  label: string
  sublabel?: string
  icon: string
  action: () => void
  keywords: string
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: CommandItem[] = [
    { id:'home', label:'Home', sublabel:'Back to top', icon:'🏠', keywords:'home top hero start', action:()=>scrollToSection('#home') },
    { id:'about', label:'About Me', sublabel:'Background & highlights', icon:'👤', keywords:'about me bio profile who', action:()=>scrollToSection('#about') },
    { id:'skills', label:'Skills', sublabel:'Tech stack & proficiency', icon:'🛠️', keywords:'skills tech stack java spring react', action:()=>scrollToSection('#skills') },
    { id:'projects', label:'Projects', sublabel:'6 production applications', icon:'🚀', keywords:'projects work apps ai resume parking flickart', action:()=>scrollToSection('#projects') },
    { id:'experience', label:'Experience', sublabel:'CDAC + Acmegrade', icon:'💼', keywords:'experience work cdac acmegrade internship', action:()=>scrollToSection('#experience') },
    { id:'timeline', label:'Achievement Timeline', sublabel:'2020 - 2026 journey', icon:'📈', keywords:'timeline journey achievements milestones history', action:()=>scrollToSection('#timeline') },
    { id:'education', label:'Education', sublabel:'CDAC & Parul University', icon:'🎓', keywords:'education degree college university cdac parul', action:()=>scrollToSection('#education') },
    { id:'certifications', label:'Certifications', sublabel:'IBM Data Science & ML', icon:'🏅', keywords:'certifications ibm certificate credentials', action:()=>scrollToSection('#certifications') },
    { id:'stats', label:'Coding Stats', sublabel:'LeetCode, GitHub, GFG, CodeChef', icon:'📊', keywords:'stats leetcode github stats coding profiles', action:()=>scrollToSection('#stats') },
    { id:'contact', label:'Contact', sublabel:'Get in touch', icon:'📬', keywords:'contact email message form reach', action:()=>scrollToSection('#contact') },
    { id:'resume', label:'Open Resume', sublabel:'View & download PDF', icon:'📄', keywords:'resume cv download pdf view', action:()=>{
      const btn = document.querySelector('[data-resume-trigger]') as HTMLElement
      if (btn) btn.click()
    }},
    { id:'github', label:'GitHub Profile', sublabel:PERSONAL_INFO.github.replace('https://',''), icon:'🐙', keywords:'github code repos source', action:()=>window.open(PERSONAL_INFO.github,'_blank') },
    { id:'linkedin', label:'LinkedIn Profile', sublabel:'Connect professionally', icon:'💼', keywords:'linkedin connect network', action:()=>window.open(PERSONAL_INFO.linkedin,'_blank') },
    { id:'leetcode', label:'LeetCode Profile', sublabel:'200+ problems solved', icon:'🧩', keywords:'leetcode dsa problems coding', action:()=>window.open(PERSONAL_INFO.leetcode,'_blank') },
    { id:'email', label:'Send Email', sublabel:PERSONAL_INFO.email, icon:'✉️', keywords:'email mail send message contact', action:()=>window.open(`mailto:${PERSONAL_INFO.email}`,'_blank') },
    { id:'theme', label:'Toggle Theme', sublabel:'Switch dark / light mode', icon:'🌓', keywords:'theme dark light mode toggle', action:()=>{
      const btn = document.querySelector('[aria-label="Toggle theme"]') as HTMLElement
      if (btn) btn.click()
    }},
  ]

  const filtered = query.trim() === ''
    ? commands
    : commands.filter(c => (c.label + ' ' + (c.sublabel||'') + ' ' + c.keywords).toLowerCase().includes(query.toLowerCase()))

  // Global keyboard listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => { setActiveIndex(0) }, [query])

  const runCommand = useCallback((cmd: CommandItem) => {
    cmd.action()
    setOpen(false)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i+1, filtered.length-1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i-1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) runCommand(filtered[activeIndex]) }
  }

  return (
    <>
      {/* Floating trigger hint — desktop only */}
      <button
        onClick={() => setOpen(true)}
        className="cmdk-trigger"
        style={{
          position:'fixed', bottom:'2rem', left:'2rem', zIndex:500,
          display:'flex', alignItems:'center', gap:'8px',
          padding:'8px 14px', borderRadius:'10px',
          background:'rgba(13,21,48,0.85)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(255,255,255,0.08)',
          color:'var(--text-muted)', cursor:'pointer',
          fontFamily:'Inter,sans-serif', fontSize:'0.75rem',
          transition:'all 0.25s ease',
          boxShadow:'0 4px 20px rgba(0,0,0,0.3)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(0,212,255,0.3)'; e.currentTarget.style.color='#00d4ff' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='var(--text-muted)' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Search
        <kbd style={{ padding:'1px 6px', borderRadius:'5px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', fontSize:'0.65rem', fontFamily:'JetBrains Mono,monospace' }}>⌘K</kbd>
      </button>

      {/* Palette modal */}
      {open && (
        <div style={{ position:'fixed', inset:0, zIndex:7000, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'12vh', padding:'12vh 1rem 1rem' }}>
          <div onClick={() => setOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)' }} />

          <div style={{
            position:'relative', zIndex:1, width:'100%', maxWidth:'560px',
            background:'rgba(10,15,30,0.97)', border:'1px solid rgba(0,212,255,0.2)',
            borderRadius:'16px', overflow:'hidden',
            boxShadow:'0 0 60px rgba(0,212,255,0.1), 0 30px 80px rgba(0,0,0,0.6)',
            animation:'cmdk-in 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {/* Search input */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search projects, skills, sections..."
                style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text-primary)', fontFamily:'Inter,sans-serif', fontSize:'0.9rem' }}
              />
              <kbd style={{ padding:'2px 7px', borderRadius:'5px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'JetBrains Mono,monospace' }}>ESC</kbd>
            </div>

            {/* Results */}
            <div style={{ maxHeight:'360px', overflowY:'auto', padding:'0.5rem' }}>
              {filtered.length === 0 && (
                <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>No results for "{query}"</div>
              )}
              {filtered.map((cmd, i) => (
                <div
                  key={cmd.id}
                  onClick={() => runCommand(cmd)}
                  onMouseEnter={() => setActiveIndex(i)}
                  style={{
                    display:'flex', alignItems:'center', gap:'12px',
                    padding:'0.65rem 0.85rem', borderRadius:'10px',
                    background: i === activeIndex ? 'rgba(0,212,255,0.1)' : 'transparent',
                    border: i === activeIndex ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
                    cursor:'pointer', transition:'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{cmd.icon}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.85rem', color: i===activeIndex?'#00d4ff':'var(--text-primary)' }}>{cmd.label}</div>
                    {cmd.sublabel && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cmd.sublabel}</div>}
                  </div>
                  {i === activeIndex && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><polyline points="9 18 15 12 9 6"/></svg>
                  )}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div style={{ display:'flex', gap:'1rem', padding:'0.6rem 1.25rem', borderTop:'1px solid rgba(255,255,255,0.06)', fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Inter,sans-serif' }}>
              <span><kbd style={kbdStyle}>↑↓</kbd> navigate</span>
              <span><kbd style={kbdStyle}>↵</kbd> select</span>
              <span><kbd style={kbdStyle}>esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cmdk-in { from{opacity:0;transform:translateY(-10px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @media (max-width: 767px) { .cmdk-trigger { display: none !important; } }
      `}</style>
    </>
  )
}

const kbdStyle: React.CSSProperties = {
  padding:'1px 5px', borderRadius:'4px', background:'rgba(255,255,255,0.06)',
  border:'1px solid rgba(255,255,255,0.1)', fontFamily:'JetBrains Mono,monospace', fontSize:'0.65rem',
}
