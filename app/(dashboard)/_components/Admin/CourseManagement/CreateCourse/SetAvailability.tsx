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
}

export default function SetAvailability({
    courseTitle,
    dateRange,
    onDateRangeChange,
    isSubmitting,
    onSubmit
}: SetAvailabilityProps) {
    return (
        <Card className='border py-5 relative sticky top-0'>
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
                        <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                        <DateRangePicker
                            value={dateRange}
                            className="cursor-pointer"
                            onChange={onDateRangeChange}
                            placeholder="Select start date"
                            showAs="start"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">End Date</Label>
                        <DateRangePicker
                            value={dateRange}
                            className="cursor-pointer"
                            onChange={onDateRangeChange}
                            placeholder="Select end date"
                            showAs="end"
                        />
                    </div>
                </div>

                <Separator />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={onSubmit}
                    className="w-full bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/80 text-white"
                    size="lg"
                >
                    {isSubmitting ? 'Publishing...' : 'Publish Course'}
                </Button>
            </CardContent>
        </Card>
    )
}
