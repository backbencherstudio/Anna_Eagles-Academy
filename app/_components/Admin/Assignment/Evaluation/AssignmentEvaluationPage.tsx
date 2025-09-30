'use client'

import React, { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import {
    useGetSingleAssignmentEvaluationQuery,
    useGradeUpdateMutation,
    useGetSubmissionGradeMutation
} from '@/rtk/api/admin/assignmentEvaluationApis'


interface AssignmentSubmissionData {
    id: string
    student?: { name: string; email?: string }
    assignment?: { title?: string; total_marks?: number; course?: { title: string } }
    total_grade?: number
    answers?: Array<{
        id: string
        question_id: string
        question?: { title?: string; points: number }
        answer_text?: string
        marks_awarded?: number
        feedback?: string
    }>
    overall_feedback?: string
    feedback?: string
    graded_at?: string
    percentage?: number
}

export default function AssignmentEvaluationPage() {
    // ===== ROUTING & URL PARAMETERS =====
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams()

    const submissionId = params.id as string
    const isViewMode = searchParams?.get('mode') === 'view'

    // ===== COMPONENT STATE =====
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [forceEdit, setForceEdit] = useState(false)
    const [gradesByAnswerId, setGradesByAnswerId] = useState<{ [answerId: string]: number }>({})
    const [overallFeedback, setOverallFeedback] = useState<string>('')

    // ===== API HOOKS =====
    const { data: submissionResp, isFetching, refetch } = useGetSingleAssignmentEvaluationQuery(submissionId)
    const [gradeUpdate, { isLoading: isSaving }] = useGradeUpdateMutation()
    const [submitGrade] = useGetSubmissionGradeMutation()

    // ===== DERIVED STATE =====
    const submission: AssignmentSubmissionData | undefined = submissionResp?.data

    // ===== INITIALIZATION EFFECT =====
    useEffect(() => {
        if (!submission) return

        const initialGrades: { [answerId: string]: number } = {}
        submission.answers?.forEach((ans) => {
            const base = typeof ans.marks_awarded === 'number' ? ans.marks_awarded : 0
            initialGrades[ans.id] = base
        })

        setGradesByAnswerId(initialGrades)
        setOverallFeedback(submission.overall_feedback || submission.feedback || '')

        const shouldBeReadOnly = Boolean(submission.graded_at) || isViewMode
        setIsSubmitted(!forceEdit && shouldBeReadOnly)
    }, [submission, isViewMode, forceEdit])

    // ===== COMPUTED VALUES =====
    const totalMaxPoints = useMemo(() => {
        if (!submission?.answers) return 0
        return submission.answers.reduce((sum, ans) => sum + (ans.question?.points || 0), 0)
    }, [submission])

    const totalGivenPoints = useMemo(() => {
        return Object.values(gradesByAnswerId).reduce((sum, v) => sum + (v || 0), 0)
    }, [gradesByAnswerId])

    const percentage = totalMaxPoints > 0 ? Math.round((totalGivenPoints / totalMaxPoints) * 100) : 0

    // ===== EVENT HANDLERS =====
    const handleCancelEdit = () => {
        if (!submission) {
            setForceEdit(false)
            return
        }

        const resetGrades: { [answerId: string]: number } = {}
        submission.answers?.forEach((ans) => {
            resetGrades[ans.id] = typeof ans.marks_awarded === 'number' ? ans.marks_awarded : 0
        })

        setGradesByAnswerId(resetGrades)
        setOverallFeedback(submission.overall_feedback || '')
        setForceEdit(false)
    }

    const handleGradeChange = (answerId: string, value: number, maxPoints: number) => {
        const safeValue = Math.max(0, Math.min(value, maxPoints))
        setGradesByAnswerId(prev => ({
            ...prev,
            [answerId]: safeValue
        }))
    }

    const handleConfirmGrade = async () => {
        if (!submissionId || !submission) return

        const answersPayload = (submission.answers || []).map((ans) => ({
            question_id: String(ans.question_id || ''),
            marks_awarded: Number(gradesByAnswerId[ans.id] || 0),
            feedback: ans.feedback || null,
        }))

        const payload = {
            overall_feedback: overallFeedback,
            answers: answersPayload,
        }

        try {
            const isUpdate = forceEdit || submission.graded_at
            const res = isUpdate
                ? await gradeUpdate({ assignment_id: submissionId, grades: payload })
                : await submitGrade({ assignment_id: submissionId, grades: payload })

            if ('data' in res) {
                await refetch()
                setForceEdit(false)
                setIsSubmitted(true)
                toast.success('Grades updated successfully')
            } else {
                const error = (res as any)?.error?.data?.message || 'Failed to update grades'
                toast.error(typeof error === 'string' ? error : 'Failed to update grades')
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update grades')
        }
    }

    const handleBack = () => {
        router.push('/admin/assignment-evaluation')
    }

    // ===== LOADING STATE =====
    if (isFetching) {
        return (
            <div className="bg-gray-50 ">
                <div className="">
                    <div className="bg-white rounded-lg p-6 border border-gray-100">
                        <div className="animate-pulse">
                            <div className="bg-gray-100 h-8 rounded mb-4"></div>
                            <div className="bg-gray-100 h-6 rounded mb-2"></div>
                            <div className="bg-gray-100 h-32 rounded mb-4"></div>
                            <div className="bg-gray-100 h-6 rounded mb-2"></div>
                            <div className="bg-gray-100 h-48 rounded mb-6"></div>
                            <div className="flex justify-end space-x-4">
                                <div className="bg-gray-100 h-10 w-20 rounded"></div>
                                <div className="bg-gray-100 h-10 w-24 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ===== ERROR STATE =====
    if (!submission) {
        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg p-6 border border-gray-100">
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Assignment submission not found</p>
                            <Button onClick={handleBack} className="mt-4">
                                Go Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ===== MAIN RENDER =====
    return (
        <div className="bg-gray-50">
            <div className="">
                <div className="bg-white rounded-lg py-6 px-2 md:px-6 border border-gray-100 ">
                    {/* ===== PAGE HEADER ===== */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="xl:text-xl font-semibold text-gray-900">
                                    {submission.assignment?.title || 'Assignment Evaluation'} (Essay)
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Student: {submission.student?.name || 'Unknown'} |
                                    Course: {submission.assignment?.course?.title || 'Unknown'}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            {(isViewMode || submission.graded_at) && !forceEdit && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setForceEdit(true)}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-100 text-sm cursor-pointer"
                                >
                                    Edit
                                </Button>
                            )}

                            {forceEdit && (
                                <Button
                                    variant="ghost"
                                    onClick={handleCancelEdit}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>


                    {/* ===== SUCCESS MESSAGE ===== */}
                    {isSubmitted && (
                        <div className="mb-6 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-green-800">
                                        All Grades Submitted Successfully!
                                    </h3>
                                    <p className="text-sm text-green-700 mt-1">
                                        Assignment evaluation completed
                                    </p>
                                </div>
                            </div>


                            {/* Total Grade Section  */}
                            <div className="text-right">
                                <div className="lg:text-2xl text-xl font-medium text-green-800">
                                    {(typeof submission.total_grade === 'number' ? submission.total_grade : totalGivenPoints)}/{submission.assignment?.total_marks ?? totalMaxPoints}
                                </div>
                                <div className="lg:text-sm text-xs text-green-600">
                                    {
                                        submission.percentage ? `${submission.percentage}%` : '0%'
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== QUESTIONS LIST ===== */}
                    <div className="space-y-6">
                        {submission.answers?.map((ans, index) => (
                            <div key={ans.id} className="border border-gray-200 rounded-lg p-6 bg-white ">
                                {/* Question Section */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-sm font-medium text-gray-500">
                                            Question {index + 1}
                                        </Label>
                                        {isSubmitted && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">Score:</span>
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${(typeof ans.marks_awarded === 'number' ? ans.marks_awarded : 0) >= (ans.question?.points || 0) * 0.8
                                                    ? 'bg-green-100 text-green-800'
                                                    : (typeof ans.marks_awarded === 'number' ? ans.marks_awarded : 0) >= (ans.question?.points || 0) * 0.6
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {typeof ans.marks_awarded === 'number' ? ans.marks_awarded : 0} / {ans.question?.points || 0}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="xl:text-lg font-medium text-gray-900 mb-4">
                                        {ans.question?.title || 'Question'}
                                    </p>
                                </div>

                                {/* Answer Section */}
                                <div className="mb-6">
                                    <Label className="text-sm font-medium text-gray-500 mb-3 block">
                                        Student Answer
                                    </Label>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap break-words">
                                            {ans.answer_text || 'No answer provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* Grading Section */}
                                {!isSubmitted && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-end gap-4">
                                            <Label htmlFor={`grade-${ans.id}`} className="text-sm font-medium text-gray-700">
                                                Select Grade
                                            </Label>
                                            <div className="flex items-center gap-3">
                                                <Input
                                                    id={`grade-${ans.id}`}
                                                    type="number"
                                                    min="0"
                                                    max={ans.question?.points || 0}
                                                    value={gradesByAnswerId[ans.id] ?? 0}
                                                    onChange={(e) => handleGradeChange(ans.id, parseInt(e.target.value) || 0, ans.question?.points || 0)}
                                                    className="w-20 text-center"
                                                />
                                                <span className="text-sm text-gray-500">
                                                    / {ans.question?.points || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ===== OVERALL FEEDBACK SECTION ===== */}
                    {isSubmitted && submission?.overall_feedback ? (
                        <div className="mb-6 mt-6">
                            <Label className="text-sm font-medium text-gray-700 mb-3 block">Overall Feedback</Label>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-green-800 mb-1">Instructor Feedback</p>
                                        <p className="text-sm text-green-700 leading-relaxed break-words">
                                            {submission.overall_feedback}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : !isSubmitted ? (
                        <div className="mb-6 mt-6">
                            <Label className="text-sm font-medium text-gray-700 mb-3 block">Overall Feedback</Label>
                            <Input
                                value={overallFeedback}
                                onChange={(e) => setOverallFeedback(e.target.value)}
                                placeholder="Write overall feedback for the student..."
                                className="w-full"
                            />
                        </div>
                    ) : null}

                    {/* ===== ACTION BUTTONS ===== */}
                    {isSubmitted ? (
                        <div className="">
                            {/* <Button
                                onClick={handleBack}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 cursor-pointer"
                            >
                                Back to List
                            </Button> */}
                        </div>
                    ) : (
                        <div className="flex justify-end mt-6">
                            <Button
                                onClick={handleConfirmGrade}
                                disabled={isSaving}
                                className="bg-[#0F2598] hover:bg-[#0F2598]/90 text-white px-6 py-2 cursor-pointer"
                            >
                                {isSaving ? 'Updating...' : 'Update All Grades'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}