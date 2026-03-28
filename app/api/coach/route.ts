import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildCoachSystemPrompt } from '@/lib/prompts'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const {
      projectContext,
      messages,
    }: {
      projectContext: string
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
    } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: `${buildCoachSystemPrompt()}\n\n---\n\n# Contexte du projet\n\n${projectContext}`,
      messages,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      },
    })

    return new NextResponse(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    console.error('coach error', error)
    return NextResponse.json({ error: 'Erreur Coach IA' }, { status: 500 })
  }
}
