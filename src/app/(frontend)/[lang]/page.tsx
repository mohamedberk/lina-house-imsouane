import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import HomeClient from './HomeClient'
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
    const data = await payload.findGlobal({ slug: 'homepage', locale, depth: 1 })
    cmsSeo = (data as { seo?: typeof cmsSeo })?.seo
  } catch {}

  const isFr = locale === 'fr'
  return buildPageMetadata({
    cms: cmsSeo,
    fallbackTitle: isFr
      ? 'Lina House | Surf Camp & Hostel à Imsouane, Maroc'
      : 'Lina House | Surf Camp & Hostel in Imsouane, Morocco',
    fallbackDescription: isFr
      ? 'Surf, séjour et découverte à Imsouane. Hostel noté 9.7/10, à 500m de la plage. Cours de surf, restaurant maison, terrasse rooftop avec vue océan.'
      : 'Surf, stay and discover Imsouane. 9.7/10 rated hostel, 500m from the beach. Surf lessons, homemade restaurant, rooftop terrace with ocean views.',
    path: '/',
    lang: locale,
  })
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let homepageData = null
  let roomsData: any[] = []
  let packagesData: any[] = []
  let activitiesData: any[] = []

  try {
    const payload = await getPayload({ config })

    const [homepage, rooms, packages, activities] = await Promise.all([
      payload.findGlobal({
        slug: 'homepage',
        locale,
        depth: 2,
      }),
      payload.find({
        collection: 'rooms',
        sort: 'order',
        locale,
        depth: 1,
        limit: 20,
      }),
      payload.find({
        collection: 'packages',
        sort: 'order',
        locale,
        depth: 1,
        limit: 20,
      }),
      payload.find({
        collection: 'activities',
        sort: 'order',
        locale,
        depth: 1,
        limit: 20,
      }),
    ])

    homepageData = homepage
    roomsData = rooms.docs
    packagesData = packages.docs
    activitiesData = activities.docs
  } catch {
    // CMS data unavailable — HomeClient will use built-in fallbacks
  }

  return (
    <HomeClient
      lang={locale}
      data={homepageData}
      roomsDocs={roomsData}
      packagesDocs={packagesData}
      activitiesDocs={activitiesData}
    />
  )
}
