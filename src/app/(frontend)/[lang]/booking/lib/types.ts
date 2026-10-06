export type BookingMode = 'stay' | 'surf-only'

export type RoomDoc = {
  id: string
  name: string
  slug: string
  detail?: string
  price: number
  priceBreakfast?: number | null
  guests: number
  rating?: string
  images?: Array<{ image?: { url?: string } | string; alt?: string }>
}

export type PackageDoc = {
  id: string
  title: string
  slug: string
  price: number
  priceUnit?: string
  duration?: string
  pricingBasis?: 'per-person' | 'fixed'
  durationNights?: number | null
  includedRoomMaxGuests?: number | null
  includesBreakfast?: boolean | null
  includedGroupSurfLessons?: number | null
  includedPrivateSurfLessons?: number | null
  includes?: Array<{ item?: string | null }>
  linkedRooms?: Array<string | { id: string; slug?: string }>
  images?: Array<{ image?: { url?: string } | string; alt?: string }>
}

export type ActivityDoc = {
  id: string
  title: string
  slug: string
  price: number
  priceUnit?: string
  activityType?: 'lesson' | 'rental'
  groupSize?: string
  duration?: string
  images?: Array<{ image?: { url?: string } | string; alt?: string }>
}

export type PackageBookingContext = {
  pkg: PackageDoc
  includesBreakfast: boolean
  includedGroupSurfLessons: number
  includedPrivateSurfLessons: number
  fixedNights: number
  pricingBasis: 'per-person' | 'fixed'
  includedRoomMaxGuests: number
}

export type RoomLine = {
  id: string
  roomSlug: string
  guests: number
  breakfast: boolean
}

export type SurfLine = {
  id: string
  activitySlug: string
  participants: number
  date?: string
}

export type TransferDetails = {
  routeId?: string
  pickupTime?: string // ISO datetime-local string
  pickupAddress?: string
}

export type BookingDraft = {
  mode: BookingMode
  checkIn?: string
  checkOut?: string
  rooms: RoomLine[]
  surf: SurfLine[]
  airportTransfer: boolean
  transfer?: TransferDetails
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests: string
  packageSlug?: string
}

export type WizardStepId = 'plan' | 'addons' | 'review'
