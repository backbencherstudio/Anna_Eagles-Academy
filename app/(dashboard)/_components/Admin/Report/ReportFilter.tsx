'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ReportFilterProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function ReportFilter({ activeTab, onTabChange }: ReportFilterProps) {
  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full justify-start rounded-xl bg-white py-2 px-2">
          <TabsTrigger 
            value="website-usage" 
            className="text-muted-foreground cursor-pointer w-fit sm:w-1/4 py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm"
          >
           Website Usage
          </TabsTrigger>
          <TabsTrigger 
            value="course-progress" 
            className="cursor-pointer w-fit sm:w-1/4 text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm"
          >
           Course Progress
          </TabsTrigger>
          <TabsTrigger 
            value="payments" 
            className="cursor-pointer w-fit sm:w-1/4 text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger 
            value="enrollment" 
            className="cursor-pointer w-fit sm:w-1/4 text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm"
          >
            Enrollment
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}