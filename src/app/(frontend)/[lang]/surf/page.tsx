import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import SurfClient from './SurfClient'
import { fetchTransferContent } from '@/lib/transferRoutes.server'
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
    const data = await payload.findGlobal({ slug: 'surf-page', locale, depth: 1 })
    cmsSeo = (data as { seo?: typeof cmsSeo })?.seo
  } catch {}

  const isFr = locale === 'fr'
  return buildPageMetadata({
    cms: cmsSeo,
    fallbackTitle: isFr ? 'Surf & Cours | Lina House' : 'Surf & Lessons | Lina House',
    fallbackDescription: isFr
      ? 'Cours de surf, location de matériel et vagues de classe mondiale à Imsouane. Cours privés dès €27,62, location de planche dès €5,52/jour.'
      : 'Surf lessons, equipment rental and world-class waves in Imsouane. Private lessons from €27.62, board rental from €5.52/day.',
    path: '/surf',
    lang: locale,
  })
}

export default async function SurfPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let activitiesDocs: any[] = []
  let pageData: any = null
  try {
    const payload = await getPayload({ config })
    const [activitiesResult, surfPage] = await Promise.all([
      payload.find({
        collection: 'activities',
        sort: 'order',
        locale,
        depth: 1,
        limit: 20,
      }),
      payload.findGlobal({ slug: 'surf-page', locale, depth: 1 }),
    ])
    activitiesDocs = activitiesResult.docs
    pageData = surfPage
  } catch {
    // CMS unavailable
  }

  const transferContent = await fetchTransferContent(locale)

  return <SurfClient lang={locale} activities={activitiesDocs} pageData={pageData} transferContent={transferContent} />
}
