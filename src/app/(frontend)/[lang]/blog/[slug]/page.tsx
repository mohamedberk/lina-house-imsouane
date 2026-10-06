import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import BlogPostClient from '@/components/blog/BlogPostClient'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'blog',
      where: { status: { equals: 'published' } },
      limit: 200,
      depth: 0,
      select: { slug: true },
    })
    return result.docs.map((doc: { slug: string }) => ({ slug: doc.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = lang as 'en' | 'fr'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let post: any = null
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'blog',
      where: { slug: { equals: slug } },
      locale,
      depth: 1,
      limit: 1,
    })
    post = result.docs[0]
  } catch {}

  return buildPageMetadata({
    cms: post?.seo
      ? {
          metaTitle: post.seo.metaTitle,
          metaDescription: post.seo.metaDescription,
          ogImage: post.featuredImage,
        }
      : undefined,
    fallbackTitle: post?.title ? `${post.title} | Lina House Blog` : 'Blog | Lina House',
    fallbackDescription: post?.excerpt || 'Lina House blog — surf, travel and stories from Imsouane.',
    path: `/blog/${slug}`,
    lang: locale,
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeRelatedPost = (raw: any) => {
  if (!raw || typeof raw !== 'object') return null
  const featured = raw.featuredImage
  const featuredImage =
    featured && typeof featured === 'object'
      ? { url: featured.url || '', alt: featured.alt || '' }
      : null
  if (!featuredImage || !featuredImage.url) return null
  return {
    id: String(raw.id),
    slug: raw.slug as string,
    title: raw.title as string,
    excerpt: (raw.excerpt as string) || '',
    category: raw.category as string,
    publishedAt: raw.publishedAt as string,
    readingTime: typeof raw.readingTime === 'number' ? raw.readingTime : undefined,
    featuredImage,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = lang as 'en' | 'fr'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let post: any = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let relatedPosts: any[] = []
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'blog',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      locale,
      depth: 2,
      limit: 1,
    })
    post = result.docs[0] || null

    if (post) {
      // 1) Try the explicit relatedPosts relationship.
      const explicit = Array.isArray(post.relatedPosts) ? post.relatedPosts : []
      const explicitNormalized = explicit
        .map(normalizeRelatedPost)
        .filter((p: ReturnType<typeof normalizeRelatedPost>) => {
          if (!p) return false
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const orig = explicit.find((e: any) => e && String(e.id) === p.id)
          return orig?.status === 'published'
        })
        .slice(0, 3)

      if (explicitNormalized.length > 0) {
        relatedPosts = explicitNormalized
      } else if (post.category) {
        // 2) Fallback: latest 3 OTHER published posts in the same category.
        const fallback = await payload.find({
          collection: 'blog',
          where: {
            status: { equals: 'published' },
            category: { equals: post.category },
            id: { not_equals: post.id },
          },
          locale,
          depth: 1,
          limit: 3,
          sort: '-publishedAt',
        })
        relatedPosts = fallback.docs
          .map(normalizeRelatedPost)
          .filter(Boolean)
      }
    }
  } catch {}

  if (!post) notFound()

  return <BlogPostClient post={post} lang={locale} relatedPosts={relatedPosts} />
}
