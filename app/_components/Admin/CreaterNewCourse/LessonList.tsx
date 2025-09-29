import React from 'react'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import toast from 'react-hot-toast'
import { useDeleteSingleLessonMutation } from '@/rtk/api/admin/managementCourseApis'

type SavedLesson = {
    id: string
    title: string
    videoName: string | null
    docCount: number
    updatedAt: string
}

type LessonListProps = {
    lessons: SavedLesson[]
    editingId: string | null
    confirmDelete: { open: boolean; targetId: string | null }
    onEdit: (id: string) => void
    onCancelEdit: () => void
    onConfirmDelete: () => void
    onOpenDeleteConfirm: (id: string) => void
    onCloseDeleteConfirm: () => void
    onLessonsAdded?: () => void
}

export default function LessonList({
    lessons,
    editingId,
    confirmDelete,
    onEdit,
    onCancelEdit,
    onConfirmDelete,
    onOpenDeleteConfirm,
    onCloseDeleteConfirm,
    onLessonsAdded
}: LessonListProps) {
    const [deleteLesson] = useDeleteSingleLessonMutation()

    const handleConfirmDelete = async () => {
        if (!confirmDelete.targetId) return
        try {
            const res: any = await deleteLesson(confirmDelete.targetId).unwrap()
            toast.success(res?.message || 'Lesson deleted successfully')
            onCloseDeleteConfirm()
            onLessonsAdded?.()
        } catch (e: any) {
            const errorMessage = e?.data?.message || e?.message || 'Failed to delete lesson'
            toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to delete lesson')
        }
    }

    if (lessons.length === 0) return null

    return (
        <>
            <div className='space-y-3'>
                {lessons.map((item: SavedLesson, idx: number) => (
                    <div key={item.id} className='flex items-center justify-between rounded-md border p-3 bg-white'>
                        <div className='flex items-center gap-3 min-w-0 pr-3'>
                            <div className='w-7 h-7 rounded-full bg-[#0F2598]/10 text-[#0F2598] flex items-center justify-center text-xs font-semibold'>
                                {idx + 1}
                            </div>
                            <div className='min-w-0'>
                                <div className='truncate text-sm font-medium text-gray-900'>{item.title || 'Untitled lesson'}</div>
                                <div className='text-xs text-gray-500'>
                                    {item.videoName ? `Video: ${item.videoName}` : 'No video'} • {item.docCount} document(s)
                                </div>
                                <div className='text-xs text-gray-400 mt-1'>
                                    Updated: {new Date(item.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            {editingId === item.id ? (
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    className='h-8 px-2 cursor-pointer'
                                    onClick={onCancelEdit}
                                >
                                    Cancel
                                </Button>
                            ) : (
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    className='h-8 px-2 cursor-pointer'
                                    onClick={() => onEdit(item.id)}
                                >
                                    <Pencil className='h-4 w-4' />
                                </Button>
                            )}
                            <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                className='h-8 px-2 cursor-pointer'
                                onClick={() => onOpenDeleteConfirm(item.id)}
                            >
                                <Trash2 className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete confirmation modal */}
            <ConfirmDialog
                open={confirmDelete.open}
                onOpenChange={(open) => open ? null : onCloseDeleteConfirm()}
                title="Delete Lesson"
                description="Are you sure you want to delete this lesson? This action cannot be undone."
                onConfirm={handleConfirmDelete}
            />
        </>
    )
}
