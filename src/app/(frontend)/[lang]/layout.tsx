import '../../globals.css'
import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ClientLayout } from '@/components/client-layout'
import { Toaster } from 'sonner'
import { OrganizationSchema, LocalBusinessSchema, RestaurantSchema, TouristAttractionSchema, PackagesOfferCatalogSchema, FAQSchema } from '@/components/seo/structured-data'
import { Analytics } from '@vercel/analytics/react'
import { MetaPixelLazy } from '@/components/meta-pixel-lazy'
import { ServiceWorkerRegister } from '@/components/sw-register'
import GoogleAdsScript from '@/components/google-ads-script'
import { getPayload } from 'payload'
import config from '@payload-config'

// Revalidate ALL pages every 1 second to pick up CMS changes instantly
export const revalidate = 3600

const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]

const LINA_HOUSE_FAQS = [
  {
    question: "Where is Lina House located?",
    answer: "Lina House is located in Imsouane, Morocco, at N0 Route Amadel, Lotissement Amadel — a 500m walk from Magic Bay."
  },
  {
    question: "How far is Lina House from the beach / surf spot?",
    answer: "Lina House is a 500m walk from Magic Bay, home to one of the longest right-hand waves in Africa."
  },
  {
    question: "What is the price range at Lina House?",
    answer: "Rooms at Lina House range from €13 to €50 per night, depending on room type and season."
  },
  {
    question: "Does Lina House offer surf lessons?",
    answer: "Yes — Lina House offers group and private surf lessons with certified local instructors at Magic Bay, and surfboard rental is available."
  },
  {
    question: "Does Lina House have a restaurant?",
    answer: "Yes — Lina House has an in-house restaurant serving homemade Moroccan and international cuisine on the rooftop terrace with ocean views."
  },
  {
    question: "How do I contact Lina House?",
    answer: "You can contact Lina House by WhatsApp or phone at +212 772-228120, by email at contact@linahouse.com, or via the booking page on linahouse-imsouane.com."
  },
  {
    question: "What is the rating of Lina House?",
    answer: "Lina House is rated 9.7 out of 10 based on 256 guest reviews."
  },
  {
    question: "What languages does the Lina House website support?",
    answer: "The Lina House website is available in English and French."
  }
]

// DM Serif Display — display/headings (single weight)
const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif',
  weight: '400',
  preload: true,
  fallback: ['Georgia', 'serif'],
})

// DM Sans — body + UI (two weights)
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '700'],
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
})

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

// Separate viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover'
}

// Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://linahouse-imsouane.com'),
  title: {
    default: 'Lina House | Surf Camp & Hostel in Imsouane, Morocco',
    template: '%s | Lina House'
  },
  description: "Surf, stay and discover Imsouane. 9.7/10 rated hostel, 500m from the beach. Surf lessons, homemade restaurant, rooftop terrace with ocean views.",
  keywords: ['Imsouane surf camp', 'Imsouane hostel', 'Morocco surf', 'Lina House', 'Magic Bay surf', 'Imsouane accommodation', 'surf Morocco'],
  authors: [{ name: 'Lina House' }],
  creator: 'Lina House',
  alternates: {
    canonical: 'https://linahouse-imsouane.com',
    languages: {
      'en': 'https://linahouse-imsouane.com/en',
      'fr': 'https://linahouse-imsouane.com/fr',
      'x-default': 'https://linahouse-imsouane.com/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR'],
    url: 'https://linahouse-imsouane.com',
    title: 'Lina House | Surf Camp & Hostel in Imsouane, Morocco',
    description: "Surf, stay and discover Imsouane. 9.7/10 rated hostel, 500m from the beach. Surf lessons, homemade restaurant, rooftop terrace with ocean views.",
    siteName: 'Lina House',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lina House | Surf Camp & Hostel in Imsouane, Morocco',
    description: "Surf, stay and discover Imsouane. 9.7/10 rated hostel, 500m from the beach. Surf lessons, homemade restaurant, rooftop terrace with ocean views.",
    creator: '@linahouse',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // Validate locale
  if (!locales.includes(lang as Locale)) {
    notFound()
  }

  // Fetch site settings for tracking codes
  const payload = await getPayload({ config })
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
  })

  return (
    <html lang={lang} suppressHydrationWarning className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://utfs.io" crossOrigin="" />
        <link rel="preconnect" href="https://0kswbexj9c.ufs.sh" crossOrigin="" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

        {/* Meta Pixel loads lazily after first user interaction — see MetaPixelLazy below */}

        {/* Google Ads Tracking - Configured in Admin */}
        <GoogleAdsScript googleAdsId={siteSettings?.googleAdsId as string | undefined} />
      </head>
      <body className={dmSans.className}>
        {/* Structured Data for LLM & Search Engines */}
        <OrganizationSchema lastUpdated={new Date().toISOString()} />
        <LocalBusinessSchema lastUpdated={new Date().toISOString()} />
        <RestaurantSchema />
        <TouristAttractionSchema />
        <PackagesOfferCatalogSchema />
        <FAQSchema faqs={LINA_HOUSE_FAQS} />

        <Toaster position="top-center" expand={false} richColors />
        <Suspense fallback={null}>
            <ClientLayout>
              {children}
            </ClientLayout>
        </Suspense>
        <Analytics />
        <MetaPixelLazy />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
