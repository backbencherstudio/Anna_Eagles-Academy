'use client'

import React, { useEffect, useState } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, Trash2, Search } from 'lucide-react'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import { useDebounce } from '@/hooks/useDebounce'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setSearch, setType, setPage, setLimit } from '@/rtk/slices/admin/studentFeedbackslice'
import { useGetAllStudentFeedbackQuery, useDeleteStudentFeedbackMutation } from '@/rtk/api/admin/studentFeedbackApis'
import { useRouter } from 'next/navigation'


type ApiFeedback = {
    id: string
    week_number?: number | null
    type: string
    title?: string | null
    description?: string | null
    status: string
    file_url?: string | null
    created_at: string
    updated_at: string
    course?: { id: string; title: string }
    user?: { id: string; name: string; email?: string; avatar?: string; avatar_url?: string }
}

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
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { search, type, page, limit } = useAppSelector(s => s.studentFeedback)

    const [searchInput, setSearchInput] = useState<string>(search)
    const debouncedSearch = useDebounce(searchInput, 400)

    const { data, isFetching } = useGetAllStudentFeedbackQuery({ page, limit, search, type })
    const [rejectFeedback, { isLoading: isRejecting }] = useDeleteStudentFeedbackMutation()

    const feedbacks: ApiFeedback[] = data?.data?.feedbacks ?? []

    useEffect(() => {
        if (debouncedSearch !== search) {
            dispatch(setSearch(debouncedSearch))
            if (page !== 1) dispatch(setPage(1))
        }
    }, [debouncedSearch, search, dispatch, page])

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<ApiFeedback | null>(null)

    const handleDelete = (item: ApiFeedback) => {
        setItemToDelete(item)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!itemToDelete) return
        try {
            await rejectFeedback(itemToDelete.id).unwrap()
        } catch (e) {
        } finally {
            setItemToDelete(null)
        }
    }

    const formatDate = (iso: string) => {
        const d = new Date(iso)
        if (isNaN(d.getTime())) return ''
        return d.toLocaleDateString()
    }

    const formatTime = (iso: string) => {
        const hhmmMatch = iso.match(/T(\d{2}):(\d{2})/)
        if (!hhmmMatch) return ''
        const hours24 = parseInt(hhmmMatch[1], 10)
        const minutes = hhmmMatch[2]
        const period = hours24 >= 12 ? 'PM' : 'AM'
        const hours12 = ((hours24 % 12) || 12).toString()
        return `${hours12}:${minutes} ${period}`
    }

    const handleView = (item: ApiFeedback) => {
        router.push(`/admin/student-feedback/${item.id}`)
    }

    const toTitle = (v?: string) => {
        if (!v) return ''
        if (v === 'course_review') return 'Course review'
        if (v === 'weekly_review') return 'Weekly review'
        return v.replace(/_/g, ' ')
    }

    const transformedData = (feedbacks || []).map(item => ({
        ...item,
        studentName: (
            <div className="flex items-center gap-3">
                {item.user?.avatar_url ? (
                    <Image
                        src={item.user.avatar_url}
                        alt={item.user?.name || 'User'}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {(item.user?.name || 'S').charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-medium capitalize">{item.user?.name || 'Unknown'}</span>
                    {item.user?.email && <span className="text-xs text-gray-500">{item.user.email}</span>}
                </div>
            </div>
        ),
        feedbackType: (
            <span className={`px-3 py-1 text-sm rounded  ${item.type === 'course_review'
                ? 'bg-[#EFCEFF] text-[#AD0AFD]'
                : 'bg-gray-200 text-gray-700'
                }`}>
                {toTitle(item.type)}
            </span>
        ),
        time: formatTime(item.created_at),
        date: formatDate(item.created_at),
        status: (
            <span className={`px-3 py-1 text-sm rounded  ${((item.status === 'reject') ? 'rejected' : item.status) === 'approved'
                ? 'bg-[#E7F7EF] text-[#27A376]'
                : 'bg-[#FEF4CF] text-[#BB960B]'
                }`}>
                {(((item.status === 'reject') ? 'rejected' : item.status) || '').replace(/^./, c => c.toUpperCase())}
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
                    disabled={isRejecting}
                    className="w-8 h-8 p-0 cursor-pointer bg-[#FF5757] hover:bg-[#FF5757]/80 text-white rounded-lg"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        )
    }))

    const pagination = data?.data?.pagination

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#1D1F2C]">
                    Student Feedback List
                </h2>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search Student"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 w-48"
                        />
                    </div>

                    <Select value={type || 'all'} onValueChange={(v) => { dispatch(setType(v === 'all' ? '' : v)); if (page !== 1) dispatch(setPage(1)) }}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Feedback Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem className='cursor-pointer' value="course_review">Course review</SelectItem>
                            <SelectItem className='cursor-pointer' value="weekly_review">Weekly review</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <ReusableTable
                    headers={tableHeaders}
                    data={transformedData}
                    showPagination={true}
                    // server-controlled pagination
                    serverControlled={true}
                    currentPage={pagination?.page ?? page}
                    totalPages={pagination?.totalPages}
                    totalItems={pagination?.total}
                    itemsPerPage={pagination?.limit ?? limit}
                    itemsPerPageOptions={[5, 10, 15, 20]}
                    onPageChange={(newPage) => dispatch(setPage(newPage))}
                    onItemsPerPageChange={(newLimit) => { dispatch(setLimit(newLimit)); dispatch(setPage(1)) }}
                    isLoading={isFetching}
                />
            </div>

            {(!feedbacks || feedbacks.length === 0) && !isFetching && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No feedback found</p>
                </div>
            )}

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Feedback"
                description={`Are you sure you want to delete this feedback? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                confirmVariant="destructive"
            />
        </div>
    )
}
