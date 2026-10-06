'use client'

import { useEffect, useMemo, useReducer, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShieldCheck, Check, Star } from 'lucide-react'
import { Footer } from '@/components/footer'
import { BookingSuccess } from '@/components/booking-success'
import { useCurrency } from '@/components/currency-switcher'
import type {
  ActivityDoc,
  BookingDraft,
  PackageDoc,
  RoomDoc,
  WizardStepId,
} from './lib/types'
import type { TransferRoute } from '@/lib/transferRoutes'
import { computeTotals, getPackageRules, isDormSlug, roomsForPackage, uid } from './lib/pricing'
import { StepDates } from './steps/StepDates'
import { StepRooms } from './steps/StepRooms'
import { StepSurf } from './steps/StepSurf'
import { StepExtras } from './steps/StepExtras'
import { StepReview } from './steps/StepReview'

function firstImageUrl(
  images?: Array<{ image?: { url?: string } | string; alt?: string }>,
): string | undefined {
  if (!images?.length) return undefined
  const first = images[0]?.image
  if (!first || typeof first === 'string') return undefined
  return first.url
}

type PrimaryItem = {
  imageUrl?: string
  title: string
  subtitle?: string
  priceLabel?: string
  rating?: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

type Props = {
  lang: 'en' | 'fr'
  rooms: RoomDoc[]
  packages: PackageDoc[]
  activities: ActivityDoc[]
  transferRoutes: TransferRoute[]
  googleAdsConversionId?: string
  googleAdsConversionLabel?: string
}

function initialDraft(
  searchType: string,
  searchSlug: string,
  rooms: RoomDoc[],
  packages: PackageDoc[],
  activities: ActivityDoc[],
  transferRoutes: TransferRoute[],
  searchRoute: string,
): BookingDraft {
  const base: BookingDraft = {
    mode: 'stay',
    rooms: [],
    surf: [],
    airportTransfer: false,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  }

  if (searchType === 'surf') {
    const act = activities.find((a) => a.slug === searchSlug) ?? activities[0]
    if (act) {
      base.mode = 'surf-only'
      base.surf = [{ id: uid(), activitySlug: act.slug, participants: 1 }]
    }
    return base
  }

  if (searchType === 'transfer') {
    const firstRouteId = transferRoutes[0]?.id
    const routeId = searchRoute || searchSlug || firstRouteId
    base.airportTransfer = true
    base.transfer = { routeId }
    return base
  }

  if (searchType === 'package') {
    const pkg = packages.find((p) => p.slug === searchSlug)
    base.packageSlug = pkg?.slug
    const eligibleRooms = roomsForPackage(pkg, rooms)
    const firstRoom = eligibleRooms[0] ?? rooms[0]
    if (firstRoom) {
      base.rooms = [
        {
          id: uid(),
          roomSlug: firstRoom.slug,
          guests: 1,
          breakfast: false,
        },
      ]
    }
    return base
  }

  // Default: room booking
  const room = rooms.find((r) => r.slug === searchSlug) ?? rooms[0]
  if (room) {
    base.rooms = [
      {
        id: uid(),
        roomSlug: room.slug,
        guests: 1,
        breakfast: false,
      },
    ]
  }
  return base
}

function draftReducer(state: BookingDraft, patch: Partial<BookingDraft>): BookingDraft {
  return { ...state, ...patch }
}

const ORDER: WizardStepId[] = ['plan', 'addons', 'review']

const LABELS: Record<WizardStepId, string> = {
  plan: 'Plan your stay',
  addons: 'Add-ons',
  review: 'Review & book',
}

const LABELS_SHORT: Record<WizardStepId, string> = {
  plan: 'Plan',
  addons: 'Extras',
  review: 'Review',
}

export default function BookingClient({ lang, rooms, packages, activities, transferRoutes, googleAdsConversionId, googleAdsConversionLabel }: Props) {
  const searchParams = useSearchParams()
  const { formatPrice } = useCurrency()
  const type = searchParams.get('type') || 'room'
  const slug = searchParams.get('slug') || rooms[0]?.slug || ''
  const routeParam = searchParams.get('route') || ''

  const [draft, update] = useReducer(
    draftReducer,
    { type, slug, rooms, packages, activities, transferRoutes, routeParam },
    ({ type, slug, rooms, packages, activities, transferRoutes, routeParam }) =>
      initialDraft(type, slug, rooms, packages, activities, transferRoutes, routeParam),
  )

  const pkg = useMemo(
    () => (draft.packageSlug ? packages.find((p) => p.slug === draft.packageSlug) : undefined),
    [draft.packageSlug, packages],
  )

  const [stepIndex, setStepIndex] = useState(() => (type === 'transfer' ? 1 : 0))
  const currentStep = ORDER[stepIndex]

  // Scroll to top when step changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [stepIndex])

  // Primary item = what the user came in with from the URL
  const primary: PrimaryItem | null = useMemo(() => {
    if (type === 'surf') {
      const act = activities.find((a) => a.slug === slug)
      if (!act) return null
      return {
        imageUrl: firstImageUrl(act.images),
        title: act.title,
        subtitle: [act.groupSize, act.duration].filter(Boolean).join(' · '),
        priceLabel: `${formatPrice(act.price)} ${act.priceUnit || ''}`.trim(),
      }
    }
    if (type === 'package') {
      const p = packages.find((pk) => pk.slug === slug)
      if (!p) return null
      return {
        imageUrl: firstImageUrl(p.images),
        title: p.title,
        subtitle: p.duration,
        priceLabel: `${formatPrice(p.price)} ${p.priceUnit || ''}`.trim(),
      }
    }
    if (type === 'transfer') {
      const routeId = routeParam || slug || transferRoutes[0]?.id
      const route = transferRoutes.find((r) => r.id === routeId)
      if (!route) return null
      return {
        title: route.label,
        priceLabel: formatPrice(route.priceEur),
        subtitle: 'Private transfer',
      }
    }
    const room = rooms.find((r) => r.slug === slug)
    if (!room) return null
    return {
      imageUrl: firstImageUrl(room.images),
      title: room.name,
      subtitle: room.detail,
      priceLabel: `${formatPrice(room.price)}${isDormSlug(room.slug) ? ' / bed' : ''} / night`,
      rating: room.rating,
    }
  }, [type, slug, routeParam, rooms, packages, activities, transferRoutes, formatPrice])

  const lockedPrimaryRoom = type === 'room'
  const lockedPrimarySurf = type === 'surf'

  const packageRooms = useMemo(() => {
    return roomsForPackage(pkg, rooms)
  }, [pkg, rooms])

  const packageContext = useMemo(() => {
    if (!pkg) return undefined
    const rules = getPackageRules(pkg)
    return {
      pkg,
      includesBreakfast: rules.includesBreakfast,
      includedGroupSurfLessons: rules.includedGroupSurfLessons,
      includedPrivateSurfLessons: rules.includedPrivateSurfLessons,
      fixedNights: rules.durationNights,
      pricingBasis: rules.pricingBasis,
      includedRoomMaxGuests: rules.includedRoomMaxGuests,
    }
  }, [pkg])

  const totals = useMemo(
    () => computeTotals(draft, rooms, activities, pkg, transferRoutes),
    [draft, rooms, activities, pkg, transferRoutes],
  )

  const canAdvance = useMemo(() => {
    switch (currentStep) {
      case 'plan': {
        if (draft.mode === 'surf-only') {
          return (
            !!draft.surf[0]?.date &&
            draft.surf.length > 0 &&
            draft.surf.every((s) => s.participants > 0)
          )
        }
        return (
          !!draft.checkIn &&
          !!draft.checkOut &&
          totals.nights > 0 &&
          draft.rooms.length > 0 &&
          draft.rooms.every((r) => r.guests > 0)
        )
      }
      case 'addons':
        return true
      case 'review':
        return (
          !!draft.firstName.trim() &&
          !!draft.email.trim() &&
          !!draft.phone.trim() &&
          /.+@.+\..+/.test(draft.email)
        )
      default:
        return true
    }
  }, [currentStep, draft, totals.nights])

  const next = () => setStepIndex((i) => Math.min(ORDER.length - 1, i + 1))
  const back = () => setStepIndex((i) => Math.max(0, i - 1))

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [result, setResult] = useState<{
    bookingId: string
    customerEmail: string
    customerName: string
    flightTitle: string
    bookingDate: string
    adults: number
    totalPrice: number
    bookingDetails: string
    specialRequests: string
  } | null>(null)

  const handleSubmit = async () => {
    if (!canAdvance) return
    setSubmitting(true)
    setSubmitError('')

    const firstRoomDoc = draft.rooms[0]
      ? rooms.find((r) => r.slug === draft.rooms[0].roomSlug)
      : undefined
    const firstSurfDoc = draft.surf[0]
      ? activities.find((a) => a.slug === draft.surf[0].activitySlug)
      : undefined

    const flightTitle = pkg?.title ?? firstRoomDoc?.name ?? firstSurfDoc?.title ?? 'Booking'
    const flightType: string = (() => {
      if (pkg) return 'package'
      if (draft.mode === 'surf-only') {
        return firstSurfDoc?.activityType === 'rental' ? 'rental' : 'surf-lesson'
      }
      return 'room'
    })()

    const date =
      draft.mode === 'surf-only'
        ? draft.surf[0]?.date
        : draft.checkIn

    const customerName = `${draft.firstName.trim()} ${draft.lastName.trim()}`.trim()
    const totalGuests = totals.totalGuests || draft.surf.reduce((s, l) => s + l.participants, 0) || 1

    // Build human-readable breakdown — one item per line, no bullets
    const breakdownLines: string[] = []
    if (draft.mode === 'stay' && draft.checkIn && draft.checkOut) {
      breakdownLines.push(`Stay: ${draft.checkIn} → ${draft.checkOut} (${totals.nights} night${totals.nights > 1 ? 's' : ''})`)
    }
    if (totals.packageLine) {
      breakdownLines.push(
        `${totals.packageLine.label} — €${totals.packageLine.unitPrice.toFixed(2)}` +
          (totals.packageLine.pricingBasis === 'per-person'
            ? ` × ${totals.packageLine.quantity} guest(s)`
            : '') +
          ` = €${totals.packageLine.lineTotal.toFixed(2)}`,
      )
      const includedItems = [
        totals.packageLine.includesBreakfast ? 'breakfast' : '',
        totals.packageLine.includedGroupSurfLessons > 0
          ? `${totals.packageLine.includedGroupSurfLessons} group surf lesson(s)`
          : '',
        totals.packageLine.includedPrivateSurfLessons > 0
          ? `${totals.packageLine.includedPrivateSurfLessons} private surf lesson(s)`
          : '',
      ].filter(Boolean)
      if (includedItems.length > 0) {
        breakdownLines.push(`Package includes: ${includedItems.join(', ')}`)
      }
    }
    totals.roomLines.forEach((l) => {
      breakdownLines.push(
        `${l.label} — ${l.isDorm ? `${l.guests} bed(s)` : `${l.guests} guest(s)`} × ${l.nights}n = ${l.included ? 'Included' : `€${Number(l.roomSubtotal).toFixed(2)}`}` +
          (l.breakfast ? ` + breakfast €${Number(l.breakfastSubtotal).toFixed(2)}` : ''),
      )
    })
    totals.surfLines.forEach((l) => {
      breakdownLines.push(`${l.label}${l.perPerson ? ` × ${l.participants}` : ''} = €${Number(l.lineTotal).toFixed(2)}`)
    })
    if (totals.transferLine) {
      const tr = draft.transfer ?? {}
      breakdownLines.push(`Transfer: ${totals.transferLine.label} = €${Number(totals.transferLine.lineTotal).toFixed(2)}`)
      if (tr.pickupTime) breakdownLines.push(`Pickup time: ${tr.pickupTime}`)
    } else if (draft.airportTransfer) {
      breakdownLines.push('Airport transfer: contact customer')
    }
    const bookingDetails = breakdownLines.join('\n')
    const userSpecialRequests = draft.specialRequests.trim()
    const pickupLocation = draft.transfer?.pickupAddress?.trim() ?? ''

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail: draft.email.trim(),
          customerPhone: draft.phone.trim(),
          flightTitle,
          flightType,
          packageId: pkg?.id,
          date,
          numberOfAdults: totalGuests,
          numberOfChildren: 0,
          totalPrice: totals.grandTotal,
          specialRequests: userSpecialRequests,
          bookingDetails,
          pickupLocation,
          // Structured payload for future use
          bookingDraft: {
            mode: draft.mode,
            checkIn: draft.checkIn,
            checkOut: draft.checkOut,
            nights: totals.nights,
            rooms: draft.rooms,
            surf: draft.surf,
            airportTransfer: draft.airportTransfer,
            transfer: totals.transferLine
              ? {
                  routeId: totals.transferLine.routeId,
                  label: totals.transferLine.label,
                  priceEur: totals.transferLine.lineTotal,
                  pickupTime: draft.transfer?.pickupTime ?? null,
                  pickupAddress: draft.transfer?.pickupAddress ?? null,
                }
              : null,
            packageSlug: draft.packageSlug ?? null,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create booking')

      setResult({
        bookingId: String(data.doc?.id ?? 'N/A'),
        customerEmail: draft.email.trim(),
        customerName,
        flightTitle,
        bookingDate: date || '',
        adults: totalGuests,
        totalPrice: totals.grandTotal,
        bookingDetails,
        specialRequests: userSpecialRequests,
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <BookingSuccess
        {...{
          bookingId: result.bookingId,
          customerEmail: result.customerEmail,
          customerName: result.customerName,
          flightTitle: result.flightTitle,
          bookingDate: result.bookingDate,
          adults: result.adults,
          children: 0,
          totalPrice: result.totalPrice,
          bookingDetails: result.bookingDetails,
          specialRequests: result.specialRequests,
          googleAdsConversionId,
          googleAdsConversionLabel,
        }}
      />
    )
  }

  if (rooms.length === 0 && activities.length === 0) {
    return (
      <main className="bg-[#FAF8F5] min-h-screen flex items-center justify-center px-6">
        <p className="text-[#717171] text-sm">
          Our booking system is warming up. Please try again in a moment or contact us on WhatsApp.
        </p>
      </main>
    )
  }

  return (
    <main className="bg-[#FAF8F5] min-h-screen [color-scheme:light]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="pt-6 sm:pt-10 pb-2">
          <h1 className="text-[22px] sm:text-3xl lg:text-[36px] text-[#222222] tracking-tight leading-tight">
            Complete Your Booking
          </h1>
          <p className="text-[#717171] text-[13px] sm:text-[15px] mt-1.5 sm:mt-2">
            Three quick steps. No card needed — we&apos;ll confirm by email.
          </p>
        </motion.div>

        {/* Stepper nav */}
        <nav className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 pt-4 sm:pt-6">
          {ORDER.map((id, i) => {
            const active = i === stepIndex
            const done = i < stepIndex
            return (
              <button
                key={id}
                type="button"
                onClick={() => i <= stepIndex && setStepIndex(i)}
                className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors min-w-0 ${
                  active
                    ? 'bg-[#1B4965] text-white'
                    : done
                    ? 'bg-[#E8F4F8] text-[#1B4965]'
                    : 'bg-white border border-[#EBEBEB] text-[#717171]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                    active ? 'bg-white text-[#1B4965]' : done ? 'bg-[#1B4965] text-white' : 'bg-[#EBEBEB] text-[#717171]'
                  }`}
                >
                  {done ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                <span className="sm:hidden truncate">{LABELS_SHORT[id]}</span>
                <span className="hidden sm:inline">{LABELS[id]}</span>
              </button>
            )
          })}
        </nav>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 pt-5 sm:pt-6 pb-24 lg:pb-16">
          {/* Summary — shows first on mobile, right sidebar on desktop */}
          <aside className="order-1 lg:order-2 lg:w-[340px] lg:flex-shrink-0">
            <div className="lg:sticky lg:top-6 bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden lg:max-h-[calc(100vh-3rem)] flex flex-col">
              {/* Primary item hero */}
              {primary && (
                <div className="relative">
                  {primary.imageUrl ? (
                    <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] bg-[#F5F5F5]">
                      <Image
                        src={primary.imageUrl}
                        alt={primary.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 340px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] sm:aspect-[16/10] bg-gradient-to-br from-[#E8F4F8] to-[#F0F8FB]" />
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold tracking-[1.5px] text-[#E07A5F]">
                          {type === 'surf' ? 'SURF' : type === 'package' ? 'PACKAGE' : type === 'transfer' ? 'TRANSFER' : 'ROOM'}
                        </p>
                        <p className="text-[17px] font-semibold text-[#222222] truncate">
                          {primary.title}
                        </p>
                        {primary.subtitle && (
                          <p className="text-xs text-[#717171] mt-0.5 truncate">{primary.subtitle}</p>
                        )}
                        {primary.priceLabel && (
                          <p className="text-sm font-semibold text-[#E07A5F] mt-1">{primary.priceLabel}</p>
                        )}
                      </div>
                      {primary.rating && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                          <span className="text-xs font-semibold text-[#222222]">{primary.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Dates summary */}
              <div className="px-4 pb-3 flex items-center justify-between text-xs">
                <span className="text-[#717171]">
                  {draft.mode === 'stay' && draft.checkIn && draft.checkOut ? (
                    <>
                      {new Date(draft.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →{' '}
                      {new Date(draft.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {totals.nights}n
                    </>
                  ) : draft.mode === 'surf-only' && draft.surf[0]?.date ? (
                    new Date(draft.surf[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  ) : (
                    'Pick your dates'
                  )}
                </span>
                <span className="text-[#717171]">Step {stepIndex + 1}/3</span>
              </div>

              {/* Line items */}
              <div className="lg:flex-1 overflow-y-auto px-4 py-3 border-t border-[#EBEBEB]">
                <p className="text-[10px] font-bold tracking-[1.5px] text-[#717171] mb-2">BREAKDOWN</p>
                <div className="flex flex-col gap-1.5 text-[13px]">
                  {totals.packageLine && (
                    <div className="flex justify-between gap-2">
                      <span className="text-[#222222] truncate">
                        {totals.packageLine.label}
                        {totals.packageLine.pricingBasis === 'per-person' && (
                          <span className="text-[#717171] text-xs"> · {totals.packageLine.quantity}p</span>
                        )}
                      </span>
                      <span className="text-[#222222] whitespace-nowrap">{formatPrice(totals.packageLine.lineTotal)}</span>
                    </div>
                  )}
                  {totals.roomLines.map((l, i) => (
                    <div key={`r${i}`} className="flex justify-between gap-2">
                      <span className="text-[#222222] truncate">
                        {l.included || (i === 0 && lockedPrimaryRoom) ? l.label : `+ ${l.label}`}
                        <span className="text-[#717171] text-xs"> · {l.isDorm ? `${l.guests}×bed` : `${l.guests}p`}</span>
                      </span>
                      <span className={`whitespace-nowrap ${l.included ? 'text-[#3A8FB7] text-xs font-medium' : 'text-[#222222]'}`}>
                        {l.included ? 'Included' : formatPrice(l.lineTotal)}
                      </span>
                    </div>
                  ))}
                  {totals.surfLines.map((l, i) => (
                    <div key={`s${i}`} className="flex justify-between gap-2">
                      <span className="text-[#222222] truncate">
                        {type === 'surf' && i === 0 ? l.label : l.included ? l.label : `+ ${l.label}`}
                        {l.perPerson && !l.included && (
                          <span className="text-[#717171] text-xs"> · {l.participants}p</span>
                        )}
                      </span>
                      <span
                        className={`whitespace-nowrap ${l.included ? 'text-[#3A8FB7] text-xs font-medium' : 'text-[#222222]'}`}
                      >
                        {l.included ? 'Included' : formatPrice(l.lineTotal)}
                      </span>
                    </div>
                  ))}
                  {totals.transferLine && (
                    <div className="flex justify-between gap-2">
                      <span className="text-[#222222] truncate">
                        + {totals.transferLine.label}
                      </span>
                      <span className="text-[#222222] whitespace-nowrap">
                        {formatPrice(totals.transferLine.lineTotal)}
                      </span>
                    </div>
                  )}
                  {!totals.packageLine && totals.roomLines.length === 0 && totals.surfLines.length === 0 && (
                    <p className="text-[#AAAAAA] text-xs">Pick dates &amp; guests to see pricing.</p>
                  )}
                </div>
              </div>

              <div className="px-4 py-4 border-t border-[#EBEBEB] bg-[#FAFAFA]">
                <div className="flex justify-between text-[15px] font-semibold text-[#222222]">
                  <span>Total</span>
                  <span>{formatPrice(totals.grandTotal)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-[#717171]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3A8FB7]" />
                  No payment needed now.
                </div>
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="order-2 lg:order-1 flex-1 min-w-0">
            <motion.div
              key={currentStep}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col gap-5 sm:gap-6"
            >
              {currentStep === 'plan' && (
                <>
                  <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#EBEBEB]">
                    <StepDates draft={draft} update={update} fixedNights={packageContext?.fixedNights} />
                  </div>
                  {draft.mode === 'stay' && (
                    <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#EBEBEB]">
                      <StepRooms
                        draft={draft}
                        update={update}
                        rooms={packageRooms}
                        lockedPrimary={lockedPrimaryRoom}
                        packageContext={packageContext}
                      />
                    </div>
                  )}
                  {draft.mode === 'surf-only' && (
                    <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#EBEBEB]">
                      <StepSurf
                        draft={draft}
                        update={update}
                        activities={activities}
                        lockedPrimary={lockedPrimarySurf}
                        packageContext={packageContext}
                      />
                    </div>
                  )}
                </>
              )}
              {currentStep === 'addons' && (
                <>
                  {draft.mode === 'stay' && (
                    <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#EBEBEB]">
                      <StepSurf
                        draft={draft}
                        update={update}
                        activities={activities}
                        lockedPrimary={lockedPrimarySurf}
                        packageContext={packageContext}
                      />
                    </div>
                  )}
                  <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#EBEBEB]">
                    <StepExtras draft={draft} update={update} lang={lang} routes={transferRoutes} />
                  </div>
                </>
              )}
              {currentStep === 'review' && (
                <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#EBEBEB]">
                  <StepReview
                    draft={draft}
                    update={update}
                    rooms={rooms}
                    activities={activities}
                    pkg={pkg}
                    transferRoutes={transferRoutes}
                  />
                </div>
              )}
            </motion.div>

            {submitError && (
              <p className="mt-4 text-sm text-[#C05A40] bg-[#FFF5F2] border border-[#F0C9BD] rounded-lg p-3">
                {submitError}
              </p>
            )}

            {/* Desktop action bar (inline) */}
            <div className="hidden sm:flex items-center justify-between mt-6 gap-3">
              <button
                type="button"
                onClick={back}
                disabled={stepIndex === 0}
                className="h-[52px] px-5 rounded-xl border border-[#DDDDDD] bg-white text-sm font-semibold text-[#222222] hover:bg-[#FAFAFA] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              {currentStep === 'review' ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canAdvance || submitting}
                  className="h-[52px] px-6 rounded-xl bg-[#E07A5F] text-white text-sm font-semibold hover:bg-[#D06A4F] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {submitting ? 'Submitting…' : `Confirm booking · ${formatPrice(totals.grandTotal)}`}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canAdvance}
                  className="h-[52px] px-6 rounded-xl bg-[#1B4965] text-white text-sm font-semibold hover:bg-[#143A52] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="sm:hidden sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-[#EBEBEB] px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={back}
          disabled={stepIndex === 0}
          className="h-[48px] w-[48px] flex-shrink-0 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#717171]">Total</p>
          <p className="text-sm font-semibold text-[#222222] truncate">{formatPrice(totals.grandTotal)}</p>
        </div>
        {currentStep === 'review' ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canAdvance || submitting}
            className="h-[48px] px-5 rounded-xl bg-[#E07A5F] text-white text-sm font-semibold hover:bg-[#D06A4F] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {submitting ? 'Sending…' : 'Confirm'}
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance}
            className="h-[48px] px-5 rounded-xl bg-[#1B4965] text-white text-sm font-semibold hover:bg-[#143A52] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <Footer />
    </main>
  )
}
