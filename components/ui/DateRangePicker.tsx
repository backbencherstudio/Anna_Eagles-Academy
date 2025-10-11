"use client"

import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from 'lucide-react'
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
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [secondMonth, setSecondMonth] = useState<Date>(() => {
        const nextMonth = new Date()
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        return nextMonth
    })

    const calculateDuration = (from: Date, to: Date) => {
        const timeDiff = to.getTime() - from.getTime()
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
        const nights = daysDiff - 1
        return { days: daysDiff, nights }
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatDateRange = (range: DateRange | undefined) => {
        if (!range?.from) return placeholder

        if (showAs === 'start') {
            return range.from ? formatDate(range.from) : placeholder
        }

        if (showAs === 'end') {
            return range.to ? formatDate(range.to) : placeholder
        }

        // Default range display
        if (range.to) {
            return `${formatDate(range.from)} to ${formatDate(range.to)}`
        }

        return formatDate(range.from)
    }

    const handleClear = () => {
        onChange(undefined)
    }

    const handleApply = () => {
        setOpen(false)
    }

    const handleDateChange = (range: DateRange | undefined) => {
        onChange(range)

        // If start date is selected, always update second month to be next month
        if (range?.from) {
            const nextMonth = new Date(range.from)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            setSecondMonth(nextMonth)
        }
    }

    const navigateMonth = (direction: 'prev' | 'next', calendarIndex: number = 0) => {
        if (calendarIndex === 0) {
            const newMonth = new Date(currentMonth)
            if (direction === 'prev') {
                newMonth.setMonth(newMonth.getMonth() - 1)
            } else {
                newMonth.setMonth(newMonth.getMonth() + 1)
            }
            setCurrentMonth(newMonth)
            // Update second month to be one month ahead
            const nextMonth = new Date(newMonth)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            setSecondMonth(nextMonth)
        } else {
            const newMonth = new Date(secondMonth)
            if (direction === 'prev') {
                newMonth.setMonth(newMonth.getMonth() - 1)
            } else {
                newMonth.setMonth(newMonth.getMonth() + 1)
            }

            // Prevent second calendar from showing the same month as start date
            if (value?.from) {
                const startMonth = value.from.getMonth()
                const startYear = value.from.getFullYear()
                const newMonthValue = newMonth.getMonth()
                const newYear = newMonth.getFullYear()

                // If trying to navigate to same month as start date, move to next month
                if (newMonthValue === startMonth && newYear === startYear) {
                    const nextMonth = new Date(newMonth)
                    nextMonth.setMonth(nextMonth.getMonth() + 1)
                    setSecondMonth(nextMonth)
                } else {
                    setSecondMonth(newMonth)
                }
            } else {
                setSecondMonth(newMonth)
            }
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen} >
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
                    {value?.from && (
                        <X
                            className="ml-auto h-4 w-4 text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClear()
                            }}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-6 space-y-6">
                    <div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
                        {/* Header with Duration */}
                        {value?.from && value?.to && (
                            <div className="space-y-1 lg:w-1/2 w-full text-center lg:text-left">
                                <div className="text-lg font-bold text-[#0F1416]">
                                    {calculateDuration(value.from, value.to).days} Days/{calculateDuration(value.from, value.to).nights} Night
                                </div>
                                <div className="text-sm text-[#4A4C56]">
                                    {formatDate(value.from)} to {formatDate(value.to)}
                                </div>
                            </div>
                        )}

                        {/* Date Display Fields - Only show when dates are selected */}
                        {(value?.from || value?.to) && (
                            <div className="flex gap-1 lg:w-1/2 w-full">
                                {/* Start Date */}
                                <div className="flex-1">
                                    <div className={`relative flex flex-col px-3 py-1 border rounded-lg  ${value?.from
                                        ? 'border-[#0F2598] bg-[#0F2598]/10'
                                        : 'border-gray-300 bg-gray-50'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-[#4A4C56]">Start Date</span>
                                            {value?.from && (
                                                <X
                                                    className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onChange({ from: undefined, to: value?.to })
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-[#070707] mt-1">
                                            {value?.from ? formatDate(value.from) : 'Start Date'}
                                        </span>
                                    </div>
                                </div>
                                {/* End Date */}
                                <div className="flex-1">
                                    <div className={`relative flex flex-col px-3 py-1 border rounded-lg  ${value?.to
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-300 bg-white'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-[#4A4C56]">End Date</span>
                                            {value?.to && (
                                                <X
                                                    className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onChange({ from: value?.from, to: undefined })
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-[#070707] mt-1">
                                            {value?.to ? formatDate(value.to) : 'End Date'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Calendar */}
                    <div className="flex gap-8 flex-col md:flex-row">
                        {/* First Calendar */}
                        <Calendar
                            mode="range"
                            selected={value}
                            onSelect={handleDateChange}
                            month={currentMonth}
                            onMonthChange={(month) => {
                                setCurrentMonth(month)
                                // Update second month to be one month ahead
                                const nextMonth = new Date(month)
                                nextMonth.setMonth(nextMonth.getMonth() + 1)
                                setSecondMonth(nextMonth)
                            }}
                            className="rounded-md border-0"
                            showOutsideDays={false}
                            disabled={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                const checkDate = new Date(date)
                                checkDate.setHours(0, 0, 0, 0)
                                return checkDate < today
                            }}
                            numberOfMonths={1}
                            classNames={{
                                months: "flex gap-4 flex-col",
                                month: "flex flex-col w-full gap-4 ",
                                nav: "hidden ",
                                month_caption: "flex items-center justify-center relative ",
                                weekday: "text-black mb-2  uppercase font-semibold flex-1 flex justify-center items-center text-xs select-none",
                                week: "flex w-full mb-2 ",
                                day: "h-8 w-8 text-sm font-medium flex items-center justify-center text-gray-500",
                                range_start: "!bg-[#0F2598] !text-white rounded-full font-semibold",
                                range_end: "!bg-[#0F2598] !text-white rounded-full font-semibold",
                                range_middle: "!bg-[#0F2598]/10 !text-[#0F2598] font-medium",
                                today: "bg-gray-200 text-gray-900 font-semibold rounded-full",
                                day_selected: "!bg-[#0F2598] !text-white font-semibold",
                                day_outside: "text-gray-400 ",
                                day_disabled: "text-gray-300 cursor-not-allowed"
                            }}
                            components={{
                                MonthCaption: () => (
                                    <div className="flex items-center justify-between w-full px-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-gray-100"
                                            onClick={() => navigateMonth('prev', 0)}
                                        >
                                            <ChevronLeft className="h-4 w-4 text-gray-500" />
                                        </Button>

                                        <span className="text-sm font-medium text-gray-700">
                                            {currentMonth.toLocaleDateString('en-US', {
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-gray-100"
                                            onClick={() => navigateMonth('next', 0)}
                                        >
                                            <ChevronRight className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </div>
                                )
                            }}
                        />

                        {/* Second Calendar */}
                        <Calendar
                            mode="range"
                            selected={value}
                            onSelect={handleDateChange}
                            month={secondMonth}
                            onMonthChange={(month) => {
                                // Prevent second calendar from showing the same month as start date
                                if (value?.from) {
                                    const startMonth = value.from.getMonth()
                                    const startYear = value.from.getFullYear()
                                    const newMonth = month.getMonth()
                                    const newYear = month.getFullYear()

                                    // If trying to navigate to same month as start date, move to next month
                                    if (newMonth === startMonth && newYear === startYear) {
                                        const nextMonth = new Date(month)
                                        nextMonth.setMonth(nextMonth.getMonth() + 1)
                                        setSecondMonth(nextMonth)
                                    } else {
                                        setSecondMonth(month)
                                    }
                                } else {
                                    setSecondMonth(month)
                                }
                            }}
                            className="rounded-md border-0"
                            showOutsideDays={false}
                            disabled={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                const checkDate = new Date(date)
                                checkDate.setHours(0, 0, 0, 0)

                                // Disable past dates
                                if (checkDate < today) return true

                                // If start date is selected, disable dates from the same month
                                if (value?.from) {
                                    const startDate = new Date(value.from)
                                    const startMonth = startDate.getMonth()
                                    const startYear = startDate.getFullYear()
                                    const checkMonth = checkDate.getMonth()
                                    const checkYear = checkDate.getFullYear()

                                    // Disable dates from the same month as start date
                                    if (checkMonth === startMonth && checkYear === startYear) {
                                        return true
                                    }
                                }

                                return false
                            }}
                            numberOfMonths={1}
                            classNames={{
                                months: "flex gap-4 flex-col",
                                month: "flex flex-col w-full gap-4",
                                nav: "hidden",
                                month_caption: "flex items-center justify-center relative",
                                weekday: "text-black mb-2 uppercase font-semibold flex-1 flex justify-center items-center text-xs select-none",
                                week: "flex w-full mb-2 ",
                                day: "h-8 w-8 text-sm font-medium flex items-center justify-center text-gray-500",
                                range_start: "!bg-[#0F2598] hover:!bg-[#0F2598]/90 !text-white rounded-full font-semibold",
                                range_end: "!bg-[#0F2598] hover:!bg-[#0F2598]/90 !text-white rounded-full font-semibold",
                                range_middle: "!bg-[#0F2598]/10 !text-[#0F2598] font-medium",
                                today: "bg-gray-200 text-gray-900 font-semibold rounded-full",
                                day_selected: "!bg-[#0F2598] !text-white font-semibold",
                                day_outside: "text-gray-400",
                                day_disabled: "text-gray-300 cursor-not-allowed"
                            }}
                            components={{
                                MonthCaption: () => (
                                    <div className="flex items-center justify-between w-full px-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-gray-100"
                                            onClick={() => navigateMonth('prev', 1)}
                                        >
                                            <ChevronLeft className="h-4 w-4 text-gray-500" />
                                        </Button>

                                        <span className="text-sm font-medium text-gray-700">
                                            {secondMonth.toLocaleDateString('en-US', {
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-gray-100"
                                            onClick={() => navigateMonth('next', 1)}
                                        >
                                            <ChevronRight className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </div>
                                )
                            }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 items-center ">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="text-sm cursor-pointer border border-gray-300 text-gray-600 hover:text-gray-800 rounded-md"
                        >
                            Clear Range
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleApply}
                            className="text-sm bg-[#0F2598] cursor-pointer transition-all duration-300 hover:bg-[#0F2598]/80 text-white px-6 rounded-md"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}