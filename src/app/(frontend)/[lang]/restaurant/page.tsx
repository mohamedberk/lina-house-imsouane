import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import RestaurantClient from './RestaurantClient'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let cmsSeo
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'restaurant-page', locale, depth: 1 })
    cmsSeo = (data as { seo?: typeof cmsSeo })?.seo
  } catch {}

  const isFr = locale === 'fr'
  return buildPageMetadata({
    cms: cmsSeo,
    fallbackTitle: 'Restaurant | Lina House',
    fallbackDescription: isFr
      ? 'Cuisine marocaine authentique, poisson frais du port et BBQ au feu de bois chaque soir. Petit-déjeuner, déjeuner et dîner à Imsouane.'
      : 'Authentic Moroccan cuisine, fresh fish from the harbour, and wood-fire BBQ every evening. Breakfast, lunch, and dinner in Imsouane.',
    path: '/restaurant',
    lang: locale,
  })
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let data = null
  try {
    const payload = await getPayload({ config })
    data = await payload.findGlobal({
      slug: 'restaurant-page',
      locale,
      depth: 2,
    })
  } catch {
    // CMS data unavailable — RestaurantClient will use built-in fallbacks
  }

  return <RestaurantClient lang={locale} data={data} />
}
