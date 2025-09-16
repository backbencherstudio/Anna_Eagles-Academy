import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, FolderLock } from 'lucide-react'
import DocumentsIcon from '@/components/Icons/DocumentsIcon'

type DocumentItem = {
  id: string
  title: string
  uploadedDate: string
  uploadedTime: string
  tag?: string
}

const documents: DocumentItem[] = [
  {
    id: '1',
    title: 'Biblical Studies Assignment.pdf',
    uploadedDate: '08/01/2024',
    uploadedTime: '11:59 PM',
    tag: 'Assignment',
  },
  {
    id: '2',
    title: 'Prayer Journal.docx',
    uploadedDate: '08/01/2024',
    uploadedTime: '11:59 PM',
    tag: 'Assignment',
  },
]

export default function OtherFileSubmissions() {
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
            {documents.map((doc) => (
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
                    <p className="truncate text-sm font-medium sm:text-base">{doc.title}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        Uploaded: <span className="font-medium">{doc.uploadedDate}</span>
                      </span>
                      <span>
                        Uploaded Time: <span className="font-medium">{doc.uploadedTime}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: tag/badge */}
                {doc.tag && (
                  <div className="flex justify-start sm:justify-end">
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                      {doc.tag}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
