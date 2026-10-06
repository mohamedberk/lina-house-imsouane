'use client'

import { useEffect, useState } from 'react'

type Props = {
  videoUrl: string
  mobileVideoUrl?: string
  webmUrl?: string
  mobileWebmUrl?: string
  posterUrl?: string
  mobileBreakpoint?: number
  className?: string
}

function derivePosterUrl(videoUrl: string | undefined): string | undefined {
  if (!videoUrl) return undefined
  if (!videoUrl.includes('cloudinary.com') || !videoUrl.includes('/video/upload/')) {
    return undefined
  }
  return videoUrl
    .replace(/\.(mp4|webm|mov|m4v)(\?|$)/i, '.jpg$2')
    .replace(/\/video\/upload\/([^/]+)\//, (_match, transforms) => {
      const cleaned = transforms
        .split(',')
        .filter((t: string) => !/^vc_|^br_|^fps_|^ac_|^af_|^so_|^eo_|^du_/i.test(t))
        .join(',')
      return `/video/upload/${cleaned}/`
    })
}

export function HeroVideo({
  videoUrl,
  mobileVideoUrl,
  webmUrl,
  mobileWebmUrl,
  posterUrl,
  mobileBreakpoint = 768,
  className = '',
}: Props) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null)
  const [activeWebmUrl, setActiveWebmUrl] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const effectivePoster =
    posterUrl || derivePosterUrl(videoUrl) || derivePosterUrl(mobileVideoUrl)

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${mobileBreakpoint}px)`)
    const pick = () => {
      if (mobileVideoUrl) {
        setActiveUrl(mql.matches ? videoUrl : mobileVideoUrl)
        setActiveWebmUrl(
          mql.matches ? webmUrl || null : mobileWebmUrl || webmUrl || null,
        )
      } else {
        setActiveUrl(videoUrl)
        setActiveWebmUrl(webmUrl || null)
      }
    }
    pick()
    mql.addEventListener('change', pick)
    return () => mql.removeEventListener('change', pick)
  }, [videoUrl, mobileVideoUrl, webmUrl, mobileWebmUrl, mobileBreakpoint])

  useEffect(() => {
    setReady(false)
  }, [activeUrl])

  return (
    <>
      {effectivePoster && (
        <img
          src={effectivePoster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            ready ? 'opacity-0' : 'opacity-100'
          } ${className}`}
        />
      )}
      {activeUrl && (
        <video
          key={activeUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={effectivePoster}
          disableRemotePlayback
          disablePictureInPicture
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            ready ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        >
          {activeWebmUrl && <source src={activeWebmUrl} type="video/webm" />}
          <source src={activeUrl} type="video/mp4" />
        </video>
      )}
    </>
  )
}
