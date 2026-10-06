'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Calendar, Clock, ArrowRight, X } from 'lucide-react'
import { Footer } from '@/components/footer'

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  author?: string
  publishedAt: string
  readingTime?: number
  featuredImage?: { url: string; alt?: string } | string | null
  tags?: { tag: string }[]
}

type PageData = {
  headerSection?: {
    eyebrow?: string
    title?: string
    subtitle?: string
  }
  filtersSection?: {
    searchPlaceholder?: string
    allPostsLabel?: string
  }
  emptyState?: {
    noPostsTitle?: string
    noPostsMessage?: string
  }
  labels?: {
    readMoreText?: string
    byAuthorPrefix?: string
    minReadSuffix?: string
  }
}

interface BlogClientProps {
  lang: 'en' | 'fr'
  posts: BlogPost[]
  pageData?: PageData | null
  activeTag?: string
}

const categoryKeys = [
  'travel-tips',
  'experience-stories',
  'marrakech-guide',
  'photography',
  'safety-faqs',
  'behind-the-scenes',
] as const

const categoryLabels: Record<(typeof categoryKeys)[number], string> = {
  'travel-tips': 'Travel Tips',
  'experience-stories': 'Experience Stories',
  'marrakech-guide': 'Imsouane Guide',
  'photography': 'Photography',
  'safety-faqs': 'Safety & FAQs',
  'behind-the-scenes': 'Behind the Scenes',
}

const labelFor = (cat: string) =>
  categoryLabels[cat as (typeof categoryKeys)[number]] || cat

const getImageUrl = (img: BlogPost['featuredImage']) => {
  if (!img) return null
  if (typeof img === 'string') return img
  return img.url || null
}

export default function BlogClient({ lang, posts, pageData, activeTag: initialActiveTag }: BlogClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeTag, setActiveTag] = useState<string | undefined>(initialActiveTag)

  const header = pageData?.headerSection
  const filters = pageData?.filtersSection
  const labels = pageData?.labels
  const empty = pageData?.emptyState

  const isFr = lang === 'fr'

  const eyebrow = header?.eyebrow || (isFr ? 'Notre Blog' : 'Our Blog')
  const title = header?.title || (isFr ? 'Stories from Imsouane' : 'Stories from Imsouane')
  const subtitle = header?.subtitle || (isFr
    ? "Conseils surf, guides voyage et histoires depuis Imsouane, Maroc."
    : 'Surf tips, travel guides and stories from Imsouane, Morocco.')
  const searchPlaceholder = filters?.searchPlaceholder || (isFr ? 'Rechercher un article...' : 'Search articles...')
  const allLabel = filters?.allPostsLabel || (isFr ? 'Tous les articles' : 'All Posts')
  const readMoreText = labels?.readMoreText || (isFr ? 'Lire la suite' : 'Read More')
  const byPrefix = labels?.byAuthorPrefix || (isFr ? 'Par' : 'By')
  const minReadSuffix = labels?.minReadSuffix || (isFr ? 'min de lecture' : 'min read')
  const emptyTitle = empty?.noPostsTitle || (isFr ? 'Aucun article trouvé' : 'No posts found')
  const emptyMessage = empty?.noPostsMessage || (isFr ? 'Essayez d\'ajuster votre recherche.' : 'Try adjusting your search or filter.')

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false
      if (activeTag && !p.tags?.some((t) => t.tag === activeTag)) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
      )
    })
  }, [posts, search, activeCategory, activeTag])

  const clearActiveTag = () => {
    setActiveTag(undefined)
    router.replace(pathname, { scroll: false })
  }

  const tagLabelPrefix = isFr ? 'Étiquette' : 'Tag'

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <div className="min-h-screen bg-sand-light">
      {/* ══════════════════════════════════════════════════════════════
          PAGE HEADER (matches Rooms / Surf style)
          ══════════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-8 pb-12 border-b border-[#EBEBEB]">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-sm text-[#717171]">
              <a href={`/${lang}`} className="hover:text-[#222222] transition-colors">
                {isFr ? 'Accueil' : 'Home'}
              </a>
              <span>/</span>
              <span className="text-[#222222] font-medium">{eyebrow}</span>
            </div>
            <h1 className="text-3xl sm:text-[42px] text-[#222222] tracking-tight">
              {title}
            </h1>
            <p className="text-[#717171] text-lg max-w-[640px]">
              {subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-30 bg-sand-light/90 backdrop-blur-md border-b border-[#EBEBEB]">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-20 py-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-[#E07A5F] focus:ring-2 focus:ring-[#E07A5F]/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors border ${
                activeCategory === 'all'
                  ? 'bg-[#1B4965] text-white border-[#1B4965]'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#1B4965]'
              }`}
            >
              {allLabel}
            </button>
            {categoryKeys.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors border ${
                  activeCategory === cat
                    ? 'bg-[#1B4965] text-white border-[#1B4965]'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#1B4965]'
                }`}
              >
                {labelFor(cat)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-[1340px] mx-auto px-6 sm:px-20 py-12 md:py-16">
        {activeTag ? (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 pl-4 pr-2 py-2 rounded-full text-sm bg-[#1B4965] text-white">
              <span>
                {tagLabelPrefix}{isFr ? ' : ' : ': '}
                <span className="font-semibold">{activeTag}</span>
              </span>
              <button
                type="button"
                onClick={clearActiveTag}
                aria-label={isFr ? 'Effacer le filtre étiquette' : 'Clear tag filter'}
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        ) : null}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="font-serif text-2xl text-[#1B4965] mb-2">{emptyTitle}</h2>
            <p className="text-neutral-600">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPosts.map((post, i) => {
              const imageUrl = getImageUrl(post.featuredImage)
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.05 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-neutral-100"
                >
                  <Link href={`/${lang}/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={(typeof post.featuredImage === 'object' && post.featuredImage?.alt) || post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4965] to-[#3A8FB7]" />
                      )}
                      <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#1B4965] backdrop-blur-sm">
                        {labelFor(post.category)}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.publishedAt)}
                        </span>
                        {post.readingTime ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readingTime} {minReadSuffix}
                          </span>
                        ) : null}
                      </div>
                      <h2 className="font-serif text-xl text-[#1B4965] mb-3 leading-snug group-hover:text-[#E07A5F] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-neutral-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                        {post.author ? (
                          <span className="text-xs text-neutral-500">
                            {byPrefix} <span className="text-neutral-700 font-medium">{post.author}</span>
                          </span>
                        ) : <span />}
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#E07A5F]">
                          {readMoreText}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              )
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
