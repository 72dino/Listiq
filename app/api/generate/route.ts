import { NextResponse } from 'next/server'

type RequestBody = {
  propertyType: string
  location: string
  size: string
  bedrooms: string
  bathrooms: string
  price: string
  features: string
  language: string
}

function extractText(data: any): string {
  // Try common response shapes
  if (!data) return ''
  if (typeof data === 'string') return data
  if (data.completion) return data.completion
  if (data.output && Array.isArray(data.output) && data.output[0]?.content) {
    const c = data.output[0].content
    if (Array.isArray(c)) {
      const textItem = c.find((x: any) => x.type === 'output_text' || x.type === 'text')
      if (textItem) return textItem.text || textItem.content || ''
    }
  }
  if (data.message && Array.isArray(data.message.content)) {
    const m = data.message.content[0]
    return m?.text || m?.content || ''
  }
  // fallback: try older choices format
  if (data.choices && Array.isArray(data.choices) && data.choices[0]?.message?.content) {
    const c = data.choices[0].message.content[0]
    return c?.text || ''
  }
  return JSON.stringify(data)
}

function makeMockResults(body: RequestBody): Record<string, string> {
  const { propertyType, location, size, bedrooms, bathrooms, price, features, language } = body
  const base = `${propertyType} in ${location} — ${size} m², ${bedrooms} beds, ${bathrooms} baths. Price: €${price}. Features: ${features}.`
  const listing = `Sample listing (${language}): Discover this ${base} This charming property offers modern finishes and a convenient location. Contact us to arrange a viewing.`
  const buyer = `Sample buyer email (${language}): Hello,\n\nI'm interested in the ${propertyType} at ${location}. ${base} Please let me know available viewing times.\n\nBest regards,`
  const seller = `Sample seller email (${language}): Hello,\n\nQuick market update for your ${propertyType} at ${location}. Given recent comparables, consider a competitive price around €${price}. Let's discuss strategy.\n\nRegards,`
  const followup = `Sample follow-up (${language}): Hi — following up on the ${propertyType} at ${location}. Are you still interested?`
  return { listing, buyer, seller, followup }
}

export async function POST(req: Request) {
  try {
    // Read raw text and parse manually to provide clearer diagnostics on parse errors
    const rawBody = await req.text()
    let body: RequestBody
    try {
      body = JSON.parse(rawBody) as RequestBody
    } catch (parseErr) {
      console.error('Failed to parse request JSON body:', rawBody?.slice?.(0, 200))
      throw parseErr
    }
    const {
      propertyType,
      location,
      size,
      bedrooms,
      bathrooms,
      price,
      features,
      language
    } = body

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.warn('Missing ANTHROPIC_API_KEY in environment — returning mock results for development.')
      return NextResponse.json(makeMockResults({ propertyType, location, size, bedrooms, bathrooms, price, features, language }))
    }

    const makePrompt = (type: string) => {
      const ctx = `Property Type: ${propertyType}\nLocation: ${location}\nSize: ${size} m²\nBedrooms: ${bedrooms}\nBathrooms: ${bathrooms}\nPrice: €${price}\nFeatures: ${features}`
      const lang = language || 'English'

      if (type === 'listing') {
        return `Write a professional, marketing-style property listing description in ${lang}. Use the following property details:\n${ctx}\nKeep it concise (2-4 short paragraphs), highlight key features, and include a compelling call-to-action.`
      }

      if (type === 'buyer') {
        return `Write a polite email from a real estate agent to a potential buyer in ${lang} expressing interest in the property described below and requesting a viewing. Use a professional, friendly tone. Property details:\n${ctx}`
      }

      if (type === 'seller') {
        return `Write an email from a real estate agent to a property seller in ${lang} with a short market update and pricing advice for the property below. Keep it professional and actionable. Property details:\n${ctx}`
      }

      if (type === 'followup') {
        return `Write a short follow-up message in ${lang} (1-2 sentences) to a lead who hasn't responded in 3 days regarding the property below. Be polite and encourage a quick reply. Property details:\n${ctx}`
      }

      return ''
    }

    const tasks = [
      { key: 'listing', type: 'listing' },
      { key: 'buyer', type: 'buyer' },
      { key: 'seller', type: 'seller' },
      { key: 'followup', type: 'followup' }
    ]

    const results: Record<string, string> = {}

    const useOpenAI = typeof apiKey === 'string' && (/^sk-|^openai-/i).test(apiKey)

    for (const t of tasks) {
      const prompt = makePrompt(t.type)

      if (useOpenAI) {
        // Call OpenAI chat completions as a fallback when the provided key looks like an OpenAI key
        const openaiPayload = {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500
        }

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify(openaiPayload)
        })

        if (!res.ok) {
          const text = await res.text()
          console.error(`OpenAI non-OK (${res.status}):`, text?.slice?.(0, 200))
          const lower = (text || '').toLowerCase()
          if (res.status === 401 || res.status === 403 || lower.includes('invalid api key') || lower.includes('unauthorized')) {
            console.warn('OpenAI authentication error detected — returning mock results for development.')
            return NextResponse.json(makeMockResults({ propertyType, location, size, bedrooms, bathrooms, price, features, language }))
          }
          return NextResponse.json({ error: `OpenAI error: ${text}` }, { status: 502 })
        }

        let data: any = null
        try {
          data = await res.json()
        } catch (parseErr) {
          const raw = await res.text().catch(() => '')
          console.error('Failed to parse OpenAI JSON response:', parseErr, raw?.slice?.(0, 500))
          results[t.key] = raw || ''
          continue
        }

        const text = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || JSON.stringify(data)
        results[t.key] = text
        continue
      }

      // Default: Anthropic
      const payload = {
        model: 'claude-sonnet-4-20250514',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500
      }

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': `2023-06-01`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const text = await res.text()
        console.error(`Anthropic non-OK (${res.status}):`, text?.slice?.(0, 200))
        const lower = (text || '').toLowerCase()
        if (res.status === 401 || res.status === 403 || lower.includes('authentication_error') || lower.includes('invalid x-api-key') || lower.includes('x-api-key')) {
          console.warn('Anthropic authentication error detected — returning mock results for development.')
          return NextResponse.json(makeMockResults({ propertyType, location, size, bedrooms, bathrooms, price, features, language }))
        }
        return NextResponse.json({ error: `Anthropic error: ${text}` }, { status: 502 })
      }

      // Try to parse JSON safely; fall back to raw text if parsing fails
      let data: any = null
      try {
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          data = await res.json()
        } else {
          const raw = await res.text()
          console.error(`Anthropic returned non-JSON response (status ${res.status}):`, raw?.slice?.(0, 500))
          results[t.key] = raw
          continue
        }
      } catch (parseErr) {
        const raw = await res.text().catch(() => '')
        console.error('Failed to parse Anthropic JSON response:', parseErr, raw?.slice?.(0, 500))
        results[t.key] = raw || ''
        continue
      }

      const text = extractText(data)
      results[t.key] = text
    }

    return NextResponse.json(results)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
