'use client'

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CourseCard from './CourseCard'
import { useRouter } from 'next/navigation'

interface Course {
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

export default function CourseManagement() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/data/NewCourse.json')
                const data = await response.json()
                setCourses(data)
            } catch (error) {
                console.error('Error fetching courses:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    const handleCreateCourse = () => {
        // TODO: Implement create course functionality
        router.push('/create-course')
        console.log('Create new course clicked')
    }

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Header with Create Button */}
                <div className="flex justify-end">
                    <Button
                        className="bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/80 text-white rounded-full px-6 py-3 flex items-center gap-2"

                    >
                        <Plus className="w-5 h-5" />
                        Create New Course
                    </Button>
                </div>

                {/* Loading Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                            <div className="p-4 space-y-3">
                                <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-32"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl p-5">
            {/* Header with Create Button */}
            <div className="flex justify-end">
                <Button
                    className="bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/80 text-white rounded-full px-6 py-3 flex items-center gap-2"
                    onClick={handleCreateCourse}
                >
                    <Plus className="w-5 h-5" />
                    Create New Course
                </Button>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>

            {/* Empty State */}
            {courses.length === 0 && !loading && (
                <div className="flex justify-center items-center min-h-[60vh] w-full">
                    <div className="text-center">
                        <p className='text-gray-500 text-lg font-medium'>No courses found</p>
                        <p className='text-gray-400 text-sm mt-2'>Create your first course to get started</p>
                    </div>
                </div>
            )}
        </div>
    )
} 