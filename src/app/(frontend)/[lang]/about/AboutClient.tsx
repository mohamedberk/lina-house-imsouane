'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Check,
  MapPin,
  Waves,
  UtensilsCrossed,
  Heart,
  Sun,
  Wifi,
  Shield,
  ArrowRight,
  MessageCircle,
} from 'lucide-react'
import { Footer } from '@/components/footer'
import { getIcon } from '@/lib/iconMap'

// ─── Animation Helpers ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── Images ──────────────────────────────────────────────────────────
const heroImage = 'https://images.unsplash.com/photo-1635356179820-8dd3d450f142?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'

const storyImage = 'https://images.unsplash.com/photo-1764957078457-f19f2206a528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'

const experienceImages = {
  surf: 'https://images.unsplash.com/photo-1727626239479-0005257495f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  food: 'https://images.unsplash.com/photo-1590998901109-76577950db74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  home: 'https://images.unsplash.com/photo-1583535045024-e2479a694777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
}

// ─── FAQ Data ────────────────────────────────────────────────────────
const faqData = [
  {
    question: 'What is the best time to visit Imsouane for surfing?',
    answer: 'Imsouane has waves year-round! The best surf season is from September to April when the Atlantic swells are most consistent. Beginners will find Magic Bay gentle and welcoming any time of year, while advanced surfers prefer the bigger winter swells at Cathedral.',
  },
  {
    question: 'Do I need to bring my own surf equipment?',
    answer: 'No, we provide surfboards and wetsuits for rent. Our collection includes foamies for beginners, longboards, and shortboards for experienced surfers. If you prefer your own gear, we have secure board storage available.',
  },
  {
    question: 'What is included with my stay at Lina House?',
    answer: 'Every stay includes a homemade breakfast, free WiFi, access to our rooftop terrace with ocean views, and use of common areas. Packages that include meals and surf lessons are also available for the best value.',
  },
  {
    question: 'How do I get to Imsouane from the airport?',
    answer: "The nearest airport is Agadir Al Massira (AGA), about a 2-hour drive. We can arrange private transfers for you. Alternatively, you can take a grand taxi or rent a car. From Essaouira it's 2.5 hours, and from Marrakech about 4 hours.",
  },
  {
    question: 'Can I book surf lessons without staying at Lina House?',
    answer: 'Absolutely! Our Surf Only package is perfect for day visitors. Join a 2-hour group session with a certified instructor — board and wetsuit included. Just €18.42 per session.',
  },
  {
    question: 'Is Lina House suitable for solo travelers?',
    answer: "Definitely! Many of our guests travel solo. The communal dinners, shared dorms, and rooftop terrace make it incredibly easy to meet people. You'll arrive alone and leave with friends from around the world.",
  },
]

// ─── CMS Media Helper ────────────────────────────────────────────────
function getMediaUrl(img: any, fallback: string): string {
  if (!img) return fallback
  if (typeof img === 'string') return img
  if (typeof img?.url === 'string') return img.url
  return fallback
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AboutClient({ lang, data }: { lang: 'en' | 'fr'; data?: any }) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // ─── Resolve CMS data with fallbacks ─────────────────────────────
  const hero = data?.heroSection
  const story = data?.storySection
  const experience = data?.experienceSection
  const strip = data?.featureStrip
  const expCards = data?.experienceCards
  const faqCms = data?.faqSection
  const ctaCms = data?.ctaSection

  // Hero
  const heroBackgroundImage = getMediaUrl(hero?.backgroundImage, heroImage)

  // Story
  const storyImageUrl = getMediaUrl(story?.image, storyImage)
  const storyFeatures = story?.features?.map((f: any) => f.label) || [
    '24/7 reception & security on site',
    'Secure luggage and board storage',
    'Safe, quiet neighborhood 500m from Magic Bay',
    'Trusted by 22+ Booking.com reviewers (9.7/10)',
    'Friendly, multilingual local team led by host Abdou',
  ]

  // Experience
  const experienceImageUrl = getMediaUrl(experience?.image, experienceImages.home)
  const experienceFeatures = experience?.features?.map((f: any) => f.label) || [
    'Ocean-view rooftop terrace with sunset vibes',
    'On-site restaurant with fresh local cuisine',
    'Wood-fire BBQ dinner every evening',
    'Free fiber optic WiFi throughout',
    'Homemade Moroccan breakfast included',
  ]

  // Feature strip
  const featureStripItems = strip?.items?.length
    ? strip.items.map((item: any) => ({
        icon: getIcon(item.icon),
        value: item.value,
        label: item.label,
      }))
    : [
        { icon: MapPin, value: '500m', label: 'From Beach' },
        { icon: Star, value: '9.7/10', label: 'Guest Rating' },
        { icon: UtensilsCrossed, value: 'Restaurant', label: 'On-site' },
        { icon: Sun, value: 'Rooftop', label: 'Terrace' },
        { icon: Wifi, value: 'Free WiFi', label: 'Fiber Optic' },
        { icon: Shield, value: '24/7', label: 'Security' },
      ]

  // Experience cards
  const experienceCardsList = expCards?.cards?.length
    ? expCards.cards.map((c: any) => ({
        icon: getIcon(c.icon) || Waves,
        title: c.title,
        image: getMediaUrl(c.image, experienceImages.surf),
        desc: c.description,
        features: c.features?.map((f: any) => f.label) || [],
      }))
    : [
        {
          icon: Waves,
          title: 'World-Class Surf',
          image: experienceImages.surf,
          desc: "Magic Bay's gentle, incredibly long waves are perfect for beginners. Advanced surfers can tackle Cathedral's powerful point break just around the corner.",
          features: ['Certified instructors', 'All levels welcome', 'Equipment provided'],
        },
        {
          icon: UtensilsCrossed,
          title: 'From Ocean to Table',
          image: experienceImages.food,
          desc: 'Fresh fish from the harbour, traditional tagines, and legendary wood-fire BBQ every evening. Every meal is made with love from local ingredients.',
          features: ['Fresh daily breakfast', 'Wood-fire BBQ dinner', 'Rooftop dining'],
        },
        {
          icon: Heart,
          title: 'A Place Called Home',
          image: experienceImages.home,
          desc: 'Cozy rooms, ocean-view rooftop terrace, and a warm community of travelers. Arrive as a guest, leave as family.',
          features: ['Ocean-view terrace', 'Fiber optic WiFi', 'Communal dinners'],
        },
      ]

  // FAQ
  const faqs = faqCms?.faqs?.length
    ? faqCms.faqs.map((f: any) => ({ question: f.question, answer: f.answer }))
    : faqData

  // CTA
  const ctaBackgroundImage = getMediaUrl(
    ctaCms?.backgroundImage,
    'https://images.unsplash.com/photo-1712472256773-f2a75a9861b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  )

  return (
    <main className="bg-sand-light overflow-x-hidden">
      {/* ══════════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src={heroBackgroundImage}
          alt={hero?.imageAlt ?? 'Imsouane coastline'}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B4965]/90 via-[#1B4965]/40 to-black/20" />

        <div className="absolute inset-0 flex flex-col justify-end pb-14 px-6 sm:px-20 max-w-[1340px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4"
          >
            <span className="text-accent text-sm font-semibold tracking-wide">
              {hero?.eyebrow ?? 'About Us'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              {hero?.title ?? (
                <>
                  Your Home by<br />the Ocean
                </>
              )}
            </h1>
            <p className="text-white/80 text-lg sm:text-xl max-w-[550px]">
              {hero?.description ?? 'A surf camp, hostel & restaurant in the heart of Imsouane \u2014 where the waves meet Moroccan hospitality.'}
            </p>
            <div className="flex flex-wrap items-center gap-5 mt-2 text-white/70">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                <span className="font-semibold text-white">{hero?.ratingValue ?? '9.7/10'}</span>
                <span className="text-sm">{hero?.ratingLabel ?? 'on Booking.com'}</span>
              </div>
              <div className="h-4 w-px bg-white/30" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-azure-light" />
                <span className="text-sm">{hero?.location ?? 'Imsouane, Morocco'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          OUR STORY — Image Left, Content Right
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-sand-light">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
            {/* Left — Image (hidden on mobile) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-full hidden lg:block"
            >
              <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={storyImageUrl}
                  alt={story?.imageAlt ?? 'Lina House rooftop and ocean view in Imsouane'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Right — Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col justify-center"
            >
              <p className="text-xs font-semibold text-accent tracking-widest uppercase mb-3">
                {story?.eyebrow ?? 'Our Story'}
              </p>
              <h2 className="text-2xl sm:text-[40px] text-[#222222] mb-5 leading-tight">
                {story?.title ?? 'A Place You Can Trust'}
              </h2>

              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-[#FFB800] text-[#FFB800]" />
                ))}
                <span className="ml-3 text-base text-[#717171]">
                  {story?.ratingText ?? '9.7/10 on Booking.com'}
                </span>
              </div>

              <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                {story?.description ?? (
                  <>
                    Nestled in the charming fishing village of Imsouane, Lina House is more than a hostel &mdash;
                    it&apos;s a gateway to Morocco&apos;s most magical coastline. Whether you&apos;re here to surf
                    the legendary Magic Bay, explore the village, or simply unwind on our rooftop terrace,
                    our doors are always open.
                  </>
                )}
              </p>

              {/* Mobile Image */}
              <div className="lg:hidden mb-6 relative h-[280px] sm:h-[350px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={storyImageUrl}
                  alt={story?.imageAlt ?? 'Lina House rooftop and ocean view in Imsouane'}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              {/* Features */}
              <div className="space-y-4">
                {storyFeatures.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#3A8FB7] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-base font-medium text-[#222222]">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          OUR EXPERIENCE — Content Left, Image Right
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
            {/* Left — Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col justify-center lg:order-1"
            >
              <p className="text-xs font-semibold text-accent tracking-widest uppercase mb-3">
                {experience?.eyebrow ?? 'Our Experience'}
              </p>
              <h2 className="text-2xl sm:text-[40px] text-[#222222] mb-5 leading-tight">
                {experience?.title ?? 'More Than Just a Place to Sleep'}
              </h2>

              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-[#FFB800] text-[#FFB800]" />
                ))}
                <span className="ml-3 text-base text-[#717171]">
                  {experience?.ratingText ?? 'Loved by guests worldwide'}
                </span>
              </div>

              <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
                {experience?.description1 ?? 'What started as a small guesthouse has grown into a vibrant community hub where travelers from around the world share waves, stories, and wood-fire dinners under the stars.'}
              </p>
              <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                {experience?.description2 ?? 'Our team \u2014 led by host Abdou \u2014 goes above and beyond to make every guest feel like family. From homemade breakfasts to organizing surf sessions, every detail is crafted for you.'}
              </p>

              {/* Mobile Image */}
              <div className="lg:hidden mb-6 relative h-[280px] sm:h-[350px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={experienceImageUrl}
                  alt={experience?.imageAlt ?? 'Cozy room at Lina House Imsouane'}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              {/* Features */}
              <div className="space-y-4">
                {experienceFeatures.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#3A8FB7] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-base font-medium text-[#222222]">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Image (hidden on mobile) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:order-2 h-full hidden lg:block"
            >
              <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={experienceImageUrl}
                  alt={experience?.imageAlt ?? 'Cozy room at Lina House Imsouane'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHY LINA HOUSE — Feature Strip
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-10 bg-primary-dark">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-around items-center gap-8"
          >
            {featureStripItems.map((item: any) => {
              const Icon = item.icon
              return (
                <motion.div key={item.value} variants={fadeUp} className="flex flex-col items-center gap-2 w-[140px]">
                  <Icon className="w-7 h-7 text-azure-light" />
                  <span className="font-bold text-[22px] text-white">{item.value}</span>
                  <span className="text-white/[0.53] text-xs">{item.label}</span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          THE EXPERIENCE — Three Cards
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col items-center gap-12"
          >
            <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-3">
              <span className="text-accent text-sm font-medium">
                {expCards?.eyebrow ?? 'The Experience'}
              </span>
              <h2 className="text-2xl sm:text-[40px] text-[#222222]">
                {expCards?.title ?? 'Surf, Eat & Feel at Home'}
              </h2>
              <p className="text-[#717171] text-[15px] max-w-[600px]">
                {expCards?.subtitle ?? 'Three pillars that make Lina House more than just another place to sleep'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 w-full">
              {experienceCardsList.map((card: any) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.title}
                    variants={fadeUp}
                    className="bg-white rounded-2xl overflow-hidden border border-[#EBEBEB] shadow-[0_4px_20px_rgba(0,0,0,0.05)] h-full flex flex-col"
                  >
                    <div className="relative h-[220px] overflow-hidden">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#222222]/5 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#222222]" />
                        </div>
                        <h3 className="font-bold text-[20px] text-[#222222]">{card.title}</h3>
                      </div>
                      <p className="text-[#4A4A4A] text-sm leading-[1.7]">{card.desc}</p>
                      <div className="flex flex-col gap-2.5 mt-auto">
                        {card.features.map((f: string) => (
                          <div key={f} className="flex items-center gap-2.5">
                            <Check className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                            <span className="text-[#4A4A4A] text-sm">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col items-center gap-10"
          >
            <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-3">
              <span className="text-accent text-sm font-medium">
                {faqCms?.eyebrow ?? 'FAQ'}
              </span>
              <h2 className="text-2xl sm:text-[40px] text-[#222222]">
                {faqCms?.title ?? 'Frequently Asked Questions'}
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-3 w-full">
              {faqs.map((item: any, idx: number) => {
                const isExpanded = expandedFaq === idx
                return (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    className={`group rounded-2xl border transition-all duration-200 ${
                      isExpanded
                        ? 'bg-white border-accent/30 shadow-md'
                        : 'bg-white border-[#EBEBEB] hover:border-[#DDDDDD]'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-start gap-3 text-left"
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs transition-all duration-200 ${
                        isExpanded
                          ? 'bg-accent text-white'
                          : 'bg-[#EBEBEB] text-[#8A8A8A] group-hover:bg-accent/10 group-hover:text-accent'
                      }`}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm leading-snug transition-colors ${
                          isExpanded ? 'text-[#222222]' : 'text-[#4A4A4A] group-hover:text-[#222222]'
                        }`}>
                          {item.question}
                        </h3>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="mt-2 text-sm text-[#717171] leading-relaxed pr-6">
                                {item.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isExpanded
                          ? 'bg-accent text-white'
                          : 'bg-[#EBEBEB] text-[#8A8A8A] group-hover:bg-[#DDDDDD]'
                      }`}>
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {isExpanded ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          )}
                        </svg>
                      </div>
                    </button>
                  </motion.div>
                )
              })}
            </div>

            {/* Still have questions */}
            <motion.div variants={fadeUp} className="text-center">
              <p className="text-sm text-[#8A8A8A] mb-3">
                {faqCms?.contactText ?? 'Still have questions?'}
              </p>
              <a
                href={faqCms?.whatsappUrl ?? 'https://wa.me/212772228120'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white font-semibold text-sm rounded-xl hover:bg-[#20bd5a] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                {faqCms?.whatsappLabel ?? 'Chat with us on WhatsApp'}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA — Full-bleed with overlay
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <Image
          src={ctaBackgroundImage}
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
            className="flex flex-col items-center gap-5"
          >
            <h2 className="text-2xl sm:text-[40px] text-white tracking-tight">
              {ctaCms?.title ?? 'Ready to Experience Imsouane?'}
            </h2>
            <p className="text-[#D0E8F0] text-lg max-w-[550px]">
              {ctaCms?.subtitle ?? "Book your stay at Lina House and discover the magic of Morocco's most beautiful coastline"}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <a
                href={ctaCms?.primaryButtonLink ?? `/${lang}/rooms`}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all text-[15px]"
              >
                {ctaCms?.primaryButtonText ?? 'View Rooms'}
                <ArrowRight className="w-[18px] h-[18px]" />
              </a>
              <a
                href={ctaCms?.secondaryButtonLink ?? `/${lang}/packages`}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-xl transition-all text-[15px] backdrop-blur-sm"
              >
                {ctaCms?.secondaryButtonText ?? 'View Packages'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
