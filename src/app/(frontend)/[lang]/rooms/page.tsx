import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import RoomsClient from './RoomsClient'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

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
    const data = await payload.findGlobal({ slug: 'rooms-page', locale, depth: 1 })
    cmsSeo = (data as { seo?: typeof cmsSeo })?.seo
  } catch {}

  const isFr = locale === 'fr'
  return buildPageMetadata({
    cms: cmsSeo,
    fallbackTitle: isFr ? 'Chambres & Hébergement | Lina House' : 'Rooms & Accommodation | Lina House',
    fallbackDescription: isFr
      ? 'Découvrez nos chambres privées, dortoirs et appartements à Imsouane. À partir de €13,08/nuit. Vue océan, Wi-Fi gratuit, petit-déjeuner inclus.'
      : 'Explore our private rooms, dorms and apartments in Imsouane. From €13.08/night. Ocean views, free WiFi, breakfast included.',
    path: '/rooms',
    lang: locale,
  })
}

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let roomsDocs: any[] = []
  let pageData: any = null
  try {
    const payload = await getPayload({ config })
    const [roomsResult, roomsPage] = await Promise.all([
      payload.find({
        collection: 'rooms',
        sort: 'order',
        locale,
        depth: 1,
        limit: 20,
      }),
      payload.findGlobal({ slug: 'rooms-page', locale, depth: 1 }),
    ])
    roomsDocs = roomsResult.docs
    pageData = roomsPage
  } catch {
    // CMS unavailable — client will use fallbacks
  }

  return <RoomsClient lang={locale} rooms={roomsDocs} pageData={pageData} />
}
