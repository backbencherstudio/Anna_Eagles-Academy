import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import DateRangePicker from '@/components/ui/DateRangePicker'
import { DateRange } from 'react-day-picker'

interface SetAvailabilityProps {
    courseTitle: string
    dateRange: DateRange | undefined
    onDateRangeChange: (range: DateRange | undefined) => void
    isSubmitting: boolean
    onSubmit: () => void
    showErrors?: boolean
    disabled?: boolean
}

export default function SetAvailability({
    courseTitle,
    dateRange,
    onDateRangeChange,
    isSubmitting,
    onSubmit,
    showErrors = false,
    disabled = false
}: SetAvailabilityProps) {
    return (
        <Card className={`border py-5 sticky top-0 ${disabled ? 'opacity-50' : ''}`}>
            <CardHeader>
                <CardTitle className="text-md font-semibold">Set Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                        Course name: {courseTitle || 'Untitled Course'}
                    </Label>
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></Label>
                        <DateRangePicker
                            value={dateRange}
                            className={`cursor-pointer ${showErrors && !dateRange?.from ? 'border-red-500' : ''}`}
                            onChange={onDateRangeChange}
                            placeholder="Select start date"
                            showAs="start"
                            disabled={disabled}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">End Date <span className="text-red-500">*</span></Label>
                        <DateRangePicker
                            value={dateRange}
                            className={`cursor-pointer ${showErrors && !dateRange?.to ? 'border-red-500' : ''}`}
                            onChange={onDateRangeChange}
                            placeholder="Select end date"
                            showAs="end"
                            disabled={disabled}
                        />
                    </div>
                </div>

                <Separator />

                <Button
                    type="submit"
                    disabled={isSubmitting || disabled}
                    onClick={onSubmit}
                    className="w-full bg-[#0F2598] cursor-pointer transition-all duration-300 hover:bg-[#0F2598]/80 text-white"
                    size="lg"
                >
                    {disabled ? 'Add lessons first' : isSubmitting ? 'Publishing...' : 'Publish Course'}
                </Button>
            </CardContent>
        </Card>
    )
}
