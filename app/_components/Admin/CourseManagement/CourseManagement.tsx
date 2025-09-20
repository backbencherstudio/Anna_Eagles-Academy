'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CourseCard from '@/app/_components/Admin/CourseManagement/CourseCard'
import ResuablePagination from '@/components/Resuable/ResuablePagination'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchCoursesAsync, setSearchQuery, setPagination, PAGINATION_CONSTANTS } from '@/redux/slices/courseManagementSlice'
import toast from 'react-hot-toast'

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
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        courses,
        coursesLoading,
        coursesError,
        pagination,
        searchQuery
    } = useAppSelector(state => state.courseManagement)

    // Fetch courses on component mount and when search/pagination changes
    useEffect(() => {
        dispatch(fetchCoursesAsync({
            search: searchQuery,
            page: pagination.page,
            limit: pagination.limit
        }))
    }, [dispatch, searchQuery, pagination.page, pagination.limit])

    // Handle course fetch errors
    useEffect(() => {
        if (coursesError) {
            toast.error(coursesError)
        }
    }, [coursesError])

    const handleCreateCourse = () => {
        setIsLoading(true)
        setTimeout(() => {
            router.push('/admin/create-course')
            setIsLoading(false)
        }, 200)
    }

    // Search handler with debounce
    const handleSearchChange = (value: string) => {
        dispatch(setSearchQuery(value))
        // Reset to first page when searching
        dispatch(setPagination({ page: PAGINATION_CONSTANTS.DEFAULT_PAGE, limit: pagination.limit }))
    }

    // Pagination handlers
    const handlePageChange = (page: number) => {
        dispatch(setPagination({ page, limit: pagination.limit }))
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        dispatch(setPagination({ page: PAGINATION_CONSTANTS.DEFAULT_PAGE, limit: newItemsPerPage }))
    }

    // Create skeleton items based on pagination limit
    const createSkeletonItems = () => {
        return Array.from({ length: pagination.limit }, (_, index) => (
            <div key={`skeleton-${index}`} className="bg-white rounded-2xl shadow-sm animate-pulse border border-[#EEE]">
                {/* Image skeleton */}
                <div className="relative w-full h-56 p-3">
                    <div className="w-full h-full bg-gray-200 rounded-3xl"></div>
                </div>

                {/* Content skeleton */}
                <div className="p-4 space-y-3">
                    {/* Title */}
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>

                    {/* Meta rows */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-3 bg-gray-200 rounded w-10"></div>
                            <div className="h-3 bg-gray-200 rounded w-14"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                            <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-3 bg-gray-200 rounded w-14"></div>
                            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 mt-3 mb-3"></div>

                    {/* Progress section */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            </div>
        ))
    }

    if (coursesLoading) {
        return (
            <div className="">
                {/* Header with Create Button */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-4">
                    <h1 className='text-[#1D1F2C] text-[24px] font-semibold'>All Courses</h1>

                    {/* search input */}
                    <div className='relative flex items-center gap-2'>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search courses"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className='pl-10 border-gray-300 rounded-md w-full'
                            disabled
                        />

                        <Button
                            className="bg-[#0F2598]  hover:bg-[#0F2598]/80 text-white rounded-xl py-5 flex items-center gap-2 opacity-50 cursor-not-allowed"
                            disabled
                        >
                            <Plus className="w-5 h-5" />
                            Create New Course
                        </Button>
                    </div>
                </div>

                {/* Loading Skeleton Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-5">
                    {createSkeletonItems()}
                </div>
            </div>
        )
    }

    return (
        <div className="">
            {/* Header with Create Button */}
            <div className="flex flex-col lg:flex-row  gap-4 justify-between items-center mb-4">
                <h1 className='text-[#1D1F2C] text-[24px] font-semibold'>All Courses</h1>

                {/* search input */}
                <div className='relative flex items-center gap-2'>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search courses"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className='pl-10 border-gray-300 rounded-md w-full'
                    />

                    <Button
                        className={`bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white rounded-xl py-5 flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleCreateCourse}
                    >
                        {
                            isLoading ?
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Course...
                                </>
                                :
                                <>
                                    <Plus className="w-5 h-5" />
                                    Create New Course
                                </>
                        }
                    </Button>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-5">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>

            {/* Pagination - Only show when there are multiple pages */}
            {pagination.totalPages > 1 && (
                <div className="mt-8">
                    <ResuablePagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.limit}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        itemsPerPageOptions={PAGINATION_CONSTANTS.ITEMS_PER_PAGE_OPTIONS}
                    />
                </div>
            )}

            {/* Empty State */}
            {courses.length === 0 && !coursesLoading && (
                <div className="flex justify-center items-center min-h-[60vh] w-full">
                    <div className="text-center">
                        <p className='text-gray-500 text-lg font-medium'>No courses found</p>
                        <p className='text-gray-400 text-sm mt-2'>
                            {searchQuery ? 'Try adjusting your search terms' : 'Create your first course to get started'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
} 