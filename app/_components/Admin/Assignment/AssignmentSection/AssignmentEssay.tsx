'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/rtk'
import { useGetAllAssignmentsQuery } from '@/rtk/api/admin/assignmentApis'
import { setDashboardData, setLoading } from '@/rtk/slices/assignmentManagementSlice'
import PublishedAssignment from './PublishedAssignment'
import UnpublishedAssignment from './UnpublishedAssignment'
import AssignmentsSubmission from './AssignmentsSubmission'

export default function AssignmentEssay() {
    const dispatch = useDispatch()
    const router = useRouter()

    // Redux state
    const {
        assignmentsWithSubmissions,
        publishedAssignments,
        unpublishedAssignments,
        dashboardData,
        isLoading
    } = useSelector((state: RootState) => state.assignmentManagement)

    // API hook
    const { data: assignmentsData, isLoading: isApiLoading, error } = useGetAllAssignmentsQuery({})

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
                    />

                    {/* Unpublished Assignment Section */}
                    <UnpublishedAssignment
                        assignments={unpublishedAssignments}
                        onCardClick={handleCardClick}
                    />
                </div>
            </div>

            {/* Empty state */}
            {!hasAnyAssignments && !isLoading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No assignments found</p>
                    <Button
                        onClick={handleCreateAssignment}
                        className="mt-4 bg-[#F1C27D] hover:bg-[#F1C27D]/80"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create your first assignment
                    </Button>
                </div>
            )}
        </>
    )
}
