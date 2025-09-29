'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'

interface AdditionalQuestion {
    id: string
    assignmentTitle: string
    points: number
}

interface AnotherQuestionProps {
    additionalQuestions: AdditionalQuestion[]
    onAddQuestion: (question: AdditionalQuestion) => void
    onUpdateQuestion: (id: string, question: AdditionalQuestion) => void
    onRemoveQuestion: (id: string) => void
}

export default function AnotherQuestion({
    additionalQuestions,
    onAddQuestion,
    onUpdateQuestion,
    onRemoveQuestion
}: AnotherQuestionProps) {

    const addAdditionalQuestion = () => {
        const newQuestion: AdditionalQuestion = {
            id: Date.now().toString(),
            assignmentTitle: '',
            points: 20
        }
        onAddQuestion(newQuestion)
    }

    const updateAdditionalQuestion = (id: string, field: keyof AdditionalQuestion, value: string | number) => {
        const updatedQuestion = additionalQuestions.find(q => q.id === id)
        if (updatedQuestion) {
            const newQuestion = { ...updatedQuestion, [field]: value }
            onUpdateQuestion(id, newQuestion)
        }
    }

    const removeAdditionalQuestion = (id: string) => {
        onRemoveQuestion(id)
    }
    return (
        <>
            {/* Additional Questions */}
            {additionalQuestions.length > 0 && (
                <div className="space-y-4 pt-4">
                    {additionalQuestions.map((question, index) => (
                        <div key={question.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-700">Question {index + 2}</h4>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 cursor-pointer text-red-500 hover:text-red-700"
                                    onClick={() => removeAdditionalQuestion(question.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            {/* Question */}
                            <div className="space-y-2">
                                <Label htmlFor={`additional-title-${question.id}`}>Question <span className='text-red-500'>*</span></Label>
                                <Textarea
                                    id={`additional-title-${question.id}`}
                                    placeholder="Enter your question here..."
                                    value={question.assignmentTitle}
                                    onChange={(e) => updateAdditionalQuestion(question.id, 'assignmentTitle', e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>

                            {/* Point Selection */}
                            <div className="flex items-center space-x-4 justify-end">
                                <Label htmlFor={`additional-points-${question.id}`} className="text-sm">Point <span className='text-red-500'>*</span></Label>
                                <Input
                                    id={`additional-points-${question.id}`}
                                    type="number"
                                    min="1"
                                    max="100"
                                    placeholder="Enter points"
                                    value={question.points}
                                    onChange={(e) => updateAdditionalQuestion(question.id, 'points', parseInt(e.target.value) || 0)}
                                    className="w-32"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Another Question Button */}
            <div className="mt-6">
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={addAdditionalQuestion}
                >
                    <div className="flex justify-center items-center gap-2 py-2">
                        <Plus className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Add another question</span>
                    </div>
                </div>
            </div>
        </>
    )
}