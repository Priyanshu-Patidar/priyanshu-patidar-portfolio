import { PERSONAL_INFO, NAV_ITEMS } from '@/data/constants'
import { scrollToSection } from '@/utils/helpers'

export default function Footer() {
  const year = new Date().getFullYear()

  const socials = [
    { href: PERSONAL_INFO.github, label: 'GitHub', icon: <GithubIcon /> },
    { href: PERSONAL_INFO.linkedin, label: 'LinkedIn', icon: <LinkedinIcon /> },
    { href: PERSONAL_INFO.leetcode, label: 'LeetCode', icon: <CodeIcon /> },
    { href: PERSONAL_INFO.instagram, label: 'Instagram', icon: <InstagramIcon /> },
  ]

  return (
    <footer style={{
      background: 'var(--bg-primary)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 1.5rem 2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '1px',
        background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.4),transparent)',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Main row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1rem' }}>
              <div style={{
                width:'36px', height:'36px', borderRadius:'10px',
                background:'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(0,212,255,0.05))',
                border:'1px solid rgba(0,212,255,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Space Grotesk,sans-serif', fontWeight:'700',
                fontSize:'0.85rem', color:'#00d4ff',
              }}>PP</div>
              <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.95rem', color:'var(--text-primary)' }}>
                Priyanshu Patidar
              </span>
            </div>
            <p style={{
              fontFamily:'Inter,sans-serif', fontSize:'0.82rem',
              lineHeight:1.7, color:'var(--text-muted)',
              margin:'0 0 1.1rem', maxWidth:'260px',
            }}>
              Java Full Stack Developer building enterprise-grade applications with Spring Boot, MERN Stack, and AI systems.
            </p>
            {/* Open to work badge */}
            <span style={{
              display:'inline-flex', alignItems:'center', gap:'6px',
              padding:'4px 10px', borderRadius:'999px',
              background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)',
              fontSize:'0.7rem', fontWeight:'600', color:'#4ade80',
            }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'green-pulse 2s ease-in-out infinite' }} />
              Open to Work
            </span>
          </div>

          {/* Quick nav */}
          <div>
            <h4 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.85rem', color:'var(--text-primary)', margin:'0 0 1rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              Quick Links
            </h4>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {NAV_ITEMS.map(item => (
                <button key={item.href} onClick={() => scrollToSection(item.href)} style={{
                  background:'none', border:'none', cursor:'pointer', padding:0,
                  fontFamily:'Inter,sans-serif', fontSize:'0.82rem',
                  color:'var(--text-muted)', textAlign:'left',
                  transition:'color 0.2s ease', width:'fit-content',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  → {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h4 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.85rem', color:'var(--text-primary)', margin:'0 0 1rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              Contact
            </h4>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {[
                { icon:'📧', text: PERSONAL_INFO.email, href:`mailto:${PERSONAL_INFO.email}` },
                { icon:'📱', text: PERSONAL_INFO.phone, href:`tel:${PERSONAL_INFO.phone}` },
                { icon:'📍', text: 'Bangalore, Karnataka', href: null },
              ].map(item => (
                <div key={item.text} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ fontSize:'0.85rem' }}>{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} style={{
                      fontFamily:'Inter,sans-serif', fontSize:'0.8rem',
                      color:'var(--text-muted)', textDecoration:'none',
                      transition:'color 0.2s ease',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--text-muted)' }}>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height:'1px', background:'rgba(255,255,255,0.06)', margin:'0 0 1.5rem' }} />

        {/* Bottom row */}
        <div style={{
          display:'flex', flexWrap:'wrap', alignItems:'center',
          justifyContent:'space-between', gap:'1rem',
        }}>
          <p style={{
            fontFamily:'Inter,sans-serif', fontSize:'0.75rem',
            color:'var(--text-muted)', margin:0,
          }}>
            © {year} Priyanshu Patidar. All rights reserved.
          </p>

          {/* Social icons */}
          <div style={{ display:'flex', gap:'0.5rem' }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                title={s.label}
                style={{
                  width:'34px', height:'34px', borderRadius:'8px',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.08)',
                  color:'var(--text-muted)', textDecoration:'none',
                  transition:'all 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color='#00d4ff'; e.currentTarget.style.borderColor='rgba(0,212,255,0.35)'; e.currentTarget.style.background='rgba(0,212,255,0.08)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.transform='none' }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes green-pulse {
          0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.5);opacity:1}
          50%{box-shadow:0 0 0 5px rgba(74,222,128,0);opacity:0.75}
        }
      `}</style>
    </footer>
  )
}

function GithubIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
}
function LinkedinIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
}
function CodeIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
}
function InstagramIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
}
