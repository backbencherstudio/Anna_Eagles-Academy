import React from 'react'

export default function ModulesSkeletonLoading() {
    return (
        <div className="flex max-w-7xl mx-auto gap-6 flex-col lg:flex-row">
            {/* Video Player Section Skeleton */}
            <div className="bg-white h-fit rounded-2xl shadow flex-1 p-2 lg:p-6">
                {/* Video Title Skeleton */}
                <div className="mb-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>

                {/* Video Player Skeleton */}
                <div className="mb-4">
                    <div className="w-full aspect-video bg-gray-200 rounded-xl animate-pulse relative">
                        {/* Play button skeleton */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>
                        {/* Video controls skeleton */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent rounded-b-xl">
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Navigation Skeleton */}
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="flex gap-2 items-center justify-center">
                        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="bg-white overflow-y-auto max-h-[80vh] rounded-2xl shadow w-full lg:w-96 p-6">
                <div className="font-semibold text-lg mb-4">Modules</div>

                {/* Module Accordion Skeletons */}
                <div className="flex flex-col gap-3">
                    {[1, 2, 3, 4].map((moduleIndex) => (
                        <div key={moduleIndex} className="bg-[#FAFAFA] rounded-xl shadow-sm">
                            {/* Module Header Skeleton */}
                            <div className="w-full flex items-center cursor-pointer justify-between px-4 py-3">
                                <div className="flex-1">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                </div>
                                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            {/* Module Content Skeleton */}
                            <div className="px-2 pb-3 pt-1">
                                <div className="flex flex-col gap-2">
                                    {[1, 2, 3].map((videoIndex) => (
                                        <div key={videoIndex} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#FEF9F2]">
                                            {/* Video Icon Skeleton */}
                                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>

                                            {/* Video Info Skeleton */}
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-1"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                            </div>

                                            {/* Duration Skeleton */}
                                            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
