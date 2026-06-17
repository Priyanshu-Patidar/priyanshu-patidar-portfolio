import { useRef, useState, useEffect } from 'react'
import { certifications } from '@/data/experience'

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// SVG Certificate placeholder — inline, no external dep
function CertPlaceholder({ title, issuer, color }: { title: string; issuer: string; color: string }) {
  return (
    <svg width="100%" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ display:'block' }}>
      <defs>
        <linearGradient id={`cg-${issuer}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a0f1e"/>
          <stop offset="100%" stopColor="#0d1530"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#cg-${issuer})`} rx="10"/>
      <rect x="0" y="0" width="320" height="200" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.3" rx="10"/>
      <rect x="8" y="8" width="304" height="184" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.15" rx="8"/>
      {/* Corner accents */}
      <path d="M8 30 L8 8 L30 8" stroke={color} strokeWidth="2" fill="none" strokeOpacity="0.6"/>
      <path d="M290 8 L312 8 L312 30" stroke={color} strokeWidth="2" fill="none" strokeOpacity="0.6"/>
      <path d="M8 170 L8 192 L30 192" stroke={color} strokeWidth="2" fill="none" strokeOpacity="0.6"/>
      <path d="M290 192 L312 192 L312 170" stroke={color} strokeWidth="2" fill="none" strokeOpacity="0.6"/>
      {/* Seal circle */}
      <circle cx="160" cy="72" r="30" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <circle cx="160" cy="72" r="23" fill={color} fillOpacity="0.12"/>
      <text x="160" y="79" textAnchor="middle" fontSize="20" fill={color} opacity="0.9">🏅</text>
      {/* Title */}
      <text x="160" y="120" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="11" fontWeight="700" fill="white" opacity="0.9">{title.length > 36 ? title.slice(0,34)+'…' : title}</text>
      {/* Issuer */}
      <text x="160" y="142" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="9" fill={color} opacity="0.8">{issuer}</text>
      {/* Footer bar */}
      <rect x="40" y="162" width="240" height="1.5" rx="1" fill={color} fillOpacity="0.25"/>
      <text x="160" y="178" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8" fill="white" opacity="0.35">PROFESSIONAL CERTIFICATE</text>
    </svg>
  )
}

export default function Certifications() {
  const { ref: sectionRef, visible } = useReveal(0.05)
  const [previewCert, setPreviewCert] = useState<typeof certifications[0] | null>(null)

  return (
    <>
      <section id="certifications" ref={sectionRef} style={{ padding:'6rem 1.5rem', background:'var(--bg-secondary)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'20%', right:'-5%', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle,rgba(15,98,254,0.05) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ marginBottom:'3.5rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(30px)', transition:'all 0.7s ease' }}>
            <div style={{ fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00d4ff', marginBottom:'0.75rem' }}>06 / Certifications</div>
            <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'clamp(2rem,4vw,3rem)', color:'var(--text-primary)', margin:0 }}>Credentials & Certificates</h2>
            <div style={{ width:'50px', height:'3px', background:'linear-gradient(90deg,#00d4ff,transparent)', borderRadius:'2px', marginTop:'12px' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.5rem', marginBottom:'2.5rem' }}>
            {certifications.map((cert, i) => <CertCard key={cert.id} cert={cert} index={i} visible={visible} onPreview={() => setPreviewCert(cert)} />)}
          </div>
          <IBMBadgeStrip visible={visible} />
        </div>
      </section>

      {/* Certificate preview modal */}
      {previewCert && (
        <CertPreviewModal cert={previewCert} onClose={() => setPreviewCert(null)} />
      )}
    </>
  )
}

function CertCard({ cert, index, visible, onPreview }: { cert:typeof certifications[0]; index:number; visible:boolean; onPreview:()=>void }) {
  const [hovered, setHovered] = useState(false)
  const rgb = hexToRgb(cert.color)

  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{
        position:'relative', borderRadius:'20px', overflow:'hidden',
        background:hovered?`rgba(${rgb},0.07)`:'rgba(255,255,255,0.03)',
        border:`1px solid ${hovered?cert.color+'45':'rgba(255,255,255,0.07)'}`,
        backdropFilter:'blur(16px)',
        transition:'all 0.4s cubic-bezier(0.34,1.2,0.64,1)',
        transform:visible?(hovered?'translateY(-8px) scale(1.02)':'translateY(0) scale(1)'):'translateY(40px) scale(0.95)',
        opacity:visible?1:0, transitionDelay:`${0.1+index*0.15}s`,
        boxShadow:hovered?`0 20px 60px rgba(0,0,0,0.35),0 0 35px rgba(${rgb},0.2)`:'0 4px 20px rgba(0,0,0,0.15)',
        cursor:'default',
      }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,transparent,${cert.color},transparent)`, opacity:hovered?1:0, transition:'opacity 0.35s ease' }} />

      {/* Cert thumbnail */}
      <div style={{ margin:'1.25rem 1.25rem 0', borderRadius:'12px', overflow:'hidden', cursor:'pointer' }} onClick={onPreview}>
        <CertPlaceholder title={cert.title} issuer={cert.issuer} color={cert.color} />
        {/* View overlay */}
        <div style={{
          position:'absolute', inset:0, top:'1.25rem', left:'1.25rem', right:'1.25rem', borderRadius:'12px',
          background:'rgba(0,0,0,0.5)', backdropFilter:'blur(3px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          opacity:hovered?1:0, transition:'opacity 0.3s ease',
          cursor:'pointer',
        }}>
          <span style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'0.8rem', fontWeight:'600', color:'white', padding:'6px 14px', borderRadius:'8px', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)' }}>
            👁 View Certificate
          </span>
        </div>
      </div>

      <div style={{ padding:'1.1rem 1.25rem 1.5rem' }}>
        {/* Verified badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'2px 8px', borderRadius:'6px', background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.25)', fontSize:'0.62rem', fontWeight:'600', color:'#4ade80', marginBottom:'0.6rem' }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Verified
        </div>

        <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.95rem', color:'var(--text-primary)', margin:'0 0 0.5rem', lineHeight:1.3 }}>{cert.title}</h3>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:cert.color, boxShadow:`0 0 6px ${cert.color}80` }} />
            <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.8rem', color:cert.color }}>{cert.issuer}</span>
          </div>
          {cert.year && <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.7rem', color:'var(--text-muted)', padding:'2px 7px', borderRadius:'5px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>{cert.year}</span>}
        </div>
      </div>
    </div>
  )
}

function CertPreviewModal({ cert, onClose }: { cert:typeof certifications[0]; onClose:()=>void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key==='Escape') onClose() }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow='' }
  }, [onClose])
  return (
    <div style={{ position:'fixed', inset:0, zIndex:6000, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(10px)' }} />
      <div style={{ position:'relative', zIndex:1, maxWidth:'520px', width:'100%', animation:'mup 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div style={{ borderRadius:'16px', overflow:'hidden', border:`1px solid ${cert.color}35`, boxShadow:`0 0 50px rgba(0,0,0,0.6), 0 0 25px ${cert.color}20` }}>
          <CertPlaceholder title={cert.title} issuer={cert.issuer} color={cert.color}/>
        </div>
        <div style={{ textAlign:'center', marginTop:'1rem' }}>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', color:'var(--text-muted)' }}>
            Replace <code style={{ color:cert.color }}>/assets/certificates/{cert.issuer.toLowerCase().replace(/\s/g,'-')}.jpg</code> with actual certificate
          </p>
          <button onClick={onClose} style={{ marginTop:'0.5rem', padding:'6px 18px', borderRadius:'8px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'var(--text-muted)', cursor:'pointer', fontSize:'0.8rem' }}>Close</button>
        </div>
      </div>
      <style>{`@keyframes mup{from{opacity:0;transform:translateY(20px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  )
}

function IBMBadgeStrip({ visible }: { visible: boolean }) {
  const items = [
    { icon:'🧠', text:'2 IBM Professional Certificates' },
    { icon:'📈', text:'Data Science & Machine Learning' },
    { icon:'🛠️', text:'Hands-on Project Experience' },
    { icon:'🌐', text:'Globally Recognized Credentials' },
  ]
  return (
    <div style={{ padding:'1.5rem 2rem', borderRadius:'18px', background:'rgba(15,98,254,0.05)', border:'1px solid rgba(15,98,254,0.15)', display:'flex', flexWrap:'wrap', gap:'1.25rem', justifyContent:'space-around', alignItems:'center', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(20px)', transition:'all 0.7s ease 0.55s' }}>
      {items.map((h,i) => (
        <div key={h.text} style={{ display:'flex', alignItems:'center', gap:'8px', opacity:visible?1:0, transition:`opacity 0.5s ease ${0.6+i*0.08}s` }}>
          <span style={{ fontSize:'1.1rem' }}>{h.icon}</span>
          <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', fontWeight:'500', color:'var(--text-secondary)' }}>{h.text}</span>
        </div>
      ))}
    </div>
  )
}

function hexToRgb(hex: string) {
  const c = hex.replace('#','')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
