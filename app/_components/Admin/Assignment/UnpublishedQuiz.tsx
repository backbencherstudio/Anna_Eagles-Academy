import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

interface UnpublishedQuizItem {
    id: string
    title: string
    scheduledDate: string
}

const unpublishedQuizzes: UnpublishedQuizItem[] = [
    {
        id: '1',
        title: 'Daily Task: Applying Stoichiometry to Predicting Chemical Reaction',
        scheduledDate: 'Scheduled for: 28, September - 10.00 AM'
    },
    {
        id: '2',
        title: 'Thermodynamics and Kinetics Fundamentals Quiz',
        scheduledDate: 'Scheduled for: 1, October - 08.20 AM'
    }
]

export default function UnpublishedQuiz() {
    return (
        <div>
            <h2 className="text-[#1D1F2C] text-lg font-medium mb-4">Unpublished Quiz</h2>
            <div className="space-y-3">
                {unpublishedQuizzes.map((quiz) => (
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

                                    {/* Scheduled date */}
                                    <p className="text-sm text-[#4A4C56]">
                                        {quiz.scheduledDate}
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
