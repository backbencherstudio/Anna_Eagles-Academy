"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

import { X, Copy, Check, ChevronDown, Search } from 'lucide-react'

interface Course {
    id: string
    title: string
}

interface CodeType {
    value: string
    label: string
}

const courses: Course[] = [
    { id: '1', title: 'The Kingdom of God is Spirit' },
    { id: '2', title: 'The Life and Teachings of Jesus' },
    { id: '3', title: 'Understanding the Bible: Old & New Testament' },
    { id: '4', title: 'Discipleship & Evangelism Essentials' },
    { id: '5', title: 'The Kingdom of God is all about Spirit' },
    { id: '6', title: 'The Kingdom of God is all about Character' }
]

const codeTypes: CodeType[] = [
    { value: 'scholarship', label: 'Scholarship / Sponsored Student' },
    { value: 'free', label: 'Free Student' },
    { value: 'paid', label: 'Paid Student' }
]

export default function CodeGeneratePage() {
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
    const [studentName, setStudentName] = useState('')
    const [studentEmail, setStudentEmail] = useState('')
    const [codeType, setCodeType] = useState('')
    const [generatedCode, setGeneratedCode] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    const handleCourseSelect = (course: Course) => {
        if (!selectedCourses.find(c => c.id === course.id)) {
            setSelectedCourses([...selectedCourses, course])
        }
        setIsPopoverOpen(false)
    }

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsPopoverOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleCourseRemove = (courseId: string) => {
        setSelectedCourses(selectedCourses.filter(c => c.id !== courseId))
    }

    const generateCode = () => {
        // Generate a random code
        const code = Math.random().toString(36).substring(2, 10)
        setGeneratedCode(code)
        setIsSuccess(true)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    return (
        <div className=" bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-white pb-10">
                    <CardHeader className="bg-[#FEF9F2] rounded-t-xl pt-2 py-5">
                        <CardTitle className="text-sm font-semibold text-[#F1C27D]">CODE GENERATE</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Course Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="course-select" className="text-sm font-medium text-gray-700">
                                Select Course / Series Title
                            </Label>
                            <div className="relative" ref={dropdownRef}>
                                {/* Main Input Field with Selected Courses */}
                                <div
                                    className="min-h-[44px] border border-gray-300 rounded-lg p-3 flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200 bg-white"
                                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
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
                                                        <X className="w-3 h-3 " />
                                                    </button>
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-500">Select courses...</span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-gray-500 ml-auto">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Dropdown List */}
                                {isPopoverOpen && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                                        <div className="p-3 border-b">
                                            <div className="text-sm font-medium text-gray-700 mb-2">Select Course:</div>
                                            <div className="relative">
                                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search courses..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pl-8 w-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {filteredCourses.map((course) => (
                                                <button
                                                    key={course.id}
                                                    onClick={() => handleCourseSelect(course)}
                                                    className="w-full cursor-pointer text-left px-4 py-3 hover:bg-blue-50 text-sm flex items-center justify-between transition-colors duration-150"
                                                    disabled={selectedCourses.find(c => c.id === course.id) !== undefined}
                                                >
                                                    <span className={selectedCourses.find(c => c.id === course.id) ? 'text-gray-400 line-through truncate' : 'text-gray-700 truncate'}>
                                                        {course.title}
                                                    </span>
                                                    {selectedCourses.find(c => c.id === course.id) && (
                                                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                                                    )}
                                                </button>
                                            ))}
                                            {filteredCourses.length === 0 && (
                                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                    No courses found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Student Name */}
                        <div className="space-y-2">
                            <Label htmlFor="student-name" className="text-sm font-medium text-gray-700">
                                Student Name
                            </Label>
                            <Input
                                id="student-name"
                                type="text"
                                placeholder="Student Name"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Student Email */}
                        <div className="space-y-2">
                            <Label htmlFor="student-email" className="text-sm font-medium text-gray-700">
                                Student Email Address
                            </Label>
                            <Input
                                id="student-email"
                                type="email"
                                placeholder="example@email.com"
                                value={studentEmail}
                                onChange={(e) => setStudentEmail(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Code Type */}
                        <div className="space-y-2">
                            <Label htmlFor="code-type" className="text-sm font-medium text-gray-700">
                                Code Type
                            </Label>
                            <Select value={codeType} onValueChange={setCodeType}>
                                <SelectTrigger id="code-type" className="w-full">
                                    <SelectValue placeholder="Select code type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {codeTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Generate Button */}
                        <Button
                            onClick={generateCode}
                            className="w-full bg-[#0F2598] hover:bg-[#0F2598]/90 text-white py-5 cursor-pointer text-base font-medium transition-all duration-200"
                        >
                            Code Generate
                        </Button>

                        {/* Success Message */}
                        {isSuccess && (
                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="space-y-4 p-4">
                                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                                        <Check className="w-4 h-4" />
                                        The code has been fully generated.
                                    </div>

                                    {/* Generated Code */}
                                    <div className="flex items-center justify-between bg-white border border-green-200 p-4 rounded-md">
                                        <span className="font-mono text-lg font-semibold text-gray-900">
                                            {generatedCode}
                                        </span>
                                        <Button
                                            onClick={copyToClipboard}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center cursor-pointer gap-2 border-green-300 hover:bg-green-50"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-4 h-4 text-green-600" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
