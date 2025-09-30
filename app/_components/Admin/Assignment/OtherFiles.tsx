import React, { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import DocumentsIcon from '@/components/Icons/DocumentsIcon'
import { useGetSingleStudentFileDownloadQuery } from '@/rtk/api/admin/studentFileDownloadApis'

type DocumentItem = {
  id: string
  title: string
  uploadedDate: string
  uploadedTime: string
  url: string
}

export default function OtherFile({ studentId }: { studentId: string }) {
  const { data } = useGetSingleStudentFileDownloadQuery({ student_id: studentId, section_type: 'Other File Submissions' })
  const documents: DocumentItem[] = useMemo(() => {
    const files: any[] = data?.data?.student_files ?? []
    return files
      .filter(f => f.section_type === 'Other File Submissions')
      .map(f => ({
        id: f.id,
        title: f.url?.split('/')?.pop() ?? 'Submission',
        uploadedDate: new Date(f.created_at).toLocaleDateString(),
        uploadedTime: new Date(f.created_at).toLocaleTimeString(),
        url: f.file_url,
      }))
  }, [data])
  return (
    <Card className="border rounded-xl border-[#ECEFF3]">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <DocumentsIcon />
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
                    <DocumentsIcon />
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

                {/* Right side: download button  */}
                <div className="flex justify-start sm:justify-end">
                  <a href={doc.url} target="_blank" rel="noreferrer" className="inline-flex cursor-pointer items-center rounded-full border px-3 py-1 text-xs">Download</a>
                </div>

              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
