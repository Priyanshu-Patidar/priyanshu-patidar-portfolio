import { useEffect, useRef, useState } from 'react'

interface Props {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')

  useEffect(() => {
    // Phase timeline: enter (600ms) → hold (900ms) → exit (700ms)
    const t1 = setTimeout(() => setPhase('hold'), 600)
    const t2 = setTimeout(() => setPhase('exit'), 1500)
    const t3 = setTimeout(() => onComplete(), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0f1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* Particle dots in background */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            borderRadius: '50%',
            background: 'rgba(0,212,255,0.3)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particle-float ${4 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`,
          }}
        />
      ))}

      {/* Central loading widget */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Outer spinning ring */}
        <div style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          border: '1.5px solid transparent',
          borderTopColor: '#00d4ff',
          borderRightColor: 'rgba(0,212,255,0.2)',
          animation: 'loading-ring 1.4s linear infinite',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'opacity 0.4s ease 0.2s',
        }} />

        {/* Middle spinning ring (reverse) */}
        <div style={{
          position: 'absolute',
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          border: '1px solid transparent',
          borderBottomColor: 'rgba(0,212,255,0.5)',
          borderLeftColor: 'rgba(0,212,255,0.1)',
          animation: 'loading-ring 2s linear infinite reverse',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'opacity 0.4s ease 0.3s',
        }} />

        {/* Inner glow ring */}
        <div style={{
          position: 'absolute',
          width: '105px',
          height: '105px',
          borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.15)',
          boxShadow: '0 0 20px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.05)',
        }} />

        {/* Initials */}
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '3rem',
          fontWeight: '700',
          color: '#00d4ff',
          textShadow: '0 0 30px rgba(0,212,255,0.8), 0 0 60px rgba(0,212,255,0.4)',
          letterSpacing: '-0.02em',
          transform: phase === 'enter' ? 'scale(0.6)' : 'scale(1)',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          position: 'relative',
          zIndex: 1,
        }}>
          PP
        </div>
      </div>

      {/* Loading text */}
      <div style={{
        position: 'absolute',
        bottom: '40%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '100px',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          color: 'rgba(0,212,255,0.5)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          opacity: phase === 'hold' || phase === 'exit' ? 1 : 0,
          transition: 'opacity 0.5s ease 0.4s',
          whiteSpace: 'nowrap',
        }}>
          Priyanshu Patidar
        </div>
      </div>

      <style>{`
        @keyframes loading-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes particle-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
