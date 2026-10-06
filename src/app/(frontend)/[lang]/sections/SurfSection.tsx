'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Waves, Shield, Camera, Star, Clock } from 'lucide-react'
import { useCurrency } from '@/components/currency-switcher'
import { BLUR_DATA_URL } from '@/lib/blurDataUrl'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const activityFeatureIcons = [
  [Waves, Shield, Camera],
  [Waves, Shield, Star],
]

type Activity = {
  title: string
  badge: string
  duration: string
  features: string[]
  price: number
  priceUnit: string
  bookingLink: string
  bookingText: string
  imageUrl: string
}

type Props = {
  lang: 'en' | 'fr'
  activities: Activity[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  surf?: any
}

export default function SurfSection({ lang, activities, surf }: Props) {
  const { formatPrice } = useCurrency()

  return (
    <section id="surf" className="py-20 bg-sand-light">
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
              {surf?.title ?? 'Our wave,'} <span className="font-display italic text-accent">{(surf as any)?.titleAccent ?? 'the longest in Africa'}</span>
            </h2>
            <p className="text-[#717171] text-[15px] max-w-[650px]">
              {surf?.description ?? 'Certified instructors, premium equipment, and the perfect wave \u2014 everything you need for an unforgettable surf experience'}
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-10 w-full pt-5">
            {activities.map((activity, actIdx) => {
              const featureIcons = activityFeatureIcons[actIdx] || [Waves, Shield, Star]
              return (
                <motion.div key={activity.title} variants={fadeUp} className="relative rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] flex flex-col">
                  {activity.badge && (
                    <span className={`absolute -top-3.5 right-4 z-10 flex items-center gap-1.5 text-white text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md ${actIdx === 0 ? 'bg-accent' : 'bg-[#1B4965]'}`}>
                      {activity.badge}
                    </span>
                  )}
                  <div className="relative h-[280px] rounded-t-2xl overflow-hidden">
                    {activity.imageUrl ? (
                      <Image
                        src={activity.imageUrl}
                        alt={activity.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        className="object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    {activity.duration && (
                      <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#1B4965] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        {activity.duration}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2.5 flex-1">
                    <h3 className="text-lg font-bold text-[#222222]">{activity.title}</h3>
                    <div className="flex flex-col">
                      {activity.features.map((feat: string, i: number) => {
                        const FeatIcon = featureIcons[i] || Star
                        return (
                          <div key={feat}>
                            <div className="flex items-center gap-3 py-2">
                              <FeatIcon className="w-4.5 h-4.5 text-[#1B4965] flex-shrink-0" />
                              <span className="text-[#4A4A4A] text-sm">{feat}</span>
                            </div>
                            {i < activity.features.length - 1 && <div className="h-px bg-[#EBEBEB]" />}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-lg font-bold text-[#222222]">{formatPrice(activity.price)}</span>
                        {activity.priceUnit && (
                          <span className="text-[#717171] text-sm ml-1">{activity.priceUnit}</span>
                        )}
                      </div>
                      {activity.bookingLink?.startsWith('http') ? (
                        <a
                          href={activity.bookingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-lg transition-all"
                        >
                          {lang === 'fr' ? 'Voir détails' : 'See Details'}
                        </a>
                      ) : (
                        <Link
                          href={`/${lang}${activity.bookingLink}`}
                          className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-lg transition-all"
                        >
                          {lang === 'fr' ? 'Voir détails' : 'See Details'}
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* View All Surf Button */}
          <motion.div variants={fadeUp} className="pt-4">
            <Link
              href={`/${lang}/surf`}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all text-[15px]"
            >
              View All Surf Activities
              <ArrowRight className="w-[18px] h-[18px]" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
