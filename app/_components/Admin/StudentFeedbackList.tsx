'use client'

import React, { useState, useEffect } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, Trash2, Search } from 'lucide-react'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'

// Data type definition
interface FeedbackItem {
    id: string
    studentName: string
    feedbackType: 'Course review' | 'Weekly review'
    time: string
    date: string
    status: 'Pending' | 'Approved'
}

// Sample data declaration
const sampleFeedbackData: FeedbackItem[] = [
    {
        id: '1',
        studentName: 'Ralph Edwards',
        feedbackType: 'Course review',
        time: '01:09 am',
        date: '2024-07-15',
        status: 'Pending'
    },
    {
        id: '2',
        studentName: 'Arlene McCoy',
        feedbackType: 'Weekly review',
        time: '01:34 pm',
        date: '2024-07-20',
        status: 'Pending'
    },
    {
        id: '3',
        studentName: 'Darlene Robertson',
        feedbackType: 'Course review',
        time: '08:20 pm',
        date: '2024-08-01',
        status: 'Approved'
    },
    {
        id: '4',
        studentName: 'Jenny Wilson',
        feedbackType: 'Course review',
        time: '07:13 pm',
        date: '2024-08-05',
        status: 'Approved'
    },
    {
        id: '5',
        studentName: 'Theresa Webb',
        feedbackType: 'Weekly review',
        time: '05:14 pm',
        date: '2024-08-05',
        status: 'Approved'
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
        key: 'feedbackType',
        label: 'FEEDBACK TYPE',
        sortable: true
    },
    {
        key: 'time',
        label: 'TIME',
        sortable: true
    },
    {
        key: 'date',
        label: 'DATE',
        sortable: true
    },
    {
        key: 'status',
        label: 'STATUS',
        sortable: true
    },
    {
        key: 'action',
        label: 'ACTION',
        sortable: false
    }
]

export default function StudentFeedbackList() {
    const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([])
    const [filteredData, setFilteredData] = useState<FeedbackItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedFeedbackType, setSelectedFeedbackType] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<FeedbackItem | null>(null)
    const router = useRouter()

    const uniqueFeedbackTypes = Array.from(new Set(feedbackData.map(item => item.feedbackType)))

    useEffect(() => {
        const fetchFeedbackData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                setFeedbackData(sampleFeedbackData)
                setFilteredData(sampleFeedbackData)
            } catch (error) {
            } finally {
                setLoading(false)
            }
        }

        fetchFeedbackData()
    }, [])

    useEffect(() => {
        let filtered = feedbackData

        // Filter by feedback type
        if (selectedFeedbackType !== 'all') {
            filtered = filtered.filter(item => item.feedbackType === selectedFeedbackType)
        }

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(item => 
                item.studentName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredData(filtered)
    }, [selectedFeedbackType, searchTerm, feedbackData])

    const handleView = (item: FeedbackItem) => {
        // Navigate to feedback detail page
        router.push(`/student-feedback/${item.id}`)
    }

    const handleDelete = (item: FeedbackItem) => {
        setItemToDelete(item)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (itemToDelete) {
            // Remove item from both arrays
            const updatedData = feedbackData.filter(item => item.id !== itemToDelete.id)
            const updatedFilteredData = filteredData.filter(item => item.id !== itemToDelete.id)
            
            setFeedbackData(updatedData)
            setFilteredData(updatedFilteredData)
            
            console.log('Deleted feedback:', itemToDelete.id)
        }
        setItemToDelete(null)
    }

    const transformedData = filteredData.map(item => ({
        ...item,
        studentName: (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {item.studentName.split(' ')[0].charAt(0)}
                </div>
                <span className="">{item.studentName}</span>
            </div>
        ),
        feedbackType: (
            <span className={`px-3 py-1 text-sm rounded  ${item.feedbackType === 'Course review'
                ? 'bg-[#EFCEFF] text-[#AD0AFD]'
                : 'bg-gray-200 text-gray-700'
                }`}>
                {item.feedbackType}
            </span>
        ),
        status: (
            <span className={`px-3 py-1 text-sm rounded  ${item.status === 'Approved'
                ? 'bg-[#E7F7EF] text-[#27A376]'
                : 'bg-[#FEF4CF] text-[#BB960B]'
                }`}>
                {item.status}
            </span>
        ),
        action: (
            <div className="flex items-center gap-2">
                <Button
                    onClick={() => handleView(item)}
                    className="w-8 h-8 p-0 cursor-pointer bg-[#27A376] hover:bg-[#27A376]/80 text-white rounded-lg"
                >
                    <Eye className="h-4 w-4" />
                </Button>
                <Button
                    onClick={() => handleDelete(item)}
                    className="w-8 h-8 p-0 cursor-pointer bg-[#FF5757] hover:bg-[#FF5757]/80 text-white rounded-lg"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        )
    }))

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#1D1F2C]">
                    Student Feedback List
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

                    {/* Feedback Type Filter */}
                    <Select value={selectedFeedbackType} onValueChange={setSelectedFeedbackType}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Feedback Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {uniqueFeedbackTypes.map((type) => (
                                <SelectItem className='cursor-pointer' key={type} value={type}>
                                    {type}
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
                    <p className="text-gray-500 text-lg">No feedback found</p>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Feedback"
                description={`Are you sure you want to delete the feedback from ${itemToDelete?.studentName}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                confirmVariant="destructive"
            />
        </div>
    )
}
