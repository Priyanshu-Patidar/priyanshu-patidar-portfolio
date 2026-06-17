import { useState, useEffect, useRef, useCallback } from 'react'

interface GalleryProps {
  images: string[]  // paths like /assets/images/projects/ecommerce/ecommerce-1.webp
  alt: string
  color: string
  autoSlideMs?: number
}

export default function ScreenshotGallery({ images, alt, color, autoSlideMs = 3000 }: GalleryProps) {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})
  const [errored, setErrored] = useState<Record<number, boolean>>({})
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  // Lazy: only start loading/sliding once visible
  useEffect(() => {
    const el = containerRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const validImages = images.filter((_, i) => !errored[i])
  const hasImages = images.length > 0

  // Auto-slide
  useEffect(() => {
    if (!inView || paused || !hasImages || validImages.length <= 1) return
    const timer = setInterval(() => setIndex(i => (i + 1) % images.length), autoSlideMs)
    return () => clearInterval(timer)
  }, [inView, paused, hasImages, validImages.length, images.length, autoSlideMs])

  const goTo = useCallback((i: number) => {
    setIndex(((i % images.length) + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta > 50) prev()
    else if (delta < -50) next()
    touchStartX.current = null
  }

  // Fallback — no screenshots yet
  if (!hasImages) {
    return (
      <div style={{
        height:'280px', borderRadius:'14px', overflow:'hidden',
        background:`linear-gradient(135deg,${color}12,${color}04)`,
        border:`1px solid ${color}18`,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.6rem',
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
        </svg>
        <span style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'0.85rem', fontWeight:'600', color:'var(--text-muted)' }}>
          Project Screenshots Coming Soon
        </span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ position:'relative', borderRadius:'14px', overflow:'hidden', background:'rgba(0,0,0,0.3)', border:`1px solid ${color}18` }}
    >
      {/* Slides */}
      <div style={{ position:'relative', height:'280px' }}>
        {images.map((src, i) => (
          <div key={i} style={{
            position:'absolute', inset:0,
            opacity: i === index ? 1 : 0,
            transition:'opacity 0.5s ease',
            pointerEvents: i === index ? 'auto' : 'none',
          }}>
            {!errored[i] && inView && (
              <img
                src={src}
                alt={`${alt} screenshot ${i+1}`}
                loading="lazy"
                onLoad={() => setLoaded(l => ({ ...l, [i]: true }))}
                onError={() => setErrored(e => ({ ...e, [i]: true }))}
                style={{ width:'100%', height:'100%', objectFit:'cover', opacity: loaded[i] ? 1 : 0, transition:'opacity 0.4s ease' }}
              />
            )}
            {(!loaded[i] || errored[i]) && (
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(135deg,${color}10,transparent)` }}>
                <div style={{ width:'24px', height:'24px', border:`2px solid ${color}30`, borderTopColor:color, borderRadius:'50%', animation:'sg-spin 0.9s linear infinite' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous screenshot" style={navBtnStyle('left')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={next} aria-label="Next screenshot" style={navBtnStyle('right')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* Pagination dots */}
          <div style={{ position:'absolute', bottom:'10px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px', zIndex:2 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Go to screenshot ${i+1}`} style={{
                width: i === index ? '20px' : '6px', height:'6px', borderRadius:'999px',
                background: i === index ? color : 'rgba(255,255,255,0.35)',
                border:'none', cursor:'pointer', transition:'all 0.3s ease', padding:0,
              }} />
            ))}
          </div>
        </>
      )}

      <style>{`@keyframes sg-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function navBtnStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position:'absolute', top:'50%', [side]:'10px', transform:'translateY(-50%)',
    width:'34px', height:'34px', borderRadius:'50%',
    background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.15)',
    backdropFilter:'blur(6px)', cursor:'pointer', zIndex:2,
    display:'flex', alignItems:'center', justifyContent:'center',
    transition:'background 0.2s ease',
  }
}
