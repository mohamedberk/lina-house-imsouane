'use client'

import { Suspense, lazy, useEffect, useState, memo } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { FullscreenProvider } from '@/contexts/fullscreen-context'
import { GalleryProvider } from '@/contexts/gallery-context'

// Optimize imports with chunking
import { NavbarWrapper } from '@/components/navbar-wrapper'

// Add Footer import
const Footer = lazy(() =>
  import('@/components/ui/footer').then(mod => ({
    default: memo(mod.default)
  }))
)

// WhatsApp popup component
const WhatsAppPopup = lazy(() =>
  import('@/components/whatsapp-popup').then(mod => ({
    default: mod.WhatsAppPopup
  }))
)

// Memoize the background pattern component
const BackgroundPattern = memo(() => (
  <div className="hidden md:block fixed inset-0 bg-dot-matrix bg-dot bg-dot-offset opacity-[0.12] pointer-events-none z-0" />
))

// Optimize layout component
export const ClientLayout = memo(function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Use reducer instead of multiple states for better performance
  const [state, setState] = useState({
    isMounted: false,
    isMobile: false,
    isReducedMotion: false
  })

  useEffect(() => {
    // Check device capabilities once on mount
    const checkCapabilities = () => {
      const isMobile = window.innerWidth < 768
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      setState({
        isMounted: true,
        isMobile,
        isReducedMotion
      })
    }

    checkCapabilities()

    // Debounced resize handler
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(checkCapabilities, 100)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <ThemeProvider>
      <FullscreenProvider>
        <GalleryProvider>
          {/* Only show background pattern on desktop */}
          <BackgroundPattern />

          {/* Navbar - Hide on checkout, admin, and affiliate pages */}
          {!pathname?.startsWith('/admin') && !pathname?.includes('/checkout') && !pathname?.match(/\/[a-z]{2}\/(p8x7k2m|a)\//) && <NavbarWrapper />}

          {/* Main content */}
          <main className="relative z-10">
            {children}
          </main>



          {/* WhatsApp Popup - hide on checkout, admin, and affiliate pages */}
          {!pathname?.includes('/checkout') && !pathname?.startsWith('/admin') && !pathname?.match(/\/[a-z]{2}\/(p8x7k2m|a)\//) && (
            <Suspense fallback={null}>
              <WhatsAppPopup />
            </Suspense>
          )}

          {/* Optimize toast animations based on device */}
          <Toaster
            position={state.isMobile ? "bottom-center" : "top-center"}
            toastOptions={{
              duration: state.isMobile ? 3000 : 5000,
              className: cn(
                state.isMobile && "!transform-none",
                state.isReducedMotion && "!transition-none"
              )
            }}
          />
        </GalleryProvider>
      </FullscreenProvider>
    </ThemeProvider>
  )
}) 