'use client'

import { useEffect } from 'react'

const PIXEL_ID = '4104542493143363'

function injectPixel() {
  if (typeof window === 'undefined') return
  const w = window as unknown as { fbq?: unknown }
  if (w.fbq) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const n: any = function () {
      // eslint-disable-next-line prefer-rest-params
      n.callMethod ? n.callMethod.apply(n, arguments as unknown as unknown[]) : n.queue.push(arguments)
    }
    f.fbq = n
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    const t = b.createElement(e) as HTMLScriptElement
    t.async = true
    t.src = v
    const s = b.getElementsByTagName(e)[0]
    s.parentNode?.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fbq = (window as any).fbq as ((...args: unknown[]) => void) | undefined
  fbq?.('init', PIXEL_ID)
  fbq?.('track', 'PageView')
}

export function MetaPixelLazy() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).fbq) return

    let fired = false
    const fire = () => {
      if (fired) return
      fired = true
      cleanup()
      // Give the browser one idle tick so the pixel never competes with LCP work.
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback
      if (ric) ric(injectPixel, { timeout: 2000 })
      else setTimeout(injectPixel, 0)
    }

    const events: Array<keyof WindowEventMap> = ['scroll', 'pointerdown', 'touchstart', 'keydown', 'mousemove']
    const opts: AddEventListenerOptions = { once: true, passive: true, capture: true }
    events.forEach((ev) => window.addEventListener(ev, fire as EventListener, opts))

    // Fallback: fire after 6s of inactivity so we still get conversion tracking for idle users.
    const timer = window.setTimeout(fire, 6000)

    function cleanup() {
      events.forEach((ev) => window.removeEventListener(ev, fire as EventListener, { capture: true }))
      window.clearTimeout(timer)
    }

    return cleanup
  }, [])

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  )
}
