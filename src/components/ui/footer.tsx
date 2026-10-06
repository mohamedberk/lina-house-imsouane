'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()

  // Function to handle navigation to home page sections
  const navigateToSection = (sectionId: string) => {
    // If we're already on the home page, just scroll
    if (pathname === '/') {
      scrollToSection(sectionId)
    } else {
      // Navigate to home page first, then scroll to section
      router.push('/')
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 500) // Small delay to ensure page loads
    }
  }

  // Smooth scroll function for anchor links
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      // Scroll to top of page
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      })
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }

  return (
    <footer id="footer" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Best Marrakech Activity</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              Discover the magic of Marrakech with our authentic tours and experiences. 
              From Atlas Mountains adventures to cultural city tours, we create unforgettable memories.
            </p>
            <div className="text-gray-300 text-sm sm:text-base space-y-1">
              <p>📍 Marrakech, Morocco</p>
              <p>📧 easymanageit@gmail.com</p>
              <p>📞 +212 624-536332</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-300 text-sm sm:text-base text-center md:text-left">
              <li>
                <button 
                  onClick={() => navigateToSection('top')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToSection('all-activities')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Activities
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToSection('about')}
                  className="hover:text-orange-400 transition-colors"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-300 text-sm sm:text-base text-center md:text-left">
              <li>
                <Link href="/privacy-policy" className="hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-orange-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="hover:text-orange-400 transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-300 text-xs sm:text-sm">
            © {new Date().getFullYear()} Best Marrakech Activity. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-4 sm:space-x-6 mt-3 md:mt-0">
            <Link href="/privacy-policy" className="text-gray-300 hover:text-orange-400 text-xs sm:text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/refund-policy" className="text-gray-300 hover:text-orange-400 text-xs sm:text-sm transition-colors">
              Refund
            </Link>
            <Link href="/terms-of-use" className="text-gray-300 hover:text-orange-400 text-xs sm:text-sm transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 