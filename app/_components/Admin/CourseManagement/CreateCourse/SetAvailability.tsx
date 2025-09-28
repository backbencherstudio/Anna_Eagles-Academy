import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import DateRangePicker from '@/components/ui/DateRangePicker'
import { DateRange } from 'react-day-picker'
import { useUpdateSingleSeriesMutation } from '@/redux/api/managementCourseApis'
import { useAppSelector } from '@/redux/hooks'
import { getCookie, deleteCookie } from '@/lib/tokenUtils'
import toast from 'react-hot-toast'

interface SetAvailabilityProps {
    seriesId?: string | null
    courseTitle: string
    dateRange: DateRange | undefined
    onDateRangeChange: (range: DateRange | undefined) => void
    showErrors?: boolean
    disabled?: boolean
    onSuccess?: () => void
}

export default function SetAvailability({
    seriesId,
    courseTitle,
    dateRange,
    onDateRangeChange,
    showErrors = false,
    disabled = false,
    onSuccess
}: SetAvailabilityProps) {
    // ==================== STATE & HOOKS ====================
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [updateSeries] = useUpdateSingleSeriesMutation()
    
    // Get series ID from prop or Redux store
    const seriesIdFromStore = useAppSelector((s) => s.managementCourse.currentSeriesId)
    const activeSeriesId = seriesId || seriesIdFromStore

    // ==================== HANDLERS ====================
    const handleSubmit = async () => {
        if (!dateRange?.from || !dateRange?.to) {
            toast.error('Please select both start and end dates')
            return
        }

        if (!activeSeriesId) {
            toast.error('Series ID not found')
            return
        }

        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('start_date', dateRange.from.toISOString().split('T')[0])
            formData.append('end_date', dateRange.to.toISOString().split('T')[0])

            const res: any = await updateSeries({ 
                series_id: activeSeriesId, 
                formData 
            }).unwrap()

            // No need to remove cookie since we're using dynamic routes
            
            toast.success(res?.message || 'Course availability updated successfully')
            onSuccess?.()
        } catch (e: any) {
            const errorMessage = e?.data?.message || e?.message || 'Failed to update course availability'
            toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to update course availability')
        }

        setIsSubmitting(false)
    }
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
                    onClick={handleSubmit}
                    className="w-full bg-[#0F2598] cursor-pointer transition-all duration-300 hover:bg-[#0F2598]/80 text-white"
                    size="lg"
                >
                    {disabled ? 'Add lessons first' : isSubmitting ? 'Updating...' : 'Update Availability'}
                </Button>
            </CardContent>
        </Card>
    )
}
