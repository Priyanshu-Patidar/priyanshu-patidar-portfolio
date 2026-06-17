import { useScrollY } from '@/hooks'
import { scrollToSection } from '@/utils/helpers'

export default function BackToTop() {
  const scrollY = useScrollY()
  const visible = scrollY > 300

  return (
    <button
      onClick={() => scrollToSection('#home')}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'rgba(0,212,255,0.1)',
        border: '1.5px solid rgba(0,212,255,0.4)',
        color: '#00d4ff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.8)',
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        pointerEvents: visible ? 'all' : 'none',
        backdropFilter: 'blur(12px)',
        boxShadow: visible ? '0 0 20px rgba(0,212,255,0.3), 0 4px 20px rgba(0,0,0,0.3)' : 'none',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background = 'rgba(0,212,255,0.2)'
        el.style.boxShadow = '0 0 30px rgba(0,212,255,0.5), 0 4px 20px rgba(0,0,0,0.3)'
        el.style.transform = 'translateY(-3px) scale(1.05)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background = 'rgba(0,212,255,0.1)'
        el.style.boxShadow = '0 0 20px rgba(0,212,255,0.3), 0 4px 20px rgba(0,0,0,0.3)'
        el.style.transform = 'translateY(0) scale(1)'
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}
