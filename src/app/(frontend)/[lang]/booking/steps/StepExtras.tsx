'use client'

import { useEffect, useRef, useState } from 'react'
import { Car, Check, ChevronDown, Clock, MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TransferRoute } from '@/lib/transferRoutes'
import { useCurrency } from '@/components/currency-switcher'
import type { BookingDraft } from '../lib/types'
import { DatePopover } from './DatePopover'

type Props = {
  draft: BookingDraft
  update: (patch: Partial<BookingDraft>) => void
  lang?: 'en' | 'fr'
  routes: TransferRoute[]
}

const COPY = {
  en: {
    heading: 'Anything else?',
    addTransfer: 'Add airport / intercity transfer',
    transferDesc: 'Private taxi pickup — pick a route and we handle the rest.',
    route: 'Route',
    routePlaceholder: 'Select a route…',
    pickupDate: 'Pickup date',
    pickupTime: 'Pickup time',
    pickupTimePlaceholder: 'Select time…',
    pickupAddress: 'Pickup address',
    pickupAddressPlaceholder: 'Hotel name, street, or flight number',
    specialRequests: 'Special requests (optional)',
    specialRequestsPlaceholder: 'Arrival time, dietary needs, celebrations…',
  },
  fr: {
    heading: 'Autre chose ?',
    addTransfer: 'Ajouter un transfert aéroport / interville',
    transferDesc: 'Taxi privé — choisissez un trajet, on s’occupe du reste.',
    route: 'Trajet',
    routePlaceholder: 'Choisir un trajet…',
    pickupDate: 'Date de prise en charge',
    pickupTime: 'Heure de prise en charge',
    pickupTimePlaceholder: 'Choisir l’heure…',
    pickupAddress: 'Adresse de prise en charge',
    pickupAddressPlaceholder: 'Hôtel, rue, ou numéro de vol',
    specialRequests: 'Demandes particulières (facultatif)',
    specialRequestsPlaceholder: 'Heure d’arrivée, régime, occasions spéciales…',
  },
}

const TIME_OPTIONS: string[] = (() => {
  const out: string[] = []
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return out
})()

function splitPickup(value: string | undefined): { date: string; time: string } {
  if (!value) return { date: '', time: '' }
  const [date = '', time = ''] = value.split('T')
  return { date, time: time.slice(0, 5) }
}

function joinPickup(date: string, time: string): string {
  if (!date && !time) return ''
  return `${date}T${time || '00:00'}`
}

type SelectOption = { value: string; label: string; rightLabel?: string }

type StyledSelectProps = {
  value: string
  onChange: (v: string) => void
  options: SelectOption[]
  placeholder: string
  label?: string
  icon: LucideIcon
}

function StyledSelect({ value, onChange, options, placeholder, label, icon: Icon }: StyledSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const current = options.find((o) => o.value === value)

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      {label && <label className="text-xs font-medium text-[#717171]">{label}</label>}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`w-full h-12 sm:h-[52px] pl-10 sm:pl-11 pr-9 sm:pr-10 rounded-xl border bg-white text-sm text-left flex items-center transition-all ${
            open ? 'border-[#1B4965] ring-1 ring-[#1B4965]' : 'border-[#DDDDDD] hover:border-[#BBBBBB]'
          } ${current ? 'text-[#222222]' : 'text-[#8A8A8A]'}`}
        >
          <Icon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#3A8FB7] pointer-events-none" />
          <span className="flex-1 min-w-0 truncate">
            {current ? (
              <>
                <span className="text-[#222222]">{current.label}</span>
                {current.rightLabel && (
                  <span className="text-[#717171]"> — {current.rightLabel}</span>
                )}
              </>
            ) : (
              placeholder
            )}
          </span>
          <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171] pointer-events-none" />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl border border-[#EBEBEB] shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-h-[280px] overflow-y-auto">
            {options.length === 0 && (
              <p className="px-4 py-3 text-xs text-[#717171]">No options available</p>
            )}
            {options.map((opt) => {
              const selected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 text-sm transition-colors border-b border-[#F5F5F5] last:border-b-0 ${
                    selected ? 'bg-[#F0F8FB] text-[#1B4965] font-semibold' : 'text-[#222222] hover:bg-[#FAFAFA]'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  <span className="flex items-center gap-2 flex-shrink-0">
                    {opt.rightLabel && (
                      <span
                        className={`text-xs sm:text-sm ${
                          selected ? 'text-[#1B4965]' : 'text-[#E07A5F] font-semibold'
                        }`}
                      >
                        {opt.rightLabel}
                      </span>
                    )}
                    {selected && <Check className="w-4 h-4 text-[#1B4965]" />}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function StepExtras({ draft, update, lang = 'en', routes }: Props) {
  const t = COPY[lang] ?? COPY.en
  const { formatPrice } = useCurrency()
  const enabled = draft.airportTransfer
  const transfer = draft.transfer ?? {}
  const { date: pickupDate, time: pickupTimeOnly } = splitPickup(transfer.pickupTime)
  const [dateOpen, setDateOpen] = useState(false)

  const patchTransfer = (patch: Partial<NonNullable<BookingDraft['transfer']>>) => {
    update({ transfer: { ...transfer, ...patch } })
  }

  const toggleTransfer = (checked: boolean) => {
    if (checked) {
      update({
        airportTransfer: true,
        transfer: {
          ...transfer,
          routeId: transfer.routeId || routes[0]?.id,
        },
      })
    } else {
      update({ airportTransfer: false })
    }
  }

  const routeOptions: SelectOption[] = routes.map((r) => ({
    value: r.id,
    label: r.label,
    rightLabel: formatPrice(r.priceEur),
  }))

  const timeOptions: SelectOption[] = TIME_OPTIONS.map((time) => ({ value: time, label: time }))

  return (
    <div>
      <h2 className="text-lg sm:text-[22px] text-[#222222] mb-4 sm:mb-5">{t.heading}</h2>

      <label
        className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-colors ${
          enabled
            ? 'border-[#3A8FB7] bg-[#F0F8FB]'
            : 'border-[#EBEBEB] bg-white hover:border-[#CCCCCC]'
        }`}
      >
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => toggleTransfer(e.target.checked)}
          className="w-4 h-4 mt-1 accent-[#1B4965] flex-shrink-0"
        />
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E8F4F8] flex items-center justify-center flex-shrink-0">
          <Car className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-[#1B4965]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-[15px] font-semibold text-[#222222]">{t.addTransfer}</p>
          <p className="text-xs sm:text-sm text-[#717171]">{t.transferDesc}</p>
        </div>
      </label>

      {enabled && (
        <div className="mt-4 rounded-xl border border-[#EBEBEB] bg-white p-3 sm:p-5 flex flex-col gap-4">
          <StyledSelect
            label={t.route}
            placeholder={t.routePlaceholder}
            value={transfer.routeId ?? ''}
            onChange={(v) => patchTransfer({ routeId: v })}
            options={routeOptions}
            icon={Car}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DatePopover
              label={t.pickupDate}
              value={pickupDate || undefined}
              open={dateOpen}
              onOpenChange={setDateOpen}
              onChange={(v) => {
                patchTransfer({ pickupTime: joinPickup(v, pickupTimeOnly) })
                setDateOpen(false)
              }}
            />
            <StyledSelect
              label={t.pickupTime}
              placeholder={t.pickupTimePlaceholder}
              value={pickupTimeOnly}
              onChange={(v) => patchTransfer({ pickupTime: joinPickup(pickupDate, v) })}
              options={timeOptions}
              icon={Clock}
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-xs font-medium text-[#717171]">{t.pickupAddress}</label>
            <div className="relative">
              <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#3A8FB7] pointer-events-none" />
              <input
                type="text"
                value={transfer.pickupAddress ?? ''}
                onChange={(e) => patchTransfer({ pickupAddress: e.target.value })}
                placeholder={t.pickupAddressPlaceholder}
                className="w-full h-12 sm:h-[52px] rounded-xl border border-[#DDDDDD] bg-white pl-10 sm:pl-11 pr-4 text-sm text-[#222222] placeholder-[#8A8A8A] outline-none focus:border-[#1B4965] focus:ring-1 focus:ring-[#1B4965] transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#717171]">{t.specialRequests}</label>
        <textarea
          value={draft.specialRequests}
          onChange={(e) => update({ specialRequests: e.target.value })}
          rows={4}
          placeholder={t.specialRequestsPlaceholder}
          className="rounded-xl border border-[#DDDDDD] bg-white p-3 sm:p-4 text-sm text-[#222222] placeholder-[#8A8A8A] outline-none focus:border-[#1B4965] focus:ring-1 focus:ring-[#1B4965] resize-none transition-colors"
        />
      </div>
    </div>
  )
}
