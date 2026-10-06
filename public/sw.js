// Image cache service worker.
// Caches /_next/image, UploadThing (ufs.sh / utfs.io), local /images and /fonts
// in the Cache Storage API — survives Safari's HTTP cache revalidation on F5.
// Bump CACHE_NAME version to invalidate all entries.

const CACHE_NAME = 'lina-images-v1'
const MAX_ENTRIES = 150

const isCacheable = (url) => {
  try {
    const u = new URL(url)
    if (u.pathname.startsWith('/_next/image')) return true
    if (u.hostname.endsWith('.ufs.sh') || u.hostname === 'utfs.io') return true
    if (u.pathname.startsWith('/images/')) return true
    if (u.pathname.startsWith('/fonts/')) return true
    return false
  } catch {
    return false
  }
}

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
      await self.clients.claim()
    })()
  )
})

const trimCache = async (cache) => {
  const keys = await cache.keys()
  const overflow = keys.length - MAX_ENTRIES
  if (overflow > 0) {
    await Promise.all(keys.slice(0, overflow).map((k) => cache.delete(k)))
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  if (!isCacheable(request.url)) return

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      const cached = await cache.match(request)
      if (cached) return cached

      try {
        const response = await fetch(request)
        if (response && (response.status === 200 || response.type === 'opaque')) {
          cache.put(request, response.clone()).then(() => trimCache(cache)).catch(() => {})
        }
        return response
      } catch (err) {
        if (cached) return cached
        throw err
      }
    })()
  )
})
