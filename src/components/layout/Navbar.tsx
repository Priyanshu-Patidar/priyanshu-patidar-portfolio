import { useState, useEffect, useRef } from 'react'
import { NAV_ITEMS, PERSONAL_INFO } from '@/data/constants'
import { scrollToSection } from '@/utils/helpers'
import { useScrollY, useActiveSection } from '@/hooks'
import type { Theme } from '@/types'

interface Props {
  theme: Theme
  toggleTheme: () => void
}

const SECTION_IDS = NAV_ITEMS.map(n => n.href.replace('#', ''))

export default function Navbar({ theme, toggleTheme }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrollY = useScrollY()
  const activeSection = useActiveSection(SECTION_IDS)
  const scrolled = scrollY > 40
  const navRef = useRef<HTMLElement>(null)

  // Close mobile menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = (href: string) => {
    scrollToSection(href)
    setMobileOpen(false)
  }

  const isDark = theme === 'dark'

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          transition: 'all 0.4s ease',
          background: scrolled
            ? isDark
              ? 'rgba(10,15,30,0.92)'
              : 'rgba(248,250,252,0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled
            ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
            : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.2)' : 'none',
        }}
      >
        {/* Logo / initials */}
        <button
          onClick={() => handleNavClick('#home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginRight: 'auto',
            textDecoration: 'none',
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.05))',
            border: '1px solid rgba(0,212,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: '700',
            fontSize: '0.85rem',
            color: '#00d4ff',
            letterSpacing: '-0.03em',
          }}>
            PP
          </div>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: '600',
            fontSize: '0.95rem',
            color: 'var(--text-primary)',
            display: 'none',
          }}
            className="sm:block"
          >
            {PERSONAL_INFO.name}
          </span>
        </button>

        {/* Desktop nav links */}
        <div
          style={{ display: 'none', alignItems: 'center', gap: '0.25rem' }}
          className="md:flex"
        >
          {NAV_ITEMS.map(item => {
            const id = item.href.replace('#', '')
            const isActive = activeSection === id
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#00d4ff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#00d4ff'
                    e.currentTarget.style.backgroundColor = 'rgba(0,212,255,0.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem' }}>
          {/* Open to Work badge — desktop */}
          <div
            style={{ display: 'none' }}
            className="md:flex"
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              fontSize: '0.7rem',
              fontWeight: '600',
              color: '#4ade80',
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 6px rgba(74,222,128,0.6)',
                animation: 'green-pulse 2s ease-in-out infinite',
                display: 'inline-block',
              }} />
              Open to Work
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'
              e.currentTarget.style.color = '#00d4ff'
              e.currentTarget.style.background = 'rgba(0,212,255,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              e.currentTarget.style.color = 'var(--text-secondary)'
              e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
            }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            className="md:hidden"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '8px',
              transition: 'all 0.3s ease',
            }}
          >
            <span style={{
              display: 'block',
              height: '1.5px',
              background: 'currentColor',
              borderRadius: '999px',
              transition: 'all 0.3s ease',
              width: mobileOpen ? '20px' : '20px',
              transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
            }} />
            <span style={{
              display: 'block',
              height: '1.5px',
              background: 'currentColor',
              borderRadius: '999px',
              transition: 'all 0.3s ease',
              width: mobileOpen ? '0' : '16px',
              opacity: mobileOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block',
              height: '1.5px',
              background: 'currentColor',
              borderRadius: '999px',
              transition: 'all 0.3s ease',
              width: mobileOpen ? '20px' : '20px',
              transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 998,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu drawer */}
      <div
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          zIndex: 999,
          background: isDark ? 'rgba(10,15,30,0.97)' : 'rgba(248,250,252,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          padding: '1rem 1.5rem 1.5rem',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-10px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'all' : 'none',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Open to Work badge mobile */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            fontSize: '0.72rem',
            fontWeight: '600',
            color: '#4ade80',
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#4ade80',
              display: 'inline-block',
              animation: 'green-pulse 2s ease-in-out infinite',
            }} />
            Open to Work
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {NAV_ITEMS.map((item, i) => {
            const id = item.href.replace('#', '')
            const isActive = activeSection === id
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                style={{
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.7rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#00d4ff' : 'var(--text-primary)',
                  transition: `all 0.2s ease ${i * 0.03}s`,
                  transform: mobileOpen ? 'translateX(0)' : 'translateX(-10px)',
                  opacity: mobileOpen ? 1 : 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                {isActive && (
                  <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#00d4ff',
                    flexShrink: 0,
                  }} />
                )}
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes green-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); opacity: 1; }
          50% { box-shadow: 0 0 0 5px rgba(74,222,128,0); opacity: 0.75; }
        }
        .md\\:flex { display: none !important; }
        .md\\:hidden { display: flex !important; }
        .sm\\:block { display: none !important; }
        @media (min-width: 768px) {
          .md\\:flex { display: flex !important; }
          .md\\:hidden { display: none !important; }
        }
        @media (min-width: 640px) {
          .sm\\:block { display: block !important; }
        }
      `}</style>
    </>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}
