"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown, Search, Check, User, Loader2 } from 'lucide-react'
import { useGetAllStudentListQuery } from '@/rtk/api/admin/filterStudentListApis'
import { useDebounce } from '@/hooks/useDebounce'
import { RootState } from '@/rtk'

interface Student {
    id: string
    name: string
    email: string
}

interface CardGeneratorStudentDropdownProps {
    onStudentSelect: (student: Student) => void
    placeholder?: string
    label?: string
    className?: string
}

export default function CardGeneratorStudentDropdown({
    onStudentSelect,
    placeholder = "Select student...",
    label = "Recipient Name",
    className = ""
}: CardGeneratorStudentDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Get selected student from Redux state
    const selectedStudent = useSelector((state: RootState) => state.giftCardGenerate.selectedStudent)

    // Debounce search query with 300ms delay
    const debouncedSearchQuery = useDebounce(searchQuery, 300)

    const { data: studentsData, isLoading, error } = useGetAllStudentListQuery({})

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

    const handleStudentSelect = (student: Student) => {
        onStudentSelect(student)
        setIsOpen(false)
        setSearchQuery('')
    }

    // Handle search query changes with loading state
    useEffect(() => {
        if (searchQuery !== debouncedSearchQuery) {
            setIsSearching(true)
        } else {
            setIsSearching(false)
        }
    }, [searchQuery, debouncedSearchQuery])

    const filteredStudents = studentsData?.filter((student: Student) =>
        student.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    ) || []

    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </Label>
            <div className="relative" ref={dropdownRef}>
                {/* Main Input Field */}
                <div
                    className="py-2 border border-gray-300 rounded-lg px-2 flex items-center cursor-pointer hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200 bg-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center gap-3 flex-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className={`text-sm ${selectedStudent ? 'text-gray-700' : 'text-gray-500'}`}>
                            {selectedStudent ? selectedStudent.name : placeholder}
                        </span>
                    </div>
                    <div className="flex items-center text-gray-500 ml-auto">
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {/* Dropdown List */}
                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                        <div className="p-3 border-b">
                            <div className="text-sm font-medium text-gray-700 mb-2">Select Student:</div>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search students..."
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
                            {isLoading ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading students...
                                </div>
                            ) : error ? (
                                <div className="px-4 py-3 text-sm text-red-500 text-center">
                                    Error loading students
                                </div>
                            ) : isSearching ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Searching...
                                </div>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student: Student) => (
                                    <button
                                        key={student.id}
                                        onClick={() => handleStudentSelect(student)}
                                        className="w-full cursor-pointer text-left px-4 py-3 hover:bg-blue-50 text-sm flex items-center justify-between transition-colors duration-150"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-gray-700 font-medium">
                                                {student.name}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {student.email}
                                            </span>
                                        </div>
                                        {selectedStudent?.id === student.id && (
                                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                    {searchQuery ? 'No students found matching your search' : 'No students found'}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
