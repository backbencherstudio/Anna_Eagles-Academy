import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useDeleteQuizMutation } from '@/rtk/api/quizApis'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import toast from 'react-hot-toast'

interface UnpublishedQuizItem {
    id: string
    title: string
    due_at: string
    published_at: string
    is_published: boolean
    created_at: string
    total_marks: number
}

interface UnpublishedQuizProps {
    unpublishedQuizzes: UnpublishedQuizItem[]
}

export default function UnpublishedQuiz({ unpublishedQuizzes }: UnpublishedQuizProps) {
    const router = useRouter()
    const [deleteQuiz, { isLoading: isDeleting }] = useDeleteQuizMutation()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [quizToDelete, setQuizToDelete] = useState<{ id: string; title: string } | null>(null)

    const handleEditQuiz = (quizId: string) => {
        router.push(`/admin/create-quiz/${quizId}`)
    }

    const handleDeleteQuiz = (quizId: string, quizTitle: string) => {
        setQuizToDelete({ id: quizId, title: quizTitle })
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!quizToDelete) return

        try {
            const response = await deleteQuiz(quizToDelete.id).unwrap()
            toast.success(response.message || 'Quiz deleted successfully!')
            setDeleteDialogOpen(false)
            setQuizToDelete(null)
        } catch (error: any) {
            const errorMessage = error?.data?.message || error?.message || 'Failed to delete quiz'
            toast.error(errorMessage)
        }
    }

    const formatScheduledDate = (publishedAt: string) => {
        try {
            const date = parseISO(publishedAt)
            // Extract the time components directly from the ISO string to avoid timezone conversion
            const year = date.getUTCFullYear()
            const month = date.getUTCMonth()
            const day = date.getUTCDate()
            const hours = date.getUTCHours()
            const minutes = date.getUTCMinutes()
            
            // Create a new date object with the UTC components
            const utcDate = new Date(year, month, day, hours, minutes)
            return `Scheduled for: ${format(utcDate, 'd, MMMM - hh:mm a')}`
        } catch (error) {
            return 'Invalid date'
        }
    }

    return (
        <div>
            <h2 className="text-[#1D1F2C] text-lg font-medium mb-4">Unpublished Quiz ({unpublishedQuizzes.length})</h2>
            <div className="space-y-3">
                {unpublishedQuizzes.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No unpublished quizzes found</p>
                    </div>
                ) : (
                    unpublishedQuizzes.map((quiz: UnpublishedQuizItem) => (
                        <Card
                            key={quiz.id}
                            className="border border-gray-200"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 group">
                                    {/* Orange square indicator */}
                                    <div className="w-4 h-4 bg-[#FC4B0E] rounded flex-shrink-0"></div>

                                    <div className="flex-1 min-w-0">
                                        {/* Quiz title */}
                                        <h3 className="font-semibold text-[#1D1F2C] text-sm mb-1 line-clamp-2">
                                            {quiz.title}
                                        </h3>

                                        {/* Scheduled date */}
                                        <p className="text-sm text-[#4A4C56]">
                                            {formatScheduledDate(quiz.published_at)}
                                        </p>
                                    </div>

                                    {/* Action icons */}
                                    <div className="flex items-center gap-2">
                                        <Edit 
                                            className="w-4 h-4 group-hover:text-[#0F2598] transition-all duration-100 text-[#4A4C56] flex-shrink-0 cursor-pointer" 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEditQuiz(quiz.id)
                                            }}
                                        />
                                        <Trash2 
                                            className="w-4 h-4 text-red-500 transition-all duration-100  flex-shrink-0 cursor-pointer" 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteQuiz(quiz.id, quiz.title)
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Quiz"
                description={`Are you sure you want to delete "${quizToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                confirmVariant="destructive"
                isLoading={isDeleting}
            />
        </div>
    )
}
