import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, FolderLock } from 'lucide-react'
import DocumentsIcon from '@/components/Icons/DocumentsIcon'

type StudentFileItem = {
  id: string
  created_at: string
  file_url: string
  url?: string
  course?: { title: string }
  series?: { title: string }
}

export default function OtherFileSubmissions({ items = [] as StudentFileItem[] }: { items?: StudentFileItem[] }) {
  return (
    <Card className="border rounded-xl border-[#ECEFF3]">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <DocumentsIcon/>
            <h3 className="text-lg font-semibold">Document Submissions</h3>
          </div>

          {/* List */}
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
                    <DocumentsIcon  />
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
                {doc.course?.title && (
                  <div className="flex justify-start sm:justify-end">
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                      {doc.course.title}
                    </span>
                  </div>
                )}
              </div>
              )})}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
