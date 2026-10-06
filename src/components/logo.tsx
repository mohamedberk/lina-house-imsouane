'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon'
  className?: string
  animated?: boolean
}

const LOGO_RATIO = 582 / 248

const heights = {
  sm: 44,
  md: 64,
  lg: 80,
}

export function Logo({ size = 'md', variant = 'full', className = '', animated = false }: LogoProps) {
  const height = heights[size]
  const width = variant === 'icon' ? height : Math.round(height * LOGO_RATIO)

  const LogoContent = (
    <Image
      src="/lina_house_logoo-removebg-preview.png?v=2"
      alt="Lina House"
      width={width * 2}
      height={height * 2}
      priority
      style={{
        height,
        width,
        objectFit: variant === 'icon' ? 'cover' : 'contain',
        objectPosition: 'left center',
      }}
      className={className}
    />
  )

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'inline-flex' }}
      >
        {LogoContent}
      </motion.div>
    )
  }

  return LogoContent
}

export function LogoLink({ size = 'md', variant = 'full', className = '', animated = true }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Lina House">
      <Logo size={size} variant={variant} animated={animated} />
    </Link>
  )
}

export function LogoCompact({ size = 'sm', className = '' }: Omit<LogoProps, 'variant'>) {
  return <Logo size={size} variant="icon" className={className} />
}

export default Logo
