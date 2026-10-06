import Groq from 'groq-sdk'

const BRAND_CONTEXT = `
You are translating copy for "Lina House", a surf camp and hostel in Imsouane, Morocco.
Target audience: French-speaking travellers (France, Belgium, Switzerland, Quebec, Morocco).
Tone: warm, welcoming, evocative of the ocean and slow village life. Casual but polished.

Rules:
- Translate from English to French.
- Keep proper nouns unchanged: "Lina House", "Imsouane", "Magic Bay", "Cathedral", "Morocco"/"Maroc" (use "Maroc").
- Keep place names with natural French articles (e.g. "au Maroc", "à Imsouane").
- Preserve numbers, prices (€), units (m, km, h), ratings (9.7/10).
- Preserve punctuation, line breaks, em-dashes (—), quote style.
- If the source already looks French (e.g. "Français"), leave it unchanged.
- Do NOT translate email addresses, URLs, phone numbers, icon names, or technical values.
- Do NOT add explanations, notes, or commentary.
- Keep short texts short — do not pad or embellish. A 2-word button stays 2-3 words in French.
- Use "tu" / informal address sparingly, default to warm but respectful tone ("vous" for guest-facing copy is fine, but feel free to use imperative like "Réservez").
- Surf/hostel vocabulary: "surf camp" → "surf camp" (kept), "rooftop terrace" → "terrasse sur le toit", "BBQ" → "barbecue", "booking" → "réservation".
`.trim()

type Entry = { id: string; text: string }

export type TranslateResult = { id: string; translation: string }

const groq = () => {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in environment variables')
  return new Groq({ apiKey })
}

/**
 * Translate a batch of strings from EN to FR in a single Groq call.
 * Uses a JSON in / JSON out pattern for reliable parsing.
 */
export async function translateBatch(entries: Entry[]): Promise<TranslateResult[]> {
  if (entries.length === 0) return []

  const client = groq()

  const userPayload = JSON.stringify({ entries }, null, 2)

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `${BRAND_CONTEXT}

You will receive JSON of the shape:
{ "entries": [ { "id": "<string>", "text": "<english text>" }, ... ] }

Return ONLY valid JSON of the shape:
{ "translations": [ { "id": "<same id>", "translation": "<french text>" }, ... ] }

- Output the same number of entries, in the same order, with the same ids.
- "translation" must be the French equivalent of the "text" field, following the rules above.
- No extra keys, no prose, no markdown.`,
      },
      {
        role: 'user',
        content: userPayload,
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error('Empty response from Groq')

  let parsed: { translations?: TranslateResult[] }
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    throw new Error(`Failed to parse Groq JSON response: ${raw.slice(0, 200)}`)
  }

  if (!Array.isArray(parsed.translations)) {
    throw new Error('Groq response missing "translations" array')
  }

  const byId = new Map(parsed.translations.map((t) => [t.id, t.translation]))

  return entries.map((e) => ({
    id: e.id,
    translation: byId.get(e.id) ?? e.text,
  }))
}

/**
 * Split a long entry list into chunks to avoid hitting token limits.
 * 40 strings per chunk is safe for llama-3.3-70b's context and keeps latency OK.
 */
export async function translateAll(entries: Entry[], chunkSize = 40): Promise<TranslateResult[]> {
  const results: TranslateResult[] = []
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize)
    const chunkResults = await translateBatch(chunk)
    results.push(...chunkResults)
  }
  return results
}
