'use client'

import React from 'react'
import Image from 'next/image'
import { Paperclip } from 'lucide-react'
import EditIcon from '@/components/Icons/CustomIcon/EditIcon'

interface CourseCardProps {
    course: {
        id: number
        course_title: string
        course_description: string
        course_price: number
        total_modules: number
        total_videos: number
        publish_date: string
        end_date: string
        status: string
        course_thumbnail: string
        student_type: string
        duration?: string
        notes?: string
        course_type?: string
        available_site?: string
        date_label?: string
        file_upload_progress?: number
        start_date?: string
    }
}

export default function CourseCard({ course }: CourseCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const progress = typeof course.file_upload_progress === 'number' ? course.file_upload_progress : 40
    const durationText = course.duration ?? '6hr 10min 2sec'
    const notesText = course.notes ?? 'Video-only version available'
    const typeText = course.course_type ?? 'Regular'
    const availableSite = course.available_site ?? '15/15'
    const dateText = course.date_label ?? 'N/A'
    const startDate = course.start_date ? formatDate(course.start_date) : '2024-09-01'
    const endDate = course.end_date ? formatDate(course.end_date) : '2024-12-01'

    // Get course type styling based on type
    const getCourseTypeStyle = (type: string) => {
        switch (type.toLowerCase()) {
            case 'bootcamp':
                return 'bg-purple-600 text-white'
            case 'regular':
                return 'bg-gray-500 text-white'
            default:
                return 'bg-gray-500 text-white'
        }
    }

    return (
        <div className="bg-white rounded-2xl transition-shadow duration-200 overflow-hidden border border-[#EEE]">
            {/* Banner */}
            <div className="relative w-full h-56 ">
                <Image
                    src={course.course_thumbnail}
                    alt={course.course_title}
                    fill
                    className="object-cover p-3 rounded-3xl h-full w-full"
                />

                {/* Top-right action icon */}
              <button className='absolute right-4 top-4 cursor-pointer'>
              <div className=" h-8 w-8 rounded-lg bg-white/30 flex items-center justify-center text-white ">
                    <EditIcon />
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h4 className="font-semibold text-[#1D1F2C] text-[16px] leading-snug mb-2 line-clamp-2">
                    {course.course_title}
                </h4>

                {/* Meta rows */}
                <div className="space-y-1.5 text-[14px] text-[#4A4C56]">
                    <div className="flex items-center justify-between">
                        <span>Duration:</span>
                        <span className="text-emerald-600 font-medium">{durationText}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Course:</span>
                        <span className="text-gray-700">Total-{course.total_modules}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Notes:</span>
                        <span className="text-gray-700">{notesText}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Course Type:</span>
                        <span className={`text-white px-2 py-0.5 rounded-full text-[11px] ${getCourseTypeStyle(typeText)}`}>
                            {typeText}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Available site:</span>
                        <span className="text-gray-700">{availableSite}</span>
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-gray-500">Date:</span>
                        <span className="text-gray-700">
                            <span className="mr-3">Start: {startDate}</span>
                            <span className="ml-2">End: {endDate}</span>
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