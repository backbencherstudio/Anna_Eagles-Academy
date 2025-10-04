'use client'

import React, { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { IoLogoWhatsapp } from 'react-icons/io'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import toast from 'react-hot-toast'
import { useGetStudentsQuestionQuery, useDeleteStudentsQuestionMutation } from '@/rtk/api/admin/studentsQuestionApis'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/rtk'
import { setPage, setLimit } from '@/rtk/slices/admin/studentsQuestionSlice'

// Data type for student question
interface StudentQuestionItem {
    id: string
    first_name: string
    last_name: string
    email: string
    phone_number: string
    whatsapp_number: string | null
    status: string
    reason: string
}


// Table headers for student questions
const tableHeaders = [
    { key: 'studentName', label: 'Student Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phoneNumber', label: 'Phone Number', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'reason', label: 'Reason', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
]

export default function StudentQuestionTable() {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<StudentQuestionItem | null>(null)
    const router = useRouter()
    const dispatch = useDispatch()

    // Get pagination state from Redux store
    const pagination = useSelector((state: RootState) => state.studentsQuestion)

    // API hooks
    const { data: studentsData, isLoading: loading, error } = useGetStudentsQuestionQuery(pagination)
    const [deleteStudentsQuestion] = useDeleteStudentsQuestionMutation()

    const buildWhatsappLink = (phoneNumber: string) => {
        const digits = phoneNumber.replace(/[^\d]/g, '')
        return `https://wa.me/${digits}`
    }

    // Transform API data for the table
    const transformedStudentData = (studentsData?.data?.contacts || []).map((item: StudentQuestionItem) => ({
        ...item,
        studentName: (
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>
                        {`${item.first_name} ${item.last_name}`.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <span className="font-medium">{`${item.first_name} ${item.last_name}`}</span>
            </div>
        ),
        phoneNumber: (() => {
            const whatsappNumber = item.whatsapp_number
            const displayNumber = whatsappNumber || item.phone_number
            const hasWhatsApp = !!whatsappNumber

            return (
                <div className="flex items-center gap-2">
                    {hasWhatsApp ? (
                        <a
                            href={buildWhatsappLink(displayNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:underline hover:text-green-700 transition-colors duration-200"
                            title="Click to open WhatsApp"
                        >
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors duration-200">
                                <IoLogoWhatsapp className="text-green-600 text-sm" />
                            </span>
                            {displayNumber}
                        </a>
                    ) : (
                        <span className="text-gray-900">{displayNumber}</span>
                    )}
                </div>
            )
        })(),
        status: (
            <span className={`px-3 py-1 text-sm rounded capitalize ${item.status === 'pending'
                ? 'bg-[#FEF4CF] text-[#BB960B]'
                : item.status === 'approve'
                    ? 'bg-[#E7F7EF] text-[#27A376]'
                    : item.status === 'reject'
                        ? 'bg-[#FF5757] text-white'
                        : 'bg-gray-200 text-gray-700'
                }`}>
                {item.status === 'approve' ? 'Approved' :
                    item.status === 'reject' ? 'Rejected' :
                        item.status}
            </span>
        )
    }))

    const handleDeleteClick = (item: StudentQuestionItem) => {
        setSelectedStudent(item)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (selectedStudent) {
            try {
                const response = await deleteStudentsQuestion(selectedStudent.id).unwrap()
                const message = response?.message || `Student question from ${selectedStudent.first_name} ${selectedStudent.last_name} has been deleted successfully!`
                toast.success(message)
            } catch (error: any) {
                console.error('Error deleting student question:', error)
                const errorMessage = error?.data?.message || error?.message || 'Failed to delete student question'
                toast.error(errorMessage)
            }
        }
        setDeleteDialogOpen(false)
        setSelectedStudent(null)
    }

    // Define table actions
    const tableActions = [
        {
            label: 'View ',
            icon: <Eye className="h-4 w-4 mr-2" />,
            onClick: (item: StudentQuestionItem) => {
                router.push(`/admin/student-question/${item.id}`)
            }
        },
        {
            label: 'Delete',
            icon: <Trash2 className="h-4 w-4 mr-2" />,
            onClick: handleDeleteClick,
            variant: 'destructive' as const
        }
    ]

    return (
        <>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Student All Question</h2>
                <p className="text-gray-600 text-sm mb-6">Student Data</p>

                <ReusableTable
                    headers={tableHeaders}
                    data={transformedStudentData}
                    actions={tableActions}
                    showPagination={true}
                    // server-controlled pagination
                    serverControlled={true}
                    currentPage={studentsData?.data?.pagination?.page ?? pagination.page}
                    totalPages={studentsData?.data?.pagination?.totalPages}
                    totalItems={studentsData?.data?.pagination?.total || 0}
                    itemsPerPage={studentsData?.data?.pagination?.limit ?? pagination.limit}
                    itemsPerPageOptions={[5, 10, 15, 20]}
                    onPageChange={(newPage) => dispatch(setPage(newPage))}
                    onItemsPerPageChange={(newLimit) => { dispatch(setLimit(newLimit)); dispatch(setPage(1)) }}
                    isLoading={loading}
                />
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Student Question"
                description={`Are you sure you want to delete the question from ${selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : ''}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                confirmVariant="destructive"
            />
        </>
    )
}
