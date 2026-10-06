import type { Media } from '@/payload-types'

export type MediaSize = 'thumbnail' | 'card' | 'hero' | 'hero2x'

type MediaLike = string | Media | { url?: string | null; sizes?: Record<string, { url?: string | null } | null> } | null | undefined

export function getMediaUrl(media: MediaLike, size?: MediaSize, fallback: string = ''): string {
  if (!media) return fallback
  if (typeof media === 'string') return media
  if (size) {
    const variant = (media as any).sizes?.[size]
    if (variant?.url) return variant.url
  }
  return (media as any).url || fallback
}
