'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Star,
  ChevronDown,
  MapPin,
  Waves,
  UtensilsCrossed,
  Sun,
  Heart,
  ArrowRight,
  Anchor,
  Leaf,
  Flame,
  Shield,
  Wifi,
} from 'lucide-react'
import { Footer } from '@/components/footer'
import { HeroVideo } from '@/components/hero-video'
import { ICON_MAP } from '@/lib/iconMap'
import { getMediaUrl as getMediaUrlShared } from '@/lib/getMediaUrl'
import { BLUR_DATA_URL } from '@/lib/blurDataUrl'
import type { Homepage, Media } from '@/payload-types'

// ─── Lazy-loaded below-the-fold sections ────────────────────────────
const RoomsSection = dynamic(() => import('./sections/RoomsSection'))
const SurfSection = dynamic(() => import('./sections/SurfSection'))
const PackagesSection = dynamic(() => import('./sections/PackagesSection'))
const RentalsSection = dynamic(() => import('./sections/RentalsSection'))
const RestaurantSection = dynamic(() => import('./sections/RestaurantSection'))
const WhySection = dynamic(() => import('./sections/WhySection'))
// Reviews: uses embla-carousel + auto-scroll (client-only runtime) — keep SSR off to avoid shipping on initial HTML paint
const ReviewsSection = dynamic(() => import('./sections/ReviewsSection'), { ssr: false })
// Gallery: uses swiper + YARL lightbox (heaviest; content is visual only, not needed in SSR)
const GallerySection = dynamic(() => import('./sections/GallerySection'), { ssr: false })
const LocationSection = dynamic(() => import('./sections/LocationSection'))

// ─── Helpers ─────────────────────────────────────────────────────────
const getMediaUrl = (media: string | Media | null | undefined, size?: 'thumbnail' | 'card' | 'hero' | 'hero2x'): string =>
  getMediaUrlShared(media, size)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFirstImageUrl = (images: any[] | null | undefined, size: 'thumbnail' | 'card' | 'hero' | 'hero2x' = 'card'): string => {
  if (!images?.length) return ''
  const img = images[0]?.image
  return getMediaUrlShared(img, size)
}

// ─── Animation Helpers ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

// Fixed bento grid layout pattern (repeats every 5 images):
// 1 large (2×2) + 2 small (1×1) + 2 small (1×1)
const GALLERY_LAYOUT_PATTERN = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
]

const philosophyIcons = [Anchor, Leaf, Flame, Heart]
const stripIcons = [MapPin, Star, UtensilsCrossed, Sun, Wifi, Shield]

const experienceIcons = [Waves, UtensilsCrossed, Heart]

// ─── Main Component ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HomeClient({ lang, data, roomsDocs, packagesDocs, activitiesDocs }: { lang: 'en' | 'fr'; data?: Homepage | null; roomsDocs?: any[]; packagesDocs?: any[]; activitiesDocs?: any[] }) {
  // ─── CMS Sections ─────────────────────────────────────────────────
  const hero = data?.heroSection
  const about = data?.aboutSection
  const roomsSec = data?.roomsSection
  const surf = data?.surfSection
  const pkgSec = data?.packagesSection
  const restaurant = data?.restaurantSection
  const strip = data?.featureStrip
  const reviewsSec = data?.reviewsSection
  const gallery = data?.gallerySection
  const loc = data?.locationSection
  const footerCms = data?.footer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rentalsSec = (data as any)?.rentalsSection

  // ─── Resolve arrays ───────────────────────────────────────────────
  // Rooms: use featured relationship if populated, then all roomsDocs, then fallback
  const featuredRoomsDocs = (() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const featured = (roomsSec as any)?.featuredRooms
    if (Array.isArray(featured) && featured.length > 0 && typeof featured[0] === 'object') return featured
    if (roomsDocs && roomsDocs.length > 0) return roomsDocs
    return null
  })()

  const rooms = featuredRoomsDocs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? featuredRoomsDocs.map((r: any) => ({
        name: r.name || '',
        slug: r.slug || '',
        detail: r.detail || '',
        description: r.description || '',
        price: r.price ?? 0,
        priceBreakfast: r.priceBreakfast ?? null,
        rating: r.rating || '',
        imageUrl: getFirstImageUrl(r.images),
      }))
    : []

  // Activities: source from the activities collection (same as /surf page),
  // then prefer the `featuredActivities` relationship on the surf section if set,
  // otherwise show the first 2 lesson-type activities.
  const activities = (() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const featured = (surf as any)?.featuredActivities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const source: any[] = Array.isArray(featured) && featured.length > 0 && typeof featured[0] === 'object'
      ? featured
      : (activitiesDocs ?? [])
    return source
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((a: any) => a.activityType === 'lesson' || !a.activityType)
      .slice(0, 2)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((a: any) => ({
        title: a.title || '',
        badge: a.badge || '',
        duration: a.duration || '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        features: a.features?.map((f: any) => f.label) || [],
        price: a.price ?? 0,
        priceUnit: a.priceUnit || '',
        bookingLink: a.bookingLink || '',
        bookingText: a.bookingText || 'Book Now',
        imageUrl: getFirstImageUrl(a.images),
      }))
  })()

  // Packages: use featured relationship if populated, then all packagesDocs, then fallback
  const featuredPackagesDocs = (() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const featured = (pkgSec as any)?.featuredPackages
    if (Array.isArray(featured) && featured.length > 0 && typeof featured[0] === 'object') return featured
    if (packagesDocs && packagesDocs.length > 0) return packagesDocs
    return null
  })()

  const packages = featuredPackagesDocs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? featuredPackagesDocs.map((p: any) => ({
        title: p.title || '',
        slug: p.slug || '',
        duration: p.duration || '',
        category: p.category || '',
        highlight: p.highlight || false,
        images: p.images?.length
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? p.images.map((img: any) => {
              const media = img?.image
              if (!media || typeof media === 'string') return ''
              return media.url || ''
            }).filter(Boolean)
          : [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        features: p.features?.map((f: any) => f.label) || [],
        price: p.price ?? 0,
        whatsappMsg: p.waMessage || '',
      }))
    : []

  const meals = restaurant?.meals?.length
    ? restaurant.meals.map((m) => ({
        title: m.title,
        time: m.time || '',
        desc: m.description || '',
        imageUrl: getMediaUrl(m.image, 'card'),
      }))
    : []

  const philosophy = restaurant?.philosophy?.length
    ? restaurant.philosophy.map((p, i) => ({
        icon: philosophyIcons[i] || Heart,
        title: p.title,
        desc: p.description || '',
      }))
    : []

  const featureStripItems = strip?.features?.length
    ? strip.features.map((f, i) => ({
        icon: stripIcons[i] || Star,
        value: f.value,
        label: f.label,
      }))
    : []

  const ratingBadges = reviewsSec?.ratingBadges?.length
    ? reviewsSec.ratingBadges
    : [
        { score: '9.7', source: 'Booking.com', label: 'Exceptional', href: 'https://www.booking.com/hotel/ma/lina-imsouane.en-gb.html' },
        { score: '9.4', source: 'Hostelworld', label: 'Superb', href: 'https://www.hostelworld.com/fr/auberges-de-jeunesse/p/329360/lina-house/' },
        { score: '4.9', source: 'Google', label: '145 reviews', href: `https://search.google.com/local/reviews?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'ChIJaY7O18Bfsg0Rq0043SeE7so'}` },
      ]

  // Gallery: images is now a hasMany relationship (array of Media | string)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const galleryImages = (gallery?.images as any[])?.length
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (gallery!.images as any[]).map((img: any, idx: number) => ({
        url: getMediaUrl(img, 'card'),
        layout: GALLERY_LAYOUT_PATTERN[idx % GALLERY_LAYOUT_PATTERN.length],
      })).filter((i) => i.url)
    : []

  const routes = loc?.routes?.length
    ? loc.routes.map((r) => ({ from: r.from, time: r.time }))
    : []

  const aboutStats = about?.stats?.length
    ? about.stats
    : [
        { value: '500m', label: 'From Magic Bay' },
        { value: '9.7/10', label: 'Guest Rating' },
        { value: '365', label: 'Days of Sunshine' },
        { value: '23', label: 'Cozy Beds' },
      ]

  const aboutFeatures = about?.experienceFeatures?.length
    ? about.experienceFeatures.map((f, i) => ({
        icon: experienceIcons[i] || Heart,
        title: f.title,
        desc: f.description,
      }))
    : [
        { icon: Waves, title: 'Surf', desc: 'World-class waves steps from your door. Lessons for all levels with experienced local instructors.' },
        { icon: UtensilsCrossed, title: 'Food', desc: 'Fresh fish from the harbour, traditional tagines, and wood-fire BBQ every evening on our terrace.' },
        { icon: Heart, title: 'Home', desc: 'A warm, welcoming space with ocean views, rooftop terrace, and the feeling of being part of a community.' },
      ]

  return (
    <main className="bg-sand-light overflow-x-hidden">
      {/* ══════════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {(hero as any)?.heroVideoUrl ? (
          <HeroVideo
            videoUrl={(hero as any).heroVideoUrl}
            mobileVideoUrl={(hero as any).heroVideoMobileUrl || undefined}
            webmUrl={(hero as any).heroVideoWebmUrl || undefined}
            mobileWebmUrl={(hero as any).heroVideoMobileWebmUrl || undefined}
            posterUrl={(hero as any).heroPosterUrl || undefined}
          />
        ) : getMediaUrl(hero?.backgroundImage, 'hero2x') ? (
          <Image
            src={getMediaUrl(hero?.backgroundImage, 'hero2x')}
            alt="Imsouane coastline aerial view"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        ) : null}
        <div
          className={`absolute inset-0 ${
            (hero as any)?.heroVideoUrl
              ? 'bg-gradient-to-b from-black/10 via-transparent to-black/50'
              : 'bg-gradient-to-b from-black/30 via-[#1B4965]/60 to-[#1B4965]/90'
          }`}
        />

        <div className="relative z-10 h-screen flex flex-col items-center justify-center px-6 sm:px-20 max-w-[1280px] mx-auto text-center">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <h1
              className="text-5xl sm:text-7xl lg:text-8xl font-normal text-white tracking-tight leading-[1.05]"
              style={{ textShadow: '0 0 2px rgba(0,0,0,0.85), 0 3px 14px rgba(0,0,0,0.6)' }}
            >
              {hero?.headline ?? 'Lina House'}
            </h1>

            <p
              className="text-white text-xl sm:text-3xl font-light max-w-[700px] tracking-wide"
              style={{ textShadow: '0 0 2px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.55)' }}
            >
              {hero?.tagline ?? 'Surf. Stay. Discover Imsouane.'}
            </p>

            <p
              className="text-white/90 text-base sm:text-lg max-w-[550px] leading-relaxed"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
            >
              {hero?.description ?? 'A beachfront surf camp & hostel just 500m from the legendary Magic Bay \u2014 home to the longest wave in Africa'}
            </p>

            {/* Quick highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-2">
              {(hero?.highlights ?? [
                { icon: 'waves' as const, label: 'Surf Lessons' },
                { icon: 'utensils' as const, label: 'Restaurant' },
                { icon: 'star' as const, label: '9.7/10 Rating' },
                { icon: 'sun' as const, label: 'Rooftop Terrace' },
              ]).map((item) => {
                const Icon = ICON_MAP[item.icon] || Star
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-white"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                  >
                    <Icon className="w-4 h-4 text-azure-light" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <a
                href={hero?.primaryButtonLink ?? '#rooms'}
                className="inline-flex items-center gap-2.5 px-9 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all text-base"
              >
                {hero?.primaryButtonText ?? 'Book Your Stay'}
                <ArrowRight className="w-[18px] h-[18px]" />
              </a>
              <a
                href={hero?.secondaryButtonLink ?? '#surf'}
                className="inline-flex items-center gap-2.5 px-9 py-4 bg-white/[0.09] hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/[0.33] transition-all text-base"
              >
                {hero?.secondaryButtonText ?? 'Surf Lessons'}
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-white/70" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ABOUT / WELCOME
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-[80px] bg-sand-light">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-[60px]"
          >
            {/* Left — Title + Text + Stats */}
            <motion.div variants={fadeUp} className="flex-1 flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl sm:text-[36px] text-[#222222] leading-tight">
                  {about?.title ?? 'Our house,'} <span className="font-display italic text-accent">{(about as any)?.titleAccent ?? 'a seven-minute walk from the sea'}</span>
                </h2>
                <p className="text-[#4A4A4A] text-base leading-[1.7]">
                  {about?.description ?? "Nestled in the charming fishing village of Imsouane, Lina House is more than a place to stay \u2014 it\u2019s a gateway to Morocco\u2019s most magical coastline. Whether you\u2019re here to surf, explore, or simply unwind, our doors are always open. Enjoy mornings on our rooftop terrace with panoramic ocean views, share stories with fellow travelers over wood-fire dinners, and immerse yourself in the slow, sun-soaked rhythm of village life."}
                </p>
              </div>

              {/* Stats 2x2 */}
              <div className="grid grid-cols-2 gap-4">
                {aboutStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white p-5 flex flex-col gap-2 shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
                  >
                    <span className="text-[28px] font-bold text-[#222222]">{stat.value}</span>
                    <span className="text-[#8A8A8A] text-[13px]">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Experience Card with background image */}
            <motion.div variants={fadeUp} className="w-full lg:w-[480px] shrink-0 rounded-2xl overflow-hidden relative min-h-[400px]">
              {getMediaUrl(about?.experienceImage, 'card') ? (
                <Image
                  src={getMediaUrl(about?.experienceImage, 'card')}
                  alt="Lina House experience"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 60vw, 480px"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-[#1B4965]/75" />
              <div className="relative z-10 p-8 sm:p-10 flex flex-col gap-8 h-full">
                <h3 className="font-bold text-[28px] text-white">
                  {about?.experienceTitle ?? 'The Lina House Experience'}
                </h3>
                <div className="w-[60px] h-[3px] bg-accent rounded-sm" />

                <div className="space-y-8">
                  {aboutFeatures.map((feat) => {
                    const Icon = feat.icon
                    return (
                      <div key={feat.title} className="flex gap-4">
                        <Icon className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1.5">
                          <h4 className="text-white font-semibold text-base">{feat.title}</h4>
                          <p className="text-white/70 text-sm leading-[1.6]">{feat.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <a
                  href={`/${lang}/about`}
                  className="inline-flex items-center justify-center w-fit px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all text-[15px] mt-auto"
                >
                  {about?.experienceButtonText ?? 'Explore What Awaits'}
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          Below-the-fold sections (lazy-loaded via next/dynamic)
          ══════════════════════════════════════════════════════════════ */}
      <RoomsSection lang={lang} rooms={rooms} roomsSec={roomsSec} />
      <SurfSection lang={lang} activities={activities} surf={surf} />
      <PackagesSection lang={lang} packages={packages} pkgSec={pkgSec} />
      <RentalsSection lang={lang} rentalsSection={rentalsSec} />
      <RestaurantSection
        lang={lang}
        meals={meals}
        philosophy={philosophy}
        restaurantHeroImage={getMediaUrl(restaurant?.heroImage, 'hero')}
        restaurant={restaurant}
      />
      <WhySection featureStripItems={featureStripItems} />
      <ReviewsSection reviewsSec={reviewsSec} ratingBadges={ratingBadges} />
      <GallerySection galleryImages={galleryImages} gallery={gallery} />
      <LocationSection loc={loc} routes={routes} />

      {/* Footer */}
      <Footer
        cmsData={{
          brandDescription: footerCms?.brandDescription || undefined,
          copyrightText: footerCms?.copyrightText || undefined,
          phone: loc?.phone || undefined,
          email: loc?.email || undefined,
          whatsappNumber: loc?.whatsappNumber || undefined,
          location: loc?.address || undefined,
          instagramUrl: loc?.instagramUrl || undefined,
          tiktokUrl: loc?.tiktokUrl || undefined,
        }}
      />
    </main>
  )
}
