'use client'
import React from 'react'
import { Headphones } from 'lucide-react'
import AudioIcon from '@/components/Icons/DownloadMaterials/AudioIcon'
import AutoPlayer from '@/components/Resuable/AutoPlayer'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setCurrentAudio, playAudio, pauseAudio } from '@/rtk/slices/audioSlice'
import { useGetAllStudentDownloadMaterialsQuery } from '@/rtk/api/users/studentDownloadMetrialsApis'
import { studentDownloadMaterialsApi } from '@/rtk/api/users/studentDownloadMetrialsApis'
import { GridSkeletonLoader } from '@/components/Resuable/SkeletonLoader'



type AudioLesson = {
    id: string
    title: string
    description: string
    audio_url: string
}

export default function AudioLessons() {
    const dispatch = useAppDispatch()
    const { currentPlayingId, isPlaying } = useAppSelector((state) => state.audio)
    const filters = useAppSelector((state) => state.studentDownloadMetrials)
    const [pendingId, setPendingId] = React.useState<string | null>(null)
    const [triggerGetSingle] = studentDownloadMaterialsApi.useLazyGetSingleStudentDownloadMaterialQuery()


    // Trigger API fetch based on global filters
    const { data, isLoading: isMaterialsLoading } = useGetAllStudentDownloadMaterialsQuery({
        series_id: filters.series_id ?? '',
        course_id: filters.course_id ?? '',
        lecture_type: 'audio-lessons',
        page: filters.page,
        limit: filters.limit,
    })

    const apiLessons: AudioLesson[] = React.useMemo(() => {
        const materials = (data as any)?.data?.materials ?? []
        const uniqueById = Array.from(
            new Map(
                materials
                    .filter((m: any) => m.lecture_type === 'audio-lessons')
                    .map((m: any) => [m.id, m])
            ).values()
        )
        return uniqueById.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description ?? '',
            audio_url: m.file_url,
        }))
    }, [data])
    const handlePrimaryButtonClick = async (lesson: AudioLesson) => {
        const isCurrent = currentPlayingId === lesson.id
        if (!isCurrent) {
            try {
                setPendingId(lesson.id)
                dispatch(pauseAudio())
                const res: any = await triggerGetSingle(lesson.id).unwrap()
                const url: string = res?.data?.file_url ?? lesson.audio_url
                dispatch(setCurrentAudio({ id: lesson.id, url }))
                dispatch(playAudio())
            } catch {
                dispatch(setCurrentAudio({ id: lesson.id, url: lesson.audio_url }))
                dispatch(playAudio())
            } finally {
                setPendingId(null)
            }
            return
        }
        dispatch(isPlaying ? pauseAudio() : playAudio())
    }


    return (
        <div className="space-y-6 bg-white rounded-xl p-4">
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className="flex items-center gap-3">
                    <AudioIcon />
                    <h2 className="text-lg font-semibold text-gray-800">Audio Lessons</h2>
                </div>

            </div>

            {/* Grid */}
            {isMaterialsLoading ? (
                <GridSkeletonLoader count={3} type="audio" />
            ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {apiLessons
                        .map((lesson) => {
                            const isCurrentlyPlaying = currentPlayingId === lesson.id

                            return (
                                <div key={lesson.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                                    {/* Audio Player Area */}
                                    <AutoPlayer
                                        audioUrl={lesson.audio_url}
                                        title={lesson.title}
                                        audioId={lesson.id}
                                    />

                                    {/* Lesson Details */}
                                    <div className="mb-3 sm:mb-4">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                                            {lesson.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                            {lesson.description}
                                        </p>
                                    </div>

                                    {/* Action */}
                                    <button
                                        onClick={() => handlePrimaryButtonClick(lesson)}
                                        disabled={pendingId === lesson.id}
                                        className={`w-full cursor-pointer py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${isCurrentlyPlaying
                                            ? (isPlaying ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#0F2598] text-white hover:bg-[#0F2598]/90')
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                    >
                                        {pendingId === lesson.id
                                            ? 'Loading...'
                                            : isCurrentlyPlaying
                                                ? (isPlaying ? 'Pause Audio' : 'Play Audio')
                                                : 'Only listen'}
                                    </button>
                                </div>
                            );
                        })}
                </div>
            )}


            {/* Empty state */}
            {(!isMaterialsLoading && apiLessons.length === 0) && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Headphones className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Audio Lessons Available</h3>
                    <p className="text-gray-500">Check back later for audio content.</p>
                </div>
            )}
        </div>
    )
}
