import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import PackagesClient from './PackagesClient'
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
    const data = await payload.findGlobal({ slug: 'packages-page', locale, depth: 1 })
    cmsSeo = (data as { seo?: typeof cmsSeo })?.seo
  } catch {}

  const isFr = locale === 'fr'
  return buildPageMetadata({
    cms: cmsSeo,
    fallbackTitle: isFr ? 'Packages & Formules | Lina House' : 'Packages & Deals | Lina House',
    fallbackDescription: isFr
      ? 'Forfaits surf tout compris à Imsouane. Hébergement, repas, cours de surf et équipement. À partir de €18,42.'
      : 'All-inclusive surf packages in Imsouane. Accommodation, meals, surf lessons and equipment. From €18.42.',
    path: '/packages',
    lang: locale,
  })
}

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let packagesDocs: any[] = []
  let pageData: any = null
  try {
    const payload = await getPayload({ config })
    const [packagesResult, packagesPage] = await Promise.all([
      payload.find({
        collection: 'packages',
        sort: 'order',
        locale,
        depth: 1,
        limit: 20,
      }),
      payload.findGlobal({ slug: 'packages-page', locale, depth: 1 }),
    ])
    packagesDocs = packagesResult.docs
    pageData = packagesPage
  } catch {
    // CMS unavailable
  }

  return <PackagesClient lang={locale} packages={packagesDocs} pageData={pageData} />
}
