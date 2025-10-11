'use client'

import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import QuizCreateDate, { type DeadlineFormData } from '@/components/Resuable/QuizCreateDate'
import QuizSidebar, { handleDragEnd } from './quizSidebar'
import CorrectAnswer from './CorrectAnswer'
import { useGetSeriesWithCoursesQuery } from '@/rtk/api/admin/courseFilterApis'
import { useCreateQuizMutation, useGetSingleQuizQuery, useUpdateQuizMutation } from '@/rtk/api/admin/quizApis'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { localDateTimeToUTC, utcToLocalDateTime } from '@/lib/calendarUtils'


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

// Helper functions for timezone conversion
const convertUTCDateToLocal = (utcIsoString: string) => {
    try {
        return utcToLocalDateTime(utcIsoString)
    } catch (error) {
        console.error('Error converting UTC to local:', error)
        return { date: new Date(), time: '09:00' }
    }
}

export default function CreateQuizAssignment() {
    const router = useRouter()
    // State management
    const [questions, setQuestions] = useState<Question[]>([])
    const [selectedQuestionId, setSelectedQuestionId] = useState<string>('')
    const [initialDates, setInitialDates] = useState<DeadlineFormData | null>(null)

    // Route parameters
    const params = useParams()
    const quizId = params?.id as string
    const isEditMode = !!quizId

    // API hooks
    const { data: seriesData, isLoading: isSeriesLoading, isError: isSeriesError } = useGetSeriesWithCoursesQuery()
    const [createQuiz, { isLoading: isCreatingQuiz }] = useCreateQuizMutation()
    const [updateQuiz, { isLoading: isUpdatingQuiz }] = useUpdateQuizMutation()
    const { data: quizData, isLoading: isQuizLoading, isError: isQuizError } = useGetSingleQuizQuery(quizId, {
        skip: !isEditMode || !quizId
    })

    // Form management
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
        }
    })

    // Form watchers
    const watchedOptions = watch('options')
    const watchedQuestion = watch('question')
    const selectedSeriesId = watch('selectedSeries')

    // Derived data
    const seriesList = seriesData?.data || []
    const coursesForSelectedSeries = seriesList.find(s => s.id === selectedSeriesId)?.courses || []

    // Reset course when series changes
    useEffect(() => {
        if (!isEditMode || !quizData?.data) {
            setValue('selectedCourses', '')
        }
    }, [selectedSeriesId, setValue, isEditMode, quizData])

    // Load quiz data for editing
    useEffect(() => {
        if (quizData?.data && isEditMode) {
            const quiz = quizData.data
            setValue('quizTitle', quiz.title)

            // Set series and course together
            setValue('selectedSeries', quiz.series_id)
            setValue('selectedCourses', quiz.course_id)

            // Set initial dates for QuizCreateDate component
            if (quiz.published_at && quiz.due_at) {
                const publishedLocal = convertUTCDateToLocal(quiz.published_at)
                const dueLocal = convertUTCDateToLocal(quiz.due_at)

                setInitialDates({
                    startDateDeadline: publishedLocal.date,
                    startTimeDeadline: publishedLocal.time,
                    submissionDeadline: dueLocal.date,
                    submissionTimeDeadline: dueLocal.time
                })
            }

            // Convert API questions to local format
            if (quiz.questions && quiz.questions.length > 0) {
                const convertedQuestions: Question[] = quiz.questions.map((q: any, index: number) => {
                    const correctAnswerIndex = q.answers.findIndex((a: any) => a.is_correct)
                    const correctAnswer = correctAnswerIndex >= 0 ? String.fromCharCode(65 + correctAnswerIndex) : ''
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

    // Question management functions
    const addQuiz = handleSubmit((data) => {
        const validOptions = data.options.filter(option => option.trim().length > 0)

        if (validOptions.length < 2) {
            setError('options', { type: 'manual', message: 'At least 2 options must be filled' })
            return
        }

        if (!data.correctAnswer) {
            setError('correctAnswer', { type: 'manual', message: 'Please select a correct answer' })
            return
        }

        const optionIndex = data.correctAnswer.charCodeAt(0) - 65
        const selectedOption = data.options[optionIndex]
        if (!selectedOption?.trim()) {
            setError('correctAnswer', { type: 'manual', message: 'Selected correct answer option is empty' })
            return
        }

        const questionData: Question = {
            id: selectedQuestionId || Date.now().toString(),
            question: data.question,
            options: data.options,
            correctAnswer: data.correctAnswer,
            points: data.points
        }

        if (selectedQuestionId) {
            setQuestions(prev => prev.map(q => q.id === selectedQuestionId ? questionData : q))
        } else {
            setQuestions(prev => [...prev, questionData])
        }

        // Reset form
        setValue('question', '')
        setValue('options', ['', '', ''])
        setValue('correctAnswer', '')
        setValue('points', 10)
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
            setValue('question', '')
            setValue('options', ['', '', ''])
            setValue('correctAnswer', '')
            setValue('points', 10)
            setSelectedQuestionId('')
        }
    }

    // Validation helper function
    const validateQuizData = (title: string, seriesId: string, courseId: string, questions: Question[]) => {
        if (!title?.trim()) return 'Please enter a quiz title'
        if (title.length > 200) return 'Quiz title must be shorter than or equal to 200 characters'
        if (!seriesId || !courseId) return 'Please select both series and course'
        if (!questions?.length) return 'Please add at least one question'
        return null
    }

    // Handle quiz publish/update
    const handlePublish = async (dates?: DeadlineFormData) => {
        if (!dates) return

        const { startDateDeadline, startTimeDeadline, submissionDeadline, submissionTimeDeadline } = dates
        const seriesId = getValues('selectedSeries')
        const courseId = getValues('selectedCourses')
        const title = getValues('quizTitle')?.trim() || 'Untitled Quiz'

        // Validate all required fields
        const validationError = validateQuizData(title, seriesId, courseId, questions)
        if (validationError) {
            toast.error(validationError)
            return
        }

        // Convert local datetime to UTC ISO strings
        let publishedAt, dueAt
        try {
            publishedAt = localDateTimeToUTC(startDateDeadline, startTimeDeadline)
            dueAt = localDateTimeToUTC(submissionDeadline, submissionTimeDeadline)
        } catch (error) {
            toast.error('Please select valid start and submission dates')
            return
        }

        // Process questions for API
        const questionsArray = questions.map((q, index) => {
            const correctIndex = q.correctAnswer ? (q.correctAnswer.charCodeAt(0) - 65) : -1
            return {
                prompt: q.question,
                points: q.points || 1,
                position: index,
                answers: q.options
                    .filter(opt => opt.trim().length > 0)
                    .map((opt, optIndex) => ({
                        option: opt,
                        position: optIndex,
                        is_correct: optIndex === correctIndex
                    }))
            }
        })

        const payload = {
            title,
            instructions: 'Answer all questions. Each question is worth 1 point.',
            series_id: seriesId,
            course_id: courseId,
            published_at: publishedAt,
            due_at: dueAt,
            questions: questionsArray
        }

        // Call API to create or update quiz
        try {
            if (isEditMode) {
                const response = await updateQuiz({
                    id: quizId,
                    ...payload
                }).unwrap()
                toast.success(response.message || 'Quiz updated successfully!')
            } else {
                const response = await createQuiz(payload).unwrap()
                toast.success(response.message || 'Quiz created successfully!')

                // Clear all fields after successful creation
                setQuestions([])
                setSelectedQuestionId('')
                reset()
                clearErrors()
            }
        } catch (error: any) {
            const errorMessage = error?.data?.message || error?.message || `Failed to ${isEditMode ? 'update' : 'create'} quiz`
            toast.error(errorMessage)
        }
    }

    // Loading state for edit mode
    if (isEditMode && isQuizLoading) {
        return (
            <div className="bg-white p-5 rounded-xl">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-1">
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-32 bg-gray-200 rounded"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
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
                    <div className="mb-4">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Quiz</h3>
                        <p className="text-gray-600 mb-4">Unable to load the quiz data. Please check your connection and try again.</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }


    // handle back button
    const handleBack = () => {
        router.push('/admin/assignment-management?tab=quiz')
    }

    return (
        <div className=" bg-white p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handleBack} className="cursor-pointer border border-gray-200 rounded-md py-1 px-2 w-full sm:w-auto flex items-center gap-2 text-sm hover:bg-gray-100 transition-all duration-300">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            </div>
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
                        isEditing={!!selectedQuestionId}
                    />
                </div>
            </div>
        </div>
    )
}
