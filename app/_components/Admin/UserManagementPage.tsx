'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Download, Search, Lock, Eye, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setSearch, setPage, setLimit } from '@/rtk/slices/admin/studentManagementSlice'
import { useGetAllStudentsQuery, useRestrictStudentMutation, useDetailsDownloadStudentMutation } from '@/rtk/api/admin/studentManagementApis'
import { useDebounce } from '@/hooks/useDebounce'
import Image from 'next/image'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'

interface Student {
    id: string
    name: string
    email: string
    avatar_url: string
    completion_percentage: number
    assignment_submissions_count: number
    quiz_submissions_count: number
    enrollment_statuses: string[]
    status?: number
}

export default function UserManagementPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { search, page, limit } = useAppSelector((s) => s.studentManagement)
    const [searchInput, setSearchInput] = useState<string>(search)
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
    const [isNavigatingToEmail, setIsNavigatingToEmail] = useState(false)
    const [localStudentStatuses, setLocalStudentStatuses] = useState<Record<string, number>>({})
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean
        student: Student | null
        action: 'restrict' | 'unrestrict' | null
    }>({
        open: false,
        student: null,
        action: null
    })
    const debouncedSearch = useDebounce(searchInput, 500)

    const { data, isFetching } = useGetAllStudentsQuery({ page, limit, search })
    const [restrictStudent] = useRestrictStudentMutation()
    const [downloadStudentDetails] = useDetailsDownloadStudentMutation()

    const students = useMemo(() => data?.data?.students ?? [], [data?.data?.students])
    const totalItems = data?.data?.pagination?.total ?? 0
    const totalPages = data?.data?.pagination?.totalPages ?? 0

    useEffect(() => {
        if (debouncedSearch !== search) {
            dispatch(setSearch(debouncedSearch))
        }
    }, [debouncedSearch, search, dispatch])

    useEffect(() => {
        if (search !== searchInput) {
            setSearchInput(search)
        }
    }, [search, searchInput])


    // download details
    const handleDownloadDetails = useCallback(async (student: Student) => {
        if (loadingStates[student.id]) return
        setLoadingStates(prev => ({ ...prev, [student.id]: true }))

        try {
            const response = await downloadStudentDetails(student.id).unwrap()

            let blob: Blob
            if (response instanceof Blob) {
                blob = response
            } else if (typeof response === 'string') {
                blob = new Blob([response], { type: 'text/csv;charset=utf-8' })
            } else {
                blob = new Blob([JSON.stringify(response)], { type: 'text/csv;charset=utf-8' })
            }

            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${student.name || 'student'}_details.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            toast.success(`Details for ${student.name || 'student'} downloaded successfully!`)
        } catch (error) {
            toast.error('Failed to download details')
        } finally {
            setLoadingStates(prev => ({ ...prev, [student.id]: false }))
        }
    }, [loadingStates, downloadStudentDetails])

    // view profile
    const handleViewProfile = useCallback(async (student: Student) => {
        router.push(`/admin/users-management/${student.id}`)
    }, [router])


    // restrict student
    const handleRestrictStudent = useCallback(async (student: Student) => {
        const currentStatus = localStudentStatuses[student.id] !== undefined
            ? localStudentStatuses[student.id]
            : student.status

        const action = currentStatus === 1 ? 'restrict' : 'unrestrict'

        setConfirmDialog({
            open: true,
            student,
            action
        })
    }, [localStudentStatuses])

    // confirm restrict student
    const handleConfirmRestrictStudent = useCallback(async () => {
        if (!confirmDialog.student) return

        const student = confirmDialog.student
        setLoadingStates(prev => ({ ...prev, [student.id]: true }))

        try {
            const currentStatus = localStudentStatuses[student.id] !== undefined
                ? localStudentStatuses[student.id]
                : student.status

            const newStatus = currentStatus === 1 ? 0 : 1
            setLocalStudentStatuses(prev => ({ ...prev, [student.id]: newStatus }))

            await restrictStudent({ student_id: student.id, status: newStatus }).unwrap()

            const action = newStatus === 0 ? 'restricted' : 'activated'
            const studentName = student?.name || student?.email || 'Student'
            toast.success(`${studentName} has been ${action} successfully!`)
        } catch (error) {
            setLocalStudentStatuses(prev => {
                const revertedStatus = student.status !== undefined ? student.status : 1
                return { ...prev, [student.id]: revertedStatus }
            })
            toast.error('Failed to update student status')
        } finally {
            setLoadingStates(prev => ({ ...prev, [student.id]: false }))
        }
    }, [confirmDialog.student, restrictStudent, localStudentStatuses])

    // headers
    const headers = [
        { key: 'studentName', label: 'Student Name', sortable: true },
        { key: 'email', label: 'Email Address', sortable: true },
        { key: 'completion', label: 'Completion Status', sortable: true },
        { key: 'submittedAssignments', label: 'Submitted Assignments', sortable: true },
        { key: 'submittedQuiz', label: 'Submitted Quiz', sortable: true },
        { key: 'enrollment', label: 'Enrollment Status', sortable: true },
        { key: 'accountStatus', label: 'Account Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ]

    // transformed data
    const transformedData = useMemo(() => {
        return students.map((student: Student) => {
            const studentName = student?.name || 'Unknown'
            const initial = studentName.charAt(0).toUpperCase()
            const avatarUrl = student?.avatar_url

            return {
                id: student.id,
                status: student.status,
                name: student.name,
                studentName: (
                    <div className="flex items-center gap-3">
                        {avatarUrl ? (
                            <Image
                                width={48}
                                height={48}
                                src={avatarUrl}
                                alt={studentName}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {initial}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-medium capitalize">{studentName}</span>
                            <span className="text-xs text-gray-500">{student?.email}</span>
                        </div>
                    </div>
                ),
                email: (
                    <div className="flex flex-col">
                        {student?.email && <span className="text-sm">{student?.email}</span>}
                    </div>
                ),
                completion: `${student?.completion_percentage}%`,
                submittedAssignments: student?.assignment_submissions_count,
                submittedQuiz: student?.quiz_submissions_count,
                enrollment: (
                    <span className="text-sm">
                        {student?.enrollment_statuses?.[0] || '-'}
                    </span>
                ),
                accountStatus: (
                    <div className={`px-2 py-1 w-fit rounded-md text-xs font-medium ${
                        (localStudentStatuses[student.id] !== undefined 
                            ? localStudentStatuses[student.id] 
                            : student.status) === 1 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        {(localStudentStatuses[student.id] !== undefined 
                            ? localStudentStatuses[student.id] 
                            : student.status) === 1 ? 'Active' : 'Restricted'}
                    </div>
                ),
            }
        })
    }, [students, localStudentStatuses])

    // get restrict button label
    const getRestrictButtonLabel = useCallback((student: Student) => {
        const currentStatus = localStudentStatuses[student.id] !== undefined
            ? localStudentStatuses[student.id]
            : student.status
        return currentStatus === 1 ? 'Restrict User' : 'Unrestrict User'
    }, [localStudentStatuses])

    // actions
    const actions = useMemo(() => [
        {
            label: 'Download Details',
            icon: <Download className="mr-2 h-4 w-4" />,
            onClick: (student: Student) => handleDownloadDetails(student),
            isLoading: (student: Student) => loadingStates[student.id] || false
        },
        {
            label: 'View Profile',
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (student: Student) => handleViewProfile(student),
            isLoading: (student: Student) => loadingStates[student.id] || false
        },
        {
            label: getRestrictButtonLabel,
            icon: <Lock className="mr-2 h-4 w-4" />,
            onClick: (student: Student) => handleRestrictStudent(student),
            variant: 'destructive' as const,
            isLoading: (student: Student) => loadingStates[student.id] || false
        }
    ], [handleDownloadDetails, handleViewProfile, handleRestrictStudent, loadingStates, getRestrictButtonLabel])

    const handleSendEmailNotification = () => {
        setIsNavigatingToEmail(true)
        router.push('/admin/email-notification')
    }

    return (
        <div className="bg-white rounded-xl p-4">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Student Roster</h1>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    {/* Search Field */}
                    <div className="relative w-full sm:w-48 lg:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for a Student"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 border-gray-300 rounded-md w-full"
                        />
                    </div>

                    {/* Send Email Notification Button */}
                    <Button
                        onClick={handleSendEmailNotification}
                        disabled={isNavigatingToEmail}
                        className="bg-[#0F2598] hover:bg-[#0F2598]/80 cursor-pointer text-white rounded-md px-3 sm:px-4 py-2 w-full sm:w-auto text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isNavigatingToEmail ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Send Email Notification'
                        )}
                    </Button>
                </div>
            </div>

            <ReusableTable
                headers={headers}
                data={transformedData}
                actions={actions}
                showPagination
                serverControlled={true}
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={limit}
                itemsPerPageOptions={[5, 10, 15, 20]}
                onPageChange={(p) => dispatch(setPage(p))}
                onItemsPerPageChange={(l) => dispatch(setLimit(l))}
                isLoading={isFetching}
                skeletonRows={8}
            />

            <ConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
                title={confirmDialog.action === 'restrict' ? 'Restrict Student' : 'Unrestrict Student'}
                description={
                    confirmDialog.action === 'restrict'
                        ? `Are you sure you want to restrict ${confirmDialog.student?.name}? They will not be able to access the platform.`
                        : `Are you sure you want to unrestrict ${confirmDialog.student?.name}? They will regain access to the platform.`
                }
                confirmText={confirmDialog.action === 'restrict' ? 'Restrict' : 'Unrestrict'}
                cancelText="Cancel"
                onConfirm={handleConfirmRestrictStudent}
                confirmVariant="destructive"
                isLoading={confirmDialog.student ? loadingStates[confirmDialog.student.id] : false}
            />
        </div>
    )
}
