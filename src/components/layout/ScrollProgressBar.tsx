import { useScrollProgress } from '@/hooks'

export default function ScrollProgressBar() {
  const progress = useScrollProgress()

  return (
    <div
      id="scroll-progress"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #00d4ff, #4fc3f7, #00d4ff)',
        backgroundSize: '200% 100%',
        zIndex: 1001,
        boxShadow: '0 0 10px rgba(0,212,255,0.7), 0 0 20px rgba(0,212,255,0.3)',
        transition: 'width 0.08s linear',
        borderRadius: '0 2px 2px 0',
      }}
    />
  )
}
