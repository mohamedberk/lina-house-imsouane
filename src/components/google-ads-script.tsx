'use client'

import Script from 'next/script'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export default function GoogleAdsScript({
  googleAdsId,
}: {
  googleAdsId: string | null | undefined
}) {
  if (!googleAdsId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAdsId}');
        `}
      </Script>
    </>
  )
}

export function trackGoogleAdsConversion({
  conversionId,
  conversionLabel,
  value,
  currency = 'EUR',
  transactionId,
}: {
  conversionId?: string | null
  conversionLabel?: string | null
  value?: number
  currency?: string
  transactionId?: string
}): void {
  if (typeof window === 'undefined' || !window.gtag) return
  if (!conversionId || !conversionLabel) return

  window.gtag('event', 'conversion', {
    send_to: `${conversionId}/${conversionLabel}`,
    value,
    currency,
    transaction_id: transactionId,
  })
}
