'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Search, Check } from 'lucide-react'
import flags from 'react-phone-number-input/flags'

type Option = { value?: string; label: string }

type Props = {
  value?: string
  onChange: (value?: string) => void
  options: Option[]
  iconComponent?: React.ElementType
  disabled?: boolean
}

export function CountrySelect({ value, onChange, options, iconComponent: Icon, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const visibleOptions = useMemo(
    () => options.filter((o) => o.value !== 'EH'),
    [options],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return visibleOptions
    return visibleOptions.filter((o) => o.label.toLowerCase().includes(q))
  }, [visibleOptions, query])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else setQuery('')
  }, [open])

  const selected = options.find((o) => o.value === value) ?? options.find((o) => !o.value)
  const Flag = value ? flags[value as keyof typeof flags] : undefined

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <button
          type="button"
          aria-label={selected?.label ?? 'Select country'}
          className="flex items-center gap-2 h-[52px] px-3 rounded-xl border border-[#DDDDDD] bg-white hover:border-[#1B4965] focus:border-[#1B4965] focus:ring-1 focus:ring-[#1B4965] outline-none transition-colors"
        >
          <span className="w-[26px] h-[18px] overflow-hidden rounded-[3px] bg-[#F2F2F2] flex items-center justify-center">
            {Flag ? <Flag title={selected?.label ?? ''} /> : Icon ? <Icon /> : null}
          </span>
          <ChevronDown className="w-4 h-4 text-[#3A8FB7]" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="z-50 w-[280px] max-h-[320px] rounded-xl border border-[#EBEBEB] bg-white shadow-xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EBEBEB]">
            <Search className="w-4 h-4 text-[#8A8A8A]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Search country"
              className="flex-1 text-sm outline-none bg-transparent text-[#222222] placeholder-[#8A8A8A]"
            />
          </div>
          <div className="overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-sm text-[#8A8A8A] text-center">No matches</div>
            ) : (
              filtered.map((o) => {
                const F = o.value ? flags[o.value as keyof typeof flags] : undefined
                const isSelected = o.value === value
                return (
                  <DropdownMenu.Item
                    key={o.value ?? 'intl'}
                    onSelect={() => {
                      onChange(o.value)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left cursor-pointer outline-none data-[highlighted]:bg-[#F7F7F7] ${
                      isSelected ? 'bg-[#F0F7FB]' : ''
                    }`}
                  >
                    <span className="w-[24px] h-[16px] overflow-hidden rounded-[2px] bg-[#F2F2F2] flex items-center justify-center flex-shrink-0">
                      {F ? <F title={o.label} /> : Icon ? <Icon /> : null}
                    </span>
                    <span className="flex-1 text-[#222222] truncate">{o.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#1B4965]" />}
                  </DropdownMenu.Item>
                )
              })
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
