'use client'

import { Waves, Plus, Trash2, Check } from 'lucide-react'
import type { ActivityDoc, BookingDraft, PackageBookingContext, SurfLine } from '../lib/types'
import { uid } from '../lib/pricing'
import { Stepper } from './Stepper'
import { CategorySelect } from './CategorySelect'
import { useCurrency } from '@/components/currency-switcher'

type Props = {
  draft: BookingDraft
  update: (patch: Partial<BookingDraft>) => void
  activities: ActivityDoc[]
  lockedPrimary: boolean
  packageContext?: PackageBookingContext
}

export function StepSurf({ draft, update, activities, lockedPrimary, packageContext }: Props) {
  const { formatPrice } = useCurrency()
  const isSurfOnly = draft.mode === 'surf-only'
  const includedGroup = packageContext?.includedGroupSurfLessons ?? 0
  const includedPrivate = packageContext?.includedPrivateSurfLessons ?? 0
  const surfIncluded = includedGroup + includedPrivate > 0

  const updateLine = (idx: number, patch: Partial<SurfLine>) => {
    const next = [...draft.surf]
    next[idx] = { ...next[idx], ...patch }
    update({ surf: next })
  }

  const removeLine = (idx: number) => {
    update({ surf: draft.surf.filter((_, i) => i !== idx) })
  }

  const addLine = () => {
    const first = activities[0]
    if (!first) return
    const totalGuests = draft.rooms.reduce((s, l) => s + Math.max(1, l.guests), 0) || 1
    update({
      surf: [
        ...draft.surf,
        { id: uid(), activitySlug: first.slug, participants: totalGuests },
      ],
    })
  }

  const hasAny = draft.surf.length > 0

  const heading = surfIncluded
    ? `Surf included in ${packageContext!.pkg.title}`
    : isSurfOnly
    ? 'Pick your session'
    : 'Want to add a surf lesson?'
  const subcopy = surfIncluded
    ? 'The sessions below are already covered. Add another paid session only if you want extra surf time.'
    : isSurfOnly
    ? 'Choose a lesson or rental and number of participants.'
    : 'Optional — our instructors take all levels. Skip if not interested.'

  return (
    <div>
      <h2 className="text-[22px] text-[#222222] mb-1">{heading}</h2>
      <p className="text-[14px] text-[#717171] mb-5">{subcopy}</p>

      {surfIncluded && (
        <div className="mb-4 flex items-start gap-3 p-4 rounded-xl border border-[#E8F4F8] bg-[#F0F8FB]">
          <span className="w-5 h-5 rounded-full bg-[#1B4965] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </span>
          <div>
            <p className="text-sm font-medium text-[#1B4965]">Included with your package</p>
            <p className="text-xs text-[#3A8FB7] mt-0.5">
              {[
                includedGroup > 0 ? `${includedGroup} group lesson${includedGroup > 1 ? 's' : ''}` : '',
                includedPrivate > 0 ? `${includedPrivate} private lesson${includedPrivate > 1 ? 's' : ''}` : '',
              ].filter(Boolean).join(' + ')}
            </p>
          </div>
        </div>
      )}

      {!hasAny && !isSurfOnly && (
        <button
          type="button"
          onClick={addLine}
          className="w-full h-[52px] rounded-xl bg-[#E07A5F] text-[#1B4965] font-semibold text-sm hover:bg-[#D06A4F] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#1B4965]" />
          {surfIncluded ? 'Add an extra surf lesson' : 'Add a surf lesson'}
        </button>
      )}

      <div className="flex flex-col gap-4">
        {draft.surf.map((line, idx) => {
          const act = activities.find((a) => a.slug === line.activitySlug)
          const perPerson = (act?.priceUnit || '').toLowerCase().includes('person')
          const firstLineLocked = idx === 0 && lockedPrimary
          const isIncludedLine = false
          const hideDropdown = idx === 0 && lockedPrimary

          return (
            <div
              key={line.id}
              className="rounded-2xl border border-[#EBEBEB] bg-white p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF5F2] flex items-center justify-center">
                    <Waves className="w-5 h-5 text-[#E07A5F]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-[1.5px] text-[#717171]">
                      SURF {idx + 1}
                      {firstLineLocked && (
                        <span className="ml-2 text-[#3A8FB7]">
                          · {isIncludedLine ? 'INCLUDED' : 'YOUR PICK'}
                        </span>
                      )}
                    </p>
                    <p className="text-[15px] font-semibold text-[#222222]">
                      {act?.title ?? 'Select a session'}
                    </p>
                    {hideDropdown && (act?.groupSize || act?.duration) && (
                      <p className="text-xs text-[#717171] mt-0.5">
                        {[act?.groupSize, act?.duration].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
                {!firstLineLocked && (
                  <button
                    type="button"
                    onClick={() => removeLine(idx)}
                    className="w-9 h-9 rounded-full border border-[#EBEBEB] hover:border-[#E07A5F] hover:bg-[#FFF5F2] flex items-center justify-center transition-colors"
                    aria-label="Remove session"
                  >
                    <Trash2 className="w-4 h-4 text-[#717171]" />
                  </button>
                )}
              </div>

              <div className={`grid gap-3 ${hideDropdown ? 'sm:max-w-[240px]' : 'sm:grid-cols-2'}`}>
                {!hideDropdown && (
                  <CategorySelect
                    label="Session"
                    icon={Waves}
                    value={line.activitySlug}
                    onChange={(slug) => updateLine(idx, { activitySlug: slug })}
                    options={activities.map((a) => ({
                      value: a.slug,
                      title: a.title,
                      subtitle: a.groupSize || a.duration,
                      priceLabel: isIncludedLine
                        ? 'Included'
                        : `${formatPrice(a.price)} ${a.priceUnit || ''}`.trim(),
                    }))}
                  />
                )}

                <Stepper
                  label="Participants"
                  value={line.participants}
                  onChange={(n) => updateLine(idx, { participants: n })}
                  min={1}
                  max={20}
                />
              </div>

              {!isIncludedLine && !perPerson && act && (
                <p className="mt-3 text-xs text-[#717171]">
                  This session is priced flat ({formatPrice(act.price)} {act.priceUnit}), not per person.
                </p>
              )}
            </div>
          )
        })}
      </div>

      {hasAny && (
        <button
          type="button"
          onClick={addLine}
          className="mt-4 w-full h-[52px] rounded-xl bg-[#E07A5F] text-[#1B4965] font-semibold text-sm hover:bg-[#D06A4F] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#1B4965]" />
          Add another session
        </button>
      )}
    </div>
  )
}
