'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2 } from 'lucide-react'
import { Assignment } from '@/rtk/slices/admin/assignmentManagementSlice'
import { parseISO } from 'date-fns'

interface UnpublishedAssignmentProps {
    assignments: Assignment[]
    onCardClick: (assignment: Assignment) => void
    onEditAssignment?: (assignment: Assignment) => void
    onDeleteAssignment?: (assignment: Assignment) => void
}

export default function UnpublishedAssignment({ assignments, onCardClick, onEditAssignment, onDeleteAssignment }: UnpublishedAssignmentProps) {
    // Format scheduled date using UTC parts (matches Quiz logic to avoid timezone drift)
    const formatScheduledDate = (publishedAt: string) => {
        try {
            const date = parseISO(publishedAt)
            const year = date.getUTCFullYear()
            const month = date.getUTCMonth()
            const day = date.getUTCDate()
            const hours = date.getUTCHours()
            const minutes = date.getUTCMinutes()
            const utcDate = new Date(year, month, day, hours, minutes)

            // Month name and 12h time like: September 29 at 06:00 AM
            const monthName = utcDate.toLocaleString('en-US', { month: 'long' })
            const dayNum = utcDate.toLocaleString('en-US', { day: 'numeric' })
            const timeStr = utcDate.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
            return `Scheduled for: ${monthName} ${dayNum} at ${timeStr}`
        } catch {
            return 'Scheduled time unavailable'
        }
    }

    return (
        <div className='mt-5'>
            <h2 className="text-gray-400 text-md font-medium mb-4">Unpublished Assignment</h2>
            {assignments.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No unpublished assignment found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {assignments.map((assignment) => (
                        <Card
                            key={assignment.id}
                            className=" cursor-pointer border border-gray-200"
                            onClick={() => onCardClick(assignment)}
                        >
                            <CardContent className="p-4 group">
                                <div className="flex items-center gap-3">
                                    {/* Orange square indicator */}
                                    <div className="w-4 h-4 bg-[#F1C27D] rounded flex-shrink-0"></div>

                                    <div className="flex-1 min-w-0">
                                        {/* Assignment title */}
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-2">
                                            {assignment.title}
                                        </h3>

                                        {/* Scheduled date and total marks */}
                                        <div className="space-y-1">
                                            <p className="text-sm text-[#4A4C56]">
                                                {formatScheduledDate(assignment.published_at)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Total Marks: {assignment.total_marks}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action icons */}
                                    <div className="flex items-center gap-2">
                                        <Edit
                                            className="w-4 h-4 hover:text-[#0F2598] transition-all duration-100 text-[#4A4C56] flex-shrink-0 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onEditAssignment?.(assignment)
                                            }}
                                        />
                                        <Trash2
                                            className="w-4 h-4 text-red-500 transition-all duration-100 flex-shrink-0 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onDeleteAssignment?.(assignment)
                                            }}
                                        />

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
