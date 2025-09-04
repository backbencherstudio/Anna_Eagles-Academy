'use client'

import React from 'react'
import Image from 'next/image'
import { Paperclip } from 'lucide-react'

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
    const durationText = course.duration ?? '—'
    const notesText = course.notes ?? 'Video-only version available'
    const typeText = course.course_type ?? 'Bootcamp'
    const availableSite = course.available_site ?? '15/15'
    const dateText = course.date_label ?? 'N/A'
    const startDate = course.start_date ? formatDate(course.start_date) : '2024-09-01'
    const endDate = course.end_date ? formatDate(course.end_date) : '2024-12-01'

    return (
        <div className="bg-white rounded-2xl transition-shadow duration-200 overflow-hidden border border-gray-100">
            {/* Banner */}
            <div className="relative w-full h-48">
                <Image
                    src={course.course_thumbnail}
                    alt={course.course_title}
                    fill
                    className="object-cover"
                />

                {/* Top-right action icon */}
                <div className="absolute right-3 top-3 h-8 w-8 rounded-full bg-black/70 flex items-center justify-center text-white">
                    <Paperclip className="h-4 w-4" />
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h4 className="font-semibold text-gray-900 text-[16px] leading-snug mb-1 line-clamp-2">
                    {course.course_title}
                </h4>
                <p className="text-[13px] text-gray-700 mb-4 line-clamp-3">
                    {course.course_description}
                </p>

                <div className="h-px bg-gray-100 mb-3" />

                {/* Meta rows */}
                <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Duration:</span>
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
                        <span className="text-white px-2 py-0.5 rounded-full bg-fuchsia-600 text-[11px]">{typeText}</span>
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
                        <span className="text-gray-700 font-medium">{progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}