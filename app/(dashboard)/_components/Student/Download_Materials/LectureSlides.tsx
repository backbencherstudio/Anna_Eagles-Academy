'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Eye, X, Maximize2, Minimize2 } from 'lucide-react'
import FilesIcon from '@/components/Icons/DownloadMaterials/FilesIcon'
import Image from 'next/image'

type LectureSlide = {
    id: string
    title: string
    description: string
    week: string
    type: 'powerpoint' | 'pdf' | 'document'
    fileUrl?: string
    previewUrl?: string
    thumbnail?: string
}

const mockLectureSlides: LectureSlide[] = [
    {
        id: '1',
        title: 'Week 1 - Introduction to Web Development',
        thumbnail: '/images/Thumbnail.png',
        description: 'Review the introductory concepts of this course. You can navigate through the slides below.',
        week: 'Week 1',
        type: 'powerpoint',
        fileUrl: 'https://docs.google.com/presentation/d/1k8vcgt8tZyLTYxreB-ZZSLFBeE4BCjlRZ0pRGR4J7lo/edit?usp=sharing',
        previewUrl: 'https://docs.google.com/presentation/d/1k8vcgt8tZyLTYxreB-ZZSLFBeE4BCjlRZ0pRGR4J7lo/edit?usp=sharing'
    },
    {
        id: '2',
        title: 'Week 2 - HTML Fundamentals',
        thumbnail: '/images/Thumbnail.png',
        description: 'Learn the basics of HTML structure and semantic elements. Complete guide for beginners.',
        week: 'Week 2',
        type: 'powerpoint',
        fileUrl: 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pptx-file.pptx',
        previewUrl: 'https://view.officeapps.live.com/op/embed.aspx?src=https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pptx-file.pptx'
    },
    {
        id: '3',
        title: 'Week 3 - CSS Styling',
        thumbnail: '/images/Thumbnail.png',
        description: 'Master CSS properties, selectors, and responsive design principles.',
        week: 'Week 3',
        type: 'powerpoint',
        fileUrl: 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pptx-file.pptx',
        previewUrl: 'https://view.officeapps.live.com/op/embed.aspx?src=https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pptx-file.pptx'
    }
]



export default function LectureSlides() {
    const [previewSlide, setPreviewSlide] = useState<LectureSlide | null>(null)
    const [previewError, setPreviewError] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const handlePreview = (slide: LectureSlide) => {
        if (slide.previewUrl) {
            setPreviewError(false)
            setPreviewSlide(slide)
        }
    }

    const closePreview = () => {
        setPreviewSlide(null)
        setPreviewError(false)
        setIsFullscreen(false)
    }

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    const handleIframeError = () => {
        setPreviewError(true)
    }

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && previewSlide) {
                if (isFullscreen) {
                    setIsFullscreen(false)
                } else {
                    closePreview()
                }
            }
            if (event.key === 'F11' && previewSlide) {
                event.preventDefault()
                toggleFullscreen()
            }
        }

        if (previewSlide) {
            document.addEventListener('keydown', handleKeyDown)
            return () => document.removeEventListener('keydown', handleKeyDown)
        }
    }, [previewSlide, isFullscreen])

    return (
        <div className="space-y-6 bg-white rounded-xl p-4">
            {/* Files Section Header */}
            <div className="flex items-center gap-3">
                <div >
                    <FilesIcon />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Files</h2>
            </div>

            {/* Lecture Slides List */}
            <div className="space-y-4">
                {mockLectureSlides.map((slide) => (
                    <Card key={slide.id} className="rounded-xl border border-gray-200 transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                {/* File Icon */}
                                <div className="flex-shrink-0">
                                    <Image className='rounded-lg w-24 h-20' src={slide.thumbnail || '/images/Thumbnail.png'} alt={slide.title} width={100} height={100} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                                        {slide.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {slide.description}
                                    </p>
                                </div>

                                {/* Action Button */}
                                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                                    <Button
                                        className="bg-[#0F2598] cursor-pointer text-white hover:bg-[#0F2598]/90 text-sm font-medium px-4 py-2"
                                        size="sm"
                                        onClick={() => handlePreview(slide)}
                                    >
                                        Only View
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <p className="text-xs text-gray-500">
                                        Download disabled
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State (if no slides) */}
            {mockLectureSlides.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Lecture Slides Available</h3>
                    <p className="text-gray-500">Check back later for course materials.</p>
                </div>
            )}

            {/* Preview Modal */}
            {previewSlide && (
                <div className={`fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`}>
                    <div className={`bg-white shadow-2xl flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh] rounded-xl'}`}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{previewSlide.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{previewSlide.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={toggleFullscreen}
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                                >
                                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                                </Button>
                                <Button
                                    onClick={closePreview}
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div className={`flex-1 ${isFullscreen ? 'p-2' : 'p-6'}`}>
                            <div className={`w-full h-full overflow-hidden border border-gray-200 ${isFullscreen ? 'rounded-none' : 'rounded-lg'}`}>
                                {previewError ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                                        <div className="text-center">
                                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Not Available</h3>
                                            <p className="text-gray-600 mb-4">
                                                The slide preview is currently unavailable. This could be due to:
                                            </p>
                                            <ul className="text-sm text-gray-600 text-left max-w-md mx-auto mb-6">
                                                <li>• File format not supported for preview</li>
                                                <li>• Network connectivity issues</li>
                                                <li>• File access restrictions</li>
                                            </ul>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-500">
                                                    <strong>File:</strong> {previewSlide.title}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    <strong>Type:</strong> PowerPoint Presentation
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <iframe
                                        src={previewSlide.previewUrl}
                                        className="w-full h-full"
                                        title={previewSlide.title}
                                        allowFullScreen
                                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                        onError={handleIframeError}
                                        onLoad={() => setPreviewError(false)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        {!isFullscreen && (
                            <div className="p-6 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        This is a preview-only view. Download is disabled for security reasons.
                                    </p>
                                    <Button
                                        onClick={closePreview}
                                        className="bg-[#0F2598] text-white hover:bg-[#0F2598]/90"
                                    >
                                        Close Preview
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
