'use client'

import React, { useState, useEffect } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Data type definition
interface StudentFileItem {
    id: string
    studentName: string
    seriesName: string
    courseName: string
    submissionDate: string
    status: string
}

// Sample data declaration
const sampleStudentFileData: StudentFileItem[] = [
    {
        id: '1',
        studentName: 'Miles, Esther',
        seriesName: 'Foundations of Faith',
        courseName: 'Foundations of Faith',
        submissionDate: '2024-01-16',
        status: 'View Details'
    },
    {
        id: '2',
        studentName: 'Ella Harris',
        seriesName: 'The Life and Teachings of Jesus',
        courseName: 'The Life and Teachings of Jesus',
        submissionDate: '2024-01-14',
        status: 'View Details'
    },
    {
        id: '3',
        studentName: 'Samuel Robinson',
        seriesName: 'Christian Leadership & Servanthood',
        courseName: 'Christian Leadership & Servanthood',
        submissionDate: '2024-01-16',
        status: 'View Details'
    },
    {
        id: '4',
        studentName: 'Miles, Esther',
        seriesName: 'Understanding the Bible: Old & New Testament',
        courseName: 'Understanding the Bible: Old & New Testament',
        submissionDate: '2024-01-16',
        status: 'View Details'
    },
    {
        id: '5',
        studentName: 'Miles, Esther',
        seriesName: 'Foundations of Faith',
        courseName: 'Foundations of Faith',
        submissionDate: '2024-01-16',
        status: 'View Details'
    },
    {
        id: '6',
        studentName: 'Miles, Esther',
        seriesName: 'The Life and Teachings of Jesus',
        courseName: 'The Life and Teachings of Jesus',
        submissionDate: '2024-01-16',
        status: 'View Details'
    },
    {
        id: '7',
        studentName: 'Miles, Esther',
        seriesName: 'Christian Leadership & Servanthood',
        courseName: 'Christian Leadership & Servanthood',
        submissionDate: '2024-01-16',
        status: 'View Details'
    },
    {
        id: '8',
        studentName: 'Miles, Esther',
        seriesName: 'Understanding the Bible: Old & New Testament',
        courseName: 'Understanding the Bible: Old & New Testament',
        submissionDate: '2024-01-16',
        status: 'View Details'
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
        key: 'seriesName',
        label: 'SERIES NAME',
        sortable: true
    },
    {
        key: 'courseName',
        label: 'COURSE NAME',
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

export default function StudentFileDownload() {
    const [studentFileData, setStudentFileData] = useState<StudentFileItem[]>([])
    const [filteredData, setFilteredData] = useState<StudentFileItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSeries, setSelectedSeries] = useState<string>('all')
    const [selectedCourse, setSelectedCourse] = useState<string>('all')
    const router = useRouter()

    // Get unique series and courses for dropdowns
    const uniqueSeries = Array.from(new Set(studentFileData.map(item => item.seriesName)))
    const uniqueCourses = Array.from(new Set(studentFileData.map(item => item.courseName)))

    useEffect(() => {
        const fetchStudentFileData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500))

                setStudentFileData(sampleStudentFileData)
                setFilteredData(sampleStudentFileData)
            } catch (error) {
                // Handle error
            } finally {
                setLoading(false)
            }
        }

        fetchStudentFileData()
    }, [])

    // Filter data based on selected series and course
    useEffect(() => {
        let filtered = studentFileData

        if (selectedSeries !== 'all') {
            filtered = filtered.filter(item => item.seriesName === selectedSeries)
        }

        if (selectedCourse !== 'all') {
            filtered = filtered.filter(item => item.courseName === selectedCourse)
        }

        setFilteredData(filtered)
    }, [selectedSeries, selectedCourse, studentFileData])

    const handleViewDetails = (item: StudentFileItem) => {
        // Handle view details logic here
        // console.log('View details for:', item)
        router.push(`/student-file-download/${item.id}`)
    }

    // Transform data to include action buttons and formatted content
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
        status: (
            <Button
                onClick={() => handleViewDetails(item)}
                className="bg-[#0F2598] hover:bg-[#0F2598]/80 cursor-pointer text-white px-4 py-2 text-sm rounded-md font-medium"
            >
                View Details
            </Button>
        )
    }))

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Student Files
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
        <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="mb-6">
           
                
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Student Files List</h2>
                    
                    <div className="flex items-center gap-4">
                        <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Selected Series" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Selected Series</SelectItem>
                                {uniqueSeries.map((series) => (
                                    <SelectItem className='cursor-pointer' key={series} value={series}>
                                        {series}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
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
            </div>

            <div className="overflow-x-auto">
                <ReusableTable
                    headers={tableHeaders}
                    data={transformedData}
                    showPagination={true}
                    itemsPerPage={5}
                    itemsPerPageOptions={[5, 10, 15, 20]}
                />
            </div>

            {/* Empty state */}
            {filteredData.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No student files found</p>
                </div>
            )}
        </div>
    )
}
