'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import toast from 'react-hot-toast'
import { useGetSingleStudentsQuestionQuery, useUpdateStudentQuestionStatusMutation } from '@/rtk/api/admin/studentsQuestionApis'

// Data type for student question detail
interface StudentQuestionDetail {
    id: string
    first_name: string
    last_name: string
    email: string
    phone_number: string
    whatsapp_number: string | null
    status: string
    date: string
    reason: string
    message: string
    created_at: string
    updated_at: string
}


interface StudentQuestionDetailProps {
    studentId: string
}

export default function StudentQuestionDetail({ studentId }: StudentQuestionDetailProps) {
    const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    // API hooks
    const { data, isLoading: loading, error } = useGetSingleStudentsQuestionQuery(studentId)
    const [updateStudentQuestionStatus] = useUpdateStudentQuestionStatusMutation()

    const studentDetail = data?.data

    useEffect(() => {
        setMounted(true)
    }, [])

    const formatDate = (dateString: string) => {
        if (!mounted) return ''
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    const handleApproveClick = () => {
        setAcceptDialogOpen(true)
    }

    const handleRejectClick = () => {
        setRejectDialogOpen(true)
    }

    const handleAcceptConfirm = async () => {
        if (!studentDetail) return

        try {
            const response = await updateStudentQuestionStatus({
                id: studentDetail.id,
                status: 'approve'
            }).unwrap()
            console.log('Approve response:', response)

            // Show API message or default message
            const message = response?.message || `Student question from ${studentDetail.first_name} ${studentDetail.last_name} has been approved successfully!`
            toast.success(message)
            setAcceptDialogOpen(false)

        } catch (error: any) {
            console.error('Error approving student question:', error)

            const errorMessage = error?.data?.message || error?.message || 'Failed to approve student question'
            toast.error(errorMessage)
        }
    }

    const handleRejectConfirm = async () => {
        if (!studentDetail) return

        try {
            const response = await updateStudentQuestionStatus({
                id: studentDetail.id,
                status: 'reject'
            }).unwrap()
            console.log('Reject response:', response)

            // Show API message or default message
            const message = response?.message || `Student question from ${studentDetail.first_name} ${studentDetail.last_name} has been rejected successfully!`
            toast.success(message)
            setRejectDialogOpen(false)
        } catch (error: any) {
            console.error('Error rejecting student question:', error)

            const errorMessage = error?.data?.message || error?.message || 'Failed to reject student question'
            toast.error(errorMessage)
        }
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
                    className="p-2 cursor-pointer"
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
                        <span className="text-sm text-gray-900">{studentDetail.first_name} {studentDetail.last_name}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">EMAIL:</span>
                        <span className="text-sm text-gray-900">{studentDetail.email}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">PHONE NUMBER:</span>
                        <span className="text-sm text-gray-900">{studentDetail.phone_number}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">WHATSAPP:</span>
                        <span className="text-sm text-gray-900">{studentDetail.whatsapp_number || 'Not provided'}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">STATUS:</span>
                        <span className={`px-3 py-1 text-sm rounded capitalize ${studentDetail.status === 'pending'
                                ? 'bg-[#FEF4CF] text-[#BB960B]'
                                : studentDetail.status === 'approve'
                                    ? 'bg-[#E7F7EF] text-[#27A376]'
                                    : studentDetail.status === 'reject'
                                        ? 'bg-[#FF5757] text-white'
                                        : 'bg-gray-200 text-gray-700'
                            }`}>
                            {studentDetail.status}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">REASON:</span>
                        <span className="text-sm text-gray-900">{studentDetail.reason}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">DATE:</span>
                        <span className="text-sm text-gray-900">{formatDate(studentDetail.date)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                        <span className="text-sm font-medium text-gray-600 w-32">MESSAGE:</span>
                        <span className="text-sm text-gray-900 flex-1">{studentDetail.message}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button
                    onClick={handleApproveClick}
                    disabled={studentDetail.status === 'approve'}
                    className={`flex-1 py-5 cursor-pointer ${studentDetail.status === 'approve'
                            ? 'bg-gray-400 hover:bg-gray-400 text-white'
                            : 'bg-[#0F2598] hover:bg-[#0F2598]/90 text-white'
                        }`}
                >
                    <Check className="h-4 w-4 mr-2" />
                    {studentDetail.status === 'approve' ? 'Approved' : 'Approve'}
                </Button>
                <Button
                    onClick={handleRejectClick}
                    disabled={studentDetail.status === 'reject'}
                    variant={studentDetail.status === 'reject' ? 'secondary' : 'destructive'}
                    className={`flex-1 py-5 cursor-pointer ${studentDetail.status === 'reject'
                            ? 'bg-gray-400 hover:bg-gray-400 text-white'
                            : 'bg-[#EB3D4D] hover:bg-[#EB3D4D]/90 text-white'
                        }`}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {studentDetail.status === 'reject' ? 'Rejected' : 'Reject'}
                </Button>
            </div>

            {/* Accept Confirmation Dialog */}
            <ConfirmDialog
                open={acceptDialogOpen}
                onOpenChange={setAcceptDialogOpen}
                title="Approve Student Question"
                description={`Are you sure you want to approve the question from ${studentDetail ? `${studentDetail.first_name} ${studentDetail.last_name}` : ''}?`}
                cancelText="Cancel"
                confirmText="Approve"
                onConfirm={handleAcceptConfirm}
                confirmVariant="default"
            />

            {/* Reject Confirmation Dialog */}
            <ConfirmDialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
                title="Reject Student Question"
                description={`Are you sure you want to reject the question from ${studentDetail ? `${studentDetail.first_name} ${studentDetail.last_name}` : ''}? This action cannot be undone.`}
                confirmText="Reject"
                cancelText="Cancel"
                onConfirm={handleRejectConfirm}
                confirmVariant="destructive"
            />
        </div>
    )
}
