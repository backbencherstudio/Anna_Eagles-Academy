import React from 'react'
import { BookOpen, PlayCircle, GraduationCap, Timer } from 'lucide-react'
import { TfiWorld } from "react-icons/tfi";
import ISO6391 from 'iso-639-1'

interface SeriesCount { courses?: number }
interface EnrolledSeries {
    title?: string
    duration?: string | null
    _count?: SeriesCount
    current_course_name?: string | null
    language?: string | null
}

interface CurrentCourseCardProps {
    series?: EnrolledSeries | null
    language?: string | null
}

export default function CurrentCourseCard({ series }: CurrentCourseCardProps) {
    const seriesTitle = series?.title || '—'
    const seriesDuration = series?.duration || '—'
    const totalCourses = (series?._count?.courses ?? 0).toString().padStart(2, '0')
    const currentCourseName = series?.current_course_name || '—'
    const languageCode = series?.language
    const language = languageCode ? (ISO6391.getName(languageCode) || languageCode) : '—'
    return (
        <>
            {/* Current Course Card */}
            <div className="w-full rounded-2xl border border-[#F2E6D6] bg-[#FFFCF8] p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                    <span className="text-[#E2A93B]"><BookOpen className="h-5 w-5" /></span>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-[#4A4C56] font-medium">Series</p>
                        <h3 className="text-base lg:text-lg font-semibold text-[#0F2598]">{seriesTitle}</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-5">


                        <div className="flex items-start gap-3">
                            <span className="text-[#E2A93B]"><PlayCircle className="h-5 w-5" /></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-[#4A4C56] font-medium">Current course</p>
                                <p className="text-base lg:text-lg font-semibold text-[#161721]">{currentCourseName}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-[#E2A93B]"><TfiWorld className="h-5 w-5" /></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-[#4A4C56] font-medium">language</p>
                                <p className="text-base lg:text-lg font-semibold text-[#161721]">{language}</p>
                            </div>
                        </div>

                    </div>

                    {/* Right column */}
                    <div className="space-y-5 md:pl-4">
                        <div className="flex items-start gap-3">
                            <span className="text-[#E2A93B]"><GraduationCap className="h-5 w-5" /></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-[#4A4C56] font-medium">Course</p>
                                <p className="text-base lg:text-lg font-semibold text-[#161721]">Total-{totalCourses}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-[#E2A93B]"><Timer className="h-5 w-5" /></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-[#4A4C56] font-medium">Duration</p>
                                <div className="rounded-xl bg-[#E9F8EF] px-3 py-1">
                                    <span className="text-sm font-medium text-[#12B76A] ">{seriesDuration}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* course video */}
            {/* <div className="">
                <div className="relative w-full overflow-hidden rounded-2xl bg-black">
                    <div className="aspect-video">
                        <video
                            className="h-full w-full"
                            controls
                            preload="metadata"
                            src="/videos/welcome.mp4"
                        />
                    </div>
                </div>
            </div> */}

            {/* progress bar  */}
        </>

    )
}
