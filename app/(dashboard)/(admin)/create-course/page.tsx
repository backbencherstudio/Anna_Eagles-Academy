"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRange } from 'react-day-picker'
import UploadImage from '@/app/(dashboard)/_components/Admin/CourseManagement/CreateCourse/UploadImage'
import SetAvailability from '@/app/(dashboard)/_components/Admin/CourseManagement/CreateCourse/SetAvailability'
import AddModules from '@/app/(dashboard)/_components/Admin/CourseManagement/CreateCourse/AddModules'


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
    }[]
    dateRange: DateRange | undefined
}

export default function CreateCoursePage() {
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

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
        }
    })

    const dateRange = watch('dateRange')

    const onSubmit = (data: CourseFormData) => {
        console.log('Course Data:', data)
        // Add your publish logic here
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
                                    Student enroll
                                </Label>
                                <Input
                                    id="studentEnroll"
                                    placeholder="E.g 15 student"
                                    {...register('studentEnroll')}
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Course Type */}
                            <div className="space-y-2">
                                <Label htmlFor="courseType" className="text-sm font-medium text-gray-700">
                                    Course Type
                                </Label>
                                <Select onValueChange={(value) => setValue('courseType', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select course type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem className='cursor-pointer' value="regular">Regular</SelectItem>
                                        <SelectItem className='cursor-pointer' value="bootcamp">Bootcamp</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Upload Thumbnail */}
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
                                    Total Price <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="99.99"
                                        {...register('price', {
                                            required: 'Price is required',
                                            min: { value: 0, message: 'Price must be greater than or equal to 0' }
                                        })}
                                        className={`w-full pl-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.price ? 'border-red-500' : ''
                                            }`}
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-sm text-red-500">{errors.price.message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>


                    {/* CONTENT Section */}
                    <AddModules
                        control={control}
                        register={register}
                        errors={errors}
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
                    />
                </div>
            </div>

        </div>
    )
}
