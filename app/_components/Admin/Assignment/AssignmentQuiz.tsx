'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import PublishedQuiz from './PublishedQuiz'
import UnpublishedQuiz from './UnpublishedQuiz'

// Data type definition
interface Assignment {
    id: string
    title: string
    submissions: number
    totalStudents: number
    status: 'active' | 'completed' | 'draft'
}

// Sample data declaration
const sampleAssignments: Assignment[] = [
    {
        id: '1',
        title: 'Analysis of Chemical Reaction Results',
        submissions: 10,
        totalStudents: 34,
        status: 'active'
    },
    {
        id: '2',
        title: 'Exploring New Materials: Stoichiometry',
        submissions: 12,
        totalStudents: 34,
        status: 'active'
    },
    {
        id: '3',
        title: 'Lab Report: Chemical Reaction Observations',
        submissions: 21,
        totalStudents: 34,
        status: 'active'
    },
    {
        id: '4',
        title: 'Exploring New Materials: Stoichiometry',
        submissions: 30,
        totalStudents: 34,
        status: 'active'
    },
    {
        id: '5',
        title: 'Lab Report: Chemical Reaction Observations',
        submissions: 18,
        totalStudents: 34,
        status: 'active'
    },
    {
        id: '6',
        title: 'Analysis of Chemical Reaction Results',
        submissions: 8,
        totalStudents: 34,
        status: 'active'
    }
]

export default function AssignmentQuiz() {
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    // Simulate data fetching with useEffect
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000))
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
        router.push('/admin/create-quiz')
        // Handle create new assignment logic
        // console.log('Create new assignment clicked')
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Assignments (Quiz)</h1>
                    <Button disabled className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Create new Assignment
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardContent className="p-4">
                                <div className="w-4 h-4 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 pb-4">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Assignments (Quiz)
                    </h1>
                    <Button
                        onClick={handleCreateAssignment}
                        className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 gap-2 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Create new Assignment
                    </Button>
                </div>

                {/* Assignment Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {assignments.map((assignment) => (
                        <Card
                            key={assignment.id}
                            className="hover:shadow transition-shadow duration-200 cursor-pointer border border-gray-200"
                        >
                            <CardContent className="p-4">
                                {/* Orange square indicator */}
                                <div className="w-4 h-4 bg-[#FC4B0E] rounded mb-3"></div>

                                {/* Assignment title */}
                                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2 line-clamp-2">
                                    {assignment.title}
                                </h3>

                                {/* Submission status */}
                                <p className="text-sm text-gray-600">
                                    {assignment.submissions}/{assignment.totalStudents} Submission
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty state */}
                {assignments.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No assignments found</p>
                        <Button
                            onClick={handleCreateAssignment}
                            className="mt-4 bg-orange-500 hover:bg-orange-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create your first assignment
                        </Button>
                    </div>
                )}
            </div>
            {/* published and unpublished cards */}
            <div className="bg-white rounded-lg p-4 border border-gray-100 mt-5">
                <div className='space-y-5'>
                    <PublishedQuiz />
                    <UnpublishedQuiz />
                </div>
            </div>
        </>

    )
}
