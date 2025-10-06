
import React from 'react'
import CompletionStatusPieChart from '@/app/_components/Admin/Report/CoursesProgress/CompletionStatusPieChart'
import CourseCompletionRatesChart from '@/app/_components/Admin/Report/CoursesProgress/CourseCompletionRatesChart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CourseDetailsTable from '@/app/_components/Admin/Report/CoursesProgress/CourseDetailsTable'

export default function CourseProgressCard() {
  return (
    <div>

      <div className='flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between mb-6'>
        <div className='flex flex-col '>
          <h1 className='text-[#1D1F2C] lg:text-xl text-lg font-semibold'>Course Progress Report</h1>
          <p className='text-[#777980] text-sm'>Track student completion rates and progress</p>
        </div>

        {/* drop down for course selection */}
        <div>
          <Select>
            <SelectTrigger className='min-w-[180px] rounded-full border-gray-300 bg-white px-4 py-5 text-sm '>
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='cursor-pointer' value="1">Foundations of Faith</SelectItem>
              <SelectItem className='cursor-pointer' value="2">The Life and Teachings of Jesus</SelectItem>
              <SelectItem className='cursor-pointer' value="3">Christian Leadership & Servanthood</SelectItem>
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
