import { Metadata } from 'next'
import { Suspense } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import BookingClient from './BookingClient'
import type { ActivityDoc, PackageDoc, RoomDoc } from './lib/types'
import { fetchTransferContent } from '@/lib/transferRoutes.server'
import type { TransferRoute } from '@/lib/transferRoutes'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Book Your Stay | Lina House',
  description:
    'Complete your booking at Lina House surf camp in Imsouane, Morocco. Rooms, packages, and surf lessons — no credit card required.',
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let rooms: RoomDoc[] = []
  let packages: PackageDoc[] = []
  let activities: ActivityDoc[] = []
  let transferRoutes: TransferRoute[] = []
  let googleAdsConversionId = ''
  let googleAdsConversionLabel = ''

  try {
    const payload = await getPayload({ config })
    const [roomsRes, packagesRes, activitiesRes, transferContent, siteSettingsRes] = await Promise.all([
      payload.find({ collection: 'rooms', sort: 'order', locale, depth: 1, limit: 30 }),
      payload.find({ collection: 'packages', sort: 'order', locale, depth: 1, limit: 30 }),
      payload.find({ collection: 'activities', sort: 'order', locale, depth: 1, limit: 30 }),
      fetchTransferContent(locale),
      payload.findGlobal({ slug: 'site-settings' }),
    ])
    rooms = roomsRes.docs as unknown as RoomDoc[]
    packages = packagesRes.docs as unknown as PackageDoc[]
    activities = activitiesRes.docs as unknown as ActivityDoc[]
    transferRoutes = transferContent.routes
    const settings = siteSettingsRes as { googleAdsConversionId?: string; googleAdsConversionLabel?: string }
    googleAdsConversionId = settings.googleAdsConversionId ?? ''
    googleAdsConversionLabel = settings.googleAdsConversionLabel ?? ''
  } catch {
    // CMS unavailable — BookingClient handles empty state
  }

  return (
    <Suspense>
      <BookingClient
        lang={locale}
        rooms={rooms}
        packages={packages}
        activities={activities}
        transferRoutes={transferRoutes}
        googleAdsConversionId={googleAdsConversionId}
        googleAdsConversionLabel={googleAdsConversionLabel}
      />
    </Suspense>
  )
}
