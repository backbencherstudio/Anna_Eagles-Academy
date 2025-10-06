'use client'

import React, { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetSingleStudentQuery, useRestrictStudentMutation } from '@/rtk/api/admin/studentManagementApis'
import { ArrowLeft, Mail, Calendar, BookOpen, CheckCircle, Clock, Award, User, GraduationCap, Download, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'

export default function StudentDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const studentId = params.id as string
    const [isNavigating, setIsNavigating] = useState(false)
    const [isRestricting, setIsRestricting] = useState(false)
    const [localStudentStatus, setLocalStudentStatus] = useState<number | null>(null)
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean
        action: 'restrict' | 'unrestrict' | null
    }>({
        open: false,
        action: null
    })

    const { data, isFetching, error } = useGetSingleStudentQuery(studentId)
    const [restrictStudent] = useRestrictStudentMutation()
    const student = data?.data

    const handleSendEmail = () => {
        setIsNavigating(true)
        router.push(`/admin/email-notification/${studentId}`)
    }

    const handleRestrictStudent = useCallback(() => {
        if (!student) return

        const currentStatus = localStudentStatus !== null ? localStudentStatus : student.status
        const action = currentStatus === 1 ? 'restrict' : 'unrestrict'
        setConfirmDialog({
            open: true,
            action
        })
    }, [student, localStudentStatus])

    const handleConfirmRestrictStudent = useCallback(async () => {
        if (!student) return

        setIsRestricting(true)
        try {
            const currentStatus = localStudentStatus !== null ? localStudentStatus : student.status
            const newStatus = currentStatus === 1 ? 0 : 1

            // Optimistic update
            setLocalStudentStatus(newStatus)

            await restrictStudent({ student_id: student.id, status: newStatus }).unwrap()

            const action = newStatus === 0 ? 'restricted' : 'activated'
            toast.success(`Student ${student.name} has been ${action} successfully!`)
        } catch (error) {
            // Revert optimistic update on error
            setLocalStudentStatus(student.status)
            toast.error('Failed to update student status')
        } finally {
            setIsRestricting(false)
        }
    }, [student, restrictStudent, localStudentStatus])

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="w-full lg:w-1/3">
                                    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6"></div>
                                    <div className="space-y-4">
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !student) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Student Not Found</h2>
                    <p className="text-gray-600 mb-6">The requested student could not be found.</p>
                    <Button onClick={() => router.back()} className="bg-[#0F2598] hover:bg-[#0F2598]/90 w-full">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <div className="bg-gray-50">
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Student Profile</h1>
                            <p className="text-sm text-gray-600">Detailed information and progress tracking</p>
                        </div>
                    </div>

                    {/* Student Profile Card */}
                    <div className="bg-gradient-to-r from-[#0F2598] to-[#1e40af] rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
                            {/* Avatar Section */}
                            <div className="text-center lg:text-left">
                                <div className="relative mb-4 sm:mb-6 flex justify-center lg:justify-start">
                                    {student.avatar_url ? (
                                        <Image
                                            width={120}
                                            height={120}
                                            src={student.avatar_url}
                                            alt={student.name}
                                            className="w-24 h-24 sm:w-28 sm:h-28 lg:w-30 lg:h-30 rounded-full object-cover border-4 border-white/20 shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-30 lg:h-30 bg-white/20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl lg:text-3xl font-bold border-4 border-white/20 shadow-lg">
                                            {student.name ? student.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2 capitalize">{student.name}</h2>
                                <div className="space-y-2 text-white/90 text-sm sm:text-base">
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span className="break-all">{student.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Member since {formatDate(student.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4 sm:gap-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-bold mb-1">{student.enrollments?.length || 0}</div>
                                    <div className="text-xs sm:text-sm text-white/80">Courses Enrolled</div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-bold mb-1">{student.assignment_submissions_count}</div>
                                    <div className="text-xs sm:text-sm text-white/80">Assignments</div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                        <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-bold mb-1">{student.quiz_submissions_count}</div>
                                    <div className="text-xs sm:text-sm text-white/80">Quiz Attempts</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Enrollments */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0F2598]/10 rounded-full flex items-center justify-center">
                                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-[#0F2598]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Course Enrollments</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">Track progress and completion status</p>
                            </div>
                        </div>
                    </div>

                    {student.enrollments && student.enrollments.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                            {student.enrollments.map((enrollment: any) => (
                                <Card key={enrollment.id} className="border-l-4 border-l-[#0F2598] hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                                            <div className="flex-1">
                                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                                                    {enrollment.series?.title}
                                                </h4>
                                                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                                        <span>Progress: {enrollment.progress_percentage}%</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                                        <span>Completion: {enrollment.completion_percentage}%</span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-[#0F2598] to-[#1e40af] h-2 sm:h-3 rounded-full transition-all duration-500"
                                                        style={{ width: `${enrollment.progress_percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 mt-3 sm:mt-0">
                                                <div className={`px-3 w-fit rounded-md py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border ${getStatusColor(enrollment.status)}`}>
                                                    {enrollment.status}
                                                </div>
                                                <div className="text-center sm:text-right">
                                                    <div className="text-xl sm:text-2xl font-bold text-[#0F2598]">{enrollment.progress_percentage}%</div>
                                                    <div className="text-xs text-gray-500">Complete</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="h-8 w-8 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-600 mb-2">No Course Enrollments</h4>
                            <p className="text-gray-500">This student hasn't enrolled in any courses yet.</p>
                        </div>
                    )}
                </div>

                {/* Student Information & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Student Information */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0F2598]/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#0F2598]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Student Information</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">Personal details and account info</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">Full Name</label>
                                    <p className="text-base sm:text-lg text-gray-800 capitalize">{student.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">Email Address</label>
                                    <p className="text-base sm:text-lg text-gray-800 break-all">{student.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">Username</label>
                                    <p className="text-base sm:text-lg text-gray-800">{student.username || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">Member Since</label>
                                    <p className="text-base sm:text-lg text-gray-800">{formatDate(student.created_at)}</p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">Student ID</label>
                                    <p className="text-xs sm:text-sm text-gray-600 font-mono break-all bg-gray-50 p-2 rounded">{student.id}</p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">Account Status</label>
                                    <div className={`px-2 py-1 w-fit rounded-md sm:px-3 text-xs sm:text-sm ${(localStudentStatus !== null ? localStudentStatus : student.status) === 1
                                            ? 'bg-green-100 text-green-800 border-green-200'
                                            : 'bg-red-100 text-red-800 border-red-200'
                                        }`}>
                                        {(localStudentStatus !== null ? localStudentStatus : student.status) === 1 ? 'Active' : 'Restricted'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0F2598]/10 rounded-full flex items-center justify-center">
                                <Download className="h-4 w-4 sm:h-5 sm:w-5 text-[#0F2598]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">Manage student account</p>
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <Button
                                variant="outline"
                                className={`w-full text-sm cursor-pointer ${(localStudentStatus !== null ? localStudentStatus : student?.status) === 1
                                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                                        : 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                                    }`}
                                onClick={handleRestrictStudent}
                                disabled={isRestricting}
                            >
                                {isRestricting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-4 w-4 mr-2" />
                                        {(localStudentStatus !== null ? localStudentStatus : student?.status) === 1 ? 'Restrict Account' : 'Unrestrict Account'}
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full text-sm cursor-pointer"
                                onClick={handleSendEmail}
                                disabled={isNavigating}
                            >
                                {isNavigating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Email
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
                title={confirmDialog.action === 'restrict' ? 'Restrict Student' : 'Unrestrict Student'}
                description={
                    confirmDialog.action === 'restrict'
                        ? `Are you sure you want to restrict ${student?.name}? They will not be able to access the platform.`
                        : `Are you sure you want to unrestrict ${student?.name}? They will regain access to the platform.`
                }
                confirmText={confirmDialog.action === 'restrict' ? 'Restrict' : 'Unrestrict'}
                cancelText="Cancel"
                onConfirm={handleConfirmRestrictStudent}
                confirmVariant="destructive"
                isLoading={isRestricting}
            />
        </div>
    )
}