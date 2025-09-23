'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Loader2, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CourseCard from '@/app/_components/Admin/CourseManagement/CourseCard'
import ResuablePagination from '@/components/Resuable/ResuablePagination'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setSearchQuery, setPagination, PAGINATION_CONSTANTS } from '@/redux/slices/courseManagementSlice'
import { useGetAllCoursesQuery } from '@/redux/api/courseManagementApi'
import toast from 'react-hot-toast'
import { useDebounce } from '@/hooks/useDebounce'



export default function CourseManagement() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Local state for search input - completely separate from Redux
    const [localSearchInput, setLocalSearchInput] = useState('')
    const [isInputFocused, setIsInputFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const {
        pagination,
        searchQuery
    } = useAppSelector(state => state.courseManagement)

    // Use RTK Query hook for fetching courses
    const {
        data: coursesData,
        isLoading: coursesLoading,
        error: coursesError,
        refetch
    } = useGetAllCoursesQuery({
        search: searchQuery,
        page: pagination.page,
        limit: pagination.limit
    })

    const courses = coursesData?.data?.series || []
    const coursesPagination = coursesData?.data?.pagination || pagination

    const debouncedSearchQuery = useDebounce(localSearchInput, 500)

    useEffect(() => {
        setLocalSearchInput(searchQuery)
    }, [])

    useEffect(() => {
        if (debouncedSearchQuery !== searchQuery) {
            dispatch(setSearchQuery(debouncedSearchQuery))
            if (debouncedSearchQuery !== searchQuery) {
                dispatch(setPagination({ page: PAGINATION_CONSTANTS.DEFAULT_PAGE, limit: pagination.limit }))
            }
        }
    }, [debouncedSearchQuery, searchQuery, dispatch, pagination.limit])
    useEffect(() => {
        if (isInputFocused && inputRef.current && document.activeElement !== inputRef.current) {

            const currentValue = inputRef.current.value
            const currentSelectionStart = inputRef.current.selectionStart
            const currentSelectionEnd = inputRef.current.selectionEnd
            inputRef.current.focus()
            if (currentSelectionStart !== null && currentSelectionEnd !== null) {
                inputRef.current.setSelectionRange(currentSelectionStart, currentSelectionEnd)
            }
        }
    }, [courses, isInputFocused])

    // RTK Query automatically handles refetching when parameters change

    // Handle course fetch errors
    useEffect(() => {
        if (coursesError) {
            const errorMessage = 'data' in coursesError 
                ? (coursesError.data as any)?.message || 'Failed to fetch courses'
                : 'Failed to fetch courses'
            toast.error(errorMessage)
        }
    }, [coursesError])

    const handleCreateCourse = () => {
        setIsLoading(true)
        setTimeout(() => {
            router.push('/admin/create-course')
            setIsLoading(false)
        }, 200)
    }

    // Search handler - updates local state only, debouncing will handle Redux update
    const handleSearchChange = (value: string) => {
        setLocalSearchInput(value)
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
        return Array.from({ length: coursesPagination.limit || pagination.limit }, (_, index) => (
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
                            ref={inputRef}
                            placeholder="Search courses"
                            value={localSearchInput}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
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
                        ref={inputRef}
                        placeholder="Search courses"
                        value={localSearchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
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
                {courses.map((course: any) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>

            {/* Pagination - Only show when there are multiple pages */}
            {coursesPagination.totalPages > 1 && (
                <div className="mt-8">
                    <ResuablePagination
                        currentPage={coursesPagination.page}
                        totalPages={coursesPagination.totalPages}
                        totalItems={coursesPagination.total}
                        itemsPerPage={coursesPagination.limit}
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
                            {localSearchInput ? 'Try adjusting your search terms' : 'Create your first course to get started'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
} 