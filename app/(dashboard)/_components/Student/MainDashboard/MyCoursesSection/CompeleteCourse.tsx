import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Play, Check, Clock } from 'lucide-react'

// Data structure for complete course
interface Lesson {
    id: string
    title: string
    duration: string
    isCompleted: boolean
}

interface VideoContent {
    id: string
    title: string
    type: 'introduction' | 'recap'
}

interface CompleteCourseData {
    seriesTitle: string
    courseTitle: string
    totalDuration: string
    completedLessons: number
    totalLessons: number
    progressPercentage: number
    lessons: Lesson[]
    introductionVideo: VideoContent
    recapVideo: VideoContent
}

// Sample data matching the image
const completeCourseData: CompleteCourseData = {
    seriesTitle: "The Kingdom of God is Spirit",
    courseTitle: "Course-1: The Kingdom of God is all about Spirit",
    totalDuration: "1hr 14min 17sec",
    completedLessons: 4,
    totalLessons: 4,
    progressPercentage: 100,
    lessons: [
        {
            id: "1",
            title: "Lesson 1: Introduction to the Kingdom",
            duration: "25min 32sec",
            isCompleted: true
        },
        {
            id: "2",
            title: "Lesson 2: Kingdom in Daily Life",
            duration: "18min 44sec",
            isCompleted: true
        },
        {
            id: "3",
            title: "Lesson 3: Spiritual Leadership",
            duration: "25min 10sec",
            isCompleted: true
        },
        {
            id: "4",
            title: "Lesson 4: Kingdom in Daily Life",
            duration: "30min 32sec",
            isCompleted: true
        }
    ],
    introductionVideo: {
        id: "intro",
        title: "Introduction to what this lesson covers.",
        type: "introduction" as const
    },
    recapVideo: {
        id: "recap",
        title: "Here's a quick recap of the lesson's highlights!",
        type: "recap" as const
    }
}

export default function CompleteCourse() {
    return (
        <div className="w-full bg-white rounded-2xl p-4 sm:p-6 shadow mb-5">
            {/* Smart Accordion - Click to show/hide full course content */}
            <Accordion type="single" collapsible className="w-full" defaultValue="course-content">
                <AccordionItem value="course-content" className="border-none">
                    {/* Series Header - Clickable to expand/collapse */}
                    <AccordionTrigger className="text-blue-800 text-xs sm:text-sm font-medium hover:no-underline transition-all duration-200 w-full justify-between p-0">
                        <span className='text-[#0F2598] bg-[#0F25981A] border-[#0F25981A] border px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm'>Series: {completeCourseData.seriesTitle}</span>
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
                                        <p className="text-xs sm:text-base text-[#1D1F2C] font-medium leading-relaxed break-words">{completeCourseData.introductionVideo.title}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-blue-50 border-blue-200 text-[#0F2598] hover:bg-[#ECEFF3] cursor-pointer text-xs sm:text-sm px-3 py-2 w-full sm:w-auto justify-center">
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
                                        {completeCourseData.courseTitle}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-3 sm:mt-4">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs sm:text-sm text-gray-600 font-medium">{completeCourseData.totalDuration}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                                        <div
                                            className="bg-[#12B76A] h-2 sm:h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${completeCourseData.progressPercentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">
                                        {completeCourseData.completedLessons}/{completeCourseData.totalLessons} lessons
                                    </span>
                                </div>

                            </div>

                            {/* Lessons List */}
                            <div className="space-y-2 sm:space-y-3 mt-4">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Course Lessons</h3>
                                {completeCourseData.lessons.map((lesson, index) => (
                                    <Card
                                        key={lesson.id}
                                        className={`border transition-all duration-200 hover:shadow-md ${lesson.isCompleted
                                            ? 'bg-[#E8F4E9] border-[#12B76A] cursor-pointer shadow-sm'
                                            : 'bg-white border-[#ECEFF3] hover:border-gray-300'
                                            }`}
                                    >
                                        <CardContent className="p-3 sm:p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${lesson.isCompleted
                                                    ? 'bg-[#12B76A]'
                                                    : 'bg-gray-300'
                                                    }`}>
                                                    {lesson.isCompleted ? (
                                                        <Check className="w-4 h-4 sm:w-7 sm:h-7 text-white" />
                                                    ) : (
                                                        <span className="text-xs sm:text-sm font-medium text-gray-600">{index + 1}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-medium transition-colors text-sm sm:text-base leading-tight ${lesson.isCompleted ? 'text-[#1D1F2C]' : 'text-gray-900'
                                                        }`}>
                                                        {lesson.title}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{lesson.duration}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
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
                                            <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed break-words">{completeCourseData.recapVideo.title}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-blue-50 border-blue-200 text-[#0F2598] hover:bg-[#ECEFF3] cursor-pointer text-xs sm:text-sm px-3 py-2 w-full sm:w-auto justify-center">
                                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="">Watch a Video</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
