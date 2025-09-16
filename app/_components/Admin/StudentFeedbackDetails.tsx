'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'

interface FeedbackDetails {
    id: string
    studentName: string
    courseTag: string
    title: string
    description: string
    time: string
    date: string
    status: 'Pending' | 'Approved'
    thumbnail?: string
}

interface StudentFeedbackDetailsProps {
    feedbackId: string
}

// Sample data - in real app, this would be fetched based on feedbackId
const sampleFeedbackDetails: FeedbackDetails = {
    id: '1',
    studentName: 'Sarah Johnson',
    courseTag: 'The Kingdom Principles',
    title: 'Leeming Biblical Leadership',
    description: 'The leadership course transformed my outlook, boosting my abilities and self-assurance in leading others effectively and confidently.',
    time: '06:00 AM',
    date: 'Jan 10, 2025',
    status: 'Pending',
    thumbnail: ''
}

export default function StudentFeedbackDetails({ feedbackId }: StudentFeedbackDetailsProps) {
    const [feedback, setFeedback] = useState<FeedbackDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchFeedbackDetails = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                setFeedback(sampleFeedbackDetails)
            } catch (error) {
                console.error('Error fetching feedback details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFeedbackDetails()
    }, [feedbackId])

    const handleApprove = () => {
        if (feedback) {
            setFeedback({ ...feedback, status: 'Approved' })
            console.log('Feedback approved:', feedback.id)
        }
    }

    const handleDelete = () => {
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        console.log('Feedback deleted:', feedback?.id)
        // Navigate back to feedback list
        router.push('/student-feedback')
    }

    if (loading) {
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

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-100">
            {/* Video/Media Section */}
            <div className="relative mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-teal-200 to-green-300 rounded-lg flex items-center justify-center">
                    {feedback.thumbnail ? (
                        <img
                            src={feedback.thumbnail}
                            alt={feedback.title}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <div className="flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Feedback Content */}
            <div className="space-y-4">
                {/* Student Info */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {feedback.studentName.split(' ')[0].charAt(0)}
                    </div>
                    <h3 className="font-semibold">{feedback.studentName}</h3>
                </div>
                <p className="inline-flex items-center rounded-full bg-[#0F25981A] border border-[#0F25981A] text-[#0F2598] text-xs font-semibold px-3 py-1">
                    {feedback.courseTag}
                </p>

                {/* Feedback Title */}
                <h2 className="text-xl font-bold text-gray-900">{feedback.title}</h2>

                {/* Feedback Description */}
                <p className="text-[#4A4C56] leading-relaxed">{feedback.description}</p>

                {/* Time and Date */}
                <div className="flex items-center justify-between text-sm text-[#A5A5AB]">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{feedback.time}</span>
                    </div>
                    <span>{feedback.date}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                    onClick={handleApprove}
                    className="bg-[#27A376] cursor-pointer hover:bg-[#27A376]/80 text-white px-6 py-2 rounded-lg font-medium"
                >
                    Approved
                </Button>
                <Button
                    onClick={handleDelete}
                    className="bg-[#FF5757] cursor-pointer hover:bg-[#FF5757]/80 text-white px-6 py-2 rounded-lg font-medium"
                >
                    Deletion Review
                </Button>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Feedback"
                description={`You are deleting Course review ${feedback.studentName}?`}
                confirmText="Deletion Review "
                cancelText="Cancel"
                onConfirm={confirmDelete}
                confirmVariant="destructive"
            />
        </div>
    )
}
