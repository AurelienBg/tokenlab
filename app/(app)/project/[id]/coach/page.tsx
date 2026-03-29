'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalProject } from '@/lib/storage'
import { buildProjectContext } from '@/lib/prompts'
import { LocalProject } from '@/lib/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STARTER_PROMPTS = [
  'Analyse la cohérence globale de ma tokenomics et identifie les 3 risques principaux.',
  'Mon token est-il réellement utilitaire selon les critères du workshop ?',
  'Y a-t-il des red flags dans mon allocation ou mon vesting ?',
  'Quels sinks devrais-je ajouter pour équilibrer les émissions ?',
  'Mon modèle de gouvernance est-il cohérent avec ma distribution initiale ?',
]

export default function CoachPage() {
  const { id } = useParams() as { id: string }
  const [lp, setLp] = useState<LocalProject | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const data = getLocalProject(id)
    setLp(data ?? null)
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text: string) {
    if (!text.trim() || !lp) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const projectContext = buildProjectContext(lp.project, lp.modules)

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectContext,
          messages: newMessages,
        }),
      })

      if (!res.ok) throw new Error('API error')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantText }
          return updated
        })
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Erreur de connexion au Coach IA. Réessayez.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  if (!lp) {
    return <div className="flex items-center justify-center h-64 text-muted text-sm">Chargement…</div>
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 shrink-0">
        <h1 className="text-base font-bold text-foreground">Coach IA</h1>
        <p className="text-xs text-muted mt-0.5">
          Votre expert tokenomics — challenger & suggère sur la base du workshop XRPL Commons
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">✦</div>
              <h2 className="text-base font-semibold text-foreground mb-1">Coach IA — {lp.project.name}</h2>
              <p className="text-sm text-muted">
                Je connais votre projet et ses modules renseignés. Posez-moi n'importe quelle question sur votre tokenomics.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {STARTER_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="text-left px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-accent/40 transition-all text-sm text-muted hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-accent text-xs">✦</span>
                </div>
              )}
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-tr-sm'
                  : 'bg-surface border border-border text-foreground rounded-tl-sm'
              }`}>
                {msg.content ? (
                  <FormattedText text={msg.content} />
                ) : (
                  <span className="text-muted italic">…</span>
                )}
              </div>
            </div>
          ))}

          {loading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <span className="text-accent text-xs">✦</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-surface border border-border">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted"
                      style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border px-6 py-4 shrink-0">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question au Coach IA…"
              disabled={loading}
              className="input flex-1"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-primary shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '→'
              )}
            </button>
          </form>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-xs text-muted hover:text-foreground transition-colors mt-2"
            >
              Effacer la conversation
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function FormattedText({ text }: { text: string }) {
  // Simple markdown-like rendering
  const lines = text.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <p key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{line.slice(2)}</span></p>
        }
        if (line === '') return <div key={i} className="h-1" />
        return <p key={i}>{line}</p>
      })}
    </div>
  )
}
