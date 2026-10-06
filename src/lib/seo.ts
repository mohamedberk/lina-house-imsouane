import type { Metadata } from 'next'

const SITE_URL = 'https://linahouse-imsouane.com'

type SeoData = {
  metaTitle?: string | null
  metaDescription?: string | null
  keywords?: string | null
  ogImage?:
    | string
    | { url?: string | null; alt?: string | null }
    | null
}

type BuildOpts = {
  cms?: SeoData | null | undefined
  fallbackTitle: string
  fallbackDescription: string
  fallbackKeywords?: string
  path: string // e.g. "/about" — appended to /[lang]
  lang: string
}

const resolveOgImage = (img: SeoData['ogImage']): string | undefined => {
  if (!img) return undefined
  if (typeof img === 'string') return img
  if (typeof img === 'object' && img.url) return img.url
  return undefined
}

const splitKeywords = (kw?: string | null): string[] | undefined => {
  if (!kw) return undefined
  return kw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
}

export function buildPageMetadata({
  cms,
  fallbackTitle,
  fallbackDescription,
  fallbackKeywords,
  path,
  lang,
}: BuildOpts): Metadata {
  const title = cms?.metaTitle?.trim() || fallbackTitle
  const description = cms?.metaDescription?.trim() || fallbackDescription
  const keywords =
    splitKeywords(cms?.keywords) || splitKeywords(fallbackKeywords)
  const ogImage = resolveOgImage(cms?.ogImage)

  const url = `${SITE_URL}/${lang}${path === '/' ? '' : path}`

  const meta: Metadata = {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en${path === '/' ? '' : path}`,
        fr: `${SITE_URL}/fr${path === '/' ? '' : path}`,
        'x-default': `${SITE_URL}/en${path === '/' ? '' : path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Lina House',
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }

  return meta
}
