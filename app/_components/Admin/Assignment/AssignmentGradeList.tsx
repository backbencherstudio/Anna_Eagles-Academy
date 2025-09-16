'use client'

import React, { useState, useEffect } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

// Data type definition
interface GradeItem {
    id: string
    studentName: string
    courseName: string
    assignment: string
    assignmentType: 'Quiz' | 'Essay'
    gradeNumber: string
    status: string
}

// Sample data declaration
const sampleGradeData: GradeItem[] = [
    {
        id: '1',
        studentName: 'Miles, Esther',
        courseName: 'Foundations of Faith',
        assignment: 'Quiz 1',
        assignmentType: 'Quiz',
        gradeNumber: '10/8',
        status: 'View'
    },
    {
        id: '2',
        studentName: 'Miles, Esther',
        courseName: 'The Life and Teachings of Jesus',
        assignment: 'Essay Assignment',
        assignmentType: 'Essay',
        gradeNumber: '10/6',
        status: 'View'
    },
    {
        id: '3',
        studentName: 'Miles, Esther',
        courseName: 'Foundations of Faith',
        assignment: 'Essay Assignment',
        assignmentType: 'Essay',
        gradeNumber: '10/9',
        status: 'View'
    },
    {
        id: '4',
        studentName: 'Miles, Esther',
        courseName: 'The Life and Teachings of Jesus',
        assignment: 'Quiz 2',
        assignmentType: 'Quiz',
        gradeNumber: '10/10',
        status: 'View'
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
        key: 'gradeNumber',
        label: 'GRADE NUMBER',
        sortable: true
    },
    {
        key: 'status',
        label: 'ACTION',
        sortable: false
    }
]

export default function AssignmentGradeList() {
    const [gradeData, setGradeData] = useState<GradeItem[]>([])
    const [filteredData, setFilteredData] = useState<GradeItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCourse, setSelectedCourse] = useState<string>('all')
    const [selectedSeries, setSelectedSeries] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState<string>('')
    const router = useRouter()

    const uniqueCourses = Array.from(new Set(gradeData.map(item => item.courseName)))

    useEffect(() => {
        const fetchGradeData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                setGradeData(sampleGradeData)
                setFilteredData(sampleGradeData)
            } catch (error) {
            } finally {
                setLoading(false)
            }
        }

        fetchGradeData()
    }, [])

    useEffect(() => {
        let filtered = gradeData

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(item => 
                item.studentName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredData(filtered)
    }, [searchTerm, gradeData])

    const handleView = (item: GradeItem) => {
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
                onClick={() => handleView(item)}
                className="bg-[#0F2598] hover:bg-[#0F2598]/80 cursor-pointer text-white px-4 py-2 text-sm rounded-md font-medium"
            >
                View
            </Button>
        )
    }))



    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Assignment Grade List
                </h2>
                
                <div className="flex items-center gap-2">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search Student"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-48"
                        />
                    </div>

                    {/* Series Filter */}
                    <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Selected Series" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Series</SelectItem>
                            <SelectItem value="Quiz">Quiz</SelectItem>
                            <SelectItem value="Essay">Essay</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Course Filter */}
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
                    isLoading={loading}
                />
            </div>

            {/* Empty state */}
            {filteredData.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No graded assignments found</p>
                </div>
            )}
        </div>
    )
}
