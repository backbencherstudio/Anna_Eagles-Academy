import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Check, ArrowLeft, X } from 'lucide-react'
import TextAreaCustom from '@/components/Resuable/TextAreaCustom'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useGetSingleAssignmentQuery, useSubmitAssignmentMutation, useGetAssignmentSubmissionStatusQuery } from '@/rtk/api/users/assignmentQuizApis'
import { AssignmentQuestion } from '@/rtk/slices/users/assignmentQuizSlice'
import { formatUTCDateToLocal } from '@/lib/calendarUtils'

export default function Easy_test() {
    const params = useParams()
    const router = useRouter()
    const [answers, setAnswers] = useState<{ [key: string]: string }>({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const testId = params.id as string
    // Extract the actual test ID (e.g., "test_1" -> "1")
    const actualTestId = testId.replace('test_', '')

    const { data: response, isLoading, error } = useGetSingleAssignmentQuery(actualTestId)
    const { data: submissionResponse, isLoading: submissionLoading } = useGetAssignmentSubmissionStatusQuery(actualTestId)
    const [submitAssignment, { isLoading: isSubmitting, error: submitError }] = useSubmitAssignmentMutation()
    const testData = response?.data
    const submissionData = submissionResponse?.data

    // Check if assignment is already submitted
    useEffect(() => {
        if (submissionData && (submissionData.status === 'SUBMITTED' || submissionData.status === 'GRADED')) {
            setIsSubmitted(true)
            // Always show modal if submitted but not graded
            if (submissionData.status !== 'GRADED') {
                setShowModal(true)
            }

            // Set submitted answers
            const submittedAnswers: { [key: string]: string } = {}
            submissionData.answers?.forEach((answer: any) => {
                submittedAnswers[answer.question_id] = answer.answer_text || ''
            })
            setAnswers(submittedAnswers)
        }
    }, [submissionData])

    const handleEssayAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }))
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

    const handleSubmit = async () => {
        if (!testData || isSubmitted) return

        try {
            // Format answers according to API requirements
            const formattedAnswers = Object.entries(answers).map(([questionId, answerText]) => ({
                question_id: questionId,
                answer_text: answerText
            }))

            await submitAssignment({
                assignment_id: actualTestId,
                answers: formattedAnswers
            }).unwrap()

            setIsSubmitted(true)
            setShowModal(true)

        } catch (error) {
            console.error('Failed to submit assignment:', error)
        }
    }

    if (isLoading || submissionLoading) {
        return (
            <div className="max-h-[90vh] h-full bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading test...</p>
                </div>
            </div>
        )
    }

    if (error || !testData) {
        return (
            <div className="max-h-[90vh] h-full bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Assignment not found</p>
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
        <div className="max-h-[90vh] h-full bg-gray-50">


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
                                {testData.title} (Assignment)
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Course: {testData.course.title} • Series: {testData.series.title}
                            </p>
                        </div>
                    </div>
                    <div className="text-center sm:text-right">
                        <p className="text-xs sm:text-sm text-gray-600">Total Marks: {testData.total_marks}</p>
                        {isSubmitted && submissionData ? (
                            <>
                                <p className="text-xs sm:text-sm text-gray-600">Submitted: {formatDate(submissionData.submitted_at)}</p>
                                {submissionData.status === 'GRADED' && (
                                    <>
                                        {/* <p className="text-xs sm:text-sm font-semibold text-green-600">
                                            Grade: {submissionData.total_grade}/{testData.total_marks}
                                        </p> */}
                                        {/* <p className="text-xs sm:text-sm text-gray-600">
                                            Status: {submissionData.status}
                                        </p> */}
                                    </>
                                )}
                            </>
                        ) : (
                            <p className="text-xs sm:text-sm text-gray-600">Published: {formatDate(testData.published_at)}</p>
                        )}
                    </div>
                </div>


                {/* Success Banner - Only show when graded */}
                {isSubmitted && submissionData && submissionData.status === 'GRADED' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-green-100 border border-green-200 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-green-800">All Grades Submitted Successfully!</h2>
                                    <p className="text-green-700 text-xs">Assignment evaluation completed</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-base font-bold text-green-800">
                                    {submissionData.total_grade}/{testData.total_marks}
                                </div>
                                <div className="text-base text-green-600">
                                    {Math.round((submissionData.total_grade / testData.total_marks) * 100)}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                {!isSubmitted && (
                    <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h2 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">Assignment Description</h2>
                        <p className="text-orange-700 text-xs sm:text-sm leading-relaxed">
                            {testData.description}
                        </p>
                    </div>
                )}

                {/* Assignment Questions */}
                <div className="space-y-6 sm:space-y-8">
                    {testData.questions.map((question: AssignmentQuestion, index: number) => {
                        const submittedAnswer = submissionData?.answers?.find((answer: any) => answer.question_id === question.id)

                        return (
                            <div key={question.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                                {/* Question Header with Score */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Question {index + 1}
                                        </h3>
                                        <p className="text-base  text-gray-900 mb-2">
                                            {question.title}
                                        </p>
                                    </div>
                                    {isSubmitted && submissionData && submittedAnswer && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Score:</span>
                                            <div className="bg-green-100 px-3 py-1 rounded-md">
                                                <span className="text-sm font-bold text-green-800">
                                                    {submittedAnswer.marks_awarded}/{question.points}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Student Answer Section */}
                                {/* <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Your Answer</h4>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <p className="text-sm text-gray-800 leading-relaxed">
                                            {submittedAnswer?.answer_text || answers[question.id] || 'No answer provided'}
                                        </p>
                                    </div>
                                </div> */}

                                {/* Answer Input - Only show if not submitted */}
                                {!isSubmitted && (
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Your Answer:</p>
                                        <TextAreaCustom
                                            value={answers[question.id] || ''}
                                            onChange={(e) => handleEssayAnswer(question.id, e)}
                                            placeholder="Write your answer here..."
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Overall Feedback Section - Only show when graded */}
                {isSubmitted && submissionData && submissionData.status === 'GRADED' && submissionData.overall_feedback && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="rounded-lg border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-green-50 border-b border-green-100 px-4 py-3 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                                    <span className="text-[11px] font-bold text-green-700">i</span>
                                </div>
                                <h3 className="text-sm sm:text-base font-semibold text-green-800">Overall Feedback</h3>
                            </div>
                            {/* Body */}
                            <div className="bg-white px-4 py-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Instructor Feedback</h4>
                                <p className="text-sm leading-relaxed text-gray-700">
                                    {submissionData.overall_feedback}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                {!isSubmitted && (
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-fit cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/90 text-white py-2.5 sm:py-5 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                        </Button>
                    </div>
                )}

                {/* Error Message */}
                {submitError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">
                            Failed to submit assignment. Please try again.
                        </p>
                    </div>
                )}
            </div>

            {/* Success Message Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Assignment Submitted Successfully
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Your assignment has been submitted. You will be notified when your results are ready.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    {submissionData && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-700">
                                    <strong>Status:</strong> {submissionData.status}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Submitted:</strong> {formatDate(submissionData.submitted_at)}
                                </p>
                                {submissionData.status === 'GRADED' && (
                                    <>
                                        <p className="text-sm text-gray-700">
                                            <strong>Grade:</strong> {submissionData.total_grade}/{testData.total_marks}
                                        </p>
                                        {submissionData.overall_feedback && (
                                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                                <p className="text-sm text-green-800">
                                                    <strong>Feedback:</strong> {submissionData.overall_feedback}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowModal(false)}
                            className="flex-1 cursor-pointer border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-600"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => router.push('/user/assignments')}
                            className="flex-1 cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/90 text-white"
                        >
                            Back to Assignments
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
