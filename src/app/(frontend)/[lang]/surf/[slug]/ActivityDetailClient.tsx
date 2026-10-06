'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  XCircle,
  Waves,
  Clock,
  Users,
  Star,
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
import { useCurrency } from '@/components/currency-switcher'
import { getIcon } from '@/lib/iconMap'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMediaUrl = (media: any): string => {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media.url || ''
}

const HOUSE_WHATSAPP = '212772228120'

type Props = {
  lang: 'en' | 'fr'
  slug: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activity: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allActivities?: any[]
}

export default function ActivityDetailClient({ lang, slug, activity, allActivities }: Props) {
  const { formatPrice } = useCurrency()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const images: string[] = (activity?.images || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((img: any) => getMediaUrl(img?.image))
    .filter(Boolean)

  const imageCount = images.length
  const slides = images.map((src) => ({ src }))

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx)
    setLightboxOpen(true)
  }

  const title: string = activity?.title || ''
  const tagline: string = activity?.tagline || ''
  const description: string = activity?.description || ''
  const badge: string = activity?.badge || ''
  const duration: string = activity?.duration || ''
  const level: string = activity?.level || ''
  const groupSize: string = activity?.groupSize || ''
  const price: number = typeof activity?.price === 'number' ? activity.price : 0
  const priceUnit: string = activity?.priceUnit || ''
  const bookingLink: string = activity?.bookingLink || ''
  const bookingText: string = activity?.bookingText || 'Book Now'
  const waMessage: string = activity?.waMessage || `Hi! I'd like to book the ${title || 'surf lesson'} at Lina House`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const features: string[] = (activity?.features || []).map((f: any) => f?.label || '').filter(Boolean)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const includes: string[] = (activity?.includes || []).map((i: any) => i?.item || '').filter(Boolean)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notIncluded: string[] = (activity?.notIncluded || []).map((i: any) => i?.item || '').filter(Boolean)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const highlights = (activity?.highlights || []).map((h: any) => ({
    icon: getIcon(h?.icon),
    title: h?.title || '',
    desc: h?.desc || '',
  }))

  const other = (allActivities || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((a: any) => a?.slug && a.slug !== slug)
    .slice(0, 3)

  const resolvedBookingHref = bookingLink?.startsWith('http')
    ? bookingLink
    : `/${lang}${bookingLink || `/booking?type=surf&slug=${slug}`}`

  return (
    <>
      <main className="bg-[#FAF8F5]">
        {/* Header */}
        <section className="bg-white pt-8 pb-10 border-b border-[#EBEBEB]">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-[#717171]">
                <Link href={`/${lang}`} className="hover:text-[#222222] transition-colors">
                  Home
                </Link>
                <span>/</span>
                <Link href={`/${lang}/surf`} className="hover:text-[#222222] transition-colors">
                  Surf
                </Link>
                <span>/</span>
                <span className="text-[#222222] font-medium">{title}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h1 className="text-3xl sm:text-[42px] text-[#222222] tracking-tight">
                  {title}
                </h1>
                {badge && (
                  <span className="inline-flex w-fit px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider bg-[#1B4965] text-white">
                    {badge}
                  </span>
                )}
              </div>
              {tagline && (
                <p className="text-[#E07A5F] text-[15px] font-medium">{tagline}</p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Gallery */}
        {imageCount > 0 && (
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
                    : 'grid-cols-1 md:grid-cols-4 md:grid-rows-2'
              }`}
            >
              <div
                className={`overflow-hidden cursor-pointer group relative ${
                  imageCount === 1
                    ? 'rounded-2xl'
                    : imageCount === 2
                      ? 'rounded-2xl md:rounded-r-none'
                      : 'md:col-span-2 md:row-span-2 rounded-2xl md:rounded-r-none'
                }`}
                onClick={() => openLightbox(0)}
              >
                <Image
                  src={images[0]}
                  alt={`${title} at Lina House`}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  1 / {imageCount}
                </div>
              </div>

              {imageCount === 2 && (
                <div
                  className="hidden md:block overflow-hidden cursor-pointer group relative rounded-2xl md:rounded-l-none"
                  onClick={() => openLightbox(1)}
                >
                  <Image
                    src={images[1]}
                    alt={`${title} gallery 2`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}

              {imageCount >= 3 &&
                images.slice(1, 5).map((src, i) => (
                  <div
                    key={i}
                    className={`hidden md:block overflow-hidden cursor-pointer group relative ${
                      i === 1 ? 'rounded-tr-2xl' : i === 3 ? 'rounded-br-2xl' : ''
                    }`}
                    onClick={() => openLightbox(i + 1)}
                  >
                    <Image
                      src={src}
                      alt={`${title} gallery ${i + 2}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
            </motion.div>
          </section>
        )}

        {/* Main content */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-20 pb-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left column */}
            <div className="flex-1 flex flex-col gap-12 min-w-0">
              {/* Overview */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-5"
              >
                <motion.span variants={fadeUp} className="text-[12px] font-bold tracking-[2px] text-[#E07A5F]">
                  ABOUT THIS LESSON
                </motion.span>
                {tagline && (
                  <motion.h2 variants={fadeUp} className="text-2xl sm:text-[28px] font-bold text-[#222222]">
                    {tagline}
                  </motion.h2>
                )}
                {description && (
                  <motion.p variants={fadeUp} className="text-[#4A4A4A] text-base leading-[1.7] max-w-[700px]">
                    {description}
                  </motion.p>
                )}

                {/* Quick info chips */}
                {(duration || level || groupSize) && (
                  <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
                    {duration && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#EBEBEB] text-sm text-[#4A4A4A]">
                        <Clock className="w-4 h-4 text-[#3A8FB7]" />
                        {duration}
                      </span>
                    )}
                    {groupSize && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#EBEBEB] text-sm text-[#4A4A4A]">
                        <Users className="w-4 h-4 text-[#3A8FB7]" />
                        {groupSize}
                      </span>
                    )}
                    {level && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#EBEBEB] text-sm text-[#4A4A4A]">
                        <Waves className="w-4 h-4 text-[#3A8FB7]" />
                        {level}
                      </span>
                    )}
                  </motion.div>
                )}

                {highlights.length > 0 && (
                  <>
                    <motion.div variants={fadeUp} className="w-full h-px bg-[#EBEBEB] mt-2" />
                    <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {highlights.map((h: any, i: number) => {
                        const Icon = h.icon || Star
                        return (
                          <div
                            key={`${h.title}-${i}`}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F7F7F7]"
                          >
                            <Icon className="w-7 h-7 text-[#3A8FB7]" />
                            <span className="text-sm font-semibold text-[#222222] text-center">{h.title}</span>
                            {h.desc && <span className="text-xs text-[#717171] text-center">{h.desc}</span>}
                          </div>
                        )
                      })}
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Features */}
              {features.length > 0 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="flex flex-col gap-5"
                >
                  <motion.div variants={fadeUp} className="w-full h-px bg-[#EBEBEB]" />
                  <motion.h3 variants={fadeUp} className="text-2xl font-bold text-[#222222]">
                    Highlights
                  </motion.h3>
                  <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
                    {features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <Check className="w-[18px] h-[18px] text-[#3A8FB7] flex-shrink-0" />
                        <span className="text-[15px] text-[#4A4A4A]">{f}</span>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Included / Not Included */}
              {(includes.length > 0 || notIncluded.length > 0) && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="flex flex-col gap-5"
                >
                  <motion.div variants={fadeUp} className="w-full h-px bg-[#EBEBEB]" />
                  {includes.length > 0 && (
                    <>
                      <motion.h3 variants={fadeUp} className="text-2xl font-bold text-[#222222]">
                        What&apos;s included
                      </motion.h3>
                      <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                        {includes.map((item) => (
                          <div key={item} className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                            <span className="text-[15px] text-[#4A4A4A]">{item}</span>
                          </div>
                        ))}
                      </motion.div>
                    </>
                  )}
                  {notIncluded.length > 0 && (
                    <>
                      <motion.h3 variants={fadeUp} className="text-xl font-bold text-[#999999] mt-2">
                        Not included
                      </motion.h3>
                      <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                        {notIncluded.map((item) => (
                          <div key={item} className="flex items-center gap-2.5">
                            <XCircle className="w-4 h-4 text-[#CCCCCC] flex-shrink-0" />
                            <span className="text-[15px] text-[#999999]">{item}</span>
                          </div>
                        ))}
                      </motion.div>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Right — Sticky booking card */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="lg:sticky lg:top-[100px]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white rounded-2xl p-8 border border-[#EBEBEB] shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[32px] font-bold text-[#E07A5F]">{formatPrice(price)}</span>
                      {priceUnit && <span className="text-base text-[#717171]">{priceUnit}</span>}
                    </div>
                  </div>

                  <div className="w-full h-px bg-[#EBEBEB]" />

                  <div className="flex flex-col gap-3.5">
                    <span className="text-[11px] font-bold tracking-[1.5px] text-[#999999]">
                      LESSON DETAILS
                    </span>
                    {duration && (
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                        <span className="text-sm text-[#444444]">{duration}</span>
                      </div>
                    )}
                    {groupSize && (
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                        <span className="text-sm text-[#444444]">{groupSize}</span>
                      </div>
                    )}
                    {level && (
                      <div className="flex items-center gap-2.5">
                        <Waves className="w-4 h-4 text-[#3A8FB7] flex-shrink-0" />
                        <span className="text-sm text-[#444444]">{level}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={resolvedBookingHref}
                    {...(bookingLink?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#E07A5F] hover:bg-[#D06A4F] text-white font-bold text-[15px] rounded-xl transition-all"
                  >
                    {bookingText}
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://wa.me/${HOUSE_WHATSAPP}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-[#F7F7F7] text-[#222222] font-semibold text-sm rounded-xl border border-[#DDDDDD] transition-all"
                  >
                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Ask on WhatsApp
                  </a>

                  <p className="text-xs text-[#999999] text-center">
                    Certified instructors · All gear included
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* More lessons */}
        {other.length > 0 && (
          <section className="bg-white py-16 sm:py-20">
            <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-10"
              >
                <motion.h2 variants={fadeUp} className="text-[28px] font-bold text-[#222222]">
                  Explore more lessons
                </motion.h2>
                <motion.div variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {other.map((a: any) => {
                    const img = getMediaUrl(a?.images?.[0]?.image)
                    const aPrice = typeof a?.price === 'number' ? a.price : 0
                    return (
                      <Link
                        key={a.slug}
                        href={`/${lang}/surf/${a.slug}`}
                        className="group rounded-2xl overflow-hidden border border-[#EBEBEB] bg-white"
                      >
                        <div className="relative h-[200px] overflow-hidden bg-[#F7F7F7]">
                          {img && (
                            <Image
                              src={img}
                              alt={a.title || ''}
                              fill
                              loading="lazy"
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          )}
                        </div>
                        <div className="p-6 flex flex-col gap-2">
                          <span className="text-lg font-bold text-[#222222]">{a.title}</span>
                          {a.tagline && <span className="text-sm text-[#717171]">{a.tagline}</span>}
                          <span className="text-base font-bold text-[#1B4965]">
                            {formatPrice(aPrice)}
                            {a.priceUnit && <span className="text-sm text-[#717171] font-normal ml-1">{a.priceUnit}</span>}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Packages CTA */}
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
                  Bundle surf lessons with your stay, meals, and equipment for the best value.
                </p>
              </div>
              <Link
                href={`/${lang}/packages`}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#E07A5F] hover:bg-[#D06A4F] text-white font-semibold rounded-xl transition-all text-[15px] shrink-0"
              >
                View Packages
                <ArrowRight className="w-[18px] h-[18px]" />
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>

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
