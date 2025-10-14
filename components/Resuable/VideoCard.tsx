'use client'
import React from 'react'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'

type VideoCardProps = {
    id: string
    title: string
    videoUrl: string
    duration?: string
    type?: string
    date?: string
    onPlay: (videoUrl: string) => void
    showDeleteButton?: boolean
    onDelete?: () => void
    isDeleting?: boolean
    deleteButtonText?: string
}

export default function VideoCard({
    id,
    title,
    videoUrl,
    duration,
    type = "Video",
    date,
    onPlay,
    showDeleteButton = false,
    onDelete,
    isDeleting = false,
    deleteButtonText = "Delete"
}: VideoCardProps) {
    return (
        <Card className="rounded-2xl border border-[#ECEFF3] shadow-none">
            <div className="p-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                    <video
                        key={videoUrl}
                        className="h-full w-full object-contain"
                        playsInline
                        preload="metadata"
                        crossOrigin="anonymous"
                    >
                        <source src={videoUrl} type="video/mp4" />
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
                        onClick={() => onPlay(videoUrl)}
                        className="absolute inset-0 cursor-pointer bg-transparent"
                    />
                </div>

                <div className="mt-4">
                    <CardTitle className="text-base font-semibold truncate" title={title}>
                        {title}
                    </CardTitle>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                    <span className="rounded-full border px-3 py-1 text-xs">{type}</span>
                    {date && <span>{date}</span>}
                    {duration && !date && <span>{duration}</span>}
                </div>

                <div className="mt-3 flex justify-end gap-2">
                    {showDeleteButton && onDelete && (
                        <Button
                            onClick={onDelete}
                            disabled={isDeleting}
                            variant="outline"
                            className="cursor-pointer text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs"
                        >
                            {deleteButtonText}
                        </Button>
                    )}
                    <Button
                        onClick={() => onPlay(videoUrl)}
                        className="cursor-pointer bg-[#0F2598] text-white hover:bg-[#0F2598]/90 text-xs"
                        size="sm"
                    >
                        {type === "Video Lecture" ? "Watch Video" : "Play"}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
