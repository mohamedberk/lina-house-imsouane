'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, ChevronRight, ArrowRight } from 'lucide-react'
import { Footer } from '@/components/footer'

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any
  category: string
  status: string
  author: string
  publishedAt: string
  readingTime: number
  featuredImage: {
    url: string
    alt?: string
  }
  tags?: Array<{ tag: string }>
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

type RelatedPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  publishedAt: string
  readingTime?: number
  featuredImage: {
    url: string
    alt?: string
  }
}

const categoryLabels: Record<string, string> = {
  'travel-tips': 'Travel Tips',
  'experience-stories': 'Experience Stories',
  'marrakech-guide': 'Imsouane Guide',
  'photography': 'Photography',
  'safety-faqs': 'Safety & FAQs',
  'behind-the-scenes': 'Behind the Scenes',
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'travel-tips': { bg: 'bg-blue-50', text: 'text-blue-600' },
  'experience-stories': { bg: 'bg-amber-50', text: 'text-amber-600' },
  'marrakech-guide': { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  'photography': { bg: 'bg-purple-50', text: 'text-purple-600' },
  'safety-faqs': { bg: 'bg-red-50', text: 'text-red-600' },
  'behind-the-scenes': { bg: 'bg-pink-50', text: 'text-pink-600' },
}

interface BlogPostClientProps {
  post: BlogPost
  lang: string
  relatedPosts?: RelatedPost[]
}

export default function BlogPostClient({ post, lang, relatedPosts = [] }: BlogPostClientProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleShare = (platform: string) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareTitle = post?.title || ''

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400')
    }
  }

  const renderContent = (content: any) => {
    if (!content || !content.root || !content.root.children) {
      return (
        <div className="prose prose-lg max-w-none">
          <p className="text-neutral-700 leading-relaxed mb-4">{post.excerpt}</p>
        </div>
      )
    }

    return (
      <div className="prose prose-lg max-w-none">
        {content.root.children.map((node: any, index: number) => {
          if (node.type === 'paragraph') {
            const text = node.children?.map((child: any) => child.text).join('') || ''
            return (
              <p key={index} className="text-neutral-700 leading-relaxed mb-4">
                {text}
              </p>
            )
          }

          if (node.type === 'heading') {
            const text = node.children?.map((child: any) => child.text).join('') || ''
            const HeadingTag = `h${node.tag || 2}` as keyof React.JSX.IntrinsicElements
            return (
              <HeadingTag
                key={index}
                className={`text-neutral-900 mb-4 mt-8 ${
                  node.tag === 2 ? 'text-2xl' : node.tag === 3 ? 'text-xl' : 'text-lg'
                }`}
              >
                {text}
              </HeadingTag>
            )
          }

          if (node.type === 'list') {
            const ListTag = node.listType === 'number' ? 'ol' : 'ul'
            return (
              <ListTag
                key={index}
                className={`mb-4 ml-6 space-y-2 ${
                  node.listType === 'number' ? 'list-decimal' : 'list-disc'
                }`}
              >
                {node.children?.map((item: any, itemIndex: number) => (
                  <li key={itemIndex} className="text-neutral-700">
                    {item.children?.map((child: any) => child.text).join('')}
                  </li>
                ))}
              </ListTag>
            )
          }

          // Handle upload/image nodes from Lexical
          if (node.type === 'upload') {
            const imageUrl = node.value?.url || node.relationTo === 'media' && node.value?.url
            const altText = node.value?.alt || node.value?.filename || 'Blog image'

            if (imageUrl) {
              return (
                <figure key={index} className="my-8">
                  <div className="relative w-full rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={imageUrl}
                      alt={altText}
                      width={node.value?.width || 1200}
                      height={node.value?.height || 675}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  {node.value?.caption && (
                    <figcaption className="text-center text-sm text-neutral-500 mt-3">
                      {node.value.caption}
                    </figcaption>
                  )}
                </figure>
              )
            }
          }

          // Handle block nodes (which may contain uploads)
          if (node.type === 'block' && node.fields?.blockType === 'mediaBlock') {
            const imageUrl = node.fields?.media?.url
            const altText = node.fields?.media?.alt || 'Blog image'

            if (imageUrl) {
              return (
                <figure key={index} className="my-8">
                  <div className="relative w-full rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={imageUrl}
                      alt={altText}
                      width={node.fields?.media?.width || 1200}
                      height={node.fields?.media?.height || 675}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </figure>
              )
            }
          }

          return null
        })}
      </div>
    )
  }

  const categoryStyle = categoryColors[post.category] || { bg: 'bg-neutral-100', text: 'text-neutral-600' }

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
                {lang === 'fr' ? 'Accueil' : 'Home'}
              </a>
              <span>/</span>
              <a href={`/${lang}/blog`} className="hover:text-[#222222] transition-colors">
                Blog
              </a>
              <span>/</span>
              <span className="text-[#222222] font-medium truncate max-w-[280px] sm:max-w-none">
                {post.title}
              </span>
            </div>

            <span className={`inline-flex items-center w-fit px-3 py-1.5 rounded-full text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text}`}>
              {categoryLabels[post.category] || post.category}
            </span>

            <h1 className="text-3xl sm:text-[42px] text-[#222222] tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#717171]">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="text-[#DDDDDD]">|</span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="text-[#DDDDDD]">|</span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readingTime} min {lang === 'fr' ? 'de lecture' : 'read'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <article className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-20">
          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg"
          >
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xl text-neutral-600 leading-relaxed mb-8 font-medium">
              {post.excerpt}
            </p>

            {renderContent(post.content)}
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 pt-8 border-t border-neutral-200"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-4 h-4 text-neutral-400" />
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/${lang}/blog?tag=${encodeURIComponent(tag.tag)}`}
                    className="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-full hover:bg-[#1B4965] hover:text-white transition-colors"
                  >
                    {tag.tag}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 pt-8 border-t border-neutral-200"
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-neutral-600">
                <Share2 className="w-4 h-4" />
                {lang === 'fr' ? 'Partager cet article' : 'Share this article'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 p-8 bg-gradient-to-r from-[#E07A5F]/10 via-[#E07A5F]/5 to-transparent rounded-2xl"
          >
            <h3 className="text-2xl text-neutral-900 mb-3">
              {lang === 'fr' ? 'Prêt à venir surfer à Imsouane ?' : 'Ready to Surf in Imsouane?'}
            </h3>
            <p className="text-neutral-600 mb-6">
              {lang === 'fr'
                ? "Réservez votre séjour à Lina House — surf, repas maison et terrasse vue océan à 500m de Magic Bay."
                : 'Book your stay at Lina House — surf, homemade food and an ocean-view rooftop, 500m from Magic Bay.'}
            </p>
            <Link
              href={`/${lang}/booking`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E07A5F] text-white font-semibold rounded-xl hover:bg-[#1B4965] transition-colors shadow-lg shadow-[#E07A5F]/30"
            >
              {lang === 'fr' ? 'Réserver maintenant' : 'Book Now'}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="pb-16 md:pb-20">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl text-[#222222] tracking-tight mb-8"
            >
              {lang === 'fr' ? 'Vous aimerez aussi' : 'You might also like'}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedPosts.map((rp, i) => {
                const rpStyle = categoryColors[rp.category] || { bg: 'bg-neutral-100', text: 'text-neutral-600' }
                return (
                  <motion.article
                    key={rp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.05 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-neutral-100"
                  >
                    <Link href={`/${lang}/blog/${rp.slug}`} className="block">
                      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                        <Image
                          src={rp.featuredImage.url}
                          alt={rp.featuredImage.alt || rp.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#1B4965] backdrop-blur-sm`}>
                          {categoryLabels[rp.category] || rp.category}
                        </span>
                      </div>
                      <div className="p-6 flex flex-col">
                        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(rp.publishedAt)}
                          </span>
                          {rp.readingTime ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {rp.readingTime} {lang === 'fr' ? 'min de lecture' : 'min read'}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="font-serif text-xl text-[#1B4965] mb-3 leading-snug group-hover:text-[#E07A5F] transition-colors">
                          {rp.title}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{rp.excerpt}</p>
                        <div className="flex items-center justify-end mt-auto pt-4 border-t border-neutral-100">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#E07A5F]">
                            {lang === 'fr' ? 'Lire la suite' : 'Read More'}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
