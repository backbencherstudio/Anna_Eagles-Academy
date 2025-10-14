'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import VideoIcon from '@/components/Icons/DownloadMaterials/VideoIcon'
import VideoModal from '@/components/Resuable/VideoModal'
import VideoCard from '@/components/Resuable/VideoCard'
import { Play } from 'lucide-react'
import { useAppSelector } from '@/rtk/hooks'
import { useGetAllStudentDownloadMaterialsQuery } from '@/rtk/api/users/studentDownloadMetrialsApis'
import { GridSkeletonLoader } from '@/components/Resuable/SkeletonLoader'

type VideoLecture = {
    id: string
    title: string
    description: string
    duration?: string
    thumbnail?: string
    video_url: string
}

export default function VideoLectures() {
    const [open, setOpen] = useState(false)
    const [currentUrl, setCurrentUrl] = useState<string>('')

    const filters = useAppSelector((state) => state.studentDownloadMetrials)
    const { data, isLoading: isMaterialsLoading } = useGetAllStudentDownloadMaterialsQuery({
        series_id: filters.series_id ?? '',
        course_id: filters.course_id ?? '',
        lecture_type: 'video-lectures',
        page: filters.page,
        limit: filters.limit,
    })

    const apiVideos: VideoLecture[] = React.useMemo(() => {
        const materials = (data as any)?.data?.materials ?? []
        const uniqueById = Array.from(
            new Map(
                materials
                    .filter((m: any) => m.lecture_type === 'video-lectures')
                    .map((m: any) => [m.id, m])
            ).values()
        )
        return uniqueById.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description ?? '',
            video_url: m.file_url,
            thumbnail: '',
            duration: undefined,
        }))
    }, [data])

    const handlePlayClick = (videoUrl: string) => {
        setCurrentUrl(videoUrl)
        setOpen(true)
    }

    return (
        <Card className="border rounded-xl border-[#ECEFF3]">
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <VideoIcon />
                        <h3 className="text-lg font-semibold">Video Lectures</h3>
                    </div>

                    {/* Loading State */}
                    {isMaterialsLoading ? (
                        <GridSkeletonLoader count={3} type="video" />
                    ) : (
                        /* Video Lectures Grid */
                        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                            {apiVideos.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    id={video.id}
                                    title={video.title}
                                    videoUrl={video.video_url}
                                    duration={video.duration}
                                    type="Video Lecture"
                                    onPlay={handlePlayClick}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {(!isMaterialsLoading && apiVideos.length === 0) && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <Play className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Video Lectures Available</h3>
                            <p className="text-gray-500">Check back later for video content.</p>
                        </div>
                    )}
                </div>
            </CardContent>

            <VideoModal
                open={open}
                onOpenChange={setOpen}
                videoSrc={currentUrl}
                title="Video Lecture"
                autoPlay
            />
        </Card>
    )
}
