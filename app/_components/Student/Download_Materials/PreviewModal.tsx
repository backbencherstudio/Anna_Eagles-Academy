'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, X, Maximize2, Minimize2 } from 'lucide-react'
import { useGetSingleStudentDownloadMaterialQuery } from '@/rtk/api/users/studentDownloadMetrialsApis'

type LectureSlide = {
    id: string
    title: string
    description: string
    previewUrl?: string
    thumbnail?: string
}

interface PreviewModalProps {
    previewSlide: LectureSlide | null
    onClose: () => void
}

export default function PreviewModal({ previewSlide, onClose }: PreviewModalProps) {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [previewError, setPreviewError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Single material query
    const { data: singleMaterialData, isLoading: isSingleMaterialLoading } = useGetSingleStudentDownloadMaterialQuery(
        previewSlide?.id!,
        {
            skip: !previewSlide?.id,
        }
    )

    const closePreview = useCallback(() => {
        onClose()
        setIsFullscreen(false)
        setPreviewError(false)
        setIsLoading(false)
    }, [onClose])

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(!isFullscreen)
    }, [isFullscreen])

    const handleIframeError = () => {
        setPreviewError(true)
        setIsLoading(false)
    }

    const handleIframeLoad = () => {
        setIsLoading(false)
        setPreviewError(false)

        // Inject CSS to hide pop-out button
        setTimeout(() => {
            try {
                const iframe = document.querySelector('iframe[title="' + previewSlide?.title + '"]') as HTMLIFrameElement
                if (iframe && iframe.contentDocument) {
                    const style = iframe.contentDocument.createElement('style')
                    style.textContent = `
                        .ndfHFb-c4YZDc-Wrql6b-AeOLfc-b0t70b,
                        .ndfHFb-c4YZDc-Wrql6b,
                        [aria-label*="Pop-out"],
                        [title*="Pop-out"],
                        button[aria-label*="Pop-out"],
                        button[title*="Pop-out"] {
                            display: none !important;
                            visibility: hidden !important;
                            opacity: 0 !important;
                            pointer-events: none !important;
                        }
                    `
                    iframe.contentDocument.head.appendChild(style)
                }
            } catch (e) {
                // Cross-origin restrictions - ignore
            }
        }, 10000)
    }

    // Reset modal state when previewSlide changes
    useEffect(() => {
        if (previewSlide) {
            setPreviewError(false)
            setIsLoading(true)
            setIsFullscreen(false)
        }
    }, [previewSlide])

    // Handle iframe loading
    useEffect(() => {
        if (previewSlide && isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 1000) // Stop loading after 5 seconds

            return () => clearTimeout(timer)
        }
    }, [previewSlide, isLoading])

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
    }, [previewSlide, isFullscreen, toggleFullscreen, closePreview])

    if (!previewSlide) return null

    return (
        <div className={`fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`}>
            <div className={`bg-white shadow-2xl flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh] rounded-xl'}`}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            {singleMaterialData?.data?.title || previewSlide.title}
                        </h3>

                        {singleMaterialData?.data && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 hidden sm:block">
                                <span>
                                    <strong>Series:</strong> {singleMaterialData.data.series.title}
                                </span>
                                <span>
                                    <strong>Course:</strong> {singleMaterialData.data.course.title}
                                </span>
                            </div>
                        )}
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
                        {isSingleMaterialLoading || isLoading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 animate-pulse"></div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Material...</h3>
                                    <p className="text-gray-600">Please wait while we load the document.</p>
                                </div>
                            </div>
                        ) : previewError ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                                <div className="text-center">
                                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Not Available</h3>
                                    <p className="text-gray-600 mb-4">
                                        The material preview is currently unavailable. This could be due to:
                                    </p>
                                    <ul className="text-sm text-gray-600 text-left max-w-md mx-auto mb-6">
                                        <li>• File format not supported for preview</li>
                                        <li>• Network connectivity issues</li>
                                        <li>• File access restrictions</li>
                                    </ul>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">
                                            <strong>File:</strong> {singleMaterialData?.data?.title || previewSlide.title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <strong>Type:</strong> {singleMaterialData?.data?.type || 'Document'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full h-full">
                                <iframe
                                    key={`iframe-${previewSlide.id}`}
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(singleMaterialData?.data?.file_url || previewSlide.previewUrl || '')}&embedded=true&rm=minimal&toolbar=0&navpanes=0&scrollbar=1`}
                                    className="w-full h-full"
                                    title={singleMaterialData?.data?.title || previewSlide.title}
                                    allowFullScreen
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                    onError={handleIframeError}
                                    onLoad={handleIframeLoad}
                                    onLoadStart={() => setIsLoading(true)}
                                    style={{ display: isLoading ? 'none' : 'block' }}
                                />
                                {/* Overlay to block pop-out button area */}
                                <div
                                    className="absolute top-0 right-0 w-16 h-16 bg-transparent pointer-events-auto z-10"
                                    style={{
                                        background: 'transparent',
                                        cursor: 'default'
                                    }}
                                    onClick={(e) => e.preventDefault()}
                                    onMouseDown={(e) => e.preventDefault()}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                {!isFullscreen && (
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-end">
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
    )
}
