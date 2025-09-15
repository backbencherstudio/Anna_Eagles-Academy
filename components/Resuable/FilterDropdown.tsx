'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Option = {
  label: string
  value: string
}

interface FilterDropdownProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function FilterDropdown({ options, value, onChange, placeholder = 'Select', className }: FilterDropdownProps) {
  return (
    <Select value={value || undefined as unknown as string} onValueChange={onChange}>
      <SelectTrigger className={`h-10 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-gray-200 focus:outline-none ${className || ''}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {options.filter(opt => opt.value !== '').map(opt => (
          <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}


