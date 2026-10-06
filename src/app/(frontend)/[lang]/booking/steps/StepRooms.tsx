'use client'

import { BedDouble, Check, Plus, Trash2 } from 'lucide-react'
import type { BookingDraft, PackageBookingContext, RoomDoc, RoomLine } from '../lib/types'
import { effectiveRoomPrice, isDormSlug, isRoomIncludedInPackage, uid } from '../lib/pricing'
import { Stepper } from './Stepper'
import { CategorySelect, type CategoryOption } from './CategorySelect'
import { useCurrency } from '@/components/currency-switcher'

type Props = {
  draft: BookingDraft
  update: (patch: Partial<BookingDraft>) => void
  rooms: RoomDoc[]
  lockedPrimary: boolean
  packageContext?: PackageBookingContext
}

function roomImageUrl(room: RoomDoc | undefined): string | undefined {
  if (!room?.images?.length) return undefined
  const first = room.images[0]
  if (!first?.image) return undefined
  if (typeof first.image === 'string') return undefined
  return first.image.url
}

function roomToOption(
  room: RoomDoc,
  formatPrice: (n: number) => string,
  packageContext?: PackageBookingContext,
): CategoryOption {
  const price = packageContext ? effectiveRoomPrice(room, packageContext.pkg) : room.price
  const included = packageContext
    ? isRoomIncludedInPackage(room, packageContext.pkg)
    : false
  return {
    value: room.slug,
    title: room.name,
    subtitle: room.detail,
    priceLabel: included
      ? 'Included with package'
      : `${formatPrice(price)}${isDormSlug(room.slug) ? ' / bed' : ''} / night`,
    imageUrl: roomImageUrl(room),
  }
}

export function StepRooms({ draft, update, rooms, lockedPrimary, packageContext }: Props) {
  const { formatPrice } = useCurrency()
  const updateLine = (idx: number, patch: Partial<RoomLine>) => {
    const next = [...draft.rooms]
    next[idx] = { ...next[idx], ...patch }
    update({ rooms: next })
  }

  const removeLine = (idx: number) => {
    update({ rooms: draft.rooms.filter((_, i) => i !== idx) })
  }

  const addLine = () => {
    const firstRoom = rooms[0]
    if (!firstRoom) return
    const used = new Set(draft.rooms.map((l) => l.roomSlug))
    const includedRoom = packageContext
      ? rooms.find((room) => isRoomIncludedInPackage(room, packageContext.pkg))
      : undefined
    const next = includedRoom ?? rooms.find((r) => !used.has(r.slug)) ?? firstRoom
    update({
      rooms: [
        ...draft.rooms,
        { id: uid(), roomSlug: next.slug, guests: 1, breakfast: false },
      ],
    })
  }

  const options = rooms.map((r) => roomToOption(r, formatPrice, packageContext))

  const heading = packageContext
    ? `Room for ${packageContext.pkg.title}`
    : 'How many guests?'
  const subcopy = packageContext
    ? packageContext.includedRoomMaxGuests === 1
      ? 'Each 1-guest room is included. Add one room for each guest; larger rooms keep their normal nightly price.'
      : `Each room for up to ${packageContext.includedRoomMaxGuests} guests is included. Add rooms as needed; larger rooms keep their normal nightly price.`
    : "Set your guest count and breakfast. Add another room if you're traveling as a group."

  return (
    <div>
      <h2 className="text-[22px] text-[#222222] mb-1">{heading}</h2>
      <p className="text-[14px] text-[#717171] mb-5">{subcopy}</p>

      <div className="flex flex-col gap-4">
        {draft.rooms.map((line, idx) => {
          const room = rooms.find((r) => r.slug === line.roomSlug)
          const capacity = room?.guests ?? 1
          const dorm = isDormSlug(line.roomSlug)
          const breakfastAvailable = !!room?.priceBreakfast
          const isLocked = idx === 0 && lockedPrimary

          return (
            <div
              key={line.id}
              className="rounded-2xl border border-[#EBEBEB] bg-white p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                    <BedDouble className="w-5 h-5 text-[#1B4965]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-[1.5px] text-[#717171]">
                      ROOM {idx + 1}
                      {isLocked && <span className="ml-2 text-[#3A8FB7]">· YOUR PICK</span>}
                    </p>
                    <p className="text-[15px] font-semibold text-[#222222]">
                      {room?.name ?? 'Select a room'}
                    </p>
                    {isLocked && room?.detail && (
                      <p className="text-xs text-[#717171] mt-0.5">{room.detail}</p>
                    )}
                  </div>
                </div>
                {!isLocked && draft.rooms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLine(idx)}
                    className="w-9 h-9 rounded-full border border-[#EBEBEB] hover:border-[#E07A5F] hover:bg-[#FFF5F2] flex items-center justify-center transition-colors"
                    aria-label="Remove room"
                  >
                    <Trash2 className="w-4 h-4 text-[#717171]" />
                  </button>
                )}
              </div>

              <div className={`grid gap-3 ${isLocked ? 'sm:max-w-[240px]' : 'sm:grid-cols-2'}`}>
                {!isLocked && (
                  <CategorySelect
                    label="Room type"
                    icon={BedDouble}
                    value={line.roomSlug}
                    onChange={(slug) => {
                      const next = rooms.find((r) => r.slug === slug)
                      const cap = next?.guests ?? 1
                      updateLine(idx, {
                        roomSlug: slug,
                        guests: Math.min(line.guests || 1, cap),
                        breakfast: next?.priceBreakfast ? line.breakfast : false,
                      })
                    }}
                    options={options}
                  />
                )}

                <Stepper
                  label={dorm ? 'Beds' : 'Guests'}
                  value={line.guests}
                  onChange={(n) => updateLine(idx, { guests: n })}
                  min={1}
                  max={capacity}
                />
              </div>

              {packageContext?.includesBreakfast ? (
                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl border border-[#E8F4F8] bg-[#F0F8FB]">
                  <span className="w-5 h-5 rounded-full bg-[#1B4965] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1B4965]">Breakfast included</p>
                    <p className="text-xs text-[#3A8FB7]">Part of your {packageContext.pkg.title} package</p>
                  </div>
                </div>
              ) : breakfastAvailable ? (
                <label className="mt-4 flex items-center gap-3 p-3 rounded-xl border border-[#EBEBEB] cursor-pointer hover:border-[#3A8FB7] bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={line.breakfast}
                    onChange={(e) => updateLine(idx, { breakfast: e.target.checked })}
                    className="w-4 h-4 accent-[#1B4965]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#222222]">
                      Add breakfast (+{formatPrice(room?.priceBreakfast ?? 0)} / guest / night)
                    </p>
                    <p className="text-xs text-[#717171]">Fresh Moroccan breakfast on the rooftop</p>
                  </div>
                </label>
              ) : (
                <p className="mt-3 text-xs text-[#717171]">Breakfast not available for this room.</p>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={addLine}
        className="mt-4 w-full h-[52px] rounded-xl bg-[#E07A5F] text-[#1B4965] font-semibold text-sm hover:bg-[#D06A4F] transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4 text-[#1B4965]" />
        Add another room
      </button>
    </div>
  )
}
