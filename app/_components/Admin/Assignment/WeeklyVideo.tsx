'use client'
import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import CameraIcon from '@/components/Icons/CameraIcon'
import VideoModal from '@/components/Resuable/VideoModal'
import { useGetSingleStudentFileDownloadQuery } from '@/rtk/api/admin/studentFileDownloadApis'

type VideoItem = {
  id: string
  title: string
  weekLabel: string
  dateText: string
  video_url: string
}

export default function WeeklyVideo({ studentId }: { studentId: string }) {
  const { data } = useGetSingleStudentFileDownloadQuery({ student_id: studentId, section_type: 'Weekly Video Diary' })
  const [open, setOpen] = useState(false)
  const [currentUrl, setCurrentUrl] = useState<string>('')

  const handlePlayClick = (videoUrl: string) => {
    setCurrentUrl(videoUrl)
    setOpen(true)
  }

  const videos: VideoItem[] = useMemo(() => {
    const files: any[] = data?.data?.student_files ?? []
    return files
      .filter(f => f.section_type === 'Weekly Video Diary')
      .map(f => ({
        id: f.id,
        title: f.url?.split('/')?.pop() ?? 'Video Diary',
        weekLabel: f.week_number ? `Week ${f.week_number}` : 'Week',
        dateText: new Date(f.created_at).toLocaleDateString(),
        video_url: f.file_url,
      }))
  }, [data])

  return (
    <Card className="border rounded-xl border-[#ECEFF3]">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CameraIcon />
            <h3 className="text-lg font-semibold">Weekly Video Diaries</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <Card key={v.id} className="rounded-2xl border border-[#ECEFF3] shadow-none">
                <div className="p-4">
                  <div
                    className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted/60 flex items-center justify-center cursor-pointer"
                    onClick={() => handlePlayClick(v.video_url)}
                    role="button"
                    aria-label={`Play ${v.title}`}
                  >
                    <div className="h-12 w-12 rounded-full bg-background shadow flex items-center justify-center">
                      <div className="ml-0.5 h-0 w-0 border-y-8 border-y-transparent border-l-[14px] border-l-foreground" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <CardTitle className="text-base font-semibold">{v.title}</CardTitle>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                    <span className="rounded-full border px-3 py-1 text-xs">{v.weekLabel}</span>
                    <span>{v.dateText}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
      <VideoModal
        open={open}
        onOpenChange={setOpen}
        videoSrc={currentUrl}
        title="Weekly Video"
        autoPlay
      />
    </Card>
  )
}
