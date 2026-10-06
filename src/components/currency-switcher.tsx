'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Fixed exchange rates FROM EUR (1 EUR = X currency)
const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.08,   // 1 EUR ≈ 1.08 USD
  MAD: 10.9,   // 1 EUR ≈ 10.9 MAD
}

export type Currency = 'EUR' | 'USD' | 'MAD'

const currencyConfig: Record<Currency, { symbol: string; name: string; flag: string }> = {
  EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
  USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  MAD: { symbol: 'DH', name: 'Moroccan Dirham', flag: '🇲🇦' }
}

interface CurrencySwitcherProps {
  className?: string
  compact?: boolean
  variant?: 'default' | 'pill'
}

// Modern currency switcher - horizontal toggle on desktop, dropdown on mobile
export function CurrencySwitcher({ className = '', variant = 'default' }: CurrencySwitcherProps) {
  const [currency, setCurrency] = useState<Currency>('EUR')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load saved currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency') as Currency
    if (savedCurrency && ['EUR', 'USD', 'MAD'].includes(savedCurrency)) {
      setCurrency(savedCurrency)
    }

    // Listen for currency changes
    const handleCurrencyChange = (e: CustomEvent<Currency>) => {
      setCurrency(e.detail)
    }

    window.addEventListener('currencyChange', handleCurrencyChange as EventListener)
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange as EventListener)
    }
  }, [])

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

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem('preferredCurrency', newCurrency)
    setIsOpen(false)

    // Prevent scroll jump
    const scrollY = window.scrollY

    // Dispatch custom event so other components can listen
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: newCurrency }))

    // Restore scroll position after state updates
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY)
    })
  }

  const currentConfig = currencyConfig[currency]

  if (variant === 'pill') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 border border-[#DDDDDD] rounded-full px-2.5 py-1.5 hover:shadow-md transition-shadow"
        >
          <Menu className="w-4 h-4 text-[#222222]" />
          <div className="w-7 h-7 rounded-full bg-[#717171] flex items-center justify-center">
            <span className="text-white text-[11px] font-semibold">{currentConfig.symbol}</span>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-[#EBEBEB] overflow-hidden z-50"
            >
              <div className="py-1">
                {(['EUR', 'USD', 'MAD'] as Currency[]).map((curr) => {
                  const config = currencyConfig[curr]
                  const isSelected = currency === curr
                  return (
                    <button
                      key={curr}
                      onClick={() => handleCurrencyChange(curr)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                        isSelected
                          ? 'bg-[#F7F7F7] text-[#222222] font-semibold'
                          : 'text-[#717171] hover:bg-[#F7F7F7]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="text-left">
                          <p className="font-medium">{config.symbol} {curr}</p>
                          <p className={`text-xs ${isSelected ? 'text-[#222222]' : 'text-[#717171]'}`}>
                            {config.name}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#222222]" />}
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

  return (
    <>
      {/* Desktop: Horizontal toggle buttons */}
      <div className={`hidden md:flex items-center bg-neutral-100 rounded-full p-1 ${className}`}>
        {(['USD', 'EUR', 'MAD'] as Currency[]).map((curr) => {
          const config = currencyConfig[curr]
          const isSelected = currency === curr
          return (
            <button
              key={curr}
              onClick={() => handleCurrencyChange(curr)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-[#FF5A00] text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className="text-xs">{config.symbol}</span>
              <span>{curr}</span>
            </button>
          )
        })}
      </div>

      {/* Mobile: Dropdown */}
      <div className={`relative md:hidden ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors text-sm font-medium text-neutral-700"
        >
          <span>{currentConfig.symbol}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50"
            >
              <div className="py-1">
                {(['EUR', 'USD', 'MAD'] as Currency[]).map((curr) => {
                  const config = currencyConfig[curr]
                  const isSelected = currency === curr
                  return (
                    <button
                      key={curr}
                      onClick={() => handleCurrencyChange(curr)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                        isSelected
                          ? 'bg-orange-50 text-[#FF5A00]'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="text-left">
                          <p className="font-medium">{config.symbol} {curr}</p>
                          <p className={`text-xs ${isSelected ? 'text-[#FF5A00]' : 'text-neutral-400'}`}>
                            {config.name}
                          </p>
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
    </>
  )
}

// Hook to use currency in other components
export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>('EUR')

  useEffect(() => {
    // Load saved preference
    const savedCurrency = localStorage.getItem('preferredCurrency') as Currency
    if (savedCurrency && ['EUR', 'USD', 'MAD'].includes(savedCurrency)) {
      setCurrency(savedCurrency)
    }

    // Listen for currency changes
    const handleCurrencyChange = (e: CustomEvent<Currency>) => {
      setCurrency(e.detail)
    }

    window.addEventListener('currencyChange', handleCurrencyChange as EventListener)
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange as EventListener)
    }
  }, [])

  // Convert price FROM EUR to selected currency
  const convertPrice = (priceInEUR: number): number => {
    return priceInEUR * EXCHANGE_RATES[currency]
  }

  // Format price with exactly 2 decimal places (0 for MAD)
  const formatPrice = (priceInEUR: number): string => {
    const converted = convertPrice(priceInEUR)

    if (currency === 'MAD') {
      return `${Math.round(converted)} DH`
    }

    const formatted = converted.toFixed(2)

    if (currency === 'EUR') {
      return `€${formatted}`
    } else {
      return `$${formatted}`
    }
  }

  return { currency, convertPrice, formatPrice }
}
