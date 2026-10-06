import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import ActivityDetailClient from './ActivityDetailClient'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'activities',
      limit: 100,
      depth: 0,
      select: { slug: true },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result.docs.map((doc: any) => ({ slug: doc.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = lang as 'en' | 'fr'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let activity: any = null
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'activities',
      where: { slug: { equals: slug } },
      locale,
      depth: 1,
      limit: 1,
    })
    activity = result.docs[0]
  } catch {}

  return buildPageMetadata({
    cms: activity?.seo,
    fallbackTitle: activity?.title ? `${activity.title} | Lina House` : 'Surf | Lina House',
    fallbackDescription: activity?.tagline || activity?.description || '',
    path: `/surf/${slug}`,
    lang: locale,
  })
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = lang as 'en' | 'fr'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let activityDoc: any = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allActivitiesDocs: any[] = []

  try {
    const payload = await getPayload({ config })
    const [result, allActivities] = await Promise.all([
      payload.find({
        collection: 'activities',
        where: { slug: { equals: slug } },
        locale,
        depth: 1,
        limit: 1,
      }),
      payload.find({
        collection: 'activities',
        sort: 'order',
        locale,
        depth: 1,
        limit: 20,
      }),
    ])
    activityDoc = result.docs[0] || null
    allActivitiesDocs = allActivities.docs
  } catch {
    // CMS unavailable
  }

  if (!activityDoc) notFound()

  return (
    <ActivityDetailClient
      lang={locale}
      slug={slug}
      activity={activityDoc}
      allActivities={allActivitiesDocs}
    />
  )
}
