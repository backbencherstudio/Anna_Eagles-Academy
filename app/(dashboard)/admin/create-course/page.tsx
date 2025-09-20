"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UploadImage from '@/app/_components/Admin/CourseManagement/CreateCourse/UploadImage'
import SetAvailability from '@/app/_components/Admin/CourseManagement/CreateCourse/SetAvailability'
import AddModules from '@/app/_components/Admin/CourseManagement/CreateCourse/AddModules'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
    updateCourseField,
    setValidationErrors,
    setShowErrors,
    createCourseAsync,
    resetForm,
    clearError,
    clearSuccess,
    fetchCoursesAsync,
    PAGINATION_CONSTANTS
} from '@/redux/slices/courseManagementSlice'
import type { CourseFormData } from '@/redux/slices/courseManagementSlice'
import toast from 'react-hot-toast'

export default function CreateCoursePage() {
    const dispatch = useAppDispatch()
    const {
        courseForm,
        isSubmitting,
        showErrors,
        validationErrors,
        error,
        successMessage
    } = useAppSelector(state => state.courseManagement)

    // Handle success and error messages
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(clearSuccess())

            dispatch(fetchCoursesAsync({
                search: '',
                page: PAGINATION_CONSTANTS.DEFAULT_PAGE,
                limit: PAGINATION_CONSTANTS.DEFAULT_LIMIT
            }))
        }
        if (error) {
            toast.error(error)
            dispatch(clearError())
        }
    }, [successMessage, error, dispatch])

    const onSubmit = async (data: CourseFormData) => {
        // Prevent multiple submissions
        if (isSubmitting) return

        // Use Redux state for validation
        const currentValidationErrors: string[] = []

        if (!courseForm.title) currentValidationErrors.push('Course title is required')
        if (!courseForm.available_site) currentValidationErrors.push('Student enroll is required')
        if (!courseForm.course_type) currentValidationErrors.push('Course type is required')
        if (!courseForm.description) currentValidationErrors.push('Course description is required')
        if (!courseForm.thumbnail) currentValidationErrors.push('Course thumbnail is required')
        if (!courseForm.dateRange?.from) currentValidationErrors.push('Start date is required')
        if (!courseForm.dateRange?.to) currentValidationErrors.push('End date is required')

        // Check module validations
        courseForm.courses.forEach((course, index) => {
            if (!course.title) currentValidationErrors.push(`Module ${index + 1} title is required`)
            if (!course.price || course.price <= 0) currentValidationErrors.push(`Module ${index + 1} price must be greater than 0`)
        })

        if (currentValidationErrors.length > 0) {
            dispatch(setValidationErrors(currentValidationErrors))
            dispatch(setShowErrors(true))
            return
        }

        dispatch(setValidationErrors([]))
        dispatch(setShowErrors(false))

        // Force update form data to ensure all files are collected
        await new Promise(resolve => setTimeout(resolve, 100))

        // Prepare FormData for submission using Redux state
        const formData = new FormData()

        // Add basic course data
        formData.append('title', courseForm.title)
        formData.append('description', courseForm.description)
        formData.append('start_date', courseForm.dateRange?.from?.toISOString().split('T')[0] || '')
        formData.append('end_date', courseForm.dateRange?.to?.toISOString().split('T')[0] || '')
        formData.append('note', courseForm.note)
        formData.append('available_site', courseForm.available_site.toString())
        formData.append('course_type', courseForm.course_type)

        // Add thumbnail
        if (courseForm.thumbnail) {
            formData.append('thumbnail', courseForm.thumbnail)
        }

        // Add courses data with position field
        const coursesData = courseForm.courses.map((course, index) => ({
            title: course.title,
            position: index,
            price: course.price,
            lessons_files: course.lessons_files
        }))
        formData.append('courses', JSON.stringify(coursesData))

        // Add course files with proper naming convention
        courseForm.courses.forEach((course, courseIndex) => {
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

        // Dispatch async action to create course
        dispatch(createCourseAsync(formData))
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
                                    value={courseForm.title}
                                    onChange={(e) => dispatch(updateCourseField({ field: 'title', value: e.target.value }))}
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
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
                                    value={courseForm.available_site || ''}
                                    onChange={(e) => dispatch(updateCourseField({ field: 'available_site', value: parseInt(e.target.value) || 0 }))}
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Course Type */}
                            <div className="space-y-2">
                                <Label htmlFor="course_type" className="text-sm font-medium text-gray-700">
                                    Course Type <span className="text-red-500">*</span>
                                </Label>
                                <Select onValueChange={(value) => dispatch(updateCourseField({ field: 'course_type', value }))}>
                                    <SelectTrigger className={`w-full ${showErrors && !courseForm.course_type ? 'border-red-500' : ''}`}>
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
                                <div className={`px-3 py-2 border-2 border-dashed rounded-lg ${showErrors && !courseForm.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                                    <UploadImage
                                        onFileSelect={(file) => {
                                            dispatch(updateCourseField({ field: 'thumbnail', value: file }))
                                        }}
                                        thumbnailFile={courseForm.thumbnail}
                                        onRemove={() => {
                                            dispatch(updateCourseField({ field: 'thumbnail', value: null }))
                                        }}
                                    />
                                    <p className="text-xs text-gray-400 mt-2 ">Thumbnail should be 330 * 200 pixels</p>
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
                                    value={courseForm.description}
                                    onChange={(e) => dispatch(updateCourseField({ field: 'description', value: e.target.value }))}
                                    rows={4}
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Add Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="note" className="text-sm font-medium text-gray-700">
                                    Add Notes:
                                </Label>
                                <Textarea
                                    id="note"
                                    placeholder="Video-only version available"
                                    value={courseForm.note}
                                    onChange={(e) => dispatch(updateCourseField({ field: 'note', value: e.target.value }))}
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
                                        value={courseForm.price.toFixed(2)}
                                        disabled
                                        className="w-full pl-8 border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Total price calculated from all module prices</p>
                            </div>
                        </CardContent>
                    </Card>


                    {/* CONTENT Section */}
                    <AddModules />
                </div>

                {/* Right Column - Set Availability */}
                <div className="lg:col-span-1 ">
                    <SetAvailability
                        courseTitle={courseForm.title}
                        dateRange={courseForm.dateRange}
                        onDateRangeChange={(range) => dispatch(updateCourseField({ field: 'dateRange', value: range }))}
                        isSubmitting={isSubmitting}
                        onSubmit={() => onSubmit(courseForm)}
                        showErrors={showErrors}
                    />
                </div>
            </div>

        </div>
    )
}
