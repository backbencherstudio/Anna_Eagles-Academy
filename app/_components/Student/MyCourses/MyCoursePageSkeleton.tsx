"use client"
import React from 'react';

export default function MyCoursePageSkeleton() {
    return (
        <div className="">
            {/* Continue Watching Skeleton */}
            <div className="bg-white rounded-2xl p-6 shadow mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                </div>

                <div className="overflow-x-hidden">
                    <div className="flex gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="min-w-[240px] max-w-[260px] sm:min-w-[260px] sm:max-w-[280px] md:min-w-[300px] md:max-w-[320px] bg-[#F8F9FA] rounded-xl shadow-sm flex-shrink-0">
                                <div className="relative w-full h-36 rounded-xl overflow-hidden">
                                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                                    {/* Progress bar skeleton */}
                                    <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-300">
                                        <div className="h-2 bg-gray-400 rounded-br-xl rounded-bl-xl w-1/3 animate-pulse"></div>
                                    </div>
                                    {/* Time indicators skeleton */}
                                    <div className="absolute left-2 bottom-2 bg-gray-300 text-white text-xs px-2 py-0.5 rounded w-8 h-4 animate-pulse"></div>
                                    <div className="absolute right-2 bottom-2 bg-gray-300 text-white text-xs px-2 py-0.5 rounded w-8 h-4 animate-pulse"></div>
                                </div>
                                <div className="p-3">
                                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16 mt-2 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enrolled Courses Skeleton */}
            <div className="bg-white rounded-2xl p-6 shadow">
                <div className="h-6 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#F8F9FA] rounded-xl p-4">
                        <div className="flex-1 min-w-0">
                            <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                            <div className="flex items-center gap-6 mb-2">
                                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                                <div className="hidden md:block h-3 bg-gray-200 rounded w-1 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </div>
                            {/* Progress bar skeleton */}
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                <div className="h-2 bg-gray-300 rounded-full w-1/2 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 min-w-[120px] justify-end">
                            <div className="flex items-center gap-1">
                                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-6 animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-6 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


