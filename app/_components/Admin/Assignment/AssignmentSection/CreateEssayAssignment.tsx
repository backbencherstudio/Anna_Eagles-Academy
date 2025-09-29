'use client'

import React, { useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import QuizCreateDate from '@/components/Resuable/QuizCreateDate'
import AssignmentSidebar, { AssignmentSidebarRef } from './AssignmentSidebar'
import AnotherQuestion from './Anotherquestion'
import { useGetSeriesWithCoursesQuery } from '@/rtk/api/admin/courseFilterApis'
import { useCreateAssignmentMutation } from '@/rtk/api/admin/assignmentApis'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/rtk'
import { 
    updateFormField, 
    resetForm, 
    addEssay, 
    updateEssay, 
    selectEssay, 
    clearAllEssays,
    addAdditionalQuestion,
    updateAdditionalQuestion,
    removeAdditionalQuestion,
    clearAdditionalQuestions,
    setCreatingAssignment,
    setError as setReduxError,
    clearError
} from '@/rtk/slices/assignmentManagementSlice'
import toast from 'react-hot-toast'

interface EssayFormData {
    mainTitle: string
    selectedSeries: string
    selectedCourses: string
    assignmentTitle: string
    points: number
    submissionDeadline: Date // Keep as Date for form handling
}

export default function CreateEssayAssignment() {
    const dispatch = useDispatch()
    const sidebarRef = useRef<AssignmentSidebarRef>(null)
    
    // Redux state
    const { 
        formData, 
        selectedEssayId, 
        essaysCount, 
        additionalQuestions, 
        isCreatingAssignment
    } = useSelector((state: RootState) => state.assignmentManagement)

    // API hooks
    const { data: seriesData, isLoading: isSeriesLoading, isError: isSeriesError } = useGetSeriesWithCoursesQuery()
    const [createAssignment] = useCreateAssignmentMutation()

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
        reset,
        watch,
        setValue,
        getValues,
        setError,
        clearErrors
    } = useForm<EssayFormData>({
        defaultValues: {
            mainTitle: formData.mainTitle,
            selectedSeries: formData.selectedSeries,
            selectedCourses: formData.selectedCourses,
            assignmentTitle: formData.assignmentTitle,
            points: formData.points,
            submissionDeadline: new Date(formData.submissionDeadline) // Convert string to Date
        },
        mode: 'onSubmit'
    })

    const selectedSeriesId = watch('selectedSeries')

    // Derived data
    const seriesList = seriesData?.data || []
    const coursesForSelectedSeries = seriesList.find(s => s.id === selectedSeriesId)?.courses || []

    // Sync form changes with Redux state
    useEffect(() => {
        const subscription = watch((value) => {
            Object.entries(value).forEach(([key, val]) => {
                if (val !== undefined) {
                    // Convert Date to string for Redux
                    const valueToStore = val instanceof Date ? val.toISOString() : val
                    dispatch(updateFormField({ field: key as keyof EssayFormData, value: valueToStore }))
                }
            })
        })
        return () => subscription.unsubscribe()
    }, [watch, dispatch])

    // Reset course when series changes
    useEffect(() => {
        setValue('selectedCourses', '')
        dispatch(updateFormField({ field: 'selectedCourses', value: '' }))
    }, [selectedSeriesId, setValue, dispatch])

    const handleAddEssay = handleSubmit((data) => {
        const essaysToAdd = []

        // Add main essay if it has a title
        if (data.assignmentTitle.trim()) {
            if (selectedEssayId) {
                // Update existing essay
                const updatedEssay = {
                    id: selectedEssayId,
                    title: data.assignmentTitle,
                    points: data.points,
                    submissionDeadline: data.submissionDeadline.toISOString() // Convert Date to string
                }

                dispatch(updateEssay({ id: selectedEssayId, essay: updatedEssay }))
                if (sidebarRef.current) {
                    sidebarRef.current.updateEssay(selectedEssayId, updatedEssay)
                }
            } else {
                // Add new essay
                const newEssay = {
                    id: Date.now().toString(),
                    title: data.assignmentTitle,
                    points: data.points,
                    submissionDeadline: data.submissionDeadline.toISOString() // Convert Date to string
                }
                
                essaysToAdd.push(newEssay)
                dispatch(addEssay(newEssay))
            }
        }

        // Add all additional essays
        additionalQuestions.forEach((question, index) => {
            if (question.assignmentTitle.trim()) {
                const additionalEssay = {
                    id: (Date.now() + index + 1).toString(),
                    title: question.assignmentTitle,
                    points: question.points,
                    submissionDeadline: data.submissionDeadline.toISOString() // Convert Date to string
                }
                essaysToAdd.push(additionalEssay)
                dispatch(addEssay(additionalEssay))
            }
        })

        // Add all essays to sidebar
        if (essaysToAdd.length > 0 && sidebarRef.current) {
            essaysToAdd.forEach(essay => {
                sidebarRef.current!.addEssay(essay)
            })
        }
        
        // Reset form
        dispatch(resetForm())
        reset({
            mainTitle: getValues('mainTitle'),
            selectedSeries: getValues('selectedSeries'),
            selectedCourses: getValues('selectedCourses'),
            assignmentTitle: '',
            points: 20,
            submissionDeadline: new Date(formData.submissionDeadline) // Convert string to Date
        })
        dispatch(selectEssay(''))
        dispatch(clearAdditionalQuestions())
        clearErrors()
    })

    const handleSelectEssay = (essayId: string) => {
        dispatch(selectEssay(essayId))

        // Load essay data into form
        if (sidebarRef.current) {
            const essay = sidebarRef.current.getEssayById(essayId)
            if (essay) {
                setValue('assignmentTitle', essay.title)
                setValue('points', essay.points)
                setValue('submissionDeadline', new Date(essay.submissionDeadline)) // Convert string to Date
                
                // Update Redux state
                dispatch(updateFormField({ field: 'assignmentTitle', value: essay.title }))
                dispatch(updateFormField({ field: 'points', value: essay.points }))
                dispatch(updateFormField({ field: 'submissionDeadline', value: essay.submissionDeadline }))
            }
        }
    }

    const handleResetForm = () => {
        dispatch(resetForm())
        reset({
            mainTitle: getValues('mainTitle'),
            selectedSeries: getValues('selectedSeries'),
            selectedCourses: getValues('selectedCourses'),
            assignmentTitle: '',
            points: 20,
            submissionDeadline: new Date(formData.submissionDeadline) // Convert string to Date
        })
        dispatch(selectEssay(''))
        dispatch(clearAdditionalQuestions())
        clearErrors()
    }

    const handlePublish = async (dateData?: any) => {
        if (essaysCount === 0) {
            setError('assignmentTitle', {
                type: 'manual',
                message: 'Please add at least one essay before publishing'
            })
            return
        }

        // Get all essays from sidebar
        const essays = sidebarRef.current?.getAllEssays() || []
        
        // Get form data
        const formData = getValues()
        
        // Format dates for API
        const publishedAt = dateData?.startDateDeadline 
            ? new Date(`${dateData.startDateDeadline.toISOString().split('T')[0]}T${dateData.startTimeDeadline || '00:00'}:00.000Z`)
            : new Date()
        
        const dueAt = dateData?.submissionDeadline 
            ? new Date(`${dateData.submissionDeadline.toISOString().split('T')[0]}T${dateData.submissionTimeDeadline || '23:59'}:00.000Z`)
            : new Date()
        
        // Format data according to required structure
        const publishData = {
            title: formData.mainTitle || "Assignment",
            description: formData.mainTitle || "Complete the following questions.",
            series_id: formData.selectedSeries || "",
            course_id: formData.selectedCourses || "",
            published_at: publishedAt.toISOString(),
            due_at: dueAt.toISOString(),
            questions: essays.map((essay, index) => ({
                title: essay.title,
                points: essay.points,
                position: index
            }))
        }

        try {
            dispatch(setCreatingAssignment(true))
            dispatch(clearError())
            
            console.log('Publishing Assignment:', publishData)
            
            // Call the API to create assignment
            const result = await createAssignment(publishData).unwrap()
            
            // Success handling
            toast.success('Assignment created successfully!')
            console.log('Assignment created:', result)
            
            // Reset form and sidebar after successful creation
            dispatch(resetForm())
            reset({
                mainTitle: '',
                selectedSeries: '',
                selectedCourses: '',
                assignmentTitle: '',
                points: 20,
                submissionDeadline: new Date()
            })
            dispatch(selectEssay(''))
            dispatch(clearAdditionalQuestions())
            
            // Clear sidebar essays
            if (sidebarRef.current) {
                sidebarRef.current.clearAllEssays()
            }
            dispatch(clearAllEssays())
            
        } catch (error: any) {
            // Error handling
            console.error('Failed to create assignment:', error)
            dispatch(setReduxError(error?.data?.message || 'Failed to create assignment. Please try again.'))
            toast.error(error?.data?.message || 'Failed to create assignment. Please try again.')
        } finally {
            dispatch(setCreatingAssignment(false))
        }
    }

    return (
        <div className="bg-white p-5 rounded-xl">
            {/* Header */}
            <QuizCreateDate
                onPublish={handlePublish}
                publishButtonText={isCreatingAssignment ? "Creating..." : "+ Publish"}
                publishButtonDisabled={essaysCount === 0 || isCreatingAssignment}
            />

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Left Sidebar - Question Management */}
                <AssignmentSidebar
                    ref={sidebarRef}
                    onSelectEssay={handleSelectEssay}
                    onResetForm={handleResetForm}
                />

                {/* Right Side - Assignment Editor */}
                <div className="flex-1 order-1 lg:order-2">
                    {/* Main Assignment Form */}
                    <div className="bg-white rounded-xl border">
                        <h3 className="text-sm font-semibold text-center text-gray-400 mb-4 px-4 py-4 rounded-t-xl bg-[#FEF9F2]">ASSIGNMENT (ESSAY)</h3>
                        <div className="p-4 space-y-4">
                            {/* Main Title Field */}
                            <div className="space-y-2">
                                <Label htmlFor="mainTitle" className="text-sm font-medium text-gray-700">ASSIGNMENT TITLE <span className='text-red-500'>*</span></Label>
                                <Controller
                                    name="mainTitle"
                                    control={control}
                                    rules={{
                                        required: "Assignment title is required",
                                        minLength: { value: 3, message: "Assignment title must be at least 3 characters" }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            id="mainTitle"
                                            placeholder="Enter assignment title..."
                                            value={field.value}
                                            onChange={field.onChange}
                                            className={`${errors.mainTitle && isSubmitted ? 'border-red-500' : ''}`}
                                        />
                                    )}
                                />
                                {errors.mainTitle && isSubmitted && (
                                    <span className="text-xs text-red-500">{errors.mainTitle.message}</span>
                                )}
                            </div>

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
                                                <SelectTrigger className="w-full" disabled={!selectedSeriesId || isSeriesLoading}>
                                                    <SelectValue placeholder="Selected Courses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {!selectedSeriesId && (
                                                        <SelectItem value="no-series" disabled>
                                                            Select a series first
                                                        </SelectItem>
                                                    )}
                                                    {selectedSeriesId && coursesForSelectedSeries.length === 0 && (
                                                        <SelectItem value="no-course" disabled>
                                                            No courses found
                                                        </SelectItem>
                                                    )}
                                                    {coursesForSelectedSeries.map((course) => (
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
                            {/* Question 1 */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-700">Question 1</h4>
                                </div>

                                {/* Question */}
                                <div className="space-y-2">
                                    <Label htmlFor="assignmentTitle">Question <span className='text-red-500'>*</span></Label>
                                    <Controller
                                        name="assignmentTitle"
                                        control={control}
                                        rules={{
                                            required: "Question is required",
                                            minLength: { value: 5, message: "Question must be at least 5 characters" }
                                        }}
                                        render={({ field }) => (
                                            <Textarea
                                                id="assignmentTitle"
                                                placeholder="Enter your question here..."
                                                value={field.value}
                                                onChange={field.onChange}
                                                className={`min-h-[100px] ${errors.assignmentTitle && isSubmitted ? 'border-red-500' : ''}`}
                                            />
                                        )}
                                    />
                                    {errors.assignmentTitle && isSubmitted && (
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
                                            <Input
                                                id="points"
                                                type="number"
                                                min="1"
                                                max="100"
                                                placeholder="Enter points"
                                                value={field.value}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                className={`w-32 ${errors.points && isSubmitted ? 'border-red-500' : ''}`}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Another Question Component */}
                    <AnotherQuestion 
                        additionalQuestions={additionalQuestions}
                        onAddQuestion={(question) => {
                            dispatch(addAdditionalQuestion(question))
                        }}
                        onUpdateQuestion={(id, question) => {
                            dispatch(updateAdditionalQuestion({ id, question }))
                        }}
                        onRemoveQuestion={(id) => {
                            dispatch(removeAdditionalQuestion(id))
                        }}
                    />

                    {/* Add/Update Essay Button - At Bottom */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleAddEssay}
                            className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/90 text-white w-full sm:w-auto"
                            type="button"
                        >
                            {selectedEssayId ? 'Update Essay' : '+ Add Essay'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
} 