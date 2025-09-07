import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Upload, FileText, Video } from 'lucide-react'

interface Lesson {
    id: string
    title: string
    videoFile: File | null
    documentFiles: File[]
}

interface LessonVideoProps {
    lessons: Lesson[]
    onLessonsChange: (lessons: Lesson[]) => void
}

export default function LessonVideo({ lessons, onLessonsChange }: LessonVideoProps) {
    // Initialize with one default lesson if no lessons exist
    useEffect(() => {
        if (lessons.length === 0) {
            const defaultLesson: Lesson = {
                id: Date.now().toString(),
                title: '',
                videoFile: null,
                documentFiles: []
            }
            onLessonsChange([defaultLesson])
        }
    }, [lessons.length, onLessonsChange])

    const addLesson = () => {
        const newLesson: Lesson = {
            id: Date.now().toString(),
            title: '',
            videoFile: null,
            documentFiles: []
        }
        onLessonsChange([...lessons, newLesson])
    }

    const removeLesson = (lessonId: string) => {
        // Don't allow removing the last lesson
        if (lessons.length > 1) {
            onLessonsChange(lessons.filter(lesson => lesson.id !== lessonId))
        }
    }

    const updateLessonTitle = (lessonId: string, title: string) => {
        onLessonsChange(lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, title } : lesson
        ))
    }

    const handleVideoUpload = (lessonId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            onLessonsChange(lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, videoFile: file } : lesson
            ))
        }
    }

    const handleDocumentUpload = (lessonId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        onLessonsChange(lessons.map(lesson =>
            lesson.id === lessonId ? {
                ...lesson,
                documentFiles: [...lesson.documentFiles, ...files]
            } : lesson
        ))
    }

    const removeDocument = (lessonId: string, fileIndex: number) => {
        onLessonsChange(lessons.map(lesson =>
            lesson.id === lessonId ? {
                ...lesson,
                documentFiles: lesson.documentFiles.filter((_, index) => index !== fileIndex)
            } : lesson
        ))
    }

    const removeVideo = (lessonId: string) => {
        onLessonsChange(lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, videoFile: null } : lesson
        ))
    }

    return (
        <div className="space-y-6 mt-8 border-t border-gray-200 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-sm font-semibold text-gray-800">Add Lesson Video</Label>
                    <p className="text-xs text-gray-500 mt-1">Create and manage your course lessons</p>
                </div>
                <Button
                    type="button"
                    onClick={addLesson}
                    variant="outline"
                    size="sm"
                    className="flex cursor-pointer items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200"
                >
                    <Plus className="h-4 w-4" />
                    Add Lesson
                </Button>
            </div>

            <div className="space-y-4">
                {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="group relative  rounded-xl bg-white  transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#0F2598]/10 text-[#0F2598] rounded-full flex items-center justify-center text-sm font-semibold">
                                    {index + 1}
                                </div>
                                <h4 className="text-sm font-semibold text-gray-800">
                                    Lesson {index + 1}
                                </h4>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLesson(lesson.id)}
                                disabled={lessons.length === 1}
                                className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${lessons.length === 1
                                    ? 'text-gray-300 cursor-not-allowed hover:bg-gray-50'
                                    : 'text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50'
                                    }`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Lesson Title */}
                        <div className="space-y-2 mb-5">
                            <Label className="text-sm font-medium text-gray-700">Lesson Title</Label>
                            <Input
                                placeholder="Enter lesson title..."
                                value={lesson.title}
                                onChange={(e) => updateLessonTitle(lesson.id, e.target.value)}
                                className="w-full border-gray-300 focus:border-[#F1C27D] focus:ring-[#F1C27D] transition-all duration-200"
                            />
                        </div>

                        {/* Video Upload */}
                        <div className="space-y-3 mb-5">
                            <Label className="text-sm font-medium text-gray-700">Upload Video</Label>
                            <div className="flex items-center gap-3 p-3  border border-gray-200 rounded-lg">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById(`video-upload-${lesson.id}`)?.click()}
                                    className="flex shadow-none cursor-pointer items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200"
                                >
                                    <Video className="h-4 w-4" />
                                    Choose Video
                                </Button>
                                <span className="text-sm text-gray-600 flex-1">
                                    {lesson.videoFile ? lesson.videoFile.name : "No video chosen"}
                                </span>
                                {lesson.videoFile && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeVideo(lesson.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 rounded-full cursor-pointer transition-all duration-200"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                                <input
                                    id={`video-upload-${lesson.id}`}
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleVideoUpload(lesson.id, e)}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">Upload Documents</Label>
                            <div className="flex items-center gap-3 p-3  border border-gray-200 rounded-lg">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById(`doc-upload-${lesson.id}`)?.click()}
                                    className="flex shadow-none cursor-pointer items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200"
                                >
                                    <FileText className="h-4 w-4" />
                                    Choose Documents
                                </Button>
                                <span className="text-sm text-gray-600 flex-1">
                                    {lesson.documentFiles.length} file(s) selected
                                </span>
                                <input
                                    id={`doc-upload-${lesson.id}`}
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                                    onChange={(e) => handleDocumentUpload(lesson.id, e)}
                                    className="hidden"
                                />
                            </div>

                            {/* Display selected documents */}
                            {lesson.documentFiles.length > 0 && (
                                <div className="space-y-2">
                                    {lesson.documentFiles.map((file, fileIndex) => (
                                        <div key={fileIndex} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
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
                                                onClick={() => removeDocument(lesson.id, fileIndex)}
                                                className="text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full transition-all duration-200"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
