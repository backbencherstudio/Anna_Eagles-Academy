'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import toast from 'react-hot-toast'

// Data type for student question detail
interface StudentQuestionDetail {
    id: string
    studentName: string
    email: string
    phoneNumber: string
    timeZone: string
    note: string
}

// Sample data for student question detail
const sampleStudentDetail: StudentQuestionDetail = {
    id: '1',
    studentName: 'Shara',
    email: 'georgia.young@example.com',
    phoneNumber: '+44 7946 123456',
    timeZone: '10:32 pm',
    note: 'What is your question about the class? Feel free to ask anything you need clarification on!'
}

interface StudentQuestionDetailProps {
    studentId: string
}

export default function StudentQuestionDetail({ studentId }: StudentQuestionDetailProps) {
    const [studentDetail, setStudentDetail] = useState<StudentQuestionDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchStudentDetail = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                setStudentDetail(sampleStudentDetail)
            } catch (error) {
                console.error('Error fetching student detail:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStudentDetail()
    }, [studentId])

    const handleAcceptClick = () => {
        setAcceptDialogOpen(true)
    }

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true)
    }

    const handleAcceptConfirm = () => {
        toast.success(`Student question from ${studentDetail?.studentName} has been accepted successfully!`)
        setAcceptDialogOpen(false)
        router.push('/student-question')
    }

    const handleDeleteConfirm = () => {
        
        toast.success(`Student question from ${studentDetail?.studentName} has been deleted successfully!`)
        setDeleteDialogOpen(false)
        router.push('/student-question')
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!studentDetail) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <p className="text-gray-500">Student question not found.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="p-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            </div>

            {/* Company Information */}
            <div className="mb-8">
                <h3 className="text-md font-medium text-gray-900 mb-4">Company Information</h3>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">STUDENT NAME:</span>
                        <span className="text-sm text-gray-900">{studentDetail.studentName}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">EMAIL:</span>
                        <span className="text-sm text-gray-900">{studentDetail.email}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">TIME ZONE:</span>
                        <span className="text-sm text-gray-900">{studentDetail.timeZone}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">PHONE NUMBER:</span>
                        <span className="text-sm text-gray-900">{studentDetail.phoneNumber}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">NOTE:</span>
                        <span className="text-sm text-gray-900 flex-1">{studentDetail.note}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button
                    onClick={handleAcceptClick}
                    className="flex-1 py-5 bg-[#0F2598] hover:bg-[#0F2598]/90 text-white cursor-pointer"
                >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                </Button>
                <Button
                    onClick={handleDeleteClick}
                    variant="destructive"
                    className="flex-1 py-5 bg-[#EB3D4D] hover:bg-[#EB3D4D]/90 text-white cursor-pointer"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deleted
                </Button>
            </div>

            {/* Accept Confirmation Dialog */}
            <ConfirmDialog
                open={acceptDialogOpen}
                onOpenChange={setAcceptDialogOpen}
                title="Accept Student Question"
                description={`Are you sure you want to accept the question from ${studentDetail?.studentName}?`}
                confirmText="Accept"
                cancelText="Cancel"
                onConfirm={handleAcceptConfirm}
                confirmVariant="default"
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Student Question"
                description={`Are you sure you want to delete the question from ${studentDetail?.studentName}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                confirmVariant="destructive"
            />
        </div>
    )
}
