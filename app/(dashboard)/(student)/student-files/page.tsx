import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import WeeklyVideoDiaries from '../../_components/Student/StudentFile/WeeklyVideoDiaries'
import OtherFileSubmissions from '../../_components/Student/StudentFile/OtherFileSubmissions'

export default function StudentFiles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl xl:text-2xl font-semibold ">Student Files Upload</h1>
        <Button className='bg-[#0F2598] text-white hover:bg-[#0F2598]/90 cursor-pointer'>Upload Files</Button>
      </div>

      <Tabs defaultValue="video" className="w-full">
        {/* tabs buttons */}
        <TabsList className="w-full justify-start rounded-xl bg-white py-7 px-2  ">
          <TabsTrigger value="video" className="text-muted-foreground cursor-pointer py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm">Weekly Video Diaries</TabsTrigger>

          <TabsTrigger value="others" className="cursor-pointer text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm">Other File Submissions</TabsTrigger>
        </TabsList>
        {/* tabs content */}
        <TabsContent value="video">
          <WeeklyVideoDiaries />
        </TabsContent>
        <TabsContent value="others">
          <OtherFileSubmissions />
        </TabsContent>
      </Tabs>
    </div>
  )
}
