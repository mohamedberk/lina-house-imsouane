'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Mail, Phone, Calendar, Users, ListChecks, MessageSquare } from 'lucide-react'
import { useCurrency } from '@/components/currency-switcher'
import { shortBookingRef } from '@/lib/booking-reference'
import { trackGoogleAdsConversion } from './google-ads-script'

interface BookingSuccessProps {
  bookingId: string
  customerEmail: string
  customerName: string
  flightTitle: string
  bookingDate: string
  adults: number
  children: number
  totalPrice: number
  bookingDetails?: string
  specialRequests?: string
  googleAdsConversionId?: string | null
  googleAdsConversionLabel?: string | null
}

export function BookingSuccess({
  bookingId,
  customerEmail,
  customerName,
  flightTitle,
  bookingDate,
  adults,
  children,
  totalPrice,
  bookingDetails,
  specialRequests,
  googleAdsConversionId,
  googleAdsConversionLabel,
}: BookingSuccessProps) {
  const router = useRouter()
  const { formatPrice } = useCurrency()

  // Prevent user from going back to the form
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    trackGoogleAdsConversion({
      conversionId: googleAdsConversionId ?? undefined,
      conversionLabel: googleAdsConversionLabel ?? undefined,
      value: totalPrice,
      currency: 'EUR',
      transactionId: bookingId,
    })
  }, [])

  const formattedDate = new Date(bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const reference = shortBookingRef(bookingId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative bg-green-500 rounded-full p-4 sm:p-6">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-3 sm:mb-4">
            Booking confirmed!
          </h1>
          <p className="text-base sm:text-xl text-neutral-600">
            Thank you, {customerName.split(' ')[0]}! Your booking at Lina House is confirmed!
          </p>
        </div>

        {/* Booking ID Card */}
        <div className="bg-white border-2 border-green-500 rounded-2xl p-4 sm:p-6 mb-6 shadow-lg">
          <div className="text-center mb-3 sm:mb-4">
            <p className="text-sm text-neutral-600 mb-2">Your booking reference</p>
            <div className="inline-block bg-green-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg max-w-full">
              <p className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-green-700 tracking-wider break-all">
                {reference}
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 text-center">
            Save this reference number. You'll need it to manage your booking.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6 mb-6 space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Booking details</h2>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-[#1B4965]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-600">Booking</p>
              <p className="font-semibold text-neutral-900">{flightTitle}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#1B4965]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-600">Date</p>
              <p className="font-semibold text-neutral-900">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-[#1B4965]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-600">Guests</p>
              <p className="font-semibold text-neutral-900">
                {adults} {adults === 1 ? 'adult' : 'adults'}
                {children > 0 && `, ${children} ${children === 1 ? 'child' : 'children'}`}
              </p>
            </div>
          </div>

          {bookingDetails && bookingDetails.trim().length > 0 && (
            <div className="pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="w-4 h-4 text-[#1B4965]" />
                <p className="text-sm font-semibold text-neutral-900">Your selection</p>
              </div>
              <ul className="divide-y divide-neutral-100 border-l-4 border-[#1B4965] bg-[#FAFBFC] rounded-r-md">
                {bookingDetails
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line, i) => {
                    const match = line.match(/^(.*?)(=\s*€\s*[\d.,]+(?:\s*\+\s*breakfast\s*€\s*[\d.,]+)?)\s*$/)
                    if (match) {
                      return (
                        <li key={i} className="px-4 py-2.5 text-sm text-neutral-800 flex justify-between gap-3">
                          <span className="flex-1">{match[1].replace(/[—-]\s*$/, '').trim()}</span>
                          <span className="font-semibold text-neutral-900 whitespace-nowrap">
                            {match[2].replace(/^=\s*/, '')}
                          </span>
                        </li>
                      )
                    }
                    return (
                      <li key={i} className="px-4 py-2.5 text-sm text-neutral-700">
                        {line}
                      </li>
                    )
                  })}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-neutral-200">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Total amount</span>
              <span className="text-2xl font-bold text-neutral-900">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Special requests — actual customer note */}
        {specialRequests && specialRequests.trim().length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#E07A5F]" />
              Special requests
            </h2>
            <div className="border-l-4 border-[#E07A5F] bg-[#FFF7F4] rounded-r-md px-4 py-3 text-sm text-neutral-800 whitespace-pre-wrap">
              {specialRequests}
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            What happens next?
          </h3>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>We'll send a confirmation email to <strong>{customerEmail}</strong> within 24 hours</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>You'll receive payment instructions and pickup details</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Free cancellation up to 48 hours before check-in</span>
            </li>
          </ul>
        </div>

        {/* Contact Card */}
        <div className="bg-neutral-900 rounded-2xl p-6 text-white mb-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Questions about your booking?
          </h3>
          <p className="text-neutral-300 text-sm mb-4">
            Our team is available 24/7 to help you with any questions.
          </p>
          <a
            href="https://wa.me/212772228120"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp us now
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex-1 px-6 py-4 bg-[#E07A5F] text-white font-semibold rounded-lg hover:bg-[#D06A4F] transition-colors text-center"
          >
            Back to home
          </button>
          <button
            onClick={() => router.push('/rooms')}
            className="flex-1 px-6 py-4 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:border-neutral-400 hover:bg-neutral-50 transition-colors text-center"
          >
            Explore Rooms
          </button>
        </div>
      </div>
    </div>
  )
}
