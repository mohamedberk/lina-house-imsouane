import { getTransferRoute, type TransferRoute } from '@/lib/transferRoutes'
import type {
  ActivityDoc,
  BookingDraft,
  PackageDoc,
  RoomDoc,
  RoomLine,
  SurfLine,
} from './types'

export const isDormSlug = (slug: string) => slug.includes('dorm')

export type PackageRules = {
  pricingBasis: 'per-person' | 'fixed'
  durationNights: number
  includedRoomMaxGuests: number
  includesBreakfast: boolean
  includedGroupSurfLessons: number
  includedPrivateSurfLessons: number
}

const packageIncludesText = (pkg: PackageDoc): string =>
  (pkg.includes ?? []).map((entry) => entry.item ?? '').join(' ').toLowerCase()

export function roomsForPackage(pkg: PackageDoc | undefined, rooms: RoomDoc[]): RoomDoc[] {
  if (!pkg) return rooms
  const linkedRoomKeys = new Set(
    (pkg.linkedRooms ?? []).flatMap((room) =>
      typeof room === 'string' ? [room] : [room.id, room.slug].filter(Boolean) as string[],
    ),
  )
  if (linkedRoomKeys.size > 0) {
    const linked = rooms.filter(
      (room) => linkedRoomKeys.has(room.id) || linkedRoomKeys.has(room.slug),
    )
    if (linked.length > 0) return linked
  }
  return rooms
}

const firstCountBefore = (text: string, pattern: string): number => {
  const match = text.match(new RegExp(`(\\d+)\\s+${pattern}`))
  return match ? Number(match[1]) : 0
}

/**
 * New CMS fields are authoritative. The text inference keeps existing package
 * records correct until an editor saves them with the new booking fields.
 */
export function getPackageRules(pkg: PackageDoc): PackageRules {
  const includesText = packageIncludesText(pkg)
  const durationMatch = pkg.duration?.match(/(\d+)\s*nights?/i)
  const genericSurfLessons = firstCountBefore(includesText, 'surf lessons?')

  return {
    pricingBasis:
      pkg.pricingBasis ??
      ((pkg.priceUnit ?? '').toLowerCase().includes('person') ? 'per-person' : 'fixed'),
    durationNights: Math.max(1, pkg.durationNights ?? Number(durationMatch?.[1] ?? 1)),
    includedRoomMaxGuests: Math.max(1, pkg.includedRoomMaxGuests ?? 1),
    includesBreakfast:
      pkg.includesBreakfast ?? includesText.includes('breakfast'),
    includedGroupSurfLessons: Math.max(
      0,
      pkg.includedGroupSurfLessons ??
        (firstCountBefore(includesText, 'group surf lessons?') || genericSurfLessons),
    ),
    includedPrivateSurfLessons: Math.max(
      0,
      pkg.includedPrivateSurfLessons ?? firstCountBefore(includesText, 'private (?:surf )?(?:session|lesson)s?'),
    ),
  }
}

export function nightsBetween(checkIn?: string, checkOut?: string): number {
  if (!checkIn || !checkOut) return 0
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function effectiveRoomPrice(
  room: RoomDoc,
  pkg?: PackageDoc,
): number {
  return isRoomIncludedInPackage(room, pkg) ? 0 : room.price
}

export function isRoomIncludedInPackage(room: RoomDoc, pkg?: PackageDoc): boolean {
  return !!pkg && room.guests <= getPackageRules(pkg).includedRoomMaxGuests
}

export type RoomBreakdown = {
  label: string
  unitPrice: number
  nights: number
  guests: number
  isDorm: boolean
  roomSubtotal: number
  breakfast: boolean
  breakfastUnit: number
  breakfastSubtotal: number
  lineTotal: number
  included: boolean
}

export function computeRoomLine(
  line: RoomLine,
  rooms: RoomDoc[],
  nights: number,
  pkg?: PackageDoc,
): RoomBreakdown | null {
  const room = rooms.find((r) => r.slug === line.roomSlug)
  if (!room) return null
  const nightsSafe = Math.max(1, nights)
  const isDorm = isDormSlug(room.slug)
  const unitPrice = effectiveRoomPrice(room, pkg)
  const included = isRoomIncludedInPackage(room, pkg)
  const roomSubtotal = isDorm
    ? unitPrice * nightsSafe * Math.max(1, line.guests)
    : unitPrice * nightsSafe
  const breakfastUnit = room.priceBreakfast ?? 0
  const breakfastSubtotal = line.breakfast && breakfastUnit
    ? breakfastUnit * nightsSafe * Math.max(1, line.guests)
    : 0
  return {
    label: room.name,
    unitPrice,
    nights: nightsSafe,
    guests: line.guests,
    isDorm,
    roomSubtotal,
    breakfast: line.breakfast,
    breakfastUnit,
    breakfastSubtotal,
    lineTotal: roomSubtotal + breakfastSubtotal,
    included,
  }
}

export type SurfBreakdown = {
  label: string
  unitPrice: number
  participants: number
  perPerson: boolean
  lineTotal: number
  included: boolean
}

export function computeSurfLine(
  line: SurfLine,
  activities: ActivityDoc[],
  opts: { included?: boolean } = {},
): SurfBreakdown | null {
  const act = activities.find((a) => a.slug === line.activitySlug)
  if (!act) return null
  const perPerson = (act.priceUnit || '').toLowerCase().includes('person')
  const participants = Math.max(1, line.participants)
  const included = !!opts.included
  const lineTotal = included ? 0 : perPerson ? act.price * participants : act.price
  return {
    label: act.title,
    unitPrice: act.price,
    participants,
    perPerson,
    lineTotal,
    included,
  }
}

export type TransferBreakdown = {
  routeId: string
  label: string
  lineTotal: number
}

export type DraftTotals = {
  nights: number
  packageLine: PackageBreakdown | null
  roomLines: RoomBreakdown[]
  surfLines: SurfBreakdown[]
  transferLine: TransferBreakdown | null
  grandTotal: number
  totalGuests: number
}

export type PackageBreakdown = {
  label: string
  unitPrice: number
  quantity: number
  pricingBasis: 'per-person' | 'fixed'
  lineTotal: number
  includedGroupSurfLessons: number
  includedPrivateSurfLessons: number
  includesBreakfast: boolean
}

export function computeTransferLine(
  draft: BookingDraft,
  routes: TransferRoute[],
): TransferBreakdown | null {
  if (!draft.airportTransfer) return null
  const route = getTransferRoute(draft.transfer?.routeId, routes)
  if (!route) return null
  return { routeId: route.id, label: route.label, lineTotal: route.priceEur }
}

export function computeTotals(
  draft: BookingDraft,
  rooms: RoomDoc[],
  activities: ActivityDoc[],
  pkg?: PackageDoc,
  transferRoutes: TransferRoute[] = [],
): DraftTotals {
  const nights = nightsBetween(draft.checkIn, draft.checkOut)
  const roomLines = draft.rooms
    .map((l) => computeRoomLine(l, rooms, nights, pkg))
    .filter((x): x is RoomBreakdown => x !== null)
  const surfLines = draft.surf
    .map((l) => computeSurfLine(l, activities))
    .filter((x): x is SurfBreakdown => x !== null)
  const transferLine = computeTransferLine(draft, transferRoutes)
  const totalGuests = draft.rooms.reduce(
    (s, l) => s + Math.max(1, l.guests),
    0,
  )
  const packageRules = pkg ? getPackageRules(pkg) : null
  const packageQuantity = packageRules?.pricingBasis === 'per-person'
    ? Math.max(1, totalGuests)
    : 1
  const packageLine: PackageBreakdown | null = pkg && packageRules
    ? {
        label: pkg.title,
        unitPrice: pkg.price,
        quantity: packageQuantity,
        pricingBasis: packageRules.pricingBasis,
        lineTotal: pkg.price * packageQuantity,
        includedGroupSurfLessons: packageRules.includedGroupSurfLessons,
        includedPrivateSurfLessons: packageRules.includedPrivateSurfLessons,
        includesBreakfast: packageRules.includesBreakfast,
      }
    : null
  const grandTotal =
    (packageLine?.lineTotal ?? 0) +
    roomLines.reduce((s, l) => s + l.lineTotal, 0) +
    surfLines.reduce((s, l) => s + l.lineTotal, 0) +
    (transferLine?.lineTotal ?? 0)
  return { nights, packageLine, roomLines, surfLines, transferLine, grandTotal, totalGuests }
}

export const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
