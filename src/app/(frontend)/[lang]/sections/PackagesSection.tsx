'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Anchor,
  UtensilsCrossed,
  Waves,
  Shield,
  Wifi,
  Sun,
  Users,
  Camera,
} from 'lucide-react'
import { useCurrency } from '@/components/currency-switcher'
import { BLUR_DATA_URL } from '@/lib/blurDataUrl'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const packageFeatureIcons = [Anchor, UtensilsCrossed, Waves, Shield, Wifi, Sun, Users, Camera]

type Package = {
  title: string
  slug: string
  duration: string
  category: string
  highlight: boolean
  images: string[]
  features: string[]
  price: number
  whatsappMsg: string
}

type Props = {
  lang: 'en' | 'fr'
  packages: Package[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pkgSec?: any
}

export default function PackagesSection({ lang, packages, pkgSec }: Props) {
  const { formatPrice } = useCurrency()
  const [pkgImgIndex, setPkgImgIndex] = useState<Record<number, number>>({})

  const preloadImage = (src: string) => {
    if (typeof window === 'undefined' || !src) return
    const img = new window.Image()
    img.src = src
  }

  return (
    <section id="packages" className="py-20 bg-sand-light">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-col items-center gap-12"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-3">
            <h2 className="text-2xl sm:text-[42px] text-[#222222] leading-tight">
              {pkgSec?.title ?? 'Our packages,'} <span className="font-display italic text-accent">{(pkgSec as any)?.titleAccent ?? 'stay longer, save more'}</span>
            </h2>
            <p className="text-[#717171] text-[15px] max-w-[650px]">
              {pkgSec?.description ?? 'Bundle your stay and save \u2014 each package is crafted for the ultimate Imsouane experience'}
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-10 w-full pt-5">
            {packages.map((pkg, pkgIdx) => {
              const activeImg = pkgImgIndex[pkgIdx] || 0
              return (
              <motion.div
                key={pkg.title}
                variants={fadeUp}
                className={`relative rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] h-[560px] flex flex-col ${pkg.highlight ? 'bg-[#1B4965] ring-2 ring-[#1B4965]' : 'bg-white'}`}
              >
                {/* Category badge */}
                {pkg.category && (
                  <span className={`absolute -top-3.5 right-4 z-10 flex items-center gap-1.5 text-white text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md ${pkg.highlight ? 'bg-accent' : 'bg-[#1B4965]'}`}>
                    {pkg.category}
                  </span>
                )}
                {/* Image */}
                <div className="relative h-[280px] rounded-t-2xl overflow-hidden">
                  {pkg.images[activeImg] ? (
                    <Image
                      src={pkg.images[activeImg]}
                      alt={pkg.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-opacity duration-300"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  {/* Duration badge */}
                  {pkg.duration && (
                    <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#1B4965] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      {pkg.duration}
                    </span>
                  )}
                  {/* Image switcher arrows */}
                  <button
                    onClick={() => setPkgImgIndex((prev) => ({ ...prev, [pkgIdx]: (activeImg - 1 + pkg.images.length) % pkg.images.length }))}
                    onMouseEnter={() => preloadImage(pkg.images[(activeImg - 1 + pkg.images.length) % pkg.images.length])}
                    onTouchStart={() => preloadImage(pkg.images[(activeImg - 1 + pkg.images.length) % pkg.images.length])}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPkgImgIndex((prev) => ({ ...prev, [pkgIdx]: (activeImg + 1) % pkg.images.length }))}
                    onMouseEnter={() => preloadImage(pkg.images[(activeImg + 1) % pkg.images.length])}
                    onTouchStart={() => preloadImage(pkg.images[(activeImg + 1) % pkg.images.length])}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {/* Image switcher dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {pkg.images.map((_: string, dotIdx: number) => (
                      <button
                        key={dotIdx}
                        onClick={() => setPkgImgIndex((prev) => ({ ...prev, [pkgIdx]: dotIdx }))}
                        onMouseEnter={() => preloadImage(pkg.images[dotIdx])}
                        onTouchStart={() => preloadImage(pkg.images[dotIdx])}
                        className={`w-2 h-2 rounded-full transition-all ${dotIdx === activeImg ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <h3 className={`text-lg font-bold ${pkg.highlight ? 'text-white' : 'text-[#222222]'}`}>{pkg.title}</h3>

                  {/* Feature list */}
                  <div className="flex flex-col">
                    {pkg.features.map((feat: string, i: number) => {
                      const FeatIcon = packageFeatureIcons[i] || Check
                      return (
                        <div key={feat}>
                          <div className="flex items-center gap-3 py-2">
                            <FeatIcon className={`w-4.5 h-4.5 flex-shrink-0 ${pkg.highlight ? 'text-[#7EC8E3]' : 'text-[#1B4965]'}`} />
                            <span className={`text-sm ${pkg.highlight ? 'text-white/80' : 'text-[#4A4A4A]'}`}>{feat}</span>
                          </div>
                          {i < pkg.features.length - 1 && (
                            <div className={`h-px ${pkg.highlight ? 'bg-white/15' : 'bg-[#EBEBEB]'}`} />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-lg font-bold ${pkg.highlight ? 'text-white' : 'text-[#222222]'}`}>{formatPrice(pkg.price)}</span>
                    <Link
                      href={`/${lang}/packages/${pkg.slug}`}
                      className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-all bg-accent hover:bg-accent-dark text-white"
                    >
                      {lang === 'fr' ? 'Voir détails' : 'See Details'}
                    </Link>
                  </div>
                </div>
              </motion.div>
              )
            })}
          </div>

          {/* View All Packages Button */}
          <motion.div variants={fadeUp} className="pt-4">
            <Link
              href={`/${lang}/packages`}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all text-[15px]"
            >
              View All Packages
              <ArrowRight className="w-[18px] h-[18px]" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
