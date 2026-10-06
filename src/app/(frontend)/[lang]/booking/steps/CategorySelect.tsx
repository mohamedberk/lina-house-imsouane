'use client'

import { useEffect, useRef, useState } from 'react'
import { BedDouble, ChevronDown, Check } from 'lucide-react'
import Image from 'next/image'

export type CategoryOption = {
  value: string
  title: string
  subtitle?: string
  priceLabel?: string
  imageUrl?: string
}

type Props = {
  value: string
  onChange: (v: string) => void
  options: CategoryOption[]
  label?: string
  placeholder?: string
  icon?: React.ElementType
}

export function CategorySelect({
  value,
  onChange,
  options,
  label,
  placeholder = 'Choose an option',
  icon: Icon = BedDouble,
}: Props) {
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
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-[#717171]">{label}</label>}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`w-full h-[52px] pl-3 pr-10 rounded-xl border bg-white text-sm text-left text-[#222222] flex items-center gap-3 transition-all ${
            open ? 'border-[#1B4965] ring-1 ring-[#1B4965]' : 'border-[#DDDDDD] hover:border-[#BBBBBB]'
          }`}
        >
          {current?.imageUrl ? (
            <span className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-[#F5F5F5]">
              <Image
                src={current.imageUrl}
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            </span>
          ) : (
            <span className="w-9 h-9 rounded-lg bg-[#E8F4F8] flex items-center justify-center flex-shrink-0">
              <Icon className="w-[18px] h-[18px] text-[#1B4965]" />
            </span>
          )}
          <span className="flex-1 min-w-0 truncate">
            {current ? (
              <>
                <span className="font-medium text-[#222222]">{current.title}</span>
                {current.priceLabel && (
                  <span className="text-[#717171]"> · {current.priceLabel}</span>
                )}
              </>
            ) : (
              <span className="text-[#8A8A8A]">{placeholder}</span>
            )}
          </span>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171] pointer-events-none" />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl border border-[#EBEBEB] shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-h-[320px] overflow-y-auto">
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
                  className={`w-full text-left px-3 py-3 flex items-center gap-3 transition-colors border-b border-[#F5F5F5] last:border-b-0 ${
                    selected ? 'bg-[#F0F8FB]' : 'hover:bg-[#FAFAFA]'
                  }`}
                >
                  {opt.imageUrl ? (
                    <span className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#F5F5F5]">
                      <Image
                        src={opt.imageUrl}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span className="w-12 h-12 rounded-lg bg-[#E8F4F8] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#1B4965]" />
                    </span>
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-[#222222] truncate">
                      {opt.title}
                    </span>
                    {opt.subtitle && (
                      <span className="block text-xs text-[#717171] truncate">
                        {opt.subtitle}
                      </span>
                    )}
                  </span>
                  {opt.priceLabel && (
                    <span className="text-xs text-[#222222] font-medium whitespace-nowrap">
                      {opt.priceLabel}
                    </span>
                  )}
                  {selected && <Check className="w-4 h-4 text-[#1B4965] flex-shrink-0" />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
