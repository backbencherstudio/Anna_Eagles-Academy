"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Search, Check, BookOpen, X, Loader2 } from 'lucide-react'
import { useGetSeriesWithCoursesQuery } from '@/rtk/api/admin/courseFilterApis'
import { useDebounce } from '@/hooks/useDebounce'
import { RootState } from '@/rtk'

interface Course {
    id: string
    title: string
}

interface SeriesWithCourses {
    id: string
    title: string
    created_at: string
    courses: Course[]
}

interface SeriesCourseDropdownProps {
    onSelectionChange: (selectedCourses: Course[]) => void
    selectedSeries: SeriesWithCourses | null
    placeholder?: string
    label?: string
    className?: string
}

export default function SeriesCourseDropdown({ 
    onSelectionChange, 
    selectedSeries,
    placeholder = "Select courses...", 
    label = "Courses",
    className = ""
}: SeriesCourseDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Get selected courses from Redux state
    const selectedCourses = useSelector((state: RootState) => state.scholarshipCodeGenerate.selectedCourses)

    // Debounce search query with 300ms delay
    const debouncedSearchQuery = useDebounce(searchQuery, 300)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Handle search query changes with loading state
    useEffect(() => {
        if (searchQuery !== debouncedSearchQuery) {
            setIsSearching(true)
        } else {
            setIsSearching(false)
        }
    }, [searchQuery, debouncedSearchQuery])

    const handleCourseSelect = (course: Course) => {
        const isAlreadySelected = selectedCourses.find(c => c.id === course.id)
        let newSelectedCourses: Course[]
        
        if (isAlreadySelected) {
            newSelectedCourses = selectedCourses.filter(c => c.id !== course.id)
        } else {
            newSelectedCourses = [...selectedCourses, course]
        }
        
        onSelectionChange(newSelectedCourses)
    }

    const handleCourseRemove = (courseId: string) => {
        const newSelectedCourses = selectedCourses.filter(c => c.id !== courseId)
        onSelectionChange(newSelectedCourses)
    }

    const filteredCourses = selectedSeries?.courses?.filter((course: Course) =>
        course.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    ) || []

    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="text-sm font-medium text-gray-700">
                {label}
            </Label>
            <div className="relative" ref={dropdownRef}>
                {/* Main Input Field */}
                <div
                    className="min-h-[44px] border border-gray-300 rounded-lg p-3 flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200 bg-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex flex-wrap gap-2 items-center flex-1">
                        {selectedCourses.length > 0 ? (
                            selectedCourses.map((course) => (
                                <Badge
                                    key={course.id}
                                    variant="secondary"
                                    className="group flex items-center gap-2 pr-1 shadow-none"
                                >
                                    <span className="text-sm text-gray-700">{course.title}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleCourseRemove(course.id)
                                        }}
                                        className="opacity-60 cursor-pointer hover:opacity-100 hover:bg-blue-200 rounded-full p-0.5 transition-all duration-200 group-hover:bg-blue-200"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500">
                                {selectedSeries ? placeholder : "Please select a series first"}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center text-gray-500 ml-auto">
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {/* Dropdown List */}
                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                        <div className="p-3 border-b">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                                {selectedSeries ? `Courses in "${selectedSeries.title}":` : 'Select Courses:'}
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 pr-8 w-full"
                                />
                                {isSearching && (
                                    <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {!selectedSeries ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                    Please select a series first
                                </div>
                            ) : isSearching ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Searching...
                                </div>
                            ) : filteredCourses.length > 0 ? (
                                filteredCourses.map((course: Course) => (
                                    <button
                                        key={course.id}
                                        onClick={() => handleCourseSelect(course)}
                                        className="w-full cursor-pointer text-left px-4 py-3 hover:bg-blue-50 text-sm flex items-center justify-between transition-colors duration-150"
                                    >
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-700">{course.title}</span>
                                        </div>
                                        {selectedCourses.find(c => c.id === course.id) && (
                                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                    {searchQuery ? 'No courses found matching your search' : 'No courses available'}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
