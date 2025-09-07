'use client'

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CourseCard from '@/app/(dashboard)/_components/Admin/CourseManagement/CourseCard'
import FilterTabCourse from '@/app/(dashboard)/_components/Admin/CourseManagement/FilterTabCourse'
import { useRouter, useSearchParams } from 'next/navigation'

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
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [filterLoading, setFilterLoading] = useState(false)
    const [activeFilter, setActiveFilter] = useState('all')
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize active filter from URL
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab')
        if (tabFromUrl && ['all', 'paid', 'free', 'scholarship'].includes(tabFromUrl)) {
            setActiveFilter(tabFromUrl)
        }
    }, [searchParams])

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/data/NewCourse.json')
                const data = await response.json()
                setCourses(data)
                setFilteredCourses(data)
            } catch (error) {
                console.error('Error fetching courses:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    // Filter courses based on active filter
    useEffect(() => {
        const filterCourses = async () => {
            setFilterLoading(true)

            // Add a small delay to show loading animation
            await new Promise(resolve => setTimeout(resolve, 300))

            if (activeFilter === 'all') {
                setFilteredCourses(courses)
            } else {
                const filtered = courses.filter(course => course.student_type === activeFilter)
                setFilteredCourses(filtered)
            }

            setFilterLoading(false)
        }

        if (courses.length > 0) {
            filterCourses()
        }
    }, [activeFilter, courses])

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter)

        // Update URL with the new tab
        const params = new URLSearchParams(searchParams.toString())
        if (filter === 'all') {
            params.delete('tab')
        } else {
            params.set('tab', filter)
        }

        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
        router.push(newUrl, { scroll: false })
    }

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

            {/* Filter Tabs */}
            <FilterTabCourse
                activeTab={activeFilter}
                onTabChange={handleFilterChange}
            />

            {/* Course Grid */}
            {filterLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-5 animate-in fade-in-0 duration-200">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-5 animate-in fade-in-0 duration-300">
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {filteredCourses.length === 0 && !loading && !filterLoading && (
                <div className="flex justify-center items-center min-h-[60vh] w-full">
                    <div className="text-center">
                        <p className='text-gray-500 text-lg font-medium'>No courses found</p>
                        <p className='text-gray-400 text-sm mt-2'>
                            {activeFilter === 'all'
                                ? 'Create your first course to get started'
                                : `No ${activeFilter} courses available`
                            }
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
} 