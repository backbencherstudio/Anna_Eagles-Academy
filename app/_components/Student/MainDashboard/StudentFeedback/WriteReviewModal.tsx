"use client"

import React, { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface WriteReviewModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function WriteReviewModal({ open, onOpenChange }: WriteReviewModalProps) {
    const [activeTab, setActiveTab] = useState<'course' | 'weekly'>('course')
    const courses = useMemo(
        () => [
            { id: 'kp', name: 'The Kingdom Principles' },
            { id: 'sf', name: 'Spiritual Foundations' },
            { id: 'bw', name: 'Biblical Wisdom' },
            { id: 'pm', name: 'Prayer and Meditation' },
        ],
        []
    )

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
                                onClick={() => setActiveTab('course')}
                            >
                                Course review
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-semibold text-center transition-colors cursor-pointer ${activeTab === 'weekly' ? 'text-[#0F2598]' : 'text-muted-foreground'
                                    }`}
                                onClick={() => setActiveTab('weekly')}
                            >
                                Weekly review
                            </button>
                        </div>
                        <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gray-200" />
                        <div
                            className={`absolute bottom-0 h-[2px] bg-[#0F2598] w-1/2 transition-transform duration-300 ${activeTab === 'course' ? 'translate-x-0' : 'translate-x-full'
                                }`}
                        />
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-4 pt-4">
                    {activeTab === 'course' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Select Course</label>
                                <Select >
                                    <SelectTrigger className="mt-1 w-full cursor-pointer">
                                        <SelectValue placeholder="Choose a course to review" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map((c) => (
                                            <SelectItem className="cursor-pointer" key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input className="mt-1" placeholder="Leeming Biblical Leadership" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Weekly Reflection</label>
                                <Textarea className="mt-1" placeholder="Share your insights, learnings, or spiritual experiences from this week..." rows={5} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Upload Video</label>
                                <Input className="mt-1 cursor-pointer" type="file" accept="video/mp4" />
                                <p className="text-xs text-muted-foreground mt-1">Accepted formats: Video (MP4) - Max 300MB</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Week Number</label>
                                <Input className="mt-1" placeholder="e.g., Week 2" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input className="mt-1" placeholder="Leeming Biblical Leadership" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Weekly Reflection</label>
                                <Textarea className="mt-1" placeholder="Share your insights, learnings, or spiritual experiences from this week..." rows={5} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Upload Video</label>
                                <Input className="mt-1 cursor-pointer" type="file" accept="video/mp4" />
                                <p className="text-xs text-muted-foreground mt-1">Accepted formats: Video (MP4) - Max 300MB</p>
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 transition-all duration-300">Submit Review</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
