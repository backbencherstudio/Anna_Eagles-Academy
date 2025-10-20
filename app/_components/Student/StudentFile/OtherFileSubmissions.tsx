import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, FolderLock } from 'lucide-react'
import DocumentsIcon from '@/components/Icons/DocumentsIcon'
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

export default function OtherFileSubmissions({ items = [] as StudentFileItem[] }: { items?: StudentFileItem[] }) {
  const [deleteStudentFile, { isLoading: isDeleting }] = useDeleteStudentFileMutation()
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [targetDeleteId, setTargetDeleteId] = React.useState<string | null>(null)

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
            {/* Header */}
            <div className="flex items-center gap-3">
              <DocumentsIcon />
              <h3 className="text-lg font-semibold">Document Submissions</h3>
            </div>

            {/* List */}
            {items.length > 0 ? (
                <div className="space-y-4">
                    {items.map((doc) => {
                        const fileName = doc.url || doc.file_url?.split('/').pop() || 'Document'
                        const composed = [doc.series?.title, doc.course?.title].filter(Boolean).join(' - ')
                        const title = composed || fileName
                        const uploadedDate = new Date(doc.created_at).toLocaleDateString()
                        const uploadedTime = new Date(doc.created_at).toLocaleTimeString()
                        return (
                            <div
                                key={doc.id}
                                className="flex flex-col gap-3 rounded-xl border border-[#ECEFF3] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                {/* Left side: icon + title and meta */}
                                <div className="flex flex-1 items-start gap-3 min-w-0">
                                    <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-md bg-muted/50">
                                        <DocumentsIcon />
                                    </div>
                                    <div className="min-w-0 space-y-1">
                                        <p className="truncate text-sm font-medium sm:text-base" title={title}>{title}</p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <span>
                                                Uploaded: <span className="font-medium">{uploadedDate}</span>
                                            </span>
                                            <span>
                                                Uploaded Time: <span className="font-medium">{uploadedTime}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side: tag/badge */}
                                <div className="flex items-center gap-2 justify-start sm:justify-end">
                                    {doc.course?.title && (
                                        <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                                            {doc.course.title}
                                        </span>
                                    )}
                                    <Button
                                        onClick={() => { setTargetDeleteId(doc.id); setConfirmOpen(true) }}
                                        disabled={isDeleting}
                                        variant="outline"
                                        className="cursor-pointer text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <DocumentsIcon />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Submissions Yet</h3>
                    <p className="text-gray-500 max-w-sm">
                        You haven't uploaded any documents yet. Click the "Upload Files" button to get started.
                    </p>
                </div>
            )}
          </div>
        </CardContent>
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
