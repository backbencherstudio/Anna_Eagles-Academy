import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import DateRangePicker from '@/components/ui/DateRangePicker'
import { DateRange } from 'react-day-picker'
import { useUpdateSingleSeriesMutation, useGetSingleSeriesQuery } from '@/rtk/api/admin/managementCourseApis'
import { useAppSelector } from '@/rtk/hooks'
import { localDateTimeToUTC, utcToLocalDateTime } from '@/lib/calendarUtils'
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

// Helper function for timezone conversion
const convertUTCDateToLocal = (utcIsoString: string) => {
    try {
        return utcToLocalDateTime(utcIsoString)
    } catch (error) {
        console.error('Error converting UTC to local:', error)
        return { date: new Date(), time: '09:00' }
    }
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

    // Fetch single series data to get existing dates
    const { data: seriesData, isLoading: isLoadingSeries } = useGetSingleSeriesQuery(
        activeSeriesId || '', 
        { skip: !activeSeriesId }
    )

    // ==================== EFFECTS ====================
    // Set existing dates when series data is loaded - handle date-only fields
    useEffect(() => {
        if (seriesData?.data?.start_date && seriesData?.data?.end_date && !dateRange?.from && !dateRange?.to) {
            // For date-only fields, create dates directly from the date string
            const startDateStr = seriesData.data.start_date.includes('T') 
                ? seriesData.data.start_date.split('T')[0] 
                : seriesData.data.start_date
            const endDateStr = seriesData.data.end_date.includes('T') 
                ? seriesData.data.end_date.split('T')[0] 
                : seriesData.data.end_date
            
            const startDate = new Date(startDateStr + 'T00:00:00')
            const endDate = new Date(endDateStr + 'T00:00:00')
            
            onDateRangeChange({ from: startDate, to: endDate })
        }
    }, [seriesData, dateRange, onDateRangeChange])

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
        
            // For date-only fields, format as YYYY-MM-DD without timezone conversion
            const formatDateOnly = (date: Date) => {
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                return `${year}-${month}-${day}`
            }
            
            formData.append('start_date', formatDateOnly(dateRange.from))
            formData.append('end_date', formatDateOnly(dateRange.to))

            const res: any = await updateSeries({ 
                series_id: activeSeriesId, 
                formData 
            }).unwrap()

            
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
                    {isLoadingSeries ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0F2598] mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-600">Loading dates...</p>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
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
