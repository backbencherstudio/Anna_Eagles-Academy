"use client"

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface Assignment {
    id: string
    title: string
    created_date: string
    start_date: string
    deadline: string
    duration: string
    questions: number
    status: 'on-time' | 'late' | ''
    quiz_status: 'finished' | 'upcoming' | 'running'
    grade?: number | null
    quiz_type: 'quiz' | 'test'
    isCompleted: boolean
}

const assignments: Assignment[] = [
    {
        id: 'quiz_1', // Quiz ID from Quiz.json
        title: 'Laravel Basics',
        created_date: '7/26/2025',
        start_date: '7/26/2025',
        deadline: '7/26/2025',
        duration: '10 minutes',
        questions: 9,
        status: 'on-time',
        quiz_status: 'finished',
        grade: 40,
        quiz_type: 'quiz',
        isCompleted: true
    },
    {
        id: 'test_1', // Test ID from EassyTest.json
        title: 'Essay Test 1',
        created_date: '7/25/2025',
        start_date: '7/25/2025',
        deadline: '7/25/2025',
        duration: '60 minutes',
        questions: 10,
        status: 'on-time',
        quiz_status: 'finished',
        grade: 90,
        quiz_type: 'test',
        isCompleted: true
    },
    {
        id: 'quiz_2',
        title: 'Assessment Test 3',
        created_date: '7/22/2025',
        start_date: '7/22/2025',
        deadline: '7/22/2025',
        duration: '10 minutes',
        questions: 10,
        status: 'late',
        quiz_status: 'upcoming',
        grade: 70,
        quiz_type: 'quiz',
        isCompleted: true
    },
    {
        id: 'test_2',
        title: 'Assessment Test 4',
        created_date: '7/28/2025',
        start_date: '7/28/2025',
        deadline: '7/28/2025',
        duration: '10 minutes',
        questions: 10,
        status: '',
        quiz_status: 'upcoming',
        grade: null,
        quiz_type: 'test',
        isCompleted: false
    },
    {
        id: 'quiz_3',
        title: 'Quiz 5',
        created_date: '7/27/2025',
        start_date: '7/27/2025',
        deadline: '7/27/2025',
        duration: '10 minutes',
        questions: 10,
        status: '',
        quiz_status: 'running',
        grade: null,
        quiz_type: 'quiz',
        isCompleted: false
    },
    {
        id: 'test_3',
        title: 'Test 1',
        created_date: '7/27/2025',
        start_date: '7/27/2025',
        deadline: '7/27/2025',
        duration: '10 minutes',
        questions: 10,
        status: '',
        quiz_status: 'running',
        grade: null,
        quiz_type: 'test',
        isCompleted: false
    }
]

export default function AssignmentsPage() {
    const [filter, setFilter] = useState('Upcoming')
    const router = useRouter()

    const getStatusColor = (status: string, quizStatus: string) => {
        // If status exists, use it, otherwise use quiz_status
        const displayStatus = status || quizStatus

        switch (displayStatus) {
            case 'on-time':
                return 'bg-green-50 text-green-600 border-l-4 border-l-green-500'
            case 'late':
                return 'bg-red-50 text-red-600 border-l-4 border-l-red-500'
            case 'finished':
                return 'bg-blue-50 text-blue-600 border-l-4 border-l-blue-500'
            case 'upcoming':
                return 'bg-yellow-50 text-yellow-600 border-l-4 border-l-yellow-500'
            case 'running':
                return 'bg-purple-50 text-purple-600 border-l-4 border-l-purple-500'
            default:
                return 'bg-gray-50 text-gray-600 border-l-4 border-l-gray-500'
        }
    }

    const getStatusText = (status: string, quizStatus: string) => {
        // If status exists, use it, otherwise use quiz_status
        const displayStatus = status || quizStatus

        switch (displayStatus) {
            case 'on-time':
                return 'On Time'
            case 'late':
                return 'Late'
            case 'finished':
                return 'Finished'
            case 'upcoming':
                return 'Upcoming'
            case 'running':
                return 'Running'
            default:
                return 'Upcoming'
        }
    }

    const getGradeColor = (grade: number) => {
        if (grade < 50) return 'text-red-600'
        if (grade < 80) return 'text-yellow-600'
        return 'text-teal-600'
    }

    // Filter assignments based on selected filter
    const filteredAssignments = assignments.filter((assignment) => {
        const displayStatus = assignment.status || assignment.quiz_status

        switch (filter) {
            case 'Upcoming':
                return displayStatus === 'upcoming' || displayStatus === 'running'
            case 'Finished':
                return displayStatus === 'finished' || assignment.status === 'on-time' || assignment.status === 'late'
            default:
                return true
        }
    })

    return (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            {/* header section */}
            <div className="mb-6 sm:mb-7">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">Assignment</h1>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            Engage in lessons, connect with learners, and explore topics at your pace. Your strengths are assets—use them to enhance your learning and expand your knowledge!
                        </p>
                    </div>

                    {/* Dropdown Filter */}
                    <div className="flex-shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex cursor-pointer items-center gap-2 bg-gray-100 border-gray-200 hover:bg-gray-200 px-3 sm:px-4 py-2 h-auto text-gray-700 text-sm sm:text-base w-full sm:w-auto"
                                >
                                    {filter}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 sm:w-40">
                                <DropdownMenuItem onClick={() => setFilter('Upcoming')}>
                                    Upcoming
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter('Finished')}>
                                    Finished
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                    <div key={assignment.id} className="bg-[#FEF9F2] rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {/* Status Badge */}
                                    <span className={`px-2 sm:px-3 py-1 rounded border border-gray-200 text-xs font-medium ${getStatusColor(assignment.status, assignment.quiz_status)}`}>
                                        {getStatusText(assignment.status, assignment.quiz_status)}
                                    </span>

                                    {/* Date */}
                                    <span className="text-gray-500 text-xs sm:text-sm">•</span>
                                    <span className="text-gray-400 text-xs sm:text-sm">{assignment.start_date}</span>
                                </div>

                                {/* Assignment Info */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">{assignment.title}</h3>
                                        <p className="text-gray-400 text-sm">{assignment.questions} Questions</p>
                                    </div>

                                    {/* Grade or Deadline Display */}
                                    <div className="text-left sm:text-right flex-shrink-0">
                                        {assignment.grade !== null && assignment.grade !== undefined ? (
                                            // Show Grade if exists
                                            <>
                                                <p className="text-gray-700 text-xs sm:text-sm font-semibold mb-1">Grade</p>
                                                <p className={`font-bold text-base sm:text-lg ${getGradeColor(assignment.grade)}`}>
                                                    {assignment.grade}
                                                </p>
                                            </>
                                        ) : (
                                            // Show Deadline if no grade
                                            <>
                                                <p className="text-gray-700 flex  gap-2 text-xs sm:text-sm font-semibold mb-1">Deadline</p>
                                                <p className=" text-base sm:text-sm text-white bg-[#F1C27D] px-2 py-1 rounded-md">
                                                    {assignment.deadline}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Action Button */}
                                {assignment.quiz_status === 'running' && (
                                    <div className="mt-3 sm:mt-4">
                                        <Button
                                            className="bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/80 text-white px-6 sm:px-10 py-2 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto"
                                            onClick={() => router.push(`/assignments/${assignment.id}`)}
                                        >
                                            Start
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
