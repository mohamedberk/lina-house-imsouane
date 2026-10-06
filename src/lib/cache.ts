import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'

// Cache tags for revalidation
export const CACHE_TAGS = {
  homepage: 'homepage',
  aboutPage: 'about-page',
  contactPage: 'contact-page',
  blogPage: 'blog-page',
  blog: 'blog',
  siteSettings: 'site-settings',
  rooms: 'rooms',
} as const

// Revalidation time in seconds (1 second for immediate updates)
const REVALIDATE_TIME = 1

// Default locale
const DEFAULT_LOCALE = 'en'

// ============================================
// GLOBALS (Page Content)
// ============================================

export const getCachedHomepage = (locale: string = DEFAULT_LOCALE) => unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({
      slug: 'homepage',
      depth: 1,
      locale: locale as 'en' | 'fr',
    })
  },
  [`homepage-global-${locale}`],
  {
    revalidate: REVALIDATE_TIME,
    tags: [CACHE_TAGS.homepage]
  }
)()

export const getCachedAboutPage = (locale: string = DEFAULT_LOCALE) => unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({
      slug: 'about-page',
      depth: 1,
      locale: locale as 'en' | 'fr',
    })
  },
  [`about-page-global-${locale}`],
  {
    revalidate: REVALIDATE_TIME,
    tags: [CACHE_TAGS.aboutPage]
  }
)()

export const getCachedContactPage = (locale: string = DEFAULT_LOCALE) => unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({
      slug: 'contact-page',
      depth: 1,
      locale: locale as 'en' | 'fr',
    })
  },
  [`contact-page-global-${locale}`],
  {
    revalidate: REVALIDATE_TIME,
    tags: [CACHE_TAGS.contactPage]
  }
)()

export const getCachedBlogPage = (locale: string = DEFAULT_LOCALE) => unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({
      slug: 'blog-page',
      depth: 1,
      locale: locale as 'en' | 'fr',
    })
  },
  [`blog-page-global-${locale}`],
  {
    revalidate: REVALIDATE_TIME,
    tags: [CACHE_TAGS.blogPage]
  }
)()

export const getCachedSiteSettings = (locale: string = DEFAULT_LOCALE) => unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      locale: locale as 'en' | 'fr',
    })
  },
  [`site-settings-global-${locale}`],
  {
    revalidate: REVALIDATE_TIME,
    tags: [CACHE_TAGS.siteSettings]
  }
)()


// ============================================
// BLOG
// ============================================

export const getCachedBlogPosts = (limit = 100, locale: string = DEFAULT_LOCALE) => unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'blog',
      limit,
      depth: 1,
      sort: '-publishedAt',
      locale: locale as 'en' | 'fr',
    })
    return docs
  },
  [`blog-posts-${limit}-${locale}`],
  {
    revalidate: REVALIDATE_TIME,
    tags: [CACHE_TAGS.blog]
  }
)()

// ============================================
// HELPER: Get image URL
// ============================================

export function getImageUrl(image: string | Media | null | undefined): string {
  const fallback = ''
  if (!image) return fallback
  if (typeof image === 'string') return image || fallback
  return image.url || fallback
}

