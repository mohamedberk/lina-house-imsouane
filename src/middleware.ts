import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'fr']
const defaultLocale = 'en'

// Paths that should NOT be localized
const publicPaths = [
  '/api',
  '/admin',
  '/_next',
  '/favicon',
  '/images',
  '/fonts',
  '/sitemap',
  '/robots',
]

function getLocaleFromHeaders(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return defaultLocale

  // Parse accept-language header
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, priority = 'q=1'] = lang.trim().split(';')
      return {
        code: code.split('-')[0].toLowerCase(),
        priority: parseFloat(priority.replace('q=', '')),
      }
    })
    .sort((a, b) => b.priority - a.priority)

  // Find first matching locale
  for (const lang of languages) {
    if (locales.includes(lang.code)) {
      return lang.code
    }
  }

  return defaultLocale
}

function getLocaleFromCookie(request: NextRequest): string | null {
  const localeCookie = request.cookies.get('NEXT_LOCALE')
  if (localeCookie && locales.includes(localeCookie.value)) {
    return localeCookie.value
  }
  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Determine locale: cookie > header > default
  const locale = getLocaleFromCookie(request) || getLocaleFromHeaders(request)

  // Redirect to localized path
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  newUrl.search = request.nextUrl.search

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    // Match all paths except static files and api
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|admin).*)',
  ],
}
