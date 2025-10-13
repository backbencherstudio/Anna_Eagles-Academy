'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CameraIcon from '@/components/Icons/CameraIcon'
import VideoModal from '@/components/Resuable/VideoModal'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
                                    <Card key={v.id} className="rounded-2xl border border-[#ECEFF3] shadow-none">
                                        <div className="p-4">
                                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                                                <video
                                                    key={v.file_url}
                                                    className="h-full w-full object-contain"
                                                    playsInline
                                                    preload="metadata"
                                                    crossOrigin="anonymous"
                                                >
                                                    <source src={v.file_url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                                {/* Play icon overlay */}
                                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                                    <div className="h-12 w-12 rounded-full bg-background/90 shadow flex items-center justify-center">
                                                        <Play className="h-6 w-6 ml-0.5" />
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    aria-label={`Open modal for ${title}`}
                                                    onClick={() => handlePlayClick(v.file_url)}
                                                    className="absolute inset-0 cursor-pointer bg-transparent"
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <CardTitle className="text-base font-semibold truncate" title={title}>{title}</CardTitle>
                                            </div>

                                            <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                                                <span className="rounded-full border px-3 py-1 text-xs">Video</span>
                                                <span>{dateText}</span>
                                            </div>
                                            <div className="mt-3 flex justify-end">
                                                <Button
                                                    onClick={() => { setTargetDeleteId(v.id); setConfirmOpen(true) }}
                                                    disabled={isDeleting}
                                                    variant="outline"
                                                    className="cursor-pointer text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
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
