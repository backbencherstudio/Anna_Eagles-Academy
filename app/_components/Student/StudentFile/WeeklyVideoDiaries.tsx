'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CameraIcon from '@/components/Icons/CameraIcon'
import VideoModal from '@/components/Resuable/VideoModal'
import { Play } from 'lucide-react'

type StudentFileItem = {
    id: string
    created_at: string
    file_url: string
    url?: string
    course?: { title: string }
    series?: { title: string }
}

export default function WeeklyVideoDiaries({ items = [] as StudentFileItem[] }: { items?: StudentFileItem[] }) {
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


                    {/* videos */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((v) => {
                            const dateText = new Date(v.created_at).toLocaleDateString()
                            const fileName = v.url || v.file_url?.split('/').pop() || 'Video'
                            const composed = [v.series?.title, v.course?.title].filter(Boolean).join(' - ')
                            const title = composed || fileName
                            return (
                                <Card key={v.id} className="rounded-2xl border border-[#ECEFF3] shadow-none">
                                    <div className="p-4">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                                            <video
                                                key={v.file_url}
                                                className="h-full w-full object-contain"
                                                playsInline
                                                preload="metadata"
                                                crossOrigin="anonymous"
                                            >
                                                <source src={v.file_url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                            {/* Play icon overlay */}
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                                <div className="h-12 w-12 rounded-full bg-background/90 shadow flex items-center justify-center">
                                                    <Play className="h-6 w-6 ml-0.5" />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                aria-label={`Open modal for ${title}`}
                                                onClick={() => handlePlayClick(v.file_url)}
                                                className="absolute inset-0 cursor-pointer bg-transparent"
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <CardTitle className="text-base font-semibold truncate" title={title}>{title}</CardTitle>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                                            <span className="rounded-full border px-3 py-1 text-xs">Video</span>
                                            <span>{dateText}</span>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
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
