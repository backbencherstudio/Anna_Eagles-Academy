import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AssignmentWithSubmission } from '@/rtk/slices/admin/assignmentManagementSlice'

interface AssignmentsSubmissionProps {
    assignments: AssignmentWithSubmission[]
}

export default function AssignmentsSubmission({ assignments }: AssignmentsSubmissionProps) {
    if (!assignments || assignments.length === 0) {
        return (
            <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No assignments found</p>
        </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {assignments.map((assignment) => (
                <Card
                    key={assignment.id}
                    className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
                >
                    <CardContent className="p-4">
                        {/* Orange square indicator */}
                        <div className="w-4 h-4 bg-[#F1C27D] rounded mb-3"></div>

                        {/* Assignment title */}
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2 line-clamp-2">
                            {assignment?.title}
                        </h3>

                        {/* Course info */}
                        <p className="text-sm text-gray-600">
                            {assignment?.course?.title || 'No course assigned'}
                        </p>

                        {/* Submission info */}
                        <p className="text-xs text-gray-500 mt-1">
                            {assignment?.submission_count || 0}/{assignment?.total_students || 0} Submissions
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
