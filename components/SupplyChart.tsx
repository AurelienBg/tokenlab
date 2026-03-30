'use client'

import { SimulationPoint, CategorySim, formatSupply } from '@/lib/supplySimulation'

interface Props {
  points: SimulationPoint[]
  categories: CategorySim[]
  totalSupply: number
  height?: number
}

const PAD = { top: 16, right: 24, bottom: 36, left: 56 }

export default function SupplyChart({ points, categories, totalSupply, height = 280 }: Props) {
  if (points.length === 0) return null

  const width = 800
  const chartW = width - PAD.left - PAD.right
  const chartH = height - PAD.top - PAD.bottom

  const maxY = totalSupply
  const xSteps = points.length - 1

  function xPos(month: number) {
    return PAD.left + (month / xSteps) * chartW
  }
  function yPos(val: number) {
    return PAD.top + chartH - (val / maxY) * chartH
  }

  // Build stacked area paths per category
  function stackedPath(catIndex: number): { area: string; line: string } {
    const getStackedBase = (month: number) => {
      let base = 0
      for (let i = 0; i < catIndex; i++) {
        base += points[month].byCategory[categories[i].category] ?? 0
      }
      return base
    }

    const topPoints = points.map((p) => ({
      x: xPos(p.month),
      y: yPos(getStackedBase(p.month) + (p.byCategory[categories[catIndex].category] ?? 0)),
    }))
    const botPoints = points.map((p) => ({
      x: xPos(p.month),
      y: yPos(getStackedBase(p.month)),
    }))

    const topLine = topPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
    const botRev = [...botPoints].reverse().map((pt) => `L${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
    const area = `${topLine} ${botRev} Z`
    const line = topPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')

    return { area, line }
  }

  // Y axis ticks
  const yTicks = [0, 25, 50, 75, 100]
  // X axis ticks every 6 months
  const xTicks = points.filter((p) => p.month % 6 === 0).map((p) => p.month)

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minWidth: 400 }}
      >
        {/* Grid lines */}
        {yTicks.map((pct) => {
          const y = yPos((pct / 100) * maxY)
          return (
            <g key={pct}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y} y2={y}
                stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end"
                className="fill-muted" fontSize={10}>
                {pct}%
              </text>
            </g>
          )
        })}

        {/* Stacked areas */}
        {categories.map((cat, i) => {
          const { area, line } = stackedPath(i)
          return (
            <g key={cat.category}>
              <path d={area} fill={cat.color} fillOpacity={0.15} />
              <path d={line} fill="none" stroke={cat.color} strokeWidth={1.5} strokeOpacity={0.7} />
            </g>
          )
        })}

        {/* Total circulating supply line */}
        <path
          d={points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xPos(p.month).toFixed(1)},${yPos(p.total).toFixed(1)}`).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeOpacity={0.5}
          strokeDasharray="4 3"
        />

        {/* X axis */}
        <line x1={PAD.left} x2={width - PAD.right} y1={PAD.top + chartH} y2={PAD.top + chartH}
          stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
        {xTicks.map((m) => (
          <g key={m}>
            <line x1={xPos(m)} x2={xPos(m)} y1={PAD.top + chartH} y2={PAD.top + chartH + 4}
              stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
            <text x={xPos(m)} y={PAD.top + chartH + 14} textAnchor="middle"
              className="fill-muted" fontSize={10}>
              M{m}
            </text>
          </g>
        ))}

        {/* Hover dots on key months (TGE, 12, 24, 36, 48) */}
        {[0, 12, 24, 36, 48].filter((m) => m <= xSteps).map((m) => {
          const pt = points[m]
          const pct = Math.round((pt.total / maxY) * 100)
          return (
            <g key={m}>
              <circle cx={xPos(m)} cy={yPos(pt.total)} r={3}
                fill="var(--color-accent)" stroke="var(--color-surface)" strokeWidth={1.5} />
              <text x={xPos(m)} y={yPos(pt.total) - 8} textAnchor="middle"
                fontSize={9} fill="var(--color-accent)" fontWeight="600">
                {pct}%
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 px-1">
        {categories.map((cat) => (
          <div key={cat.category} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: cat.color, opacity: 0.8 }} />
            <span className="text-xs text-muted">{cat.category}</span>
            <span className="text-[10px] text-muted opacity-60">({formatSupply(cat.tokens)})</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0 border-t border-dashed border-foreground opacity-40" />
          <span className="text-xs text-muted">Total circulant</span>
        </div>
      </div>
    </div>
  )
}
