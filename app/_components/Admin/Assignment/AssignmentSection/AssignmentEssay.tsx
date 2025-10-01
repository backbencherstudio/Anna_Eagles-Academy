'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/rtk'
import { useGetAllAssignmentsQuery, useDeleteAssignmentMutation } from '@/rtk/api/admin/assignmentApis'
import { setDashboardData, setLoading } from '@/rtk/slices/admin/assignmentManagementSlice'
import PublishedAssignment from './PublishedAssignment'
import UnpublishedAssignment from './UnpublishedAssignment'
import AssignmentsSubmission from './AssignmentsSubmission'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import toast from 'react-hot-toast'

export default function AssignmentEssay() {
    const dispatch = useDispatch()
    const router = useRouter()

    // Redux state
    const {
        assignmentsWithSubmissions,
        publishedAssignments,
        unpublishedAssignments,
        isLoading
    } = useSelector((state: RootState) => state.assignmentManagement)

    // API hook
    const { data: assignmentsData, isLoading: isApiLoading, error, refetch } = useGetAllAssignmentsQuery({})
    const [deleteAssignment, { isLoading: isDeleting }] = useDeleteAssignmentMutation()

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [assignmentToDelete, setAssignmentToDelete] = React.useState<{ id: string; title: string } | null>(null)

    // Update Redux state when API data changes
    useEffect(() => {
        if (assignmentsData?.data) {
            dispatch(setDashboardData(assignmentsData.data))
        }
        dispatch(setLoading(isApiLoading))
    }, [assignmentsData, isApiLoading, dispatch])

    const handleCreateAssignment = () => {
        router.push('/admin/create-assignment')
    }

    const handleCardClick = (assignment: any) => {
        console.log('Assignment clicked:', assignment)
    }

    const handleRequestDelete = (assignment: { id: string; title: string }) => {
        setAssignmentToDelete({ id: assignment.id, title: assignment.title })
        setDeleteDialogOpen(true)
    }

    const handleEditAssignment = (assignment: { id: string }) => {
        router.push(`/admin/create-assignment/${assignment.id}`)
    }

    const confirmDelete = async () => {
        if (!assignmentToDelete) return
        try {
            const res = await deleteAssignment(assignmentToDelete.id).unwrap()
            toast.success(res?.message || 'Assignment deleted successfully!')
            setDeleteDialogOpen(false)
            setAssignmentToDelete(null)
            await refetch()
        } catch (err: any) {
            const msg = err?.data?.message || err?.message || 'Failed to delete assignment'
            toast.error(msg)
        }
    }

    // Check if there are any assignments at all
    const hasAnyAssignments = assignmentsWithSubmissions.length > 0 || publishedAssignments.length > 0 || unpublishedAssignments.length > 0

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Assignments (Essay)</h1>
                    <Button disabled className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80">
                        <Plus className="w-4 h-4 mr-2" />
                        Create new Assignment
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardContent className="p-4">
                                <div className="w-4 h-4 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 pb-4">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Assignments (Essay)
                    </h1>
                    <Button
                        onClick={handleCreateAssignment}
                        className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Create new Assignment
                    </Button>
                </div>

                {/* Assignment Cards Grid - submissions */}
                <AssignmentsSubmission assignments={assignmentsWithSubmissions} />
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 mt-5">
                <div className='space-y-5'>
                    {/* Published Assignment Section */}
                    <PublishedAssignment
                        assignments={publishedAssignments}
                        onCardClick={handleCardClick}
                        onDeleteAssignment={handleRequestDelete}
                        onEditAssignment={handleEditAssignment}
                    />

                    {/* Unpublished Assignment Section */}
                    <UnpublishedAssignment
                        assignments={unpublishedAssignments}
                        onCardClick={handleCardClick}
                        onDeleteAssignment={handleRequestDelete}
                        onEditAssignment={handleEditAssignment}
                    />
                </div>
            </div>

        

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Assignment"
                description={`Are you sure you want to delete "${assignmentToDelete?.title || ''}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                confirmVariant="destructive"
                isLoading={isDeleting}
            />
        </>
    )
}
