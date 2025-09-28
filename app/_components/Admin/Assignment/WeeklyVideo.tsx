'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import CameraIcon from '@/components/Icons/CameraIcon'
import VideoModal from '@/components/Resuable/VideoModal'

type VideoItem = {
  id: string
  title: string
  weekLabel: string
  dateText: string
  video_url: string
}

const mockVideos: VideoItem[] = [
  { id: '1', title: 'Week 1 Video Diary.mp4', weekLabel: 'Week 1', dateText: 'Jan 10, 2025', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: '2', title: 'Week 2 Video Diary.mp4', weekLabel: 'Week 2', dateText: 'Jan 18, 2025', video_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
  { id: '3', title: 'Week 3 Video Diary.mp4', weekLabel: 'Week 3', dateText: 'Jan 20, 2025', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
]

export default function WeeklyVideo() {
  const [open, setOpen] = useState(false)
  const [currentUrl, setCurrentUrl] = useState<string>('')

  const handlePlayClick = (videoUrl: string) => {
    setCurrentUrl(videoUrl)
    setOpen(true)
  }

  return (
    <Card className="border rounded-xl border-[#ECEFF3]">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CameraIcon />
            <h3 className="text-lg font-semibold">Weekly Video Diaries</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockVideos.map((v) => (
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
