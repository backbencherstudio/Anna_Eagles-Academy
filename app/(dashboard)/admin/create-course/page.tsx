"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRange } from 'react-day-picker'
import UploadImage from '@/app/_components/Admin/CourseManagement/CreateCourse/UploadImage'
import SetAvailability from '@/app/_components/Admin/CourseManagement/CreateCourse/SetAvailability'
import AddModules from '@/app/_components/Admin/CourseManagement/CreateCourse/AddModules'


interface CourseFormData {
    title: string
    codeType: string
    studentEnroll: string
    courseType: string
    description: string
    notes: string
    price: string
    thumbnail: File | null
    modules: {
        id: string
        title: string
        files: File[]
        price: number
    }[]
    dateRange: DateRange | undefined
}

export default function CreateCoursePage() {
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [showErrors, setShowErrors] = useState(false)

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
            studentEnroll: '',
            courseType: '',
            description: '',
            notes: '',
            price: '',
            thumbnail: null,
            modules: [],
            dateRange: undefined
        },
        mode: 'onChange'
    })

    const dateRange = watch('dateRange')

    const onSubmit = (data: CourseFormData) => {
        // Validate required fields
        const validationErrors: string[] = []
        
        if (!data.title) validationErrors.push('Course title is required')
        if (!data.studentEnroll) validationErrors.push('Student enroll is required')
        if (!data.courseType) validationErrors.push('Course type is required')
        if (!data.description) validationErrors.push('Course description is required')
        if (!thumbnailFile) validationErrors.push('Course thumbnail is required')
        if (!data.dateRange?.from) validationErrors.push('Start date is required')
        if (!data.dateRange?.to) validationErrors.push('End date is required')
        
        // Check module validations
        data.modules.forEach((module, index) => {
            if (!module.title) validationErrors.push(`Module ${index + 1} title is required`)
            if (!module.price || module.price <= 0) validationErrors.push(`Module ${index + 1} price must be greater than 0`)
        })

        if (validationErrors.length > 0) {
            setValidationErrors(validationErrors)
            setShowErrors(true)
            return
        }

        // Clear any previous errors
        setValidationErrors([])
        setShowErrors(false)

        console.log('✅ Course Data Successfully Submitted:', {
            ...data,
            totalPrice: totalPrice,
            thumbnail: thumbnailFile?.name,
            modules: data.modules.map(module => ({
                ...module,
                price: module.price
            }))
        })
        
        // Add your publish logic here
        alert('Course published successfully!')
    }

    return (
        <div onSubmit={handleSubmit(onSubmit)}>
     

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

                            {/* Code Type */}
                            {/* <div className="space-y-2">
                                <Label htmlFor="codeType" className="text-sm font-medium text-gray-700">
                                    Code Type
                                </Label>
                                <Select onValueChange={(value) => setValue('codeType', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select code type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem className='cursor-pointer' value="paid-student">Paid Student</SelectItem>
                                        <SelectItem className='cursor-pointer' value="free-student">Free Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div> */}

                            {/* Student Enroll */}
                            <div className="space-y-2">
                                <Label htmlFor="studentEnroll" className="text-sm font-medium text-gray-700">
                                    Student enroll <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="studentEnroll"
                                    placeholder="E.g 15 student"
                                    {...register('studentEnroll', {
                                        required: 'Student enroll is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Please enter a valid student enrollment'
                                        }
                                    })}
                                    className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.studentEnroll ? 'border-red-500' : ''}`}
                                />
                                {errors.studentEnroll && (
                                    <p className="text-sm text-red-500">{errors.studentEnroll.message}</p>
                                )}
                            </div>

                            {/* Course Type */}
                            <div className="space-y-2">
                                <Label htmlFor="courseType" className="text-sm font-medium text-gray-700">
                                    Course Type <span className="text-red-500">*</span>
                                </Label>
                                <Select onValueChange={(value) => setValue('courseType', value)}>
                                    <SelectTrigger className={`w-full ${showErrors && !watch('courseType') ? 'border-red-500' : ''}`}>
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
                                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                                    Add Notes:
                                </Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Video-only version available"
                                    {...register('notes')}
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
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit(onSubmit)}
                        showErrors={showErrors}
                    />
                </div>
            </div>

        </div>
    )
}
