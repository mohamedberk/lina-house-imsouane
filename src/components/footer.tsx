'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Instagram, Phone, Mail, MapPin, ChevronDown, Globe } from 'lucide-react'
import { Logo } from './logo'
import { Currency } from './currency-switcher'

interface FooterSettings {
  brandDescription: string
  copyrightText: string
  phone: string
  email: string
  whatsappNumber: string
  location: string
  instagramUrl: string
  tiktokUrl: string
  experiencesLinks: { label: string; href: string }[]
  aboutLinks: { label: string; href: string }[]
}

// Language and Currency config
const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
]

const currencies = [
  { code: 'EUR', name: 'Euro (€)', symbol: '€' },
  { code: 'USD', name: 'Dollar ($)', symbol: '$' },
  { code: 'MAD', name: 'Dirham (MAD)', symbol: 'د.م' },
]

const defaultFooterSettings: FooterSettings = {
  brandDescription: 'Surf camp & hostel in Imsouane, Morocco. 500m from the beach, rated 9.7/10 on Hostelworld. Surf lessons, homemade restaurant, rooftop terrace.',
  copyrightText: 'Lina House. All rights reserved.',
  phone: '+212 772-228120',
  email: 'contact@linahouse.com',
  whatsappNumber: '212772228120',
  location: 'Imsouane, Morocco',
  instagramUrl: '',
  tiktokUrl: '',
  experiencesLinks: [
    { label: 'Rooms', href: '#rooms' },
    { label: 'Surf & Activities', href: '#surf' },
    { label: 'Packages', href: '#packages' },
    { label: 'Restaurant', href: '#restaurant' },
  ],
  aboutLinks: [
    { label: 'Contact', href: '#contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Use', href: '/terms-of-use' },
  ],
}

export function Footer({ cmsData }: { cmsData?: Partial<FooterSettings> }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isCurrOpen, setIsCurrOpen] = useState(false)
  const [currency, setCurrency] = useState<Currency>('EUR')

  // Merge CMS data with defaults (only override non-null values)
  const settings: FooterSettings = { ...defaultFooterSettings }
  if (cmsData) {
    Object.entries(cmsData).forEach(([key, value]) => {
      if (value != null && value !== '') {
        ;(settings as unknown as Record<string, unknown>)[key] = value
      }
    })
  }

  // Get current language from pathname
  const currentLang = pathname.split('/')[1] || 'en'
  const language = ['en', 'fr'].includes(currentLang) ? currentLang : 'en'

  // Load saved currency preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferredCurrency') as Currency
      if (saved && ['EUR', 'USD', 'MAD'].includes(saved)) {
        setCurrency(saved)
      }
    }
  }, [])

  const handleLanguageChange = (newLang: string) => {
    if (newLang === language) {
      setIsLangOpen(false)
      return
    }

    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`

    const segments = pathname.split('/')
    segments[1] = newLang
    const newPath = segments.join('/')

    setIsLangOpen(false)
    router.push(newPath)
  }

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem('preferredCurrency', newCurrency)
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: newCurrency }))
    setIsCurrOpen(false)
  }

  const currentLangDisplay = languages.find(l => l.code === language)?.name || 'English'
  const currentCurrDisplay = currencies.find(c => c.code === currency)

  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 mb-10">
          {/* Brand with Logo Icon */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 order-first">
            <Link href="/" className="flex justify-start mb-4" aria-label="Lina House">
              <Logo size="lg" variant="full" />
            </Link>
            <p className="text-neutral-600 text-sm leading-relaxed mb-5">
              {settings.brandDescription}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-[#1B4965] hover:text-white flex items-center justify-center transition-colors text-neutral-600"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.tiktokUrl && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-[#000000] hover:text-white flex items-center justify-center transition-colors text-neutral-600"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Settings - Language & Currency (appears after brand on mobile) */}
          <div className="order-1 lg:order-last">
            <h3 className="font-bold text-sm text-neutral-900 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Settings
            </h3>
            <div className="space-y-3">
              {/* Language Selector */}
              <div className="relative">
                <label className="block text-neutral-500 text-xs mb-1">Language</label>
                <button
                  onClick={() => { setIsLangOpen(!isLangOpen); setIsCurrOpen(false) }}
                  className="w-full flex items-center justify-between px-3 py-2 bg-neutral-100 rounded-lg text-neutral-900 text-sm font-medium hover:bg-neutral-200 transition-colors"
                >
                  <span>{currentLangDisplay}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLangOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 transition-colors ${
                          language === lang.code ? 'bg-blue-50 text-[#1B4965]' : 'text-neutral-900'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <label className="block text-neutral-500 text-xs mb-1">Currency</label>
                <button
                  onClick={() => { setIsCurrOpen(!isCurrOpen); setIsLangOpen(false) }}
                  className="w-full flex items-center justify-between px-3 py-2 bg-neutral-100 rounded-lg text-neutral-900 text-sm font-medium hover:bg-neutral-200 transition-colors"
                >
                  <span>{currentCurrDisplay?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isCurrOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCurrOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden z-50">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencyChange(curr.code as Currency)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 transition-colors ${
                          currency === curr.code ? 'bg-blue-50 text-[#1B4965]' : 'text-neutral-900'
                        }`}
                      >
                        {curr.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="order-2 lg:order-none">
            <h3 className="font-bold text-sm text-neutral-900 mb-4">Explore</h3>
            <ul className="space-y-2.5">
              {(settings.experiencesLinks.length > 0 ? settings.experiencesLinks : defaultFooterSettings.experiencesLinks).map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-neutral-600 text-sm hover:text-[#1B4965] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div className="order-3 lg:order-none">
            <h3 className="font-bold text-sm text-neutral-900 mb-4">About</h3>
            <ul className="space-y-2.5">
              {(settings.aboutLinks.length > 0 ? settings.aboutLinks : defaultFooterSettings.aboutLinks).map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-neutral-600 text-sm hover:text-[#1B4965] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="order-4 lg:order-none">
            <h3 className="font-bold text-sm text-neutral-900 mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B4965]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-[#1B4965]" />
                </div>
                <div className="space-y-1">
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="block font-medium text-xs text-neutral-900 hover:text-[#1B4965] transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#86ceeb]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#86ceeb]/20 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#86ceeb]" />
                </div>
                <div>
                  <p className="font-medium text-[10px] sm:text-xs text-neutral-900 break-all">{settings.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B4965]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-[#1B4965]" />
                </div>
                <div>
                  <p className="font-medium text-xs text-neutral-900">{settings.location}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-200 flex items-center justify-center">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} {settings.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  )
}
