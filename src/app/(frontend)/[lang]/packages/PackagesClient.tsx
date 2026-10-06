'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Star } from 'lucide-react'
import { Footer } from '@/components/footer'
import { useCurrency } from '@/components/currency-switcher'

// ─── Package Data ────────────────────────────────────────────────────
interface Package {
  id: string
  slug: string
  label: string
  price: number
  priceUnit: string
  tagline: string
  description: string
  includes: string[]
  inclLabel: string
  ctaText: string
  waMessage: string
  image: string
  cardSide: 'left' | 'right'
  cardStyle: 'white' | 'blue'
  badge?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMediaUrl = (media: any): string => {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media.url || ''
}

const cardSides: Array<'left' | 'right'> = ['right', 'left', 'right']
const cardStyles: Array<'white' | 'blue'> = ['white', 'blue', 'white']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCmsPackages(docs: any[]): Package[] {
  return docs.map((p, i) => ({
    id: p.slug || p.id,
    slug: p.slug || '',
    label: (p.title || '').toUpperCase(),
    price: p.price || 0,
    priceUnit: p.priceUnit || '/ night',
    tagline: p.tagline || '',
    description: p.description || '',
    includes: (p.includes || p.features || []).map((item: any) => item.item || item.label || ''),
    inclLabel: p.highlight ? 'EVERYTHING INCLUDED' : "WHAT'S INCLUDED",
    ctaText: p.ctaText || `Book ${p.title || 'Package'}`,
    waMessage: p.waMessage || `Hi! I'd like to book the ${p.title || ''} package at Lina House`,
    image: p.images?.length ? getMediaUrl(p.images[0]?.image) : (fallbackPackages.find((fp) => fp.slug === (p.slug || ''))?.image || ''),
    cardSide: cardSides[i % 3],
    cardStyle: cardStyles[i % 3],
    badge: p.badge || (p.highlight ? '\u2605  MOST POPULAR' : undefined),
  }))
}

const fallbackPackages: Package[] = [
  {
    id: 'stay-eat',
    slug: 'stay-eat',
    label: 'STAY & EAT',
    price: 339,
    priceUnit: '/ night',
    tagline: 'Your home away from home in Imsouane',
    description:
      'Cozy rooms with ocean views, fresh Moroccan breakfast, and home-cooked dinners on the rooftop terrace.',
    includes: [
      'Private or shared room',
      'Daily breakfast included',
      'Dinner every evening',
      'Free Wi-Fi',
      'Rooftop terrace access',
      'Common areas & kitchen access',
    ],
    inclLabel: "WHAT'S INCLUDED",
    ctaText: 'Book Stay & Eat',
    waMessage: "Hi! I'd like to book the Stay & Eat package at Lina House",
    image:
      'https://images.unsplash.com/photo-1652437318443-627e01b74d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    cardSide: 'right',
    cardStyle: 'white',
  },
  {
    id: 'full-surf',
    slug: 'full-surf',
    label: 'FULL SURF PACK',
    price: 539,
    priceUnit: '/ night',
    tagline: 'The complete Imsouane experience',
    description:
      'Everything you need — accommodation, all meals, daily surf lessons with certified instructors, and full equipment.',
    includes: [
      'Private or shared room',
      'Breakfast + dinner daily',
      'Daily 2h surf lesson',
      'Board & wetsuit included',
      'Free Wi-Fi & rooftop terrace',
      'Common areas & kitchen',
    ],
    inclLabel: 'EVERYTHING INCLUDED',
    ctaText: 'Book Full Surf Pack',
    waMessage: "Hi! I'd like to book the Full Surf Pack at Lina House",
    image:
      'https://images.unsplash.com/photo-1566935352714-a68e9fb35715?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    cardSide: 'left',
    cardStyle: 'blue',
    badge: '\u2605  MOST POPULAR',
  },
  {
    id: 'surf-only',
    slug: 'surf-only',
    label: 'SURF ONLY',
    price: 300,
    priceUnit: '/ session',
    tagline: 'Perfect for day visitors & experienced surfers',
    description:
      "Already have a place to stay? Join our group surf sessions with pro instructors. All equipment provided \u2014 just show up and ride.",
    includes: [
      '2-hour group lesson',
      'Certified instructor',
      'Surfboard provided',
      'Wetsuit included',
    ],
    inclLabel: "WHAT'S INCLUDED",
    ctaText: 'Book Surf Session',
    waMessage: "Hi! I'd like to book a surf session at Lina House",
    image:
      'https://images.unsplash.com/photo-1638461799673-a159e32fcff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    cardSide: 'right',
    cardStyle: 'white',
  },
]

// ─── Main Component ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PackagesClient({ lang, packages: packagesProp, pageData }: { lang: 'en' | 'fr'; packages?: any[]; pageData?: any }) {
  const { formatPrice } = useCurrency()
  // CMS-only: fallbackPackages kept in code as backup but not used
  const packages: Package[] = packagesProp && packagesProp.length > 0 ? mapCmsPackages(packagesProp) : []

  const header = pageData?.headerSection || {}
  const finalCta = pageData?.finalCtaSection || {}
  const finalCtaBg =
    finalCta?.backgroundImage?.url ||
    finalCta?.backgroundImageUrl ||
    'https://images.unsplash.com/photo-1712472256773-f2a75a9861b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'
  return (
    <>
      <main className="bg-[#FAF8F5] overflow-x-hidden">
        {/* ══════════════════════════════════════════════════════════════
            PAGE HEADER — matches Surf page style
            ══════════════════════════════════════════════════════════════ */}
        <section className="bg-white pt-8 pb-12 border-b border-[#EBEBEB]">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-[#717171]">
                <a href={`/${lang}`} className="hover:text-[#222222] transition-colors">Home</a>
                <span>/</span>
                <span className="text-[#222222] font-medium">{header.breadcrumbLabel ?? 'Packages & Deals'}</span>
              </div>
              <h1 className="text-3xl sm:text-[42px] font-bold text-[#222222] tracking-tight">
                {header.title ?? 'Packages & Deals'}
              </h1>
              <p className="text-[#717171] text-lg max-w-[600px]">
                {header.subtitle ?? 'From chill stays to full surf adventures — find your perfect Imsouane experience'}
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#222222] text-[#222222]" />
                    <span className="font-semibold text-[#222222]">{header.ratingScore ?? '9.7/10'}</span>
                  </div>
                  <span className="text-[#717171] text-sm">{header.ratingSource ?? 'on Hostelworld'}</span>
                </div>
                <span className="text-[#DDDDDD]">|</span>
                <span className="text-[#717171] text-sm">{header.infoChip1 ?? '3 packages · from €18.42'}</span>
                <span className="text-[#DDDDDD]">|</span>
                <span className="text-[#717171] text-sm">{header.infoChip2 ?? 'All-inclusive options'}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PACKAGE SECTIONS — Full-bleed image + floating overlay card
            ══════════════════════════════════════════════════════════════ */}
        {packages.map((pkg, idx) => {
          const isBlue = pkg.cardStyle === 'blue'
          const isRight = pkg.cardSide === 'right'

          // Different min-heights per section for visual rhythm
          const sectionHeights = [
            'min-h-[520px] md:min-h-[700px]',
            'min-h-[560px] md:min-h-[740px]',
            'min-h-[480px] md:min-h-[660px]',
          ]

          return (
            <section
              key={pkg.id}
              id={pkg.id}
              className={`relative ${sectionHeights[idx]} overflow-hidden`}
            >
              {/* Full-Bleed Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={pkg.image}
                  alt={`${pkg.label} package at Lina House surf camp Imsouane`}
                  fill
                  sizes="100vw"
                  priority={idx === 0}
                  className="object-cover"
                />
                <div
                  className={`absolute inset-0 ${
                    isRight
                      ? 'bg-gradient-to-r from-black/5 to-black/30'
                      : 'bg-gradient-to-l from-black/5 to-black/40'
                  }`}
                />
              </div>

              {/* "MOST POPULAR" Floating Badge */}
              {pkg.badge && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`absolute top-6 z-10 ${
                    isRight ? 'right-6 sm:right-20' : 'left-6 sm:left-20'
                  }`}
                >
                  <span className="inline-flex px-5 py-2 bg-[#E07A5F] rounded-full text-white text-[13px] font-bold tracking-wider shadow-lg">
                    {pkg.badge}
                  </span>
                </motion.div>
              )}

              {/* Floating Card — positioned left or right */}
              <div
                className={`relative max-w-[1280px] mx-auto px-6 sm:px-20 h-full flex items-center ${
                  isRight ? 'justify-center md:justify-end' : 'justify-center md:justify-start'
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={`w-full sm:max-w-[500px] rounded-2xl p-8 sm:p-10 my-10 sm:my-16 flex flex-col gap-[18px] shadow-2xl ${
                    isBlue
                      ? 'bg-[#1B4965]/95 backdrop-blur-sm'
                      : 'bg-white/[0.93] backdrop-blur-sm'
                  }`}
                >
                  {/* Package Label */}
                  <span
                    className={`text-[13px] font-bold tracking-[2px] ${
                      isBlue ? 'text-[#7EC8E3]' : 'text-[#E07A5F]'
                    }`}
                  >
                    {pkg.label}
                  </span>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-4xl sm:text-[44px] font-bold tracking-tight ${
                        isBlue ? 'text-white' : 'text-[#1B4965]'
                      }`}
                    >
                      {formatPrice(pkg.price)}
                    </span>
                    <span
                      className={`text-lg ${isBlue ? 'text-[#A8D8EA]' : 'text-[#717171]'}`}
                    >
                      {pkg.priceUnit}
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    className={`w-full h-px ${isBlue ? 'bg-white/15' : 'bg-[#E8E8E8]'}`}
                  />

                  {/* Tagline */}
                  <h2
                    className={`text-xl font-medium leading-snug ${
                      isBlue ? 'text-white' : 'text-[#222222]'
                    }`}
                  >
                    {pkg.tagline}
                  </h2>

                  {/* Description */}
                  <p
                    className={`text-[15px] leading-relaxed ${
                      isBlue ? 'text-[#C8DFE8]' : 'text-[#555555]'
                    }`}
                  >
                    {pkg.description}
                  </p>

                  {/* Inclusions Label */}
                  <span
                    className={`text-[12px] font-bold tracking-[1.5px] ${
                      isBlue ? 'text-[#7EC8E3]/50' : 'text-[#999999]'
                    }`}
                  >
                    {pkg.inclLabel}
                  </span>

                  {/* Inclusions List */}
                  <div className="flex flex-col gap-2.5">
                    {pkg.includes.map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 flex-shrink-0 ${
                            isBlue ? 'text-[#7EC8E3]' : 'text-[#3A8FB7]'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isBlue ? 'text-[#E0EFF5]' : 'text-[#444444]'
                          }`}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <a
                    href={`/${lang}/booking?type=package&slug=${pkg.slug}`}
                    className="flex items-center justify-center gap-2.5 w-full mt-2 px-6 py-3.5 bg-[#E07A5F] hover:bg-[#D06A4F] text-white font-bold text-[15px] rounded-lg transition-all"
                  >
                    {pkg.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  {/* View Details Link */}
                  <a
                    href={`/${lang}/packages/${pkg.slug}`}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold transition-all ${
                      isBlue
                        ? 'text-white/70 hover:text-white border border-white/20 hover:border-white/40'
                        : 'text-[#717171] hover:text-[#222222] border border-[#E8E8E8] hover:border-[#CCCCCC]'
                    }`}
                  >
                    View Full Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              </div>
            </section>
          )
        })}

        {/* ══════════════════════════════════════════════════════════════
            FINAL CTA — "Can't decide?"
            ══════════════════════════════════════════════════════════════ */}
        <section className="relative py-20 sm:py-24 overflow-hidden">
          <Image
            src={finalCtaBg}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4965]/90 via-[#1B4965]/70 to-[#1B4965]/40" />

          <div className="relative max-w-[1280px] mx-auto px-6 sm:px-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-5"
            >
              <h2 className="text-3xl sm:text-[36px] font-bold text-white tracking-tight">
                {finalCta.title ?? "Can't decide? We'll help you choose"}
              </h2>
              <p className="text-[#D0E8F0] text-lg max-w-[550px]">
                {finalCta.description ?? "Message us on WhatsApp and we'll find the perfect package for your trip"}
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <a
                  href={`https://wa.me/212772228120?text=${encodeURIComponent(
                    finalCta.whatsappMessage ?? "Hi! I'd like help choosing the right package at Lina House"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-xl transition-all text-[15px]"
                >
                  {finalCta.whatsappButtonText ?? 'WhatsApp Us'}
                  <ArrowRight className="w-[18px] h-[18px]" />
                </a>
                <a
                  href="mailto:contact@linahouse.com"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-xl transition-all text-[15px] backdrop-blur-sm"
                >
                  {finalCta.emailButtonText ?? 'Email Us'}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
