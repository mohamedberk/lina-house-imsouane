'use client'

import { Users, Minus, Plus } from 'lucide-react'

type Props = {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  label?: string
  icon?: React.ElementType
}

export function Stepper({ value, onChange, min = 1, max = 20, label, icon: Icon = Users }: Props) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-[#717171]">{label}</label>}
      <div className="flex items-center h-[52px] rounded-xl border border-[#DDDDDD] bg-white overflow-hidden">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className="flex items-center justify-center w-12 h-full hover:bg-[#F7F7F7] transition-colors border-r border-[#EBEBEB] disabled:opacity-30"
        >
          <Minus className="w-4 h-4 text-[#717171]" />
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <Icon className="w-[18px] h-[18px] text-[#3A8FB7]" />
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= min && v <= max) onChange(v)
            }}
            min={min}
            max={max}
            className="w-12 text-center text-sm font-semibold text-[#222222] outline-none bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className="flex items-center justify-center w-12 h-full hover:bg-[#F7F7F7] transition-colors border-l border-[#EBEBEB] disabled:opacity-30"
        >
          <Plus className="w-4 h-4 text-[#717171]" />
        </button>
      </div>
    </div>
  )
}
