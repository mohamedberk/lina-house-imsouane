import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { translateAll } from '@/lib/groqTranslate'
import { extractLocalizedPaths } from '@/lib/payloadLocalizedWalker'
import { buildPatch, extractStrings } from '@/lib/localizedDocPaths'

export const runtime = 'nodejs'
export const maxDuration = 60

type Body = {
  type: 'global' | 'collection'
  slug: string
  docId?: string | number
  /** When `type === 'collection'` and `all === true`, translate every document. */
  all?: boolean
  sourceLocale?: string
  targetLocale?: string
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    const reqHeaders = await nextHeaders()
    const { user } = await payload.auth({ headers: reqHeaders })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured on the server' },
        { status: 500 },
      )
    }

    const body = (await req.json()) as Body
    const { type, slug, docId, all } = body
    const sourceLocale = body.sourceLocale || 'en'
    const targetLocale = body.targetLocale || 'fr'

    if (!type || !slug) {
      return NextResponse.json({ error: 'Missing `type` or `slug` in body' }, { status: 400 })
    }
    if (type === 'collection' && !docId && !all) {
      return NextResponse.json(
        { error: 'Collection translation requires either `docId` or `all: true`' },
        { status: 400 },
      )
    }

    // 1. Locate the schema config.
    const cfg: any =
      type === 'global'
        ? payload.config.globals?.find((g: any) => g.slug === slug)
        : payload.config.collections?.find((c: any) => c.slug === slug)

    if (!cfg) {
      return NextResponse.json(
        { error: `No ${type} registered with slug "${slug}"` },
        { status: 404 },
      )
    }

    // 2. Discover localized text paths from the schema.
    const schemaPaths = extractLocalizedPaths(cfg.fields || [])

    if (schemaPaths.length === 0) {
      return NextResponse.json({
        success: true,
        message: `No localized text fields in ${type} "${slug}" — nothing to translate.`,
        count: 0,
      })
    }

    // Helper: translate a single document and save to target locale.
    const translateOne = async (sourceDoc: any, docIdForSave?: string | number) => {
      const entries = extractStrings(sourceDoc, schemaPaths)
      if (entries.length === 0) return 0

      const forGroq = entries.map((e) => ({ id: e.path, text: e.value }))
      const translated = await translateAll(forGroq)
      const translationsMap = new Map(translated.map((t) => [t.id, t.translation]))
      const patch = buildPatch(sourceDoc, translationsMap)

      if (type === 'global') {
        await payload.updateGlobal({
          slug: slug as any,
          locale: targetLocale as any,
          data: patch,
          depth: 0,
        })
      } else {
        await payload.update({
          collection: slug as any,
          id: docIdForSave!,
          locale: targetLocale as any,
          data: patch,
          depth: 0,
        })
      }

      return entries.length
    }

    // ── Bulk mode: every document in a collection ────────────────────────
    if (type === 'collection' && all) {
      const listing = await payload.find({
        collection: slug as any,
        locale: sourceLocale as any,
        depth: 0,
        limit: 1000,
        pagination: false,
      })

      let totalFields = 0
      let docsTranslated = 0
      const errors: string[] = []

      for (const doc of listing.docs as any[]) {
        try {
          const n = await translateOne(doc, doc.id)
          if (n > 0) {
            totalFields += n
            docsTranslated += 1
          }
        } catch (err: any) {
          errors.push(`${doc.id}: ${err?.message || 'failed'}`)
        }
      }

      return NextResponse.json({
        success: errors.length === 0,
        message: `Translated ${docsTranslated}/${listing.docs.length} ${slug} documents (${totalFields} fields total) → ${targetLocale.toUpperCase()}.`,
        count: totalFields,
        docsTranslated,
        totalDocs: listing.docs.length,
        errors,
      })
    }

    // ── Single-doc / global mode ─────────────────────────────────────────
    const sourceDoc: any =
      type === 'global'
        ? await payload.findGlobal({
            slug: slug as any,
            locale: sourceLocale as any,
            depth: 0,
          })
        : await payload.findByID({
            collection: slug as any,
            id: docId!,
            locale: sourceLocale as any,
            depth: 0,
          })

    const translatedFields = await translateOne(sourceDoc, docId)

    if (translatedFields === 0) {
      return NextResponse.json({
        success: true,
        message: `No non-empty strings found in ${type} "${slug}" at locale "${sourceLocale}".`,
        count: 0,
      })
    }

    return NextResponse.json({
      success: true,
      message: `Translated ${translatedFields} fields → ${targetLocale.toUpperCase()}.`,
      count: translatedFields,
    })
  } catch (err: any) {
    console.error('[translate] failed:', err)
    return NextResponse.json({ error: err?.message || 'Translation failed' }, { status: 500 })
  }
}
