import { useEffect } from 'react'
import { PERSONAL_INFO } from '@/data/constants'
import { useResumeDownloadCount } from '@/hooks'

interface Props {
  onClose: () => void
}

export default function ResumeModal({ onClose }: Props) {
  const { count } = useResumeDownloadCount()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  const handleDownload = () => {
    // Analytics tracked via individual component if needed, 
    // but the link itself will trigger the browser download.
  }

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      display:'flex', alignItems:'center', justifyContent:'center',
      padding: isMobile ? '0' : '2rem',
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        style={{ 
          position:'absolute', inset:0, 
          background:'rgba(0,0,0,0.9)', backdropFilter:'blur(8px)',
          animation:'fade-in-modal 0.3s ease' 
        }} 
      />

      {/* Modal Container */}
      <div style={{ 
        position:'relative', zIndex:1, 
        width:'100%', maxWidth:'1000px', 
        height: isMobile ? '100%' : '92vh',
        background:'rgba(10,15,30,0.98)', 
        border: isMobile ? 'none' : '1px solid rgba(0,212,255,0.25)', 
        borderRadius: isMobile ? '0' : '24px', 
        overflow:'hidden', 
        boxShadow:'0 0 80px rgba(0,212,255,0.1), 0 40px 100px rgba(0,0,0,0.8)', 
        display:'flex', flexDirection:'column', 
        animation: isMobile ? 'slide-up-mobile 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'slide-up-modal 0.4s cubic-bezier(0.34,1.56,0.64,1) both' 
      }}>

        {/* Header */}
        <div style={{ 
          display:'flex', alignItems:'center', justifyContent:'space-between', 
          padding:'1.25rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.08)', 
          flexShrink:0, background:'rgba(15,20,40,0.5)' 
        }}>
          <div>
            <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize: isMobile ? '0.95rem' : '1.1rem', color:'var(--text-primary)', margin:0 }}>
              Priyanshu Patidar — Resume
            </h3>
            {!isMobile && <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', margin:'3px 0 0' }}>Java Full Stack Developer + AI Systems</p>}
          </div>
          
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            {/* Download button */}
            <a 
              href={PERSONAL_INFO.resumePDF} 
              download="Priyanshu_Patidar_Resume.pdf" 
              onClick={handleDownload}
              style={{ 
                display:'inline-flex', alignItems:'center', gap:'8px', 
                padding: isMobile ? '0.5rem 0.9rem' : '0.6rem 1.2rem', 
                borderRadius:'10px', background:'linear-gradient(135deg,#00d4ff,#0099cc)', 
                color:'#0a0f1e', textDecoration:'none', fontFamily:'Space Grotesk,sans-serif', 
                fontWeight:'700', fontSize:'0.8rem', transition:'all 0.25s ease', 
                boxShadow:'0 0 15px rgba(0,212,255,0.3)', whiteSpace:'nowrap' 
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 0 25px rgba(0,212,255,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 0 15px rgba(0,212,255,0.3)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {isMobile ? 'Save' : 'Download PDF'}
            </a>
            
            {/* Close */}
            <button 
              onClick={onClose} 
              style={{ 
                width:'38px', height:'38px', borderRadius:'10px', 
                background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', 
                color:'var(--text-muted)', cursor:'pointer', 
                display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s ease' 
              }}
              onMouseEnter={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.borderColor='rgba(248,113,113,0.4)'; e.currentTarget.style.background='rgba(248,113,113,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; e.currentTarget.style.background='rgba(255,255,255,0.06)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* PDF Viewport */}
        <div style={{ flex:1, position:'relative', background: '#323639' }}>
          <object
            data={PERSONAL_INFO.resumePDF + '#toolbar=0&navpanes=0&scrollbar=1'}
            type="application/pdf"
            style={{ width:'100%', height:'100%', display:'block' }}
          >
            <div style={{ 
              position:'absolute', inset:0, display:'flex', flexDirection:'column', 
              alignItems:'center', justifyContent:'center', gap:'1.5rem', 
              padding:'2rem', textAlign:'center', background:'rgba(10,15,30,1)' 
            }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <p style={{ color:'var(--text-primary)', fontSize:'1rem', fontWeight:'600', marginBottom:'0.5rem' }}>PDF Preview Unavailable</p>
                <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', maxWidth:'300px' }}>Your browser doesn't support viewing PDFs directly. You can download the file to view it.</p>
              </div>
              <a href={PERSONAL_INFO.resumePDF} download style={{ padding:'0.7rem 1.5rem', borderRadius:'10px', background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.3)', color:'#00d4ff', textDecoration:'none', fontSize:'0.85rem', fontWeight:'600' }}>
                Download Resume PDF
              </a>
            </div>
          </object>
        </div>

        {/* Mobile Download Notice */}
        {isMobile && (
          <div style={{ padding:'1rem', textAlign:'center', background:'rgba(0,212,255,0.05)', borderTop:'1px solid rgba(0,212,255,0.1)', fontSize:'0.7rem', color:'var(--text-muted)' }}>
            Tip: For best quality, use the download button to save the original PDF.
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in-modal{from{opacity:0}to{opacity:1}}
        @keyframes slide-up-modal{from{opacity:0;transform:translateY(40px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes slide-up-mobile{from{transform:translateY(100%)}to{transform:translateY(0)}}
      `}</style>
    </div>
  )
}
