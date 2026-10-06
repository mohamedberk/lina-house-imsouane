import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import AboutClient from './AboutClient'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'
  const isEn = locale === 'en'

  let cmsSeo
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'about-page', locale, depth: 1 })
    cmsSeo = (data as { seo?: typeof cmsSeo })?.seo
  } catch {}

  return buildPageMetadata({
    cms: cmsSeo,
    fallbackTitle: isEn
      ? 'About | Lina House - Surf Camp Imsouane'
      : 'À propos | Lina House - Surf Camp Imsouane',
    fallbackDescription: isEn
      ? 'Discover Lina House — a surf camp, hostel & restaurant in Imsouane, Morocco. 500m from Magic Bay, rated 9.7/10 on Booking.com.'
      : 'Découvrez Lina House — un surf camp, auberge & restaurant à Imsouane, Maroc. 500m de Magic Bay, noté 9.7/10 sur Booking.com.',
    fallbackKeywords: 'surf camp, hostel, Imsouane, Morocco, Lina House, Magic Bay, surfing, accommodation, restaurant',
    path: '/about',
    lang: locale,
  })
}

export const revalidate = 60

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let aboutData = null

  try {
    const payload = await getPayload({ config })
    aboutData = await payload.findGlobal({
      slug: 'about-page',
      locale,
      depth: 2,
    })
  } catch {
    // CMS unavailable — AboutClient will use built-in fallbacks
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LodgingBusiness',
            name: 'Lina House',
            description: 'Surf camp, hostel & restaurant in Imsouane, Morocco',
            url: 'https://linahouse-imsouane.com',
            telephone: '+212772228120',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'N0 Route Amadel',
              addressLocality: 'Imsouane',
              addressRegion: 'Souss-Massa',
              addressCountry: 'MA',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 30.8427,
              longitude: -9.8217,
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '9.7',
              bestRating: '10',
              reviewCount: '22',
            },
          }),
        }}
      />
      <AboutClient lang={locale} data={aboutData} />
    </>
  )
}
