"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import UploadVideo from '../CourseManagement/CreateCourse/UploadVideo'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2 } from 'lucide-react'
import ButtonSpring from '@/components/Resuable/ButtonSpring'
import { getCookie } from '@/lib/tokenUtils'
import { useCreateModuleMutation, useGetAllModulesQuery, useUpdateSingleModuleMutation, useDeleteSingleModuleMutation } from '@/redux/api/managementCourseApis'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import { toast } from 'react-hot-toast'

type CourseModuesAddedProps = {
    seriesId?: string | null
    onNext?: () => void
}

export default function CourseModuesAdded({ seriesId, onNext }: CourseModuesAddedProps) {
    type ModuleForm = { title: string; price: number | '' }
    const { register, formState: { errors }, trigger, setValue, reset, getValues } = useForm<ModuleForm>({
        defaultValues: { title: '', price: '' },
        mode: 'onTouched',
    })

    const [state, setState] = useState<{ introEnabled: boolean; endEnabled: boolean; introFile: File | null; endFile: File | null }>(
        { introEnabled: false, endEnabled: true, introFile: null, endFile: null }
    )

    const [isSaving, setIsSaving] = useState(false)
    const [isContinuing, setIsContinuing] = useState(false)
    const [saved, setSaved] = useState(false)
    const [savedItems, setSavedItems] = useState<Array<{ id: string; title: string; price: number | '' }>>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [confirm, setConfirm] = useState<{ open: boolean; targetId: string | null }>({ open: false, targetId: null })

    // API hooks
    const { data: modulesResp } = useGetAllModulesQuery(seriesId as string, { skip: !seriesId })
    const [createModule] = useCreateModuleMutation()
    const [updateModule] = useUpdateSingleModuleMutation()
    const [deleteModule] = useDeleteSingleModuleMutation()

    // Populate compact cards from API with defensive parsing
    React.useEffect(() => {
        const resp: any = modulesResp as any
        const raw = resp?.data
        let list: any[] = []
        if (Array.isArray(raw)) list = raw
        else if (Array.isArray(raw?.data)) list = raw.data
        else if (Array.isArray(raw?.courses)) list = raw.courses
        else if (Array.isArray(resp)) list = resp
        else list = []
        const mapped = list.map((m: any) => ({
            id: m.id,
            title: m.title,
            price: Number(m.price || 0),
            intro_video_url: m.intro_video_url || null,
            end_video_url: m.end_video_url || null,
        }))
        setSavedItems(mapped)
        if (mapped.length > 0) setSaved(true)
    }, [modulesResp])

    const onSaveModule = async () => {
        const isTitleValid = await trigger('title')
        const isPriceValid = await trigger('price')
        if (isTitleValid && isPriceValid) {
            setIsSaving(true)
            const { title, price } = getValues()
            const formData = new FormData()
            if (seriesId) formData.append('series_id', seriesId)
            formData.append('title', title)
            formData.append('price', String(price))
            if (state.introFile) formData.append('introVideo', state.introFile)
            if (state.endFile) formData.append('endVideo', state.endFile)

            try {
                if (editingId) {
                    await updateModule({ module_id: editingId, formData }).unwrap()
                    setEditingId(null)
                } else {
                    await createModule(formData).unwrap()
                }
                setSaved(true)
            } catch (e) {
                // ignore here; UI could show toast in future
            }
            reset({ title: '', price: '' })
            setState({ introEnabled: false, endEnabled: true, introFile: null, endFile: null })
            setIsSaving(false)
        }
    }

    const onSubmit = async () => {
        if (savedItems.length === 0) {
            // Safety guard: must have at least one saved module card
            return
        }
        setIsContinuing(true)
        onNext?.()
        setIsContinuing(false)
    }

    const showSaveButton = true
    const showContinueButton = savedItems.length > 0

    return (
        <div className='space-y-4'>
            <Card className={`border pb-5`}>
                <CardHeader className="bg-[#FEF9F2] rounded-t-xl pt-2 py-5">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold text-[#F1C27D] uppercase">
                            Upload Course Module
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Title Course */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Title Course <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Title Course"
                            {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'At least 3 characters' } })}
                            className="w-full"
                        />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message as string}</p>}
                    </div>

                    {/* Video Uploads */}
                    <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 2xl:gap-10 ">
                        {/* Upload Intro Video */}
                        <UploadVideo
                            label="Upload Intro Video"
                            uniqueId={`module-intro`}
                            enabled={state.introEnabled}
                            onToggle={(enabled) => {
                                setState(prev => ({ ...prev, introEnabled: enabled }))
                            }}
                            onFileSelect={(file) => {
                                setState(prev => ({ ...prev, introFile: file }))
                            }}
                            selectedFile={state.introFile}
                            onRemove={() => {
                                setState(prev => ({ ...prev, introFile: null }))
                            }}
                            existingUrl={editingId ? (savedItems.find(s => s.id === editingId) as any)?.intro_video_url : null}
                        />

                        {/* Upload End Video */}
                        <UploadVideo
                            label="Upload End Video"
                            uniqueId={`module-end`}
                            enabled={state.endEnabled}
                            onToggle={(enabled) => {
                                setState(prev => ({ ...prev, endEnabled: enabled }))
                            }}
                            onFileSelect={(file) => {
                                setState(prev => ({ ...prev, endFile: file }))
                            }}
                            selectedFile={state.endFile}
                            onRemove={() => {
                                setState(prev => ({ ...prev, endFile: null }))
                            }}
                            existingUrl={editingId ? (savedItems.find(s => s.id === editingId) as any)?.end_video_url : null}
                        />
                    </div>

                    {/* Course Price */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Course Price <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...register('price', {
                                    required: 'Price is required',
                                    validate: (v) => (v === '' ? false : Number(v) > 0) || 'Must be greater than 0',
                                    valueAsNumber: true,
                                })}
                                className="w-full pl-8 border-gray-300 focus:border-[#0F2598] focus:ring-[#0F2598]"
                            />
                        </div>
                        {errors.price && <p className="text-xs text-red-500">{errors.price.message as string}</p>}
                    </div>
                </CardContent>
            </Card>

            <div className='flex items-center justify-end'>
                {/* Right side buttons */}
                <div className='flex items-center gap-2'>
                    {showSaveButton && (
                        <Button
                            disabled={isSaving}
                            onClick={() => {
                                onSaveModule()
                            }}
                            className='bg-[#F1C27D] w-fit hover:bg-[#F1C27D]/80 cursor-pointer text-white inline-flex items-center gap-2'
                        >
                            {isSaving && <ButtonSpring loading variant='spinner' size={16} color='#ffffff' />}
                            {isSaving ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Module' : 'Save Module')}
                        </Button>
                    )}

                    {showContinueButton && (
                        <Button disabled={isContinuing} type="button" onClick={onSubmit} className='bg-[#0F2598] w-fit hover:bg-[#0F2598]/80 cursor-pointer text-white inline-flex items-center gap-2'>
                            {isContinuing && <ButtonSpring loading variant='spinner' size={16} color='#ffffff' />}
                            {isContinuing ? 'Processing...' : 'Continue'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Saved modules below (compact cards) */}
            {savedItems.length > 0 && (
                <div className='space-y-3'>
                    {savedItems.map((item, idx) => (
                        <div key={item.id} className='flex items-center justify-between rounded-md border p-3  bg-white'>
                            <div className='flex items-center gap-3 min-w-0 pr-3'>
                                <div className='w-7 h-7 rounded-full bg-[#0F2598]/10 text-[#0F2598] flex items-center justify-center text-xs font-semibold'>
                                    {idx + 1}
                                </div>
                                <div className='min-w-0'>
                                    <div className='truncate text-sm font-medium text-gray-900'>{item.title || 'Untitled module'}</div>
                                    <div className='text-xs text-gray-500'>Price: ${Number(item.price || 0).toFixed(2)}</div>
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
                                            // cancel edit: clear form and exit edit mode
                                            setEditingId(null)
                                            reset({ title: '', price: '' })
                                            setState({ introEnabled: false, endEnabled: true, introFile: null, endFile: null })
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
                                            setValue('title', item.title)
                                            setValue('price', item.price)
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
                                    onClick={() => setConfirm({ open: true, targetId: item.id })}
                                >
                                    <Trash2 className='h-4 w-4' />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={confirm.open}
                onOpenChange={(open) => setConfirm((p) => ({ ...p, open }))}
                title="Delete module?"
                description="This action cannot be undone."
                confirmText="Delete"
                confirmVariant='destructive'
                onConfirm={async () => {
                    if (!confirm.targetId) return
                    try {
                        const res: any = await deleteModule(confirm.targetId).unwrap()
                        const msg = res?.message || res?.data?.message || 'Course deleted successfully'
                        toast.success(msg)
                    } catch (e) {
                        toast.error('Failed to delete module')
                    }
                }}
            />


        </div>
    )
}
