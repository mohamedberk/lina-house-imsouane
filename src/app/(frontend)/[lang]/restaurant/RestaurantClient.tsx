'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Clock,
  UtensilsCrossed,
  Anchor,
  Leaf,
  Flame,
  Heart,
  Star,
  Sun,
  Waves,
  Shield,
  Coffee,
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
import type { RestaurantPage, Media } from '@/payload-types'

// ─── Helpers ────────────────────────────────────────────────────────
const getMediaUrl = (media: string | Media | null | undefined, fallback: string): string => {
  if (!media) return fallback
  if (typeof media === 'string') return fallback
  return media.url || fallback
}

const ICON_LOOKUP: Record<string, React.ComponentType<{ className?: string }>> = {
  anchor: Anchor,
  leaf: Leaf,
  flame: Flame,
  heart: Heart,
  star: Star,
  utensils: UtensilsCrossed,
  sun: Sun,
  waves: Waves,
  shield: Shield,
  coffee: Coffee,
}

// ─── Animation Helpers ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

// ─── Fallback Data ──────────────────────────────────────────────────
const fallbackGalleryImages = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1590998901109-76577950db74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1743674453093-592bed88018e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1700652203311-b0e2cc4ed0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1652437318443-627e01b74d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
]

const fallbackDailyMeals = [
  {
    title: 'Breakfast',
    time: '8:00 AM — 10:30 AM',
    description: 'Start your day with fresh bread, eggs, Moroccan pancakes, seasonal fruit, fresh juice, and coffee on our sun-drenched terrace.',
    dishes: ['Moroccan Mint Tea Set', 'Msemen with Honey & Butter / Amlou', 'Omelette Berber — Eggs with Tomato', 'Avocado Toast with Egg'],
    badge: 'Included with Stay',
    img: 'https://images.unsplash.com/photo-1590998901109-76577950db74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: 'Lunch',
    time: '12:30 PM — 3:00 PM',
    description: 'Recharge between surf sessions with hearty tagines, fresh salads, and light bites made with local ingredients from the village market.',
    dishes: ['Chicken Tagine with Lemon & Olives', 'Couscous Royal (Mixed Meats)', 'Mixed Moroccan Salads', 'Chicken Sandwich'],
    badge: 'A la carte',
    img: 'https://images.unsplash.com/photo-1743674453093-592bed88018e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: 'BBQ Dinner',
    time: '7:00 PM — 9:30 PM',
    description: 'Fresh fish from the harbour, grilled over wood fire on our rooftop terrace. A communal dining experience under the stars.',
    dishes: ['Grilled Mixed Meats Plate', 'Mkkila: Seafood / Chicken / Minced Meat', 'Vegetable Tagine', 'Beef Tagine with Prunes & Almonds'],
    badge: 'Signature',
    img: 'https://images.unsplash.com/photo-1700652203311-b0e2cc4ed0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
]

const fallbackMenuSections = [
  { title: 'Starters', items: ['Moroccan Harira Soup', 'Zaalouk (Eggplant Salad)', 'Avocado Salad', 'Mixed Moroccan Salads'] },
  { title: 'Breakfast', items: ['Moroccan Mint Tea Set', 'Msemen with Honey & Butter / Amlou', 'Omelette Berber — Eggs with Tomato', 'Khlii with Eggs', 'Avocado Toast with Egg', 'Traditional Moroccan Breakfast Plate'] },
  { title: 'Main Courses', items: ['Chicken Tagine with Lemon & Olives', 'Beef Tagine with Prunes & Almonds', 'Vegetable Tagine', 'Couscous Royal (Mixed Meats)', 'Couscous with Seven Vegetables', 'Mkkila: Seafood / Chicken / Minced Meat', 'Grilled Mixed Meats Plate'] },
  { title: 'Snacks', items: ['Chicken Sandwich', 'Beef Burger / Cheeseburger', 'Chicken Wrap', 'Tacos Mixte', 'Tacos Vegetable', 'French Fries', 'Tacos: Minced Meat / Escalope Chicken'] },
  { title: 'Fresh Juices', items: ['Orange Juice', 'Avocado Juice', 'Mango Juice', 'Lemon Ginger Mint', 'Mixed Fruit Cocktail'] },
  { title: 'Drinks', items: ['Moroccan Mint Tea', 'Coffee Espresso / Cafe Latte', 'Hot Chocolate', 'Soft Drinks', 'Mineral Water'] },
  { title: 'Desserts', items: ['Moroccan Cookies (Kaab Ghzal, Ghriba...)', 'Orange Salad with Cinnamon', 'Fruit Salad'] },
]

const fallbackPhilosophy = [
  { icon: Anchor, title: 'From the Harbour', desc: "Fresh fish delivered daily from Imsouane's fishing boats" },
  { icon: Leaf, title: '100% Fresh', desc: 'All ingredients sourced from local markets and farms' },
  { icon: Flame, title: 'Wood-Fire Grill', desc: 'Traditional cooking methods passed down through generations' },
  { icon: Heart, title: 'Made with Love', desc: 'Home-cooked meals — every guest is family' },
]

// ─── Main Component ──────────────────────────────────────────────────
export default function RestaurantClient({
  lang,
  data,
}: {
  lang: 'en' | 'fr'
  data?: RestaurantPage | null
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [menuFilter, setMenuFilter] = useState<string | null>(null)

  // ─── Extract CMS sections ───
  const header = data?.headerSection
  const galleryCms = data?.gallerySection
  const mealsCms = data?.dailyMealsSection
  const menuCms = data?.menuSection
  const philCms = data?.philosophySection
  const ctaCms = data?.ctaSection

  // ─── Resolve gallery images ───
  const galleryImages: string[] = galleryCms?.images?.length
    ? galleryCms.images
        .map((item) => getMediaUrl(item.image, ''))
        .filter((url) => url !== '')
    : fallbackGalleryImages

  // ─── Resolve daily meals ───
  const dailyMeals = mealsCms?.meals?.length
    ? mealsCms.meals.map((meal, i) => ({
        title: meal.title,
        time: meal.time,
        description: meal.description ?? '',
        badge: meal.badge ?? '',
        img: getMediaUrl(meal.image, fallbackDailyMeals[i]?.img ?? ''),
        dishes: meal.dishes?.map((d) => d.name) ?? [],
      }))
    : fallbackDailyMeals

  // ─── Resolve menu sections ───
  const menuSections = menuCms?.categories?.length
    ? menuCms.categories.map((cat) => ({
        title: cat.title,
        items: cat.items?.map((item) => item.name) ?? [],
      }))
    : fallbackMenuSections

  // ─── Resolve philosophy items ───
  const philosophyItems = philCms?.items?.length
    ? philCms.items.map((item) => ({
        icon: ICON_LOOKUP[item.icon] || Anchor,
        title: item.title,
        desc: item.description ?? '',
      }))
    : fallbackPhilosophy

  const filteredSections = menuFilter
    ? menuSections.filter((s) => s.title === menuFilter)
    : menuSections

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const slides = galleryImages.map((src) => ({ src }))

  return (
    <>
      <main className="bg-[#FAF8F5]">
        {/* ══════════════════════════════════════════════════════════════
            HEADER — Breadcrumb + Title
            ══════════════════════════════════════════════════════════════ */}
        <section className="bg-white pt-8 pb-10 border-b border-[#EBEBEB]">
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
                <span className="text-[#222222] font-medium">
                  {header?.breadcrumbLabel ?? 'Restaurant'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-[42px] text-[#222222] tracking-tight">
                {header?.title ?? 'Restaurant & Kitchen'}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PHOTO GALLERY — Large main + 4 thumbnails
            ══════════════════════════════════════════════════════════════ */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-20 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[280px] sm:h-[420px] md:h-[480px]"
          >
            <div
              className="md:col-span-2 md:row-span-2 rounded-2xl md:rounded-r-none overflow-hidden cursor-pointer group relative"
              onClick={() => openLightbox(0)}
            >
              <Image
                src={galleryImages[0]}
                alt={galleryCms?.images?.[0]?.alt ?? 'Lina House restaurant'}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                1 / {galleryImages.length}
              </div>
            </div>

            {galleryImages.slice(1, 5).map((src, i) => (
              <div
                key={i}
                className={`hidden md:block overflow-hidden cursor-pointer group relative ${
                  i === 1 ? 'rounded-tr-2xl' : i === 3 ? 'rounded-br-2xl' : ''
                }`}
                onClick={() => openLightbox(i + 1)}
              >
                <Image
                  src={src}
                  alt={galleryCms?.images?.[i + 1]?.alt ?? `Restaurant gallery ${i + 2}`}
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
            DAILY MEALS — 3 Cards Grid
            ══════════════════════════════════════════════════════════════ */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-20 pb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col gap-8"
          >
            <motion.div variants={fadeUp} className="flex flex-col gap-2">
              <span className="text-[12px] font-bold tracking-[2px] text-[#E07A5F]">
                {mealsCms?.eyebrow ?? 'DAILY DINING'}
              </span>
              <h2 className="text-2xl sm:text-[28px] text-[#222222]">
                {mealsCms?.title ?? 'Three meals, one beautiful setting'}
              </h2>
              <p className="text-[#4A4A4A] text-base max-w-[600px] leading-[1.7]">
                {mealsCms?.subtitle ?? 'From sunrise breakfast to starlit BBQ dinners on our rooftop terrace'}
              </p>
            </motion.div>

            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
              {dailyMeals.map((meal) => (
                <motion.div
                  key={meal.title}
                  variants={fadeUp}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.10)] transition-shadow duration-300 flex flex-col"
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <Image
                      src={meal.img}
                      alt={meal.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover hover:scale-[1.03] transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide text-white bg-primary">
                      {meal.badge}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl text-[#222222]">{meal.title}</h3>
                      <div className="flex items-center gap-1.5 text-accent text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-medium text-[13px]">{meal.time}</span>
                      </div>
                    </div>
                    <p className="text-[#4A4A4A] text-sm leading-relaxed">{meal.description}</p>
                    <div className="pt-4 border-t border-[#EBEBEB] mt-auto">
                      <span className="text-[11px] font-bold tracking-[1.5px] text-[#999999] block mb-3">FROM THE MENU</span>
                      <div className="flex flex-col gap-2">
                        {meal.dishes.map((dish) => (
                          <div key={dish} className="flex items-center gap-2.5">
                            <div className="w-1 h-1 rounded-full bg-[#E07A5F] flex-shrink-0" />
                            <span className="text-[13px] text-[#4A4A4A]">{dish}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FULL MENU — All categories, clean editorial layout
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-white border-t border-[#EBEBEB]">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-12"
            >
              <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-3">
                <span className="text-[12px] font-bold tracking-[2px] text-[#E07A5F]">
                  {menuCms?.eyebrow ?? 'OUR MENU'}
                </span>
                <h2 className="text-2xl sm:text-[28px] text-[#222222]">
                  {menuCms?.title ?? 'Explore the full menu'}
                </h2>
              </motion.div>

              {/* Category Filter */}
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setMenuFilter(null)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    menuFilter === null
                      ? 'bg-[#1B4965] text-white shadow-md'
                      : 'bg-[#F7F7F7] text-[#717171] hover:bg-[#EBEBEB] hover:text-[#222222]'
                  }`}
                >
                  All
                </button>
                {menuSections.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => setMenuFilter(s.title)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      menuFilter === s.title
                        ? 'bg-[#1B4965] text-white shadow-md'
                        : 'bg-[#F7F7F7] text-[#717171] hover:bg-[#EBEBEB] hover:text-[#222222]'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </motion.div>

              <motion.div
                key={menuFilter || 'all'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="grid md:grid-cols-2 gap-x-16 gap-y-12"
              >
                {filteredSections.map((section) => (
                  <div key={section.title} className="flex flex-col">
                    <h3 className="text-lg text-[#222222] pb-4 border-b-2 border-[#1B4965]">
                      {section.title}
                    </h3>
                    <div className="flex flex-col">
                      {section.items.map((item, i) => (
                        <div
                          key={item}
                          className={`flex items-center gap-4 py-3.5 ${
                            i < section.items.length - 1 ? 'border-b border-[#F0F0F0]' : ''
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1B4965]/30 flex-shrink-0" />
                          <span className="text-[15px] text-[#2D2D2D]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FOOD PHILOSOPHY — Dark Section
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-[#1B4965]">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-10"
            >
              <motion.div variants={fadeUp} className="text-center flex flex-col gap-3">
                <h2 className="text-2xl sm:text-[28px] text-white">
                  {philCms?.title ?? 'Our Food Philosophy'}
                </h2>
                <p className="text-white/70 text-[15px] max-w-[550px] mx-auto">
                  {philCms?.subtitle ?? 'Every dish tells the story of Imsouane — from the harbour to your plate'}
                </p>
              </motion.div>

              <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {philosophyItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <motion.div key={item.title} variants={fadeUp} className="flex flex-col items-center text-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#E07A5F]" />
                      </div>
                      <h3 className="text-white font-semibold text-[15px]">{item.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            CTA
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-[#1B4965]" style={{ background: 'linear-gradient(to bottom, #1B4965, #163D55)' }}>
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
                  {ctaCms?.title ?? 'Come taste Imsouane'}
                </h2>
                <p className="text-white/70 text-[15px] max-w-[500px]">
                  {ctaCms?.description ?? 'Reserve your table, ask about our daily specials, or book a stay that includes all meals.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`https://wa.me/${ctaCms?.whatsappNumber ?? '212772228120'}?text=${encodeURIComponent(
                    ctaCms?.whatsappMessage ?? "Hi! I'd like to know about the restaurant at Lina House"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#E07A5F] hover:bg-[#D06A4F] text-white font-semibold rounded-xl transition-all text-[15px] shrink-0"
                >
                  {ctaCms?.whatsappButtonText ?? 'Message on WhatsApp'}
                  <ArrowRight className="w-[18px] h-[18px]" />
                </a>
                <a
                  href={`mailto:${ctaCms?.email ?? 'contact@linahouse.com'}`}
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all text-[15px] backdrop-blur-sm"
                >
                  {ctaCms?.emailButtonText ?? 'Send us an Email'}
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
