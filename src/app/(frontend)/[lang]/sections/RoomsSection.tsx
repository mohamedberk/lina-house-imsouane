'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ArrowRight } from 'lucide-react'
import { useCurrency } from '@/components/currency-switcher'
import { BLUR_DATA_URL } from '@/lib/blurDataUrl'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

type Room = {
  name: string
  slug: string
  detail: string
  description: string
  price: number
  priceBreakfast: number | null
  rating: string
  imageUrl: string
}

type Props = {
  lang: 'en' | 'fr'
  rooms: Room[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roomsSec?: any
}

export default function RoomsSection({ lang, rooms, roomsSec }: Props) {
  const { formatPrice } = useCurrency()

  return (
    <section id="rooms" className="py-20 bg-sand-light">
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
            <h2 className="text-2xl sm:text-[36px] text-[#222222] leading-tight">
              {roomsSec?.title ?? 'Our rooms,'} <span className="font-display italic text-accent">{(roomsSec as any)?.titleAccent ?? 'for every kind of stay'}</span>
            </h2>
          </motion.div>

          {/* Room Grid */}
          <motion.div variants={stagger} className="flex flex-col gap-8 w-full">
            {/* Row 1 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.slice(0, 3).map((room, index) => (
                <motion.div
                  key={room.name}
                  variants={fadeUp}
                  className="group rounded-2xl overflow-hidden"
                >
                  {room.slug ? (
                    <Link href={`/${lang}/rooms/${room.slug}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image src={room.imageUrl} alt={room.name} fill {...(index === 0 ? { priority: true, fetchPriority: 'high' as const } : { loading: 'lazy' as const })} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="pt-4 pb-2 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[17px] text-[#222222]">{room.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                            <span className="text-sm font-medium text-[#222222]">{room.rating}</span>
                          </div>
                        </div>
                        <p className="text-[#717171] text-sm">{room.detail}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {room.priceBreakfast && (<span className="text-sm font-bold text-[#222222] line-through">{formatPrice(room.priceBreakfast)}</span>)}
                          <span className="font-bold text-base text-[#E07A5F]">{formatPrice(room.price)}</span>
                          <span className="text-[#717171] text-sm">/ night</span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image src={room.imageUrl} alt={room.name} fill {...(index === 0 ? { priority: true, fetchPriority: 'high' as const } : { loading: 'lazy' as const })} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="pt-4 pb-2 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[17px] text-[#222222]">{room.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                            <span className="text-sm font-medium text-[#222222]">{room.rating}</span>
                          </div>
                        </div>
                        <p className="text-[#717171] text-sm">{room.detail}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {room.priceBreakfast && (<span className="text-sm font-bold text-[#222222] line-through">{formatPrice(room.priceBreakfast)}</span>)}
                          <span className="font-bold text-base text-[#E07A5F]">{formatPrice(room.price)}</span>
                          <span className="text-[#717171] text-sm">/ night</span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.slice(3, 6).map((room) => (
                <motion.div
                  key={room.name}
                  variants={fadeUp}
                  className="group rounded-2xl overflow-hidden"
                >
                  {room.slug ? (
                    <Link href={`/${lang}/rooms/${room.slug}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image src={room.imageUrl} alt={room.name} fill loading="lazy" sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="pt-4 pb-2 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[17px] text-[#222222]">{room.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                            <span className="text-sm font-medium text-[#222222]">{room.rating}</span>
                          </div>
                        </div>
                        <p className="text-[#717171] text-sm">{room.detail}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {room.priceBreakfast && (<span className="text-sm font-bold text-[#222222] line-through">{formatPrice(room.priceBreakfast)}</span>)}
                          <span className="font-bold text-base text-[#E07A5F]">{formatPrice(room.price)}</span>
                          <span className="text-[#717171] text-sm">/ night</span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image src={room.imageUrl} alt={room.name} fill loading="lazy" sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="pt-4 pb-2 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[17px] text-[#222222]">{room.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                            <span className="text-sm font-medium text-[#222222]">{room.rating}</span>
                          </div>
                        </div>
                        <p className="text-[#717171] text-sm">{room.detail}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {room.priceBreakfast && (<span className="text-sm font-bold text-[#222222] line-through">{formatPrice(room.priceBreakfast)}</span>)}
                          <span className="font-bold text-base text-[#E07A5F]">{formatPrice(room.price)}</span>
                          <span className="text-[#717171] text-sm">/ night</span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* View All Rooms Button */}
          <motion.div variants={fadeUp} className="pt-4">
            <Link
              href={`/${lang}/rooms`}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all text-[15px]"
            >
              View All Rooms
              <ArrowRight className="w-[18px] h-[18px]" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
