import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

const BASE_URL = 'https://linahouse-imsouane.com'
const LOCALES = ['en', 'fr'] as const

// Revalidate sitemap every hour (3600 seconds)
export const revalidate = 3600
export const dynamic = 'force-static'

type MediaDoc = { url?: string | null }
type ImageArrayItem = { image?: MediaDoc | string | null }
type SlugDoc = {
  slug?: string | null
  updatedAt: string
  images?: ImageArrayItem[] | null
  featuredImage?: MediaDoc | string | null
}

// Convert Payload media relation → absolute image URL (or null if unresolvable).
const toAbsoluteImageUrl = (media: MediaDoc | string | null | undefined): string | null => {
  if (!media || typeof media === 'string') return null
  if (!media.url) return null
  return media.url.startsWith('http') ? media.url : `${BASE_URL}${media.url}`
}

const collectImages = (doc: SlugDoc): string[] => {
  const urls: string[] = []
  if (doc.images) {
    for (const item of doc.images) {
      const url = toAbsoluteImageUrl(item.image)
      if (url) urls.push(url)
    }
  }
  const featured = toAbsoluteImageUrl(doc.featuredImage)
  if (featured) urls.push(featured)
  return urls
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  // Run all 4 collection queries in parallel — Payload's Local API is safe under concurrency.
  // pagination: false skips the count query, saving a round-trip per find.
  // depth: 1 populates media relations so we can build image sitemap entries.
  const [blogResult, activitiesResult, roomsResult, packagesResult] = await Promise.allSettled([
    payload.find({
      collection: 'blog',
      limit: 100,
      depth: 1,
      pagination: false,
      where: { status: { equals: 'published' } },
      select: { slug: true, updatedAt: true, featuredImage: true },
    }),
    payload.find({
      collection: 'activities',
      limit: 100,
      depth: 1,
      pagination: false,
      select: { slug: true, updatedAt: true, images: true },
    }),
    payload.find({
      collection: 'rooms',
      limit: 100,
      depth: 1,
      pagination: false,
      select: { slug: true, updatedAt: true, images: true },
    }),
    payload.find({
      collection: 'packages',
      limit: 100,
      depth: 1,
      pagination: false,
      select: { slug: true, updatedAt: true, images: true },
    }),
  ])

  const unwrap = (result: PromiseSettledResult<{ docs: SlugDoc[] }>, name: string): SlugDoc[] => {
    if (result.status === 'fulfilled') return result.value.docs
    console.error(`sitemap: failed to fetch ${name} collection`, result.reason)
    return []
  }

  const blogPosts = { docs: unwrap(blogResult, 'blog') }
  const activities = { docs: unwrap(activitiesResult, 'activities') }
  const rooms = { docs: unwrap(roomsResult, 'rooms') }
  const packages = { docs: unwrap(packagesResult, 'packages') }

  const sitemap: MetadataRoute.Sitemap = []

  // Static pages for each locale
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/rooms', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/packages', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/surf', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/restaurant', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/booking', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/terms-of-use', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  // Add static pages for each locale
  for (const locale of LOCALES) {
    for (const page of staticPages) {
      sitemap.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${page.path}`,
            fr: `${BASE_URL}/fr${page.path}`,
          },
        },
      })
    }
  }

  // Add blog posts
  for (const post of blogPosts.docs) {
    const images = collectImages(post)
    for (const locale of LOCALES) {
      sitemap.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
        images,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/blog/${post.slug}`,
            fr: `${BASE_URL}/fr/blog/${post.slug}`,
          },
        },
      })
    }
  }

  // Add surf activities
  for (const doc of activities.docs) {
    const images = collectImages(doc)
    for (const locale of LOCALES) {
      sitemap.push({
        url: `${BASE_URL}/${locale}/surf/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
        images,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/surf/${doc.slug}`,
            fr: `${BASE_URL}/fr/surf/${doc.slug}`,
          },
        },
      })
    }
  }

  // Add packages
  for (const doc of packages.docs) {
    const images = collectImages(doc)
    for (const locale of LOCALES) {
      sitemap.push({
        url: `${BASE_URL}/${locale}/packages/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
        images,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/packages/${doc.slug}`,
            fr: `${BASE_URL}/fr/packages/${doc.slug}`,
          },
        },
      })
    }
  }

  // Add rooms
  for (const doc of rooms.docs) {
    const images = collectImages(doc)
    for (const locale of LOCALES) {
      sitemap.push({
        url: `${BASE_URL}/${locale}/rooms/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
        images,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/rooms/${doc.slug}`,
            fr: `${BASE_URL}/fr/rooms/${doc.slug}`,
          },
        },
      })
    }
  }

  return sitemap
}
