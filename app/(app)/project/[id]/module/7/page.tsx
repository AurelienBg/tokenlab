'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M7Data } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'
import { useAutoSave } from '@/lib/useAutoSave'
import { useLang } from '@/components/LangProvider'

const DEFAULT: M7Data = {
  listing_type: null,
  pool_model: null,
  liquidity_strategy: null,
  liquidity_pct: null,
  cex_tier: null,
  market_maker: '',
  tge_date_target: '',
  notes: '',
}

export default function Module7Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M7Data>(DEFAULT)
  const [saved, setSaved] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const mod = getLocalModuleData(id, 'm7')
    if (mod) setData(mod.data as M7Data)
  }, [id])

  function update(patch: Partial<M7Data>) {
    setData((p) => ({ ...p, ...patch }))
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    saveLocalModuleData({
      id: generateId(),
      project_id: id,
      module_key: 'm7',
      data,
      ai_feedback: null,
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    })
    setSaved(true)
  }

  useAutoSave(data, handleSave)

  return (
    <ModuleShell
      title={t.m7_title}
      subtitle={t.m7_subtitle}
      projectId={id}
      moduleKey="m7"
      saved={saved}
      onSave={handleSave}
    >
      {/* Launch strategy */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t.m7_launchTitle}</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'dex_only', label: 'DEX-only', description: t.m7_descDexOnly, icon: '⬡' },
            { value: 'dex_cex', label: 'DEX + CEX', description: t.m7_descDexCex, icon: '⬡⊕' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                data.listing_type === opt.value ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'
              }`}
            >
              <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-0.5 ${
                data.listing_type === opt.value ? 'border-accent bg-accent' : 'border-muted'
              }`} />
              <input type="radio" name="listing_type" checked={data.listing_type === opt.value} onChange={() => update({ listing_type: opt.value as M7Data['listing_type'] })} className="sr-only" />
              <div>
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="text-xs text-muted">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
        <p className="text-xs text-muted mt-3 flex gap-1.5">
          <span className="text-accent">→</span>
          {t.m7_launchReco}
        </p>
      </div>

      {/* Pool model */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t.m7_poolModelTitle}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted border-b border-border">
                <th className="text-left pb-2 font-medium">Feature</th>
                <th className="text-center pb-2 font-medium">CPMM</th>
                <th className="text-center pb-2 font-medium">DLMM (Meteora)</th>
                <th className="text-center pb-2 font-medium">CLMM (Uniswap)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted">
              <tr><td className="py-1.5">Efficiency</td><td className="text-center">Low</td><td className="text-center text-green">Very High</td><td className="text-center">High</td></tr>
              <tr><td className="py-1.5">Rebalancing</td><td className="text-center">Manual</td><td className="text-center text-green">Automated</td><td className="text-center">Manual</td></tr>
              <tr><td className="py-1.5">LP Token</td><td className="text-center">Fungible</td><td className="text-center">Semi-fungible</td><td className="text-center">Non-fungible</td></tr>
              <tr><td className="py-1.5">Ideal for</td><td className="text-center">Early-stage</td><td className="text-center">Advanced mgmt</td><td className="text-center">Mature tokens</td></tr>
            </tbody>
          </table>
        </div>
        <div className="flex gap-2 mt-4">
          {(['cpmm', 'dlmm', 'clmm'] as const).map((m) => (
            <button
              key={m}
              onClick={() => update({ pool_model: m })}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                data.pool_model === m ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:bg-surface-hover'
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Liquidity */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t.m7_liquidityTitle}</h3>
        <div className="space-y-2 mb-4">
          {[
            { value: 'pol', label: 'POL (Protocol-Owned Liquidity)', description: 'Sustainable, no mercenary capital' },
            { value: 'lp_incentives', label: 'LP Incentives (External)', description: 'Flexible, sell pressure risk' },
            { value: 'skewed', label: 'Skewed Pools (70:30, 80:20)', description: t.m7_descSkewed },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                data.liquidity_strategy === opt.value ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'
              }`}
            >
              <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-0.5 ${data.liquidity_strategy === opt.value ? 'border-accent bg-accent' : 'border-muted'}`} />
              <input type="radio" name="liquidity_strategy" checked={data.liquidity_strategy === opt.value} onChange={() => update({ liquidity_strategy: opt.value as M7Data['liquidity_strategy'] })} className="sr-only" />
              <div>
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="text-xs text-muted">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t.m7_liquidityPctLabel}</label>
            <input type="number" min="0" max="100" step="0.5" value={data.liquidity_pct ?? ''} onChange={(e) => update({ liquidity_pct: e.target.value ? Number(e.target.value) : null })} className="input" placeholder={t.m7_liquidityPctPlaceholder} />
            <p className="text-xs text-muted mt-1">{t.m7_liquidityPctHint}</p>
          </div>
          <div>
            <label className="label">{t.m7_tgeDateLabel}</label>
            <input type="date" value={data.tge_date_target} onChange={(e) => update({ tge_date_target: e.target.value })} className="input" />
          </div>
        </div>
      </div>

      {/* CEX */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t.m7_cexTitle}</h3>
        <div className="space-y-2 mb-4">
          {[
            { value: 'none', label: t.m7_cexNone, description: 'DEX-only' },
            { value: 'tier3', label: 'Tier 3', description: 'LBank, BingX — $10K–$60K' },
            { value: 'tier2', label: 'Tier 2', description: 'Gate, MEXC, Kucoin — $80K–$600K' },
            { value: 'tier1', label: 'Tier 1', description: 'Binance, OKX, Kraken — $250K–$1M+' },
          ].map((opt) => (
            <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.cex_tier === opt.value ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'}`}>
              <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${data.cex_tier === opt.value ? 'border-accent bg-accent' : 'border-muted'}`} />
              <input type="radio" name="cex_tier" checked={data.cex_tier === opt.value} onChange={() => update({ cex_tier: opt.value as M7Data['cex_tier'] })} className="sr-only" />
              <div>
                <span className="text-sm font-medium text-foreground">{opt.label}</span>
                <span className="text-xs text-muted ml-2">{opt.description}</span>
              </div>
            </label>
          ))}
        </div>
        <div>
          <label className="label">{t.m7_marketMakerLabel}</label>
          <input value={data.market_maker} onChange={(e) => update({ market_maker: e.target.value })} placeholder={t.m7_marketMakerPlaceholder} className="input" />
        </div>
      </div>

      <div className="card">
        <label className="label">{t.m7_notesLabel}</label>
        <textarea value={data.notes} onChange={(e) => update({ notes: e.target.value })} rows={3} className="input" />
      </div>
    </ModuleShell>
  )
}
