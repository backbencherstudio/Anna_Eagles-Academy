import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Edit } from 'lucide-react'
import { parseISO, differenceInHours, differenceInDays } from 'date-fns'
import { useRouter } from 'next/navigation'

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

    const handleEditQuiz = (quizId: string) => {
        router.push(`/admin/create-quiz/${quizId}`)
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
                            className="hover:shadow transition-shadow duration-200 cursor-pointer border border-gray-200"
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
                                    {/* Edit icon */}
                                    <Edit 
                                        className="w-4 h-4 group-hover:text-[#0F2598] transition-all duration-100 text-[#4A4C56] flex-shrink-0 cursor-pointer" 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditQuiz(quiz.id)
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}