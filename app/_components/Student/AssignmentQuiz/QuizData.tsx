import React, { useState } from 'react'
import { useGetAllQuizzesQuery } from '@/rtk/api/users/assignmentQuizApis'
import { Quiz } from '@/rtk/slices/users/assignmentQuizSlice'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { formatUTCDateToLocal } from '@/lib/calendarUtils'

interface QuizDataProps {
    filter: 'Upcoming' | 'Finished' | 'All'
}

export default function QuizData({ filter }: QuizDataProps) {
    const router = useRouter()
    const [loadingQuizId, setLoadingQuizId] = useState<string | null>(null)

    const { data: response, isLoading, error } = useGetAllQuizzesQuery({
        page: 1,
        limit: 12,
        search: '',
        type: ''
    })

    const quizzes = response?.data?.quizzes || []

    const formatDate = (dateString: string) => {
        return formatUTCDateToLocal(dateString, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const isQuizLate = (dueAt: string) => new Date() > new Date(dueAt)

    const handleQuizClick = (quizId: string) => {
        setLoadingQuizId(quizId)
        router.push(`/user/assignments/quiz_${quizId}`)
    }

    const getQuizStatus = (quiz: Quiz) => {
        const isLate = isQuizLate(quiz.due_at) || quiz.remaining_time === 'Expired'
        const isSubmitted = quiz.submission_status?.is_submitted || false

        if (isLate) return { text: 'Late', color: 'red' }
        if (isSubmitted) return { text: 'Submitted', color: 'green' }
        return { text: 'Running', color: 'green' }
    }

    const LoadingState = () => (
        <div className="flex items-center justify-center py-6 sm:py-8 px-4">
            <div className="text-gray-500 text-sm sm:text-base">Loading quizzes...</div>
        </div>
    )

    const ErrorState = () => (
        <div className="flex items-center justify-center py-6 sm:py-8 px-4">
            <div className="text-red-500 text-sm sm:text-base">Error loading quizzes</div>
        </div>
    )

    const EmptyState = () => (
        <div className="flex items-center justify-center py-6 sm:py-8 px-4">
            <div className="text-gray-500 text-sm sm:text-base">No quizzes found</div>
        </div>
    )

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState />
    if (!quizzes.length) return <EmptyState />

    const QuizCard = ({ quiz }: { quiz: Quiz }) => {
        const status = getQuizStatus(quiz)
        const isLate = isQuizLate(quiz.due_at)

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center">
                            <div className={`w-1 h-6 rounded-full mr-2 bg-${status.color}-500`}></div>
                            <span className={`px-3 py-1 rounded text-xs font-medium bg-${status.color}-50 text-${status.color}-600`}>
                                {status.text}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-gray-500 text-sm hidden sm:block">•</span>
                            <span className="text-gray-600 text-sm">{formatDate(quiz.published_at)}</span>
                        </div>
                    </div>

                    <div className="text-left sm:text-right">
                        {quiz.submission_status?.is_submitted ? (
                            <>
                                <div className="text-gray-600 text-sm mb-1">{(quiz.submission_status as any).status}</div>
                                <div className="px-3 py-1 rounded text-sm font-medium inline-block bg-green-50 text-green-600">
                                    {formatDate((quiz.submission_status as any).submitted_at)}
                                </div>
                                <div className="text-xs mt-1 text-gray-500">
                                    Due: {formatDate(quiz.due_at)}
                                </div>
                                <div className="text-xs mt-1 text-gray-500">
                                    Score: {(quiz.submission_status as any).total_grade}/{quiz.total_marks}
                                </div>
                                {isLate && (
                                    <div className="text-xs mt-1 text-red-500 font-medium">
                                        {quiz.remaining_time === 'Expired' ? 'Expired' : 'Late'}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="text-gray-600 text-sm mb-1">
                                    {quiz.remaining_time === 'Expired' ? 'Expired' : 'Deadline'}
                                </div>
                                <div className={`px-3 py-1 rounded text-sm font-medium inline-block ${isLate ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {formatDate(quiz.due_at)}
                                </div>
                                {quiz.remaining_time && (
                                    <div className={`text-xs mt-1 ${isLate ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                        {quiz.remaining_time === 'Expired' ? 'Expired' : isLate ? 'Overdue' : `Remaining: ${quiz.remaining_time}`}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{quiz.title}</h3>
                        <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
                        <span className="text-blue-600 text-sm font-medium">{quiz.total_marks} Marks</span>
                    </div>
                    <div className="space-y-1">
                        {/* <p className="text-gray-700 text-sm break-words">{quiz.instructions}</p> */}
                        <p className="text-gray-700 text-sm break-words">Series: {quiz.series.title}</p>
                        <p className="text-gray-700 text-sm break-words">Course: {quiz.course.title}</p>
                    </div>
                </div>

                {/* Action */}
                <div className="flex justify-start">
                    <Button
                        className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/90 text-white px-6 sm:px-8 py-2 rounded-lg text-sm font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleQuizClick(quiz.id)}
                        disabled={loadingQuizId === quiz.id}
                    >
                        {loadingQuizId === quiz.id ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Loading...
                            </div>
                        ) : (
                            quiz.submission_status?.is_submitted ? 'View Quiz' : 'Start Quiz'
                        )}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            {quizzes.map((quiz: Quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
            ))}
        </div>
    )
}
