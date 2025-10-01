'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import Image from 'next/image'
import { useGetSingleStudentFeedbackQuery, useApproveStudentFeedbackMutation, useRejectStudentFeedbackMutation } from '@/rtk/api/admin/studentFeedbackApis'
import { useAppDispatch } from '@/rtk/hooks'
import { setSelectedStatus } from '@/rtk/slices/admin/studentFeedbackslice'
import toast from 'react-hot-toast'

interface StudentFeedbackDetailsProps {
    feedbackId: string
}

export default function StudentFeedbackDetails({ feedbackId }: StudentFeedbackDetailsProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { data, isFetching, refetch } = useGetSingleStudentFeedbackQuery(feedbackId)
    const [approveFeedback, { isLoading: isApproving }] = useApproveStudentFeedbackMutation()
    const [rejectFeedback, { isLoading: isRejecting }] = useRejectStudentFeedbackMutation()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [approveDialogOpen, setApproveDialogOpen] = useState(false)
    const [approvedLocal, setApprovedLocal] = useState(false)
    const [rejectedLocal, setRejectedLocal] = useState(false)



    const feedback = data?.data

    const isAbsoluteUrl = (url?: string | null) => !!url && /^(https?:)?\/\//.test(url)
    const getApiBase = () => {
        const base = process.env.NEXT_PUBLIC_API_ENDPOINT || ''
        if (!base) return ''
        return base.endsWith('/') ? base.slice(0, -1) : base
    }
    const avatarSrc = useMemo(() => {
        const u = feedback?.user
        if (!u) return undefined
        if (isAbsoluteUrl((u as any).avatar_url)) return (u as any).avatar_url as string
        if (u.avatar && !isAbsoluteUrl(u.avatar)) return `${getApiBase()}/public/storage/avatar/${u.avatar}`
        return isAbsoluteUrl(u.avatar) ? (u.avatar as any as string) : undefined
    }, [feedback?.user])

    const timeText = useMemo(() => {
        if (!feedback?.created_at) return ''
        const m = feedback.created_at.match(/T(\d{2}):(\d{2})/)
        if (!m) return ''
        const h24 = parseInt(m[1], 10)
        const mins = m[2]
        const period = h24 >= 12 ? 'PM' : 'AM'
        const h12 = ((h24 % 12) || 12).toString()
        return `${h12}:${mins} ${period}`
    }, [feedback?.created_at])

    const dateText = useMemo(() => {
        if (!feedback?.created_at) return ''
        const d = new Date(feedback.created_at)
        if (isNaN(d.getTime())) return ''
        return d.toLocaleDateString()
    }, [feedback?.created_at])

    const handleApprove = async () => {
        setApproveDialogOpen(true)
    }

    const confirmApprove = async () => {
        if (!feedback?.id) return
        try {
            await approveFeedback(feedback.id).unwrap()
            setApprovedLocal(true)
            setRejectedLocal(false)
            dispatch(setSelectedStatus('approved'))
            toast.success('Feedback approved')
            refetch()
        } catch (e) {
            toast.error('Failed to approve')
        } finally {
            setApproveDialogOpen(false)
        }
    }

    const handleDelete = async () => setDeleteDialogOpen(true)

    const confirmReject = async () => {
        if (!feedback?.id) return
        try {
            await rejectFeedback(feedback.id).unwrap()
            setRejectedLocal(true)
            setApprovedLocal(false)
            dispatch(setSelectedStatus('rejected'))
            toast.success('Feedback rejected')
            refetch()
        } catch (e) {
            toast.error('Failed to reject')
        } finally {
            setDeleteDialogOpen(false)
        }
    }

    if (isFetching) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-100">
                <div className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-lg mb-6"></div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 rounded w-48"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!feedback) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-100">
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Feedback not found</p>
                </div>
            </div>
        )
    }

    const normalizeStatus = (s?: string) => {
        if (!s) return 'pending'
        if (s === 'reject') return 'rejected'
        return s
    }
    const status = normalizeStatus(feedback.status)
    const isApproved = approvedLocal || status === 'approved'
    const isRejected = rejectedLocal || status === 'rejected'

    const isPdf = (url?: string | null) => !!url && /\.pdf(\?|$)/i.test(url)

    const handleback = () => {
        router.push('/admin/student-feedback')
    }

    return (

        <>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={handleback} className="flex items-center gap-2 cursor-pointer  hover:bg-[#0F2598]/5 rounded-md px-3 py-1 transition-all duration-300">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Student Feedback details</h1>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-100">
                <div className="relative mb-6">
                    <div className="w-full h-64 bg-gradient-to-br from-teal-200 to-green-300 rounded-lg flex items-center justify-center">
                        {feedback.file_download_url ? (
                            isPdf(feedback.file_download_url) ? (
                                <div className="flex flex-col items-center justify-center gap-3 text-white">
                                    <div className="text-sm opacity-90">Please open the PDF in a new tab</div>
                                    <div className="flex gap-3">
                                        <a
                                            href={feedback.file_download_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-white text-[#0F2598] px-4 py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-white/90"
                                        >
                                            Open PDF Preview
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <video
                                    key={feedback.file_download_url}
                                    className="w-full h-full rounded-lg"
                                    controls
                                    preload="metadata"
                                    crossOrigin="anonymous"
                                    playsInline
                                >
                                    <source src={feedback.file_download_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                    <a href={feedback.file_download_url} target="_blank" rel="noreferrer">Open video</a>
                                </video>
                            )
                        ) : (
                            <div className="flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <Play className="w-8 h-8 text-white ml-1" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        {avatarSrc ? (
                            <Image src={avatarSrc} alt={feedback.user?.name || 'User'} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {(feedback.user?.name || 'S').charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h3 className="font-semibold">{feedback.user?.name || 'Unknown'}</h3>
                    </div>
                    {feedback.course?.title && (
                        <p className="inline-flex items-center rounded-full bg-[#0F25981A] border border-[#0F25981A] text-[#0F2598] text-xs font-semibold px-3 py-1">
                            {feedback.course.title}
                        </p>
                    )}

                    {feedback.title && (
                        <h2 className="text-xl font-bold text-gray-900">{feedback.title}</h2>
                    )}

                    {feedback.description && (
                        <p className="text-[#4A4C56] leading-relaxed">{feedback.description}</p>
                    )}

                    <div className="flex items-center justify-between text-sm text-[#A5A5AB]">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{timeText}</span>
                        </div>
                        <span>{dateText}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button onClick={handleApprove} disabled={isApproving || isApproved} className="bg-[#27A376] cursor-pointer hover:bg-[#27A376]/80 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-60">
                        {isApproved ? 'Approved' : 'Approve'}
                    </Button>
                    <Button onClick={handleDelete} disabled={isRejecting || isRejected} className="bg-[#FF5757] cursor-pointer hover:bg-[#FF5757]/80 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-60">
                        {isRejected ? 'Rejected' : 'Reject'}
                    </Button>
                </div>

                <ConfirmDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Reject Feedback"
                    description={`You are deleting ${feedback.type?.replace(/_/g, ' ')} by ${feedback.user?.name}?`}
                    confirmText="Reject"
                    cancelText="Cancel"
                    onConfirm={confirmReject}
                    confirmVariant="destructive"
                />

                <ConfirmDialog
                    open={approveDialogOpen}
                    onOpenChange={setApproveDialogOpen}
                    title="Approve Feedback"
                    description={`Approve ${feedback.type?.replace(/_/g, ' ')} by ${feedback.user?.name}?`}
                    confirmText="Approve"
                    cancelText="Cancel"
                    onConfirm={confirmApprove}
                />
            </div>
        </>

    )
}
