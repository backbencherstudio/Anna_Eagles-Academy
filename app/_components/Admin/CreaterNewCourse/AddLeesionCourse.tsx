"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Trash2, Video, Pencil } from 'lucide-react'
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import ButtonSpring from '@/components/Resuable/ButtonSpring'
import { getCookie } from '@/lib/tokenUtils'
import { useCreateLessonMutation, useGetAllLessonsQuery, useGetAllModulesQuery, useGetSingleLessonQuery } from '@/redux/api/managementCourseApis'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCurrentSeriesId } from '@/redux/slices/managementCourseSlice'

type LessonForm = {
    title: string
}

type SavedLesson = {
    id: string
    title: string
    videoName: string | null
    docCount: number
}

type AddLeesionCourseProps = {
    onLessonsAdded?: () => void
}

export default function AddLeesionCourse({ onLessonsAdded }: AddLeesionCourseProps) {
    const { register, formState: { errors }, trigger, reset, setValue, getValues } = useForm<LessonForm>({
        defaultValues: { title: '' },
        mode: 'onTouched',
    })

    const [selectedModule, setSelectedModule] = useState<string>('')
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [docFiles, setDocFiles] = useState<File[]>([])
    const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null)
    const [existingDocUrl, setExistingDocUrl] = useState<string | null>(null)
    const [fileTouched, setFileTouched] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [savedByModule, setSavedByModule] = useState<Record<string, SavedLesson[]>>({})
    const [editingId, setEditingId] = useState<string | null>(null)

    const hasAnyFile = Boolean(videoFile) || docFiles.length > 0 || Boolean(existingVideoUrl) || Boolean(existingDocUrl)

    // Load modules from API for current series (via slice)
    const dispatch = useAppDispatch()
    const seriesIdFromStore = useAppSelector((s) => s.managementCourse.currentSeriesId)
    const cookieSeriesId = typeof document !== 'undefined' ? (getCookie('series_id') as string | null) : null
    React.useEffect(() => {
        if (cookieSeriesId) dispatch(setCurrentSeriesId(cookieSeriesId))
    }, [cookieSeriesId, dispatch])
    const activeSeriesId = seriesIdFromStore || cookieSeriesId || ''
    const { data: modulesResp, isLoading: modulesLoading } = useGetAllModulesQuery(activeSeriesId, { skip: !activeSeriesId })
    const modules: Array<{ id: string; title: string }> = React.useMemo(() => {
        const resp: any = modulesResp as any
        const raw = resp?.data
        let list: any[] = []
        if (Array.isArray(raw?.courses)) list = raw.courses
        else if (Array.isArray(raw)) list = raw
        else if (Array.isArray(raw?.data)) list = raw.data
        return list.map((m: any) => ({ id: m.id, title: m.title }))
    }, [modulesResp])
    React.useEffect(() => {
        if (!selectedModule && modules.length > 0) setSelectedModule(modules[0].id)
    }, [modules, selectedModule])

    const [createLesson] = useCreateLessonMutation()
    const { data: lessonsResp } = useGetAllLessonsQuery(selectedModule, { skip: !selectedModule })
    const { data: singleLessonResp } = useGetSingleLessonQuery(editingId as string, { skip: !editingId })

    // When editing, hydrate inputs and previews from single lesson API
    React.useEffect(() => {
        const d: any = (singleLessonResp as any)?.data
        if (!d) return
        setValue('title', d.title || '')
        setExistingVideoUrl(d.file_url || d.video_url || null)
        setExistingDocUrl(d.doc_url || null)
    }, [singleLessonResp, setValue])

    // Build a preview URL that prefers newly selected file, falls back to existing
    const previewVideoUrl = React.useMemo(() => {
        if (videoFile) {
            try { return URL.createObjectURL(videoFile) } catch { return null }
        }
        return existingVideoUrl
    }, [videoFile, existingVideoUrl])

    // Revoke object URL when file changes/unmounts
    React.useEffect(() => {
        return () => {
            if (videoFile) {
                try { URL.revokeObjectURL(previewVideoUrl || '') } catch {}
            }
        }
    }, [videoFile, previewVideoUrl])

    const onSaveLesson = async () => {
        const isTitleValid = await trigger('title')
        setFileTouched(true)
        if (!isTitleValid || !hasAnyFile || !selectedModule) return

        setSubmitting(true)
        // Build form data for API
        const form = new FormData()
        form.append('course_id', selectedModule)
        form.append('title', getValues('title') || '')
        if (videoFile) form.append('videoFile', videoFile)
        for (const f of docFiles) {
            form.append('docFile', f)
        }

        try {
            await createLesson(form).unwrap()
        } catch (e) {
            // ignore for now
        }

        // reset form state
        reset({ title: '' })
        setVideoFile(null)
        setDocFiles([])
        setFileTouched(false)
        setEditingId(null)
        setExistingVideoUrl(null)
        setExistingDocUrl(null)
        setSubmitting(false)

        onLessonsAdded?.()
    }

    // Display lessons pulled from API for the selected module
    const currentSaved = React.useMemo(() => {
        const resp: any = lessonsResp as any
        const raw = resp?.data
        let list: any[] = []
        if (Array.isArray(raw?.lessons)) list = raw.lessons
        else if (Array.isArray(raw)) list = raw
        else if (Array.isArray(raw?.data)) list = raw.data
        return list.map((l: any) => ({
            id: l.id,
            title: l.title,
            videoName: l.file_url ? l.file_url.split('/').pop() : (l.video_url ? l.video_url.split('/').pop() : null),
            docCount: Array.isArray(l.lesson_files) ? l.lesson_files.length : 0,
        })) as SavedLesson[]
    }, [lessonsResp])

    return (
        <div className="space-y-6 border-gray-200 py-0 border rounded-xl">
            {/* Header */}
            <div className="bg-[#FEF9F2] rounded-t-xl pt-2 py-5 px-5 flex items-center justify-between">
                <div>
                    <Label className="text-sm font-semibold text-[#0F2598] uppercase">Upload Course Lesson</Label>
                    <p className="text-xs text-gray-500 mt-1">Attach video and documents for the lesson</p>
                </div>
                <div className="w-56">
                    <Select value={selectedModule} onValueChange={(val) => {
                        setSelectedModule(val)
                        // reset form state when switching module
                        setEditingId(null)
                        reset({ title: '' })
                        setVideoFile(null)
                        setDocFiles([])
                        setFileTouched(false)
                    }}>
                        <SelectTrigger
                            className="w-full bg-white border border-[#0F2598] text-black  hover:border-[#0F2598]/80 focus-visible:ring focus-visible:ring-[#0F2598] focus-visible:border-[#0F2598]"
                        >
                            <SelectValue placeholder={modulesLoading ? 'Loading modules...' : 'Select Module'} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#0F2598] ">
                            {modulesLoading && (
                                <div className="px-3 py-2 text-xs text-gray-500">Loading...</div>
                            )}
                            {!modulesLoading && modules.length === 0 && (
                                <div className="px-3 py-2 text-xs text-gray-500">No modules found</div>
                            )}
                            {!modulesLoading && modules.map((m) => (
                                <SelectItem key={m.id} className="data-[highlighted]:bg-[#0F2598]/10 cursor-pointer data-[state=checked]:bg-[#0F2598]/20" value={m.id}>{m.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="px-5 pb-8 space-y-6">
                {/* Single lesson form (modules-like) */}
                <div className="group relative rounded-xl bg-white border p-5 transition-all duration-200">
                    <div className="space-y-2 mb-5">
                        <Label className="text-sm font-medium text-gray-700">Lesson Title <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="Enter lesson title..."
                            {...register('title', {
                                required: 'Title is required',
                                minLength: { value: 3, message: 'At least 3 characters' }
                            })}
                            className="w-full"
                        />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message as string}</p>}
                    </div>

                    <div className="space-y-3 mb-5">
                        <Label className="text-sm font-medium text-gray-700">Upload Video</Label>
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    document.getElementById('video-upload-single')?.click()
                                }}
                                className="flex cursor-pointer items-center gap-2"
                            >
                                <Video className="h-4 w-4" />
                                Choose Video
                            </Button>
                            <span className="text-sm text-gray-600 flex-1">
                                {videoFile ? videoFile.name : 'No video chosen'}
                            </span>
                            {videoFile && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setVideoFile(null)}
                                    className="text-red-600 hover:text-red-700 h-6 w-6 p-0 rounded-full cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                            <input
                                id={'video-upload-single'}
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null
                                    setVideoFile(file)
                                    setFileTouched(true)
                                    e.currentTarget.value = ''
                                }}
                                className="hidden"
                            />
                        </div>
                        {previewVideoUrl && (
                            <div className="mt-2">
                                <video
                                    key={previewVideoUrl}
                                    src={previewVideoUrl}
                                    controls
                                    preload="metadata"
                                    crossOrigin="anonymous"
                                    className="w-full max-h-56 rounded-md border"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">Upload Documents</Label>
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    document.getElementById('doc-upload-single')?.click()
                                }}
                                className="flex cursor-pointer items-center gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                Choose Documents
                            </Button>
                            <span className="text-sm text-gray-600 flex-1">
                                {docFiles.length} file(s) selected
                            </span>
                            <input
                                id={'doc-upload-single'}
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || [])
                                    if (files.length) {
                                        setDocFiles((prev) => [...prev, ...files])
                                        setFileTouched(true)
                                    }
                                    e.currentTarget.value = ''
                                }}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-2">
                            {docFiles.map((file, fileIndex) => (
                                <div key={fileIndex} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#0F2598]/10 rounded-lg flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-[#0F2598]" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-800">{file.name}</span>
                                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setDocFiles((prev) => prev.filter((_, i) => i !== fileIndex))
                                        }}
                                        className="text-gray-400 cursor-pointer hover:text-red-600 h-8 w-8 p-0 rounded-full"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {!docFiles.length && existingDocUrl && (
                                <div className="text-xs text-gray-600">Existing doc: <a className="underline text-blue-600" href={existingDocUrl} target="_blank" rel="noreferrer">{existingDocUrl.split('/').pop()}</a></div>
                            )}
                        </div>
                        {!hasAnyFile && fileTouched && (
                            <p className="text-xs text-red-500">Upload a video or at least one document</p>
                        )}
                    </div>
                </div>

                {/* Right side buttons */}
                <div className='flex items-center justify-end'>
                    <div className='flex items-center gap-2'>
                        <Button
                            disabled={submitting}
                            onClick={onSaveLesson}
                            className='bg-[#0F2598] w-fit hover:bg-[#0F2598]/80 cursor-pointer text-white inline-flex items-center gap-2'
                        >
                            {submitting && <ButtonSpring loading variant='spinner' size={16} color='#ffffff' />}
                            {submitting ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Lesson' : 'Save Lesson')}
                        </Button>
                    </div>
                </div>

                {/* Saved lessons list (compact like modules) */}
                {currentSaved.length > 0 && (
                    <div className='space-y-3'>
                        {currentSaved.map((item, idx) => (
                            <div key={item.id} className='flex items-center justify-between rounded-md border p-3  bg-white'>
                                <div className='flex items-center gap-3 min-w-0 pr-3'>
                                    <div className='w-7 h-7 rounded-full bg-[#0F2598]/10 text-[#0F2598] flex items-center justify-center text-xs font-semibold'>
                                        {idx + 1}
                                    </div>
                                    <div className='min-w-0'>
                                        <div className='truncate text-sm font-medium text-gray-900'>{item.title || 'Untitled lesson'}</div>
                                        <div className='text-xs text-gray-500'>
                                            {item.videoName ? `Video: ${item.videoName}` : 'No video'} • {item.docCount} document(s)
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    {editingId === item.id ? (
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            className='h-8 px-2 cursor-pointer'
                                            onClick={() => {
                                                setEditingId(null)
                                                reset({ title: '' })
                                                setVideoFile(null)
                                                setDocFiles([])
                                                setExistingVideoUrl(null)
                                                setExistingDocUrl(null)
                                                setFileTouched(false)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    ) : (
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            className='h-8 px-2 cursor-pointer'
                                            onClick={() => {
                                                setEditingId(item.id)
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                            }}
                                        >
                                            <Pencil className='h-4 w-4' />
                                        </Button>
                                    )}
                                    <Button
                                        type='button'
                                        variant='destructive'
                                        size='sm'
                                        className='h-8 px-2 cursor-pointer'
                                        onClick={() => {
                                            setSavedByModule((prev) => {
                                                const list = prev[selectedModule] || []
                                                return { ...prev, [selectedModule]: list.filter((s) => s.id !== item.id) }
                                            })
                                        }}
                                    >
                                        <Trash2 className='h-4 w-4' />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
