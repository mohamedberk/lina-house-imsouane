'use client'

import { useCurrency } from '@/components/currency-switcher'

interface PriceDisplayProps {
  price: number
  className?: string
}

export function PriceDisplay({ price, className = '' }: PriceDisplayProps) {
  const { formatPrice } = useCurrency()
  return <span className={className}>{formatPrice(price)}</span>
}

// For inline price display (just the formatted string)
export function useFormattedPrice() {
  const { formatPrice, currency } = useCurrency()
  return { formatPrice, currency }
}
