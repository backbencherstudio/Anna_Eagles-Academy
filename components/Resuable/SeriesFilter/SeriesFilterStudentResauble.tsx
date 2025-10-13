"use client"
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetSeriesWithCoursesQuery, type SeriesWithCourses } from '@/rtk/api/users/filterSeriesList'

type SeriesFilterStudentReusableProps = {
    seriesLabel?: string
    courseLabel?: string
    seriesPlaceholder?: string
    coursePlaceholder?: string
    className?: string
    defaultSeriesId?: string
    defaultCourseId?: string
    onSeriesChange?: (seriesId: string | undefined) => void
    onCourseChange?: (courseId: string | undefined) => void
    hideCourse?: boolean
}

export default function SeriesFilterStudentResauble({
    seriesLabel = 'Series',
    courseLabel = 'Course',
    seriesPlaceholder = 'Select series',
    coursePlaceholder = 'Select course',
    className,
    defaultSeriesId,
    defaultCourseId,
    onSeriesChange,
    onCourseChange,
    hideCourse,
}: SeriesFilterStudentReusableProps) {
    const { data, isLoading, isError } = useGetSeriesWithCoursesQuery()

    const [selectedSeriesId, setSelectedSeriesId] = React.useState<string | undefined>(defaultSeriesId)
    const [selectedCourseId, setSelectedCourseId] = React.useState<string | undefined>(defaultCourseId)

    const seriesList: SeriesWithCourses[] = React.useMemo(() => data?.data ?? [], [data?.data])
    const selectedSeries = React.useMemo(
        () => seriesList.find((s) => s.id === selectedSeriesId),
        [seriesList, selectedSeriesId]
    )
    const courseList = React.useMemo(() => selectedSeries?.courses ?? [], [selectedSeries?.courses])

    React.useEffect(() => {
        if (!selectedSeries) {
            if (selectedCourseId !== undefined) setSelectedCourseId(undefined)
            return
        }
        if (selectedCourseId && !courseList.some((c) => c.id === selectedCourseId)) {
            setSelectedCourseId(undefined)
        }
    }, [selectedSeriesId, courseList, selectedCourseId, selectedSeries])

    const handleSeriesChange = (value?: string) => {
        const next = value && value.length > 0 ? value : undefined
        setSelectedSeriesId(next)
        setSelectedCourseId(undefined)
        onSeriesChange?.(next)
    }

    const handleCourseChange = (value?: string) => {
        const next = value && value.length > 0 ? value : undefined
        setSelectedCourseId(next)
        onCourseChange?.(next)
    }

    return (
        <div className={className}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                <div className="flex flex-col gap-1">
                    <Select
                        value={selectedSeriesId ?? 'all'}
                        onValueChange={(v) => handleSeriesChange(v === 'all' ? undefined : v)}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={isLoading ? 'Loading...' : seriesPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Series</SelectItem>
                            {seriesList.map((s) => (
                                <SelectItem className='cursor-pointer' key={s.id} value={s.id}>
                                    {s.title}
                                </SelectItem>
                            ))}
                            {(!isLoading && seriesList.length === 0) && (
                                <SelectItem value="__no_series__" disabled>
                                    No series found
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {!hideCourse && (
                    <div className="flex flex-col gap-1">
                        <Select
                            value={selectedCourseId ?? 'all'}
                            onValueChange={(v) => handleCourseChange(v === 'all' ? undefined : v)}
                            disabled={isLoading || !selectedSeriesId}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={selectedSeriesId ? coursePlaceholder : 'Select a series first'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {courseList.map((c) => (
                                    <SelectItem className='cursor-pointer' key={c.id} value={c.id}>
                                        {c.title}
                                    </SelectItem>
                                ))}
                                {selectedSeriesId && courseList.length === 0 && (
                                    <SelectItem value="__no_courses__" disabled>
                                        No courses available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            {isError && (
                <p className="text-xs text-red-500 mt-1">Failed to load series list.</p>
            )}
        </div>
    )
}


