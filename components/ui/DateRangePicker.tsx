"use client"

import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

interface DateRangePickerProps {
    value?: DateRange
    onChange: (range: DateRange | undefined) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    showAs?: 'start' | 'end' | 'range' 
}

export default function DateRangePicker({
    value,
    onChange,
    placeholder = "Pick a date range",
    disabled = false,
    className = "",
    showAs = 'range'
}: DateRangePickerProps) {
    const [open, setOpen] = useState(false)

    const formatDateRange = (range: DateRange | undefined) => {
        if (!range?.from) return placeholder
        
        if (showAs === 'start') {
            return range.from ? range.from.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            }) : placeholder
        }
        
        if (showAs === 'end') {
            return range.to ? range.to.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            }) : placeholder
        }
        
        // Default range display
        if (range.to) {
            return `${range.from.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            })} - ${range.to.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            })}`
        }
        
        return range.from.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        })
    }

    const handleClear = () => {
        onChange(undefined)
    }

    const handleApply = () => {
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${showAs === 'start' || showAs === 'end' ? 'bg-gray-50 hover:bg-gray-100' : ''} ${className}`}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                        {formatDateRange(value)}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                    {/* Selection Status */}
                    <div className="text-sm text-gray-600 text-center">
                        {!value?.from ? (
                            "Select start date"
                        ) : !value?.to ? (
                            "Select end date"
                        ) : (
                            <span className="text-green-600 font-medium">
                                ✓ Range selected: {value.from.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                })} - {value.to.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                })}
                            </span>
                        )}
                    </div>

                    {/* Calendar */}
                    <Calendar
                        mode="range"
                        selected={value}
                        onSelect={(range) => onChange(range)}
                        className="rounded-md border-0"
                        disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            const checkDate = new Date(date)
                            checkDate.setHours(0, 0, 0, 0)
                            return checkDate < today
                        }}
                        numberOfMonths={2}
                        classNames={{
                            day: "h-8 w-8 text-sm",
                            range_start: "bg-[#1a73e8] text-white rounded-l-md font-semibold",
                            range_end: "bg-[#1a73e8] text-white rounded-r-md font-semibold",
                            range_middle: "bg-[#e8f0fe] text-[#1a73e8] font-medium",
                            today: "bg-gray-100 text-gray-900 font-semibold"
                        }}
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-2 border-t">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="text-sm cursor-pointer text-gray-600 hover:text-gray-800"
                        >
                            Clear
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setOpen(false)}
                                className="text-sm cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleApply}
                                className="text-sm bg-[#1a73e8] cursor-pointer hover:bg-[#1a73e8]/90 text-white"
                                disabled={!value?.from || !value?.to}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
