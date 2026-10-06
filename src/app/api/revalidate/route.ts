import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { CACHE_TAGS } from '@/lib/cache'

// Secret key to protect the endpoint
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, tag, collection } = body

    // Verify secret
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    // If specific tag provided, revalidate it
    if (tag && Object.values(CACHE_TAGS).includes(tag)) {
      revalidateTag(tag)
      return NextResponse.json({ revalidated: true, tag })
    }

    // Map collection to cache tag
    const collectionToTag: Record<string, string> = {
      blog: CACHE_TAGS.blog,
      homepage: CACHE_TAGS.homepage,
      'about-page': CACHE_TAGS.aboutPage,
      'contact-page': CACHE_TAGS.contactPage,
      'blog-page': CACHE_TAGS.blogPage,
      rooms: CACHE_TAGS.rooms,
    }

    if (collection && collectionToTag[collection]) {
      revalidateTag(collectionToTag[collection])
      return NextResponse.json({ revalidated: true, collection })
    }

    // Revalidate all if no specific tag
    Object.values(CACHE_TAGS).forEach(tag => revalidateTag(tag))
    return NextResponse.json({ revalidated: true, all: true })

  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

// Also support GET for easy testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const tag = searchParams.get('tag')

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  if (tag && Object.values(CACHE_TAGS).includes(tag as any)) {
    revalidateTag(tag)
    return NextResponse.json({ revalidated: true, tag })
  }

  // Revalidate all
  Object.values(CACHE_TAGS).forEach(t => revalidateTag(t))
  return NextResponse.json({ revalidated: true, all: true })
}
