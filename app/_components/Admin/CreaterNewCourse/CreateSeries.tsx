'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import UploadImage from '../CourseManagement/CreateCourse/UploadImage'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import ButtonSpring from '@/components/Resuable/ButtonSpring'
import { useCreateSeriesMutation, useGetSingleSeriesQuery, useUpdateSingleSeriesMutation } from '@/rtk/api/admin/managementCourseApis'
import { useRouter } from 'next/navigation'
type CreateSeriesProps = {
    seriesId?: string | null
    onNext?: (data: {
        title: string
        enrollCount: number
        courseType: string
        thumbnailFile: File | null
        description: string
        note?: string
    }) => void
}
type SeriesFormValues = {
    title: string
    enrollCount: number | ''
    courseType: string
    thumbnailFile: File | null
    description: string
    note?: string
}

export default function CreateSeries({ seriesId, onNext }: CreateSeriesProps) {
    const router = useRouter()
    const [isEditMode, setIsEditMode] = React.useState(false)
    const { data: existingSeriesResponse } = useGetSingleSeriesQuery(seriesId as string, {
        skip: !seriesId,
    })
    const [createSeries, { isLoading: isCreating }] = useCreateSeriesMutation()
    const [updateSeries, { isLoading: isUpdating }] = useUpdateSingleSeriesMutation()
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = useForm<SeriesFormValues>({
        defaultValues: {
            title: '',
            enrollCount: '',
            courseType: '',
            thumbnailFile: null,
            description: '',
            note: '',
        },
        mode: 'onTouched',
    })

    React.useEffect(() => {
        register('courseType', { required: 'Course type is required' })
        register('thumbnailFile', {
            validate: (file) => (isEditMode || !!file ? true : 'Thumbnail is required'),
        })
    }, [register, isEditMode])

    // Prefill when series exists
    React.useEffect(() => {
        const series = existingSeriesResponse?.data
        if (!series) return
        // Default to view mode when a series exists
        setIsEditMode(false)
        setValue('title', series.title)
        setValue('enrollCount', series.available_site ?? '')
        setValue('courseType', series.course_type ?? '')
        setValue('description', series.description ?? '')
        setValue('note', series.note ?? '')
    }, [existingSeriesResponse, setValue])

    const [submitting, setSubmitting] = React.useState(false)
    const onSubmit = async (data: SeriesFormValues) => {
        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('title', data.title)
            formData.append('description', data.description)
            if (data.note) formData.append('note', data.note)
            // Only append enroll count for bootcamp courses
            if (data.courseType === 'bootcamp') {
                formData.append('available_site', String(Number(data.enrollCount)))
            } else {
                // For regular courses, set a default value or 0
                formData.append('available_site', '0')
            }
            formData.append('course_type', data.courseType)
            if (data.thumbnailFile) formData.append('thumbnail', data.thumbnailFile)

            if (isEditMode && seriesId) {
                const res: any = await updateSeries({ series_id: seriesId, formData })
                // For updates, call onNext to proceed to next step
                onNext?.({
                    title: data.title,
                    enrollCount: data.courseType === 'bootcamp' ? Number(data.enrollCount) : 0,
                    courseType: data.courseType,
                    thumbnailFile: data.thumbnailFile,
                    description: data.description,
                    note: data.note,
                })
            } else {
                const res: any = await createSeries(formData)
                if ('data' in res && res.data?.data?.id) {
                    router.push(`/admin/create-course/${res.data.data.id}?step=2`)
                }
            }
            setIsEditMode(false)
        } finally {
            setSubmitting(false)
        }
    }
    const courseType = watch('courseType')
    const thumbnailFile = watch('thumbnailFile')
    const seriesExists = !!(seriesId || existingSeriesResponse?.data?.id)




    return (
        <div>
            {/* COURSE Section */}
            <Card className='border pb-5'>
                <CardHeader className="bg-[#FEF9F2]  rounded-t-xl pt-2 py-5 flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-[#F1C27D]">COURSE</CardTitle>
                    <div>

                        {seriesId && (
                            <div className="flex items-center justify-end mb-2">
                                <button
                                    type="button"
                                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                                    onClick={() => setIsEditMode((p) => !p)}
                                >
                                    {/* <Pencil size={16} /> */}
                                    {isEditMode ? 'Cancel' : 'Edit'}
                                </button>
                            </div>
                        )}
                    </div>
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
                            {...register('title', { required: 'Title is required' })}
                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            disabled={!!seriesId && !isEditMode}
                        />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                    </div>



                    {/* Course Type */}
                    <div className="space-y-2">
                        <Label htmlFor="course_type" className="text-sm font-medium text-gray-700">
                            Course Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={courseType} onValueChange={(value) => setValue('courseType', value, { shouldValidate: true })}>
                            <SelectTrigger className={`w-full `} disabled={!!seriesId && !isEditMode}>
                                <SelectValue placeholder="Select course type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem className='cursor-pointer' value="regular">Regular</SelectItem>
                                <SelectItem className='cursor-pointer' value="bootcamp">Bootcamp</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.courseType && <p className="text-xs text-red-500">Course type is required</p>}
                    </div>


                    {/* Student Enroll - Only show for Bootcamp */}
                    {courseType === 'bootcamp' && (
                        <div className="space-y-2">
                            <Label htmlFor="available_site" className="text-sm font-medium text-gray-700">
                                Student enroll <span className="text-red-500">*</span>
                            </Label>

                            <Input
                                type="number"
                                id="available_site"
                                placeholder="E.g 15 student"
                                {...register('enrollCount', {
                                    required: courseType === 'bootcamp' ? 'Enroll count is required' : false,
                                    validate: (v) => {
                                        if (courseType === 'bootcamp') {
                                            return (v === '' ? false : Number(v) > 0) || 'Must be greater than 0'
                                        }
                                        return true
                                    },
                                    valueAsNumber: true,
                                })}
                                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                disabled={!!seriesId && !isEditMode}
                            />
                            {errors.enrollCount && <p className="text-xs text-red-500">{errors.enrollCount.message as string}</p>}
                        </div>
                    )}



                    {/* Upload Thumbnail */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Upload Thumbnail <span className="text-red-500">*</span>
                        </Label>
                        <div className={`px-3 py-2 border-2 border-dashed rounded-lg ${!!seriesId && !isEditMode ? 'opacity-60 pointer-events-none' : ''}`}>
                            <UploadImage
                                onFileSelect={(file) => {
                                    setValue('thumbnailFile', file, { shouldValidate: true })
                                }}
                                thumbnailFile={thumbnailFile}
                                existingUrl={existingSeriesResponse?.data?.thumbnail_url || null}
                                onRemove={() => {
                                    setValue('thumbnailFile', null, { shouldValidate: true })
                                }}
                            />
                            <p className="text-xs text-gray-400 mt-2 ">Thumbnail should be 330 * 200 pixels</p>
                            {errors.thumbnailFile && <p className="text-xs text-red-500">Thumbnail is required</p>}
                            {isEditMode && existingSeriesResponse?.data?.thumbnail && (
                                <p className="text-xs text-gray-500 mt-1">Existing thumbnail: {existingSeriesResponse.data.thumbnail}</p>
                            )}
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
                            {...register('description', { required: 'Description is required' })}
                            rows={4}
                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            disabled={!!seriesId && !isEditMode}
                        />
                        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
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
                            disabled={!!seriesId && !isEditMode}
                        />
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex items-center justify-end gap-2'>
                        {isEditMode ? (
                            <Button disabled={submitting || isUpdating} type='submit' className='bg-[#0F2598] hover:bg-[#0F2598]/80 cursor-pointer text-white inline-flex items-center gap-2'>
                                {(submitting || isUpdating) && <ButtonSpring loading variant='spinner' size={16} color='#ffffff' />}
                                {submitting || isUpdating ? 'Processing...' : 'Update'}
                            </Button>
                        ) : (
                            <>
                                {!seriesExists && (
                                    <Button disabled={submitting || isCreating} type='submit' className='bg-[#0F2598] hover:bg-[#0F2598]/80 cursor-pointer text-white inline-flex items-center gap-2'>
                                        {(submitting || isCreating) && <ButtonSpring loading variant='spinner' size={16} color='#ffffff' />}
                                        {submitting || isCreating ? 'Processing...' : 'Save'}
                                    </Button>
                                )}

                                {seriesExists && (
                                    <Button
                                        type='button'
                                        onClick={() => {
                                            const vals = getValues()
                                            if (onNext) {
                                                onNext({
                                                    title: vals.title,
                                                    enrollCount: vals.courseType === 'bootcamp' ? Number(vals.enrollCount || 0) : 0,
                                                    courseType: vals.courseType,
                                                    thumbnailFile: vals.thumbnailFile,
                                                    description: vals.description,
                                                    note: vals.note,
                                                })
                                            } else {
                                                router.push('/admin/create-new-course?step=2')
                                            }
                                        }}
                                        className='bg-[#0F2598] hover:bg-[#0F2598]/80 cursor-pointer text-white inline-flex items-center gap-2'
                                    >
                                        Next
                                    </Button>
                                )}
                            </>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
