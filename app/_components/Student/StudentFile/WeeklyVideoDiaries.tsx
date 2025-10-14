'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import CameraIcon from '@/components/Icons/CameraIcon'
import VideoModal from '@/components/Resuable/VideoModal'
import VideoCard from '@/components/Resuable/VideoCard'
import { useDeleteStudentFileMutation } from '@/rtk/api/users/studentFileApis'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'

type StudentFileItem = {
    id: string
    created_at: string
    file_url: string
    url?: string
    course?: { title: string }
    series?: { title: string }
}

export default function WeeklyVideoDiaries({ items = [] as StudentFileItem[] }: { items?: StudentFileItem[] }) {
    const [open, setOpen] = useState(false)
    const [currentUrl, setCurrentUrl] = useState<string>('')
    const [deleteStudentFile, { isLoading: isDeleting }] = useDeleteStudentFileMutation()
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null)

    const handlePlayClick = (videoUrl: string) => {
        setCurrentUrl(videoUrl)
        setOpen(true)
    }

    const handleDelete = async () => {
        if (!targetDeleteId) return
        try {
            await deleteStudentFile(targetDeleteId).unwrap()
            toast.success('File deleted successfully')
        } catch (e: any) {
            toast.error(e?.data?.message || 'Failed to delete file')
        }
    }

    return (
        <>
            <Card className="border rounded-xl border-[#ECEFF3]">
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <CameraIcon />
                            <h3 className="text-lg font-semibold">Weekly Video Diaries</h3>
                        </div>


                        {/* videos */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((v) => {
                                const dateText = new Date(v.created_at).toLocaleDateString()
                                const fileName = v.url || v.file_url?.split('/').pop() || 'Video'
                                const composed = [v.series?.title, v.course?.title].filter(Boolean).join(' - ')
                                const title = composed || fileName
                                return (
                                    <VideoCard
                                        key={v.id}
                                        id={v.id}
                                        title={title}
                                        videoUrl={v.file_url}
                                        type="Video"
                                        date={dateText}
                                        onPlay={handlePlayClick}
                                        showDeleteButton={true}
                                        onDelete={() => { setTargetDeleteId(v.id); setConfirmOpen(true) }}
                                        isDeleting={isDeleting}
                                        deleteButtonText="Delete"
                                    />
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
                <VideoModal
                    open={open}
                    onOpenChange={setOpen}
                    videoSrc={currentUrl}
                    title="Weekly Video"
                    autoPlay
                />
            </Card>
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={(o) => { setConfirmOpen(o); if (!o) setTargetDeleteId(null) }}
                title="Delete file?"
                description="This action cannot be undone."
                confirmText="Delete"
                confirmVariant="destructive"
                isLoading={isDeleting}
                onConfirm={handleDelete}
            />
        </>
    )
}
