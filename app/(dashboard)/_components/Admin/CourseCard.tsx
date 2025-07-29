'use client'

import React from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

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
    }
}

export default function CourseCard({ course }: CourseCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ongoing':
                return 'bg-teal-500 text-white'
            case 'Finished':
                return 'bg-red-500 text-white'
            default:
                return 'bg-gray-500 text-white'
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            {/* Course Banner - Clean Image Only */}
            <div className="relative w-full h-48">
                <Image
                    src={course.course_thumbnail}
                    alt={course.course_title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Course Content */}
            <div className="p-4">
                {/* Status Tag */}
                <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {course.status}
                    </span>
                </div>

                {/* Course Title */}
                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                    {course.course_description}
                </h4>

                {/* Date Information */}
                <p className="text-xs text-gray-500">
                    {course.status === 'Ongoing' ? 'Started' : 'Finished'}: {formatDate(course.publish_date)}
                </p>
            </div>
        </div>
    )
} 