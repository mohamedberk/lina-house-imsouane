'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ZoomIn } from 'lucide-react'
import { BLUR_DATA_URL } from '@/lib/blurDataUrl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/counter.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

type GalleryImage = {
  url: string
  layout: string
}

type Props = {
  galleryImages: GalleryImage[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gallery?: any
}

export default function GallerySection({ galleryImages, gallery }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const gallerySlides = galleryImages.map((g) => ({ src: g.url }))

  return (
    <>
      <section className="py-20 bg-sand-light">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col items-center gap-12"
          >
            <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-3">
              <h2 className="text-2xl sm:text-[36px] text-[#222222] leading-tight">
                {gallery?.title ?? 'Around the house,'} <span className="font-display italic text-accent">{(gallery as any)?.titleAccent ?? 'in photographs'}</span>
              </h2>
            </motion.div>

            {/* Mobile: Swiper Carousel */}
            <motion.div variants={fadeUp} className="w-full md:hidden">
              <Swiper
                modules={[Pagination]}
                grabCursor
                centeredSlides
                slidesPerView={1.3}
                spaceBetween={14}
                pagination={{ clickable: true }}
                className="gallery-swiper"
              >
                {galleryImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div
                      className="relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/5]"
                      onClick={() => openLightbox(i)}
                    >
                      <Image
                        src={img.url}
                        alt={`Lina House gallery ${i + 1}`}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 80vw, 33vw"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        className="object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            {/* Desktop: Bento Grid */}
            <motion.div
              variants={fadeUp}
              className="hidden md:grid md:grid-cols-4 gap-3 w-full auto-rows-[200px]"
              style={{ gridAutoFlow: 'dense' }}
            >
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className={`${img.layout} rounded-xl overflow-hidden cursor-pointer group relative`}
                  onClick={() => openLightbox(i)}
                >
                  <Image
                    src={img.url}
                    alt={`Lina House gallery ${i + 1}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* YARL Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={gallerySlides}
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
