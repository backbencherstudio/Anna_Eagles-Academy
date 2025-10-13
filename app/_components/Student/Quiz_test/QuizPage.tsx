import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Check, X, ArrowLeft } from 'lucide-react'
import { useGetSingleQuizQuery, useSubmitQuizMutation, useGetQuizSubmissionStatusQuery } from '@/rtk/api/users/assignmentQuizApis'
import { QuizQuestion } from '@/rtk/slices/users/assignmentQuizSlice'
import { formatUTCDateToLocal } from '@/lib/calendarUtils'

export default function QuizPage() {
    const params = useParams()
    const router = useRouter()
    const [answers, setAnswers] = useState<{ [key: string]: string }>({})
    const [showModal, setShowModal] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const quizId = params.id as string
    const actualQuizId = quizId.replace('quiz_', '')

    const { data: response, isLoading, error } = useGetSingleQuizQuery(actualQuizId)
    const { data: submissionResponse, isLoading: submissionLoading } = useGetQuizSubmissionStatusQuery(actualQuizId)
    const [submitQuiz, { isLoading: isSubmitting, error: submitError }] = useSubmitQuizMutation()
    const quizData = response?.data
    const submissionData = submissionResponse?.data

    // Check if quiz is already submitted
    useEffect(() => {
        if (submissionData && submissionData.status === 'SUBMITTED') {
            setIsSubmitted(true)

            // Set submitted answers
            const submittedAnswers: { [key: string]: string } = {}
            submissionData.answers?.forEach((answer: any) => {
                if (answer.answer?.id) {
                    submittedAnswers[answer.question.id] = answer.answer.id
                }
            })
            setAnswers(submittedAnswers)
        }
    }, [submissionData])

    const handleOptionSelect = (questionId: string, optionId: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }))
    }


    const handleSubmit = async () => {
        if (!quizData || isSubmitted) return

        try {
            // Format answers according to API requirements
            const formattedAnswers = Object.entries(answers).map(([questionId, answerId]) => ({
                question_id: questionId,
                answer_id: Array.isArray(answerId) ? answerId[0] : answerId
            }))

            await submitQuiz({
                quiz_id: actualQuizId,
                answers: formattedAnswers
            }).unwrap()

            setIsSubmitted(true)
            setShowModal(true)
        } catch (error) {
            console.error('Failed to submit quiz:', error)
        }
    }

    const isOptionSelected = (questionId: string, optionId: string) => {
        return answers[questionId] === optionId
    }

    const getSubmissionAnswer = (questionId: string) => {
        if (!submissionData?.answers) return null
        return submissionData.answers.find((answer: any) => answer.question.id === questionId)
    }

    const isAnswerCorrect = (questionId: string, optionId: string) => {
        const submissionAnswer = getSubmissionAnswer(questionId)
        if (!submissionAnswer) return false

        // Check if this option is the user's selected answer
        const isUserAnswer = submissionAnswer.answer?.id === optionId
        // Check if this option is correct
        const isCorrectOption = submissionAnswer.question.answers.find((ans: any) => ans.id === optionId)?.is_correct

        return isUserAnswer && isCorrectOption
    }

    const isAnswerIncorrect = (questionId: string, optionId: string) => {
        const submissionAnswer = getSubmissionAnswer(questionId)
        if (!submissionAnswer) return false

        // Check if this option is the user's selected answer but incorrect
        const isUserAnswer = submissionAnswer.answer?.id === optionId
        const isCorrectOption = submissionAnswer.question.answers.find((ans: any) => ans.id === optionId)?.is_correct

        return isUserAnswer && !isCorrectOption
    }

    const isCorrectOption = (questionId: string, optionId: string) => {
        const submissionAnswer = getSubmissionAnswer(questionId)
        if (!submissionAnswer) return false

        return submissionAnswer.question.answers.find((ans: any) => ans.id === optionId)?.is_correct
    }

    const formatDate = (dateString: string) => {
        return formatUTCDateToLocal(dateString, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (isLoading || submissionLoading) {
        return (
            <div className="max-h-[90vh] h-full bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz...</p>
                </div>
            </div>
        )
    }

    if (error || !quizData) {
        return (
            <div className="max-h-[90vh] h-full bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Quiz not found</p>
                    <Button
                        onClick={() => router.push('/user/assignments')}
                        className="mt-4 cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/90 text-white"
                    >
                        Back to Assignments
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/user/assignments')}
                            className="text-gray-600 cursor-pointer hover:text-gray-900 p-2"
                        >
                            <ArrowLeft className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Back</span>
                        </Button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                                {quizData.title} (Quiz)
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Course: {quizData.course.title} • Series: {quizData.series.title}
                            </p>
                        </div>
                    </div>
                    <div className="text-center sm:text-right">
                        <p className="text-xs sm:text-sm text-gray-600">Total Marks: {quizData.total_marks}</p>
                        {isSubmitted && submissionData ? (
                            <p className="text-xs sm:text-sm text-gray-600">Submitted: {formatDate(submissionData.submitted_at)}</p>
                        ) : (
                            <p className="text-xs sm:text-sm text-gray-600">Published: {formatDate(quizData.published_at)}</p>
                        )}
                    </div>
                </div>

                {/* Score Display - Centered and Attractive */}
                {isSubmitted && submissionData && (
                    <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-3 sm:mb-4">
                                <span className="text-white font-bold text-lg sm:text-xl">
                                    {submissionData.total_grade}
                                </span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                                Quiz Completed!
                            </h2>
                            <div className="flex items-center justify-center gap-4 text-sm sm:text-base">
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-600">Score:</span>
                                    <span className="font-semibold text-blue-600">
                                        {submissionData.total_grade}/{quizData.total_marks}
                                    </span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-600">Percentage:</span>
                                    <span className="font-semibold text-indigo-600">
                                        {submissionData.percentage}%
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✓ {submissionData.status}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                {!isSubmitted && (
                    <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h2 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">Instructions</h2>
                        <p className="text-orange-700 text-xs sm:text-sm leading-relaxed">
                            {quizData.instructions}
                        </p>
                    </div>
                )}

                {/* Quiz Questions */}
                <div className="space-y-6 sm:space-y-8">
                    {quizData.questions.map((question: QuizQuestion, index: number) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base leading-relaxed">
                                    {index + 1}. {question.prompt}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs sm:text-sm text-gray-600">Points: {question.points}</p>
                                    {isSubmitted && submissionData && (
                                        <span className={`text-xs sm:text-sm  px-2 py-1 rounded-full ${getSubmissionAnswer(question.id)?.is_correct
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {getSubmissionAnswer(question.id)?.is_correct ? 'Correct' : 'Wrong'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Answer:</p>
                                {question.answers?.map((answer) => {
                                    const isCorrect = isAnswerCorrect(question.id, answer.id)
                                    const isIncorrect = isAnswerIncorrect(question.id, answer.id)
                                    const isCorrectAnswer = isCorrectOption(question.id, answer.id)
                                    const isSelected = isOptionSelected(question.id, answer.id)

                                    let borderColor = 'border-gray-200'
                                    let bgColor = ''
                                    let textColor = ''

                                    if (isSubmitted) {
                                        if (isCorrect) {
                                            borderColor = 'border-green-500'
                                            bgColor = 'bg-green-50'
                                        } else if (isIncorrect) {
                                            borderColor = 'border-red-500'
                                            bgColor = 'bg-red-50'
                                        } else if (isCorrectAnswer) {
                                            borderColor = 'border-green-300'
                                            bgColor = 'bg-green-25'
                                        }
                                    } else if (isSelected) {
                                        borderColor = 'border-orange-500'
                                        bgColor = 'bg-orange-50'
                                    }

                                    return (
                                        <label
                                            key={answer.id}
                                            className={`flex items-start p-2 sm:p-3 border rounded-lg transition-colors ${borderColor} ${bgColor} ${isSubmitted ? 'cursor-default' : 'cursor-pointer hover:border-gray-300'}`}
                                        >
                                            <div className="flex items-center mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                                                {isSubmitted ? (
                                                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
                                                        {isCorrect && <Check className="w-3 h-3 text-green-600" />}
                                                        {isIncorrect && <X className="w-3 h-3 text-red-600" />}
                                                        {!isCorrect && !isIncorrect && isCorrectAnswer && (
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="radio"
                                                        name={question.id}
                                                        value={answer.id}
                                                        checked={isSelected}
                                                        onChange={() => handleOptionSelect(question.id, answer.id)}
                                                        className="w-4 h-4"
                                                    />
                                                )}
                                            </div>
                                            <span className={`flex-1 text-xs sm:text-sm leading-relaxed ${textColor}`}>
                                                {answer.option}
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                {!isSubmitted && (
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-fit cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/90 text-white py-2.5 sm:py-5 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Your Answers'}
                        </Button>
                    </div>
                )}

                {/* Error Message */}
                {submitError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">
                            Failed to submit quiz. Please try again.
                        </p>
                    </div>
                )}
            </div>

            {/* Results Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 sm:p-8 max-w-sm sm:max-w-md w-full mx-auto">
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                Quiz Submitted Successfully
                            </h2>
                            <div className="mb-4 sm:mb-6">
                                <p className="text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Your Grade</p>
                                <p className="text-3xl sm:text-4xl font-bold text-green-600">
                                    {submissionData?.total_grade || 0}
                                </p>
                                {submissionData?.percentage && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        ({submissionData.percentage}%)
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <Button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 cursor-pointer border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-600 text-sm sm:text-base py-2 sm:py-2.5"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => router.push('/user/assignments')}
                                    className="flex-1 cursor-pointer bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white text-sm sm:text-base py-2 sm:py-2.5"
                                >
                                    Back to Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
