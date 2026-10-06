import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import RoomDetailClient from './RoomDetailClient'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

const roomMeta: Record<string, { en: { title: string; desc: string }; fr: { title: string; desc: string } }> = {
  single: {
    en: { title: 'Single Room | Lina House', desc: 'Private single room at Lina House surf camp in Imsouane. Cozy retreat with shared bathroom. From €18.14/night.' },
    fr: { title: 'Chambre Simple | Lina House', desc: 'Chambre simple privée au surf camp Lina House à Imsouane. Retraite confortable avec salle de bain partagée. À partir de €18,14/nuit.' },
  },
  double: {
    en: { title: 'Double Room | Lina House', desc: 'Private double room with ocean view at Lina House Imsouane. Our most popular room. From €28.27/night.' },
    fr: { title: 'Chambre Double | Lina House', desc: 'Chambre double privée avec vue sur l\'océan à Lina House Imsouane. Notre chambre la plus populaire. À partir de €28,27/nuit.' },
  },
  twin: {
    en: { title: 'Twin Room | Lina House', desc: 'Twin room with two beds at Lina House surf camp Imsouane. Perfect for friends. From €28.27/night.' },
    fr: { title: 'Chambre Twin | Lina House', desc: 'Chambre twin avec deux lits au surf camp Lina House à Imsouane. Parfaite pour les amis. À partir de €28,27/nuit.' },
  },
  'female-dorm': {
    en: { title: 'Female Dorm | Lina House', desc: 'Female-only dorm at Lina House Imsouane. Safe, social, and budget-friendly. From €13.08/night.' },
    fr: { title: 'Dortoir Féminin | Lina House', desc: 'Dortoir féminin à Lina House Imsouane. Sûr, convivial et économique. À partir de €13,08/nuit.' },
  },
  'male-dorm': {
    en: { title: 'Male Dorm | Lina House', desc: 'Male-only dorm at Lina House Imsouane. Social vibes, great value. From €13.08/night.' },
    fr: { title: 'Dortoir Masculin | Lina House', desc: 'Dortoir masculin à Lina House Imsouane. Ambiance sociale, bon rapport qualité-prix. À partir de €13,08/nuit.' },
  },
  apartment: {
    en: { title: 'Private Apartment | Lina House', desc: 'Full private apartment at Lina House Imsouane. Kitchen, shower, and space for 4 guests. From €65.84/night.' },
    fr: { title: 'Appartement Privé | Lina House', desc: 'Appartement privé complet à Lina House Imsouane. Cuisine, douche et espace pour 4 personnes. À partir de €65,84/nuit.' },
  },
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'rooms',
      limit: 100,
      depth: 0,
      select: { slug: true },
    })
    return result.docs.map((doc: any) => ({ slug: doc.slug }))
  } catch {
    return Object.keys(roomMeta).map((slug) => ({ slug }))
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = lang as 'en' | 'fr'

  let room: any = null
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'rooms',
      where: { slug: { equals: slug } },
      locale,
      depth: 1,
      limit: 1,
    })
    room = result.docs[0]
  } catch {}

  const fallback = roomMeta[slug]?.[locale === 'fr' ? 'fr' : 'en']
  return buildPageMetadata({
    cms: room?.seo,
    fallbackTitle: room?.name ? `${room.name} | Lina House` : (fallback?.title ?? 'Rooms | Lina House'),
    fallbackDescription: room?.description || room?.detail || fallback?.desc || '',
    path: `/rooms/${slug}`,
    lang: locale,
  })
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = lang as 'en' | 'fr'

  let roomDoc: any = null
  let allRoomsDocs: any[] = []

  try {
    const payload = await getPayload({ config })
    const [result, allRooms] = await Promise.all([
      payload.find({
        collection: 'rooms',
        where: { slug: { equals: slug } },
        locale,
        depth: 1,
        limit: 1,
      }),
      payload.find({
        collection: 'rooms',
        sort: 'order',
        locale,
        depth: 1,
        limit: 20,
      }),
    ])
    roomDoc = result.docs[0] || null
    allRoomsDocs = allRooms.docs
  } catch {
    // CMS unavailable
  }

  // CMS-only: 404 if no CMS data (roomMeta kept as backup but not used for routing)
  if (!roomDoc) notFound()

  return <RoomDetailClient lang={locale} slug={slug} room={roomDoc} allRooms={allRoomsDocs} />
}
