'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import WeeklyVideoDiaries from '@/app/_components/Student/StudentFile/WeeklyVideoDiaries'
import OtherFileSubmissions from '@/app/_components/Student/StudentFile/OtherFileSubmissions'
import { useGetAllStudentFilesQuery } from '@/rtk/api/users/studentFileApis'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setSectionType } from '@/rtk/slices/users/studentFileSlice'
import StudentFileUploadModal from '@/app/_components/Student/StudentFile/StudentFileUploadModal'

export default function StudentFiles() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('video')
  const dispatch = useAppDispatch()
  const sectionType = useAppSelector((s) => s.studentFile.sectionType)

  const { data, isLoading, isFetching } = useGetAllStudentFilesQuery({ section_type: sectionType })

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
    dispatch(setSectionType(value === 'video' ? 'weekly-video-diary' : 'other-document'))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between">
        <h1 className="text-lg  font-semibold ">Student Files Upload</h1>
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
          {(isLoading || isFetching) ? (
            <div className="border rounded-xl border-[#ECEFF3] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-[#ECEFF3] shadow-none p-4">
                    <div className="aspect-video w-full rounded-xl bg-gray-200 animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded mt-4 animate-pulse" />
                    <div className="flex justify-between mt-6">
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <WeeklyVideoDiaries items={(data?.data?.student_files ?? []).filter((f: any) => f.section_type === 'weekly-video-diary')} />
          )}
        </TabsContent>
        <TabsContent value="others">
          {(isLoading || isFetching) ? (
            <div className="border rounded-xl border-[#ECEFF3] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-6 rounded bg-gray-200 animate-pulse" />
                <div className="h-5 w-56 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3 rounded-xl border border-[#ECEFF3] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-start gap-3 min-w-0">
                      <div className="mt-0.5 h-9 w-9 rounded-md bg-gray-200 animate-pulse" />
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="flex gap-4">
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <OtherFileSubmissions items={(data?.data?.student_files ?? []).filter((f: any) => f.section_type === 'other-document')} />
          )}
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
