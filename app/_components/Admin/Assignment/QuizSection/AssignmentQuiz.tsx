'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGetAllDataQuizQuery } from '@/rtk/api/quizApis'
import PublishedQuiz from './PublishedQuiz'
import UnpublishedQuiz from './UnpublishedQuiz'

// Data type definition based on API response
interface QuizSubmission {
    id: string
    status: string
    total_grade: number
    percentage: number
    submitted_at: string
}

interface QuizData {
    id: string
    title: string
    due_at: string
    published_at: string
    is_published: boolean
    created_at: string
    total_marks: number
    series_id: string
    series: {
        id: string
        title: string
    }
    course: {
        id: string
        title: string
    }
    _count: {
        submissions: number
    }
    submissions: QuizSubmission[]
    submission_count: number
    total_students: number
    remaining_time?: number
}


export default function AssignmentQuiz() {
    const router = useRouter()

    // Fetch quiz dashboard data from API
    const { data: quizData, isLoading, isError, refetch } = useGetAllDataQuizQuery(undefined)

    const handleCreateAssignment = () => {
        router.push('/admin/create-quiz')
    }

    const handleRefresh = () => {
        refetch()
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 pb-4">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Assignments (Quiz)</h1>
                    <div>

                        <Button disabled className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create new Assignment
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardContent className="p-4">
                                <div className="w-4 h-4 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    // Show error state
    if (isError) {
        return (
            <div className="bg-white rounded-lg p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 pb-4">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Assignments (Quiz)</h1>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                        <Button
                            onClick={handleCreateAssignment}
                            className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create new Assignment
                        </Button>
                    </div>
                </div>
                <div className="text-center py-12">
                    <p className="text-red-500 text-lg mb-4">Failed to load quiz data</p>
                    <p className="text-gray-600 mb-4">Please check your connection and try again</p>
                    <Button
                        onClick={handleRefresh}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    // Get submitted quizzes for display
    const submittedQuizzes = quizData?.data?.submitted_quizzes || []

    return (
        <>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 pb-4">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Assignments (Quiz)
                    </h1>
                    <div >

                        <Button
                            onClick={handleCreateAssignment}
                            className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create new Assignment
                        </Button>
                    </div>
                </div>

                {/* Quiz Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {submittedQuizzes.map((quiz: QuizData) => (
                        <Card
                            key={quiz.id}
                            className="hover:shadow transition-shadow duration-200 cursor-pointer border border-gray-200"
                        >
                            <CardContent className="p-4">
                                {/* Orange square indicator */}
                                <div className="w-4 h-4 bg-[#FC4B0E] rounded mb-3"></div>

                                {/* Quiz title */}
                                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2 line-clamp-2">
                                    {quiz.title}
                                </h3>

                                {/* Course and Series info */}
                                <div className="text-xs text-gray-500 mb-2">
                                    <p className="truncate">{quiz.series?.title}</p>
                                    <p className="truncate">{quiz.course?.title}</p>
                                </div>

                                {/* Submission status */}
                                <p className="text-sm text-gray-600">
                                    {quiz.submission_count}/{quiz.total_students} Submission
                                </p>

                                {/* Total marks */}
                                <p className="text-xs text-gray-500 mt-1">
                                    {quiz.total_marks} marks
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty state */}
                {submittedQuizzes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No quiz assignments found</p>
                        <Button
                            onClick={handleCreateAssignment}
                            className="mt-4 bg-orange-500 hover:bg-orange-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create your first quiz assignment
                        </Button>
                    </div>
                )}
            </div>
            {/* published and unpublished cards */}
            <div className="bg-white rounded-lg p-4 border border-gray-100 mt-5">
                <div className='space-y-5'>
                    <PublishedQuiz
                        publishedQuizzes={quizData?.data?.published_quizzes || []}
                    />
                    <UnpublishedQuiz
                        unpublishedQuizzes={quizData?.data?.unpublished_quizzes || []}
                    />
                </div>
            </div>
        </>

    )
}
