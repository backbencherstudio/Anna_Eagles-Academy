'use client'

import React from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface Question {
    id: string
    question: string
    options: string[]
    correctAnswer: string
    points: number
}

interface QuizSidebarProps {
    questions: Question[]
    selectedQuestionId: string
    onSelectQuestion: (questionId: string) => void
    onDeleteQuestion: (questionId: string) => void
    onDragEnd: (result: any) => void
    onAddNewQuestion: () => void
}

// Drag and drop handler function
export const handleDragEnd = (result: any, questions: Question[], setQuestions: (questions: Question[]) => void) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setQuestions(items)
}

export default function QuizSidebar({
    questions,
    selectedQuestionId,
    onSelectQuestion,
    onDeleteQuestion,
    onDragEnd,
    onAddNewQuestion
}: QuizSidebarProps) {
    const truncateText = (text: string, maxLength: number = 20) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    return (
        <div className="w-full lg:w-80 bg-[#FDFCFC] rounded-lg order-2 lg:order-1 border border-[#EEE]">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Question ({questions.length})</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full w-8 h-8 p-0"
                        onClick={onAddNewQuestion}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="p-4 space-y-3 max-h-96 lg:max-h-none overflow-y-auto"
                        >
                            {questions.map((question, index) => (
                                <Draggable key={question.id} draggableId={question.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                                        >
                                            <Card
                                                className={`cursor-pointer transition-colors ${
                                                    selectedQuestionId === question.id ? 'border-orange-500 bg-orange-50' : ''
                                                }`}
                                                onClick={() => onSelectQuestion(question.id)}
                                            >
                                                <CardContent className="p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2 flex-1">
                                                            <div {...provided.dragHandleProps}>
                                                                <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    Question {index + 1}
                                                                </p>
                                                                <p
                                                                    className="text-sm text-gray-700 truncate cursor-help"
                                                                    title={question.question}
                                                                >
                                                                    {truncateText(question.question)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                onDeleteQuestion(question.id)
                                                            }}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}