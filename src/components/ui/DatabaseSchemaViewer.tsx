import { useState, useRef, useCallback, useEffect } from 'react'
import type { DatabaseSchema, SchemaEntity } from '@/data/databaseSchemas'

interface Props {
  schema: DatabaseSchema
  color: string
}

const REL_BADGE: Record<string, string> = {
  'one-to-one': '1 — 1',
  'one-to-many': '1 — N',
  'many-to-many': 'N — N',
}

// Step 23 / Feature 3 — Database Schema / ER Viewer.
// Renders entity tables as SVG nodes with zoom, pan, and fullscreen.
// Clicking an entity opens a side panel with full field/key/relationship details.
export default function DatabaseSchemaViewer({ schema, color }: Props) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [selected, setSelected] = useState<SchemaEntity | null>(null)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-layout entities in a row (wraps based on count)
  const entityWidth = 220
  const entityGap = 60
  const positions = schema.entities.map((_, i) => ({
    x: 20 + i * (entityWidth + entityGap),
    y: 20,
  }))
  const svgWidth = Math.max(20 + schema.entities.length * (entityWidth + entityGap), 600)
  const svgHeight = 320

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
  }
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    })
  }, [dragging])
  const handleMouseUp = useCallback(() => setDragging(false), [])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp) }
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  // Esc closes fullscreen / detail panel
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
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const findEntityCenter = (name: string) => {
    const idx = schema.entities.findIndex(e => e.name === name)
    if (idx === -1) return { x: 0, y: 0 }
    return { x: positions[idx].x + entityWidth / 2, y: positions[idx].y + 30 }
  }

  const Viewer = (
    <div ref={containerRef} style={{
      position:'relative', borderRadius:'12px', overflow:'hidden',
      border:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.25)',
      height: fullscreen ? '100%' : '360px',
    }}>
      {/* Toolbar */}
      <div style={{ position:'absolute', top:'10px', right:'10px', zIndex:3, display:'flex', gap:'6px' }}>
        <ToolBtn onClick={zoomOut} label="Zoom out">−</ToolBtn>
        <ToolBtn onClick={resetView} label="Reset view">{Math.round(zoom * 100)}%</ToolBtn>
        <ToolBtn onClick={zoomIn} label="Zoom in">+</ToolBtn>
        <ToolBtn onClick={() => setFullscreen(f => !f)} label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
          {fullscreen ? '⤓' : '⤢'}
        </ToolBtn>
      </div>

      {/* DB type badge */}
      <div style={{ position:'absolute', top:'10px', left:'10px', zIndex:3, padding:'4px 10px', borderRadius:'7px', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.1)', fontSize:'0.68rem', color:'var(--text-secondary)', fontFamily:'JetBrains Mono,monospace' }}>
        {schema.dbType}
      </div>

      {/* Pannable/zoomable canvas */}
      <div
        onMouseDown={handleMouseDown}
        style={{ width:'100%', height:'100%', cursor: dragging ? 'grabbing' : 'grab', overflow:'hidden' }}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%" height="100%"
          style={{ transform:`translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin:'center', transition: dragging ? 'none' : 'transform 0.2s ease' }}
        >
          <defs>
            <marker id={`er-arrow-${color.replace('#','')}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={color} opacity="0.5" />
            </marker>
          </defs>

          {/* Relationship lines */}
          {schema.relationships.map((rel, i) => {
            const from = findEntityCenter(rel.from)
            const to = findEntityCenter(rel.to)
            const midX = (from.x + to.x) / 2
            const midY = (from.y + to.y) / 2 - 15
            return (
              <g key={i}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="5,3" markerEnd={`url(#er-arrow-${color.replace('#','')})`} />
                <rect x={midX - 24} y={midY - 9} width="48" height="18" rx="4" fill="rgba(8,12,26,0.9)" stroke={color} strokeOpacity="0.3" />
                <text x={midX} y={midY + 4} textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="9" fill={color}>{REL_BADGE[rel.type]}</text>
              </g>
            )
          })}

          {/* Entity tables */}
          {schema.entities.map((entity, i) => {
            const pos = positions[i]
            const isSelected = selected?.name === entity.name
            const rowHeight = 20
            const headerHeight = 28
            const visibleFields = entity.fields.slice(0, 5)
            const moreCount = entity.fields.length - visibleFields.length
            const tableHeight = headerHeight + visibleFields.length * rowHeight + (moreCount > 0 ? rowHeight : 0) + 8

            return (
              <g key={entity.name} style={{ cursor:'pointer' }} onClick={(e) => { e.stopPropagation(); setSelected(entity) }}>
                <rect x={pos.x} y={pos.y} width={entityWidth} height={tableHeight} rx="8"
                  fill="rgba(13,21,48,0.92)" stroke={isSelected ? color : `${color}50`} strokeWidth={isSelected ? 2 : 1.2} />
                {/* Header */}
                <rect x={pos.x} y={pos.y} width={entityWidth} height={headerHeight} rx="8" fill={color} opacity="0.18" />
                <text x={pos.x + entityWidth/2} y={pos.y + 19} textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="12" fontWeight="700" fill={color}>{entity.name}</text>
                {/* Fields */}
                {visibleFields.map((f, fi) => (
                  <g key={f.name}>
                    <text x={pos.x + 12} y={pos.y + headerHeight + fi * rowHeight + 14} fontFamily="JetBrains Mono,monospace" fontSize="9.5" fill={f.pk ? '#fbbf24' : f.fk ? '#4fc3f7' : 'rgba(226,232,240,0.85)'}>
                      {f.pk ? '🔑 ' : f.fk ? '🔗 ' : ''}{f.name}
                    </text>
                    <text x={pos.x + entityWidth - 12} y={pos.y + headerHeight + fi * rowHeight + 14} textAnchor="end" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="rgba(148,163,184,0.7)">
                      {f.type.length > 16 ? f.type.slice(0,14)+'…' : f.type}
                    </text>
                  </g>
                ))}
                {moreCount > 0 && (
                  <text x={pos.x + entityWidth/2} y={pos.y + headerHeight + visibleFields.length * rowHeight + 14} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="9" fontStyle="italic" fill="var(--text-muted)">
                    +{moreCount} more field{moreCount > 1 ? 's' : ''}…
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Hint */}
      <div style={{ position:'absolute', bottom:'8px', left:'10px', zIndex:3, fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Inter,sans-serif' }}>
        Drag to pan · Click a table for details
      </div>
    </div>
  )

  return (
    <div>
      {Viewer}

      {/* Relationship summary */}
      {!fullscreen && (
        <div style={{ marginTop:'0.75rem', display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
          {schema.relationships.map((rel, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'4px 10px', borderRadius:'7px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', fontSize:'0.7rem' }}>
              <span style={{ color, fontWeight:'700', fontFamily:'JetBrains Mono,monospace' }}>{REL_BADGE[rel.type]}</span>
              <span style={{ color:'var(--text-secondary)', fontFamily:'Inter,sans-serif' }}>{rel.from} ↔ {rel.to}</span>
            </div>
          ))}
        </div>
      )}

      {/* Entity detail side panel */}
      {selected && (
        <div style={{ position:'fixed', inset:0, zIndex:9500, display:'flex', justifyContent:'flex-end' }}>
          <div onClick={() => setSelected(null)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }} />
          <div style={{
            position:'relative', zIndex:1, width:'min(380px, 92vw)', height:'100%', overflowY:'auto',
            background:'rgba(10,15,30,0.98)', borderLeft:`1px solid ${color}30`,
            boxShadow:`-10px 0 40px rgba(0,0,0,0.5)`,
            animation:'dsv-slide 0.3s ease',
            padding:'1.5rem',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
              <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'1.1rem', color, margin:0 }}>{selected.name}</h3>
              <button onClick={() => setSelected(null)} aria-label="Close" style={{ width:'30px', height:'30px', borderRadius:'7px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', lineHeight:1.7, color:'var(--text-secondary)', marginBottom:'1.25rem' }}>
              <strong style={{ color:'var(--text-primary)' }}>Purpose: </strong>{selected.purpose}
            </p>

            <div style={{ fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:'0.6rem', fontWeight:'600' }}>Fields</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'1.25rem' }}>
              {selected.fields.map(f => (
                <div key={f.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.5rem 0.7rem', borderRadius:'8px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.78rem', color: f.pk ? '#fbbf24' : f.fk ? '#4fc3f7' : 'var(--text-primary)' }}>
                    {f.pk && '🔑 '}{f.fk && '🔗 '}{f.name}
                  </span>
                  <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.72rem', color:'var(--text-muted)' }}>{f.type}</span>
                </div>
              ))}
            </div>

            {selected.fields.some(f => f.pk) && (
              <div style={{ marginBottom:'0.75rem', fontSize:'0.78rem', color:'var(--text-secondary)' }}>
                <strong style={{ color:'#fbbf24' }}>🔑 Primary Key: </strong>
                {selected.fields.filter(f => f.pk).map(f => f.name).join(', ')}
              </div>
            )}
            {selected.fields.some(f => f.fk) && (
              <div style={{ marginBottom:'0.75rem', fontSize:'0.78rem', color:'var(--text-secondary)' }}>
                <strong style={{ color:'#4fc3f7' }}>🔗 Foreign Keys: </strong>
                {selected.fields.filter(f => f.fk).map(f => `${f.name} → ${f.fk}`).join(', ')}
              </div>
            )}

            {/* Relationships involving this entity */}
            {schema.relationships.filter(r => r.from === selected.name || r.to === selected.name).length > 0 && (
              <>
                <div style={{ fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:'0.6rem', marginTop:'0.5rem', fontWeight:'600' }}>Relationships</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                  {schema.relationships.filter(r => r.from === selected.name || r.to === selected.name).map((r, i) => (
                    <div key={i} style={{ padding:'0.5rem 0.7rem', borderRadius:'8px', background:`${color}10`, border:`1px solid ${color}25`, fontSize:'0.76rem', color:'var(--text-secondary)' }}>
                      <span style={{ color, fontWeight:'700', fontFamily:'JetBrains Mono,monospace', marginRight:'6px' }}>{REL_BADGE[r.type]}</span>
                      {r.label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div style={{ position:'fixed', inset:0, zIndex:9400, padding:'2rem', display:'flex', flexDirection:'column' }}>
          <div onClick={() => setFullscreen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.92)', backdropFilter:'blur(8px)' }} />
          <div style={{ position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', color:'var(--text-primary)', margin:0 }}>Database Schema — {schema.dbType}</h3>
              <button onClick={() => setFullscreen(false)} style={{ padding:'8px 16px', borderRadius:'8px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'var(--text-secondary)', cursor:'pointer', fontSize:'0.8rem' }}>
                Exit Fullscreen (Esc)
              </button>
            </div>
            <div style={{ flex:1 }}>{Viewer}</div>
          </div>
        </div>
      )}

      <style>{`@keyframes dsv-slide{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
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
