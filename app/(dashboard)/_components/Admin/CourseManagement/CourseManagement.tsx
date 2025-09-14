'use client'

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CourseCard from '@/app/(dashboard)/_components/Admin/CourseManagement/CourseCard'
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
    student_type: string
    duration?: string
    notes?: string
    course_type?: string
    available_site?: string
    file_upload_progress?: number
    start_date?: string
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
        <div className="">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center mb-4">
                <h1 className='text-[#1D1F2C] text-[24px] font-semibold'>All Courses</h1>

                <Button
                    className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white rounded-xl  py-5 flex items-center gap-2"
                    onClick={handleCreateCourse}
                >
                    <Plus className="w-5 h-5" />
                    Create New Course
                </Button>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-5">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>

            {/* Empty State */}
            {courses.length === 0 && !loading && (
                <div className="flex justify-center items-center min-h-[60vh] w-full">
                    <div className="text-center">
                        <p className='text-gray-500 text-lg font-medium'>No courses found</p>
                        <p className='text-gray-400 text-sm mt-2'>
                            Create your first course to get started
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
} 