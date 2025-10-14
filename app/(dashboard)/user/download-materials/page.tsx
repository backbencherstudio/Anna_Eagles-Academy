'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LectureSlides from '@/app/_components/Student/Download_Materials/LectureSlides'
import VideoLectures from '@/app/_components/Student/Download_Materials/VideoLectures'
import AudioLessons from '@/app/_components/Student/Download_Materials/AudioLessons'
import OtherDocument from '@/app/_components/Student/Download_Materials/OtherDocument'
import SeriesFilterStudentResauble from '@/components/Resuable/SeriesFilter/SeriesFilterStudentResauble'
import { useAppDispatch } from '@/rtk/hooks'
import { setLectureType, setSeriesId, setCourseId, type LectureType } from '@/rtk/slices/users/studentDownloadMetrialsSlice'

export default function DownloadMaterials() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('lecture-slides')

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && ['lecture-slides', 'video-lectures', 'audio-lessons', 'other-document'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    dispatch(setLectureType(value as LectureType))
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg  font-semibold">Official Course Materials</h1>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Tabs Navigation */}
        <TabsList className="w-full justify-start rounded-xl bg-white py-2 px-1 ">
          <TabsTrigger
            value="lecture-slides"
            className="text-muted-foreground cursor-pointer py-3 px-4 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.1)] text-sm font-medium"
          >
            Lecture Slides
          </TabsTrigger>
          <TabsTrigger
            value="video-lectures"
            className="text-muted-foreground cursor-pointer py-3 px-4 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.1)] text-sm font-medium"
          >
            Video Lectures
          </TabsTrigger>
          <TabsTrigger
            value="audio-lessons"
            className="text-muted-foreground cursor-pointer py-3 px-4 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.1)] text-sm font-medium"
          >
            Audio Lessons
          </TabsTrigger>
          <TabsTrigger
            value="other-document"
            className="text-muted-foreground cursor-pointer py-3 px-4 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.1)] text-sm font-medium"
          >
            Other Document
          </TabsTrigger>
        </TabsList>

        <div>
          <SeriesFilterStudentResauble
            seriesLabel="Select Series"
            courseLabel="Select Course"
            seriesPlaceholder="Select series"
            coursePlaceholder="Select course"
            className="max-w-xl ml-auto mt-6 "
            onSeriesChange={(sid) => dispatch(setSeriesId(sid))}
            onCourseChange={(cid) => dispatch(setCourseId(cid))}
          />

          {/* Tab Contents */}
          <TabsContent value="lecture-slides">
            <LectureSlides />
          </TabsContent>
          <TabsContent value="video-lectures">
            <VideoLectures />
          </TabsContent>
          <TabsContent value="audio-lessons">
            <AudioLessons />
          </TabsContent>
          <TabsContent value="other-document">
            <OtherDocument />
          </TabsContent>
        </div>

      </Tabs>
    </div>
  )
}
