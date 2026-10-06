'use client'

import { useState, useEffect } from 'react'

export interface Review {
  id: string
  name: string
  avatar: string
  rating: number
  date: string
  text: string
  profileUrl?: string
  profilePhotoUrl?: string
}

interface UseGoogleReviewsOptions {
  minRating?: number
  fallbackReviews?: Review[]
}

interface UseGoogleReviewsReturn {
  reviews: Review[]
  isLoading: boolean
  error: string | null
  overallRating: number | null
  totalReviews: number | null
  refetch: () => void
}

// Default fallback reviews in case API fails
const defaultFallbackReviews: Review[] = [
  {
    id: '1',
    name: 'Sarah M.',
    avatar: 'S',
    rating: 5,
    date: '2 months ago',
    text: 'Best hostel I\'ve ever stayed at. The surf lessons were incredible, the food was amazing, and the vibe is just perfect. The team made us feel like family.',
  },
  {
    id: '2',
    name: 'Thomas L.',
    avatar: 'T',
    rating: 5,
    date: '1 month ago',
    text: 'The location is unbeatable — you can hear the waves from your bed. Breakfast on the terrace watching surfers was a daily highlight. Will definitely be back!',
  },
  {
    id: '3',
    name: 'Marco P.',
    avatar: 'M',
    rating: 5,
    date: '3 weeks ago',
    text: 'Came for a week, stayed for a month. The BBQ dinners are legendary, the community is incredible, and the waves are endless. This place is pure magic.',
  },
  {
    id: '4',
    name: 'Emma K.',
    avatar: 'E',
    rating: 5,
    date: '2 weeks ago',
    text: 'The rooftop terrace is absolutely magical at sunset. We spent every evening up there watching the sky turn pink. The staff arranged everything from surf lessons to day trips.',
  },
  {
    id: '5',
    name: 'Lucas R.',
    avatar: 'L',
    rating: 5,
    date: '1 month ago',
    text: 'As a surfer, Imsouane is paradise — and Lina House is the perfect base. The instructors know every break, the food keeps you energized, and the beds are super comfortable.',
  },
  {
    id: '6',
    name: 'Sophie W.',
    avatar: 'S',
    rating: 4,
    date: '3 weeks ago',
    text: 'I traveled solo and felt instantly at home. The communal dinners are the highlight — sharing stories with people from all over the world while eating the freshest fish.',
  },
]

export function useGoogleReviews(options: UseGoogleReviewsOptions = {}): UseGoogleReviewsReturn {
  const { minRating = 4, fallbackReviews = defaultFallbackReviews } = options

  const [reviews, setReviews] = useState<Review[]>(fallbackReviews)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overallRating, setOverallRating] = useState<number | null>(null)
  const [totalReviews, setTotalReviews] = useState<number | null>(null)

  const fetchReviews = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/reviews?minRating=${minRating}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews')
      }

      if (data.reviews && data.reviews.length > 0) {
        // Combine Google API reviews with fallback reviews to show more content
        // Google API only returns ~5 reviews, so we supplement with curated fallbacks
        const googleReviewIds = new Set(data.reviews.map((r: Review) => r.name.toLowerCase()))
        const additionalReviews = fallbackReviews.filter(
          fr => !googleReviewIds.has(fr.name.toLowerCase())
        )
        const combinedReviews = [...data.reviews, ...additionalReviews]
        setReviews(combinedReviews)
        setOverallRating(data.overallRating || null)
        setTotalReviews(data.totalReviews || null)
      } else {
        // Use fallback if no reviews returned
        setReviews(fallbackReviews)
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
      // Keep fallback reviews on error
      setReviews(fallbackReviews)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [minRating])

  return {
    reviews,
    isLoading,
    error,
    overallRating,
    totalReviews,
    refetch: fetchReviews
  }
}
