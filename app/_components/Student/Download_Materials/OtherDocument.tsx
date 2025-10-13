'use client'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import FilesIcon from '@/components/Icons/DownloadMaterials/FilesIcon'
import Image from 'next/image'
import FilterDropdown from '@/components/Resuable/FilterDropdown'
import { useAppSelector } from '@/rtk/hooks'
import { useGetAllStudentDownloadMaterialsQuery } from '@/rtk/api/users/studentDownloadMetrialsApis'

type OtherDocument = {
  id: string
  title: string
  description: string
  url: string
  thumbnail?: string
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
      )
    case 'doc':
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
      )
    default:
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
      )
  }
}

export default function OtherDocument() {
  const [series, setSeries] = React.useState<string>('')
  const [docType, setDocType] = React.useState<string>('')
  const filters = useAppSelector((state) => state.studentDownloadMetrials)
  const { data, isLoading: isMaterialsLoading } = useGetAllStudentDownloadMaterialsQuery({
    series_id: filters.series_id ?? '',
    course_id: filters.course_id ?? '',
    lecture_type: 'other-document',
    page: filters.page,
    limit: filters.limit,
  })

  const documents: OtherDocument[] = React.useMemo(() => {
    const materials = (data as any)?.data?.materials ?? []
    const uniqueById = Array.from(
      new Map(
        materials
          .filter((m: any) => m.lecture_type === 'other-document')
          .map((m: any) => [m.id, m])
      ).values()
    )
    return uniqueById.map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description ?? '',
      url: m.file_url,
      thumbnail: '/images/Thumbnail.png',
    }))
  }, [data])

  const getFileIconByUrl = (fileUrl: string) => {
    const clean = fileUrl.split('?')[0].split('#')[0]
    const ext = (clean.includes('.') ? clean.substring(clean.lastIndexOf('.') + 1) : '').toLowerCase()
    if (ext === 'pdf') {
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
      )
    }
    if (ext === 'doc' || ext === 'docx') {
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
      )
    }
    if (ext === 'txt') {
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
      )
    }
    return (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
        <FileText className="w-6 h-6 text-white" />
      </div>
    )
  }
  const handleDownload = async (docItem: OtherDocument) => {
    try {
      const response = await fetch(docItem.url)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const urlParts = docItem.url.split('?')[0].split('#')[0]
      const extension = urlParts.includes('.') ? urlParts.substring(urlParts.lastIndexOf('.') + 1) : 'file'
      const sanitizedTitle = docItem.title.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').toLowerCase()
      const filename = `${sanitizedTitle}.${extension}`

      const link = window.document.createElement('a')
      link.href = blobUrl
      link.download = filename
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      window.open(docItem.url, '_blank', 'noopener,noreferrer')
    }
  }
  return (
    <div className="space-y-6 bg-white rounded-xl p-4">
      {/* Files Section Header */}
      <div className='flex items-center justify-between'>
        <div className="flex items-center gap-3">
          <div>
            <FilesIcon />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
        </div>

      </div>

      {/* Other Documents List */}
      {isMaterialsLoading && (
        <div className="text-sm text-gray-500">Loading documents...</div>
      )}
      <div className="space-y-4">
        {documents
          .map((document, idx) => (
            <Card key={`${document.id}-${idx}`} className="rounded-xl border border-gray-200 transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* File Thumbnail */}
                  <div className="flex-shrink-0">
                    {getFileIconByUrl(document.url)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {document.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {document.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <Button
                      onClick={() => handleDownload(document)}
                      className="bg-[#0F2598] cursor-pointer text-white hover:bg-[#0F2598]/90 text-sm font-medium px-4 py-2"
                      size="sm"
                    >
                      Download
                      <Download className="w-4 h-4" />
                    </Button>
                    <p className="text-xs text-gray-500">&nbsp;</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Empty State */}
      {(!isMaterialsLoading && documents.length === 0) && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
          <p className="text-gray-500">Check back later for additional materials.</p>
        </div>
      )}
    </div>
  )
}
