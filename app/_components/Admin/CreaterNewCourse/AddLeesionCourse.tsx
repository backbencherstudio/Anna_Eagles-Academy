"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FileText, Trash2, Video } from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ButtonSpring from '@/components/Resuable/ButtonSpring'

// Utils & Hooks
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setCurrentSeriesId } from '@/rtk/slices/admin/managementCourseSlice'
import type { RootState } from '@/rtk'

// API Hooks
import {
    useCreateLessonMutation,
    useGetAllLessonsQuery,
    useGetAllModulesQuery,
    useGetSingleLessonQuery,
    useUpdateSingleLessonMutation
} from '@/rtk/api/admin/managementCourseApis'

// Components
import LessonList from './LessonList'

// Types
type LessonForm = {
    title: string
}

type AddLeesionCourseProps = {
    seriesId?: string | null
    onLessonsAdded?: () => void
}

export default function AddLeesionCourse({ seriesId, onLessonsAdded }: AddLeesionCourseProps) {
    // ==================== FORM SETUP ====================
    const { register, formState: { errors }, trigger, reset, setValue, getValues } = useForm<LessonForm>({
        defaultValues: { title: '' },
        mode: 'onTouched',
    })

    // ==================== STATE MANAGEMENT ====================
    const [selectedModule, setSelectedModule] = useState<string>('')
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [docFiles, setDocFiles] = useState<File[]>([])
    const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null)
    const [existingDocUrl, setExistingDocUrl] = useState<string | null>(null)
    const [fileTouched, setFileTouched] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; targetId: string | null }>({
        open: false,
        targetId: null
    })

    // ==================== COMPUTED VALUES ====================
    const hasAnyFile = Boolean(videoFile) || docFiles.length > 0 || Boolean(existingVideoUrl) || Boolean(existingDocUrl)
    const hasVideo = Boolean(videoFile) || Boolean(existingVideoUrl)
    const hasDocuments = docFiles.length > 0 || Boolean(existingDocUrl)

    // ==================== REDUX SETUP ====================
    const dispatch = useAppDispatch()
    const seriesIdFromStore = useAppSelector((s: RootState) => s.managementCourse.currentSeriesId)

    useEffect(() => {
        if (seriesId) dispatch(setCurrentSeriesId(seriesId))
    }, [seriesId, dispatch])

    const activeSeriesId = seriesIdFromStore || seriesId || ''

    // ==================== API HOOKS ====================
    const { data: modulesResp, isLoading: modulesLoading } = useGetAllModulesQuery(activeSeriesId, { skip: !activeSeriesId })
    const [createLesson] = useCreateLessonMutation()
    const [updateLesson] = useUpdateSingleLessonMutation()
    const { data: lessonsResp } = useGetAllLessonsQuery(selectedModule, { skip: !selectedModule })
    const { data: singleLessonResp } = useGetSingleLessonQuery(editingId as string, { skip: !editingId })

    // ==================== DATA PROCESSING ====================
    const modules = useMemo(() => {
        if (!modulesResp?.data?.courses) return []
        return modulesResp.data.courses.map((m: any) => ({
            id: m.id,
            title: m.title
        }))
    }, [modulesResp])

    const currentSaved = useMemo(() => {
        if (!lessonsResp?.data?.lessons) return []
        return lessonsResp.data.lessons.map((l: any) => ({
            id: l.id,
            title: l.title,
            videoName: l.file_url?.split('/').pop() || l.video_url?.split('/').pop() || null,
            docCount: Array.isArray(l.lesson_files) ? l.lesson_files.length : (l.doc_url ? 1 : 0),
            updatedAt: l.updated_at,
        }))
    }, [lessonsResp])

    const previewVideoUrl = useMemo(() => {
        if (videoFile) {
            try { return URL.createObjectURL(videoFile) } catch { return null }
        }
        return existingVideoUrl
    }, [videoFile, existingVideoUrl])

    // ==================== EFFECTS ====================
    useEffect(() => {
        if (!selectedModule && modules.length > 0) setSelectedModule(modules[0].id)
    }, [modules, selectedModule])

    useEffect(() => {
        const d: any = (singleLessonResp as any)?.data
        if (!d || !editingId) return

        setExistingVideoUrl(null)
        setExistingDocUrl(null)
        setValue('title', d.title || '')
        setExistingVideoUrl(d.file_url || d.video_url || null)
        setExistingDocUrl(d.doc_url || null)
    }, [singleLessonResp, setValue, editingId])

    useEffect(() => {
        return () => {
            if (videoFile) {
                try { URL.revokeObjectURL(previewVideoUrl || '') } catch { }
            }
        }
    }, [videoFile, previewVideoUrl])

    // ==================== HELPER FUNCTIONS ====================
    const resetForm = () => {
        reset({ title: '' })
        setVideoFile(null)
        setDocFiles([])
        setFileTouched(false)
        setEditingId(null)
        setExistingVideoUrl(null)
        setExistingDocUrl(null)
    }

    const handleModuleChange = (val: string) => {
        setSelectedModule(val)
        resetForm()
    }

    const handleCancelEdit = () => {
        resetForm()
    }

    const handleEdit = (id: string) => {
        resetForm()
        setEditingId(id)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleOpenDeleteConfirm = (id: string) => {
        setConfirmDelete({ open: true, targetId: id })
    }

    const handleCloseDeleteConfirm = () => {
        setConfirmDelete({ open: false, targetId: null })
    }

    // ==================== MAIN FUNCTIONS ====================
    const onSaveLesson = async () => {
        const isTitleValid = await trigger('title')
        setFileTouched(true)
        if (!isTitleValid || !hasAnyFile || !selectedModule) return

        setSubmitting(true)

        const form = new FormData()
        form.append('course_id', selectedModule)
        form.append('title', getValues('title') || '')
        if (videoFile) form.append('videoFile', videoFile)
        for (const f of docFiles) {
            form.append('docFile', f)
        }

        try {
            if (editingId) {
                const res: any = await updateLesson({ lesson_id: editingId, formData: form }).unwrap()
                toast.success(res?.message || 'Lesson updated successfully')
            } else {
                const res: any = await createLesson(form).unwrap()
                toast.success(res?.message || 'Lesson created successfully')
            }
            resetForm()
        } catch (e: any) {
            const errorMessage = e?.data?.message || e?.message || (editingId ? 'Failed to update lesson' : 'Failed to create lesson')
            toast.error(typeof errorMessage === 'string' ? errorMessage : (editingId ? 'Failed to update lesson' : 'Failed to create lesson'))
        }

        setSubmitting(false)
        onLessonsAdded?.()
    }

    return (
        <div className="space-y-6 border-gray-200 py-0 border rounded-xl">
            {/* Header */}
            <div className="bg-[#FEF9F2] rounded-t-xl pt-2 py-5 px-5 flex items-center justify-between">
                <div>
                    <Label className="text-sm font-semibold text-[#0F2598] uppercase">Upload Course Lesson</Label>
                    <p className="text-xs text-gray-500 mt-1">Attach video and documents for the lesson</p>
                </div>
                <div className="w-56">
                    <Select value={selectedModule} onValueChange={handleModuleChange}>
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
                            {!modulesLoading && modules.map((m: { id: string; title: string }) => (
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
                                disabled={hasDocuments}
                                onClick={() => {
                                    document.getElementById('video-upload-single')?.click()
                                }}
                                className={`flex items-center gap-2 ${hasDocuments ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
                                    if (file) {
                                        // Clear documents when video is selected
                                        setDocFiles([])
                                        setExistingDocUrl(null)
                                    }
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
                                disabled={hasVideo}
                                onClick={() => {
                                    document.getElementById('doc-upload-single')?.click()
                                }}
                                className={`flex items-center gap-2 ${hasVideo ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
                                        // Clear video when documents are selected
                                        setVideoFile(null)
                                        setExistingVideoUrl(null)
                                        setDocFiles(files)
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

                {/* Saved lessons list */}
                <LessonList
                    lessons={currentSaved}
                    editingId={editingId}
                    confirmDelete={confirmDelete}
                    onEdit={handleEdit}
                    onCancelEdit={handleCancelEdit}
                    onConfirmDelete={() => { }}
                    onOpenDeleteConfirm={handleOpenDeleteConfirm}
                    onCloseDeleteConfirm={handleCloseDeleteConfirm}
                    onLessonsAdded={onLessonsAdded}
                />
            </div>

        </div>
    )
}
