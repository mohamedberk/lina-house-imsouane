'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TranslateAllCollectionButton from './TranslateAllCollectionButton'

const ORANGE = '#FF5A00'
const BLUE = '#86ceeb'
const GREEN = '#22c55e'
const GRAY = '#94a3b8'

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string
  category: string
  status: 'draft' | 'published'
  author?: string
  publishedAt?: string
  readingTime?: number
  featuredImage?: {
    url?: string
    filename?: string
  } | string
}

type PaginatedResponse = {
  docs: BlogPost[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

const categoryLabels: Record<string, string> = {
  'travel-tips': 'Travel Tips',
  'experience-stories': 'Experience Stories',
  'marrakech-guide': 'Marrakech Guide',
  'photography': 'Photography',
  'safety-faqs': 'Safety & FAQs',
  'behind-the-scenes': 'Behind the Scenes',
}

const categoryColors: Record<string, string> = {
  'travel-tips': '#3b82f6',
  'experience-stories': '#f59e0b',
  'marrakech-guide': '#10b981',
  'photography': '#8b5cf6',
  'safety-faqs': '#ef4444',
  'behind-the-scenes': '#ec4899',
}

export const BlogListView: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<PaginatedResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/blog?page=${currentPage}&limit=${limit}&depth=1`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [currentPage, limit])

  const getImageUrl = (post: BlogPost): string | null => {
    if (!post.featuredImage) return null
    if (typeof post.featuredImage === 'string') return null
    return post.featuredImage?.url || null
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleClick = (id: string) => {
    router.push(`/admin/collections/blog/${id}`)
  }

  if (loading) {
    return (
      <div style={{
        padding: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: `3px solid ${BLUE}`,
          borderTopColor: ORANGE,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: '#666', fontSize: '13px' }}>Loading blog posts...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: ORANGE }}>Failed to load blog posts</p>
      </div>
    )
  }

  const { docs: posts } = data
  const publishedCount = posts.filter(p => p.status === 'published').length
  const draftCount = posts.filter(p => p.status === 'draft').length

  return (
    <div className="lina-admin-page" style={{ padding: '20px' }}>
      {/* Auto-translate banner */}
      <TranslateAllCollectionButton />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0,
          }}>
            Blog Posts
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#666',
            margin: '2px 0 0 0',
          }}>
            {data.totalDocs} post{data.totalDocs !== 1 ? 's' : ''} total
            <span style={{ margin: '0 8px', color: '#ddd' }}>|</span>
            <span style={{ color: GREEN }}>{publishedCount} published</span>
            <span style={{ margin: '0 8px', color: '#ddd' }}>|</span>
            <span style={{ color: GRAY }}>{draftCount} draft{draftCount !== 1 ? 's' : ''}</span>
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/collections/blog/create')}
          style={{
            padding: '10px 20px',
            background: ORANGE,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          + New Post
        </button>
      </div>

      {/* Blog Cards */}
      {posts.length === 0 ? (
        <div style={{
          padding: '48px',
          textAlign: 'center',
          background: '#fafafa',
          borderRadius: '12px',
          border: `2px dashed ${BLUE}`,
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.5" style={{ margin: '0 auto 12px' }}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <h3 style={{ color: '#333', margin: '0 0 4px 0', fontSize: '15px' }}>No blog posts yet</h3>
          <p style={{ color: '#888', margin: 0, fontSize: '13px' }}>Create your first blog post to share your stories</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {posts.map((post) => {
            const imageUrl = getImageUrl(post)
            const categoryColor = categoryColors[post.category] || BLUE

            return (
              <div
                key={post.id}
                onClick={() => handleClick(post.id)}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e8e8e8',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(243, 152, 77, 0.15)`
                  e.currentTarget.style.borderColor = ORANGE
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#e8e8e8'
                }}
              >
                {/* Image */}
                <div style={{
                  width: '100%',
                  height: '120px',
                  background: imageUrl
                    ? `url(${imageUrl}) center center / cover no-repeat`
                    : `linear-gradient(135deg, ${ORANGE} 0%, #E65000 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                  {!imageUrl && (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  )}
                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '4px 8px',
                    background: post.status === 'published' ? GREEN : GRAY,
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: 'white',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}>
                    {post.status}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '14px' }}>
                  {/* Category */}
                  <div style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    background: `${categoryColor}15`,
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: categoryColor,
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}>
                    {categoryLabels[post.category] || post.category}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 6px 0',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                      margin: '0 0 10px 0',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: '10px',
                    marginTop: '4px',
                  }}>
                    <span style={{
                      fontSize: '11px',
                      color: '#888',
                    }}>
                      {formatDate(post.publishedAt)}
                    </span>
                    {post.readingTime && (
                      <span style={{
                        fontSize: '11px',
                        color: BLUE,
                      }}>
                        {post.readingTime} min read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '24px',
        }}>
          <button
            disabled={!data.hasPrevPage}
            onClick={() => router.push(`/admin/collections/blog?page=${data.prevPage}&limit=${limit}`)}
            style={{
              padding: '8px 14px',
              background: data.hasPrevPage ? '#fff' : '#f5f5f5',
              border: `1px solid ${data.hasPrevPage ? BLUE : '#e0e0e0'}`,
              borderRadius: '6px',
              cursor: data.hasPrevPage ? 'pointer' : 'not-allowed',
              color: data.hasPrevPage ? BLUE : '#ccc',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            Previous
          </button>

          <span style={{
            padding: '8px 12px',
            fontSize: '12px',
            color: '#666',
          }}>
            {data.page} / {data.totalPages}
          </span>

          <button
            disabled={!data.hasNextPage}
            onClick={() => router.push(`/admin/collections/blog?page=${data.nextPage}&limit=${limit}`)}
            style={{
              padding: '8px 14px',
              background: data.hasNextPage ? '#fff' : '#f5f5f5',
              border: `1px solid ${data.hasNextPage ? BLUE : '#e0e0e0'}`,
              borderRadius: '6px',
              cursor: data.hasNextPage ? 'pointer' : 'not-allowed',
              color: data.hasNextPage ? BLUE : '#ccc',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default BlogListView
