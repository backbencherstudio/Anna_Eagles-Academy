import React from 'react'
import { useGetAllAssignmentsQuery } from '@/rtk/api/users/assignmentQuizApis'
import { Assignment } from '@/rtk/slices/users/assignmentQuizSlice'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface AssignmentDataProps {
    filter: 'Upcoming' | 'Finished' | 'All'
}

export default function AssignmentData({ filter }: AssignmentDataProps) {
    // Map filter to submission_status parameter
    const getSubmissionStatus = (filter: 'Upcoming' | 'Finished' | 'All') => {
        switch (filter) {
            case 'Upcoming':
                return 'not_submitted'
            case 'Finished':
                return 'submitted'
            default:
                return ''
        }
    }

    const { data: response, isLoading, error } = useGetAllAssignmentsQuery({
        submission_status: getSubmissionStatus(filter),
        page: 1,
        limit: 10
    })
    const router = useRouter()

    // Extract assignments from API response
    const assignments = response?.data?.assignments || []

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusColor = (publicationStatus: string, submissionStatus: string) => {
        // Check submission status first, then publication status
        if (submissionStatus === 'submitted') {
            return 'bg-green-50 text-green-600 border-l-4 border-l-green-500'
        }
        
        switch (publicationStatus) {
            case 'PUBLISHED':
                return 'bg-blue-50 text-blue-600 border-l-4 border-l-blue-500'
            case 'DRAFT':
                return 'bg-yellow-50 text-yellow-600 border-l-4 border-l-yellow-500'
            case 'SCHEDULED':
                return 'bg-purple-50 text-purple-600 border-l-4 border-l-purple-500'
            default:
                return 'bg-gray-50 text-gray-600 border-l-4 border-l-gray-500'
        }
    }

    const getStatusText = (publicationStatus: string, submissionStatus: string) => {
        // Check submission status first, then publication status
        if (submissionStatus === 'submitted') {
            return 'Submitted'
        }
        
        switch (publicationStatus) {
            case 'PUBLISHED':
                return 'Published'
            case 'DRAFT':
                return 'Draft'
            case 'SCHEDULED':
                return 'Scheduled'
            default:
                return 'Unknown'
        }
    }

    // No need for client-side filtering since API handles it
    const filteredAssignments = assignments

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading assignments...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-red-500">Error loading assignments</div>
            </div>
        )
    }

    if (!filteredAssignments.length) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">No assignments found</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {filteredAssignments.map((assignment: Assignment) => (
                <div key={assignment.id} className="bg-[#FEF9F2] rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {/* Status Badge */}
                                <span className={`px-2 sm:px-3 py-1 rounded border border-gray-200 text-xs font-medium ${getStatusColor(assignment.publication_status, filter === 'Finished' ? 'submitted' : 'not_submitted')}`}>
                                    {getStatusText(assignment.publication_status, filter === 'Finished' ? 'submitted' : 'not_submitted')}
                                </span>

                                {/* Date */}
                                <span className="text-gray-500 text-xs sm:text-sm">•</span>
                                <span className="text-gray-400 text-xs sm:text-sm">{formatDate(assignment.published_at)}</span>
                            </div>

                            {/* Assignment Info */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">{assignment.title}</h3>
                                    <p className="text-gray-400 text-sm mb-2">{assignment.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>Course: {assignment.course.title}</span>
                                        <span>Series: {assignment.series.title}</span>
                                        <span>Total Marks: {assignment.total_marks}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="text-left sm:text-right flex-shrink-0">
                                    <div className="mt-3 sm:mt-4">
                                        <Button
                                            className="bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/80 text-white px-6 sm:px-10 py-2 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto"
                                            onClick={() => router.push(`/assignments/${assignment.id}`)}
                                        >
                                            View Assignment
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
