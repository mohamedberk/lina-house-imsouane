'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  ZoomIn,
  Waves,
  CheckCircle2,
  Car,
  CircleDot,
  Compass,
  Sunrise,
  UtensilsCrossed,
  Sun,
  Sunset,
} from 'lucide-react'
import { Footer } from '@/components/footer'
import { useCurrency } from '@/components/currency-switcher'
import { getIcon } from '@/lib/iconMap'
import type { TransferContent } from '@/lib/transferRoutes'

// ─── Media helpers ──────────────────────────────────────────────────
function getMediaUrl(img: any): string {
  if (!img) return ''
  if (typeof img === 'string') return img
  if (typeof img?.url === 'string') return img.url
  return ''
}

// ─── Animation Helpers ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

// ─── Lesson Data ─────────────────────────────────────────────────────
interface Lesson {
  id: string
  name: string
  tagline: string
  description: string
  groupSize: string
  duration: string
  level: string
  price: number
  priceUnit: string
  includes: string[]
  notIncluded: string[]
  images: string[]
  badge?: string
  bookingLink?: string
}

// Fallback images per index so cards always show something
const fallbackImages = [
  [
    'https://images.unsplash.com/photo-1502933691298-84fc14542831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ],
  [
    'https://images.unsplash.com/photo-1531722569936-825d3dd91b15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ],
  [
    'https://images.unsplash.com/photo-1718947693081-5316df704705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1476673160081-cf065607f449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ],
]

function mapCmsActivities(docs: any[]): Lesson[] {
  return docs
    .filter((d: any) => d.activityType === 'lesson' || !d.activityType)
    .map((d: any, idx: number) => {
      const cmsImages = (d.images || []).map((img: any) => getMediaUrl(img?.image || img)).filter(Boolean)
      return {
        id: d.slug || d.id,
        name: d.title || '',
        tagline: d.tagline || '',
        description: d.description || '',
        groupSize: d.groupSize || '',
        duration: d.duration || '2 hours',
        level: d.level || 'All levels',
        price: d.price ?? 0,
        priceUnit: d.priceUnit?.replace(/^\/\s*/, '') || 'session',
        includes: (d.includes || []).map((i: any) => i.item || ''),
        notIncluded: (d.notIncluded || []).map((i: any) => i.item || ''),
        images: cmsImages.length > 0 ? cmsImages : (fallbackImages[idx] || fallbackImages[0]),
        badge: d.badge || undefined,
        bookingLink: d.bookingLink || undefined,
      }
    })
}

const fallbackLessons: Lesson[] = [
  {
    id: 'private',
    name: 'Private Coaching',
    tagline: '1-on-1 with a certified instructor',
    description:
      'Get the full attention of an experienced surf instructor tailored to your exact level. Whether you\'re standing up for the first time or refining your bottom turn, private coaching accelerates your progress like nothing else.',
    groupSize: '1 person',
    duration: '2 hours',
    level: 'All levels',
    price: 300,
    priceUnit: 'session',
    includes: [
      'Board & wetsuit included',
      'Beach warm-up & theory',
      'In-water coaching',
      'Photo & video tips',
      'Personalized feedback',
      'Safety briefing',
    ],
    notIncluded: [
      'Transport to the beach',
      'Meals & drinks',
      'Travel insurance',
    ],
    images: [
      'https://images.unsplash.com/photo-1502933691298-84fc14542831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
  },
  {
    id: 'small-group',
    name: 'Small Group Lesson',
    tagline: 'The perfect balance of fun & focus',
    description:
      'Our most popular option. Surf with 2–4 people of similar level while still getting plenty of personal attention from your instructor. The group energy pushes everyone to catch more waves.',
    groupSize: '2–4 people',
    duration: '2 hours',
    level: 'Beginner–Intermediate',
    price: 250,
    priceUnit: 'person',
    includes: [
      'Board & wetsuit included',
      'Beach warm-up & theory',
      'In-water coaching',
      'Group of similar level',
      'Safety briefing',
      'Fun group atmosphere',
    ],
    notIncluded: [
      'Transport to the beach',
      'Meals & drinks',
      'Travel insurance',
    ],
    images: [
      'https://images.unsplash.com/photo-1531722569936-825d3dd91b15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    badge: 'Most Popular',
  },
  {
    id: 'group',
    name: 'Group Lesson',
    tagline: 'Beginner focused — the social surf experience',
    description:
      'The most affordable way to learn surfing in Imsouane. Join a group of fellow beginners, learn the fundamentals on Magic Bay\'s gentle whitewash, and share the excitement of catching your first waves together.',
    groupSize: 'Large group',
    duration: '2 hours',
    level: 'Beginner',
    price: 200,
    priceUnit: 'person',
    includes: [
      'Board & wetsuit included',
      'Beach warm-up & theory',
      'In-water coaching',
      'Safety briefing',
      'Group of 5+ surfers',
      'Fun group atmosphere',
    ],
    notIncluded: [
      'Transport to the beach',
      'Meals & drinks',
      'Travel insurance',
    ],
    images: [
      'https://images.unsplash.com/photo-1718947693081-5316df704705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1476673160081-cf065607f449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    badge: 'Best Value',
  },
]

// ─── Image Carousel Component ────────────────────────────────────────
function LessonImageCarousel({
  images,
  name,
  onImageClick,
}: {
  images: string[]
  name: string
  onImageClick: (imgIndex: number) => void
}) {
  const [current, setCurrent] = useState(0)

  return (
    <div className="relative w-full flex flex-col gap-2">
      <div
        className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => onImageClick(current)}
      >
        <Image
          src={images[current]}
          alt={`${name} - Photo ${current + 1}`}
          fill
          sizes="(max-width: 1024px) 92vw, 600px"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrent((c) => (c - 1 + images.length) % images.length)
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4 text-[#222222]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrent((c) => (c + 1) % images.length)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4 text-[#222222]" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 h-20 sm:h-24">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative flex-1 rounded-xl overflow-hidden transition-all ${
                i === current
                  ? 'ring-2 ring-[#222222] ring-offset-1'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={src} alt={`${name} thumbnail ${i + 1}`} fill sizes="(max-width: 1024px) 25vw, 150px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Surf Spots Data (fallback if CMS empty) ─────────────────────────
const fallbackSurfSpots = [
  {
    name: 'Magic Bay (La Baie)',
    level: 'All Levels',
    levelColor: 'bg-accent',
    description:
      'The jewel of Imsouane — one of the longest right-hand point breaks in Africa. Gentle, peeling waves up to 800m long make it perfect for longboarding and beginners alike.',
    stats: [
      { value: '800m+', label: 'Wave length' },
      { value: '0.5–2m', label: 'Wave height' },
      { value: 'Year-round', label: 'Season' },
    ],
    image:
      'https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
  {
    name: 'Cathedral (La Cathédrale)',
    level: 'Intermediate+',
    levelColor: 'bg-azure-dark',
    description:
      'A powerful beach break just north of the bay. Faster, hollower waves that challenge intermediate and advanced surfers. Best on a northwest swell with offshore winds.',
    stats: [
      { value: 'Beach', label: 'Break type' },
      { value: '1–3m', label: 'Wave height' },
      { value: 'Oct–Apr', label: 'Best season' },
    ],
    image:
      'https://images.unsplash.com/photo-1502933691298-84fc14542831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
]

// Map CMS select-value to lucide icon component
const timelineIconMap: Record<string, any> = {
  sunrise: Sunrise,
  waves: Waves,
  'utensils-crossed': UtensilsCrossed,
  compass: Compass,
  sunset: Sunset,
  sun: Sun,
  star: Star,
}

// ─── Timeline Data (fallback if CMS empty) ───────────────────────────
const fallbackTimeline = [
  { time: '8am', icon: Sunrise, title: 'Wake Up', desc: 'Fresh breakfast on the terrace with ocean views', color: 'bg-primary' },
  { time: '9am', icon: Waves, title: 'Surf Session', desc: '2-hour lesson or free surf at Magic Bay', color: 'bg-accent' },
  { time: '12pm', icon: UtensilsCrossed, title: 'Lunch', desc: 'Fresh Moroccan & international dishes', color: 'bg-azure' },
  { time: '2pm', icon: Compass, title: 'Chill & Explore', desc: 'Explore the village, relax, or grab a massage', color: 'bg-primary' },
  { time: '5pm', icon: Waves, title: 'Sunset Surf', desc: 'Chase the golden hour waves', color: 'bg-accent' },
  { time: '8pm', icon: Sunset, title: 'Rooftop Vibes', desc: 'Dinner, stories & stargazing from the rooftop', color: 'bg-azure' },
]

// ─── Main Component ──────────────────────────────────────────────────
export default function SurfClient({ lang, activities, pageData, transferContent }: { lang: 'en' | 'fr'; activities?: any[]; pageData?: any; transferContent?: TransferContent }) {
  const lessons = activities && activities.length > 0 ? mapCmsActivities(activities) : fallbackLessons
  const { formatPrice } = useCurrency()

  // ── Pull CMS page content with fallbacks ─────────────────────────────
  const header = pageData?.headerSection || {}
  const rentals = pageData?.rentalsSection || {}
  const surfboardCard = rentals?.surfboardCard || {}
  const taxiCard = rentals?.taxiCard || {}
  const goodToKnowCard = rentals?.goodToKnowCard || {}
  const spotsSection = pageData?.spotsSection || {}
  const typicalDay = pageData?.typicalDaySection || {}
  const finalCta = pageData?.finalCtaSection || {}
  const finalCtaBg =
    finalCta?.backgroundImage?.url ||
    finalCta?.backgroundImageUrl ||
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'

  // Surf spots from CMS or fallback
  const surfSpots = (spotsSection?.spots && spotsSection.spots.length > 0)
    ? spotsSection.spots.map((s: any) => ({
        name: s.name,
        level: s.level,
        levelColor: s.levelColor || 'bg-accent',
        description: s.description,
        stats: s.stats || [],
        image: s.image?.url || s.imageUrl || '',
      }))
    : fallbackSurfSpots

  // Timeline from CMS or fallback
  const timeline = (typicalDay?.timeline && typicalDay.timeline.length > 0)
    ? typicalDay.timeline.map((t: any) => ({
        time: t.time,
        icon: timelineIconMap[t.icon] || Waves,
        title: t.title,
        desc: t.desc,
        color: t.color || 'bg-primary',
      }))
    : fallbackTimeline

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = useCallback((images: string[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + lightboxImages.length) % lightboxImages.length)
  }, [lightboxImages.length])

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % lightboxImages.length)
  }, [lightboxImages.length])

  useEffect(() => {
    if (!lightboxOpen) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [lightboxOpen, closeLightbox, nextImage, prevImage])

  return (
    <>
      <main className="bg-[#FAF8F5]">
        {/* ══════════════════════════════════════════════════════════════
            PAGE HEADER — matches Rooms page
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
                <span className="text-[#222222] font-medium">{header.breadcrumbLabel ?? 'Surf & Lessons'}</span>
              </div>
              <h1 className="text-3xl sm:text-[42px] text-[#222222] tracking-tight">
                {header.title ?? 'Surf & Lessons'}
              </h1>
              <p className="text-[#717171] text-lg max-w-[600px]">
                {header.subtitle ?? 'Lessons, equipment & world-class waves — just 500m from Lina House'}
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
                <span className="text-[#717171] text-sm">{header.infoChip1 ?? '3 lesson types · 2h sessions'}</span>
                <span className="text-[#DDDDDD]">|</span>
                <span className="text-[#717171] text-sm">{header.infoChip2 ?? '500m from Magic Bay'}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SURF LESSONS — Alternating cards (same as Rooms)
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-16"
            >
              {lessons.map((lesson, idx) => {
                const isBlue = idx % 2 !== 0
                return (
                <motion.div
                  key={lesson.id}
                  variants={fadeUp}
                  id={lesson.id}
                  className={`rounded-2xl overflow-hidden transition-shadow duration-300 ${
                    isBlue
                      ? 'bg-primary shadow-[0_2px_20px_rgba(27,73,101,0.25)] hover:shadow-[0_4px_28px_rgba(27,73,101,0.35)]'
                      : 'bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.10)]'
                  }`}
                >
                  <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Image Side */}
                    <div className="lg:w-[50%] p-4 sm:p-5">
                      <LessonImageCarousel
                        images={lesson.images}
                        name={lesson.name}
                        onImageClick={(imgIdx) => openLightbox(lesson.images, imgIdx)}
                      />
                    </div>

                    {/* Details Side */}
                    <div className="lg:w-[50%] p-5 sm:p-6 lg:py-6 lg:pr-8 flex flex-col justify-between">
                      {/* Top content */}
                      <div className="flex flex-col">
                        {/* Header */}
                        <div className="flex flex-col gap-1.5 mb-4">
                          <div className="flex items-center justify-between">
                            <h2 className={`text-2xl sm:text-[28px] ${isBlue ? 'text-white' : 'text-[#222222]'}`}>
                              <Link href={`/${lang}/surf/${lesson.id}`} className="hover:text-accent transition-colors">
                                {lesson.name}
                              </Link>
                            </h2>
                          </div>
                          <p className={`text-[15px] font-medium ${isBlue ? 'text-[#7EC8E3]' : 'text-accent'}`}>{lesson.tagline}</p>
                        </div>

                        {/* Quick Info */}
                        <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-4 pb-4 border-b ${
                          isBlue ? 'text-white/70 border-white/15' : 'text-[#4A4A4A] border-[#EBEBEB]'
                        }`}>
                          <span className="flex items-center gap-1.5">
                            <Users className={`w-4 h-4 ${isBlue ? 'text-white/50' : 'text-[#717171]'}`} />
                            {lesson.groupSize}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className={`w-4 h-4 ${isBlue ? 'text-white/50' : 'text-[#717171]'}`} />
                            {lesson.duration}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Waves className={`w-4 h-4 ${isBlue ? 'text-white/50' : 'text-[#717171]'}`} />
                            {lesson.level}
                          </span>
                        </div>

                        {/* Description */}
                        <p className={`text-sm leading-relaxed mb-5 ${isBlue ? 'text-white/75' : 'text-[#4A4A4A]'}`}>
                          {lesson.description}
                        </p>

                        {/* What's Included */}
                        <div>
                          <h3 className={`text-[13px] font-semibold uppercase tracking-[1px] mb-3 ${isBlue ? 'text-white/90' : 'text-[#222222]'}`}>
                            What&apos;s included
                          </h3>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {lesson.includes.map((item) => (
                              <div key={item} className="flex items-center gap-2.5">
                                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isBlue ? 'text-[#7EC8E3]' : 'text-[#717171]'}`} />
                                <span className={`text-sm ${isBlue ? 'text-white/70' : 'text-[#4A4A4A]'}`}>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Pricing + CTA — pinned to bottom */}
                      <div className={`pt-4 mt-5 border-t ${isBlue ? 'border-white/15' : 'border-[#EBEBEB]'}`}>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-2xl font-bold ${isBlue ? 'text-white' : 'text-[#222222]'}`}>{formatPrice(lesson.price)}</span>
                          <span className={`text-sm ${isBlue ? 'text-white/50' : 'text-[#717171]'}`}>/ {lesson.priceUnit}</span>
                        </div>

                        <a
                          href={lesson.bookingLink || `/${lang}/booking?type=surf&slug=${lesson.id}`}
                          {...(lesson.bookingLink?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="flex items-center justify-center gap-2.5 w-full mt-3 px-6 py-3.5 bg-[#E07A5F] hover:bg-[#D06A4F] text-white font-bold text-[15px] rounded-lg transition-all"
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4" />
                        </a>

                        <Link
                          href={`/${lang}/surf/${lesson.id}`}
                          className={`flex items-center justify-center gap-2 w-full mt-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                            isBlue
                              ? 'text-white/70 hover:text-white border border-white/20 hover:border-white/40'
                              : 'text-[#717171] hover:text-[#222222] border border-[#E8E8E8] hover:border-[#CCCCCC]'
                          }`}
                        >
                          View Full Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            EQUIPMENT & SERVICES
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-white border-t border-[#EBEBEB]">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-10"
            >
              <motion.div variants={fadeUp} className="flex flex-col gap-2">
                <h2 className="text-2xl sm:text-[28px] text-[#222222]">
                  {rentals.title ?? 'Rentals & Transport'}
                </h2>
                <p className="text-[#717171] text-[15px] max-w-[600px]">
                  {rentals.subtitle ?? 'Quality surf equipment for every level, plus easy transport to get you here and around.'}
                </p>
              </motion.div>

              <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Board + Wetsuit */}
                <motion.div variants={fadeUp} className="bg-[#F8FAFE] rounded-2xl p-7 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Waves className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg text-[#222222]">{surfboardCard.title ?? 'Surfboard + Wetsuit'}</h3>
                  <p className="text-[#4A4A4A] text-sm leading-relaxed">
                    {surfboardCard.description ?? 'Full-day rental — quality boards for all levels, from foam to fiberglass.'}
                  </p>
                  <div className="mt-auto pt-4 border-t border-[#E0E0E0] flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-accent">{formatPrice(surfboardCard.soloPrice ?? 70)}</span>
                      <span className="text-[#717171] text-sm">{surfboardCard.soloLabel ?? '/ solo'}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-primary">{formatPrice(surfboardCard.groupPrice ?? 60)}</span>
                      <span className="text-[#717171] text-sm">{surfboardCard.groupLabel ?? '/ group'}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Taxi Service */}
                <motion.div variants={fadeUp} className="bg-[#F8FAFE] rounded-2xl p-5 sm:p-7 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg text-[#222222]">
                    {transferContent?.cardTitle ?? taxiCard.title ?? 'Taxi & Airport Transfer'}
                  </h3>
                  <p className="text-[#4A4A4A] text-sm leading-relaxed">
                    {transferContent?.cardDescription ?? taxiCard.description ?? 'We arrange comfortable transfers on all routes. Just let us know your arrival details.'}
                  </p>
                  <div className="mt-auto pt-4 border-t border-[#E0E0E0] flex flex-col gap-2">
                    {transferContent?.routes && transferContent.routes.length > 0 ? (
                      transferContent.routes.map((route) => (
                        <a
                          key={route.id}
                          href={`/${lang}/booking?type=transfer&route=${route.id}`}
                          className="flex items-center justify-between gap-2 sm:gap-2.5 -mx-1.5 sm:-mx-2 px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-white active:bg-white transition-colors"
                        >
                          <span className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                            <CircleDot className="w-3 h-3 text-accent flex-shrink-0" />
                            <span className="text-[#4A4A4A] text-xs sm:text-sm truncate">{route.label}</span>
                          </span>
                          <span className="text-accent font-bold text-xs sm:text-sm flex-shrink-0">{formatPrice(route.priceEur)}</span>
                        </a>
                      ))
                    ) : (
                      (taxiCard.routes && taxiCard.routes.length > 0
                        ? taxiCard.routes.map((r: any) => r.label)
                        : ['Imsouane ↔ Taghazout', 'Imsouane ↔ Agadir', 'Airport ↔ Imsouane']
                      ).map((route: string) => (
                        <div key={route} className="flex items-center gap-2.5">
                          <CircleDot className="w-3 h-3 text-accent flex-shrink-0" />
                          <span className="text-[#4A4A4A] text-sm">{route}</span>
                        </div>
                      ))
                    )}
                  </div>
                  {transferContent?.routes && transferContent.routes.length > 0 && (
                    <a
                      href={`/${lang}/booking?type=transfer&route=${transferContent.routes[0].id}`}
                      className="inline-flex items-center justify-center gap-2.5 w-full mt-1 px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all text-[14px]"
                    >
                      {lang === 'fr' ? 'Réserver un transfert' : 'Book Transfer'}
                      <ArrowRight className="w-[16px] h-[16px]" />
                    </a>
                  )}
                </motion.div>

                {/* Info Card */}
                <motion.div variants={fadeUp} className="bg-[#EEF6FB] rounded-2xl p-7 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-azure-dark rounded-xl flex items-center justify-center">
                    <Sun className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg text-[#222222]">{goodToKnowCard.title ?? 'Good to Know'}</h3>
                  <div className="flex flex-col gap-2.5 text-sm text-[#4A4A4A]">
                    {(goodToKnowCard.facts && goodToKnowCard.facts.length > 0
                      ? goodToKnowCard.facts.map((f: any) => f.label)
                      : [
                          'All equipment sanitized daily',
                          'Boards: foam, soft-top & fiberglass',
                          'Wetsuits in all sizes available',
                          'Taxi prices confirmed before booking',
                        ]
                    ).map((fact: string) => (
                      <div key={fact} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#222222]/30 flex-shrink-0 mt-1.5" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            THE BREAKS — Surf Spots
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-primary">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-10"
            >
              <motion.div variants={fadeUp} className="text-center flex flex-col gap-3">
                <h2 className="text-2xl sm:text-[28px] text-white">
                  {spotsSection.title ?? 'The Breaks of Imsouane'}
                </h2>
                <p className="text-white/70 text-[15px] max-w-[650px] mx-auto">
                  {spotsSection.subtitle ?? "Home to one of the longest right-hand waves in Africa. Whether you're catching your first whitewash or carving a long point break, Imsouane has a wave for you."}
                </p>
              </motion.div>

              <motion.div variants={stagger} className="grid md:grid-cols-2 gap-8">
                {surfSpots.map((spot: any) => (
                  <motion.div
                    key={spot.name}
                    variants={fadeUp}
                    className="bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={spot.image}
                        alt={spot.name}
                        fill
                        sizes="(max-width: 768px) 92vw, 600px"
                        className="object-cover hover:scale-[1.03] transition-transform duration-700"
                      />
                    </div>
                    <div className="p-7 flex flex-col gap-3">
                      <span
                        className={`self-start px-3 py-1 rounded-full text-[11px] font-bold tracking-wide text-white ${spot.levelColor}`}
                      >
                        {spot.level.toUpperCase()}
                      </span>
                      <h3 className="text-xl text-white">{spot.name}</h3>
                      <p className="text-white/70 text-[15px] leading-relaxed">{spot.description}</p>
                      <div className="flex items-center gap-6 pt-3 border-t border-white/10 mt-2">
                        {spot.stats.map((stat: any) => (
                          <div key={stat.label} className="flex flex-col gap-0.5">
                            <span className="text-lg font-bold text-accent">{stat.value}</span>
                            <span className="text-white/50 text-xs">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            A TYPICAL SURF DAY — Timeline
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-sand-light">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-12"
            >
              <motion.div variants={fadeUp} className="text-center flex flex-col gap-3">
                <h2 className="text-2xl sm:text-[28px] text-[#222222]">
                  {typicalDay.title ?? 'A Typical Surf Day'}
                </h2>
                <p className="text-[#717171] text-[15px] max-w-[550px] mx-auto">
                  {typicalDay.subtitle ?? 'Wake up to ocean views, surf world-class waves, and end the day on the rooftop with new friends.'}
                </p>
              </motion.div>

              <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {timeline.map((step: any) => {
                  const Icon = step.icon
                  return (
                    <motion.div
                      key={step.time}
                      variants={fadeUp}
                      className="flex flex-col items-center text-center gap-3"
                    >
                      <div
                        className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center`}
                      >
                        <span className="text-white text-xs font-bold">{step.time}</span>
                      </div>
                      <div className="w-[2px] h-5 bg-[#222222]/10 rounded-full" />
                      <Icon className="w-6 h-6 text-primary" />
                      <h3 className="text-sm text-[#222222]">{step.title}</h3>
                      <p className="text-[#717171] text-xs leading-relaxed">{step.desc}</p>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FINAL CTA
            ══════════════════════════════════════════════════════════════ */}
        <section className="relative py-24 overflow-hidden">
          <Image
            src={finalCtaBg}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4965]/90 via-[#1B4965]/70 to-[#1B4965]/40" />
          <div className="relative max-w-[1340px] mx-auto px-6 sm:px-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              <h2 className="text-3xl sm:text-[42px] text-white tracking-tight whitespace-pre-line">
                {finalCta.title ?? 'Your Best Surf Trip\nStarts Here'}
              </h2>
              <p className="text-white/80 text-lg max-w-[550px]">
                {finalCta.description ?? "Book your lesson, grab your board, and let the waves of Imsouane do the rest. We'll take care of everything — you just show up."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                <a
                  href={`/${lang}${finalCta.primaryButtonLink ?? '/booking?type=surf&slug=group'}`}
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all text-[15px]"
                >
                  {finalCta.primaryButtonText ?? 'Book a Lesson'}
                  <ArrowRight className="w-[18px] h-[18px]" />
                </a>
                <a
                  href={`/${lang}${finalCta.secondaryButtonLink ?? '/contact'}`}
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-lg transition-all text-[15px] backdrop-blur-sm"
                >
                  {finalCta.secondaryButtonText ?? 'Contact Us'}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>

      {/* ══════════════════════════════════════════════════════════════
          LIGHTBOX
          ══════════════════════════════════════════════════════════════ */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center"
                onClick={closeLightbox}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                <span className="absolute top-7 left-6 text-white/60 text-sm font-medium">
                  {lightboxIndex + 1} / {lightboxImages.length}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={lightboxImages[lightboxIndex]}
                  alt={`Photo ${lightboxIndex + 1}`}
                  className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg select-none"
                  onClick={(e) => e.stopPropagation()}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
