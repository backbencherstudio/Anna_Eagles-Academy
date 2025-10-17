import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Play, Clock, Lock } from 'lucide-react'
import VideoModal from '@/components/Resuable/VideoModal'
import Link from 'next/link'

// Removed demo/sample data. All content renders from props now.

interface CourseItem {
    id: string
    title: string
    intro_video_url?: string | null
    end_video_url?: string | null
    lesson_files?: { id: string; title: string; url: string; doc?: string | null; kind?: string; video_length?: string | null; is_unlocked?: boolean }[]
    video_length?: string | null
}

interface EnrolledSeries {
    title?: string
    enrollment?: { progress_percentage?: number | null }
    courses?: CourseItem[]
}

interface CompleteCourseProps {
    enrolledSeries?: EnrolledSeries | null
}

export default function CompleteCourse({ enrolledSeries }: CompleteCourseProps) {
    const [openIntro, setOpenIntro] = useState(false)
    const [openEnd, setOpenEnd] = useState(false)
    const seriesTitle = enrolledSeries?.title || '—'
    const course: CourseItem | null = enrolledSeries?.courses?.[0] || null
    const progressPercentage = enrolledSeries?.enrollment?.progress_percentage ?? 0
    const lessons = (course?.lesson_files || []).map((f) => ({
        id: f.id,
        title: f.title,
        duration: f.video_length || '',
        isUnlocked: f.is_unlocked === true,
    }))
    // lessons length available via lessons.length if needed
    const progress = Math.max(0, Math.min(100, progressPercentage ?? 0))
    return (
        <div className="w-full bg-white rounded-2xl p-4 sm:p-6 shadow mb-5">
            {/* Smart Accordion - Click to show/hide full course content */}
            <Accordion type="single" collapsible className="w-full" defaultValue="course-content">
                <AccordionItem value="course-content" className="border-none">
                    {/* Series Header - Clickable to expand/collapse */}
                    <AccordionTrigger className="text-blue-800 text-xs sm:text-sm font-medium hover:no-underline transition-all duration-200 w-full justify-between p-0">
                        <span className='text-[#0F2598] bg-[#0F25981A] border-[#0F25981A] border px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm'>Series: {seriesTitle}</span>
                    </AccordionTrigger>

                    {/* Full Course Content - Shows when expanded */}
                    <AccordionContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                        {/* Introduction Video Card */}
                        <div className="border border-[#ECEFF3] rounded-xl p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-9 sm:w-16 sm:h-12 bg-black rounded-lg relative overflow-hidden flex-shrink-0">
                                        {/* Abstract wavy pattern background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-green-600/20 opacity-30"></div>
                                        <div className="absolute top-1 left-1 w-3 h-3 sm:w-4 sm:h-4 bg-teal-500/40 rounded-full blur-sm"></div>
                                        <div className="absolute bottom-1 right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500/40 rounded-full blur-sm"></div>

                                        {/* White circular play button */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <Play className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-base text-[#1D1F2C] font-medium leading-relaxed break-words">Introduction to what this lesson covers.</p>
                                    </div>
                                </div>
                                <Button onClick={() => setOpenIntro(true)} disabled={!course?.intro_video_url} variant="outline" size="sm" className="flex items-center gap-2 bg-blue-50 border-blue-200 text-[#0F2598] hover:bg-[#ECEFF3] cursor-pointer text-xs sm:text-sm px-3 py-2 w-full sm:w-auto justify-center disabled:opacity-60">
                                    <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="">Watch a Video</span>
                                </Button>
                            </div>
                        </div>


                        {/* Course Overview */}
                        <div className='border border-[#ECEFF3] rounded-xl p-4'>
                            <div>
                                <div className="pb-3 sm:pb-4">
                                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                                        {course?.title || '—'}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-3 sm:mt-4">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs sm:text-sm text-gray-600 font-medium">{course?.video_length || ''}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                                        <div
                                            className="bg-[#12B76A] h-2 sm:h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">
                                        {progress}% completed
                                    </span>
                                </div>

                            </div>

                            {/* Lessons List */}
                            <div className="space-y-2 sm:space-y-3 mt-4">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Course Lessons</h3>
                                {lessons.map((lesson, index) => (
                                    lesson.isUnlocked ? (
                                        <Link key={lesson.id} href={`/user/courses-modules/${lesson.id}`} className="block">
                                            <Card
                                                className={`border transition-all duration-200 hover:shadow-md bg-[#FFFCF8] border-[#F2E6D6] hover:border-[#F0D9BF] cursor-pointer`}
                                            >
                                                <CardContent className="p-3 sm:p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 bg-[#F1C27D]`}>
                                                            <Play className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className={`font-medium transition-colors text-sm sm:text-base leading-tight text-gray-900`}>
                                                                {lesson.title}
                                                            </h3>
                                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{lesson.duration}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ) : (
                                        <div key={lesson.id} className="block">
                                            <Card
                                                className={`border transition-all duration-200 bg-gray-50 border-gray-200 cursor-not-allowed`}
                                            >
                                                <CardContent className="p-3 sm:p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 bg-gray-200`}>
                                                            <Lock className="w-3 h-3 sm:w-5 sm:h-5 text-gray-500" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className={`font-medium transition-colors text-sm sm:text-base leading-tight text-gray-500`}>
                                                                {lesson.title}
                                                            </h3>
                                                            <p className="text-xs sm:text-sm text-gray-400 mt-1">{lesson.duration}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Recap Video Card */}
                        <Card className="border border-[#ECEFF3]">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-9 sm:w-16 sm:h-12 bg-black rounded-lg flex items-center justify-center shadow-md flex-shrink-0">

                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <Play className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" />
                                            </div>

                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed break-words">Here's a quick recap of the lesson's highlights!</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => setOpenEnd(true)} disabled={!course?.end_video_url} variant="outline" size="sm" className="flex items-center gap-2 bg-blue-50 border-blue-200 text-[#0F2598] hover:bg-[#ECEFF3] cursor-pointer text-xs sm:text-sm px-3 py-2 w-full sm:w-auto justify-center disabled:opacity-60">
                                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="">Watch a Video</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <VideoModal open={openIntro} onOpenChange={setOpenIntro} videoSrc={course?.intro_video_url || ''} title={course?.title || 'Intro Video'} autoPlay={!!course?.intro_video_url} />
                        <VideoModal open={openEnd} onOpenChange={setOpenEnd} videoSrc={course?.end_video_url || ''} title={course?.title || 'End Video'} autoPlay={!!course?.end_video_url} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
