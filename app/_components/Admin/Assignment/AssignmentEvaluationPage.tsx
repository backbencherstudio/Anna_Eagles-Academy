'use client'

import React, { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useGetSingleAssignmentEvaluationQuery, useGradeUpdateMutation, useGetSubmissionGradeMutation } from '@/rtk/api/admin/assignmentEvaluationApis'

// No local sample data – real API is used below

export default function AssignmentEvaluationPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [forceEdit, setForceEdit] = useState(false)
    const [gradesByAnswerId, setGradesByAnswerId] = useState<{ [answerId: string]: number }>({})
    const [overallFeedback, setOverallFeedback] = useState<string>('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams()

    const submissionId = params.id as string
    const { data: submissionResp, isFetching, refetch } = useGetSingleAssignmentEvaluationQuery(submissionId)
    const [gradeUpdate, { isLoading: isSaving }] = useGradeUpdateMutation()
    const [submitGrade] = useGetSubmissionGradeMutation()

    const submission = submissionResp?.data

    useEffect(() => {
        if (!submission) return
        // initialize grades from API's existing marks_awarded
        const initial: { [answerId: string]: number } = {}
        submission.answers?.forEach((ans: any) => {
            initial[ans.id] = typeof ans.marks_awarded === 'number' ? ans.marks_awarded : 0
        })
        setGradesByAnswerId(initial)
        setOverallFeedback(submission.overall_feedback || '')
        // If already graded or explicit view mode, keep the page in submitted state (read-only)
        const forceView = (searchParams?.get('mode') || '') === 'view'
        setIsSubmitted(!forceEdit && (Boolean(submission.graded_at) || forceView))
    }, [submission, searchParams, forceEdit])

    const handleCancelEdit = () => {
        if (!submission) {
            setForceEdit(false)
            return
        }
        // reset fields to backend values
        const reset: { [answerId: string]: number } = {}
        submission.answers?.forEach((ans: any) => {
            reset[ans.id] = typeof ans.marks_awarded === 'number' ? ans.marks_awarded : 0
        })
        setGradesByAnswerId(reset)
        setOverallFeedback(submission.overall_feedback || '')
        setForceEdit(false)
    }

    const totalMaxPoints = useMemo(() => {
        if (!submission?.answers) return 0
        return submission.answers.reduce((sum: number, a: any) => sum + (a.question?.points || 0), 0)
    }, [submission])

    const totalGivenPoints = useMemo(() => {
        return Object.values(gradesByAnswerId).reduce((sum, v) => sum + (v || 0), 0)
    }, [gradesByAnswerId])

    const handleConfirmGrade = async () => {
        if (!submissionId || !submission) return
        const answersPayload = (submission.answers || []).map((ans: any) => ({
            question_id: String(ans.question_id || ans.question?.id || ''),
            marks_awarded: Number(gradesByAnswerId[ans.id] || 0),
            feedback: ans.feedback || null,
        }))
        const payload = {
            overall_feedback: overallFeedback,
            answers: answersPayload,
        }
        try {
            // If editing from view/graded state, use gradeUpdate (PATCH). Otherwise, use POST
            const res = forceEdit || submission.graded_at
                ? await gradeUpdate({ assignment_id: submissionId, grades: payload })
                : await submitGrade({ assignment_id: submissionId, grades: payload })
            if ('data' in (res as any)) {
                await refetch()
                setForceEdit(false)
                setIsSubmitted(true)
                toast.success('Grades updated successfully')
            } else {
                const err = (res as any)?.error?.data?.message || 'Failed to update grades'
                toast.error(typeof err === 'string' ? err : 'Failed to update grades')
            }
        } catch (e: any) {
            toast.error(e?.message || 'Failed to update grades')
        }
    }


    const handleGradeChange = (answerId: string, value: number, maxPoints: number) => {
        const safe = Math.max(0, Math.min(value, maxPoints))
        setGradesByAnswerId(prev => ({
            ...prev,
            [answerId]: safe
        }))
    }

    const handleBack = () => {
        router.push('/admin/assignment-evaluation')
    }

    if (isFetching) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-100 ">
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
        )
    }

    if (!submission) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-100 ">
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Submission not found</p>
                    <Button onClick={handleBack} className="mt-4 cursor-pointer">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100 ">
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Assignment Evaluation</h1>
                        <p className="text-sm text-gray-500">
                            Student: {submission.student?.name || 'Unknown'} | Course: {submission.assignment?.course?.title || 'Unknown'}
                        </p>
                    </div>
                </div>
                {(searchParams?.get('mode') === 'view' || submission.graded_at) && !forceEdit && (
                    <Button
                        variant="ghost"
                        onClick={() => setForceEdit(true)}
                        className="p-2 bg-gray-100 hover:bg-gray-100 cursor-pointer"
                        title="Edit grades"
                    >
                        Edit
                    </Button>
                )}
                {forceEdit && (
                    <Button
                        variant="ghost"
                        onClick={handleCancelEdit}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-100 cursor-pointer text-gray-700"
                        title="Cancel edit"
                    >
                        Cancel
                    </Button>
                )}
            </div>

            {/* Totals */}
            <div className="mb-4 flex justify-end">
                <div className="text-sm text-gray-500">
                    Total: {totalGivenPoints}/{totalMaxPoints}
                </div>
            </div>

            {/* Success Message */}
            {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
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
                                Total Grade: <span className="font-semibold">{totalGivenPoints}/{totalMaxPoints}</span> points
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* All Questions and Answers */}
            {submission && submission.answers?.map((ans: any, index: number) => (
                <Card key={ans.id} className="mb-6">
                    <CardContent className="p-2">
                        {/* Question Section */}
                        <div className="mb-6">
                            <Label className="text-sm font-medium text-gray-500 mb-2 block">
                                Question {index + 1}
                            </Label>
                            <p className="text-lg font-semibold text-gray-900">
                                {ans.question?.title || 'Question'}
                            </p>
                            {isSubmitted && (
                                <div className="mt-1 text-sm text-gray-600">
                                    Marks: <span className="font-medium">{typeof ans.marks_awarded === 'number' ? ans.marks_awarded : 0}</span> / {ans.question?.points || 0}
                                </div>
                            )}
                        </div>

                        {/* Answer Section */}
                        <div className="mb-6">
                            <Label className="text-sm font-medium text-gray-500 mb-2 block">
                                Answer
                            </Label>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                                    {ans.answer_text || ''}
                                </p>
                            </div>
                        </div>

                        {/* Grading Section */}
                        {!isSubmitted && (
                            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                                <div className="flex items-center space-x-3">
                                    <Label htmlFor={`grade-${ans.id}`} className="text-sm font-medium text-gray-700">
                                        Select Grade
                                    </Label>
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
                        )}
                    </CardContent>
                </Card>
            ))}

            {/* Overall Feedback */}
            {!isSubmitted && (
                <div className="mb-6">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Overall Feedback</Label>
                    <Input
                        value={overallFeedback}
                        onChange={(e) => setOverallFeedback(e.target.value)}
                        placeholder="Write overall feedback"
                    />
                </div>
            )}
            {isSubmitted && submission?.overall_feedback && (
                <div className="mb-6">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Overall Feedback</Label>
                    <div className="text-gray-900 bg-gray-50 rounded p-3">
                        {submission.overall_feedback}
                    </div>
                </div>
            )}

            {/* Confirm All Grades Button */}
            {submission && !isSubmitted && (
                <div className="flex justify-end mb-6">
                    <Button
                        onClick={handleConfirmGrade}
                        disabled={isSaving}
                        className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/90 text-white px-6 py-2"
                    >
                        {isSaving ? 'Updating...' : 'Update All Grades'}
                    </Button>
                </div>
            )}

            {/* Back to List Button */}
            {isSubmitted && (
                <div className="flex justify-end">
                    <Button
                        onClick={handleBack}
                        className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-2"
                    >
                        Back to List
                    </Button>
                </div>
            )}
        </div>
    )
}
