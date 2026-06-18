import { useState, useRef, useCallback, useEffect } from 'react'
import type { ProjectArchitecture, ArchNode } from '@/data/architectureNodes'

interface Props {
  architecture: ProjectArchitecture
  color: string
}

const LAYER_LABELS: Record<string, string> = {
  frontend: 'Frontend', backend: 'Backend Service', data: 'Database Layer',
  auth: 'Authentication', external: 'External API', admin: 'Admin Module',
}

// Step 23 / Feature 1 — Interactive System Design View.
// Replaces static architecture images with a zoomable, pannable, fullscreen
// node graph. Hover a node for a quick tooltip; click for a full side panel
// with purpose, responsibilities, technologies, and data flow.
export default function InteractiveArchitectureViewer({ architecture, color }: Props) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [hovered, setHovered] = useState<ArchNode | null>(null)
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const [selected, setSelected] = useState<ArchNode | null>(null)
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

  // Initial mobile zoom
  useEffect(() => {
    if (isMobile) setZoom(0.7)
  }, [isMobile])

  const findNode = (id: string) => architecture.nodes.find(n => n.id === id)

  const Viewer = (
    <div style={{
      position:'relative', borderRadius:'12px', overflow:'hidden',
      border:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.25)',
      height: fullscreen ? '100%' : isMobile ? '300px' : '380px',
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
        {architecture.title}
      </div>

      {/* Pannable/zoomable canvas */}
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
          {/* SVG edges layer */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
            <defs>
              <marker id={`iav-arrow-${color.replace('#','')}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill={color} opacity="0.45" />
              </marker>
            </defs>
            {architecture.edges.map((edge, i) => {
              const from = findNode(edge.from)
              const to = findNode(edge.to)
              if (!from || !to) return null
              return (
                <g key={i}>
                  <line
                    x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`}
                    stroke={color} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="5,3"
                    markerEnd={`url(#iav-arrow-${color.replace('#','')})`}
                  />
                  {edge.label && (
                    <text
                      x={`${(from.x + to.x) / 2}%`} y={`${(from.y + to.y) / 2}%`}
                      textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="8" fill={color} opacity="0.7"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Node layer */}
          {architecture.nodes.map(node => (
            <div
              key={node.id}
              onClick={(e) => { e.stopPropagation(); setSelected(node) }}
              onMouseEnter={(e) => { setHovered(node); setHoverPos({ x: e.clientX, y: e.clientY }) }}
              onMouseMove={(e) => setHoverPos({ x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHovered(null)}
              style={{
                position:'absolute', left:`${node.x}%`, top:`${node.y}%`,
                transform:'translate(-50%,-50%)', cursor:'pointer',
                padding:'10px 14px', borderRadius:'10px', minWidth:'120px', textAlign:'center',
                background: selected?.id === node.id ? `${node.color}25` : 'rgba(13,21,48,0.92)',
                border:`1.5px solid ${selected?.id === node.id ? node.color : node.color + '60'}`,
                boxShadow: hovered?.id === node.id ? `0 0 16px ${node.color}50` : 'none',
                transition:'all 0.2s ease',
              }}
            >
              <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.72rem', color: node.color, marginBottom:'2px', whiteSpace:'nowrap' }}>
                {node.label}
              </div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                {node.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover tooltip — quick purpose/responsibilities/tech/dataflow preview */}
      {hovered && !dragging && (
        <div style={{
          position:'fixed', zIndex:9600,
          left: Math.min(hoverPos.x + 14, window.innerWidth - 290),
          top: Math.min(hoverPos.y + 14, window.innerHeight - 200),
          width:'270px', padding:'0.85rem 1rem', borderRadius:'10px',
          background:'rgba(8,12,26,0.97)', border:`1px solid ${hovered.color}40`,
          boxShadow:'0 10px 30px rgba(0,0,0,0.5)', pointerEvents:'none',
        }}>
          <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.82rem', color: hovered.color, marginBottom:'0.4rem' }}>
            {hovered.label}
          </div>
          <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', marginBottom:'0.3rem' }}>
            <strong>Purpose: </strong>{hovered.purpose.length > 90 ? hovered.purpose.slice(0,88)+'…' : hovered.purpose}
          </div>
          <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', marginBottom:'0.3rem' }}>
            <strong>Responsibilities: </strong>{hovered.responsibilities[0]}
          </div>
          <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', marginBottom:'0.3rem' }}>
            <strong style={{ color: hovered.color }}>Technology: </strong>{hovered.technologies.join(', ')}
          </div>
          <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', fontStyle:'italic' }}>Click for full details →</div>
        </div>
      )}

      <div style={{ position:'absolute', bottom:'8px', left:'10px', zIndex:3, fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Inter,sans-serif' }}>
        Drag to pan · Hover for quick info · Click for details
      </div>
    </div>
  )

  return (
    <div>
      {Viewer}

      {/* Click-to-open side panel */}
      {selected && (
        <div style={{ position:'fixed', inset:0, zIndex:9500, display:'flex', justifyContent:'flex-end' }}>
          <div onClick={() => setSelected(null)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }} />
          <div style={{
            position:'relative', zIndex:1, width:'min(400px, 92vw)', height:'100%', overflowY:'auto',
            background:'rgba(10,15,30,0.98)', borderLeft:`1px solid ${selected.color}30`,
            boxShadow:'-10px 0 40px rgba(0,0,0,0.5)', animation:'iav-slide 0.3s ease', padding:'1.5rem',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
              <div>
                <span style={{ fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', color: selected.color, fontWeight:'700' }}>
                  {LAYER_LABELS[selected.layer] || selected.layer}
                </span>
                <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'1.1rem', color:'var(--text-primary)', margin:'0.3rem 0 0' }}>{selected.label}</h3>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close" style={{ width:'30px', height:'30px', borderRadius:'7px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', lineHeight:1.7, color:'var(--text-secondary)', margin:'1rem 0 1.25rem' }}>
              {selected.purpose}
            </p>

            <PanelSection title="Responsibilities" color={selected.color}>
              <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                {selected.responsibilities.map((r, i) => (
                  <li key={i} style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', fontFamily:'Inter,sans-serif', fontSize:'0.78rem', lineHeight:1.55, color:'var(--text-secondary)' }}>
                    <span style={{ color: selected.color, flexShrink:0 }}>▸</span><span>{r}</span>
                  </li>
                ))}
              </ul>
            </PanelSection>

            <PanelSection title="Technologies Used" color={selected.color}>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                {selected.technologies.map(t => (
                  <span key={t} style={{ padding:'3px 9px', borderRadius:'6px', background:selected.color+'15', border:`1px solid ${selected.color}30`, fontSize:'0.72rem', fontWeight:'500', color: selected.color }}>{t}</span>
                ))}
              </div>
            </PanelSection>

            <PanelSection title="Data Flow" color={selected.color}>
              <div style={{ padding:'0.7rem 0.9rem', borderRadius:'9px', background:`${selected.color}10`, border:`1px solid ${selected.color}25`, fontFamily:'Inter,sans-serif', fontSize:'0.78rem', lineHeight:1.55, color:'var(--text-secondary)' }}>
                {selected.dataFlow}
              </div>
            </PanelSection>

            {/* Connected nodes */}
            {(() => {
              const connected = architecture.edges
                .filter(e => e.from === selected.id || e.to === selected.id)
                .map(e => e.from === selected.id ? findNode(e.to) : findNode(e.from))
                .filter(Boolean) as ArchNode[]
              return connected.length > 0 ? (
                <PanelSection title="Connected Components" color={selected.color}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                    {connected.map(n => (
                      <button key={n.id} onClick={() => setSelected(n)} style={{
                        padding:'4px 10px', borderRadius:'7px', cursor:'pointer',
                        background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
                        color:'var(--text-secondary)', fontSize:'0.72rem', fontFamily:'Space Grotesk,sans-serif',
                      }}>
                        {n.label} →
                      </button>
                    ))}
                  </div>
                </PanelSection>
              ) : null
            })()}
          </div>
        </div>
      )}

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div style={{ position:'fixed', inset:0, zIndex:9400, padding:'2rem', display:'flex', flexDirection:'column' }}>
          <div onClick={() => setFullscreen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.92)', backdropFilter:'blur(8px)' }} />
          <div style={{ position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', color:'var(--text-primary)', margin:0 }}>{architecture.title}</h3>
              <button onClick={() => setFullscreen(false)} style={{ padding:'8px 16px', borderRadius:'8px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'var(--text-secondary)', cursor:'pointer', fontSize:'0.8rem' }}>
                Exit Fullscreen (Esc)
              </button>
            </div>
            <div style={{ flex:1 }}>{Viewer}</div>
          </div>
        </div>
      )}

      <style>{`@keyframes iav-slide{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
  )
}

function PanelSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:'1.25rem' }}>
      <div style={{ fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:'0.6rem', fontWeight:'600' }}>{title}</div>
      {children}
    </div>
  )
}

function ToolBtn({ onClick, label, children }: { onClick:()=>void; label:string; children:React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} style={{
      minWidth:'30px', height:'30px', padding:'0 8px', borderRadius:'7px',
      background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.12)',
      color:'var(--text-secondary)', cursor:'pointer', fontSize:'0.75rem', fontWeight:'700',
      fontFamily:'Space Grotesk,sans-serif', display:'flex', alignItems:'center', justifyContent:'center',
      transition:'all 0.2s ease',
    }}
      onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,212,255,0.15)';e.currentTarget.style.color='#00d4ff'}}
      onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,0,0,0.5)';e.currentTarget.style.color='var(--text-secondary)'}}
    >
      {children}
    </button>
  )
}
