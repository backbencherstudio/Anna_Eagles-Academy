"use client"
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetSeriesWithCoursesQuery, type SeriesWithCourses } from '@/rtk/api/admin/courseFilterApis'

type SeriesFilterReusableProps = {
  seriesLabel?: string
  courseLabel?: string
  seriesPlaceholder?: string
  coursePlaceholder?: string
  className?: string
  /** Pre-select a series id */
  defaultSeriesId?: string
  /** Pre-select a course id (should belong to selected series) */
  defaultCourseId?: string
  /** Called whenever the series selection changes */
  onSeriesChange?: (seriesId: string | undefined) => void
  /** Called whenever the course selection changes */
  onCourseChange?: (courseId: string | undefined) => void
  /** If true, hide the course dropdown entirely */
  hideCourse?: boolean
}

export default function SeriesFilterReuseable({
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
}: SeriesFilterReusableProps) {
  const { data, isLoading, isError } = useGetSeriesWithCoursesQuery()

  const [selectedSeriesId, setSelectedSeriesId] = React.useState<string | undefined>(defaultSeriesId)
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | undefined>(defaultCourseId)

  const seriesList: SeriesWithCourses[] = React.useMemo(() => data?.data ?? [], [data?.data])
  const selectedSeries = React.useMemo(
    () => seriesList.find((s) => s.id === selectedSeriesId),
    [seriesList, selectedSeriesId]
  )
  const courseList = selectedSeries?.courses ?? []

  React.useEffect(() => {
    // When series changes, reset course if it doesn't belong to the new series
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
    // reset course on series change
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
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <Select
            value={selectedSeriesId ?? 'all'}
            onValueChange={(v) => handleSeriesChange(v === 'all' ? undefined : v)}
            disabled={isLoading || isError}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder={isLoading ? 'Loading...' : seriesPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Series</SelectItem>
              {seriesList.map((s) => (
                <SelectItem key={s.id} value={s.id}>
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
              disabled={isLoading || isError || !selectedSeriesId}
            >
              <SelectTrigger className="w-52">
                <SelectValue placeholder={selectedSeriesId ? coursePlaceholder : 'Select a series first'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courseList.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
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
    </div>
  )
}
