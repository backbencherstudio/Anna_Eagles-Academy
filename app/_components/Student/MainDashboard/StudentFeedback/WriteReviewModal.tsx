"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import SeriesFilterStudentResauble from '@/components/Resuable/SeriesFilter/SeriesFilterStudentResauble'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/rtk'
import {
    setSeriesId,
    setCourseId,
    setTitle,
    setDescription,
    setType,
    setSubmitting,
    setError,
    setSuccess,
    resetFeedbackForm,
} from '@/rtk/slices/users/shareFeedBackSlice'
import { useCreateFeedbackMutation } from '@/rtk/api/users/shareFeedBackApis'

interface WriteReviewModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function WriteReviewModal({ open, onOpenChange }: WriteReviewModalProps) {
    const [activeTab, setActiveTab] = useState<'course' | 'series'>('course')
    const dispatch = useDispatch()
    const form = useSelector((s: RootState) => s.shareFeedback)
    const [file, setFileLocal] = useState<File | null>(null)
    const [createFeedback, { isLoading }] = useCreateFeedbackMutation()
    const handleTabChange = (tab: 'course' | 'series') => {
        setActiveTab(tab)
        dispatch(setType(tab === 'course' ? 'course_review' : 'series_review'))
    }

    const handleSubmit = async () => {
        try {
            dispatch(setSubmitting(true))
            dispatch(setError(null))
            dispatch(setSuccess(false))

            const fd = new FormData()
            if (form.seriesId) fd.append('series_id', form.seriesId)
            if (form.courseId) fd.append('course_id', form.courseId)
            fd.append('title', form.title)
            fd.append('description', form.description)
            fd.append('type', activeTab === 'course' ? 'course_review' : 'series_review')
            if (file) fd.append('file', file)
            await createFeedback(fd).unwrap()
            dispatch(setSuccess(true))
            onOpenChange(false)
            dispatch(resetFeedbackForm())
        } catch (err: any) {
            // Extract a readable error message from various shapes
            const serverData = err?.data
            let message = 'Failed to submit feedback'
            if (typeof serverData === 'string') {
                message = serverData
            } else if (serverData?.message) {
                if (typeof serverData.message === 'string') {
                    message = serverData.message
                } else if (typeof serverData.message?.message === 'string') {
                    message = serverData.message.message
                } else if (typeof serverData.error === 'string') {
                    message = serverData.error
                }
            } else if (typeof err?.error === 'string') {
                message = err.error
            } else if (typeof err?.message === 'string') {
                message = err.message
            }
            dispatch(setError(message))
        } finally {
            dispatch(setSubmitting(false))
        }
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="!max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Share your Feedback</DialogTitle>
                </DialogHeader>

                {/* Tabs header */}
                <div className="mt-1 px-1 font-spline-sans ">
                    <div className="relative">
                        <div className="flex items-center">
                            <button
                                className={`flex-1 py-2 text-sm font-semibold text-center transition-colors cursor-pointer ${activeTab === 'course' ? 'text-[#0F2598]' : 'text-muted-foreground'
                                    }`}
                                onClick={() => handleTabChange('course')}
                            >
                                Course review
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-semibold text-center transition-colors cursor-pointer ${activeTab === 'series' ? 'text-[#0F2598]' : 'text-muted-foreground'
                                    }`}
                                onClick={() => handleTabChange('series')}
                            >
                                Series review
                            </button>
                        </div>
                        <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gray-200" />
                        <div className={`absolute bottom-0 h-[2px] bg-[#0F2598] w-1/2 transition-transform duration-300 ${activeTab === 'course' ? 'translate-x-0' : 'translate-x-full'
                            }`} />
                    </div>
                </div>
                {/* Form */}
                <div className="space-y-4 pt-4">
                    {activeTab === 'series' ? (
                        <div className="space-y-4">
                            <SeriesFilterStudentResauble
                                hideCourse
                                onSeriesChange={(id) => dispatch(setSeriesId(id))}
                            />
                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    className="mt-1"
                                    placeholder="Leeming Biblical Leadership"
                                    value={form.title}
                                    onChange={(e) => dispatch(setTitle(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Course Reflection</label>
                                <Textarea
                                    className="mt-1"
                                    placeholder="Share your insights, learnings, or spiritual experiences from this week..."
                                    rows={5}
                                    value={form.description}
                                    onChange={(e) => dispatch(setDescription(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Upload Video</label>
                                <Input
                                    className="mt-1 cursor-pointer"
                                    type="file"
                                    accept="video/mp4"
                                    onChange={(e) => setFileLocal(e.target.files?.[0] ?? null)}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Accepted formats: Video (MP4) - Max 300MB</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <SeriesFilterStudentResauble
                                onSeriesChange={(id) => dispatch(setSeriesId(id))}
                                onCourseChange={(id) => dispatch(setCourseId(id))}
                            />
                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    className="mt-1"
                                    placeholder="Leeming Biblical Leadership"
                                    value={form.title}
                                    onChange={(e) => dispatch(setTitle(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Course Reflection</label>
                                <Textarea
                                    className="mt-1"
                                    placeholder="Share your insights, learnings, or spiritual experiences from this week..."
                                    rows={5}
                                    value={form.description}
                                    onChange={(e) => dispatch(setDescription(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Upload Video</label>
                                <Input
                                    className="mt-1 cursor-pointer"
                                    type="file"
                                    accept="video/mp4"
                                    onChange={(e) => setFileLocal(e.target.files?.[0] ?? null)}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Accepted formats: Video (MP4) - Max 300MB</p>
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 transition-all duration-300"
                            onClick={handleSubmit}
                            disabled={isLoading || form.submitting}
                        >
                            {isLoading || form.submitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                        {form.error && (
                            <p className="text-sm text-red-500 mt-2">{form.error}</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
