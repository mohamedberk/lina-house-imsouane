'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Star,
  Wifi,
  Coffee,
  Sun,
  Bath,
  Bed,
  Users,
  Lock,
  Wind,
  Shirt,
  Waves,
  ZoomIn,
  ImageIcon,
} from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import { Footer } from '@/components/footer'
import { getIcon } from '@/lib/iconMap'
import { useCurrency } from '@/components/currency-switcher'
import { BLUR_DATA_URL } from '@/lib/blurDataUrl'

// ─── Animation Helpers ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

// ─── Room Detail Data ────────────────────────────────────────────────
interface Amenity {
  icon: React.ElementType
  label: string
}

interface RoomDetail {
  id: string
  slug: string
  name: string
  tagline: string
  detail: string
  description: string
  price: string | null
  priceWithBreakfast: string | null
  rating: string
  guests: number
  beds: string
  bathroom: string
  amenities: Amenity[]
  highlights: { icon: React.ElementType; title: string; desc: string }[]
  houseRules: string[]
  images: string[]
  badge?: string
  waMessage: string
}

const rooms: Record<string, RoomDetail> = {
  single: {
    id: 'single',
    slug: 'single',
    name: 'Single Room',
    tagline: 'A private surf retreat just 500m from Magic Bay',
    detail: '1 guest · Private room · Shared bathroom',
    description:
      'A cozy private room in our Imsouane surf camp, just 500m from Magic Bay — home to the longest right-hand wave in Africa. Perfect for solo surfers and travelers exploring Morocco\'s most authentic surf village. Recharge after riding world-class waves in a warm, Moroccan-styled space with Berber-inspired decor, natural light, and rooftop terrace access with ocean views. Free WiFi, daily breakfast available, and easy access to surf lessons with certified instructors.',
    price: '€18.14',
    priceWithBreakfast: '€22.28',
    rating: '4.9',
    guests: 1,
    beds: '1 single bed',
    bathroom: 'Shared bathroom',
    amenities: [
      { icon: Bed, label: 'Comfortable single bed' },
      { icon: Wifi, label: 'Free high-speed Wi-Fi' },
      { icon: Lock, label: 'Room lock & key' },
      { icon: Bath, label: 'Shared bathroom' },
      { icon: Sun, label: 'Rooftop terrace access' },
      { icon: Coffee, label: 'Common kitchen access' },
      { icon: Wind, label: 'Ceiling fan' },
      { icon: Shirt, label: 'Fresh towels & linens' },
    ],
    highlights: [
      { icon: Lock, title: 'Private Space', desc: 'Your own room' },
      { icon: Wifi, title: 'Free WiFi', desc: 'High-speed' },
      { icon: Sun, title: 'Rooftop', desc: 'Ocean views' },
      { icon: Waves, title: '500m to Beach', desc: 'Magic Bay' },
    ],
    houseRules: [
      'Check-in from 2:00 PM',
      'Check-out by 11:00 AM',
      'No smoking indoors',
      'Quiet hours 11 PM – 7 AM',
    ],
    images: [
      'https://images.unsplash.com/photo-1606796913825-2b02883605e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1590998901109-76577950db74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1652437318443-627e01b74d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    waMessage: "Hi! I'd like to book a Single Room at Lina House",
  },
  double: {
    id: 'double',
    slug: 'double',
    name: 'Double Room',
    tagline: 'Spacious room for couples in Imsouane\'s best surf hostel',
    detail: '2 guests · Double bed · Shared bathroom',
    description:
      'Our most popular room — a spacious double room ideal for couples or friends visiting Imsouane\'s legendary surf breaks. Enjoy Berber-inspired decor, warm Moroccan textiles, and natural light in a bright, inviting atmosphere. Located just 500m from Magic Bay, you\'re steps from beginner-friendly waves and the longest right-hand wave in Africa. Easy access to the beach, our rooftop restaurant with fresh-caught seafood, and surf lessons near Agadir and Essaouira.',
    price: '€28.27',
    priceWithBreakfast: '€36.37',
    rating: '4.9',
    guests: 2,
    beds: '1 double bed',
    bathroom: 'Shared bathroom',
    badge: 'Most Popular',
    amenities: [
      { icon: Bed, label: 'Double bed' },
      { icon: Wifi, label: 'Free high-speed Wi-Fi' },
      { icon: Bath, label: 'Shared bathroom' },
      { icon: Sun, label: 'Rooftop terrace access' },
      { icon: Lock, label: 'Room lock & key' },
      { icon: Coffee, label: 'Common kitchen access' },
      { icon: Wind, label: 'Ceiling fan' },
      { icon: Shirt, label: 'Fresh towels & linens' },
    ],
    highlights: [
      { icon: Bed, title: 'Double Bed', desc: 'Spacious & comfy' },
      { icon: Lock, title: 'Private Room', desc: 'Your own space' },
      { icon: Wifi, title: 'Free WiFi', desc: 'High-speed' },
      { icon: Waves, title: '500m to Beach', desc: 'Magic Bay' },
    ],
    houseRules: [
      'Check-in from 2:00 PM',
      'Check-out by 11:00 AM',
      'No smoking indoors',
      'Quiet hours 11 PM – 7 AM',
    ],
    images: [
      'https://images.unsplash.com/photo-1583535045024-e2479a694777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600',
      'https://images.unsplash.com/photo-1590490360182-c33d955a75e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1590998901109-76577950db74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1652437318443-627e01b74d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    waMessage: "Hi! I'd like to book a Double Room at Lina House",
  },
  twin: {
    id: 'twin',
    slug: 'twin',
    name: 'Twin Room',
    tagline: 'The perfect base for a Moroccan surf trip with friends',
    detail: '2 guests · Twin beds · Shared bathroom',
    description:
      'Comfortable twin room for two friends on a surf trip to Imsouane, Morocco. Two separate beds, Moroccan-style decor, plenty of natural light, and a laid-back vibe. Share stories after riding the longest wave in Africa, then retreat to your own bed. Rooftop terrace with ocean views, free WiFi, and the perfect base for your surf camp adventure — between Agadir and Essaouira on Morocco\'s Atlantic coast.',
    price: '€28.27',
    priceWithBreakfast: '€36.37',
    rating: '4.8',
    guests: 2,
    beds: '2 single beds',
    bathroom: 'Shared bathroom',
    amenities: [
      { icon: Bed, label: 'Two single beds' },
      { icon: Wifi, label: 'Free high-speed Wi-Fi' },
      { icon: Bath, label: 'Shared bathroom' },
      { icon: Lock, label: 'Room lock & key' },
      { icon: Sun, label: 'Rooftop terrace access' },
      { icon: Coffee, label: 'Common kitchen access' },
      { icon: Wind, label: 'Ceiling fan' },
      { icon: Shirt, label: 'Fresh towels & linens' },
    ],
    highlights: [
      { icon: Users, title: 'Twin Setup', desc: '2 separate beds' },
      { icon: Wifi, title: 'Free WiFi', desc: 'High-speed' },
      { icon: Sun, title: 'Rooftop', desc: 'Ocean views' },
      { icon: Waves, title: '500m to Beach', desc: 'Magic Bay' },
    ],
    houseRules: [
      'Check-in from 2:00 PM',
      'Check-out by 11:00 AM',
      'No smoking indoors',
      'Quiet hours 11 PM – 7 AM',
    ],
    images: [
      'https://images.unsplash.com/photo-1668706936367-2bef7e0e38db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1590998901109-76577950db74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1652437318443-627e01b74d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    waMessage: "Hi! I'd like to book a Twin Room at Lina House",
  },
  'female-dorm': {
    id: 'female-dorm',
    slug: 'female-dorm',
    name: 'Female Dorm',
    tagline: 'Budget-friendly surf accommodation for solo women travelers',
    detail: '1 guest · Female only · 4-bed dorm',
    description:
      'A welcoming 4-bed female-only dorm in our Imsouane surf hostel — the most budget-friendly way to experience Morocco\'s best surf. Perfect for solo women travelers looking for a safe, social space to meet like-minded adventurers. Each bed comes with a personal reading light, power outlet, and a locker. Just steps from Magic Bay, home to beginner-friendly waves year-round, with 24/7 security, free WiFi, and rooftop terrace with ocean views.',
    price: '€13.08',
    priceWithBreakfast: '€17.13',
    rating: '4.9',
    guests: 1,
    beds: '1 bunk bed (4-bed dorm)',
    bathroom: 'Shared bathroom',
    badge: 'Best Value',
    amenities: [
      { icon: Bed, label: 'Comfortable bunk bed' },
      { icon: Wifi, label: 'Free high-speed Wi-Fi' },
      { icon: Lock, label: 'Personal locker' },
      { icon: Bath, label: 'Shared bathroom' },
      { icon: Sun, label: 'Rooftop terrace access' },
      { icon: Coffee, label: 'Common kitchen access' },
      { icon: Wind, label: 'Ceiling fan' },
      { icon: Shirt, label: 'Fresh towels & linens' },
    ],
    highlights: [
      { icon: Users, title: 'Female Only', desc: 'Safe space' },
      { icon: Lock, title: 'Lockers', desc: 'Secure storage' },
      { icon: Wifi, title: 'Free WiFi', desc: 'High-speed' },
      { icon: Waves, title: '500m to Beach', desc: 'Magic Bay' },
    ],
    houseRules: [
      'Check-in from 2:00 PM',
      'Check-out by 11:00 AM',
      'Female guests only',
      'No smoking indoors',
      'Quiet hours 11 PM – 7 AM',
    ],
    images: [
      'https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1590998901109-76577950db74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1652437318443-627e01b74d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    waMessage: "Hi! I'd like to book a Female Dorm bed at Lina House",
  },
  'male-dorm': {
    id: 'male-dorm',
    slug: 'male-dorm',
    name: 'Male Dorm',
    tagline: 'Affordable surf hostel dorm in the heart of Imsouane',
    detail: '1 guest · Male only · 4-bed dorm',
    description:
      'Our male dorm is the heart of the hostel — where surfers, backpackers, and adventurers from around the world come together in Morocco\'s most laid-back surf village. With 4 comfortable bunk beds, personal reading lights, power outlets, and shared bathroom facilities, it\'s the most social and affordable way to experience Imsouane. Wake up minutes from the longest wave in Africa, enjoy communal rooftop dinners with fresh-caught seafood, and join daily surf lessons at Magic Bay.',
    price: '€13.08',
    priceWithBreakfast: '€17.13',
    rating: '4.7',
    guests: 1,
    beds: '1 bunk bed (4-bed dorm)',
    bathroom: 'Shared bathroom',
    amenities: [
      { icon: Bed, label: 'Comfortable bunk bed' },
      { icon: Wifi, label: 'Free high-speed Wi-Fi' },
      { icon: Lock, label: 'Personal locker' },
      { icon: Bath, label: 'Shared bathroom' },
      { icon: Sun, label: 'Rooftop terrace access' },
      { icon: Coffee, label: 'Common kitchen access' },
      { icon: Wind, label: 'Ceiling fan' },
      { icon: Shirt, label: 'Fresh towels & linens' },
    ],
    highlights: [
      { icon: Users, title: 'Social Vibes', desc: 'Meet travelers' },
      { icon: Lock, title: 'Lockers', desc: 'Secure storage' },
      { icon: Wifi, title: 'Free WiFi', desc: 'High-speed' },
      { icon: Waves, title: '500m to Beach', desc: 'Magic Bay' },
    ],
    houseRules: [
      'Check-in from 2:00 PM',
      'Check-out by 11:00 AM',
      'Male guests only',
      'No smoking indoors',
      'Quiet hours 11 PM – 7 AM',
    ],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600',
      'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1590998901109-76577950db74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1652437318443-627e01b74d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    waMessage: "Hi! I'd like to book a Male Dorm bed at Lina House",
  },
  apartment: {
    id: 'apartment',
    slug: 'apartment',
    name: 'Private Apartment',
    tagline: 'Your own fully equipped home in Imsouane, Morocco',
    detail: '4 guests · Full apartment · Kitchen & shower',
    description:
      'The ultimate Imsouane surf camp experience — a fully equipped private apartment for up to 4 guests with its own kitchen, private shower, and total privacy. Perfect for families or small groups looking for a surf holiday in Morocco with the freedom to cook fresh local ingredients from the Imsouane market. Located 500m from Magic Bay, with rooftop terrace access, free WiFi, and easy access to surf lessons, board rentals, and our restaurant serving traditional Moroccan cuisine.',
    price: '€65.84',
    priceWithBreakfast: null,
    rating: '5.0',
    guests: 4,
    beds: '1 room + 4 beds',
    bathroom: 'Private shower',
    badge: 'Premium',
    amenities: [
      { icon: Bed, label: 'Room with 4 beds' },
      { icon: Wifi, label: 'Free high-speed Wi-Fi' },
      { icon: Bath, label: 'Private shower' },
      { icon: Coffee, label: 'Full private kitchen' },
      { icon: Lock, label: 'Private entrance' },
      { icon: Sun, label: 'Rooftop terrace access' },
      { icon: Wind, label: 'Ceiling fan' },
      { icon: Shirt, label: 'Fresh towels & linens' },
    ],
    highlights: [
      { icon: Coffee, title: 'Full Kitchen', desc: 'Cook at home' },
      { icon: Bath, title: 'Private Shower', desc: 'En-suite' },
      { icon: Lock, title: 'Private Entry', desc: 'Total privacy' },
      { icon: Users, title: 'Fits 4 Guests', desc: 'Family-friendly' },
    ],
    houseRules: [
      'Check-in from 2:00 PM',
      'Check-out by 11:00 AM',
      'No smoking indoors',
      'Quiet hours 11 PM – 7 AM',
      'No parties or events',
    ],
    images: [
      'https://images.unsplash.com/photo-1650137938625-11576502aecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1590998901109-76577950db74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1652437318443-627e01b74d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    waMessage: "Hi! I'd like to book the Private Apartment at Lina House",
  },
}

// ─── Other Rooms helper ──────────────────────────────────────────────
const otherRoomSummary: Record<string, { name: string; price: string; detail: string; image: string; rating: string }> = {
  single: {
    name: 'Single Room',
    price: '€18.14 / night',
    detail: '1 guest · Private room',
    image: 'https://images.unsplash.com/photo-1606796913825-2b02883605e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: '4.9',
  },
  double: {
    name: 'Double Room',
    price: '€28.27 / night',
    detail: '2 guests · Shared bathroom',
    image: 'https://images.unsplash.com/photo-1583535045024-e2479a694777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: '4.9',
  },
  twin: {
    name: 'Twin Room',
    price: '€28.27 / night',
    detail: '2 guests · Twin beds',
    image: 'https://images.unsplash.com/photo-1668706936367-2bef7e0e38db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: '4.8',
  },
  'female-dorm': {
    name: 'Female Dorm',
    price: '€13.08 / night',
    detail: 'Female only · 4-bed',
    image: 'https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: '4.9',
  },
  'male-dorm': {
    name: 'Male Dorm',
    price: '€13.08 / night',
    detail: 'Male only · 4-bed',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: '4.7',
  },
  apartment: {
    name: 'Private Apartment',
    price: '€65.84 / night',
    detail: '4 guests · Full apartment',
    image: 'https://images.unsplash.com/photo-1650137938625-11576502aecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: '5.0',
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMediaUrl = (media: any): string => {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media.url || ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCmsRoom(doc: any): RoomDetail {
  return {
    id: doc.slug || doc.id,
    slug: doc.slug || '',
    name: doc.name || '',
    tagline: doc.tagline || '',
    detail: doc.detail || '',
    description: doc.description || '',
    price: doc.price ? `€${Number(doc.price).toFixed(2)}` : null,
    priceWithBreakfast: doc.priceBreakfast ? `€${Number(doc.priceBreakfast).toFixed(2)}` : null,
    rating: doc.rating || '',
    guests: doc.guests || 1,
    beds: doc.beds || '',
    bathroom: doc.bathroom || '',
    amenities: (doc.amenities || []).map((a: any) => ({
      icon: getIcon(a.icon),
      label: a.label || '',
    })),
    highlights: (doc.highlights || []).map((h: any) => ({
      icon: getIcon(h.icon),
      title: h.title || '',
      desc: h.desc || '',
    })),
    houseRules: (doc.houseRules || []).map((r: any) => r.rule || ''),
    images: ((doc.images || []).map((img: any) => getMediaUrl(img?.image)).filter(Boolean)).length > 0
      ? (doc.images || []).map((img: any) => getMediaUrl(img?.image)).filter(Boolean)
      : (rooms[doc.slug]?.images || []),
    badge: doc.badge || undefined,
    waMessage: doc.waMessage || `Hi! I'd like to book a ${doc.name || 'room'} at Lina House`,
  }
}

// ─── Main Component ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RoomDetailClient({
  lang,
  slug,
  room: roomProp,
  allRooms: allRoomsProp,
}: {
  lang: 'en' | 'fr'
  slug: string
  room?: any
  allRooms?: any[]
}) {
  const { formatPrice } = useCurrency()

  // CMS-only: hardcoded rooms/otherRoomSummary kept in code as backup but not used
  const room = roomProp ? mapCmsRoom(roomProp) : null
  const otherSlugs = allRoomsProp && allRoomsProp.length > 0
    ? allRoomsProp.filter((r: any) => r.slug !== slug).slice(0, 3).map((r: any) => r.slug)
    : []

  // Build otherRooms from CMS only — shape matches homepage RoomsSection cards
  const otherRoomsMap = allRoomsProp && allRoomsProp.length > 0
    ? Object.fromEntries(allRoomsProp.map((r: any) => [r.slug, {
        name: r.name || '',
        slug: r.slug || '',
        price: r.price ? Number(r.price) : 0,
        priceBreakfast: r.priceBreakfast ? Number(r.priceBreakfast) : null,
        detail: r.detail || '',
        image: (r.images && r.images[0]?.image) ? getMediaUrl(r.images[0].image) : (otherRoomSummary[r.slug]?.image || ''),
        rating: r.rating || '',
      }]))
    : {} as Record<string, { name: string; slug: string; price: number; priceBreakfast: number | null; detail: string; image: string; rating: string }>

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const slides = room ? room.images.map((src: string) => ({ src })) : []
  const imageCount = room ? room.images.length : 0

  if (!room) return null

  return (
    <>
      <main className="bg-[#FAF8F5]">
        {/* ══════════════════════════════════════════════════════════════
            HEADER — Breadcrumb + Title + Badge
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
                  href={`/${lang}/rooms`}
                  className="hover:text-[#222222] transition-colors"
                >
                  Rooms
                </a>
                <span>/</span>
                <span className="text-[#222222] font-medium">{room.name}</span>
              </div>

              {/* Title + Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h1 className="text-3xl sm:text-[42px] text-[#222222] tracking-tight">
                  {room.name}
                </h1>
                {room.badge && (
                  <span
                    className={`inline-flex w-fit px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider ${
                      room.badge === 'Most Popular'
                        ? 'bg-[#E07A5F] text-white'
                        : room.badge === 'Best Value'
                          ? 'bg-[#1B4965] text-white'
                          : 'bg-[#222222] text-white'
                    }`}
                  >
                    {room.badge}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PHOTO GALLERY — Flexible layout based on image count (1–5+)
            ══════════════════════════════════════════════════════════════ */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-20 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`grid gap-2 h-[280px] sm:h-[420px] md:h-[480px] ${
              imageCount === 1
                ? 'grid-cols-1'
                : imageCount === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : imageCount === 3
                    ? 'grid-cols-1 md:grid-cols-3 md:grid-rows-2'
                    : 'grid-cols-1 md:grid-cols-4 md:grid-rows-2'
            }`}
          >
            {/* Main image — adapts span based on count */}
            <div
              className={`overflow-hidden cursor-pointer group relative ${
                imageCount === 1
                  ? 'rounded-2xl'
                  : imageCount === 2
                    ? 'rounded-2xl md:rounded-r-none'
                    : imageCount === 3
                      ? 'md:col-span-2 md:row-span-2 rounded-2xl md:rounded-r-none'
                      : 'md:col-span-2 md:row-span-2 rounded-2xl md:rounded-r-none'
              }`}
              onClick={() => openLightbox(0)}
            >
              <Image
                src={room.images[0]}
                alt={`${room.name} at Lina House`}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
              {/* Image count badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                1 / {room.images.length}
              </div>
            </div>

            {/* Remaining images — layout adapts to count */}
            {imageCount === 2 && (
              <div
                className="hidden md:block overflow-hidden cursor-pointer group relative rounded-2xl md:rounded-l-none"
                onClick={() => openLightbox(1)}
              >
                <Image
                  src={room.images[1]}
                  alt={`${room.name} gallery 2`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
              </div>
            )}

            {imageCount === 3 &&
              room.images.slice(1, 3).map((src, i) => (
                <div
                  key={i}
                  className={`hidden md:block overflow-hidden cursor-pointer group relative ${
                    i === 0 ? 'rounded-tr-2xl' : 'rounded-br-2xl'
                  }`}
                  onClick={() => openLightbox(i + 1)}
                >
                  <Image
                    src={src}
                    alt={`${room.name} gallery ${i + 2}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                </div>
              ))}

            {imageCount === 4 &&
              room.images.slice(1, 4).map((src, i) => (
                <div
                  key={i}
                  className={`hidden md:block overflow-hidden cursor-pointer group relative ${
                    i === 0 ? 'rounded-tr-2xl' : ''
                  } ${i === 2 ? 'rounded-br-2xl md:col-span-2' : ''}`}
                  onClick={() => openLightbox(i + 1)}
                >
                  <Image
                    src={src}
                    alt={`${room.name} gallery ${i + 2}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                </div>
              ))}

            {imageCount >= 5 &&
              room.images.slice(1, 5).map((src, i) => (
                <div
                  key={i}
                  className={`hidden md:block overflow-hidden cursor-pointer group relative ${
                    i === 1 ? 'rounded-tr-2xl' : i === 3 ? 'rounded-br-2xl' : ''
                  }`}
                  onClick={() => openLightbox(i + 1)}
                >
                  <Image
                    src={src}
                    alt={`${room.name} gallery ${i + 2}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
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
              {/* Room Overview */}
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
                  ROOM OVERVIEW
                </motion.span>
                <motion.h2
                  variants={fadeUp}
                  className="text-2xl sm:text-[28px] font-bold text-[#222222]"
                >
                  {room.tagline}
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-[#4A4A4A] text-base leading-[1.7] max-w-[700px]"
                >
                  {room.description}
                </motion.p>

                <motion.div variants={fadeUp} className="w-full h-px bg-[#EBEBEB] mt-2" />

                {/* Highlights row */}
                <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {room.highlights.map((h) => {
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

              {/* Room Details */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-5"
              >
                <motion.h3 variants={fadeUp} className="text-2xl font-bold text-[#222222]">
                  Room details
                </motion.h3>
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-[#EBEBEB] overflow-hidden"
                >
                  <div className="flex items-center gap-5 px-5 py-4 bg-white">
                    <Bed className="w-[18px] h-[18px] text-[#3A8FB7] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium text-[#222222]">Sleeping</span>
                      <span className="text-sm text-[#717171]">{room.beds}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 px-5 py-4 bg-[#F7F7F7]">
                    <Bath className="w-[18px] h-[18px] text-[#3A8FB7] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium text-[#222222]">Bathroom</span>
                      <span className="text-sm text-[#717171]">{room.bathroom}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 px-5 py-4 bg-white">
                    <Users className="w-[18px] h-[18px] text-[#3A8FB7] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium text-[#222222]">Guests</span>
                      <span className="text-sm text-[#717171]">Up to {room.guests} {room.guests === 1 ? 'guest' : 'guests'}</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-5"
              >
                <motion.div variants={fadeUp} className="w-full h-px bg-[#EBEBEB]" />
                <motion.h3 variants={fadeUp} className="text-2xl font-bold text-[#222222]">
                  What this room offers
                </motion.h3>
                <motion.div
                  variants={fadeUp}
                  className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5"
                >
                  {room.amenities.map((amenity) => {
                    const Icon = amenity.icon
                    return (
                      <div key={amenity.label} className="flex items-center gap-2.5">
                        <Icon className="w-[18px] h-[18px] text-[#3A8FB7] flex-shrink-0" />
                        <span className="text-[15px] text-[#4A4A4A]">{amenity.label}</span>
                      </div>
                    )
                  })}
                </motion.div>
              </motion.div>

              {/* House Rules */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-4"
              >
                <motion.div variants={fadeUp} className="w-full h-px bg-[#EBEBEB]" />
                <motion.h3 variants={fadeUp} className="text-xl font-bold text-[#222222]">
                  House rules
                </motion.h3>
                <motion.div variants={fadeUp} className="flex flex-col gap-3">
                  {room.houseRules.map((rule) => (
                    <div key={rule} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                      <span className="text-[15px] text-[#4A4A4A]">{rule}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
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
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-3">
                      {room.priceWithBreakfast && (
                        <span className="text-lg font-bold text-[#222222] line-through">{room.priceWithBreakfast}</span>
                      )}
                      <span className="text-[32px] font-bold text-[#E07A5F]">
                        {room.price}
                      </span>
                      <span className="text-base text-[#717171]">/ night</span>
                    </div>
                    {room.priceWithBreakfast && (
                      <span className="text-xs text-[#717171]">
                        Breakfast included at {room.priceWithBreakfast} / night
                      </span>
                    )}
                  </div>

                  <div className="w-full h-px bg-[#EBEBEB]" />

                  {/* Room quick info */}
                  <div className="flex flex-col gap-3.5">
                    <span className="text-[11px] font-bold tracking-[1.5px] text-[#999999]">
                      ROOM DETAILS
                    </span>
                    <div className="flex items-center gap-2.5">
                      <Bed className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                      <span className="text-sm text-[#444444]">{room.beds}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Bath className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                      <span className="text-sm text-[#444444]">{room.bathroom}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                      <span className="text-sm text-[#444444]">Up to {room.guests} {room.guests === 1 ? 'guest' : 'guests'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Wifi className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                      <span className="text-sm text-[#444444]">Free Wi-Fi included</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Star className="w-4 h-4 fill-[#3A8FB7] text-[#3A8FB7] flex-shrink-0" />
                      <span className="text-sm text-[#444444]">{room.rating} on Booking.com</span>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <a
                    href={`/${lang}/booking?type=room&slug=${room.slug}`}
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#E07A5F] hover:bg-[#D06A4F] text-white font-bold text-[15px] rounded-xl transition-all"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  {/* Secondary CTA */}
                  <a
                    href="https://wa.me/212772228120"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-[#F7F7F7] text-[#222222] font-semibold text-sm rounded-xl border border-[#DDDDDD] transition-all"
                  >
                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Have questions? WhatsApp us
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
            OTHER ROOMS
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
                Explore other rooms
              </motion.h2>
              <motion.div variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherSlugs.slice(0, 3).map((s) => {
                  const other = otherRoomsMap[s]
                  return (
                    <motion.div
                      key={s}
                      variants={fadeUp}
                      className="group rounded-2xl overflow-hidden"
                    >
                      <Link href={`/${lang}/rooms/${s}`} className="block">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                          <Image
                            src={other.image}
                            alt={other.name}
                            fill
                            loading="lazy"
                            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="pt-4 pb-2 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-[17px] text-[#222222]">{other.name}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                              <span className="text-sm font-medium text-[#222222]">{other.rating}</span>
                            </div>
                          </div>
                          <p className="text-[#717171] text-sm">{other.detail}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {other.priceBreakfast && (
                              <span className="text-sm font-bold text-[#222222] line-through">{formatPrice(other.priceBreakfast)}</span>
                            )}
                            <span className="font-bold text-base text-[#E07A5F]">{formatPrice(other.price)}</span>
                            <span className="text-[#717171] text-sm">/ night</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PACKAGES CTA
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-[#1B4965]">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl sm:text-[28px] text-white">
                  Save more with our packages
                </h2>
                <p className="text-white/70 text-[15px] max-w-[500px]">
                  Bundle your room with surf lessons, meals, and equipment for the best value. Packages start at €31.22/night.
                </p>
              </div>
              <a
                href={`/${lang}/packages`}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#E07A5F] hover:bg-[#D06A4F] text-white font-semibold rounded-xl transition-all text-[15px] shrink-0"
              >
                View Packages
                <ArrowRight className="w-[18px] h-[18px]" />
              </a>
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
