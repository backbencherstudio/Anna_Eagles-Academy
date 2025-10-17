"use client"

import React from 'react'

function ShimmerBlock({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse bg-gray-200/70 dark:bg-gray-800/60 rounded-md ${className}`} />
}

export default function StudentDashboardShimmer() {
    return (
        <div className="space-y-6">
            {/* CourseAnnouncement */}
            <div className="w-full rounded-xl border border-[#ECEFF3] p-4">
                <ShimmerBlock className="h-5 w-40 mb-3" />
                <ShimmerBlock className="h-4 w-full mb-2" />
                <ShimmerBlock className="h-4 w-2/3" />
            </div>

            {/* WatchWelcomeVideo */}
            <div className="w-full bg-[#0F2598] rounded-xl px-5 py-4">
                <ShimmerBlock className="h-6 w-56 mb-3 bg-white/30" />
                <ShimmerBlock className="h-4 w-2/3 bg-white/20" />
            </div>

            <div className='flex flex-col lg:flex-row gap-10 mt-4'>
                {/* left side */}
                <div className='w-full lg:w-7/12 flex flex-col gap-5'>
                    {/* Header + button */}
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                            <ShimmerBlock className="h-7 w-40" />
                            <ShimmerBlock className="h-8 w-36" />
                        </div>
                        {/* CurrentCourseCard */}
                        <div className="w-full rounded-2xl border border-[#F2E6D6] bg-[#FFFCF8] p-4 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <ShimmerBlock className="h-4 w-24" />
                                    <ShimmerBlock className="h-5 w-64" />
                                    <ShimmerBlock className="h-4 w-24" />
                                    <ShimmerBlock className="h-5 w-56" />
                                </div>
                                <div className="space-y-4">
                                    <ShimmerBlock className="h-4 w-24" />
                                    <ShimmerBlock className="h-5 w-24" />
                                    <ShimmerBlock className="h-4 w-24" />
                                    <ShimmerBlock className="h-5 w-32" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CompleteCourse */}
                    <div className='border border-[#ECEFF3] rounded-xl p-4 space-y-4'>
                        <ShimmerBlock className="h-4 w-32" />
                        <div className="space-y-3">
                            <ShimmerBlock className="h-5 w-72" />
                            <ShimmerBlock className="h-3 w-full" />
                        </div>
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <ShimmerBlock key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </div>

                    {/* AcademyMaterials */}
                    <div className='border border-[#ECEFF3] rounded-xl p-4 space-y-3'>
                        <ShimmerBlock className="h-5 w-48" />
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            {Array.from({ length: 2 }).map((_, i) => (
                                <ShimmerBlock key={i} className="h-24 w-full" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* right side */}
                <div className='w-full lg:w-5/12 mt-2 space-y-6'>
                    {/* StudentFeedback */}
                    <div className='border border-[#ECEFF3] rounded-xl p-4 space-y-3'>
                        <ShimmerBlock className="h-5 w-40" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <ShimmerBlock key={i} className="h-10 w-full" />
                        ))}
                    </div>

                    {/* TeacherVideo */}
                    <div className='border border-[#ECEFF3] rounded-xl p-4 space-y-3'>
                        <ShimmerBlock className="h-5 w-36" />
                        <ShimmerBlock className="h-40 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}


