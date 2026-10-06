'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { useGoogleReviews } from '@/hooks/useGoogleReviews'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

type RatingBadge = {
  score: string
  source: string
  label?: string | null
  href?: string | null
  id?: string | null
}

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviewsSec?: any
  ratingBadges: RatingBadge[]
}

export default function ReviewsSection({ reviewsSec, ratingBadges }: Props) {
  const { reviews: googleReviews, overallRating, totalReviews } = useGoogleReviews({
    minRating: 4,
    fallbackReviews: undefined,
  })

  const [reviewEmblaRef, reviewEmblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: true,
    containScroll: false,
  }, [
    AutoScroll({
      speed: 0.6,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      playOnInit: true,
    }),
  ])

  const scrollReviewsPrev = useCallback(() => {
    if (reviewEmblaApi) reviewEmblaApi.scrollPrev()
  }, [reviewEmblaApi])

  const scrollReviewsNext = useCallback(() => {
    if (reviewEmblaApi) reviewEmblaApi.scrollNext()
  }, [reviewEmblaApi])

  return (
    <section className="py-20 bg-sand-light overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-col items-center gap-10"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-4">
            <h2 className="text-2xl sm:text-[36px] text-[#222222] leading-tight">
              {reviewsSec?.title ?? 'Our guests,'} <span className="font-display italic text-accent">{(reviewsSec as any)?.titleAccent ?? 'in their own words'}</span>
            </h2>
            {/* Overall Google Rating */}
            <div className="flex items-center gap-3 mt-1">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M21.8055 10.0415H12V14.0415H17.6515C16.827 16.3275 14.6115 17.9555 12 17.9555C8.8385 17.9555 6.267 15.384 6.267 12.2225C6.267 9.06097 8.8385 6.48947 12 6.48947C13.5255 6.48947 14.9155 7.06447 15.9585 8.01747L18.873 5.10297C17.085 3.42747 14.6715 2.39697 12 2.39697C6.4785 2.39697 2 6.87547 2 12.397C2 17.9185 6.4785 22.397 12 22.397C18.24 22.397 22.5 17.0655 22.5 11.147C22.5 10.787 22.473 10.4125 22.41 10.0415H21.8055Z" fill="#4285F4"/>
                <path d="M3.15454 7.45574L6.43704 9.87724C7.32754 7.89424 9.48004 6.48949 12 6.48949C13.5255 6.48949 14.9155 7.06449 15.9585 8.01749L18.873 5.10299C17.085 3.42749 14.6715 2.39699 12 2.39699C8.1585 2.39699 4.82704 4.49999 3.15454 7.45574Z" fill="#EA4335"/>
                <path d="M12 22.397C14.6115 22.397 16.9695 21.4145 18.74 19.8115L15.5115 17.1975C14.5717 17.8679 13.3654 18.255 12 18.255C9.39904 18.255 7.19054 16.6415 6.35404 14.3695L3.09754 16.8925C4.75204 20.1555 8.13754 22.397 12 22.397Z" fill="#34A853"/>
                <path d="M22.5 11.147C22.5 10.787 22.473 10.4125 22.41 10.0415H12V14.0415H17.6515C17.2635 15.1185 16.437 16.0175 15.51 16.6305L15.5115 16.6305L18.7415 19.2425C18.4845 19.476 22.5 16.5 22.5 11.147Z" fill="#FBBC05"/>
              </svg>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="font-bold text-lg text-primary-dark">{overallRating?.toFixed(1) || '4.9'}</span>
              <span className="text-[#8A8A8A] text-sm">({totalReviews || 145} reviews)</span>
            </div>
          </motion.div>

          {/* Rating Badges */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-6">
            {ratingBadges.map((badge) => (
              <a
                key={badge.source}
                href={('href' in badge && badge.href) ? badge.href : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 border border-sand-dark/50 hover:border-accent/40 transition-all duration-200 cursor-pointer"
              >
                <span className="text-[26px] font-bold text-primary-dark">{badge.score}</span>
                <div className="flex flex-col">
                  <span className="text-[#2D2D2D] text-[13px] font-semibold">{badge.source}</span>
                  <span className="text-[#8A8A8A] text-[11px]">{badge.label}</span>
                </div>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Google Reviews Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 relative group"
      >
        {/* Navigation Arrows — visible on hover */}
        <button
          onClick={scrollReviewsPrev}
          className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full border border-sand-dark/30 flex items-center justify-center hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous reviews"
        >
          <ChevronLeft className="w-5 h-5 text-primary-dark" />
        </button>
        <button
          onClick={scrollReviewsNext}
          className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full border border-sand-dark/30 flex items-center justify-center hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next reviews"
        >
          <ChevronRight className="w-5 h-5 text-primary-dark" />
        </button>

        {/* Embla Carousel */}
        <div className="overflow-hidden px-6 sm:px-16 cursor-grab active:cursor-grabbing" ref={reviewEmblaRef}>
          <div className="flex">
            {[...googleReviews, ...googleReviews].map((review, i) => (
              <div key={i} className="flex-[0_0_300px] sm:flex-[0_0_360px] min-w-0 px-3">
                <div className="bg-white rounded-2xl p-6 border border-sand-dark/30 flex flex-col h-full min-h-[220px] hover:border-accent/20 transition-all duration-300">
                  {/* User info + Google icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {review.profilePhotoUrl ? (
                        <img
                          src={review.profilePhotoUrl}
                          alt={review.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-sand-dark/30"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm ring-2 ring-primary/20">
                          {review.avatar}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold text-[15px] text-primary-dark">{review.name}</span>
                        <span className="text-xs text-[#8A8A8A]">{review.date}</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 shrink-0 mt-1" viewBox="0 0 24 24" fill="none">
                      <path d="M21.8055 10.0415H12V14.0415H17.6515C16.827 16.3275 14.6115 17.9555 12 17.9555C8.8385 17.9555 6.267 15.384 6.267 12.2225C6.267 9.06097 8.8385 6.48947 12 6.48947C13.5255 6.48947 14.9155 7.06447 15.9585 8.01747L18.873 5.10297C17.085 3.42747 14.6715 2.39697 12 2.39697C6.4785 2.39697 2 6.87547 2 12.397C2 17.9185 6.4785 22.397 12 22.397C18.24 22.397 22.5 17.0655 22.5 11.147C22.5 10.787 22.473 10.4125 22.41 10.0415H21.8055Z" fill="#4285F4"/>
                      <path d="M3.15454 7.45574L6.43704 9.87724C7.32754 7.89424 9.48004 6.48949 12 6.48949C13.5255 6.48949 14.9155 7.06449 15.9585 8.01749L18.873 5.10299C17.085 3.42749 14.6715 2.39699 12 2.39699C8.1585 2.39699 4.82704 4.49999 3.15454 7.45574Z" fill="#EA4335"/>
                      <path d="M12 22.397C14.6115 22.397 16.9695 21.4145 18.74 19.8115L15.5115 17.1975C14.5717 17.8679 13.3654 18.255 12 18.255C9.39904 18.255 7.19054 16.6415 6.35404 14.3695L3.09754 16.8925C4.75204 20.1555 8.13754 22.397 12 22.397Z" fill="#34A853"/>
                      <path d="M22.5 11.147C22.5 10.787 22.473 10.4125 22.41 10.0415H12V14.0415H17.6515C17.2635 15.1185 16.437 16.0175 15.51 16.6305L15.5115 16.6305L18.7415 19.2425C18.4845 19.476 22.5 16.5 22.5 11.147Z" fill="#FBBC05"/>
                    </svg>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s < review.rating ? 'fill-accent text-accent' : 'fill-sand-dark text-sand-dark'}`}
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-[#4A4A4A] text-[14px] leading-[1.7] line-clamp-4 flex-1">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-sand-dark/30 flex items-center justify-between">
                    <span className="text-[11px] text-[#8A8A8A]">Posted on Google</span>
                    {review.profileUrl && (
                      <a
                        href={review.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-accent hover:underline"
                      >
                        View profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* "See all reviews" link */}
      <div className="flex justify-center mt-10">
        <a
          href={`https://search.google.com/local/reviews?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'ChIJaY7O18Bfsg0Rq0043SeE7so'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          See all reviews on Google
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  )
}
