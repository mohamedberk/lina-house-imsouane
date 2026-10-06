'use client'

import { Mail, User } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { CountrySelect } from './CountrySelect'
import type { ActivityDoc, BookingDraft, PackageDoc, RoomDoc } from '../lib/types'
import { computeTotals } from '../lib/pricing'
import { useCurrency } from '@/components/currency-switcher'
import type { TransferRoute } from '@/lib/transferRoutes'

type Props = {
  draft: BookingDraft
  update: (patch: Partial<BookingDraft>) => void
  rooms: RoomDoc[]
  activities: ActivityDoc[]
  pkg?: PackageDoc
  transferRoutes?: TransferRoute[]
}

const INPUT_BASE =
  'w-full h-[52px] rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#222222] placeholder-[#8A8A8A] outline-none focus:border-[#1B4965] focus:ring-1 focus:ring-[#1B4965] transition-colors'

export function StepReview({ draft, update, rooms, activities, pkg, transferRoutes = [] }: Props) {
  const totals = computeTotals(draft, rooms, activities, pkg, transferRoutes)
  const { formatPrice } = useCurrency()

  return (
    <div>
      <h2 className="text-[22px] text-[#222222] mb-5">Contact &amp; review</h2>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#717171]">First name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#3A8FB7] pointer-events-none" />
            <input
              type="text"
              placeholder="Jane"
              value={draft.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
              className={`${INPUT_BASE} pl-11 pr-4`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#717171]">Last name</label>
          <input
            type="text"
            placeholder="Doe"
            value={draft.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            className={`${INPUT_BASE} px-4`}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#717171]">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#3A8FB7] pointer-events-none" />
            <input
              type="email"
              placeholder="you@example.com"
              value={draft.email}
              onChange={(e) => update({ email: e.target.value })}
              className={`${INPUT_BASE} pl-11 pr-4`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#717171]">Phone</label>
          <PhoneInput
            international
            defaultCountry="MA"
            countryCallingCodeEditable={false}
            addInternationalOption={false}
            placeholder="6 00 00 00 00"
            value={draft.phone || undefined}
            onChange={(value) => update({ phone: value || '' })}
            className="lina-phone-input"
            countrySelectComponent={CountrySelect}
            numberInputProps={{ className: INPUT_BASE + ' pl-3 pr-4' }}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#EBEBEB] bg-white p-5">
        <p className="text-sm font-semibold text-[#222222] mb-3">Price breakdown</p>
        <div className="flex flex-col gap-2 text-sm">
          {totals.packageLine && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between gap-3 text-[#222222]">
                <span>
                  {totals.packageLine.label}
                  {totals.packageLine.pricingBasis === 'per-person' && (
                    <span className="text-[#717171]"> × {totals.packageLine.quantity} guest{totals.packageLine.quantity > 1 ? 's' : ''}</span>
                  )}
                </span>
                <span className="whitespace-nowrap">{formatPrice(totals.packageLine.lineTotal)}</span>
              </div>
              <p className="text-xs text-[#3A8FB7]">
                {[
                  totals.packageLine.includesBreakfast ? 'Breakfast included' : '',
                  totals.packageLine.includedGroupSurfLessons > 0
                    ? `${totals.packageLine.includedGroupSurfLessons} group surf lesson${totals.packageLine.includedGroupSurfLessons > 1 ? 's' : ''}`
                    : '',
                  totals.packageLine.includedPrivateSurfLessons > 0
                    ? `${totals.packageLine.includedPrivateSurfLessons} private surf lesson${totals.packageLine.includedPrivateSurfLessons > 1 ? 's' : ''}`
                    : '',
                ].filter(Boolean).join(' · ')}
              </p>
            </div>
          )}
          {totals.roomLines.map((l, i) => (
            <div key={`r${i}`} className="flex flex-col gap-0.5">
              <div className="flex justify-between gap-3 text-[#222222]">
                <span>
                  {l.label}
                  <span className="text-[#717171]">
                    {' '}· {l.isDorm ? `${l.guests} bed${l.guests > 1 ? 's' : ''}` : `${l.guests} guest${l.guests > 1 ? 's' : ''}`} × {l.nights} night{l.nights > 1 ? 's' : ''}
                  </span>
                </span>
                <span className={`whitespace-nowrap ${l.included ? 'text-[#3A8FB7] text-xs font-medium' : ''}`}>
                  {l.included ? 'Included' : formatPrice(l.roomSubtotal)}
                </span>
              </div>
              {l.breakfast && l.breakfastSubtotal > 0 && (
                <div className="flex justify-between gap-3 text-[#717171] text-xs pl-3">
                  <span>+ Breakfast ({formatPrice(l.breakfastUnit)} × {l.guests} × {l.nights})</span>
                  <span className="whitespace-nowrap">{formatPrice(l.breakfastSubtotal)}</span>
                </div>
              )}
            </div>
          ))}
          {totals.surfLines.map((l, i) => (
            <div key={`s${i}`} className="flex justify-between gap-3 text-[#222222]">
              <span>
                {l.label}
                {l.perPerson && !l.included && (
                  <span className="text-[#717171]"> × {l.participants}</span>
                )}
              </span>
              <span
                className={`whitespace-nowrap ${l.included ? 'text-[#3A8FB7] text-xs font-medium' : ''}`}
              >
                {l.included ? 'Included' : formatPrice(l.lineTotal)}
              </span>
            </div>
          ))}
          {totals.transferLine && (
            <div className="flex justify-between gap-3 text-[#222222]">
              <span>{totals.transferLine.label}</span>
              <span className="whitespace-nowrap">{formatPrice(totals.transferLine.lineTotal)}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 mt-2 border-t border-[#EBEBEB] text-base font-semibold text-[#222222]">
            <span>Total</span>
            <span>{formatPrice(totals.grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
