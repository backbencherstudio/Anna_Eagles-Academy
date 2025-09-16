'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, GripVertical, } from 'lucide-react'
import QuizCreateDate from '@/components/Resuable/QuizCreateDate'

interface Essay {
    id: string
    title: string
    points: number
    submissionDeadline: Date
}

interface EssayFormData {
    selectedSeries: string
    selectedCourses: string
    assignmentTitle: string
    points: number
    submissionDeadline: Date
}

interface AdditionalQuestion {
    id: string
    assignmentTitle: string
    points: number
}

export default function CreateEssayAssignment() {
    const [essays, setEssays] = useState<Essay[]>([])
    const [selectedEssayId, setSelectedEssayId] = useState<string>('')
    const [additionalQuestions, setAdditionalQuestions] = useState<AdditionalQuestion[]>([])

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
        reset,
        watch,
        setValue,
        getValues,
        trigger,
        setError,
        clearErrors
    } = useForm<EssayFormData>({
        defaultValues: {
            selectedSeries: '',
            selectedCourses: '',
            assignmentTitle: '',
            points: 20,
            submissionDeadline: new Date()
        },
        mode: 'onSubmit'
    })

    const watchedTitle = watch('assignmentTitle')

    const addEssay = handleSubmit((data) => {
        // console.log('Add Essay clicked!')
        // console.log('Form data:', data)

        const essaysToAdd: Essay[] = []

        // Add main essay if it has a title
        if (data.assignmentTitle.trim()) {
            const mainEssay: Essay = {
                id: Date.now().toString(),
                title: data.assignmentTitle,
                points: data.points,
                submissionDeadline: data.submissionDeadline
            }
            essaysToAdd.push(mainEssay)
        }

        // Add all additional essays
        additionalQuestions.forEach((question, index) => {
            if (question.assignmentTitle.trim()) {
                const additionalEssay: Essay = {
                    id: (Date.now() + index + 1).toString(),
                    title: question.assignmentTitle,
                    points: question.points,
                    submissionDeadline: data.submissionDeadline
                }
                essaysToAdd.push(additionalEssay)
            }
        })

        // Add all essays to the list
        if (essaysToAdd.length > 0) {
            setEssays(prev => [...prev, ...essaysToAdd])

            // Reset main form
            reset({
                selectedSeries: getValues('selectedSeries'),
                selectedCourses: getValues('selectedCourses'),
                assignmentTitle: '',
                points: 20,
                submissionDeadline: getValues('submissionDeadline')
            })

            // Clear additional questions
            setAdditionalQuestions([])

            setSelectedEssayId('')
            clearErrors()
        } else {

        }
    }, (errors) => {

    })

    const selectEssay = (essayId: string) => {
        const essay = essays.find(e => e.id === essayId)
        if (essay) {
            setValue('assignmentTitle', essay.title)
            setValue('points', essay.points)
            setValue('submissionDeadline', essay.submissionDeadline)
            setSelectedEssayId(essayId)
        }
    }

    const deleteEssay = (essayId: string) => {
        setEssays(prev => prev.filter(e => e.id !== essayId))
        if (selectedEssayId === essayId) {
            reset({
                selectedSeries: getValues('selectedSeries'),
                selectedCourses: getValues('selectedCourses'),
                assignmentTitle: '',
                points: 20,
                submissionDeadline: getValues('submissionDeadline')
            })
            setSelectedEssayId('')
        }
    }

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const items = Array.from(essays)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setEssays(items)
    }

    const addAdditionalQuestion = () => {
        const newQuestion: AdditionalQuestion = {
            id: Date.now().toString(),
            assignmentTitle: '',
            points: 20
        }
        setAdditionalQuestions(prev => [...prev, newQuestion])
    }

    const updateAdditionalQuestion = (id: string, field: keyof AdditionalQuestion, value: string | number) => {
        setAdditionalQuestions(prev =>
            prev.map(q => q.id === id ? { ...q, [field]: value } : q)
        )
    }

    const removeAdditionalQuestion = (id: string) => {
        setAdditionalQuestions(prev => prev.filter(q => q.id !== id))
    }

    const truncateText = (text: string, maxLength: number = 20) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const handlePublish = async () => {
        if (essays.length === 0) {
            setError('assignmentTitle', {
                type: 'manual',
                message: 'Please add at least one essay before publishing'
            })
        }
    }

    return (
        <div className="bg-white p-5 rounded-xl">
            {/* Header */}
            <QuizCreateDate
                onPublish={handlePublish}
                publishButtonText="+ Publish"
                publishButtonDisabled={false}
            />

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Left Sidebar - Question Management */}
                <div className="w-full lg:w-80 bg-[#FDFCFC] rounded-lg order-2 lg:order-1 border border-[#EEE]">
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Question ({essays.length})</h3>
                            <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full w-8 h-8 p-0"
                                onClick={() => {
                                    reset({
                                        selectedSeries: getValues('selectedSeries'),
                                        selectedCourses: getValues('selectedCourses'),
                                        assignmentTitle: '',
                                        points: 20,
                                        submissionDeadline: getValues('submissionDeadline')
                                    })
                                    setSelectedEssayId('')
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

                {/* Right Side - Assignment Editor */}
                <div className="flex-1 order-1 lg:order-2">
                    {/* Main Assignment Form */}
                    <div className="bg-white rounded-xl border">
                        <h3 className="text-sm font-semibold text-center text-gray-400 mb-4 px-4 py-4 rounded-t-xl bg-[#FEF9F2]">ASSIGNMENT (ESSAY)</h3>
                        <div className="p-4 space-y-4">
                            {/* Series and Courses Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Selected Series */}
                                <div className="space-y-2">
                                    <Label htmlFor="selectedSeries" className="text-sm font-medium text-gray-700">SELECTED SERIES</Label>
                                    <Controller
                                        name="selectedSeries"
                                        control={control}
                                        rules={{
                                            required: "Please select a series"
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selected Series" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="series1">Series 1</SelectItem>
                                                    <SelectItem value="series2">Series 2</SelectItem>
                                                    <SelectItem value="series3">Series 3</SelectItem>
                                                    <SelectItem value="series4">Series 4</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.selectedSeries && isSubmitted && (
                                        <span className="text-xs text-red-500">{errors.selectedSeries.message}</span>
                                    )}
                                </div>

                                {/* Selected Courses */}
                                <div className="space-y-2">
                                    <Label htmlFor="selectedCourses" className="text-sm font-medium text-gray-700">SELECTED COURSES</Label>
                                    <Controller
                                        name="selectedCourses"
                                        control={control}
                                        rules={{
                                            required: "Please select a course"
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selected Courses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="course1">Course 1</SelectItem>
                                                    <SelectItem value="course2">Course 2</SelectItem>
                                                    <SelectItem value="course3">Course 3</SelectItem>
                                                    <SelectItem value="course4">Course 4</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.selectedCourses && isSubmitted && (
                                        <span className="text-xs text-red-500">{errors.selectedCourses.message}</span>
                                    )}
                                </div>
                            </div>
                            {/* Question 1 */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-700">Question 1</h4>
                                </div>

                                {/* Assignment Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="assignmentTitle">Assignment Title <span className='text-red-500'>*</span></Label>
                                    <Controller
                                        name="assignmentTitle"
                                        control={control}
                                        rules={{
                                            required: "Assignment title is required",
                                            minLength: { value: 5, message: "Assignment title must be at least 5 characters" }
                                        }}
                                        render={({ field }) => (
                                            <Textarea
                                                id="assignmentTitle"
                                                placeholder="Enter your assignment title here..."
                                                value={field.value}
                                                onChange={field.onChange}
                                                className={`min-h-[100px] ${errors.assignmentTitle && isSubmitted && watchedTitle.trim() ? 'border-red-500' : ''}`}
                                            />
                                        )}
                                    />
                                    {errors.assignmentTitle && isSubmitted && watchedTitle.trim() && (
                                        <span className="text-xs text-red-500">{errors.assignmentTitle.message}</span>
                                    )}
                                </div>

                                {/* Point Selection */}
                                <div className="flex items-center space-x-4 justify-end">
                                    <Label htmlFor="points" className="text-sm">Point <span className='text-red-500'>*</span></Label>
                                    <Controller
                                        name="points"
                                        control={control}
                                        rules={{
                                            required: "Points are required",
                                            min: { value: 1, message: "Points must be at least 1" },
                                            max: { value: 100, message: "Points cannot exceed 100" }
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value.toString()}
                                                onValueChange={(value) => field.onChange(parseInt(value))}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((point) => (
                                                        <SelectItem key={point} value={point.toString()}>
                                                            {point}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>

                            {/*Questions add another question */}
                            {additionalQuestions.length > 0 && (
                                <div className="space-y-4 pt-4">
                                    {additionalQuestions.map((question, index) => (
                                        <div key={question.id} className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-700">Question {index + 2}</h4>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                    onClick={() => removeAdditionalQuestion(question.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            {/* Assignment Title */}
                                            <div className="space-y-2">
                                                <Label htmlFor={`additional-title-${question.id}`}>Assignment Title <span className='text-red-500'>*</span></Label>
                                                <Textarea
                                                    id={`additional-title-${question.id}`}
                                                    placeholder="Enter your assignment title here..."
                                                    value={question.assignmentTitle}
                                                    onChange={(e) => updateAdditionalQuestion(question.id, 'assignmentTitle', e.target.value)}
                                                    className="min-h-[100px]"
                                                />
                                            </div>

                                            {/* Point Selection */}
                                            <div className="flex items-center space-x-4 justify-end">
                                                <Label htmlFor={`additional-points-${question.id}`} className="text-sm">Point <span className='text-red-500'>*</span></Label>
                                                <Select
                                                    value={question.points.toString()}
                                                    onValueChange={(value) => updateAdditionalQuestion(question.id, 'points', parseInt(value))}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((point) => (
                                                            <SelectItem key={point} value={point.toString()}>
                                                                {point}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Essay Button - At Bottom */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={addEssay}
                                    className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/90 text-white w-full sm:w-auto"
                                    disabled={false}
                                    type="button"
                                >
                                    + Add Essay
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Add Another Question Button */}
                    <div className="mt-6">
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg  text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={addAdditionalQuestion}
                        >
                            <div className="flex justify-center items-center gap-2 py-2">
                                <Plus className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-500">Add another question</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )

} 