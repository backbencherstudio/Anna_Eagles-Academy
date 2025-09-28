'use client'

import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import QuizCreateDate, { type DeadlineFormData } from '@/components/Resuable/QuizCreateDate'
import QuizSidebar, { handleDragEnd } from './QuizSection/quizSidebar'
import CorrectAnswer from './QuizSection/CorrectAnswer'
import { useGetSeriesWithCoursesQuery } from '@/rtk/api/courseFilterApis'
import { useCreateQuizMutation, useGetSingleQuizQuery, useUpdateQuizMutation } from '@/rtk/api/quizApis'
import { useParams } from 'next/navigation'


interface Question {
    id: string
    question: string
    options: string[]
    correctAnswer: string
    points: number
}

interface QuizFormData {
    selectedSeries: string
    selectedCourses: string
    question: string
    options: string[]
    correctAnswer: string
    points: number
    quizTitle?: string
}

export default function CreateQuizAssignment() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [selectedQuestionId, setSelectedQuestionId] = useState<string>('')
    const [initialDates, setInitialDates] = useState<DeadlineFormData | null>(null)
    const params = useParams()
    const quizId = params?.id as string
    const isEditMode = !!quizId

    // load series with courses for dependent dropdowns
    const { data: seriesData, isLoading: isSeriesLoading, isError: isSeriesError } = useGetSeriesWithCoursesQuery()
    
    // create quiz mutation
    const [createQuiz, { isLoading: isCreatingQuiz, isError: isCreateError, isSuccess: isCreateSuccess }] = useCreateQuizMutation()
    
    // update quiz mutation
    const [updateQuiz, { isLoading: isUpdatingQuiz, isError: isUpdateError, isSuccess: isUpdateSuccess }] = useUpdateQuizMutation()
    
    // get single quiz for editing
    const { data: quizData, isLoading: isQuizLoading, isError: isQuizError } = useGetSingleQuizQuery(quizId, {
        skip: !isEditMode
    })

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
    } = useForm<QuizFormData>({
        defaultValues: {
            selectedSeries: '',
            selectedCourses: '',
            question: '',
            options: ['', '', ''],
            correctAnswer: '',
            points: 10
        },
        mode: 'onChange',
        reValidateMode: 'onChange'
    })

    const watchedOptions = watch('options')
    const watchedQuestion = watch('question')
    const selectedSeriesId = watch('selectedSeries')

    // reset course when series changes (but not in edit mode when loading data)
    useEffect(() => {
        if (!isEditMode || !quizData?.data) {
            setValue('selectedCourses', '')
        }
    }, [selectedSeriesId, setValue, isEditMode, quizData])

    // load quiz data for editing
    useEffect(() => {
        if (quizData?.data && isEditMode) {
            const quiz = quizData.data
            setValue('quizTitle', quiz.title)
            
            // Set series and course together
            setValue('selectedSeries', quiz.series_id)
            setValue('selectedCourses', quiz.course_id)
            
            // Set initial dates for QuizCreateDate component
            if (quiz.published_at && quiz.due_at) {
                const publishedDate = new Date(quiz.published_at)
                const dueDate = new Date(quiz.due_at)
                
                setInitialDates({
                    startDateDeadline: publishedDate,
                    startTimeDeadline: publishedDate.toTimeString().slice(0, 5), // HH:MM format
                    submissionDeadline: dueDate,
                    submissionTimeDeadline: dueDate.toTimeString().slice(0, 5) // HH:MM format
                })
            }
            
            // Convert API questions to local format
            if (quiz.questions && quiz.questions.length > 0) {
                const convertedQuestions: Question[] = quiz.questions.map((q: any, index: number) => {
                    // Find the correct answer index
                    const correctAnswerIndex = q.answers.findIndex((a: any) => a.is_correct)
                    const correctAnswer = correctAnswerIndex >= 0 ? String.fromCharCode(65 + correctAnswerIndex) : ''
                    
                    // Create a copy of answers array before sorting to avoid mutation
                    const sortedAnswers = [...q.answers].sort((a: any, b: any) => a.position - b.position)
                    
                    return {
                        id: q.id || (Date.now().toString() + index),
                        question: q.prompt,
                        options: sortedAnswers.map((a: any) => a.option),
                        correctAnswer: correctAnswer,
                        points: q.points
                    }
                })
                setQuestions(convertedQuestions)
            }
        }
    }, [quizData, isEditMode, setValue])

    const seriesList = seriesData?.data || []
    const coursesForSelectedSeries = seriesList.find(s => s.id === selectedSeriesId)?.courses || []


    const addQuiz = handleSubmit((data) => {
        // Validate options
        const validOptions = data.options.filter(option => option.trim().length > 0)

        if (validOptions.length < 2) {
            setError('options', {
                type: 'manual',
                message: 'At least 2 options must be filled'
            })
            return
        }

        // Validate correct answer
        if (!data.correctAnswer) {
            setError('correctAnswer', {
                type: 'manual',
                message: 'Please select a correct answer'
            })
            return
        }

        // Validate that selected correct answer has content
        const optionIndex = data.correctAnswer.charCodeAt(0) - 65
        const selectedOption = data.options[optionIndex]
        if (!selectedOption || !selectedOption.trim()) {
            setError('correctAnswer', {
                type: 'manual',
                message: 'Selected correct answer option is empty'
            })
            return
        }

        // Create new question
        const newQuestion: Question = {
            id: Date.now().toString(),
            question: data.question,
            options: data.options,
            correctAnswer: data.correctAnswer,
            points: data.points
        }

        setQuestions(prev => [...prev, newQuestion])

        // Clear only specific fields, preserve quiz title
        setValue('question', '')
        setValue('options', ['', '', ''])
        setValue('correctAnswer', '')
        setValue('points', 10)
        // Don't clear quizTitle - keep it as is

        setSelectedQuestionId('')
        clearErrors()
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
            // Clear only specific fields, preserve quiz title and selections
            setValue('question', '')
            setValue('options', ['', '', ''])
            setValue('correctAnswer', '')
            setValue('points', 10)
            setSelectedQuestionId('')
        }
    }



    // Validation function
    const validateQuizData = (title: string, seriesId: string, courseId: string, questions: Question[]) => {
        if (!title?.trim()) return 'Please enter a quiz title'
        if (title.length > 200) return 'Quiz title must be shorter than or equal to 200 characters'
        if (!seriesId || !courseId) return 'Please select both series and course'
        if (!questions?.length) return 'Please add at least one question'
        return null
    }

    // handle publish
    const handlePublish = async (dates?: DeadlineFormData) => {
        if (!dates) return

        const combineDateTimeToISO = (date: Date, timeHHMM: string) => {
            if (!date || !timeHHMM) {
                throw new Error('Invalid date or time')
            }

            const [hour, minute] = timeHHMM.split(':').map(Number)
            if (isNaN(hour) || isNaN(minute)) {
                throw new Error('Invalid time format')
            }

            // Create date in local timezone first
            const year = date.getFullYear()
            const month = date.getMonth()
            const day = date.getDate()

            // Create new date with UTC time to avoid timezone conversion
            const utcDate = new Date(Date.UTC(year, month, day, hour, minute, 0, 0))

            return utcDate.toISOString()
        }

        const { startDateDeadline, startTimeDeadline, submissionDeadline, submissionTimeDeadline } = dates

        const seriesId = getValues('selectedSeries')
        const courseId = getValues('selectedCourses')
        const titleValue = getValues('quizTitle')
        const title = (titleValue && typeof titleValue === 'string') ? titleValue.trim() : 'Untitled Quiz'

        // Validate all required fields
        const validationError = validateQuizData(title, seriesId, courseId, questions)
        if (validationError) {
            alert(validationError)
            return
        }

        // Validate dates
        let publishedAt, dueAt
        try {
            publishedAt = combineDateTimeToISO(startDateDeadline, startTimeDeadline)
            dueAt = combineDateTimeToISO(submissionDeadline, submissionTimeDeadline)
        } catch (error) {
            alert('Please select valid start and submission dates')
            return
        }

        // Process questions for API
        const questionsArray = questions.map((q, index) => {
            const correctIndex = q.correctAnswer ? (q.correctAnswer.charCodeAt(0) - 65) : -1
            return {
                prompt: String(q.question),
                points: Number(q.points) || 1,
                position: index,
                answers: q.options
                    .filter((opt) => typeof opt === 'string' && opt.trim().length > 0)
                    .map((opt, optIndex) => ({
                        option: String(opt),
                        position: optIndex,
                        is_correct: optIndex === correctIndex
                    }))
            }
        })

        const payload = {
            title: String(title),
            instructions: 'Answer all questions. Each question is worth 1 point.',
            series_id: String(seriesId),
            course_id: String(courseId),
            published_at: publishedAt,
            due_at: dueAt,
            questions: questionsArray
        }



        // Call API to create or update quiz
        try {
            if (isEditMode) {
                // For update, we need to pass id separately and payload as body
                await updateQuiz({ 
                    id: quizId, 
                    ...payload 
                }).unwrap()
                alert('Quiz updated successfully!')
            } else {
                await createQuiz(payload).unwrap()
                alert('Quiz created successfully!')
            }
            
            // Clear all fields after successful publish (only for create mode)
            if (!isEditMode) {
                setQuestions([])
                reset({
                    selectedSeries: '',
                    selectedCourses: '',
                    quizTitle: '',
                    question: '',
                    options: ['', '', ''],
                    correctAnswer: '',
                    points: 10
                })
                setSelectedQuestionId('')
                clearErrors()
            }
        } catch (error: any) {
            const errorMessage = error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} quiz. Please try again.`
            alert(typeof errorMessage === 'string' ? errorMessage : errorMessage.join('\n'))
        }
    }

    // Show loading state when fetching quiz data for editing
    if (isEditMode && isQuizLoading) {
        return (
            <div className="bg-white p-5 rounded-xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-1">
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="h-32 bg-gray-200 rounded mb-4"></div>
                            <div className="h-32 bg-gray-200 rounded mb-4"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Show error state if quiz fetch fails
    if (isEditMode && isQuizError) {
        return (
            <div className="bg-white p-5 rounded-xl">
                <div className="text-center py-8">
                    <p className="text-red-500">Failed to load quiz data</p>
                </div>
            </div>
        )
    }

    return (
        <div className=" bg-white p-5 rounded-xl">
            {/* Header */}
            <QuizCreateDate
                onPublish={handlePublish}
                publishButtonText={
                    isCreatingQuiz ? "Publishing..." : 
                    isUpdatingQuiz ? "Updating..." : 
                    isEditMode ? "+ Update Quiz" : "+ Publish"
                }
                publishButtonDisabled={questions.length === 0 || isCreatingQuiz || isUpdatingQuiz}
                showValidation={true}
                initialDates={initialDates}
            />

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Left Sidebar - Question Management */}
                <QuizSidebar
                    questions={questions}
                    selectedQuestionId={selectedQuestionId}
                    onSelectQuestion={selectQuestion}
                    onDeleteQuestion={deleteQuestion}
                    onDragEnd={(result) => handleDragEnd(result, questions, setQuestions)}
                    onAddNewQuestion={() => {
                        // Clear only specific fields, preserve quiz title and selections
                        setValue('question', '')
                        setValue('options', ['', '', ''])
                        setValue('correctAnswer', '')
                        setValue('points', 10)
                        setSelectedQuestionId('')
                    }}
                />

                {/* Right Side - Question Editor */}
                <div className="flex-1 order-1 lg:order-2 ">
                    {/* Quiz Details */}
                    <div className="bg-white rounded-xl border mb-4">
                        <div className="p-4">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Quiz Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="quizTitle" className="text-sm font-medium text-gray-700">QUIZ TITLE</Label>
                                    <Controller
                                        name="quizTitle"
                                        control={control}
                                        rules={{
                                            required: 'Please enter a quiz title',
                                            minLength: { value: 3, message: 'Title must be at least 3 characters' }
                                        }}
                                        render={({ field }) => (
                                            <Textarea
                                                id="quizTitle"
                                                placeholder="Enter quiz title..."
                                                value={field.value}
                                                onChange={field.onChange}
                                                className={`min-h-[60px] ${errors.quizTitle && isSubmitted ? 'border-red-500' : ''}`}
                                            />
                                        )}
                                    />
                                    {errors.quizTitle && isSubmitted && (
                                        <span className="text-xs text-red-500">{errors.quizTitle.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Series and Courses Selection */}
                    <div className="bg-white rounded-xl border mb-4">
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                    {isSeriesLoading && (
                                                        <SelectItem value="loading" disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    )}
                                                    {isSeriesError && (
                                                        <SelectItem value="error" disabled>
                                                            Failed to load series
                                                        </SelectItem>
                                                    )}
                                                    {!isSeriesLoading && !isSeriesError && seriesList.map((series) => (
                                                        <SelectItem key={series.id} value={series.id}>{series.title}</SelectItem>
                                                    ))}
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
                                                <SelectTrigger className="w-full" disabled={!selectedSeriesId || isSeriesLoading || (isEditMode && isQuizLoading)}>
                                                    <SelectValue placeholder="Selected Courses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {isQuizLoading && isEditMode && (
                                                        <SelectItem value="loading" disabled>
                                                            Loading courses...
                                                        </SelectItem>
                                                    )}
                                                    {!isQuizLoading && (!selectedSeriesId || coursesForSelectedSeries.length === 0) && (
                                                        <SelectItem value="no-course" disabled>
                                                            {selectedSeriesId ? 'No courses found' : 'Select a series first'}
                                                        </SelectItem>
                                                    )}
                                                    {!isQuizLoading && coursesForSelectedSeries.map((course) => (
                                                        <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.selectedCourses && isSubmitted && (
                                        <span className="text-xs text-red-500">{errors.selectedCourses.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

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
                                        minLength: { value: 10, message: "Question must be at least 10 characters" },
                                        validate: (value) => {
                                            if (!value || value.trim().length < 10) {
                                                return "Question must be at least 10 characters"
                                            }
                                            return true
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Textarea
                                            id="question"
                                            placeholder="Type your question here..."
                                            value={field.value}
                                            onChange={field.onChange}
                                            className={`min-h-[100px] ${errors.question && (isSubmitted || watchedQuestion.trim()) ? 'border-red-500' : ''}`}
                                        />
                                    )}
                                />
                                {errors.question && (isSubmitted || watchedQuestion.trim()) && (
                                    <span className="text-xs text-red-500">{errors.question.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hidden field for options validation */}
                    <Controller
                        name="options"
                        control={control}
                        rules={{
                            validate: (value) => {
                                const validOptions = value.filter(option => option.trim().length > 0)
                                if (validOptions.length < 2) {
                                    return "At least 2 options must be filled"
                                }
                                return true
                            }
                        }}
                        render={() => <div style={{ display: 'none' }} />}
                    />

                    <CorrectAnswer
                        control={control}
                        errors={errors}
                        isSubmitted={isSubmitted}
                        watchedOptions={watchedOptions}
                        watchedQuestion={watchedQuestion}
                        getValues={getValues}
                        setValue={setValue}
                        trigger={trigger}
                        onAddQuiz={addQuiz}
                    />
                </div>
            </div>
        </div>
    )
}
