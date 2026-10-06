'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { format } from 'date-fns'

type Props = {
  value?: string
  onChange: (v: string) => void
  minDate?: Date
  placeholder?: string
  label?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

export function DatePopover({
  value,
  onChange,
  minDate,
  placeholder = 'Select date',
  label,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
}: Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = (v: boolean) => {
    if (!isControlled) setUncontrolledOpen(v)
    onOpenChange?.(v)
  }

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-[#717171]">{label}</label>}
      <div className="relative" ref={ref}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={`w-full h-[52px] pl-11 pr-4 rounded-xl border text-sm text-left transition-all flex items-center ${
            open ? 'border-[#1B4965] ring-1 ring-[#1B4965]' : 'border-[#DDDDDD] hover:border-[#BBBBBB]'
          } ${disabled ? 'bg-[#F7F7F7] cursor-not-allowed' : 'bg-white'} ${value ? 'text-[#222222]' : 'text-[#8A8A8A]'}`}
        >
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#3A8FB7] pointer-events-none" />
          {value ? format(new Date(value), 'MMM d, yyyy') : placeholder}
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl border border-[#EBEBEB] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2">
            <DayPicker
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => {
                if (date) {
                  onChange(format(date, 'yyyy-MM-dd'))
                  setOpen(false)
                }
              }}
              disabled={{ before: minDate ?? today }}
              style={{
                // Compact sizing — overrides react-day-picker defaults.
                ['--rdp-day-width' as any]: '34px',
                ['--rdp-day-height' as any]: '34px',
                ['--rdp-day_button-width' as any]: '34px',
                ['--rdp-day_button-height' as any]: '34px',
                ['--rdp-nav_button-width' as any]: '28px',
                ['--rdp-nav_button-height' as any]: '28px',
                fontSize: '13px',
              }}
              classNames={{
                today: `font-bold text-[#E07A5F]`,
                selected: `!bg-[#1B4965] !text-white rounded-full`,
                chevron: `fill-[#1B4965]`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
