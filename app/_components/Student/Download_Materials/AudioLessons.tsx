'use client'
import React from 'react'
import { Headphones } from 'lucide-react'
import AudioIcon from '@/components/Icons/DownloadMaterials/AudioIcon'
import AutoPlayer from '@/components/Resuable/AutoPlayer'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCurrentAudio, playAudio, pauseAudio } from '@/redux/slices/audioSlice'
import FilterDropdown from '@/components/Resuable/FilterDropdown'


type AudioLesson = {
    id: string
    title: string
    description: string
    week: string
    audio_url: string
}

const mockAudioLessons: AudioLesson[] = [
    {
        id: '1',
        title: 'Lesson 1 - Key Concepts Explained',
        description: 'Review the introductory concepts of this course. You can navigate through the slides below.',
        week: 'Week 1',
        audio_url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
    },
    {
        id: '2',
        title: 'Lesson 2 - Advanced Topics',
        description: 'Deep dive into advanced concepts and practical applications for better understanding.',
        week: 'Week 2',
        audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
        id: '3',
        title: 'Lesson 3 - Final Review',
        description: 'Comprehensive review of all topics covered in this course module.',
        week: 'Week 3',
        audio_url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
    }
]

export default function AudioLessons() {
    const dispatch = useAppDispatch()
    const { currentPlayingId, isPlaying } = useAppSelector((state) => state.audio)
    const [series, setSeries] = React.useState<string>('')
    const [weekFilter, setWeekFilter] = React.useState<string>('')
    const handlePrimaryButtonClick = (lesson: AudioLesson) => {
        const isCurrent = currentPlayingId === lesson.id
        if (!isCurrent) {
            dispatch(setCurrentAudio({ id: lesson.id, url: lesson.audio_url }))
            return
        }
        if (isPlaying) {
            dispatch(pauseAudio())
        } else {
            dispatch(playAudio())
        }
    }


    return (
        <div className="space-y-6 bg-white rounded-xl p-4">
            {/* Files Section Header */}
            <div className='flex items-center justify-between'>
                <div className="flex items-center gap-3">
                    <AudioIcon />
                    <h2 className="text-lg font-semibold text-gray-800">Audio Lessons</h2>
                </div>
                <div className='flex items-center gap-3'>
                    <FilterDropdown
                        options={[
                            { label: 'Select Series', value: '' },
                            { label: 'Series A', value: 'a' },
                            { label: 'Series B', value: 'b' },
                            { label: 'Series C', value: 'c' },
                        ]}
                        value={series}
                        onChange={setSeries}
                        placeholder="Select Series"
                        className='w-48'
                    />
                    <FilterDropdown
                        options={[
                            { label: 'All Weeks', value: '' },
                            { label: 'Week 1', value: 'Week 1' },
                            { label: 'Week 2', value: 'Week 2' },
                            { label: 'Week 3', value: 'Week 3' },
                        ]}
                        value={weekFilter}
                        onChange={setWeekFilter}
                        placeholder="Week"
                        className='w-48'
                    />
                </div>
            </div>

            {/* Audio Lessons Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {mockAudioLessons
                    .filter(lesson => (weekFilter ? lesson.week === weekFilter : true))
                    .map((lesson, index) => {
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

                                {/* Action Button */}
                                <button
                                    onClick={() => handlePrimaryButtonClick(lesson)}
                                    className={`w-full cursor-pointer py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${isCurrentlyPlaying
                                            ? (isPlaying ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#0F2598] text-white hover:bg-[#0F2598]/90')
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}
                                >
                                    {isCurrentlyPlaying ? (isPlaying ? 'Pause Audio' : 'Play Audio') : 'Only listen'}
                                </button>
                            </div>
                        );
                    })}
            </div>


            {/* Empty State */}
            {mockAudioLessons.length === 0 && (
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
