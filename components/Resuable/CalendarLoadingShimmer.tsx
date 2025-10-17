'use client'
import React from 'react'

// Shimmer loading components
const ShimmerBox = ({ className = '' }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const ShimmerText = ({ lines = 1, className = '' }: { lines?: number; className?: string }) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <ShimmerBox key={i} className="h-4 w-full" />
        ))}
    </div>
);

// Calendar loading shimmer component
export default function CalendarLoadingShimmer() {
    return (
        <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch'>
            {/* Left side - Calendar */}
            <div className='lg:col-span-2 flex flex-col'>
                <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
                    {/* Header */}
                    <div className="flex items-center mb-4 flex-col sm:flex-row sm:mb-6 gap-2 sm:gap-0 w-full">
                        <ShimmerBox className="h-6 w-32" />
                        <ShimmerBox className="h-5 w-48" />
                        <div className="flex gap-2 sm:ml-auto mt-2 sm:mt-0">
                            <ShimmerBox className="h-7 w-7" />
                            <ShimmerBox className="h-7 w-7" />
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="w-full overflow-x-auto flex-1">
                        <div className="min-w-[600px] sm:min-w-[760px] mx-auto">
                            {/* Days Row */}
                            <div className="flex items-center gap-0 mb-2 ml-1">
                                <ShimmerBox className="w-[60px] h-4" />
                                {Array.from({ length: 7 }).map((_, idx) => (
                                    <div key={idx} className="flex-1 text-center">
                                        <ShimmerBox className="h-4 w-8 mx-auto mb-1" />
                                        <ShimmerBox className="h-3 w-6 mx-auto" />
                                    </div>
                                ))}
                            </div>

                            {/* Time slots */}
                            <div className="flex flex-col gap-0 mt-2">
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <div key={idx} className="flex items-start min-h-16 border-b border-gray-200">
                                        <ShimmerBox className="w-15 h-4 mt-4 mx-auto" />
                                        <div className="flex-1 min-h-16 flex items-start justify-center flex-col relative py-2 gap-2">
                                            <ShimmerBox className="h-10 w-full max-w-[400px] ms-5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Schedule Overview */}
            <div className='lg:col-span-1 flex flex-col'>
                <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
                    {/* Header */}
                    <div className="mb-4">
                        <ShimmerBox className="h-6 w-40 mb-2" />
                        <ShimmerBox className="h-4 w-24" />
                    </div>

                    {/* Categories */}
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <ShimmerBox className="w-4 h-4 rounded-sm" />
                                <div className="flex-1">
                                    <ShimmerBox className="h-4 w-20 mb-1" />
                                    <ShimmerBox className="h-3 w-12" />
                                </div>
                                <ShimmerBox className="h-6 w-8" />
                            </div>
                        ))}
                    </div>

                    {/* Add Event Button (for admin) */}
                    <div className="mt-6">
                        <ShimmerBox className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Simple loading shimmer for single column layout
export function SimpleCalendarLoadingShimmer() {
    return (
        <div className='w-full flex flex-col gap-10 lg:flex-row'>
            {/* Left side - Calendar */}
            <div className='w-full lg:w-7/12'>
                <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
                    {/* Header */}
                    <div className="flex items-center mb-4 flex-col sm:flex-row sm:mb-6 gap-2 sm:gap-0 w-full">
                        <ShimmerBox className="h-6 w-32" />
                        <ShimmerBox className="h-5 w-48" />
                        <div className="flex gap-2 sm:ml-auto mt-2 sm:mt-0">
                            <ShimmerBox className="h-7 w-7" />
                            <ShimmerBox className="h-7 w-7" />
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="w-full overflow-x-auto flex-1">
                        <div className="min-w-[600px] sm:min-w-[760px] mx-auto">
                            {/* Days Row */}
                            <div className="flex items-center gap-0 mb-2 ml-1">
                                <ShimmerBox className="w-[60px] h-4" />
                                {Array.from({ length: 7 }).map((_, idx) => (
                                    <div key={idx} className="flex-1 text-center">
                                        <ShimmerBox className="h-4 w-8 mx-auto mb-1" />
                                        <ShimmerBox className="h-3 w-6 mx-auto" />
                                    </div>
                                ))}
                            </div>

                            {/* Time slots */}
                            <div className="flex flex-col gap-0 mt-2">
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <div key={idx} className="flex items-start min-h-16 border-b border-gray-200">
                                        <ShimmerBox className="w-15 h-4 mt-4 mx-auto" />
                                        <div className="flex-1 min-h-16 flex items-start justify-center flex-col relative py-2 gap-2">
                                            <ShimmerBox className="h-10 w-full max-w-[400px] ms-5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Schedule Overview */}
            <div className='w-full lg:w-5/12'>
                <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
                    {/* Header */}
                    <div className="mb-4">
                        <ShimmerBox className="h-6 w-40 mb-2" />
                        <ShimmerBox className="h-4 w-24" />
                    </div>

                    {/* Categories */}
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <ShimmerBox className="w-4 h-4 rounded-sm" />
                                <div className="flex-1">
                                    <ShimmerBox className="h-4 w-20 mb-1" />
                                    <ShimmerBox className="h-3 w-12" />
                                </div>
                                <ShimmerBox className="h-6 w-8" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
