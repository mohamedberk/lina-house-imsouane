'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, Check, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export type Language = 'en' | 'fr'

const languageConfig: Record<Language, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
}

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'globe'
}

export function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get current language from pathname
  const currentLang = (pathname.split('/')[1] as Language) || 'en'
  const language = ['en', 'fr'].includes(currentLang) ? currentLang : 'en'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (newLang: Language) => {
    if (newLang === language) {
      setIsOpen(false)
      return
    }

    // Save preference in cookie for middleware
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`

    // Build new path with new language
    const segments = pathname.split('/')
    segments[1] = newLang
    const newPath = segments.join('/')

    setIsOpen(false)
    router.push(newPath)
  }

  const currentConfig = languageConfig[language]

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      {variant === 'globe' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-full hover:bg-[#F7F7F7] transition-colors"
        >
          <Globe className="w-[18px] h-[18px] text-[#222222]" />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors text-sm font-medium text-neutral-700"
        >
          <span className="text-base">{currentConfig.flag}</span>
          <span className="hidden sm:inline">{language.toUpperCase()}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50"
          >
            <div className="py-1">
              {(['en', 'fr'] as Language[]).map((lang) => {
                const config = languageConfig[lang]
                const isSelected = language === lang
                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? 'bg-orange-50 text-[#FF5A00]'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{config.flag}</span>
                      <div className="text-left">
                        <p className="font-medium">{config.nativeName}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook to get current language
export function useLanguage(): Language {
  const pathname = usePathname()
  const lang = pathname.split('/')[1] as Language
  return ['en', 'fr'].includes(lang) ? lang : 'en'
}
