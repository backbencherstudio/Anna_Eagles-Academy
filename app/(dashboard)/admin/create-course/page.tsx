"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UploadImage from '@/app/_components/Admin/CourseManagement/CreateCourse/UploadImage'
import SetAvailability from '@/app/_components/Admin/CourseManagement/CreateCourse/SetAvailability'
import AddModules from '@/app/_components/Admin/CourseManagement/CreateCourse/AddModules'
import { createCourse } from '@/lib/apis/courseManagementApis'
import { CourseFormData } from '@/app/_components/Admin/CourseManagement/CreateCourse/types'

export default function CreateCoursePage() {
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [showErrors, setShowErrors] = useState(false)
    const [isSubmittingForm, setIsSubmittingForm] = useState(false)


    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<CourseFormData>({
        defaultValues: {
            title: '',
            codeType: '',
            available_site: 0,
            course_type: '',
            description: '',
            note: '',
            price: 0,
            thumbnail: null,
            start_date: '',
            end_date: '',
            courses: [], 
            dateRange: undefined
        },
        mode: 'onChange'
    })

    const dateRange = watch('dateRange')

    const onSubmit = async (data: CourseFormData) => {
        // Prevent multiple submissions
        if (isSubmittingForm) return

        // Validate required fields
        const validationErrors: string[] = []

        if (!data.title) validationErrors.push('Course title is required')
        if (!data.available_site) validationErrors.push('Student enroll is required')
        if (!data.course_type) validationErrors.push('Course type is required')
        if (!data.description) validationErrors.push('Course description is required')
        if (!thumbnailFile) validationErrors.push('Course thumbnail is required')
        if (!data.dateRange?.from) validationErrors.push('Start date is required')
        if (!data.dateRange?.to) validationErrors.push('End date is required')

        // Check module validations
        data.courses.forEach((course, index) => {
            if (!course.title) validationErrors.push(`Module ${index + 1} title is required`)
            if (!course.price || course.price <= 0) validationErrors.push(`Module ${index + 1} price must be greater than 0`)
        })

        if (validationErrors.length > 0) {
            setValidationErrors(validationErrors)
            setShowErrors(true)
            return
        }

        setValidationErrors([])
        setShowErrors(false)
        setIsSubmittingForm(true)

        // Force update form data to ensure all files are collected
        // Wait a moment to let any pending updates complete
        await new Promise(resolve => setTimeout(resolve, 100))

        // Prepare FormData for submission
        const formData = new FormData()
        
        // Add basic course data
        formData.append('title', data.title)
        formData.append('description', data.description)
        formData.append('start_date', data.dateRange?.from?.toISOString().split('T')[0] || '')
        formData.append('end_date', data.dateRange?.to?.toISOString().split('T')[0] || '')
        formData.append('note', data.note)
        formData.append('available_site', data.available_site.toString())
        formData.append('course_type', data.course_type)
        
        // Add thumbnail
        if (thumbnailFile) {
            formData.append('thumbnail', thumbnailFile)
        }

        // Add courses data with position field
        const coursesData = data.courses.map((course, index) => ({
            title: course.title,
            position: index,
            price: course.price,
            lessons_files: course.lessons_files
        }))
        formData.append('courses', JSON.stringify(coursesData))

        // Add course files with proper naming convention
        data.courses.forEach((course, courseIndex) => {
            // Add intro and end videos for each module
            if (course.introVideo) {
                formData.append(`course_${courseIndex}_introVideo`, course.introVideo)
            }
            if (course.endVideo) {
                formData.append(`course_${courseIndex}_endVideo`, course.endVideo)
            }
            
            // Add lesson video files
            if (course.videoFiles && course.videoFiles.length > 0) {
                course.videoFiles.forEach((file) => {
                    formData.append(`course_${courseIndex}_videoFiles`, file)
                })
            }
            
            // Add lesson document files
            if (course.docFiles && course.docFiles.length > 0) {
                course.docFiles.forEach((file) => {
                    formData.append(`course_${courseIndex}_docFiles`, file)
                })
            }
        })

        // Call the API to create course
        try {
            // Validate API endpoint
            if (!process.env.NEXT_PUBLIC_API_ENDPOINT) {
                throw new Error('API endpoint not configured. Please check NEXT_PUBLIC_API_ENDPOINT environment variable.')
            }
            
            const result = await createCourse(formData)
            
            // Show success message
            alert('Course created successfully!')
            
            // Reset form after successful submission
            window.location.reload() // Simple way to reset everything
            
        } catch (error: any) {
            let errorMessage = 'Error creating course. '
            if (error.response?.status === 401) {
                errorMessage += 'Authentication required. Please login again.'
            } else if (error.response?.status === 403) {
                errorMessage += 'Access denied. You may not have permission.'
            } else if (error.response?.status === 404) {
                errorMessage += 'API endpoint not found. Check server configuration.'
            } else if (error.response?.status >= 500) {
                errorMessage += 'Server error. Please try again later.'
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage += 'Network error. Check your connection.'
            } else {
                errorMessage += error.response?.data?.message || error.message || 'Unknown error occurred.'
            }
            
            alert(errorMessage)
        } finally {
            setIsSubmittingForm(false)
        }
    }

    return (
        <div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Course Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* COURSE Section */}
                    <Card className='border pb-5'>
                        <CardHeader className="bg-[#FEF9F2]  rounded-t-xl pt-2 py-5">
                            <CardTitle className="text-sm font-semibold text-[#F1C27D]">COURSE</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Title Course */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                    Course / Series Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Type your title here..."
                                    {...register('title', {
                                        required: 'Title is required',
                                        minLength: { value: 3, message: 'Title must be at least 3 characters' }
                                    })}
                                    className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>


                            {/* Student Enroll */}
                            <div className="space-y-2">
                                <Label htmlFor="available_site" className="text-sm font-medium text-gray-700">
                                    Student enroll <span className="text-red-500">*</span>
                                </Label>


                                <Input
                                    type="number"
                                    id="available_site"
                                    placeholder="E.g 15 student"
                                    {...register('available_site', {
                                        required: 'Student enroll is required',
                                        minLength: {
                                            value: 1,
                                            message: 'Please enter a valid student enrollment'
                                        }
                                    })}
                                    className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.available_site ? 'border-red-500' : ''}`}
                                />
                                {errors.available_site && (
                                    <p className="text-sm text-red-500">{errors.available_site.message}</p>
                                )}
                            </div>

                            {/* Course Type */}
                            <div className="space-y-2">
                                <Label htmlFor="course_type" className="text-sm font-medium text-gray-700">
                                    Course Type <span className="text-red-500">*</span>
                                </Label>
                                <Select onValueChange={(value) => setValue('course_type', value)}>
                                    <SelectTrigger className={`w-full ${showErrors && !watch('course_type') ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select course type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem className='cursor-pointer' value="regular">Regular</SelectItem>
                                        <SelectItem className='cursor-pointer' value="bootcamp">Bootcamp</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Upload Thumbnail */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Upload Thumbnail <span className="text-red-500">*</span>
                                </Label>
                                <div className={`p-3 border-2 border-dashed rounded-lg ${showErrors && !thumbnailFile ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                                    <UploadImage
                                        onFileSelect={(file) => {
                                            setThumbnailFile(file)
                                            setValue('thumbnail', file)
                                        }}
                                        thumbnailFile={thumbnailFile}
                                        onRemove={() => {
                                            setThumbnailFile(null)
                                            setValue('thumbnail', null)
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Course Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                    Course Description <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Type your description here..."
                                    {...register('description', {
                                        required: 'Description is required',
                                        minLength: { value: 10, message: 'Description must be at least 10 characters' }
                                    })}
                                    rows={4}
                                    className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.description ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Add Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="note" className="text-sm font-medium text-gray-700">
                                    Add Notes:
                                </Label>
                                <Textarea
                                    id="note"
                                    placeholder="Video-only version available"
                                    {...register('note')}
                                    rows={3}
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Total Price */}
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                                    Total Price
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="0.00"
                                        value={totalPrice.toFixed(2)}
                                        disabled
                                        className="w-full pl-8 border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Total price calculated from all module prices</p>
                            </div>
                        </CardContent>
                    </Card>


                    {/* CONTENT Section */}
                    <AddModules
                        control={control}
                        register={register}
                        errors={errors}
                        onTotalPriceChange={setTotalPrice}
                        setValue={setValue}
                    />
                </div>

                {/* Right Column - Set Availability */}
                <div className="lg:col-span-1 ">
                    <SetAvailability
                        courseTitle={watch('title')}
                        dateRange={dateRange}
                        onDateRangeChange={(range) => setValue('dateRange', range)}
                        isSubmitting={isSubmittingForm || isSubmitting}
                        onSubmit={handleSubmit(onSubmit)}
                        showErrors={showErrors}
                    />
                </div>
            </div>

        </div>
    )
}
