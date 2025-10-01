"use client"

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import VideoFileUpload from './VideoFileUpload'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Clock as ClockIcon } from 'lucide-react'
import { useCreateTeacherSectionMutation } from '@/rtk/api/admin/teacherSectionApis'
import { useAppDispatch } from '@/rtk/hooks'
import { setLoading, setError, setSuccess, clearState } from '@/rtk/slices/admin/teacherSectionSlice'

// Types for teacher section upload
type UploadType = 'Encouragement' | 'Scripture' | 'Announcement'

interface UploadTeacherVideoModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultType?: UploadType
    onPublish?: (payload: any) => void
}

export default function UploadTeacherVideoModal({
    open,
    onOpenChange,
    defaultType,
    onPublish,
}: UploadTeacherVideoModalProps) {
    // Form state management
    const [type, setType] = React.useState<UploadType>(defaultType || 'Encouragement')
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [releaseDate, setReleaseDate] = React.useState<Date | undefined>(undefined)
    const [releaseTime, setReleaseTime] = React.useState<string>('')
    const [file, setFile] = React.useState<File | null>(null)

    // Refs for time input
    const timeInputRef = React.useRef<HTMLInputElement | null>(null)

    // Redux hooks
    const dispatch = useAppDispatch()
    const [createTeacherSection, { isLoading }] = useCreateTeacherSectionMutation()

    /**
     * Reset form and close modal
     */
    const resetAndClose = () => {
        setTitle('')
        setDescription('')
        setReleaseDate(undefined)
        setReleaseTime('')
        setFile(null)
        onOpenChange(false)
    }

    /**
     */
    const formatDateForInput = (date: Date | undefined) => {
        if (!date) return ''
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    /**
     * Build payload for API call
     * Converts date/time to ISO format and prepares data structure
     */
    const buildPayload = () => {
        let releaseDateTime = ''
        if (releaseDate && releaseTime) {
            const dateTime = new Date(`${formatDateForInput(releaseDate)}T${releaseTime}:00`)
            releaseDateTime = dateTime.toISOString()
        }

        return {
            section_type: type.toUpperCase(),
            title,
            description,
            release_date: releaseDateTime,
            file: file || null
        }
    }


    const handleCreateTeacherSection = async () => {
        try {
            dispatch(setLoading(true))
            dispatch(clearState())

            const payload = buildPayload()
            const result = await createTeacherSection(payload).unwrap()

            dispatch(setSuccess({
                success: true,
                message: 'Teacher section created successfully!'
            }))

            resetAndClose()
            onPublish?.(result)
        } catch (error: any) {
            dispatch(setError(error?.data?.message || 'Failed to create teacher section'))
        }
    }

    /**
     * Dynamic field labels and placeholders based on selected type
     */
    const fieldText = React.useMemo(() => {
        switch (type) {
            case 'Scripture':
                return {
                    titleLabel: 'Scripture Title',
                    titlePlaceholder: 'Enter scripture reference',
                    descriptionLabel: 'Scripture Description',
                    descriptionPlaceholder: 'Write the scripture or reflection',
                }
            case 'Announcement':
                return {
                    titleLabel: 'Announcement Title',
                    titlePlaceholder: 'Enter announcement title',
                    descriptionLabel: 'Weekly Reflection',
                    descriptionPlaceholder: 'Provide announcement details or reflection',
                }
            case 'Encouragement':
            default:
                return {
                    titleLabel: 'Video Title',
                    titlePlaceholder: 'Enter video title',
                    descriptionLabel: 'Description',
                    descriptionPlaceholder: 'Describe the video content',
                }
        }
    }, [type])

    /**
     * Check if form is valid for submission
     */
    const isFormValid = title && description && releaseDate && releaseTime &&
        (type !== 'Encouragement' || file)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-6">
                <DialogHeader>
                    <DialogTitle>Upload Teacher Video</DialogTitle>
                    <DialogDescription>Upload a new video message for students</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-5">
                    {/* Section Type Selection */}
                    <div className="flex flex-col gap-2">
                        <Label>Video / Announcement Type</Label>
                        <Select value={type} onValueChange={(v) => setType(v as UploadType)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Type</SelectLabel>
                                    <SelectItem className='cursor-pointer' value="Encouragement">
                                        Encouragement
                                    </SelectItem>
                                    <SelectItem className='cursor-pointer' value="Scripture">
                                        Scripture
                                    </SelectItem>
                                    <SelectItem className='cursor-pointer' value="Announcement">
                                        Announcement
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Title Input */}
                    <div className="flex flex-col gap-2">
                        <Label>{fieldText.titleLabel}</Label>
                        <Input
                            placeholder={fieldText.titlePlaceholder}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Description Input */}
                    <div className="flex flex-col gap-2">
                        <Label>{fieldText.descriptionLabel}</Label>
                        <Textarea
                            placeholder={fieldText.descriptionPlaceholder}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Release Date and Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Date Picker */}
                        <div className="flex flex-col gap-2">
                            <Label>Release Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full cursor-pointer justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {releaseDate ? (
                                            releaseDate.toLocaleDateString()
                                        ) : (
                                            <span className="text-muted-foreground">Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={releaseDate}
                                        onSelect={setReleaseDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Time Picker */}
                        <div className="flex flex-col gap-2">
                            <Label>Release Time</Label>
                            <div className="relative">
                                <Input
                                    type="time"
                                    placeholder="Select time"
                                    value={releaseTime}
                                    onChange={(e) => setReleaseTime(e.target.value)}
                                    className="pr-10 time-input cursor-pointer"
                                    ref={timeInputRef}
                                    onMouseDown={(e) => {
                                        const input = timeInputRef.current as any
                                        if (input?.showPicker) {
                                            e.preventDefault()
                                            try {
                                                input.showPicker()
                                            } catch {
                                                input.focus()
                                            }
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                                    onClick={() => {
                                        const input = timeInputRef.current
                                        if (input && typeof (input as any).showPicker === 'function') {
                                            (input as any).showPicker()
                                        } else {
                                            input?.focus()
                                        }
                                    }}
                                    aria-label="Open time picker"
                                >
                                    <ClockIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Video File Upload (only for Encouragement type) */}
                    {type === 'Encouragement' && (
                        <div className="flex flex-col gap-2">
                            <Label>Video File</Label>
                            <VideoFileUpload
                                file={file}
                                onFileChange={setFile}
                                accept={'video/*'}
                                inputId={'teacher-video-input'}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={handleCreateTeacherSection}
                            disabled={isLoading || !isFormValid}
                            className='cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}