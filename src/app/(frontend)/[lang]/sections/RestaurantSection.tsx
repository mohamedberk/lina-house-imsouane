'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { BLUR_DATA_URL } from '@/lib/blurDataUrl'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

type Meal = {
  title: string
  time: string
  desc: string
  imageUrl: string
}

type Philosophy = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  desc: string
}

type Props = {
  lang: 'en' | 'fr'
  meals: Meal[]
  philosophy: Philosophy[]
  restaurantHeroImage: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restaurant?: any
}

export default function RestaurantSection({ lang, meals, philosophy, restaurantHeroImage, restaurant }: Props) {
  return (
    <section id="restaurant" className="bg-sand-light">
      {/* Restaurant Hero */}
      <div className="relative h-[280px] overflow-hidden">
        {restaurantHeroImage ? (
          <Image
            src={restaurantHeroImage}
            alt="Rooftop dining at Lina House"
            fill
            loading="eager"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1B4965]/90" />
        <div className="absolute bottom-0 left-0 right-0 z-10 max-w-[1340px] mx-auto px-6 sm:px-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <h2 className="text-2xl sm:text-[36px] text-white leading-[1.15] drop-shadow-lg">
              {restaurant?.title ?? 'Our kitchen,'} <span className="font-display italic text-accent">{(restaurant as any)?.titleAccent ?? 'fresh fish and a wood fire'}</span>
            </h2>
            <p className="text-white/90 text-[15px] max-w-[650px] drop-shadow-md">
              {restaurant?.description ?? 'Fresh catches from the harbour, traditional Moroccan flavors, and wood-fire BBQ every evening'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Dining Cards */}
      <div className="max-w-[1340px] mx-auto px-6 sm:px-20 py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {meals.map((meal) => (
            <motion.div
              key={meal.title}
              variants={fadeUp}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              <div className="relative h-[200px] overflow-hidden">
                {meal.imageUrl ? (
                  <Image
                    src={meal.imageUrl}
                    alt={meal.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="p-6 flex flex-col gap-3">
                <h3 className="font-bold text-[22px] text-[#222222]">{meal.title}</h3>
                <span className="text-accent text-[13px] font-medium">{meal.time}</span>
                <p className="text-[#4A4A4A] text-sm leading-[1.6]">{meal.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Food Philosophy Icons */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-8 sm:gap-16 mt-12 pt-8"
        >
          {philosophy.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.title} variants={fadeUp} className="flex flex-col items-center gap-3 w-[160px]">
                <div className="w-14 h-14 rounded-full bg-[#222222]/5 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#222222]" />
                </div>
                <h4 className="text-[#222222] text-sm font-semibold text-center">{item.title}</h4>
                <p className="text-[#8A8A8A] text-[13px] text-center">{item.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* View Restaurant Button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex justify-center mt-10"
        >
          <Link
            href={`/${lang}/restaurant`}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all text-[15px]"
          >
            Explore Our Menu
            <ArrowRight className="w-[18px] h-[18px]" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
