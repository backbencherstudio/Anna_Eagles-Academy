'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Eye } from 'lucide-react'
import FilesIcon from '@/components/Icons/DownloadMaterials/FilesIcon'
import Image from 'next/image'
import { useAppSelector } from '@/rtk/hooks'
import { useGetAllStudentDownloadMaterialsQuery } from '@/rtk/api/users/studentDownloadMetrialsApis'
import { GridSkeletonLoader } from '@/components/Resuable/SkeletonLoader'
import PreviewModal from './PreviewModal'

type LectureSlide = {
    id: string
    title: string
    description: string
    previewUrl?: string
    thumbnail?: string
    course?: {
        id: string
        title: string
    }
    series?: {
        id: string
        title: string
        slug: string
    }
}



export default function LectureSlides() {
    const [previewSlide, setPreviewSlide] = useState<LectureSlide | null>(null)

    const filters = useAppSelector((state) => state.studentDownloadMetrials)
    const { data, isLoading: isMaterialsLoading } = useGetAllStudentDownloadMaterialsQuery({
        series_id: filters.series_id ?? '',
        course_id: filters.course_id ?? '',
        lecture_type: 'lecture-slides',
        page: filters.page,
        limit: filters.limit,
    })

    const slides: LectureSlide[] = React.useMemo(() => {
        const materials = (data as any)?.data?.materials ?? []
        const uniqueById = Array.from(
            new Map(
                materials
                    .filter((m: any) => m.lecture_type === 'lecture-slides')
                    .map((m: any) => [m.id, m])
            ).values()
        )
        return uniqueById.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description ?? '',
            previewUrl: m.file_url,
            thumbnail: '/images/Thumbnail.png',
            course: m.course,
            series: m.series,
        }))
    }, [data])

    const handlePreview = (slide: LectureSlide) => {
        setPreviewSlide(slide)
    }

    const closePreview = () => {
        setPreviewSlide(null)
    }

    return (
        <div className="space-y-6 bg-white rounded-xl p-4">
            {/* Files Section Header */}
            <div className='flex items-center justify-between'>
                <div className="flex items-center gap-3">
                    <div >
                        <FilesIcon />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Files</h2>
                </div>

            </div>

            {/* Lecture Slides List */}
            {isMaterialsLoading ? (
                <GridSkeletonLoader count={4} type="document" />
            ) : (
                <div className="space-y-4">
                    {slides.map((slide, idx) => (
                        <Card key={`${slide.id}-${idx}-${slide.title}`} className="rounded-xl border border-gray-200 transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    {/* File Icon */}
                                    <div className="flex-shrink-0">
                                        <Image className='rounded-lg w-24 h-20' src={slide.thumbnail || '/images/Thumbnail.png'} alt={slide.title} width={100} height={100} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-1 capitalize">
                                            {slide.series && (
                                                <span className="capitalize">
                                                    {slide.series.title} -
                                                </span>
                                            )}
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
            )}

            {/* Empty State (if no slides) */}
            {(!isMaterialsLoading && slides.length === 0) && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Lecture Slides Available</h3>
                    <p className="text-gray-500">Check back later for course materials.</p>
                </div>
            )}

            {/* Preview Modal */}
            <PreviewModal
                previewSlide={previewSlide}
                onClose={closePreview}
            />
        </div>
    )
}
