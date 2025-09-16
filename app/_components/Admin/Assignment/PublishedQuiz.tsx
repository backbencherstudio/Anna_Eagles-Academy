import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

interface PublishedQuizItem {
    id: string
    title: string
    dueDate: string
}

const publishedQuizzes: PublishedQuizItem[] = [
    {
        id: '1',
        title: 'Pre-Lab Exercise: Recording Chemical Reaction Data',
        dueDate: 'Due in 1 hours'
    },
    {
        id: '2',
        title: 'Weekly Test: The Role of Catalysts in Chemical Reactions',
        dueDate: 'Due in 1 days'
    },
    {
        id: '3',
        title: 'Lab Completion Quiz: Chemical Reactions',
        dueDate: 'Due in 5 days'
    }
]

export default function PublishedQuiz() {
    return (
        <div>
            <h2 className="text-[#1D1F2C] text-lg font-medium mb-4">Published Quiz</h2>
            <div className="space-y-3">
                {publishedQuizzes.map((quiz) => (
                    <Card
                        key={quiz.id}
                        className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 group">
                                {/* Orange square indicator */}
                                <div className="w-4 h-4 bg-[#FC4B0E] rounded flex-shrink-0"></div>

                                <div className="flex-1 min-w-0">
                                    {/* Quiz title */}
                                    <h3 className="font-semibold text-[#1D1F2C] text-sm  mb-1 line-clamp-2">
                                        {quiz.title}
                                    </h3>

                                    {/* Due date */}
                                    <p className="text-sm text-[#4A4C56]">
                                        {quiz.dueDate}
                                    </p>
                                </div>
                                {/* Arrow icon */}
                                <ArrowRight className="w-4 h-4 group-hover:text-[#0F2598] group-hover:-rotate-45 transition-all duration-100 text-[#4A4C56] flex-shrink-0" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
