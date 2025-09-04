'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Download } from 'lucide-react'
import Image from 'next/image'
import VideoIcon from '@/components/Icons/DownloadMaterials/VideoIcon'
import PlayIcon from '@/components/Icons/DownloadMaterials/PlayIcon'
import VideoModal from '@/components/Resuable/VideoModal'

type VideoLecture = {
    id: string
    title: string
    description: string
    week: string
    duration: string
    thumbnail?: string
    video_url: string
}

const mockVideoLectures: VideoLecture[] = [
    {
        id: '1',
        title: 'Lesson 1 - Key Concepts Explained',
        description: 'Review the introductory concepts of this course. You can navigate through the slides below.',
        week: 'Week 1',
        duration: '12 mins',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: ''
    },
    {
        id: '2',
        title: 'Lesson 1 - Key Concepts Explained',
        description: 'Review the introductory concepts of this course. You can navigate through the slides below.',
        week: 'Week 1',
        duration: '12 mins',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: ''
    },
    {
        id: '3',
        title: 'Lesson 1 - Key Concepts Explained',
        description: 'Review the introductory concepts of this course. You can navigate through the slides below.',
        week: 'Week 1',
        duration: '12 mins',
        video_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        thumbnail: ''
    }
]



export default function VideoLectures() {
    const [open, setOpen] = useState(false)
    const [currentUrl, setCurrentUrl] = useState<string>('')

    const handlePlayClick = (videoUrl: string) => {
        setCurrentUrl(videoUrl)
        setOpen(true)
    }

    return (
        <div className="space-y-6 bg-white rounded-xl p-4">
            {/* Files Section Header */}
            <div className="flex items-center gap-3">
                <VideoIcon />
                <h2 className="text-lg font-semibold text-gray-800">Video Lectures</h2>
            </div>

            {/* Video Lectures Grid */}
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {mockVideoLectures.map((video, index) => (
                    <Card key={video.id} className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <CardContent className="p-0">
                            {/* Video Thumbnail */}
                            <div className="relative p-2">
                                <div className="w-full h-48 bg-gray-200 relative overflow-hidden rounded-xl">
                                    {video.thumbnail ? (
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br flex items-center justify-center">
                                            <PlayIcon />
                                        </div>
                                    )}

                                    {/* Play Button Overlay */}
                                    <div 
                                        className="absolute inset-0 hover:scale-110 transition-all duration-300 cursor-pointer flex items-center justify-center"
                                        onClick={() => handlePlayClick(video.video_url)}
                                    >
                                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                                            <PlayIcon />
                                        </div>
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                        {video.duration}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {video.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {video.description}
                                </p>

                                {/* Action Button */}
                                <Button
                                    className={`w-fit text-sm font-medium py-2 cursor-pointer ${index === 0
                                        ? 'bg-[#0F2598] text-white hover:bg-[#0F2598]/90'
                                        : 'bg-gray-500 text-white hover:bg-gray-600'
                                        }`}
                                    size="sm"
                                    onClick={() => handlePlayClick(video.video_url)}
                                >
                                    Only Watch Video
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {mockVideoLectures.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <PlayIcon />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Video Lectures Available</h3>
                    <p className="text-gray-500">Check back later for video content.</p>
                </div>
            )}


            <VideoModal
                open={open}
                onOpenChange={setOpen}
                videoSrc={currentUrl}
                title="Video Lecture"
                autoPlay
            />
        </div>
    )
}
