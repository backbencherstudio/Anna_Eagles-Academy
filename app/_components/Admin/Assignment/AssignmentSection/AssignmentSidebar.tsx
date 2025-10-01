'use client'

import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface Essay {
    id: string
    title: string
    points: number
    submissionDeadline: string 
}

interface AssignmentSidebarProps {
    onSelectEssay: (essayId: string) => void
    onResetForm: () => void
}

export interface AssignmentSidebarRef {
    addEssay: (essay: Essay) => void
    updateEssay: (essayId: string, essay: Essay) => void
    deleteEssay: (essayId: string) => void
    getEssayById: (essayId: string) => Essay | undefined
    getAllEssays: () => Essay[]
    getEssaysCount: () => number
    clearAllEssays: () => void
}

const AssignmentSidebar = forwardRef<AssignmentSidebarRef, AssignmentSidebarProps>(({
    onSelectEssay,
    onResetForm
}, ref) => {
    const [essays, setEssays] = useState<Essay[]>([])
    const [selectedEssayId, setSelectedEssayId] = useState<string>('')

    const selectEssay = (essayId: string) => {
        const essay = essays.find(e => e.id === essayId)
        if (essay) {
            setSelectedEssayId(essayId)
            onSelectEssay(essayId)
        }
    }

    const deleteEssay = (essayId: string) => {
        setEssays(prev => prev.filter(e => e.id !== essayId))
        if (selectedEssayId === essayId) {
            setSelectedEssayId('')
            onResetForm()
        }
    }

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const items = Array.from(essays)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setEssays(items)
    }

    const addEssay = (essay: Essay) => {
        setEssays(prev => [...prev, essay])
    }

    const updateEssay = (essayId: string, updatedEssay: Essay) => {
        setEssays(prev => prev.map(essay => 
            essay.id === essayId ? updatedEssay : essay
        ))
    }

    const getEssayById = (essayId: string) => {
        return essays.find(essay => essay.id === essayId)
    }

    const getAllEssays = () => {
        return essays
    }

    const getEssaysCount = () => {
        return essays.length
    }

    const clearAllEssays = () => {
        setEssays([])
        setSelectedEssayId('')
    }

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        addEssay,
        updateEssay,
        deleteEssay,
        getEssayById,
        getAllEssays,
        getEssaysCount,
        clearAllEssays
    }))

    const truncateText = (text: string, maxLength: number = 20) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    return (
        <div className="w-full lg:w-80 bg-[#FDFCFC] rounded-lg order-2 lg:order-1 border border-[#EEE]">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Question ({essays.length})</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full w-8 h-8 p-0"
                        onClick={() => {
                            setSelectedEssayId('')
                            onResetForm()
                        }}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="essays">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="p-4 space-y-3 max-h-96 lg:max-h-none overflow-y-auto"
                        >
                            {essays.map((essay, index) => (
                                <Draggable key={essay.id} draggableId={essay.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                                        >
                                            <Card
                                                className={`cursor-pointer transition-colors ${selectedEssayId === essay.id ? 'border-orange-500 bg-orange-50' : ''}`}
                                                onClick={() => selectEssay(essay.id)}
                                            >
                                                <CardContent className="p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2 flex-1">
                                                            <div {...provided.dragHandleProps}>
                                                                <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-medium text-gray-400">
                                                                    Question {index + 1}
                                                                </p>
                                                                <p
                                                                    className="text-sm text-gray-700 truncate cursor-help"
                                                                    title={essay.title}
                                                                >
                                                                    {truncateText(essay.title)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                deleteEssay(essay.id)
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
})

AssignmentSidebar.displayName = 'AssignmentSidebar'

export default AssignmentSidebar