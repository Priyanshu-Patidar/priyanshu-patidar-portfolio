import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ringEl = ringRef.current
    if (!dot || !ringEl) return

    // Show cursor elements
    dot.style.display = 'block'
    ringEl.style.display = 'block'

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      // Dot follows instantly
      dot.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`
    }

    const onMouseDown = () => {
      dot.style.transform += ' scale(0.7)'
      ringEl.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px) scale(1.4)`
    }

    const onMouseUp = () => {
      ringEl.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px) scale(1)`
    }

    const onMouseEnterLink = () => {
      ringEl.style.width = '52px'
      ringEl.style.height = '52px'
      ringEl.style.borderColor = 'rgba(0,212,255,0.7)'
      dot.style.opacity = '0'
    }

    const onMouseLeaveLink = () => {
      ringEl.style.width = '36px'
      ringEl.style.height = '36px'
      ringEl.style.borderColor = 'rgba(0,212,255,0.4)'
      dot.style.opacity = '1'
    }

    // Smooth ring follow with lerp
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12
      ringEl.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    // Track interactive elements
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label').forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterLink)
        el.addEventListener('mouseleave', onMouseLeaveLink)
      })
    }

    // Initial + observe DOM changes
    addHoverListeners()
    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#00d4ff',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 8px #00d4ff, 0 0 16px rgba(0,212,255,0.5)',
          transition: 'opacity 0.2s ease, width 0.2s ease, height 0.2s ease',
          willChange: 'transform',
        }}
      />
      {/* Ring (trail) */}
      <div
        ref={ringRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1.5px solid rgba(0,212,255,0.4)',
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease',
          willChange: 'transform',
        }}
      />
    </>
  )
}
