'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, GripVertical, CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'


interface Question {
    id: string
    question: string
    options: string[]
    correctAnswer: string
    points: number
}

interface QuizFormData {
    submissionDeadline: Date
    question: string
    options: string[]
    correctAnswer: string
    points: number
    quizTitle?: string
}

export default function CreateQuizAssignment() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [selectedQuestionId, setSelectedQuestionId] = useState<string>('')

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted, touchedFields, isDirty },
        reset,
        watch,
        setValue,
        getValues,
        trigger,
        setError,
        clearErrors
    } = useForm<QuizFormData>({
        defaultValues: {
            submissionDeadline: new Date(),
            question: '',
            options: ['', '', ''],
            correctAnswer: '',
            points: 10
        },
        mode: 'onSubmit'
    })

    const watchedOptions = watch('options')
    const watchedQuestion = watch('question')

    const addOption = () => {
        const currentOptions = getValues('options')
        setValue('options', [...currentOptions, ''])
    }

    const updateOption = (index: number, value: string) => {
        const currentOptions = getValues('options')
        const updatedOptions = currentOptions.map((option, i) => i === index ? value : option)
        setValue('options', updatedOptions)
    }

    const removeOption = (index: number) => {
        const currentOptions = getValues('options')
        if (currentOptions.length > 2) {
            const updatedOptions = currentOptions.filter((_, i) => i !== index)
            setValue('options', updatedOptions)
            // Clear correct answer if it was the removed option
            const currentCorrectAnswer = getValues('correctAnswer')
            if (currentCorrectAnswer === String.fromCharCode(65 + index)) {
                setValue('correctAnswer', '')
            }
        }
    }

    const addQuiz = handleSubmit((data) => {
        // console.log('Add Quiz clicked!')
        // console.log('Form data:', data)
        // console.log('Form errors:', errors)
        // console.log('Watched question:', watchedQuestion)
        // console.log('Watched options:', watchedOptions)

        // Additional validation for options
        const validOptions = data.options.filter(option => option.trim().length > 0)
        // console.log('Valid options:', validOptions)

        if (validOptions.length < 2) {
            // console.log('Not enough valid options')
            setError('question', {
                type: 'manual',
                message: 'At least 2 options must be filled'
            })
            return
        }

        if (data.question.trim() && data.correctAnswer) {
            const newQuestion: Question = {
                id: Date.now().toString(),
                question: data.question,
                options: data.options,
                correctAnswer: data.correctAnswer,
                points: data.points
            }

            setQuestions(prev => [...prev, newQuestion])
            reset({
                submissionDeadline: getValues('submissionDeadline'),
                question: '',
                options: ['', '', ''],
                correctAnswer: '',
                points: 10
            })
            setSelectedQuestionId('')
            // Clear all errors after successful submission
            clearErrors()
            // console.log('Question added successfully!')
        } else {
            // console.log('Validation failed - question or correct answer missing')
            // console.log('Question trimmed:', data.question.trim())
            // console.log('Correct answer:', data.correctAnswer)
        }
    }, (errors) => {
        // console.log('Form validation errors:', errors)
    })

    const selectQuestion = (questionId: string) => {
        const question = questions.find(q => q.id === questionId)
        if (question) {
            setValue('question', question.question)
            setValue('options', question.options)
            setValue('correctAnswer', question.correctAnswer)
            setValue('points', question.points)
            setSelectedQuestionId(questionId)
        }
    }

    const deleteQuestion = (questionId: string) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId))
        if (selectedQuestionId === questionId) {
            reset({
                submissionDeadline: getValues('submissionDeadline'),
                question: '',
                options: ['', '', ''],
                correctAnswer: '',
                points: 10
            })
            setSelectedQuestionId('')
        }
    }

    const getOptionLabel = (index: number) => {
        return String.fromCharCode(65 + index)
    }

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const items = Array.from(questions)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setQuestions(items)
    }

    const truncateText = (text: string, maxLength: number = 20) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    return (
        <div className=" bg-white p-5 rounded-xl">
            {/* Header */}
            <div className="mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex flex-col space-y-2">
                            <span className="text-sm font-medium text-gray-500">Submission Deadline <span className='text-red-500'>*</span></span>
                            <Controller
                                name="submissionDeadline"
                                control={control}
                                rules={{
                                    required: "Submission deadline is required",
                                    validate: (value) => {
                                        if (!value) return "Submission deadline is required"
                                        const today = new Date()
                                        today.setHours(0, 0, 0, 0)
                                        const selectedDate = new Date(value)
                                        selectedDate.setHours(0, 0, 0, 0)

                                        if (selectedDate < today) {
                                            return "Submission deadline cannot be in the past"
                                        }
                                        return true
                                    }
                                }}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="relative">
                                                <Input
                                                    value={field.value ? format(field.value, "MM/dd/yyyy") : ""}
                                                    placeholder="Select date"
                                                    readOnly
                                                    className={`pr-10 cursor-pointer bg-gray-50 border-gray-200 w-full sm:w-auto ${errors.submissionDeadline && isSubmitted ? 'border-red-500' : ''}`}
                                                />
                                                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date: Date | undefined) => field.onChange(date || new Date())}
                                                disabled={(date) => {
                                                    const today = new Date()
                                                    today.setHours(0, 0, 0, 0)
                                                    const selectedDate = new Date(date)
                                                    selectedDate.setHours(0, 0, 0, 0)
                                                    return selectedDate < today
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.submissionDeadline && isSubmitted && (
                                <span className="text-xs text-red-500">{errors.submissionDeadline.message}</span>
                            )}
                        </div>
                    </div>
                    <Button
                        className="bg-[#F1C27D] hover:bg-[#F1C27D]/90 text-white w-full sm:w-auto cursor-pointer"
                        onClick={async () => {
                            if (questions.length === 0) {
                                // Set error on question field to show validation error
                                setError('question', {
                                    type: 'manual',
                                    message: 'Please add at least one question before publishing'
                                })
                                // Trigger validation to show the error
                                await trigger('question')
                                return
                            }
                            // console.log('Publishing quiz with questions:', questions)
                            // You can add your publish logic here
                            // console.log('Quiz published successfully!')
                        }}
                    >
                        + Publish
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Left Sidebar - Question Management */}
                <div className="w-full lg:w-80 bg-[#FDFCFC] rounded-lg  order-2 lg:order-1 border border-[#EEE]">
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Question ({questions.length})</h3>
                            <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full w-8 h-8 p-0"
                                onClick={() => {
                                    reset({
                                        submissionDeadline: getValues('submissionDeadline'),
                                        question: '',
                                        options: ['', '', ''],
                                        correctAnswer: '',
                                        points: 10
                                    })
                                    setSelectedQuestionId('')
                                }}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>
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
                                                        className={`cursor-pointer transition-colors ${selectedQuestionId === question.id ? 'border-orange-500 bg-orange-50' : ''
                                                            }`}
                                                        onClick={() => selectQuestion(question.id)}
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
                                                                        deleteQuestion(question.id)
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

                {/* Right Side - Question Editor */}
                <div className="flex-1 order-1 lg:order-2 ">
                    {/* Question Section */}
                    <div className='bg-white rounded-xl border'>
                        <h3 className="text-sm font-semibold text-center text-gray-400 mb-4 px-4  py-4 rounded-t-xl bg-[#FEF9F2]">QUESTION</h3>
                        <div className='p-4'>
                            <div className="space-y-2">
                                <Label htmlFor="question">Question <span className='text-red-500'>*</span></Label>
                                <Controller
                                    name="question"
                                    control={control}
                                    rules={{
                                        required: "Question is required",
                                        minLength: { value: 10, message: "Question must be at least 10 characters" }
                                    }}
                                    render={({ field }) => (
                                        <Textarea
                                            id="question"
                                            placeholder="Type your question here..."
                                            value={field.value}
                                            onChange={field.onChange}
                                            className={`min-h-[100px] ${errors.question && isSubmitted && watchedQuestion.trim() ? 'border-red-500' : ''}`}
                                        />
                                    )}
                                />
                                {errors.question && isSubmitted && watchedQuestion.trim() && (
                                    <span className="text-xs text-red-500">{errors.question.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6  mt-5">
                        {/* Answer Options Section */}
                        <div className='bg-white rounded-xl border'>
                            <h3 className="text-sm font-semibold text-center text-gray-400 mb-4 px-4  py-4 rounded-t-xl bg-[#FEF9F2]">ANSWER</h3>
                            <div className='p-4'>
                                <div className="space-y-3">
                                    {watchedOptions.map((option, index) => (
                                        <div key={index} className="relative">
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter your option"
                                                    value={option}
                                                    onChange={(e) => updateOption(index, e.target.value)}
                                                    className={`pl-12 pr-10 py-6 border-gray-200 ${!option.trim() && isSubmitted && watchedQuestion.trim() ? 'border-red-500' : ''}`}
                                                />
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-md w-6 h-6 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {getOptionLabel(index)}
                                                    </span>
                                                </div>
                                                {watchedOptions.length > 2 && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                                        onClick={() => removeOption(index)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                            {!option.trim() && isSubmitted && watchedQuestion.trim() && (
                                                <span className="text-xs text-red-500 mt-1 block">Option {getOptionLabel(index)} is required</span>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        onClick={addOption}
                                        className="mt-2 w-full px-10 sm:w-auto cursor-pointer"
                                    >
                                        + Add Option
                                    </Button>
                                    {watchedOptions.length < 2 && isSubmitted && watchedQuestion.trim() && (
                                        <span className="text-xs text-red-500 block">At least 2 options are required</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Correct Answer Section */}
                        <div className='bg-white rounded-xl border'>
                            <h3 className="text-sm font-semibold text-center text-gray-400 mb-4 px-4  py-4 rounded-t-xl bg-[#FEF9F2]">CORRECT ANSWER</h3>
                            <div className="flex flex-col gap-3 lg:flex-row items-center justify-between bg-[#F9F9F9] p-3 mx-5 ">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Select correct answer</span>
                                </div>
                                <div className='flex items-center flex-col sm:flex-row gap-3'>
                                    <Controller
                                        name="correctAnswer"
                                        control={control}
                                        rules={{
                                            required: "Please select a correct answer",
                                            validate: (value) => {
                                                if (!value) return "Please select a correct answer"
                                                const optionIndex = value.charCodeAt(0) - 65
                                                const selectedOption = watchedOptions[optionIndex]
                                                if (!selectedOption || !selectedOption.trim()) {
                                                    return "Selected option is empty"
                                                }
                                                return true
                                            }
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className={`w-full sm:w-48 ${errors.correctAnswer && isSubmitted && watchedQuestion.trim() ? 'border-red-500' : ''}`}>
                                                    <SelectValue placeholder="Correct answer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {watchedOptions.map((option, index) => (
                                                        <SelectItem key={index} value={getOptionLabel(index)}>
                                                            {getOptionLabel(index)}: {option || `Option ${getOptionLabel(index)}`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="points" className="text-sm">Point</Label>
                                        <Controller
                                            name="points"
                                            control={control}
                                            rules={{
                                                required: "Points are required",
                                                min: { value: 1, message: "Points must be at least 1" },
                                                max: { value: 100, message: "Points cannot exceed 100" }
                                            }}
                                            render={({ field }) => (
                                                <Input
                                                    id="points"
                                                    type="number"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            {errors.correctAnswer && isSubmitted && watchedQuestion.trim() && (
                                <div className="px-5">
                                    <span className="text-xs text-red-500">{errors.correctAnswer.message}</span>
                                </div>
                            )}
                            {errors.points && isSubmitted && watchedQuestion.trim() && (
                                <div className="px-5">
                                    <span className="text-xs text-red-500">{errors.points.message}</span>
                                </div>
                            )}

                            {/* Add Quiz Button */}
                            <div className="flex justify-end p-4">
                                <Button
                                    onClick={addQuiz}
                                    className="bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/90 text-white w-full sm:w-auto"
                                    disabled={false}
                                    type="button"
                                >
                                    + Add Quiz
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
