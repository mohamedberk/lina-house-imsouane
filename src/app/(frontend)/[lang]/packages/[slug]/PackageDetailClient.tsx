'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  X,
  Star,
  MapPin,
  Waves,
  UtensilsCrossed,
  Bed,
  Wifi,
  Coffee,
  Sun,
  Flame,
  ZoomIn,
  ImageIcon,
  Clock,
  Camera,
  Users,
  Shield,
} from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import { Footer } from '@/components/footer'
import { PriceDisplay } from '@/components/price-display'
import { getIcon } from '@/lib/iconMap'

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
  visible: { transition: { staggerChildren: 0.08 } },
}

// ─── Package Detail Data ─────────────────────────────────────────────
interface RoomOption {
  name: string
  detail: string
  price: number | null
  guests?: number
}

interface ScheduleItem {
  time: string
  icon: React.ElementType
  label: string
}

interface PackageDetail {
  id: string
  slug: string
  label: string
  price: number
  priceUnit: string
  pricingBasis?: 'per-person' | 'fixed'
  includedRoomMaxGuests: number
  tagline: string
  description: string
  longDescription: string
  includes: string[]
  notIncludes: string[]
  highlights: { icon: React.ElementType; title: string; desc: string }[]
  schedule: ScheduleItem[]
  rooms: RoomOption[]
  images: string[]
  ctaText: string
  waMessage: string
  badge?: string
}

function mapCmsPackage(doc: any, allRooms: any[] = []): PackageDetail {
  // If the package has `linkedRooms` set, use those (admin-picked subset).
  // Otherwise, show ALL rooms from the Rooms collection by default.
  const linked: any[] = Array.isArray(doc.linkedRooms) ? doc.linkedRooms : []
  const linkedRoomDocs = linked
    .map((r: any) => (typeof r === 'object' && r !== null ? r : null))
    .filter(Boolean)
  const sourceRooms: any[] = linkedRoomDocs.length > 0 ? linkedRoomDocs : (allRooms || [])

  const rooms: RoomOption[] = sourceRooms.map((r: any) => ({
    name: r?.name || '',
    detail: r?.detail || '',
    price: typeof r?.price === 'number' ? r.price : null,
    guests: typeof r?.guests === 'number' ? r.guests : 1,
  }))

  return {
    id: doc.slug || doc.id,
    slug: doc.slug || '',
    label: (doc.title || '').toUpperCase(),
    price: doc.price ?? 0,
    priceUnit: doc.priceUnit || '/ night',
    pricingBasis: doc.pricingBasis || ((doc.priceUnit || '').toLowerCase().includes('person') ? 'per-person' : 'fixed'),
    includedRoomMaxGuests: Math.max(1, doc.includedRoomMaxGuests || 1),
    tagline: doc.tagline || '',
    description: doc.description || '',
    longDescription: doc.longDescription || doc.description || '',
    includes: (doc.includes || []).map((i: any) => i.item || ''),
    notIncludes: (doc.notIncludes || []).map((i: any) => i.item || ''),
    highlights: (doc.highlights || []).map((h: any) => ({
      icon: getIcon(h.icon),
      title: h.title || '',
      desc: h.desc || '',
    })),
    schedule: (doc.schedule || []).map((s: any) => ({
      time: s.time || '',
      icon: getIcon(s.icon),
      label: s.label || '',
    })),
    rooms,
    images: ((doc.images || []).map((img: any) => getMediaUrl(img?.image || img)).filter(Boolean)).length > 0
      ? (doc.images || []).map((img: any) => getMediaUrl(img?.image || img)).filter(Boolean)
      : (packages[doc.slug]?.images || []),
    ctaText: doc.ctaText || 'Book Now',
    waMessage: doc.waMessage || `Hi! I'd like to book the ${doc.title} package at Lina House`,
    badge: doc.badge || undefined,
  }
}

const packages: Record<string, PackageDetail> = {
  'stay-eat': {
    id: 'stay-eat',
    slug: 'stay-eat',
    label: 'STAY & EAT',
    price: 31.22,
    priceUnit: '/ night',
    includedRoomMaxGuests: 1,
    tagline: 'Your home away from home in Imsouane',
    description:
      'Cozy rooms with ocean views, fresh Moroccan breakfast, and home-cooked dinners on the rooftop terrace.',
    longDescription:
      'Settle into the laid-back rhythm of Imsouane with our Stay & Eat package. Wake up to the sound of waves, enjoy a generous Moroccan breakfast on our sun-drenched rooftop terrace, and end each day with a home-cooked dinner featuring fresh local ingredients. Whether you spend your days surfing, exploring the village, or simply reading on the terrace — Lina House is your warm, welcoming base.',
    includes: [
      'Private or shared room',
      'Daily breakfast included',
      'Dinner every evening',
      'Free Wi-Fi',
      'Rooftop terrace access',
      'Common areas & kitchen access',
    ],
    notIncludes: [
      'Flights to Morocco',
      'Travel insurance',
      'Surf lessons (can be added)',
      'Lunch (available at our restaurant)',
    ],
    highlights: [
      { icon: Bed, title: 'Cozy Rooms', desc: 'Private or shared' },
      { icon: UtensilsCrossed, title: 'All Meals', desc: 'Breakfast + Dinner' },
      { icon: Sun, title: 'Rooftop', desc: 'Ocean views' },
      { icon: Wifi, title: 'Free WiFi', desc: 'High-speed' },
    ],
    schedule: [
      { time: '8:00 AM', icon: Coffee, label: 'Breakfast on the rooftop terrace' },
      { time: '9:30 AM', icon: Sun, label: 'Free time — explore or relax' },
      { time: '12:30 PM', icon: UtensilsCrossed, label: 'Lunch available at the restaurant' },
      { time: '3:00 PM', icon: MapPin, label: 'Village walk or beach time' },
      { time: '5:00 PM', icon: Sun, label: 'Sunset session on the rooftop' },
      { time: '7:30 PM', icon: Flame, label: 'BBQ dinner — fresh fish from the harbour' },
    ],
    rooms: [
      { name: 'Male Dorm (4-bed)', detail: '1 guest · Shared bathroom', price: 22.01 },
      { name: 'Female Dorm (4-bed)', detail: '1 guest · Female only · Shared bathroom', price: 22.01 },
      { name: 'Twin Room', detail: '2 guests · Twin beds · Shared bathroom', price: 31.22 },
      { name: 'Double Room', detail: '2 guests · Double bed · Shared bathroom', price: 31.22 },
      { name: 'Single Room', detail: '1 guest · Private room · Shared bathroom', price: 36.55 },
      { name: 'Private Apartment', detail: '4 guests · Full apartment · Kitchen & shower', price: 75.05 },
    ],
    images: [
      'https://images.unsplash.com/photo-1652437318443-627e01b74d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      'https://images.unsplash.com/photo-1606796913825-2b02883605e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1590998901109-76577950db74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1583535045024-e2479a694777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    ctaText: 'Book Stay & Eat',
    waMessage: "Hi! I'd like to book the Stay & Eat package at Lina House",
  },
  'full-surf': {
    id: 'full-surf',
    slug: 'full-surf',
    label: 'FULL SURF PACK',
    price: 49.63,
    priceUnit: '/ night',
    includedRoomMaxGuests: 1,
    tagline: 'The complete Imsouane experience',
    description:
      'Everything you need — accommodation, all meals, daily surf lessons with certified instructors, and full equipment.',
    longDescription:
      'Everything you need for the ultimate surf trip — accommodation in our cozy rooms with ocean views, all meals from our rooftop restaurant (breakfast + dinner daily), daily 2-hour surf lessons with certified instructors, and full equipment included. Wake up to ocean sounds, surf world-class waves, and share stories over wood-fire BBQ dinners. This is Imsouane at its best.',
    includes: [
      '7 nights accommodation (any room)',
      'Breakfast + dinner every day',
      '6 days of surf coaching (2h/day)',
      'Surfboard & wetsuit provided',
      'Free Wi-Fi & common areas',
      'Rooftop terrace access',
      'Surf photo & video package',
    ],
    notIncludes: [
      'Flights to Morocco',
      'Travel insurance',
      'Airport transfers (can be arranged)',
      'Lunch (available at our restaurant)',
    ],
    highlights: [
      { icon: Waves, title: 'Daily Surf', desc: '2h lessons' },
      { icon: UtensilsCrossed, title: 'All Meals', desc: 'Breakfast + Dinner' },
      { icon: Bed, title: 'Cozy Rooms', desc: 'Private or shared' },
      { icon: Wifi, title: 'Free WiFi', desc: 'High-speed' },
    ],
    schedule: [
      { time: '8:00 AM', icon: Coffee, label: 'Breakfast on the rooftop terrace' },
      { time: '9:30 AM', icon: Waves, label: 'Surf lesson with certified instructor (2h)' },
      { time: '12:00 PM', icon: Sun, label: 'Free time — explore the village or rest' },
      { time: '2:00 PM', icon: Waves, label: 'Free surf or second session' },
      { time: '5:00 PM', icon: Sun, label: 'Sunset session on the rooftop terrace' },
      { time: '7:30 PM', icon: Flame, label: 'BBQ dinner — fresh fish from the harbour' },
    ],
    rooms: [
      { name: 'Male Dorm (4-bed)', detail: '1 guest · Shared bathroom', price: 40.42 },
      { name: 'Female Dorm (4-bed)', detail: '1 guest · Female only · Shared bathroom', price: 40.42 },
      { name: 'Double Room', detail: '2 guests · Double bed · Shared bathroom', price: 49.63 },
      { name: 'Single Room', detail: '1 guest · Private room · Shared bathroom', price: 58.84 },
      { name: 'Private Apartment', detail: '4 guests · Full apartment · Kitchen & shower', price: 84.25 },
    ],
    images: [
      'https://images.unsplash.com/photo-1566935352714-a68e9fb35715?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      'https://images.unsplash.com/photo-1727626239479-0005257495f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1638461799673-a159e32fcff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1712472256773-f2a75a9861b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    ctaText: 'Book Full Surf Pack',
    waMessage: "Hi! I'd like to book the Full Surf Pack at Lina House",
    badge: '★  MOST POPULAR',
  },
  'surf-only': {
    id: 'surf-only',
    slug: 'surf-only',
    label: 'SURF ONLY',
    price: 27.62,
    priceUnit: '/ session',
    includedRoomMaxGuests: 1,
    tagline: 'Perfect for day visitors & experienced surfers',
    description:
      "Already have a place to stay? Join our group surf sessions with pro instructors. All equipment provided — just show up and ride.",
    longDescription:
      "Perfect for day visitors and experienced surfers who already have accommodation sorted. Join our group surf sessions led by certified local instructors who know every break in Imsouane. We provide everything — boards, wetsuits, and transport to the best spots. Whether you're catching your first wave or shredding the point break, our team will guide you to your best session yet.",
    includes: [
      '2-hour group surf lesson',
      'Certified local instructor',
      'Surfboard provided',
      'Wetsuit included',
      'Photo & video included',
      'Transport to surf spots',
    ],
    notIncludes: [
      'Accommodation',
      'Meals',
      'Travel insurance',
      'Personal items',
    ],
    highlights: [
      { icon: Waves, title: '2h Lesson', desc: 'All levels' },
      { icon: Shield, title: 'Certified', desc: 'Pro instructors' },
      { icon: Camera, title: 'Photos', desc: 'Included free' },
      { icon: Users, title: 'Group', desc: 'Small groups' },
    ],
    schedule: [
      { time: '9:00 AM', icon: Coffee, label: 'Meet at Lina House' },
      { time: '9:30 AM', icon: Waves, label: 'Warm-up & technique on the beach' },
      { time: '10:00 AM', icon: Waves, label: 'In the water — guided surf session' },
      { time: '11:30 AM', icon: Camera, label: 'Photo review & tips from instructor' },
    ],
    rooms: [],
    images: [
      'https://images.unsplash.com/photo-1638461799673-a159e32fcff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      'https://images.unsplash.com/photo-1727626239479-0005257495f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1766393068139-238f3b3e1cb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1635356179820-8dd3d450f142?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1712472256773-f2a75a9861b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    ctaText: 'Book Surf Session',
    waMessage: "Hi! I'd like to book a surf session at Lina House",
  },
}

// ─── Other Packages helper ───────────────────────────────────────────
const otherPackageSummary: Record<string, { label: string; price: string; desc: string; image: string }> = {
  'stay-eat': {
    label: 'STAY & EAT',
    price: '€31.22 / night',
    desc: 'Cozy rooms, breakfast & dinner included',
    image: 'https://images.unsplash.com/photo-1652437318443-627e01b74d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
  'full-surf': {
    label: 'FULL SURF PACK',
    price: '€49.63 / night',
    desc: 'Accommodation, meals, daily surf lessons & gear',
    image: 'https://images.unsplash.com/photo-1566935352714-a68e9fb35715?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
  'surf-only': {
    label: 'SURF ONLY',
    price: '€18.42 / session',
    desc: '2h group lesson with equipment included',
    image: 'https://images.unsplash.com/photo-1638461799673-a159e32fcff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
}

// ─── Main Component ──────────────────────────────────────────────────
export default function PackageDetailClient({
  lang,
  slug,
  pkg: pkgProp,
  allPackages,
  allRooms,
}: {
  lang: 'en' | 'fr'
  slug: string
  pkg?: any
  allPackages?: any[]
  allRooms?: any[]
}) {
  // CMS-only: hardcoded packages/otherPackageSummary kept in code as backup but not used
  const pkg = pkgProp ? mapCmsPackage(pkgProp, allRooms || []) : null

  // Build other packages from CMS only
  const otherSlugs: string[] = []
  const otherPackagesMap: Record<string, { label: string; price: string; desc: string; image: string }> = {}

  if (allPackages && allPackages.length > 0) {
    allPackages.filter((p: any) => p.slug !== slug).forEach((p: any) => {
      const s = p.slug as string
      otherSlugs.push(s)
      const firstImage = (p.images || []).map((img: any) => getMediaUrl(img?.image || img)).filter(Boolean)[0] || (otherPackageSummary[s]?.image || '')
      otherPackagesMap[s] = {
        label: (p.title || '').toUpperCase(),
        price: `€${(p.price ?? 0).toFixed(2)} ${p.priceUnit || '/ night'}`,
        desc: p.description || '',
        image: firstImage,
      }
    })
  }

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const slides = pkg ? pkg.images.map((src: string) => ({ src })) : []

  if (!pkg) return null

  return (
    <>
      <main className="bg-[#FAF8F5]">
        {/* ══════════════════════════════════════════════════════════════
            HEADER — Breadcrumb + Title + Price + Meta
            ══════════════════════════════════════════════════════════════ */}
        <section className="bg-white pt-8 pb-10 border-b border-[#EBEBEB]">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#717171]">
                <a href={`/${lang}`} className="hover:text-[#222222] transition-colors">
                  Home
                </a>
                <span>/</span>
                <a
                  href={`/${lang}/packages`}
                  className="hover:text-[#222222] transition-colors"
                >
                  Packages
                </a>
                <span>/</span>
                <span className="text-[#222222] font-medium">{pkg.label}</span>
              </div>

              {/* Title + Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h1 className="text-3xl sm:text-[42px] font-bold text-[#222222] tracking-tight">
                  {pkg.label.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                </h1>
                {pkg.badge && (
                  <span className="inline-flex w-fit px-4 py-1.5 bg-[#E07A5F] rounded-full text-white text-[11px] font-bold tracking-wider">
                    {pkg.badge}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PHOTO GALLERY — Large main + 4 thumbnails grid
            ══════════════════════════════════════════════════════════════ */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-20 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[280px] sm:h-[420px] md:h-[480px]"
          >
            {/* Main image — spans 2 cols */}
            <div
              className="md:col-span-2 md:row-span-2 rounded-2xl md:rounded-r-none overflow-hidden cursor-pointer group relative"
              onClick={() => openLightbox(0)}
            >
              <Image
                src={pkg.images[0]}
                alt={`${pkg.label} at Lina House`}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
              {/* Image count badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                1 / {pkg.images.length}
              </div>
            </div>

            {/* 4 Thumbnails */}
            {pkg.images.slice(1, 5).map((src, i) => (
              <div
                key={i}
                className={`hidden md:block overflow-hidden cursor-pointer group relative ${
                  i === 1 ? 'rounded-tr-2xl' : i === 3 ? 'rounded-br-2xl' : ''
                }`}
                onClick={() => openLightbox(i + 1)}
              >
                <Image
                  src={src}
                  alt={`${pkg.label} gallery ${i + 2}`}
                  fill
                  sizes="320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            MAIN CONTENT — Two columns: Details (left) + Booking Card (right, sticky)
            ══════════════════════════════════════════════════════════════ */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-20 pb-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* ── LEFT COLUMN ── */}
            <div className="flex-1 flex flex-col gap-12 min-w-0">
              {/* Package Overview */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-5"
              >
                <motion.span
                  variants={fadeUp}
                  className="text-[12px] font-bold tracking-[2px] text-[#E07A5F]"
                >
                  PACKAGE OVERVIEW
                </motion.span>
                <motion.h2
                  variants={fadeUp}
                  className="text-2xl sm:text-[28px] font-bold text-[#222222]"
                >
                  {pkg.tagline}
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-[#4A4A4A] text-base leading-[1.7] max-w-[700px]"
                >
                  {pkg.longDescription}
                </motion.p>

                <motion.div variants={fadeUp} className="w-full h-px bg-[#EBEBEB] mt-2" />

                {/* Highlights row */}
                <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {pkg.highlights.map((h) => {
                    const Icon = h.icon
                    return (
                      <div
                        key={h.title}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F7F7F7]"
                      >
                        <Icon className="w-7 h-7 text-[#3A8FB7]" />
                        <span className="text-sm font-semibold text-[#222222]">{h.title}</span>
                        <span className="text-xs text-[#717171]">{h.desc}</span>
                      </div>
                    )
                  })}
                </motion.div>
              </motion.div>

              {/* What's Included */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-5"
              >
                <motion.h3 variants={fadeUp} className="text-2xl font-bold text-[#222222]">
                  What&apos;s included in this package
                </motion.h3>
                <motion.div
                  variants={fadeUp}
                  className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5"
                >
                  {pkg.includes.map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <Check className="w-[18px] h-[18px] text-[#3A8FB7] flex-shrink-0" />
                      <span className="text-[15px] text-[#4A4A4A]">{item}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Not Included */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-4"
              >
                <motion.div variants={fadeUp} className="w-full h-px bg-[#EBEBEB]" />
                <motion.h3 variants={fadeUp} className="text-xl font-bold text-[#222222]">
                  Not included
                </motion.h3>
                <motion.div variants={fadeUp} className="flex flex-col gap-3">
                  {pkg.notIncludes.map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <X className="w-4 h-4 text-[#D4694E] flex-shrink-0" />
                      <span className="text-[15px] text-[#717171]">{item}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Daily Schedule */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-5"
              >
                <motion.div variants={fadeUp} className="w-full h-px bg-[#EBEBEB]" />
                <motion.h3 variants={fadeUp} className="text-2xl font-bold text-[#222222]">
                  A typical day at Lina House
                </motion.h3>
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-[#EBEBEB] overflow-hidden"
                >
                  {pkg.schedule.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.time}
                        className={`flex items-center gap-5 px-5 py-4 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F7F7]'
                        }`}
                      >
                        <span className="text-sm font-semibold text-[#1B4965] w-[76px] shrink-0">
                          {item.time}
                        </span>
                        <Icon className="w-[18px] h-[18px] text-[#E07A5F] shrink-0" />
                        <span className="text-[15px] text-[#4A4A4A]">{item.label}</span>
                      </div>
                    )
                  })}
                </motion.div>
              </motion.div>

              {/* Room Options & Pricing */}
              {pkg.rooms.length > 0 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="flex flex-col gap-5"
                >
                  <motion.div variants={fadeUp} className="w-full h-px bg-[#EBEBEB]" />
                  <motion.h3 variants={fadeUp} className="text-2xl font-bold text-[#222222]">
                    Room options &amp; pricing
                  </motion.h3>
                  <motion.p variants={fadeUp} className="text-[15px] text-[#717171]">
                    {pkg.includedRoomMaxGuests === 1
                      ? 'Each 1-guest room is included. Groups can add one single room per guest; larger rooms are charged at their normal nightly price.'
                      : `Each room for up to ${pkg.includedRoomMaxGuests} guests is included. Larger rooms are charged at their normal nightly price.`}
                  </motion.p>
                  <motion.div variants={fadeUp} className="flex flex-col gap-3">
                    {pkg.rooms.map((room) => (
                      <div
                        key={room.name}
                        className="flex items-center justify-between px-6 py-[18px] rounded-xl bg-white border border-[#EBEBEB]"
                      >
                        <div className="flex flex-col gap-1">
                          <span
                            className="text-base font-semibold text-[#222222]"
                          >
                            {room.name}
                          </span>
                          <span
                            className="text-[13px] text-[#717171]"
                          >
                            {room.detail}
                          </span>
                        </div>
                        {(room.guests ?? 1) <= pkg.includedRoomMaxGuests ? (
                          <span className="text-sm font-semibold text-[#3A8FB7] whitespace-nowrap">
                            Included
                          </span>
                        ) : room.price !== null ? (
                          <span className="text-base font-bold text-[#1B4965] whitespace-nowrap">
                            <PriceDisplay price={room.price} />
                            <span className="font-semibold"> / night</span>
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-[#E07A5F]">Contact us</span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* ── RIGHT COLUMN — Sticky Booking Card ── */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="lg:sticky lg:top-[100px]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white rounded-2xl p-8 border border-[#EBEBEB] shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col gap-6"
                >
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <PriceDisplay price={pkg.price} className="text-[32px] font-bold text-[#1B4965]" />
                    <span className="text-base text-[#717171]">{pkg.priceUnit}</span>
                  </div>

                  <div className="w-full h-px bg-[#EBEBEB]" />

                  {/* Quick inclusions */}
                  <div className="flex flex-col gap-3.5">
                    <span className="text-[11px] font-bold tracking-[1.5px] text-[#999999]">
                      EVERYTHING INCLUDED
                    </span>
                    {pkg.includes.slice(0, 5).map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                        <span className="text-sm text-[#444444]">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Primary CTA */}
                  <a
                    href={`/${lang}/booking?type=package&slug=${pkg.slug}`}
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#E07A5F] hover:bg-[#D06A4F] text-white font-bold text-[15px] rounded-xl transition-all"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  {/* Secondary CTA */}
                  <a
                    href={`/${lang}/contact`}
                    className="flex items-center justify-center w-full py-3 bg-white hover:bg-[#F7F7F7] text-[#222222] font-semibold text-sm rounded-xl border border-[#DDDDDD] transition-all"
                  >
                    Have questions? Contact us
                  </a>

                  {/* Trust note */}
                  <p className="text-xs text-[#999999] text-center">
                    No credit card required · Free cancellation
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            OTHER PACKAGES
            ══════════════════════════════════════════════════════════════ */}
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-10"
            >
              <motion.h2
                variants={fadeUp}
                className="text-[28px] font-bold text-[#222222]"
              >
                Explore other packages
              </motion.h2>
              <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-6">
                {otherSlugs.map((s) => {
                  const other = otherPackagesMap[s]
                  if (!other) return null
                  return (
                    <a
                      key={s}
                      href={`/${lang}/packages/${s}`}
                      className="group rounded-2xl overflow-hidden border border-[#EBEBEB] bg-white"
                    >
                      <div className="relative h-[200px] overflow-hidden">
                        <Image
                          src={other.image}
                          alt={other.label}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6 flex flex-col gap-2.5">
                        <span className="text-[11px] font-bold tracking-[1.5px] text-[#E07A5F]">
                          {other.label}
                        </span>
                        <span className="text-xl font-bold text-[#222222]">{other.price}</span>
                        <span className="text-sm text-[#717171]">{other.desc}</span>
                        <span className="inline-flex items-center justify-center w-full mt-2 py-3 bg-[#222222] hover:bg-[#333333] text-white font-semibold text-sm rounded-lg transition-all">
                          View Package
                        </span>
                      </div>
                    </a>
                  )
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FINAL CTA — Ocean gradient banner
            ══════════════════════════════════════════════════════════════ */}
        <section className="relative py-20 sm:py-24 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1712472256773-f2a75a9861b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
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
                Ready to ride the longest wave in Africa?
              </h2>
              <p className="text-[#D0E8F0] text-lg max-w-[550px]">
                Message us on WhatsApp and we&apos;ll get your surf adventure sorted
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <a
                  href={`https://wa.me/212772228120?text=${encodeURIComponent(pkg.waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-xl transition-all text-[15px]"
                >
                  WhatsApp Us
                  <ArrowRight className="w-[18px] h-[18px]" />
                </a>
                <a
                  href="mailto:contact@linahouse.com"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-xl transition-all text-[15px] backdrop-blur-sm"
                >
                  Email Us
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
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Thumbnails, Counter]}
        thumbnails={{
          position: 'bottom',
          width: 60,
          height: 60,
          borderRadius: 8,
          gap: 8,
          imageFit: 'cover',
        }}
        counter={{ container: { style: { top: 16, left: 16 } } }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.92)' },
        }}
        carousel={{ finite: false }}
        animation={{ fade: 200 }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  )
}
