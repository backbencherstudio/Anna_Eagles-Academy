import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Edit } from 'lucide-react'
import { useGetAllDataQuizQuery } from '@/rtk/api/quizApis'
import { format, parseISO } from 'date-fns'
import { useRouter } from 'next/navigation'

interface UnpublishedQuizItem {
    id: string
    title: string
    due_at: string
    published_at: string
    is_published: boolean
    created_at: string
    total_marks: number
}

export default function UnpublishedQuiz() {
    const { data: quizData, isLoading, isError } = useGetAllDataQuizQuery({})
    const router = useRouter()

    const handleEditQuiz = (quizId: string) => {
        router.push(`/admin/create-quiz/${quizId}`)
    }

    const formatScheduledDate = (publishedAt: string) => {
        try {
            const date = parseISO(publishedAt)
            return `Scheduled for: ${format(date, 'd, MMMM - hh:mm a')}`
        } catch (error) {
            return 'Invalid date'
        }
    }

    if (isLoading) {
        return (
            <div>
                <h2 className="text-[#1D1F2C] text-lg font-medium mb-4">Unpublished Quiz</h2>
                <div className="space-y-3">
                    {[...Array(2)].map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div>
                <h2 className="text-[#1D1F2C] text-lg font-medium mb-4">Unpublished Quiz</h2>
                <div className="text-center py-8">
                    <p className="text-red-500">Failed to load unpublished quizzes</p>
                </div>
            </div>
        )
    }

    const unpublishedQuizzes = quizData?.data?.unpublished_quizzes || []

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

                                        {/* Scheduled date */}
                                        <p className="text-sm text-[#4A4C56]">
                                            {formatScheduledDate(quiz.published_at)}
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
