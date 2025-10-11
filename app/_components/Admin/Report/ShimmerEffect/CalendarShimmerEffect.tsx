import React from 'react'

export default function CalendarShimmerEffect() {
    return (
        <div className="rounded-2xl">
            <div className='bg-white rounded-2xl p-4 border border-[#ECEFF3]'>
                {/* Title skeleton */}
                <div className="h-7 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>

                {/* Month Header skeleton */}
                <div className="mb-3">
                    <div className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Week View skeleton */}
                <div className="flex w-full items-center gap-2">
                    <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>

                    <div className="flex w-full justify-center overflow-x-auto">
                        {[...Array(7)].map((_, index) => (
                            <div key={index} className="flex-none flex flex-col items-center min-w-[60px] sm:min-w-[72px]">
                                <div className="px-3 py-2 rounded-xl flex flex-col items-center">
                                    <div className="h-6 bg-gray-200 rounded animate-pulse w-8 mb-1"></div>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}
