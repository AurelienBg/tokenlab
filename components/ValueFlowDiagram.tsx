'use client'

import { M3Data, FlowItem } from '@/lib/types'

interface ValueFlowDiagramProps {
  data: M3Data
  tokenName?: string
  tokenTicker?: string
  onAddFaucet?: () => void
  onAddSink?: () => void
}

// ─── Layout constants ──────────────────────────────────────────────────────────

const W = 680
const NODE_W = 148
const NODE_H = 44
const NODE_R = 8
const CENTER_RX = 54
const CENTER_RY = 38
const LEFT_X = 8
const RIGHT_X = W - NODE_W - 8
const CX = W / 2

function nodeY(index: number, total: number, height: number): number {
  if (total === 1) return height / 2
  return (height / (total + 1)) * (index + 1)
}

function truncate(str: string, max: number): string {
  if (!str) return ''
  return str.length > max ? str.slice(0, max - 1) + '…' : str
}

// ─── Arrow path: cubic bezier from (x1,y1) to (x2,y2) ────────────────────────

function curvePath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = Math.abs(x2 - x1) * 0.55
  return `M ${x1} ${y1} C ${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FaucetNode({ item, x, y }: { item: FlowItem; x: number; y: number }) {
  return (
    <g>
      <rect
        x={x} y={y - NODE_H / 2}
        width={NODE_W} height={NODE_H}
        rx={NODE_R}
        style={{ fill: 'var(--surface)', stroke: 'var(--green)', strokeWidth: 1.5 }}
      />
      <text
        x={x + NODE_W / 2} y={y - 6}
        textAnchor="middle"
        style={{ fontSize: 11, fontWeight: 600, fill: 'var(--green)', fontFamily: 'inherit' }}
      >
        {truncate(item.name || '…', 18)}
      </text>
      {item.mechanism && (
        <text
          x={x + NODE_W / 2} y={y + 9}
          textAnchor="middle"
          style={{ fontSize: 9, fill: 'var(--muted)', fontFamily: 'inherit' }}
        >
          {truncate(item.mechanism, 22)}
        </text>
      )}
    </g>
  )
}

function SinkNode({ item, x, y }: { item: FlowItem; x: number; y: number }) {
  return (
    <g>
      <rect
        x={x} y={y - NODE_H / 2}
        width={NODE_W} height={NODE_H}
        rx={NODE_R}
        style={{ fill: 'var(--surface)', stroke: 'var(--red)', strokeWidth: 1.5 }}
      />
      <text
        x={x + NODE_W / 2} y={y - 6}
        textAnchor="middle"
        style={{ fontSize: 11, fontWeight: 600, fill: 'var(--red)', fontFamily: 'inherit' }}
      >
        {truncate(item.name || '…', 18)}
      </text>
      {item.mechanism && (
        <text
          x={x + NODE_W / 2} y={y + 9}
          textAnchor="middle"
          style={{ fontSize: 9, fill: 'var(--muted)', fontFamily: 'inherit' }}
        >
          {truncate(item.mechanism, 22)}
        </text>
      )}
    </g>
  )
}

function ArrowCurve({
  x1, y1, x2, y2, color, volume, id,
}: {
  x1: number; y1: number; x2: number; y2: number
  color: 'green' | 'red'; volume?: string; id: string
}) {
  const markerId = `arrow-${color}-${id}`
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2 - 10
  const colorVar = color === 'green' ? 'var(--green)' : 'var(--red)'

  return (
    <g>
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" style={{ fill: colorVar }} />
        </marker>
      </defs>
      <path
        d={curvePath(x1, y1, x2, y2)}
        fill="none"
        markerEnd={`url(#${markerId})`}
        style={{ stroke: colorVar, strokeWidth: 1.5, strokeOpacity: 0.55 }}
      />
      {volume && (
        <text
          x={midX} y={midY}
          textAnchor="middle"
          style={{ fontSize: 9, fill: 'var(--muted)', fontFamily: 'inherit' }}
        >
          {truncate(volume, 20)}
        </text>
      )}
    </g>
  )
}

function EmptyPlaceholder({ x, y, label, color, onClick }: {
  x: number; y: number; label: string; color: 'green' | 'red'; onClick?: () => void
}) {
  const colorVar = color === 'green' ? 'var(--green)' : 'var(--red)'
  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <rect
        x={x} y={y - NODE_H / 2}
        width={NODE_W} height={NODE_H}
        rx={NODE_R}
        style={{
          fill: 'transparent',
          stroke: colorVar,
          strokeWidth: 1,
          strokeDasharray: '4 3',
          strokeOpacity: onClick ? 0.7 : 0.4,
          transition: 'stroke-opacity 0.15s',
        }}
      />
      <text
        x={x + NODE_W / 2} y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: 10, fill: colorVar, fillOpacity: onClick ? 0.7 : 0.4, fontFamily: 'inherit', userSelect: 'none' }}
      >
        {label}
      </text>
    </g>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ValueFlowDiagram({ data, tokenName, tokenTicker, onAddFaucet, onAddSink }: ValueFlowDiagramProps) {
  const { faucets, sinks } = data
  const maxRows = Math.max(faucets.length, sinks.length, 2)
  const H = Math.max(maxRows * 76 + 80, 240)

  const cy = H / 2
  const label = tokenTicker ? `$${tokenTicker}` : tokenName || 'TOKEN'

  // Connection edge points
  const leftEdge = LEFT_X + NODE_W        // right side of left nodes
  const rightEdge = RIGHT_X               // left side of right nodes
  const centerLeftEdge = CX - CENTER_RX   // left side of center ellipse
  const centerRightEdge = CX + CENTER_RX  // right side of center ellipse

  return (
    <div className="card overflow-hidden p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">Value Flow</span>
          <span className="text-xs text-muted">— visualisation temps réel</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green" />
            {faucets.length} faucet{faucets.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-red" />
            {sinks.length} sink{sinks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Column labels */}
      <div className="flex justify-between px-5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest">
        <span className="text-green">↑ Faucets</span>
        <span className="text-red">Sinks ↓</span>
      </div>

      {/* SVG */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto' }}
        aria-label="Value Flow Diagram"
      >
        {/* ── Faucets ── */}
        {faucets.length === 0 && (
          <EmptyPlaceholder x={LEFT_X} y={cy} label="+ Ajouter un faucet" color="green" onClick={onAddFaucet} />
        )}
        {faucets.map((f, i) => {
          const fy = nodeY(i, faucets.length, H)
          return (
            <g key={f.id}>
              <FaucetNode item={f} x={LEFT_X} y={fy} />
              <ArrowCurve
                id={`f${i}`}
                x1={leftEdge} y1={fy}
                x2={centerLeftEdge} y2={cy}
                color="green"
                volume={f.estimated_volume}
              />
            </g>
          )
        })}

        {/* ── Sinks ── */}
        {sinks.length === 0 && (
          <EmptyPlaceholder x={RIGHT_X} y={cy} label="+ Ajouter un sink" color="red" onClick={onAddSink} />
        )}
        {sinks.map((s, i) => {
          const sy = nodeY(i, sinks.length, H)
          return (
            <g key={s.id}>
              <SinkNode item={s} x={RIGHT_X} y={sy} />
              <ArrowCurve
                id={`s${i}`}
                x1={centerRightEdge} y1={cy}
                x2={rightEdge} y2={sy}
                color="red"
                volume={s.estimated_volume}
              />
            </g>
          )
        })}

        {/* ── Center node ── */}
        <ellipse
          cx={CX} cy={cy}
          rx={CENTER_RX} ry={CENTER_RY}
          style={{
            fill: 'var(--accent)',
            fillOpacity: 0.12,
            stroke: 'var(--accent)',
            strokeWidth: 2,
          }}
        />
        <text
          x={CX} y={cy - 8}
          textAnchor="middle"
          style={{ fontSize: 13, fontWeight: 700, fill: 'var(--accent)', fontFamily: 'inherit' }}
        >
          {truncate(label, 10)}
        </text>
        <text
          x={CX} y={cy + 10}
          textAnchor="middle"
          style={{ fontSize: 9, fill: 'var(--muted)', fontFamily: 'inherit' }}
        >
          {faucets.length > 0 || sinks.length > 0
            ? `${faucets.length}→ ●●● →${sinks.length}`
            : 'Aucun flux'}
        </text>
      </svg>

      {/* Ratio badge if set */}
      {data.emission_revenue_ratio !== null && (
        <div className="px-5 py-2 border-t border-border flex items-center gap-2">
          <span className="text-xs text-muted">Ratio émission/revenus :</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            data.emission_revenue_ratio <= 1
              ? 'bg-green/10 text-green'
              : 'bg-red/10 text-red'
          }`}>
            {data.emission_revenue_ratio} {data.emission_revenue_ratio <= 1 ? '✓ soutenable' : '⚠ insoutenable'}
          </span>
        </div>
      )}
    </div>
  )
}
