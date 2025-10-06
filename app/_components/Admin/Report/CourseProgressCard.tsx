
import React from 'react'
import CompletionStatusPieChart from '@/app/_components/Admin/Report/CoursesProgress/CompletionStatusPieChart'
import CourseCompletionRatesChart from '@/app/_components/Admin/Report/CoursesProgress/CourseCompletionRatesChart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CourseDetailsTable from '@/app/_components/Admin/Report/CoursesProgress/CourseDetailsTable'
import { useGetSeriesWithCoursesQuery } from '@/rtk/api/admin/courseFilterApis'
import { useEffect, useState } from 'react'
import { useGetSeriesProgressQuery } from '@/rtk/api/admin/reportApis'

export default function CourseProgressCard() {
  const { data, isLoading, isError } = useGetSeriesWithCoursesQuery()
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | undefined>(undefined)
  const { refetch } = useGetSeriesProgressQuery(
    selectedSeriesId && selectedSeriesId !== 'all' ? { series_id: selectedSeriesId } : {},
    { skip: false }
  )
  return (
    <div>

      <div className='flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between mb-6'>
        <div className='flex flex-col '>
          <h1 className='text-[#1D1F2C] lg:text-xl text-lg font-semibold'>Course Progress Report</h1>
          <p className='text-[#777980] text-sm'>Track student completion rates and progress</p>
        </div>

        {/* drop down for series selection */}
        <div>
          <Select onValueChange={(val) => { setSelectedSeriesId(val); setTimeout(() => { refetch() }, 0) }}>
            <SelectTrigger className='min-w-[180px] rounded-full border-gray-300 bg-white px-4 py-5 text-sm '>
              <SelectValue placeholder="All Series" />
            </SelectTrigger>
            <SelectContent>
              {isLoading && (
                <SelectItem className='cursor-default' value="loading" disabled>
                  Loading...
                </SelectItem>
              )}
              {isError && (
                <SelectItem className='cursor-default' value="error" disabled>
                  Failed to load series
                </SelectItem>
              )}
              <SelectItem className='cursor-pointer' value="all">All Series</SelectItem>
              {data?.data?.map((series) => (
                <SelectItem key={series.id} className='cursor-pointer' value={series.id}>
                  {series.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
          <CompletionStatusPieChart />
          <CourseCompletionRatesChart />
        </div>
        <CourseDetailsTable />
      </div>
    </div>
  )
}
