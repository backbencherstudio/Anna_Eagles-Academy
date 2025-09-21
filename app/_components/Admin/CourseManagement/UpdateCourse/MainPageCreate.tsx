"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import React, { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Label } from '@/components/ui/label'
import SetAvailability from '../CreateCourse/SetAvailability'
import UploadImage from '../CreateCourse/UploadImage'
import AddModules from '../CreateCourse/AddModules'

interface CourseFormState {
    title: string
    available_site: number
    course_type: string
    description: string
    note: string
    thumbnail: File | null
    dateRange: DateRange | undefined
}

export default function MainPageCreate() {
    const [courseForm, setCourseForm] = useState<CourseFormState>({
        title: '',
        available_site: 15,
        course_type: '',
        description: '',
        note: '',
        thumbnail: null,
        dateRange: undefined
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showErrors, setShowErrors] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)

    // Form field handlers
    const handleInputChange = (field: keyof CourseFormState, value: any) => {
        setCourseForm(prev => ({ ...prev, [field]: value }))
    }

    const handleThumbnailSelect = (file: File | null) => {
        handleInputChange('thumbnail', file)
    }

    const handleThumbnailRemove = () => {
        handleInputChange('thumbnail', null)
    }

    const handleDateRangeChange = (range: DateRange | undefined) => {
        handleInputChange('dateRange', range)
    }

    // Form validation
    const validateForm = (): boolean => {
        const errors: string[] = []

        if (!courseForm.title.trim()) errors.push('Course title is required')
        if (!courseForm.course_type) errors.push('Course type is required')
        if (!courseForm.description.trim()) errors.push('Course description is required')
        if (!courseForm.thumbnail) errors.push('Course thumbnail is required')
        if (!courseForm.dateRange?.from || !courseForm.dateRange?.to) {
            errors.push('Start and end dates are required')
        }
        if (courseForm.available_site < 1) errors.push('Student enrollment must be at least 1')

        if (errors.length > 0) {
            console.log('Validation errors:', errors)
            setShowErrors(true)
            return false
        }

        setShowErrors(false)
        return true
    }

    // Form submission
    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            // Simulate form submission
            console.log('Submitting course form:', {
                title: courseForm.title,
                available_site: courseForm.available_site,
                course_type: courseForm.course_type,
                description: courseForm.description,
                note: courseForm.note,
                thumbnail: courseForm.thumbnail?.name || 'No file',
                start_date: courseForm.dateRange?.from?.toISOString().split('T')[0],
                end_date: courseForm.dateRange?.to?.toISOString().split('T')[0],
                totalPrice: totalPrice
            })

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            console.log('Course created successfully!')

            // Reset form after successful submission
            setCourseForm({
                title: '',
                available_site: 15,
                course_type: '',
                description: '',
                note: '',
                thumbnail: null,
                dateRange: undefined
            })
            setTotalPrice(0)

        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
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
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${showErrors && !courseForm.title.trim() ? 'border-red-500 bg-red-50' : ''
                                    }`}
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
                                value={courseForm.available_site}
                                onChange={(e) => handleInputChange('available_site', parseInt(e.target.value) || 0)}
                                min="1"
                                className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${showErrors && courseForm.available_site < 1 ? 'border-red-500 bg-red-50' : ''
                                    }`}
                            />
                        </div>

                        {/* Course Type */}
                        <div className="space-y-2">
                            <Label htmlFor="course_type" className="text-sm font-medium text-gray-700">
                                Course Type <span className="text-red-500">*</span>
                            </Label>
                            <Select value={courseForm.course_type} onValueChange={(value) => handleInputChange('course_type', value)}>
                                <SelectTrigger className={`w-full ${showErrors && !courseForm.course_type ? 'border-red-500 bg-red-50' : ''
                                    }`}>
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
                            <div className={`px-3 py-2 border-2 border-dashed rounded-lg ${showErrors && !courseForm.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}>
                                <UploadImage
                                    onFileSelect={handleThumbnailSelect}
                                    thumbnailFile={courseForm.thumbnail}
                                    onRemove={handleThumbnailRemove}
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
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={4}
                                className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${showErrors && !courseForm.description.trim() ? 'border-red-500 bg-red-50' : ''
                                    }`}
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
                                onChange={(e) => handleInputChange('note', e.target.value)}
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
                                    value={totalPrice?.toFixed(2) || '0.00'}
                                    disabled
                                    className="w-full pl-8 border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Total price calculated from all module prices</p>
                        </div>
                    </CardContent>
                </Card>


                {/* CONTENT Section - Module Management */}
                <AddModules />
            </div>

            {/* Right Column - Set Availability */}
            <div className="lg:col-span-1 ">
                <SetAvailability
                    courseTitle={courseForm.title || 'Untitled Course'}
                    dateRange={courseForm.dateRange}
                    onDateRangeChange={handleDateRangeChange}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                    showErrors={showErrors}
                />
            </div>
        </div>
    )
}
