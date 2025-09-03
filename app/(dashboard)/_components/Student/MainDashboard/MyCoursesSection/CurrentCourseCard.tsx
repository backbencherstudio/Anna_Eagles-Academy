import React from 'react'
import { BookOpen, PlayCircle, Globe2, GraduationCap, Timer } from 'lucide-react'

const CARD_DATA = {
    series: 'The Kingdom of God is Spirit',
    currentCourse: 'The Kingdom Principles',
    language: 'English',
    totalCourses: 5,
    duration: '6hr 10min 2sec',
}

export default function CurrentCourseCard() {
    return (
        <>
            {/* Current Course Card */}
            <div className="w-full rounded-2xl border border-[#F2E6D6] bg-[#FFFCF8] p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-5">
                        <div className="flex items-start gap-3">
                            <span className="text-[#E2A93B]"><BookOpen className="h-5 w-5" /></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-[#4A4C56] font-medium">Series</p>
                                <h3 className="text-base lg:text-lg font-semibold text-[#0F2598]">{CARD_DATA.series}</h3>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-[#E2A93B]"><PlayCircle className="h-5 w-5" /></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-[#4A4C56] font-medium">Current course</p>
                                <p className="text-base lg:text-lg font-semibold text-[#161721]">{CARD_DATA.currentCourse}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-[#E2A93B]"><Globe2 className="h-5 w-5" /></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-[#4A4C56] font-medium">language</p>
                                <p className="text-base lg:text-lg font-semibold text-[#161721]">{CARD_DATA.language}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-5 md:pl-4">
                        <div className="flex items-start gap-3">
                            <span className="text-[#E2A93B]"><GraduationCap className="h-5 w-5" /></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-[#4A4C56] font-medium">Course</p>
                                <p className="text-base lg:text-lg font-semibold text-[#161721]">Total-{CARD_DATA.totalCourses.toString().padStart(2, '0')}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-[#E2A93B]"><Timer className="h-5 w-5" /></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-[#4A4C56] font-medium">Duration</p>
                                <div className="rounded-xl bg-[#E9F8EF] px-3 py-1">
                                    <span className="text-sm font-medium text-[#12B76A] ">{CARD_DATA.duration}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* course video */}
            <div className="">
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
            </div>

            {/* progress bar  */}
        </>

    )
}
