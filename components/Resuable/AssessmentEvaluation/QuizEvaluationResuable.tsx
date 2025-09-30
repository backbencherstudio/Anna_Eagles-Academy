'use client'

import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

/**
 * Reusable Quiz Evaluation Component
 * 
 * This component displays quiz evaluation results in a clean, readable format.
 * It can be used across different pages by passing quiz submission data as props.
 * 
 * Features:
 * - Displays quiz title, student info, and course
 * - Shows score summary (total score, percentage, correct answers)
 * - Lists all questions with answer options
 * - Color-coded radio buttons for user answers vs correct answers
 * - Explanations for incorrect answers
 * - Responsive design
 */

interface QuizSubmissionData {
    id: string
    student?: { name: string; email?: string }
    quiz?: { title?: string; course?: { title: string } }
    answers?: Array<{
        id: string
        question_id: string
        answer_id: string
        question?: {
            prompt?: string;
            points: number;
            answers?: Array<{
                id: string
                option: string
                is_correct: boolean
            }>
        }
        points_earned?: number
        is_correct?: boolean
    }>
}

interface QuizEvaluationProps {
    submission: QuizSubmissionData
    onBack?: () => void
    backButtonText?: string
    showBackButton?: boolean
    className?: string
}

export default function QuizEvaluationResuable({
    submission,
    onBack,
    backButtonText = "Back to List",
    showBackButton = true,
    className = ""
}: QuizEvaluationProps) {
    const router = useRouter()

    // ===== COMPUTED VALUES =====
    const totalMaxPoints = useMemo(() => {
        if (!submission?.answers) return 0
        return submission.answers.reduce((sum, ans) => sum + (ans.question?.points || 0), 0)
    }, [submission])

    const totalGivenPoints = useMemo(() => {
        if (!submission?.answers) return 0
        return submission.answers.reduce((sum, ans) => sum + (typeof ans.points_earned === 'number' ? ans.points_earned : 0), 0)
    }, [submission])

    const correctAnswers = submission?.answers?.filter(ans => ans.is_correct).length || 0
    const totalQuestions = submission?.answers?.length || 0
    const percentage = totalMaxPoints > 0 ? Math.round((totalGivenPoints / totalMaxPoints) * 100) : 0

    // ===== EVENT HANDLERS =====
    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            router.push('/admin/assignment-evaluation')
        }
    }

    // ===== MAIN RENDER =====
    return (
        <div className={`bg-white rounded-lg p-6 border border-gray-100 ${className}`}>
            {/* ===== PAGE HEADER ===== */}
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    {showBackButton && (
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {submission.quiz?.title || 'Quiz Submission'} (Quiz)
                        </h1>
                        <p className="text-sm text-gray-500">
                            {submission.student?.name || 'Unknown'} | {submission.quiz?.course?.title || 'Unknown'}
                        </p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Read Only
                </div>
            </div>

            {/* ===== SCORE SUMMARY ===== */}
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-xl font-bold text-blue-800">{totalGivenPoints}/{totalMaxPoints}</div>
                        <div className="text-sm text-blue-600">Total Score</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-blue-800">{percentage}%</div>
                        <div className="text-sm text-blue-600">Percentage</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-blue-800">{correctAnswers}/{totalQuestions}</div>
                        <div className="text-sm text-blue-600">Correct Answers</div>
                    </div>
                </div>
            </div>

            {/* ===== QUESTIONS LIST ===== */}
            <div className="">
                <div className="space-y-8">
                    {submission.answers?.map((ans, index) => (
                        <div key={ans.id} className="space-y-4">
                            {/* Question */}
                            <div>
                                <p className="text-lg font-semibold text-gray-900 mb-2">
                                    {index + 1}. {ans.question?.prompt || 'Question'}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-gray-600">
                                        Score: <span className="font-medium">
                                            {typeof ans.points_earned === 'number' ? ans.points_earned : 0}
                                        </span> / {ans.question?.points || 0}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${ans.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {ans.is_correct ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>
                            </div>

                            {/* Answer Options */}
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-3">Answer</p>
                                <div className="space-y-2">
                                    {ans.question?.answers?.map((option) => {
                                        const isUserAnswer = option.id === ans.answer_id
                                        const isCorrectOption = option.is_correct

                                        let textStyle = "text-gray-900"
                                        let radioStyle = "w-4 h-4 border-2 border-gray-300 rounded-full"

                                        if (isUserAnswer && isCorrectOption) {
                                            textStyle = "text-green-800 font-normal"
                                            radioStyle = "w-4 h-4 border-2 border-green-500 bg-green-500 rounded-full"
                                        } else if (isUserAnswer && !isCorrectOption) {
                                            textStyle = "text-red-800 font-normal"
                                            radioStyle = "w-4 h-4 border-2 border-red-500 bg-red-500 rounded-full"
                                        } else if (!isUserAnswer && isCorrectOption) {
                                            textStyle = "text-green-700 font-normal"
                                            radioStyle = "w-4 h-4 border-2 border-green-400 bg-green-400 rounded-full"
                                        }

                                        return (
                                            <div key={option.id} className="flex items-center gap-3 py-2">
                                                <div className={`${radioStyle} flex items-center justify-center`}>
                                                    {(isUserAnswer || isCorrectOption) && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className={`text-sm ${textStyle}`}>{option.option}</span>
                                                {isUserAnswer && (
                                                    <span className="ml-auto px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                        Your Answer
                                                    </span>
                                                )}
                                                {isCorrectOption && !isUserAnswer && (
                                                    <span className="ml-auto px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                                        Correct
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Wrong Answer Notice */}
                            {!ans.is_correct && (
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-800">Incorrect Answer</p>
                                            <p className="text-sm text-yellow-700 mt-1">The correct answer is highlighted in green above.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
