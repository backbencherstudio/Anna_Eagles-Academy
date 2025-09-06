'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface FilterTabCourseProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function FilterTabCourse({ activeTab, onTabChange }: FilterTabCourseProps) {
  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full justify-start rounded-xl bg-white py-2 px-2">
          <TabsTrigger 
            value="all" 
            className="text-muted-foreground cursor-pointer w-fit sm:w-1/4 py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm"
          >
            All Students
          </TabsTrigger>
          <TabsTrigger 
            value="paid" 
            className="cursor-pointer w-fit sm:w-1/4 text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm"
          >
            Paid Student
          </TabsTrigger>
          <TabsTrigger 
            value="free" 
            className="cursor-pointer w-fit sm:w-1/4 text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm"
          >
            Free Student
          </TabsTrigger>
          <TabsTrigger 
            value="scholarship" 
            className="cursor-pointer w-fit sm:w-1/4 text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm"
          >
            Scholarship Student
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
