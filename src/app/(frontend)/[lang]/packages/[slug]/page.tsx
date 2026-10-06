import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import PackageDetailClient from './PackageDetailClient'
import { buildPageMetadata } from '@/lib/seo'

const packageMeta: Record<string, { en: { title: string; desc: string }; fr: { title: string; desc: string } }> = {
  'stay-eat': {
    en: { title: 'Stay & Eat Package | Lina House', desc: 'Cozy rooms with ocean views, fresh Moroccan breakfast, and home-cooked dinners. From €31.22/night in Imsouane.' },
    fr: { title: 'Forfait Séjour & Repas | Lina House', desc: 'Chambres confortables avec vue sur l\'océan, petit-déjeuner marocain et dîners maison. À partir de €31,22/nuit à Imsouane.' },
  },
  'full-surf': {
    en: { title: 'Full Surf Pack | Lina House', desc: 'The complete Imsouane experience — accommodation, all meals, daily surf lessons & equipment. From €49.63/night.' },
    fr: { title: 'Pack Surf Complet | Lina House', desc: 'L\'expérience complète d\'Imsouane — hébergement, repas, cours de surf quotidiens et équipement. À partir de €49,63/nuit.' },
  },
  'surf-only': {
    en: { title: 'Surf Only | Lina House', desc: 'Join our group surf sessions with pro instructors. All equipment provided. €18.42 per session in Imsouane.' },
    fr: { title: 'Surf Uniquement | Lina House', desc: 'Rejoignez nos sessions de surf en groupe avec des moniteurs pro. Tout l\'équipement fourni. €18,42 par session.' },
  },
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'packages',
      limit: 100,
      depth: 0,
      select: { slug: true },
    })
    return result.docs.map((doc: any) => ({ slug: doc.slug }))
  } catch {
    return Object.keys(packageMeta).map((slug) => ({ slug }))
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = lang as 'en' | 'fr'

  let pkg: any = null
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'packages',
      where: { slug: { equals: slug } },
      locale,
      depth: 1,
      limit: 1,
    })
    pkg = result.docs[0]
  } catch {}

  const fallback = packageMeta[slug]?.[locale === 'fr' ? 'fr' : 'en']
  return buildPageMetadata({
    cms: pkg?.seo,
    fallbackTitle: pkg?.title ? `${pkg.title} | Lina House` : (fallback?.title ?? 'Packages | Lina House'),
    fallbackDescription: pkg?.description || fallback?.desc || '',
    path: `/packages/${slug}`,
    lang: locale,
  })
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = lang as 'en' | 'fr'

  let packageDoc: any = null
  let allPackagesDocs: any[] = []
  let allRoomsDocs: any[] = []

  try {
    const payload = await getPayload({ config })
    const [result, allPackages, allRooms] = await Promise.all([
      payload.find({
        collection: 'packages',
        where: { slug: { equals: slug } },
        locale,
        depth: 1,
        limit: 1,
      }),
      payload.find({
        collection: 'packages',
        sort: 'order',
        locale,
        depth: 1,
        limit: 20,
      }),
      payload.find({
        collection: 'rooms',
        sort: 'order',
        locale,
        depth: 0,
        limit: 50,
      }),
    ])
    packageDoc = result.docs[0] || null
    allPackagesDocs = allPackages.docs
    allRoomsDocs = allRooms.docs
  } catch {
    // CMS unavailable
  }

  // CMS-only: 404 if no CMS data (packageMeta kept as backup but not used for routing)
  if (!packageDoc) notFound()

  return (
    <PackageDetailClient
      lang={locale}
      slug={slug}
      pkg={packageDoc}
      allPackages={allPackagesDocs}
      allRooms={allRoomsDocs}
    />
  )
}
