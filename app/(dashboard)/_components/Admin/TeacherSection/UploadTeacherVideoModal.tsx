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

type UploadType = 'Encouragement' | 'Scripture' | 'Announcement'

interface UploadTeacherVideoModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultType?: UploadType
    onSaveDraft?: (payload: any) => void
    onPublish?: (payload: any) => void
}

export default function UploadTeacherVideoModal({
    open,
    onOpenChange,

    onSaveDraft,
    onPublish,
}: UploadTeacherVideoModalProps) {
    const [type, setType] = React.useState<UploadType>('Encouragement')
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [releaseDate, setReleaseDate] = React.useState<Date | undefined>(undefined)
    const [releaseTime, setReleaseTime] = React.useState<string>('')
    const [file, setFile] = React.useState<File | null>(null)
    const timeInputRef = React.useRef<HTMLInputElement | null>(null)


    const resetAndClose = () => {
        setTitle('')
        setDescription('')
        setReleaseDate(undefined)
        setReleaseTime('')
        setFile(null)
        onOpenChange(false)
    }

    const formatDateForInput = (date: Date | undefined) => {
        if (!date) return ''
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const buildPayload = () => ({
        type,
        title,
        description,
        releaseDate: formatDateForInput(releaseDate),
        releaseTime,
        file,
    })

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-6">
                <DialogHeader>
                    <DialogTitle>Upload Teacher Video</DialogTitle>
                    <DialogDescription>Upload a new video message for students</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label>Video / Announcement Type</Label>
                        <Select value={type} onValueChange={(v) => setType(v as UploadType)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Type</SelectLabel>
                                    <SelectItem className='cursor-pointer' value="Encouragement">Encouragement</SelectItem>
                                    <SelectItem className='cursor-pointer' value="Scripture">Scripture</SelectItem>
                                    <SelectItem className='cursor-pointer' value="Announcement">Announcement</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>{fieldText.titleLabel}</Label>
                        <Input placeholder={fieldText.titlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>{fieldText.descriptionLabel}</Label>
                        <Textarea placeholder={fieldText.descriptionPlaceholder} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Release Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                                            try { input.showPicker() } catch { input.focus() }
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                                    onClick={() => {
                                        const input = timeInputRef.current
                                        if (input && typeof (input as any).showPicker === 'function') {
                                            ; (input as any).showPicker()
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

                    {type === 'Encouragement' && (
                        <div className="flex flex-col gap-2">
                            <Label>Video File</Label>
                            <VideoFileUpload file={file} onFileChange={setFile} accept={'video/*'} inputId={'teacher-video-input'} />
                        </div>
                    )}

                    <div className="flex items-center gap-3 justify-start pt-2">
                        <Button variant="outline" onClick={() => { onSaveDraft?.(buildPayload()); resetAndClose() }} className='cursor-pointer bg-[#ECEFF3] text-[#0F2598]'>Save as Draft</Button>
                        <Button onClick={() => { onPublish?.(buildPayload()); resetAndClose() }} className='cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/90 text-white'>Upload & Publish</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

