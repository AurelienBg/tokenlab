import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildAnalyzePrompt } from '@/lib/prompts'
import { Project, ModuleData, ModuleKey } from '@/lib/types'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const {
      project,
      modules,
    }: {
      project: Project
      modules: Partial<Record<ModuleKey, ModuleData>>
    } = await req.json()

    const prompt = buildAnalyzePrompt(project, modules)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Try to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (error) {
    console.error('analyze error', error)
    return NextResponse.json({ error: 'Erreur analyse' }, { status: 500 })
  }
}
