'use client'

import React, { useState, useEffect } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

// Data type definition
interface EvaluationItem {
    id: string
    assignment: string
    submissionDate: string
    student: string
    status: string
}

// Sample data declaration
const sampleEvaluationData: EvaluationItem[] = [
    {
        id: '1',
        assignment: 'Analysis of Chemical Reaction Results',
        submissionDate: '20/09/2024',
        student: 'Matthew Thomas',
        status: 'Grade'
    },
    {
        id: '2',
        assignment: 'Exploring Stoichiometry',
        submissionDate: '21/09/2024',
        student: 'Isabella Hall',
        status: 'Grade'
    },
    {
        id: '3',
        assignment: 'Lab Report: Chemical Reaction Observations',
        submissionDate: '22/09/2024',
        student: 'Ella Harris',
        status: 'Grade'
    },
    {
        id: '4',
        assignment: 'Chemical Bonding Analysis',
        submissionDate: '23/09/2024',
        student: 'Samuel Robinson',
        status: 'Grade'
    },
    {
        id: '5',
        assignment: 'Thermodynamics Fundamentals',
        submissionDate: '24/09/2024',
        student: 'Olivia Wilson',
        status: 'Grade'
    }
]

// Table headers configuration
const tableHeaders = [
    {
        key: 'assignment',
        label: 'Assignment',
        sortable: true
    },
    {
        key: 'submissionDate',
        label: 'Submission Date',
        sortable: true
    },
    {
        key: 'student',
        label: 'Student',
        sortable: true
    },
    {
        key: 'status',
        label: 'Status',
        sortable: false
    }
]

export default function AwaitingEvaluation() {
    const [evaluationData, setEvaluationData] = useState<EvaluationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [sortKey, setSortKey] = useState<string>('')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const router = useRouter()
    // Simulate data fetching with useEffect
    useEffect(() => {
        const fetchEvaluationData = async () => {
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000))

                // In real implementation, you would fetch from your API
                // const response = await fetch('/api/evaluations/awaiting')
                // const data = await response.json()

                setEvaluationData(sampleEvaluationData)
            } catch (error) {
                // console.error('Error fetching evaluation data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvaluationData()
    }, [])

    // Handle sorting
    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDirection('asc')
        }
    }

    // Handle grade action
    const handleGrade = (item: EvaluationItem) => {
        router.push(`/assignment-evaluation/${item.id}`)
        // console.log('Grade assignment:', item)
        // Handle grading logic here
    }

    // Transform data to include action buttons
    const transformedData = evaluationData.map(item => ({
        ...item,
        status: (
            <Button
                onClick={() => handleGrade(item)}
                className="bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/80 text-gray-700 px-3 py-1 text-sm rounded"
            >
                Grade
            </Button>
        )
    }))

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Awaiting Evaluation
                </h2>
                <div className="animate-pulse">
                    <div className="bg-gray-100 h-12 rounded-t mb-2"></div>
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className={`h-12 mb-2 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}
                        ></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Awaiting Evaluation
            </h2>

            <div className="overflow-x-auto">
                <ReusableTable
                    headers={tableHeaders}
                    data={transformedData}
                    onSort={handleSort}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                />
            </div>

            {/* Empty state */}
            {evaluationData.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No assignments awaiting evaluation</p>
                </div>
            )}
        </div>
    )
}
