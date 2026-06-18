import { useState, useRef, useCallback, useEffect } from 'react'
import type { DatabaseSchema, SchemaEntity } from '@/data/databaseSchemas'

interface Props {
  schema: DatabaseSchema
  color: string
}

const REL_BADGE: Record<string, string> = {
  '1:1': '1:1', '1:N': '1:N', 'N:M': 'N:M'
}

export default function DatabaseSchemaViewer({ schema, color }: Props) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<SchemaEntity | null>(null)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    dragStart.current = { x: clientX, y: clientY, panX: pan.x, panY: pan.y }
  }

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
    setPan({
      x: dragStart.current.panX + (clientX - dragStart.current.x),
      y: dragStart.current.panY + (clientY - dragStart.current.y),
    })
  }, [dragging])

  const handleMouseUp = useCallback(() => setDragging(false), [])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleMouseMove, { passive: false })
      window.addEventListener('touchend', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('touchmove', handleMouseMove)
        window.removeEventListener('touchend', handleMouseUp)
      }
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selected) setSelected(null)
        else if (fullscreen) setFullscreen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, fullscreen])

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2.5))
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4))
  const resetView = () => { setZoom(isMobile ? 0.7 : 1); setPan({ x: 0, y: 0 }) }

  useEffect(() => {
    if (isMobile) setZoom(0.7)
  }, [isMobile])

  const Viewer = (
    <div style={{
      position:'relative', borderRadius:'12px', overflow:'hidden',
      border:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.25)',
      height: fullscreen ? '100%' : isMobile ? '300px' : '360px',
      touchAction: 'none'
    }}>
      {/* Toolbar */}
      <div style={{ position:'absolute', top:'10px', right:'10px', zIndex:3, display:'flex', gap:'6px' }}>
        {!isMobile && <ToolBtn onClick={zoomOut} label="Zoom out">−</ToolBtn>}
        <ToolBtn onClick={resetView} label="Reset view">{Math.round(zoom * 100)}%</ToolBtn>
        {!isMobile && <ToolBtn onClick={zoomIn} label="Zoom in">+</ToolBtn>}
        <ToolBtn onClick={() => setFullscreen(f => !f)} label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
          {fullscreen ? '⤓' : '⤢'}
        </ToolBtn>
      </div>

      <div style={{ position:'absolute', top:'10px', left:'10px', zIndex:3, padding:'4px 10px', borderRadius:'7px', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.1)', fontSize:'0.68rem', color:'var(--text-secondary)', fontFamily:'Space Grotesk,sans-serif', fontWeight:'600' }}>
        {schema.title}
      </div>

      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ width:'100%', height:'100%', cursor: dragging ? 'grabbing' : 'grab', overflow:'hidden', position:'relative' }}
      >
        <div style={{
          position:'absolute', inset:0,
          transform:`translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin:'center', transition: dragging ? 'none' : 'transform 0.2s ease',
        }}>
          {/* SVG layer for relationship lines */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'visible' }}>
            {schema.relationships.map((rel, i) => {
              const from = schema.entities.find(e => e.name === rel.from)
              const to = schema.entities.find(e => e.name === rel.to)
              if (!from || !to) return null
              const isHovered = hovered === rel.from || hovered === rel.to
              
              // Simplified path calculation
              const fromX = from.x + 85
              const fromY = from.y + 20
              const toX = to.x + 85
              const toY = to.y + 20
              
              const dx = toX - fromX
              const dy = toY - fromY
              const cx1 = fromX + dx * 0.5
              const cy1 = fromY
              const cx2 = toX - dx * 0.5
              const cy2 = toY
              const path = `M ${fromX} ${fromY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toX} ${toY}`

              return (
                <g key={i} style={{ opacity: hovered ? (isHovered ? 1 : 0.15) : 0.6, transition:'opacity 0.3s ease' }}>
                  <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray={rel.type === '1:N' ? '4 4' : 'none'} />
                  {/* Badge */}
                  <g transform={`translate(${fromX + dx*0.5}, ${fromY + dy*0.5})`}>
                    <rect x="-12" y="-8" width="24" height="16" rx="4" fill="rgba(10,15,30,0.8)" stroke={color} strokeWidth="1" />
                    <text x="0" y="3" textAnchor="middle" fill={color} fontSize="8" fontFamily="JetBrains Mono,monospace" fontWeight="600">{REL_BADGE[rel.type]}</text>
                  </g>
                </g>
              )
            })}
          </svg>

          {/* Tables */}
          {schema.entities.map(entity => {
            const isHovered = hovered === entity.name
            const isDimmed = hovered && !isHovered
            const rgb = hexToRgb(color)

            return (
              <div key={entity.name}
                onMouseEnter={() => setHovered(entity.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => { e.stopPropagation(); setSelected(entity) }}
                style={{
                  position:'absolute', top:`${entity.y}%`, left:`${entity.x}%`,
                  width:'170px', transform:'translate(-50%, -50%)',
                  background:'rgba(10,15,30,0.85)', backdropFilter:'blur(4px)',
                  border:`1px solid ${isHovered ? color : 'rgba(255,255,255,0.1)'}`,
                  borderRadius:'8px', overflow:'hidden',
                  boxShadow: isHovered ? `0 0 20px rgba(${rgb},0.2)` : '0 4px 12px rgba(0,0,0,0.3)',
                  opacity: isDimmed ? 0.3 : 1, transition:'all 0.3s ease', cursor:'pointer',
                }}>
                <div style={{ background:isHovered ? `rgba(${rgb},0.15)` : 'rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.1)', padding:'6px 10px', display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ fontSize:'0.8rem' }}>{entity.icon}</span>
                  <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.75rem', color:isHovered?color:'var(--text-primary)' }}>{entity.name}</span>
                </div>
                <div style={{ padding:'6px 0' }}>
                  {entity.fields.slice(0,4).map((f, i) => (
                    <div key={i} style={{ padding:'3px 10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.65rem', color:f.isPk?'#f59e0b':'var(--text-secondary)', fontWeight:f.isPk?'600':'400', display:'flex', alignItems:'center', gap:'4px' }}>
                        {f.isPk && <span style={{fontSize:'0.5rem'}}>🔑</span>}
                        {f.name}
                      </span>
                      <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.6rem', color:'var(--text-muted)' }}>{f.type}</span>
                    </div>
                  ))}
                  {entity.fields.length > 4 && (
                    <div style={{ padding:'3px 10px', fontSize:'0.65rem', color:'var(--text-muted)', fontStyle:'italic' }}>+{entity.fields.length - 4} more...</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {Viewer}

      {/* Side panel */}
      {selected && (
        <div style={{ position:'fixed', inset:0, zIndex:9500, display:'flex', justifyContent:'flex-end' }}>
          <div onClick={() => setSelected(null)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }} />
          <div style={{
            position:'relative', zIndex:1, width:'min(400px, 92vw)', height:'100%', overflowY:'auto',
            background:'rgba(10,15,30,0.98)', borderLeft:`1px solid ${color}30`,
            boxShadow:'-10px 0 40px rgba(0,0,0,0.5)', animation:'iav-slide 0.3s ease', padding:'1.5rem',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
              <div>
                <span style={{ fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', color, fontWeight:'700' }}>Table Details</span>
                <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'1.2rem', color:'var(--text-primary)', margin:'0.3rem 0 0', display:'flex', alignItems:'center', gap:'8px' }}>
                  {selected.icon} {selected.name}
                </h3>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close" style={{ width:'30px', height:'30px', borderRadius:'7px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', lineHeight:1.7, color:'var(--text-secondary)', margin:'0 0 1.5rem' }}>{selected.description}</p>

            <div style={{ fontSize:'0.7rem', fontWeight:'700', color, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.75rem', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'0.5rem' }}>
              Schema Definition
            </div>
            
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {selected.fields.map((f, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.6rem 0.8rem', background:'rgba(255,255,255,0.02)', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    {f.isPk ? <span style={{fontSize:'0.7rem'}} title="Primary Key">🔑</span> : f.isFk ? <span style={{fontSize:'0.7rem'}} title="Foreign Key">🔗</span> : <span style={{width:'0.7rem'}}/>}
                    <span style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'0.8rem', fontWeight:'600', color: f.isPk ? '#f59e0b' : 'var(--text-primary)' }}>{f.name}</span>
                  </div>
                  <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.7rem', color:'var(--text-muted)', background:'rgba(0,0,0,0.3)', padding:'2px 6px', borderRadius:'4px' }}>{f.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes iav-slide{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
  )
}

function ToolBtn({ onClick, children, label }: { onClick:()=>void; children:React.ReactNode; label:string }) {
  return (
    <button onClick={onClick} title={label} style={{
      padding:'4px 8px', borderRadius:'6px', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)',
      border:'1px solid rgba(255,255,255,0.1)', color:'var(--text-primary)', fontFamily:'Space Grotesk,sans-serif',
      fontSize:'0.75rem', fontWeight:'600', cursor:'pointer', transition:'all 0.2s ease',
    }}
    onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)'}}
    onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,0,0,0.5)'}}
    >
      {children}
    </button>
  )
}

function hexToRgb(hex: string) {
  const c = hex.replace('#','')
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`
}
