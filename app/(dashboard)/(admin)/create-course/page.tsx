"use client"

import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import { Separator } from '@/components/ui/separator'
import { Plus, Paperclip, Image, Calendar as CalendarIcon } from 'lucide-react'
import DateRangePicker from '@/components/ui/DateRangePicker'

interface Module {
    id: string
    title: string
    files: File[]
}

interface CourseFormData {
    title: string
    description: string
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
    const [moduleFiles, setModuleFiles] = useState<{ [key: string]: File[] }>({})

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
            description: '',
            price: '',
            thumbnail: null,
            modules: [{ id: '1', title: '', files: [] }],
            dateRange: undefined
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "modules"
    })

    const dateRange = watch('dateRange')

    const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setThumbnailFile(file)
            setValue('thumbnail', file)
        }
    }

    const handleFileUpload = (moduleId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        setModuleFiles(prev => ({
            ...prev,
            [moduleId]: [...(prev[moduleId] || []), ...files]
        }))
    }

    const removeFile = (moduleId: string, fileIndex: number) => {
        setModuleFiles(prev => ({
            ...prev,
            [moduleId]: prev[moduleId]?.filter((_, index) => index !== fileIndex) || []
        }))
    }

    const addModule = () => {
        const newModule = {
            id: Date.now().toString(),
            title: '',
            files: []
        }
        append(newModule)
    }

    const removeModule = (moduleId: string, index: number) => {
        if (fields.length > 1) {
            remove(index)
            // Remove files for this module
            const newModuleFiles = { ...moduleFiles }
            delete newModuleFiles[moduleId]
            setModuleFiles(newModuleFiles)
        }
    }

    const onSubmit = (data: CourseFormData) => {
        console.log('Course Data:', data)
        console.log('Module Files:', moduleFiles)
        // Add your publish logic here
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Course Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* COURSE Section */}
                    <Card className='border pb-5'>
                        <CardHeader className="bg-[#FEF9F2]  rounded-t-xl pt-2 py-5">
                            <CardTitle className="text-sm font-semibold text-[#757575]">COURSE</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Title Course */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                    Title Course <span className="text-red-500">*</span>
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

                            {/* Upload Thumbnail */}
                            <div className="space-y-2">

                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('thumbnail-upload')?.click()}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <Image className="h-4 w-4" />
                                        Upload Thumbnail
                                    </Button>
                                    <input
                                        id="thumbnail-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        className="hidden"
                                    />
                                </div>
                                {/* Thumbnail Preview */}
                                {thumbnailFile && (
                                    <div className="mt-3">
                                        <div className="relative inline-block">
                                            <img
                                                src={URL.createObjectURL(thumbnailFile)}
                                                alt="Course thumbnail"
                                                className="w-24 h-24 object-cover rounded-lg border cursor-pointer"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setThumbnailFile(null)
                                                    setValue('thumbnail', null)
                                                }}
                                                className="absolute cursor-pointer -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{thumbnailFile.name}</p>
                                    </div>
                                )}
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

                            {/* Price */}
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                                    Price <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="0.00"
                                    {...register('price', {
                                        required: 'Price is required',
                                        min: { value: 0, message: 'Price must be greater than or equal to 0' }
                                    })}
                                    className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.price ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">{errors.price.message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* CONTENT Section */}
                    <Card className='border pb-5'>
                        <CardHeader className="bg-[#FEF9F2]  rounded-t-xl pt-2 py-5">
                            <CardTitle className="text-sm font-semibold text-[#757575] uppercase">Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((module, index) => (
                                <div key={module.id} className="space-y-3 pb-5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">
                                            Module {index + 1} <span className="text-red-500">*</span>
                                        </Label>
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeModule(module.id, index)}
                                                className="text-red-600 cursor-pointer hover:text-red-700"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    <Textarea
                                        placeholder="Type your title here..."
                                        {...register(`modules.${index}.title` as const, {
                                            required: `Module ${index + 1} title is required`
                                        })}
                                        className={`w-full ${errors.modules?.[index]?.title ? 'border-red-500' : ''
                                            }`}
                                    />
                                    {errors.modules?.[index]?.title && (
                                        <p className="text-sm text-red-500">{errors.modules[index]?.title?.message}</p>
                                    )}

                                    <div className="flex items-center gap-3 ">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById(`file-upload-${module.id}`)?.click()}
                                            className="flex items-center gap-2 cursor-pointer mt-2"
                                        >
                                            <Paperclip className="h-4 w-4" />
                                            Upload Attachment
                                        </Button>
                                        <input
                                            id={`file-upload-${module.id}`}
                                            type="file"
                                            multiple
                                            accept="video/*,application/pdf,image/*,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                                            onChange={(e) => handleFileUpload(module.id, e)}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Display uploaded files */}
                                    {moduleFiles[module.id] && moduleFiles[module.id].length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {moduleFiles[module.id].map((file, fileIndex) => (
                                                <div key={fileIndex} className="text-sm text-gray-600 flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <Paperclip className="h-3 w-3" />
                                                        {file.name}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFile(module.id, fileIndex)}
                                                        className="text-red-600 cursor-pointer hover:text-red-700 h-6 w-6 p-0"
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Add Module Button */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg ">
                                <Button
                                    type="button"
                                    onClick={addModule}
                                    variant="ghost"
                                    className="w-full py-6 cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800"
                                >
                                    <Plus className="h-5 w-5" />
                                    Add Module
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Set Availability */}
                <div className="lg:col-span-1">
                    <Card className='border py-5 relative'>
                        <CardHeader>
                            <CardTitle className="text-md font-semibold">Set Availability</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Course name: {watch('title') || 'Untitled Course'}</Label>
                            </div>
                            
                            <Separator />

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                                    <DateRangePicker
                                        value={dateRange}
                                        onChange={(range) => setValue('dateRange', range)}
                                        placeholder="Select start date"
                                        showAs="start"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">End Date</Label>
                                    <DateRangePicker
                                        value={dateRange}
                                        onChange={(range) => setValue('dateRange', range)}
                                        placeholder="Select end date"
                                        showAs="end"
                                    />
                                </div>
                            </div>

                            <Separator />

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/80 text-white"
                                size="lg"
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Course'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </form>
    )
}
