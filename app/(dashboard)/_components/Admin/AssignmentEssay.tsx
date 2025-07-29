'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, ArrowRight } from 'lucide-react'

// Data type definition
interface Assignment {
    id: string
    title: string
    type: 'published' | 'unpublished'
    dueDate?: string
    scheduledDate?: string
    status: 'active' | 'draft' | 'scheduled'
}

// Sample data declaration
const sampleAssignments: Assignment[] = [
    // Published Assignments
    {
        id: '1',
        title: 'Pre-Lab Exercise: Recording Chemical Reaction Data',
        type: 'published',
        dueDate: 'Due in 1 hours',
        status: 'active'
    },
    {
        id: '2',
        title: 'Weekly Test: The Role of Catalysts in Chemical Reactions',
        type: 'published',
        dueDate: 'Due in 1 days',
        status: 'active'
    },
    {
        id: '3',
        title: 'Lab Completion Quiz: Chemical Reactions',
        type: 'published',
        dueDate: 'Due in 5 days',
        status: 'active'
    },
    // Unpublished Assignments
    {
        id: '4',
        title: 'Daily Task: Applying Stoichiometry to Predicting Chemical Reaction',
        type: 'unpublished',
        scheduledDate: 'Scheduled for: 28, September - 10.00 AM',
        status: 'scheduled'
    },
    {
        id: '5',
        title: 'Thermodynamics and Kinetics Fundamentals Quiz',
        type: 'unpublished',
        scheduledDate: 'Scheduled for: 1, October - 08.20 AM',
        status: 'scheduled'
    }
]

export default function AssignmentEssay() {
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loading, setLoading] = useState(true)

    // Simulate data fetching with useEffect
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000))

                // In real implementation, you would fetch from your API
                // const response = await fetch('/api/assignments/essay')
                // const data = await response.json()

                setAssignments(sampleAssignments)
            } catch (error) {
                console.error('Error fetching assignments:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAssignments()
    }, [])

    const handleCreateAssignment = () => {
        // Handle create new assignment logic
        console.log('Create new assignment clicked')
    }

    const handleCardClick = (assignment: Assignment) => {
        // Handle card click logic
        console.log('Assignment clicked:', assignment)
    }

    // Filter assignments by type
    const publishedAssignments = assignments.filter(assignment => assignment.type === 'published')
    const unpublishedAssignments = assignments.filter(assignment => assignment.type === 'unpublished')

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Assignments (Essay)</h1>
                    <Button disabled className="bg-[#F1C27D] hover:bg-[#F1C27D]/80">
                        <Plus className="w-4 h-4 mr-2" />
                        Create new Assignment
                    </Button>
                </div>
                <div className="space-y-6">
                    {/* Published Section Skeleton */}
                    <div>
                        <h2 className="text-gray-400 text-md font-medium mb-4">Published Quiz</h2>
                        <div className="space-y-3">
                            {[...Array(3)].map((_, index) => (
                                <Card key={index} className="animate-pulse">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    {/* Unpublished Section Skeleton */}
                    <div>
                        <h2 className="text-gray-400 text-md font-medium mb-4">Unpublished Quiz</h2>
                        <div className="space-y-3">
                            {[...Array(2)].map((_, index) => (
                                <Card key={index} className="animate-pulse">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 pb-4">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Assignments (Essay)
                </h1>
                <Button
                    onClick={handleCreateAssignment}
                    className="bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    Create new Assignment
                </Button>
            </div>

            <div className="space-y-8">
                {/* Published Quiz Section */}
                <div>
                    <h2 className="text-gray-400 text-md font-medium mb-4">Published Quiz</h2>
                    <div className="space-y-3">
                        {publishedAssignments.map((assignment) => (
                            <Card
                                key={assignment.id}
                                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
                                onClick={() => handleCardClick(assignment)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        {/* Orange square indicator */}
                                        <div className="w-4 h-4 bg-[#F1C27D] rounded flex-shrink-0"></div>

                                        <div className="flex-1 min-w-0">
                                            {/* Assignment title */}
                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-2">
                                                {assignment.title}
                                            </h3>

                                            {/* Due date */}
                                            <p className="text-sm text-gray-400">
                                                {assignment.dueDate}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Unpublished Quiz Section */}
                <div>
                    <h2 className="text-gray-400 text-md font-medium mb-4">Unpublished Quiz</h2>
                    <div className="space-y-3">
                        {unpublishedAssignments.map((assignment) => (
                            <Card
                                key={assignment.id}
                                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
                                onClick={() => handleCardClick(assignment)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        {/* Orange square indicator */}
                                        <div className="w-4 h-4 bg-[#F1C27D] rounded flex-shrink-0"></div>

                                        <div className="flex-1 min-w-0">
                                            {/* Assignment title */}
                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-2">
                                                {assignment.title}
                                            </h3>

                                            {/* Scheduled date */}
                                            <p className="text-sm text-gray-400">
                                                {assignment.scheduledDate}
                                            </p>
                                        </div>

                                        {/* Arrow icon */}
                                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {assignments.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No assignments found</p>
                    <Button
                        onClick={handleCreateAssignment}
                        className="mt-4 bg-[#F1C27D] hover:bg-[#F1C27D]/80"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create your first assignment
                    </Button>
                </div>
            )}
        </div>
    )
}
