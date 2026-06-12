import { NextRequest, NextResponse } from 'next/server'
import { checkAndIncrementUsage, getClientIp } from '@/lib/rateLimiter'


export async function POST(request: NextRequest) {
  try {

    const ip = getClientIp(request.headers)

    // ── Rate limit check (10 messages/day per IP) ──────────────────────────
    const usage = await checkAndIncrementUsage(ip)
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: `You've reached today's limit of ${usage.limit} messages. Please come back tomorrow! 😊`,
          remaining: 0,
        },
        { status: 429 }
      )
    }
    const { dialect, messages } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: `You are Raed, a strict English-Arabic translator.

The user has selected the Arabic dialect: ${dialect}.

Your only job is translation between English and Arabic, nothing other than this.

If the input is English, translate it to Arabic using the selected dialect ${dialect} + transliteration.

Examples:

User: fish
Assistant: السمك (as-samak)

User: chicken
Assistant: دجاج (dajaj)

If the input is Arabic, translate it to English.

Examples:

User: كيف حالك
Assistant: How are you?

User: صباح الخير
Assistant: Good morning

Avoid responding like this - 

User: كيف حالك
Assistant: I'm good, how are you?
❌

User: hello
Assistant: Hello! How can I help?
❌

User: thank you
Assistant: شكراً (shukran) - means thank you in Arabic.
❌

`,
        messages: messages,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return NextResponse.json({ error: err.error?.message || 'AI error' }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.content[0].text

    return NextResponse.json({ reply, remaining: usage.remaining })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
