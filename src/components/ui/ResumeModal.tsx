import { useEffect } from 'react'
import { PERSONAL_INFO } from '@/data/constants'
import { useResumeDownloadCount } from '@/hooks'

interface Props { onClose: () => void }

export default function ResumeModal({ onClose }: Props) {
  const { count, increment } = useResumeDownloadCount()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  const handleDownload = () => { increment() }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', animation:'fade-in-modal 0.3s ease both' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)' }} />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'900px', height:'90vh', background:'rgba(10,15,30,0.97)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:'20px', overflow:'hidden', boxShadow:'0 0 60px rgba(0,212,255,0.15), 0 40px 80px rgba(0,0,0,0.6)', display:'flex', flexDirection:'column', animation:'slide-up-modal 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
          <div>
            <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'1rem', color:'var(--text-primary)', margin:0 }}>Priyanshu Patidar — Resume</h3>
            <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', margin:'2px 0 0' }}>Java Full Stack Developer</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            {/* Download counter */}
            <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'8px', background:'rgba(0,212,255,0.06)', border:'1px solid rgba(0,212,255,0.15)' }}>
              <span style={{ fontSize:'0.75rem' }}>📄</span>
              <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.78rem', color:'#00d4ff' }}>Resume Downloads: {count.toLocaleString()}</span>
            </div>
            {/* Download button */}
            <a href={PERSONAL_INFO.resumePDF} download="Priyanshu_Patidar_Resume.pdf" onClick={handleDownload}
              style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'0.5rem 1rem', borderRadius:'8px', background:'linear-gradient(135deg,#00d4ff,#0099cc)', color:'#0a0f1e', textDecoration:'none', fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'0.8rem', transition:'all 0.2s ease', boxShadow:'0 0 15px rgba(0,212,255,0.3)', whiteSpace:'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 0 25px rgba(0,212,255,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 0 15px rgba(0,212,255,0.3)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </a>
            {/* Close */}
            <button onClick={onClose} style={{ width:'36px', height:'36px', borderRadius:'8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.borderColor='rgba(248,113,113,0.3)'; e.currentTarget.style.background='rgba(248,113,113,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* PDF iframe */}
        <div style={{ flex:1, position:'relative' }}>
          <iframe src={PERSONAL_INFO.resumePDF} style={{ width:'100%', height:'100%', border:'none' }} title="Priyanshu Patidar Resume" />
          {/* Fallback */}
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', zIndex:-1, background:'rgba(10,15,30,0.5)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', textAlign:'center' }}>
              Place <code style={{ color:'#00d4ff' }}>Priyanshu_Resume.pdf</code> in <code style={{ color:'#00d4ff' }}>public/assets/</code>
            </p>
            <a href={PERSONAL_INFO.resumePDF} download onClick={handleDownload} style={{ padding:'0.5rem 1.2rem', borderRadius:'8px', background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.3)', color:'#00d4ff', textDecoration:'none', fontSize:'0.8rem' }}>
              Try Download Instead
            </a>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-modal{from{opacity:0}to{opacity:1}}
        @keyframes slide-up-modal{from{opacity:0;transform:translateY(40px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>
    </div>
  )
}
