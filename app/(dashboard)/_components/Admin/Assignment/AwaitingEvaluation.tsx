'use client'

import React, { useState, useEffect } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Data type definition
interface EvaluationItem {
    id: string
    studentName: string
    courseName: string
    assignment: string
    assignmentType: 'Quiz' | 'Essay'
    submissionDate: string
    status: string
}

// Sample data declaration
const sampleEvaluationData: EvaluationItem[] = [
    {
        id: '1',
        studentName: 'Miles, Esther',
        courseName: 'Foundations of Faith',
        assignment: 'Quiz 1',
        assignmentType: 'Quiz',
        submissionDate: '2024-01-16',
        status: 'Grade'
    },
    {
        id: '2',
        studentName: 'Miles, Esther',
        courseName: 'The Life and Teachings of Jesus',
        assignment: 'Essay Assignment',
        assignmentType: 'Essay',
        submissionDate: '2024-01-14',
        status: 'Grade'
    },
    {
        id: '3',
        studentName: 'Miles, Esther',
        courseName: 'Foundations of Faith',
        assignment: 'Essay Assignment',
        assignmentType: 'Essay',
        submissionDate: '2024-01-16',
        status: 'Grade'
    },
    {
        id: '4',
        studentName: 'Miles, Esther',
        courseName: 'Christian Leadership & Servanthood',
        assignment: 'Quiz 2',
        assignmentType: 'Quiz',
        submissionDate: '2024-01-16',
        status: 'Grade'
    },
    {
        id: '5',
        studentName: 'Miles, Esther',
        courseName: 'Understanding the Bible: Old & New Testament',
        assignment: 'Essay Assignment',
        assignmentType: 'Essay',
        submissionDate: '2024-01-16',
        status: 'Grade'
    },
    {
        id: '6',
        studentName: 'Miles, Esther',
        courseName: 'Foundations of Faith',
        assignment: 'Quiz 3',
        assignmentType: 'Quiz',
        submissionDate: '2024-01-16',
        status: 'Grade'
    },
    {
        id: '7',
        studentName: 'Miles, Esther',
        courseName: 'The Life and Teachings of Jesus',
        assignment: 'Quiz 1',
        assignmentType: 'Quiz',
        submissionDate: '2024-01-16',
        status: 'Grade'
    },
    {
        id: '8',
        studentName: 'Miles, Esther',
        courseName: 'Christian Leadership & Servanthood',
        assignment: 'Essay Assignment',
        assignmentType: 'Essay',
        submissionDate: '2024-01-16',
        status: 'Grade'
    }
]

// Table headers configuration
const tableHeaders = [
    {
        key: 'studentName',
        label: 'STUDENT NAME',
        sortable: true
    },
    {
        key: 'courseName',
        label: 'COURSE NAME',
        sortable: true
    },
    {
        key: 'assignmentType',
        label: 'ASSIGNMENT',
        sortable: true
    },
    {
        key: 'submissionDate',
        label: 'SUBMISSION DATE',
        sortable: true
    },
    {
        key: 'status',
        label: 'ACTION',
        sortable: false
    }
]

export default function AwaitingEvaluation() {
    const [evaluationData, setEvaluationData] = useState<EvaluationItem[]>([])
    const [filteredData, setFilteredData] = useState<EvaluationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCourse, setSelectedCourse] = useState<string>('all')
    const router = useRouter()

    const uniqueCourses = Array.from(new Set(evaluationData.map(item => item.courseName)))
    useEffect(() => {
        const fetchEvaluationData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500))

                setEvaluationData(sampleEvaluationData)
                setFilteredData(sampleEvaluationData)
            } catch (error) {
            } finally {
                setLoading(false)
            }
        }

        fetchEvaluationData()
    }, [])


    useEffect(() => {
        if (selectedCourse === 'all') {
            setFilteredData(evaluationData)
        } else {
            setFilteredData(evaluationData.filter(item => item.courseName === selectedCourse))
        }
    }, [selectedCourse, evaluationData])



    const handleGrade = (item: EvaluationItem) => {
        router.push(`/assignment-evaluation/${item.id}`)
    }

    const transformedData = filteredData.map(item => ({
        ...item,
        studentName: (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {item.studentName.split(',')[0].charAt(0)}
                </div>
                <span className="font-medium">{item.studentName}</span>
            </div>
        ),
        assignmentType: (
            <span className={`px-3 py-1 text-sm rounded font-medium w-20 text-center ${item.assignmentType === 'Quiz'
                ? 'bg-[#EFCEFF] text-[#AD0AFD]'
                : 'bg-[#E6F0FF] text-[#0065FF]'
                }`}>
                {item.assignmentType}
            </span>
        ),
        status: (
            <Button
                onClick={() => handleGrade(item)}
                className="bg-[#0F2598] hover:bg-[#0F2598]/80 cursor-pointer text-white px-4 py-2 text-sm rounded-md font-medium"
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
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Assignment List
                </h2>
                <div className="flex items-center gap-2">
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Courses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {uniqueCourses.map((course) => (
                                <SelectItem className='cursor-pointer' key={course} value={course}>
                                    {course}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <ReusableTable
                    headers={tableHeaders}
                    data={transformedData}
                    showPagination={true}
                    itemsPerPage={5}
                    itemsPerPageOptions={[5, 10, 15, 20]}
                // onSort={handleSort}
                // sortKey={sortKey}
                // sortDirection={sortDirection}
                />
            </div>

            {/* Empty state */}
            {filteredData.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No assignments awaiting evaluation</p>
                </div>
            )}
        </div>
    )
}
