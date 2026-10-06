'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Users, Bed, ArrowRight } from 'lucide-react'
import { Footer } from '@/components/footer'
import { useCurrency } from '@/components/currency-switcher'
import { BLUR_DATA_URL } from '@/lib/blurDataUrl'

// ─── Animation Helpers ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── Room Data ───────────────────────────────────────────────────────
interface Room {
  id: string
  slug: string
  name: string
  detail: string
  description: string
  price: number
  priceBreakfast: number | null
  rating: string
  images: string[]
  badge?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMediaUrl = (media: any): string => {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media.url || ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCmsRooms(docs: any[]): Room[] {
  return docs.map((r) => ({
    id: r.slug || r.id,
    slug: r.slug || '',
    name: r.name || '',
    detail: r.detail || '',
    description: r.description || '',
    price: r.price ?? 0,
    priceBreakfast: r.priceBreakfast ?? null,
    rating: r.rating || '',
    images: (r.images?.map((img: any) => getMediaUrl(img?.image)).filter(Boolean) || []).length > 0
      ? r.images.map((img: any) => getMediaUrl(img?.image)).filter(Boolean)
      : (fallbackRooms.find((fr) => fr.slug === (r.slug || ''))?.images || []),
    badge: r.badge || undefined,
  }))
}

const fallbackRooms: Room[] = [
  {
    id: 'single',
    slug: 'single',
    name: 'Single Room',
    detail: '1 guest · Private room · Shared bathroom',
    description: 'A cozy private room just 500m from Magic Bay — perfect for solo surfers and travelers exploring Imsouane. Recharge after riding the longest right-hand wave in Africa in a warm, Moroccan-styled space with free WiFi and daily breakfast available.',
    price: 197,
    priceBreakfast: 242,
    rating: '4.9',
    images: [
      'https://images.unsplash.com/photo-1606796913825-2b02883605e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
  },
  {
    id: 'double',
    slug: 'double',
    name: 'Double Room',
    detail: '2 guests · Double bed · Shared bathroom',
    description: 'Spacious double room ideal for couples or friends visiting Imsouane\'s legendary surf breaks. Enjoy Berber-inspired decor, natural light, and easy access to the beach, restaurants, and surf lessons — all from Morocco\'s most authentic surf village.',
    price: 307,
    priceBreakfast: 395,
    rating: '4.9',
    badge: 'Most Popular',
    images: [
      'https://images.unsplash.com/photo-1583535045024-e2479a694777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d955a75e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
  },
  {
    id: 'twin',
    slug: 'twin',
    name: 'Twin Room',
    detail: '2 guests · Twin beds · Shared bathroom',
    description: 'Comfortable twin room for two friends on a surf trip to Imsouane, Morocco. Two separate beds, relaxed atmosphere, and a rooftop terrace with ocean views — the perfect base for your Moroccan surf camp adventure near Agadir and Essaouira.',
    price: 307,
    priceBreakfast: 395,
    rating: '4.8',
    images: [
      'https://images.unsplash.com/photo-1668706936367-2bef7e0e38db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
  },
  {
    id: 'female-dorm',
    slug: 'female-dorm',
    name: 'Female Dorm',
    detail: '1 guest · Female only · 4-bed dorm',
    description: 'Budget-friendly 4-bed female-only dorm for solo women travelers and surfers. Meet like-minded adventurers in a safe, clean space with 24/7 security — just steps from Imsouane\'s famous Magic Bay, home to beginner-friendly waves year-round.',
    price: 142,
    priceBreakfast: 186,
    rating: '4.9',
    badge: 'Best Value',
    images: [
      'https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
  },
  {
    id: 'male-dorm',
    slug: 'male-dorm',
    name: 'Male Dorm',
    detail: '1 guest · Male only · 4-bed dorm',
    description: 'Affordable 4-bed male dorm in the heart of Imsouane — Morocco\'s most laid-back surf village. Share stories with fellow travelers, enjoy communal rooftop dinners, and wake up minutes from the longest wave in Africa. Ideal for budget surf trips.',
    price: 142,
    priceBreakfast: 186,
    rating: '4.7',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
  },
  {
    id: 'apartment',
    slug: 'apartment',
    name: 'Private Apartment',
    detail: '4 guests · Full apartment · Kitchen & shower',
    description: 'A fully equipped private apartment for up to 4 guests with its own kitchen and private shower. Perfect for families or small groups looking for a surf camp stay in Imsouane with extra privacy and the freedom to cook fresh Moroccan ingredients from the local market.',
    price: 715,
    priceBreakfast: null,
    rating: '5.0',
    badge: 'Premium',
    images: [
      'https://images.unsplash.com/photo-1650137938625-11576502aecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
  },
]

// ─── Airbnb-Style Image Carousel ─────────────────────────────────────
function CardCarousel({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0)

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl group">
      <Image
        src={images[current]}
        alt={`${name} - Photo ${current + 1}`}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setCurrent((c) => (c - 1 + images.length) % images.length)
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 text-[#222222]" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setCurrent((c) => (c + 1) % images.length)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4 text-[#222222]" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrent(i)
                }}
                className={`w-[6px] h-[6px] rounded-full transition-all ${
                  i === current ? 'bg-white w-4' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RoomsClient({ lang, rooms: roomsProp, pageData }: { lang: 'en' | 'fr'; rooms?: any[]; pageData?: any }) {
  const { formatPrice } = useCurrency()
  // CMS-only: fallbackRooms kept in code as backup but not used
  const rooms: Room[] = roomsProp && roomsProp.length > 0 ? mapCmsRooms(roomsProp) : []

  const header = pageData?.headerSection || {}
  const packagesCta = pageData?.packagesCta || {}

  return (
    <>
      <main className="bg-sand-light">
        {/* ══════════════════════════════════════════════════════════════
            PAGE HEADER
            ══════════════════════════════════════════════════════════════ */}
        <section className="bg-white pt-8 pb-12 border-b border-[#EBEBEB]">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-[#717171]">
                <a href={`/${lang}`} className="hover:text-[#222222] transition-colors">Home</a>
                <span>/</span>
                <span className="text-[#222222] font-medium">{header.breadcrumbLabel ?? 'Rooms'}</span>
              </div>
              <h1 className="text-3xl sm:text-[42px] text-[#222222] tracking-tight">
                {header.title ?? 'Rooms & Accommodation in Imsouane'}
              </h1>
              <p className="text-[#717171] text-lg max-w-[600px]">
                {header.subtitle ?? 'From private rooms to budget-friendly dorms — surf camp accommodation just 500m from Magic Bay, the longest right-hand wave in Africa'}
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-[#222222] text-[#222222]" />
                  <span className="font-semibold text-[#222222]">{header.ratingScore ?? '9.7/10'}</span>
                  <span className="text-[#717171] text-sm">{header.ratingSource ?? 'on Booking.com'}</span>
                </div>
                <span className="text-[#DDDDDD]">|</span>
                <span className="text-[#717171] text-sm">{header.infoChip1 ?? '6 room types · 23 beds'}</span>
                <span className="text-[#DDDDDD]">|</span>
                <span className="text-[#717171] text-sm">{header.infoChip2 ?? '500m from Magic Bay'}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            ROOM GRID — Airbnb Style Cards
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
            >
              {rooms.map((room) => (
                <motion.div key={room.id} variants={fadeUp}>
                  <a
                    href={`/${lang}/rooms/${room.slug}`}
                    className="group block"
                  >
                    {/* Image with carousel */}
                    <div className="relative">
                      {room.badge && (
                        <span
                          className={`absolute top-3 left-3 z-10 inline-flex px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                            room.badge === 'Most Popular'
                              ? 'bg-accent text-white'
                              : room.badge === 'Best Value'
                                ? 'bg-primary text-white'
                                : 'bg-[#222222] text-white'
                          }`}
                        >
                          {room.badge}
                        </span>
                      )}
                      <CardCarousel images={room.images} name={room.name} />
                    </div>

                    {/* Card info */}
                    <div className="pt-3.5 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-[17px] text-[#222222] group-hover:underline">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                          <span className="text-sm font-medium text-[#222222]">{room.rating}</span>
                        </div>
                      </div>
                      <p className="text-[#717171] text-sm">{room.detail}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {room.priceBreakfast && (
                          <span className="text-sm font-bold text-[#222222] line-through">{formatPrice(room.priceBreakfast!)}</span>
                        )}
                        <span className="font-bold text-base text-[#E07A5F]">{formatPrice(room.price)}</span>
                        <span className="text-[#717171] text-sm">/ night</span>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PACKAGES CTA
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-primary">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl sm:text-[28px] text-white">
                  {packagesCta.title ?? 'Save more with our packages'}
                </h2>
                <p className="text-white/70 text-[15px] max-w-[500px]">
                  {packagesCta.description ?? 'Bundle your room with surf lessons, meals, and equipment for the best value. Packages start at €31.22/night.'}
                </p>
              </div>
              <a
                href={`/${lang}${packagesCta.buttonLink ?? '/packages'}`}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all text-[15px] shrink-0"
              >
                {packagesCta.buttonText ?? 'View Packages'}
                <ArrowRight className="w-[18px] h-[18px]" />
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
