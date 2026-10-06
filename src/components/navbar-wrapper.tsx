'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { useFullscreen } from '@/contexts/fullscreen-context'

export function NavbarWrapper() {
  const pathname = usePathname()
  const { isFullscreen } = useFullscreen()

  // Hide navbar on specific pages and fullscreen mode
  if (
    isFullscreen ||
    [
      '/confirmation',
      '/chezalibooking',
      '/booking',  // Hide on all activity pages
      '/checkout',
      '/paypal-debug'
    ].some(path => pathname.startsWith(path))
  ) {
    return null
  }

  // Check if it's the home page (handles both /en and /fr and just /)
  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/fr' || /^\/[a-z]{2}$/.test(pathname)

  return <Navbar isHomePage={isHomePage} />
} 