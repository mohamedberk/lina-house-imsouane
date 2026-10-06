import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  FALLBACK_TRANSFERS_EN,
  FALLBACK_TRANSFERS_FR,
  type TransferContent,
  type TransferRoute,
} from './transferRoutes'

async function loadFromPayload(locale: 'en' | 'fr'): Promise<TransferContent> {
  try {
    const payload = await getPayload({ config })
    const doc: any = await payload.findGlobal({
      slug: 'transfers' as any,
      locale,
      depth: 0,
    })
    const routes: TransferRoute[] = Array.isArray(doc?.routes)
      ? doc.routes
          .filter((r: any) => r?.active !== false && r?.routeId)
          .map((r: any) => ({
            id: String(r.routeId),
            label: String(r.label ?? r.routeId),
            priceEur: Number(r.priceEur ?? 0),
          }))
      : []
    const fallback = locale === 'fr' ? FALLBACK_TRANSFERS_FR : FALLBACK_TRANSFERS_EN
    if (routes.length === 0) return fallback
    return {
      cardTitle: String(doc?.cardTitle ?? fallback.cardTitle),
      cardDescription: String(doc?.cardDescription ?? fallback.cardDescription),
      routes,
    }
  } catch {
    return locale === 'fr' ? FALLBACK_TRANSFERS_FR : FALLBACK_TRANSFERS_EN
  }
}

const cachedEn = unstable_cache(() => loadFromPayload('en'), ['transfers-global-en'], {
  tags: ['transfers'],
  revalidate: 300,
})
const cachedFr = unstable_cache(() => loadFromPayload('fr'), ['transfers-global-fr'], {
  tags: ['transfers'],
  revalidate: 300,
})

export async function fetchTransferContent(
  locale: 'en' | 'fr' = 'en',
): Promise<TransferContent> {
  return locale === 'fr' ? cachedFr() : cachedEn()
}
