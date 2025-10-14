
'use client'

import CourseCardStudent from '@/app/_components/Student/Discover/CourseCard'
import React, { useEffect, useState } from 'react'
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGetAllCourseListQuery } from '@/rtk/api/users/allCourseListApis'
import ResuablePagination from '@/components/Resuable/ResuablePagination'
import { DEFAULT_PAGINATION, PAGINATION_LIMITS, PaginationResponse } from '@/lib/paginationTypes'

interface Course {
    id: string
    title: string
    slug: string
    summary: string | null
    description: string
    visibility: string
    video_length: string
    duration: string
    start_date: string
    end_date: string
    thumbnail: string
    total_price: string
    course_type: string
    note: string
    available_site: number
    language: string | null
    courses: Array<{
        id: string
        title: string
        price: string
    }>
    thumbnail_url: string
    is_enrolled?: boolean
}

export default function CourseListStudent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGINATION.page)
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGINATION.limit)
    const [isInitialized, setIsInitialized] = useState(false)
    const courseTypes = ['all', 'bootcamp', 'regular']

    // Use API query with debounced search
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchTerm])


    const { data, isLoading, error } = useGetAllCourseListQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm,
        type: selectedType === 'all' ? '' : selectedType
    }, {
        skip: !isInitialized
    })

    const courses = data?.data?.series || []
    const pagination: PaginationResponse = data?.data?.pagination || {
        total: 0,
        page: DEFAULT_PAGINATION.page,
        limit: DEFAULT_PAGINATION.limit,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
    }

    useEffect(() => {
        const viewParam = searchParams.get('view')
        if (viewParam === 'grid' || viewParam === 'list') {
            setViewMode(viewParam)
        }

        const typeParam = searchParams.get('type')
        if (typeParam && courseTypes.includes(typeParam)) {
            setSelectedType(typeParam)
        }

        setIsInitialized(true)
    }, [searchParams])

    const handleViewModeChange = (mode: 'grid' | 'list') => {
        setViewMode(mode)
        const currentType = searchParams.get('type') || 'all'
        router.push(`?view=${mode}&type=${currentType}`)
    }

    const handleTypeChange = (type: string) => {
        setSelectedType(type)
        const currentView = searchParams.get('view') || 'grid'
        router.push(`?view=${currentView}&type=${type}`)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (itemsPerPage: number) => {
        setItemsPerPage(itemsPerPage)
        setCurrentPage(1)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="overflow-hidden animate-pulse">
                            <div className="h-48 sm:h-56 bg-gray-200"></div>
                            <CardContent className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-8 bg-gray-200 rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#1D1F2C] mb-2">
                    Discover Courses
                </h1>
                <p className="text-sm text-gray-600 max-w-2xl">
                    Explore our comprehensive collection of courses designed to enhance your skills
                </p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-4 w-full">
                        {/* Search */}
                        <div className="relative flex-1 xl:w-7/12">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                            <Input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 sm:pl-10 pr-4 focus:outline-none"
                            />
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-2 xl:w-4/12">
                            {/* Course Type Filter */}
                            <div className="flex items-center gap-2 min-w-0 sm:min-w-[140px]">
                                <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <Select value={selectedType} onValueChange={handleTypeChange}>
                                    <SelectTrigger className="h-10 sm:h-11">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courseTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-gray-100 rounded-lg p-1 w-full">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewModeChange('grid')}
                                    className={`h-8 w-1/2 px-3 cursor-pointer transition-all duration-200 ${viewMode === 'grid'
                                        ? 'bg-white shadow-sm text-[#0F2598]'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                    <span className="ml-2 text-xs font-medium">Grid</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewModeChange('list')}
                                    className={`h-8 w-1/2 sm px-3 cursor-pointer transition-all duration-200 ${viewMode === 'list'
                                        ? 'bg-white shadow-sm text-[#0F2598]'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                    <span className="ml-2 text-xs font-medium">List</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Course Grid */}
            {courses.length > 0 ? (
                <>
                    <div className={`${viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6'
                        : 'space-y-4'
                        }`}>
                        {courses.map((course: Course) => (
                            <CourseCardStudent
                                key={course.id}
                                course={course}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <ResuablePagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.total}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        itemsPerPageOptions={PAGINATION_LIMITS}
                    />
                </>
            ) : (
                <Card className="py-12 sm:py-16">
                    <CardContent className="text-center">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                            No courses found
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 mb-6">
                            Try adjusting your search criteria or filters
                        </p>
                        <Button
                            variant="outline"

                            onClick={() => {
                                setSearchTerm('')
                                setSelectedType('all')
                                setCurrentPage(DEFAULT_PAGINATION.page)
                            }}
                            className="px-6 cursor-pointer"
                        >
                            Clear Filters
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
