// Premium recruiter-facing badges — lightweight inline SVG/CSS

interface BadgeProps { size?: 'sm' | 'md' }

const sizeMap = { sm: { pad: '4px 10px', font: '0.68rem', dot: '6px' }, md: { pad: '6px 14px', font: '0.75rem', dot: '8px' } }

export function OpenToWorkBadge({ size = 'md' }: BadgeProps) {
  const s = sizeMap[size]
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:s.pad, borderRadius:'999px', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', fontSize:s.font, fontWeight:'600', color:'#4ade80', fontFamily:'Space Grotesk,sans-serif' }}>
      <span style={{ width:s.dot, height:s.dot, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px rgba(74,222,128,0.7)', animation:'rb-pulse 2s ease-in-out infinite', display:'inline-block' }} />
      Open to Work
    </span>
  )
}

export function OpenToRelocationBadge({ size = 'md' }: BadgeProps) {
  const s = sizeMap[size]
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:s.pad, borderRadius:'999px', background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.25)', fontSize:s.font, fontWeight:'600', color:'#00d4ff', fontFamily:'Space Grotesk,sans-serif' }}>
      🌍 Open to Relocation
    </span>
  )
}

export function AvailableNowBadge({ size = 'md' }: BadgeProps) {
  const s = sizeMap[size]
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:s.pad, borderRadius:'999px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)', fontSize:s.font, fontWeight:'600', color:'#f59e0b', fontFamily:'Space Grotesk,sans-serif' }}>
      ⚡ Available Now
    </span>
  )
}

export function JavaFullStackBadge({ size = 'md' }: BadgeProps) {
  const s = sizeMap[size]
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:s.pad, borderRadius:'999px', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', fontSize:s.font, fontWeight:'600', color:'#8b5cf6', fontFamily:'Space Grotesk,sans-serif' }}>
      ☕ Java Full Stack Developer
    </span>
  )
}

export function ProblemSolverBadge({ size = 'md' }: BadgeProps) {
  const s = sizeMap[size]
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:s.pad, borderRadius:'999px', background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.25)', fontSize:s.font, fontWeight:'600', color:'#ec4899', fontFamily:'Space Grotesk,sans-serif' }}>
      🧩 Problem Solver
    </span>
  )
}

export function EnterpriseBuilderBadge({ size = 'md' }: BadgeProps) {
  const s = sizeMap[size]
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:s.pad, borderRadius:'999px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', fontSize:s.font, fontWeight:'600', color:'#10b981', fontFamily:'Space Grotesk,sans-serif' }}>
      🏢 Enterprise Application Builder
    </span>
  )
}

export function TopProjectBadge({ size = 'sm' }: BadgeProps) {
  const s = sizeMap[size]
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:s.pad, borderRadius:'999px', background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', fontSize:s.font, fontWeight:'700', color:'#8b5cf6', fontFamily:'Space Grotesk,sans-serif' }}>
      ⭐ Top Project
    </span>
  )
}

// Inject keyframe once
if (typeof document !== 'undefined' && !document.getElementById('rb-keyframes')) {
  const style = document.createElement('style')
  style.id = 'rb-keyframes'
  style.textContent = `@keyframes rb-pulse{0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.5);opacity:1}50%{box-shadow:0 0 0 5px rgba(74,222,128,0);opacity:0.75}}`
  document.head.appendChild(style)
}
