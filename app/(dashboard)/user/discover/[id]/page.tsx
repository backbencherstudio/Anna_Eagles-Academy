'use client'

import DiscoverCourses from '@/app/_components/Student/DiscoverCourses'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Course {
    id: string
    title: string
    description: string
    thumbnail: string
    price: number
    duration: string
    totalModules: number
    totalVideos: number
    totalAudios: number
    totalDocs: number
    courseType: string
    availableSeats: number
    totalSeats: number
    startDate: string
    endDate: string
}

export default function CourseDetailsStudent() {
    const params = useParams()
    const router = useRouter()
    const [course, setCourse] = useState<Course | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetch('/data/CoursesData.json')
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.courses) {
                        const foundCourse = data.courses.find((c: Course) => c.id === params.id)
                        if (foundCourse) {
                            setCourse(foundCourse)
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error fetching course data:', error)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [params.id])

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-96 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">Course not found</h2>
                    <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => router.push('/user/discover')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Courses
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="">
            {/* Back Button */}
            <div className="mb-5">
                <Button
                    variant="outline"
                    onClick={() => router.push('/user/discover')}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                </Button>
            </div>

            {/* Course Details */}
            <DiscoverCourses courseData={course} />
        </div>
    )
}
