import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2 } from 'lucide-react'
import { parseISO, differenceInHours, differenceInDays } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useDeleteQuizMutation } from '@/rtk/api/quizApis'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import toast from 'react-hot-toast'

interface PublishedQuizItem {
    id: string
    title: string
    due_at: string
    published_at: string
    is_published: boolean
    created_at: string
    total_marks: number
    remaining_time: number
}

interface PublishedQuizProps {
    publishedQuizzes: PublishedQuizItem[]
}

export default function PublishedQuiz({ publishedQuizzes }: PublishedQuizProps) {
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

    const formatDueDate = (dueAt: string) => {
        try {
            const dueDate = parseISO(dueAt)
            const now = new Date()
            
            // Create UTC dates for accurate comparison
            const dueDateUTC = new Date(Date.UTC(
                dueDate.getUTCFullYear(),
                dueDate.getUTCMonth(),
                dueDate.getUTCDate(),
                dueDate.getUTCHours(),
                dueDate.getUTCMinutes(),
                dueDate.getUTCSeconds()
            ))
            
            const nowUTC = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
            ))
            
            const hoursLeft = differenceInHours(dueDateUTC, nowUTC)
            const daysLeft = differenceInDays(dueDateUTC, nowUTC)

            if (hoursLeft < 0) {
                return 'Expired'
            } else if (hoursLeft < 24) {
                return `Due in ${hoursLeft} hours`
            } else {
                return `Due in ${daysLeft} days`
            }
        } catch (error) {
            return 'Invalid date'
        }
    }

    return (
        <div>
            <h2 className="text-[#1D1F2C] text-lg font-medium mb-4">Published Quiz ({publishedQuizzes.length})</h2>
            <div className="space-y-3">
                {publishedQuizzes.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No published quizzes found</p>
                    </div>
                ) : (
                    publishedQuizzes.map((quiz: PublishedQuizItem) => (
                        <Card
                            key={quiz.id}
                            className=" border border-gray-200"
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

                                        {/* Due date */}
                                        <p className="text-sm text-[#4A4C56]">
                                            {formatDueDate(quiz.due_at)}
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