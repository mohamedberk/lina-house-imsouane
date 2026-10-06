import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import BlogClient from './BlogClient'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let cmsSeo
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'blog-page', locale, depth: 1 })
    cmsSeo = (data as { seo?: typeof cmsSeo })?.seo
  } catch {}

  const isFr = locale === 'fr'
  return buildPageMetadata({
    cms: cmsSeo,
    fallbackTitle: isFr ? 'Blog Lina House | Guide Surf & Voyage Imsouane' : 'Lina House Blog | Imsouane Surf & Travel Guide',
    fallbackDescription: isFr
      ? "Conseils, sessions, guides voyage et histoires d'Imsouane Maroc. Le blog Lina House pour surfeurs, backpackers et amoureux du slow travel."
      : 'Read surf reports, travel guides and stories from Imsouane, Morocco. The Lina House blog for surfers, backpackers and slow-travel lovers.',
    path: '/blog',
    lang: locale,
  })
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ tag?: string }>
}) {
  const { lang } = await params
  const { tag } = await searchParams
  const locale = lang as 'en' | 'fr'

  const activeTag = typeof tag === 'string' && tag.length > 0 ? decodeURIComponent(tag) : undefined

  type Post = Parameters<typeof BlogClient>[0]['posts'][number]
  let posts: Post[] = []
  let pageData: Parameters<typeof BlogClient>[0]['pageData'] = null

  try {
    const payload = await getPayload({ config })
    const [postsResult, blogPage] = await Promise.all([
      payload.find({
        collection: 'blog',
        where: { status: { equals: 'published' } },
        sort: '-publishedAt',
        locale,
        depth: 1,
        limit: 100,
      }),
      payload.findGlobal({ slug: 'blog-page', locale, depth: 1 }),
    ])
    posts = postsResult.docs as unknown as Post[]
    pageData = blogPage as unknown as Parameters<typeof BlogClient>[0]['pageData']
  } catch {
    // CMS unavailable — show empty state
  }

  return <BlogClient lang={locale} posts={posts} pageData={pageData} activeTag={activeTag} />
}
