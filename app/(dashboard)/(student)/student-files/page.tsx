'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import WeeklyVideoDiaries from '../../_components/Student/StudentFile/WeeklyVideoDiaries'
import OtherFileSubmissions from '../../_components/Student/StudentFile/OtherFileSubmissions'
import StudentFileUploadModal from '../../_components/Student/StudentFile/StudentFileUploadModal'

export default function StudentFiles() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('video')

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && ['video', 'others'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between">
        <h1 className="text-lg xl:text-2xl font-semibold ">Student Files Upload</h1>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className='bg-[#0F2598] text-white hover:bg-[#0F2598]/90 cursor-pointer'
        >
          Upload Files
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* tabs buttons */}
        <TabsList className="w-full justify-start rounded-xl bg-white py-2 px-2">
          <TabsTrigger value="video" className="text-muted-foreground cursor-pointer w-fit sm:w-1/2 py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm">Weekly Video Diaries</TabsTrigger>

          <TabsTrigger value="others" className="cursor-pointer w-fit sm:w-1/2 text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm">Other File Submissions</TabsTrigger>
        </TabsList>
        {/* tabs content */}
        <TabsContent value="video">
          <WeeklyVideoDiaries />
        </TabsContent>
        <TabsContent value="others">
          <OtherFileSubmissions />
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      <StudentFileUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />
    </div>
  )
}
