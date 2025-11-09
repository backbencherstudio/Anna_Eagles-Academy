'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import ISO6391 from 'iso-639-1'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, ChevronDown, Check } from 'lucide-react'
import UploadImage from '../CourseManagement/CreateCourse/UploadImage'
import ButtonSpring from '@/components/Resuable/ButtonSpring'
import { useCreateSeriesMutation, useGetSingleSeriesQuery, useUpdateSingleSeriesMutation } from '@/rtk/api/admin/managementCourseApis'
type CreateSeriesProps = {
    seriesId?: string | null
    onNext?: (data: {
        title: string
        enrollCount: number
        courseType: string
        thumbnailFile: File | null
        description: string
        note?: string
        language?: string
    }) => void
}
type SeriesFormValues = {
    title: string
    enrollCount: number | ''
    courseType: string
    thumbnailFile: File | null
    description: string
    note?: string
    language: string
}

export default function CreateSeries({ seriesId, onNext }: CreateSeriesProps) {
    const router = useRouter()
    const [isEditMode, setIsEditMode] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [isLanguageOpen, setIsLanguageOpen] = useState(false)
    const [languageSearchQuery, setLanguageSearchQuery] = useState('')
    
    const { data: existingSeriesResponse } = useGetSingleSeriesQuery(seriesId as string, { skip: !seriesId })
    const [createSeries, { isLoading: isCreating }] = useCreateSeriesMutation()
    const [updateSeries, { isLoading: isUpdating }] = useUpdateSingleSeriesMutation()
    
    const { register, handleSubmit, setValue, watch, getValues, formState: { errors } } = useForm<SeriesFormValues>({
        defaultValues: {
            title: '',
            enrollCount: '',
            courseType: '',
            thumbnailFile: null,
            description: '',
            note: '',
            language: '',
        },
        mode: 'onTouched',
    })

    const courseType = watch('courseType')
    const thumbnailFile = watch('thumbnailFile')
    const language = watch('language')
    const isDisabled = !!seriesId && !isEditMode
    const seriesExists = !!(seriesId || existingSeriesResponse?.data?.id)

    useEffect(() => {
        register('courseType', { required: 'Course type is required' })
        register('language', { required: 'Language is required' })
        register('thumbnailFile', {
            validate: (file) => (isEditMode || !!file ? true : 'Thumbnail is required'),
        })
    }, [register, isEditMode])

    useEffect(() => {
        const series = existingSeriesResponse?.data
        if (!series) return
        setIsEditMode(false)
        setValue('title', series.title)
        setValue('enrollCount', series.available_site ?? '')
        setValue('courseType', series.course_type ?? '')
        setValue('description', series.description ?? '')
        setValue('note', series.note ?? '')
        setValue('language', series.language ?? '')
    }, [existingSeriesResponse, setValue])
    const languages = useMemo(() => {
        return ISO6391.getAllCodes()
            .map((code) => ({
                code,
                name: ISO6391.getNativeName(code) || ISO6391.getName(code),
                englishName: ISO6391.getName(code),
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [])

    const languageDropdownRef = useRef<HTMLDivElement>(null)
    const debouncedLanguageSearch = useDebounce(languageSearchQuery, 300)

    const filteredLanguages = useMemo(() => {
        if (!debouncedLanguageSearch) return languages
        const query = debouncedLanguageSearch.toLowerCase()
        return languages.filter((lang) =>
            lang.name.toLowerCase().includes(query) ||
            lang.englishName.toLowerCase().includes(query) ||
            lang.code.toLowerCase().includes(query)
        )
    }, [languages, debouncedLanguageSearch])

    const selectedLanguageName = useMemo(() => {
        return languages.find((lang) => lang.code === language)?.name || null
    }, [language, languages])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setIsLanguageOpen(false)
                setLanguageSearchQuery('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLanguageSelect = (langCode: string) => {
        setValue('language', langCode, { shouldValidate: true })
        setIsLanguageOpen(false)
        setLanguageSearchQuery('')
    }

    const onSubmit = async (data: SeriesFormValues) => {
        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('title', data.title)
            formData.append('description', data.description)
            formData.append('course_type', data.courseType)
            formData.append('available_site', data.courseType === 'bootcamp' ? String(Number(data.enrollCount)) : '0')
            if (data.note) formData.append('note', data.note)
            if (data.language) formData.append('language', data.language)
            if (data.thumbnailFile) formData.append('thumbnail', data.thumbnailFile)

            if (isEditMode && seriesId) {
                await updateSeries({ series_id: seriesId, formData })
                onNext?.({
                    title: data.title,
                    enrollCount: data.courseType === 'bootcamp' ? Number(data.enrollCount) : 0,
                    courseType: data.courseType,
                    thumbnailFile: data.thumbnailFile,
                    description: data.description,
                    note: data.note,
                    language: data.language,
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




    return (
        <div>
            {/* COURSE Section */}
            <Card className='border pb-5'>
                <CardHeader className="bg-[#FEF9F2] rounded-t-xl pt-2 py-5 flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-[#F1C27D]">COURSE</CardTitle>
                    {seriesId && (
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-700"
                            onClick={() => setIsEditMode((p) => !p)}
                        >
                            {isEditMode ? 'Cancel' : 'Edit'}
                        </button>
                    )}
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
                            disabled={isDisabled}
                        />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                    </div>



                    {/* Course Type */}
                    <div className="space-y-2">
                        <Label htmlFor="course_type" className="text-sm font-medium text-gray-700">
                            Course Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={courseType} onValueChange={(value) => setValue('courseType', value, { shouldValidate: true })}>
                            <SelectTrigger className="w-full" disabled={isDisabled}>
                                <SelectValue placeholder="Select course type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="regular">Regular</SelectItem>
                                <SelectItem value="bootcamp">Bootcamp</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.courseType && <p className="text-xs text-red-500">Course type is required</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                            Language <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative" ref={languageDropdownRef}>
                            <div
                                className={`border border-gray-300 rounded-lg p-2 flex items-center cursor-pointer  transition-all bg-white ${isDisabled ? 'opacity-60 pointer-events-none' : ''}`}
                                onClick={() => !isDisabled && setIsLanguageOpen(!isLanguageOpen)}
                            >
                                <span className={`text-sm flex-1 ${selectedLanguageName ? 'text-gray-700' : 'text-gray-500'}`}>
                                    {selectedLanguageName || 'Select language'}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                            </div>
                            {isLanguageOpen && !isDisabled && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
                                    <div className="p-2 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search languages..."
                                                value={languageSearchQuery}
                                                onChange={(e) => setLanguageSearchQuery(e.target.value)}
                                                className="pl-8"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredLanguages.length > 0 ? (
                                            filteredLanguages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => handleLanguageSelect(lang.code)}
                                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm flex items-center justify-between"
                                                >
                                                    <div>
                                                        <div className="text-gray-700 font-medium">{lang.name}</div>
                                                        {lang.name !== lang.englishName && (
                                                            <div className="text-gray-500 text-xs">{lang.englishName}</div>
                                                        )}
                                                    </div>
                                                    {language === lang.code && <Check className="w-4 h-4 text-blue-600" />}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                {languageSearchQuery ? 'No languages found' : 'No languages available'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.language && <p className="text-xs text-red-500">{errors.language.message}</p>}
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
                                    validate: (v) => courseType === 'bootcamp' ? (v !== '' && Number(v) > 0) || 'Must be greater than 0' : true,
                                    valueAsNumber: true,
                                })}
                                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                disabled={isDisabled}
                            />
                            {errors.enrollCount && <p className="text-xs text-red-500">{errors.enrollCount.message as string}</p>}
                        </div>
                    )}



                    {/* Upload Thumbnail */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Upload Thumbnail <span className="text-red-500">*</span>
                        </Label>
                        <div className={`px-3 py-2 border-2 border-dashed rounded-lg ${isDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
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
                            disabled={isDisabled}
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
                            disabled={isDisabled}
                        />
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center justify-end gap-2">
                        {isEditMode ? (
                            <Button disabled={submitting || isUpdating} type="submit" className="bg-[#0F2598] hover:bg-[#0F2598]/80 text-white">
                                {(submitting || isUpdating) && <ButtonSpring loading variant="spinner" size={16} color="#ffffff" />}
                                {submitting || isUpdating ? 'Processing...' : 'Update'}
                            </Button>
                        ) : !seriesExists ? (
                            <Button disabled={submitting || isCreating} type="submit" className="bg-[#0F2598] hover:bg-[#0F2598]/80 text-white">
                                {(submitting || isCreating) && <ButtonSpring loading variant="spinner" size={16} color="#ffffff" />}
                                {submitting || isCreating ? 'Processing...' : 'Save'}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => {
                                    const vals = getValues()
                                    onNext?.({
                                        title: vals.title,
                                        enrollCount: vals.courseType === 'bootcamp' ? Number(vals.enrollCount || 0) : 0,
                                        courseType: vals.courseType,
                                        thumbnailFile: vals.thumbnailFile,
                                        description: vals.description,
                                        note: vals.note,
                                        language: vals.language,
                                    }) || router.push('/admin/create-new-course?step=2')
                                }}
                                className="bg-[#0F2598] hover:bg-[#0F2598]/80 text-white"
                            >
                                Next
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
