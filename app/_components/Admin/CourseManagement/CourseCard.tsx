'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeIcon, Paperclip } from 'lucide-react'
import EditIcon from '@/components/Icons/CustomIcon/EditIcon'
import { FaEye } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

interface CourseCardProps {
    course: {
        id: string
        title: string
        slug: string
        summary: string | null
        description: string
        visibility: string
        video_length: string | null
        duration: string | null
        start_date: string
        end_date: string
        thumbnail: string
        total_price: string
        course_type: string
        note: string
        available_site: number
        created_at: string
        updated_at: string
        language: any
        courses: any[]
        _count: {
            courses: number
            quizzes: number
            assignments: number
        }
        thumbnail_url: string
    }
}

export default function CourseCard({ course }: CourseCardProps) {
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const router = useRouter()
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
    }

    const handleImageError = () => {
        setImageError(true)
        setImageLoading(false)
    }

    const handleImageLoad = () => {
        setImageLoading(false)
    }

    const progress = 100
    const durationText = course.duration || 'N/A'
    const notesText = course.note || ''
    const typeText = course.course_type || ''
    const availableSite = course.available_site.toString()
    const startDate = formatDate(course.start_date)
    const endDate = formatDate(course.end_date)
    const totalModules = course._count.courses
    const totalPrice = parseFloat(course.total_price)

    // Get course type styling based on type
    const getCourseTypeStyle = (type: string) => {
        switch (type.toLowerCase()) {
            case 'bootcamp':
                return 'bg-[#EFCEFF] text-[#AD0AFD]'
            case 'regular':
                return 'bg-[#E9E9EA] text-black'
            case 'free':
                return 'bg-green-600 text-white'
            default:
                return 'bg-[#E9E9EA] text-black'
        }
    }

    // Get status styling based on visibility
    const getStatusStyle = (visibility: string) => {
        switch (visibility.toUpperCase()) {
            case 'PUBLISHED':
                return 'text-green-600'
            case 'SCHEDULED':
                return 'text-blue-600'
            default:
                return 'text-black'
        }
    }

    // Get status text
    const getStatusText = (visibility: string) => {
        switch (visibility.toUpperCase()) {
            case 'PUBLISHED':
                return 'Published'
            case 'SCHEDULED':
                return 'Scheduled'
            default:
                return 'Draft'
        }
    }

    // Component for placeholder when image is not available or fails to load
    const ImagePlaceholder = () => (
        <div className="w-full h-full p-3">
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">No Image</p>
                </div>
            </div>
        </div>
    )

    // Loading skeleton component
    const ImageSkeleton = () => (
        <div className="w-full h-full p-3">
            <div className="w-full h-full bg-gray-200 rounded-3xl animate-pulse"></div>
        </div>
    )

    // Check if we should show the image
    const shouldShowImage = course.thumbnail_url && !imageError

    const handleUpdateCourse = () => {
        // Navigate to create-new-course page with series ID for editing
        router.push(`/admin/create-new-course/${course.id}`)
    }

    return (
        <div className="bg-white rounded-2xl transition-shadow duration-200 overflow-hidden border border-[#EEE]">
            {/* Banner */}
            <div className="relative w-full h-56">
                {shouldShowImage ? (
                    <>
                        {imageLoading && <ImageSkeleton />}
                        <Image
                            src={course.thumbnail_url}
                            alt={course.title}
                            fill
                            className={`object-cover p-3 rounded-3xl h-full w-full transition-opacity duration-200 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                        />
                    </>
                ) : (
                    <ImagePlaceholder />
                )}

                {/* Top-right action icon */}
                <button onClick={handleUpdateCourse} className='absolute right-4 top-4 cursor-pointer'>
                    <div className=" p-1 rounded bg-[#D0D0D047] border border-[#E9E9EA33] flex items-center justify-center text-[#F1C27D] hover:bg-[#F1C27D]/80 hover:text-black transition-all duration-300 ">
                        <EditIcon />
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h4 className="font-semibold text-[#1D1F2C] text-[16px] leading-snug mb-2 line-clamp-2 capitalize">
                    {course.title}
                </h4>

                {/* Meta rows */}
                <div className="space-y-1.5 text-[14px] text-[#4A4C56]">
                    <div className="flex items-center justify-between">
                        <span>Duration:</span>
                        <span className="text-emerald-600 font-medium">{durationText}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Course:</span>
                        <span className="text-gray-700">Total-{totalModules}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Price:</span>
                        <span className="text-emerald-600 font-medium">${totalPrice}</span>
                    </div>

                    {notesText && (
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Notes:</span>
                            <span className="text-gray-700 text-right flex-1 ml-2 truncate">{notesText}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Course Type:</span>
                        <span className={`uppercase px-2 py-0.5 rounded-full font-medium text-[11px] ${getCourseTypeStyle(typeText)}`}>
                            {typeText}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Available site:</span>
                        <span className="text-gray-700">
                            {availableSite}
                            <span className="mx-1 text-gray-400">|</span>
                            <span className="text-gray-700">
                                {availableSite}
                            </span>
                        </span>
                    </div>
                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`uppercase px-2 py-0.5 rounded-full font-medium text-[11px] ${getStatusStyle(course.visibility)}`}>
                            {getStatusText(course.visibility)}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start justify-between">
                        <span className="text-gray-500">Date:</span>
                        <span className="text-gray-700">
                            <span className="">Start: {startDate}</span>
                            <span className="mx-2 text-gray-500">|</span>
                            <span className="">End: {endDate}</span>
                        </span>
                    </div>


                </div>

                <div className="h-px bg-gray-100 mt-3 mb-3" />

                {/* Progress */}
                <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">File upload progressing:</span>
                        {progress === 100 ? (
                            <span className="text-green-600 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Upload Completed
                            </span>
                        ) : (
                            <span className="text-gray-700 font-medium">{progress}%</span>
                        )}
                    </div>
                    {progress < 100 && (
                        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}