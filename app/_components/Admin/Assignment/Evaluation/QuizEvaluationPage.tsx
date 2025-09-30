'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter, useParams } from 'next/navigation'
import { useGetSingleQuizAssignmentEvaluationQuery } from '@/rtk/api/admin/assignmentEvaluationApis'
import QuizEvaluationResuable from '@/components/Resuable/AssessmentEvaluation/QuizEvaluationResuable'



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

export default function QuizEvaluationPage() {
    const router = useRouter()
    const params = useParams()
    const submissionId = params.id as string

    const { data: submissionResp, isFetching } = useGetSingleQuizAssignmentEvaluationQuery(submissionId)
    const submission: QuizSubmissionData | undefined = submissionResp?.data

    // ===== LOADING STATE =====
    if (isFetching) {
        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="bg-gray-100 h-8 rounded mb-6"></div>
                        <div className="bg-white rounded-lg p-8">
                            <div className="space-y-6">
                                <div className="bg-gray-100 h-6 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="bg-gray-100 h-4 rounded w-16"></div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 h-4 w-4 rounded-full"></div>
                                            <div className="bg-gray-100 h-4 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
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
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-gray-500 text-lg mb-4">Quiz submission not found</p>
                        <Button onClick={() => router.push('/admin/assignment-evaluation')}>
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // ===== MAIN RENDER =====
    return (
        <div className="bg-gray-50">
            <div className="">
                <QuizEvaluationResuable
                    submission={submission}
                    onBack={() => router.push('/admin/assignment-evaluation')}
                    backButtonText="Back to List"
                    showBackButton={true}
                />
            </div>
        </div>
    )
}