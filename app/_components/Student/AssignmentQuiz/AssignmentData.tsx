import React, { useState } from 'react'
import { useGetAllAssignmentsQuery } from '@/rtk/api/users/assignmentQuizApis'
import { Assignment } from '@/rtk/slices/users/assignmentQuizSlice'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { formatUTCDateToLocal } from '@/lib/calendarUtils'


interface AssignmentDataProps {
    filter: 'Upcoming' | 'Finished' | 'All'
}

export default function AssignmentData({ filter }: AssignmentDataProps) {
    const router = useRouter()
    const [loadingAssignmentId, setLoadingAssignmentId] = useState<string | null>(null)

    const { data: response, isLoading, error } = useGetAllAssignmentsQuery({
        submission_status: filter === 'Upcoming' ? 'not_submitted' : filter === 'Finished' ? 'submitted' : '',
        page: 1,
        limit: 10
    })

    const assignments = response?.data?.assignments || []

    const formatDate = (dateString: string) => {
        return formatUTCDateToLocal(dateString, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const isAssignmentLate = (dueAt: string) => new Date() > new Date(dueAt)

    const handleAssignmentClick = (assignmentId: string) => {
        setLoadingAssignmentId(assignmentId)
        router.push(`/user/assignments/test_${assignmentId}`)
    }

    const getAssignmentStatus = (assignment: Assignment) => {
        const isLate = isAssignmentLate(assignment.due_at) || assignment.remaining_time === 'Expired'
        const isSubmitted = assignment.submission_status?.is_submitted || false

        if (isLate) return { text: 'Late', color: 'red' }
        if (isSubmitted) return { text: 'Submitted', color: 'green' }
        return { text: 'Running', color: 'green' }
    }

    const LoadingState = () => (
        <div className="flex items-center justify-center py-6 sm:py-8 px-4">
            <div className="text-gray-500 text-sm sm:text-base">Loading assignments...</div>
        </div>
    )

    const ErrorState = () => (
        <div className="flex items-center justify-center py-6 sm:py-8 px-4">
            <div className="text-red-500 text-sm sm:text-base">Error loading assignments</div>
        </div>
    )

    const EmptyState = () => (
        <div className="flex items-center justify-center py-6 sm:py-8 px-4">
            <div className="text-gray-500 text-sm sm:text-base">No assignments found</div>
        </div>
    )

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState />
    if (!assignments.length) return <EmptyState />

    const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
        const status = getAssignmentStatus(assignment)
        const isLate = isAssignmentLate(assignment.due_at)

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ">
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
                            <span className="text-gray-600 text-sm">{formatDate(assignment.published_at)}</span>
                        </div>
                    </div>

                    <div className="text-left sm:text-right">
                        {assignment.submission_status?.is_submitted ? (
                            <>
                                <div className="text-gray-600 text-sm mb-1">{(assignment.submission_status as any).status}</div>
                                <div className="px-3 py-1 rounded text-sm font-medium inline-block bg-green-50 text-green-600">
                                    {formatDate((assignment.submission_status as any).submitted_at)}
                                </div>

                                <div className="text-xs mt-1 text-gray-500">
                                    Due: {formatDate(assignment.due_at)}
                                </div>

                                <div className="text-xs mt-1 text-gray-500">
                                    Grade: {(assignment.submission_status as any).total_grade}/{assignment.total_marks}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-gray-600 text-sm mb-1">
                                    {assignment.remaining_time === 'Expired' ? 'Expired' : 'Deadline'}
                                </div>
                                <div className={`px-3 py-1 rounded text-sm font-medium inline-block ${isLate ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {formatDate(assignment.due_at)}
                                </div>
                                {assignment.remaining_time && (
                                    <div className={`text-xs mt-1 ${isLate ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                        {assignment.remaining_time === 'Expired' ? 'Expired' : isLate ? 'Overdue' : `Remaining: ${assignment.remaining_time}`}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{assignment.title}</h3>
                        <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
                        <span className="text-blue-600 text-sm font-medium">{assignment.total_marks} Marks</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-700 text-sm break-words">Series: {assignment.series.title}</p>
                        <p className="text-gray-700 text-sm break-words">Course: {assignment.course.title}</p>
                    </div>
                </div>

                {/* Action */}
                <div className="flex justify-start">
                    <Button
                        className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/90 text-white px-6 sm:px-8 py-2 rounded-lg text-sm font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleAssignmentClick(assignment.id)}
                        disabled={loadingAssignmentId === assignment.id}
                    >
                        {loadingAssignmentId === assignment.id ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Loading...
                            </div>
                        ) : (
                            assignment.submission_status?.is_submitted ? 'View Assignment' : 'Start'
                        )}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            {assignments.map((assignment: Assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
        </div>
    )
}
