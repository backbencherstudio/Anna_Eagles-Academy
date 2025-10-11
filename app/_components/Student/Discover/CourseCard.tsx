'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, Clock, Users, Play, FileText, Calendar } from 'lucide-react'

interface CourseCardProps {
    course: {
        id: string
        title: string
        slug: string
        summary: string | null
        description: string
        visibility: string
        video_length: string
        duration: string
        start_date: string
        end_date: string
        thumbnail: string
        total_price: string
        course_type: string
        note: string
        available_site: number
        language: string | null
        courses: Array<{
            id: string
            title: string
            price: string
        }>
        thumbnail_url: string
    }
    viewMode?: 'grid' | 'list'
}

export default function CourseCardStudent({ course, viewMode = 'grid' }: CourseCardProps) {
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const router = useRouter()

    const handleImageError = () => {
        setImageError(true)
        setImageLoading(false)
    }

    const handleImageLoad = () => {
        setImageLoading(false)
    }

    const handleViewDetails = () => {
        router.push(`/user/discover/${course.id}`)
    }

    // Get course type styling based on type
    const getCourseTypeStyle = (type: string) => {
        switch (type.toLowerCase()) {
            case 'bootcamp':
                return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200'
            case 'regular':
                return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200'
            default:
                return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200'
        }
    }


    // Component for placeholder when image is not available or fails to load
    const ImagePlaceholder = () => (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-medium">No Image</p>
            </div>
        </div>
    )

    // Loading skeleton component
    const ImageSkeleton = () => (
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
    )

    // Check if we should show the image
    const shouldShowImage = course.thumbnail_url && !imageError

    if (viewMode === 'list') {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 hover:border-[#0F2598]/30 transition-all duration-300 cursor-pointer group overflow-hidden" onClick={handleViewDetails}>
                <div className="flex flex-col sm:flex-row sm:h-32 md:h-36">
                    {/* Image Section */}
                    <div className="relative w-full h-32 sm:w-40 sm:h-full md:w-48 flex-shrink-0">
                        {shouldShowImage ? (
                            <>
                                {imageLoading && <ImageSkeleton />}
                                <Image
                                    src={course.thumbnail_url}
                                    alt={course.title}
                                    fill
                                    className={`object-cover transition-opacity duration-200 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                />
                            </>
                        ) : (
                            <ImagePlaceholder />
                        )}

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCourseTypeStyle(course.course_type)}`}>
                                {course.course_type}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between">
                        {/* Top Section */}
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#1D1F2C] mb-2 line-clamp-1 group-hover:text-[#0F2598] transition-colors">
                                {course.title}
                            </h4>

                            {/* Course Info */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Play className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                    <span>{course.video_length}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                                    <span>{course.courses.length} Courses</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                                    <span>{course.available_site}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-semibold text-[#0F2598]">${course.total_price}</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewDetails()
                                }}
                                className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white px-4 lg:px-6 py-2 sm:py-2.5 text-xs  rounded-lg font-medium transition-colors duration-200 flex items-center gap-1 justify-center sm:justify-start"
                            >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>View Details</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Grid View (Original Design)
    return (
        <div className="bg-white rounded-xl transition-all duration-300 overflow-hidden border border-[#EEE] hover:shadow-sm  group cursor-pointer group h-full flex flex-col" onClick={handleViewDetails}>
            {/* Banner */}
            <div className="relative w-full h-48 sm:h-56 flex-shrink-0">
                {shouldShowImage ? (
                    <>
                        {imageLoading && <ImageSkeleton />}
                        <Image
                            src={course.thumbnail_url}
                            alt={course.title}
                            fill
                            className={`object-cover rounded-lg h-full w-full transition-opacity duration-200 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                        />
                    </>
                ) : (
                    <ImagePlaceholder />
                )}

                {/* Top-right badges */}
                <div className="absolute right-4 top-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCourseTypeStyle(course.course_type)}`}>
                        {course.course_type}
                    </span>
                </div>

                {/* View icon overlay */}
                <div className="absolute rounded-lg inset-0 group-hover:bg-black/50 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                            <Eye className="w-6 h-6 text-gray-800" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col">
                {/* Title */}
                <h4 className="font-semibold text-[#1D1F2C] text-sm sm:text-base leading-snug mb-2 sm:mb-3 line-clamp-2 capitalize group-hover:text-[#0F2598] transition-colors">
                    {course.title}
                </h4>

                {/* Meta rows */}
                <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-[#4A4C56] mb-3 sm:mb-4 flex-1">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Duration:
                        </span>
                        <span className="text-emerald-600 font-medium">{course.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Play className="w-4 h-4" />
                            Videos:
                        </span>
                        <span className="text-gray-700">{course.video_length}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Courses:
                        </span>
                        <span className="text-gray-700">{course.courses.length}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Seats:
                        </span>
                        <span className="text-gray-700">{course.available_site}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Start:
                        </span>
                        <span className="text-gray-700">{new Date(course.start_date).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="h-px bg-gray-100 mb-2 sm:mb-3" />

                {/* Price and Action */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex flex-col min-w-0">
                        <span className="text-lg font-semibold text-[#0F2598]">${course.total_price}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleViewDetails()
                        }}
                        className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white px-3 sm:px-4 py-2 rounded-lg text-xs  transition-colors duration-200 flex items-center gap-1 sm:gap-2 flex-shrink-0"
                    >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                    </button>
                </div>
            </div>
        </div>
    )
}