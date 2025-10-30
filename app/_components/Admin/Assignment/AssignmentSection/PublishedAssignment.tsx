'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2 } from 'lucide-react'
import { Assignment } from '@/rtk/slices/admin/assignmentManagementSlice'

interface PublishedAssignmentProps {
    assignments: Assignment[]
    onCardClick: (assignment: Assignment) => void
    onEditAssignment?: (assignment: Assignment) => void
    onDeleteAssignment?: (assignment: Assignment) => void
}

export default function PublishedAssignment({ assignments, onCardClick, onEditAssignment, onDeleteAssignment }: PublishedAssignmentProps) {
    const formatDueDate = (remainingTime?: number | string) => {
        if (remainingTime === undefined || remainingTime === null || remainingTime === '') return 'No time remaining'
        return `Due in ${typeof remainingTime === 'number' ? String(remainingTime) : remainingTime}`
    }

    return (
        <div>
            <h2 className="text-gray-400 text-md font-medium mb-4">Published Assignment</h2>
            {assignments.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No published assignment found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {assignments.map((assignment) => (
                        <Card
                            key={assignment.id}
                            className="cursor-pointer border border-gray-200"
                            onClick={() => onCardClick(assignment)}
                        >
                            <CardContent className="p-4">
                            <div className="flex items-center gap-3 group">
                                    {/* Orange square indicator */}
                                    <div className="w-4 h-4 bg-[#F1C27D] rounded flex-shrink-0"></div>

                                    <div className="flex-1 min-w-0">
                                        {/* Assignment title */}
                                        <h3 className="font-semibold text-[#1D1F2C] text-sm mb-1 line-clamp-2">
                                            {assignment.title}
                                        </h3>

                                        {/* Due date and total marks */}
                                        <div className="space-y-1">
                                            <p className="text-sm text-[#4A4C56]">
                                                {formatDueDate(assignment.remaining_time)}
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
