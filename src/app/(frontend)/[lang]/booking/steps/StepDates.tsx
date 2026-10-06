'use client'

import { useState } from 'react'
import type { BookingDraft } from '../lib/types'
import { DatePopover } from './DatePopover'
import { addDays, format } from 'date-fns'

type Props = {
  draft: BookingDraft
  update: (patch: Partial<BookingDraft>) => void
  fixedNights?: number
}

export function StepDates({ draft, update, fixedNights }: Props) {
  const isSurfOnly = draft.mode === 'surf-only'
  const [openCal, setOpenCal] = useState<'in' | 'out' | 'preferred' | null>(null)

  if (isSurfOnly) {
    const first = draft.surf[0]
    return (
      <div>
        <h2 className="text-[22px] text-[#222222] mb-5">Choose your date</h2>
        <div className="max-w-sm">
          <DatePopover
            label="Preferred date"
            value={first?.date}
            open={openCal === 'preferred'}
            onOpenChange={(o) => setOpenCal(o ? 'preferred' : null)}
            onChange={(v) => {
              if (first) {
                const next = [...draft.surf]
                next[0] = { ...first, date: v }
                update({ surf: next })
              }
            }}
          />
        </div>
      </div>
    )
  }

  const minCheckOut = draft.checkIn
    ? new Date(new Date(draft.checkIn).getTime() + 86400000)
    : undefined

  return (
    <div>
      <h2 className="text-[22px] text-[#222222] mb-1">Select your dates</h2>
      {fixedNights && (
        <p className="text-sm text-[#717171] mb-5">
          This package includes {fixedNights} night{fixedNights > 1 ? 's' : ''}. Checkout is set automatically.
        </p>
      )}
      {!fixedNights && <div className="mb-5" />}
      <div className="grid sm:grid-cols-2 gap-4">
        <DatePopover
          label="Check-in"
          value={draft.checkIn}
          open={openCal === 'in'}
          onOpenChange={(o) => setOpenCal(o ? 'in' : openCal === 'in' ? null : openCal)}
          onChange={(v) => {
            const patch: Partial<BookingDraft> = { checkIn: v }
            if (draft.checkOut && draft.checkOut <= v) patch.checkOut = undefined
            if (fixedNights) {
              patch.checkOut = format(addDays(new Date(`${v}T00:00:00`), fixedNights), 'yyyy-MM-dd')
            }
            update(patch)
            if (fixedNights) setOpenCal(null)
            else setTimeout(() => setOpenCal('out'), 120)
          }}
        />
        <DatePopover
          label="Check-out"
          value={draft.checkOut}
          open={openCal === 'out'}
          onOpenChange={(o) => setOpenCal(o ? 'out' : openCal === 'out' ? null : openCal)}
          onChange={(v) => {
            update({ checkOut: v })
            setOpenCal(null)
          }}
          minDate={minCheckOut}
          disabled={!!fixedNights}
        />
      </div>
    </div>
  )
}
