'use client'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import FilesIcon from '@/components/Icons/DownloadMaterials/FilesIcon'
import Image from 'next/image'
import FilterDropdown from '@/components/Resuable/FilterDropdown'

type OtherDocument = {
  id: string
  title: string
  description: string
  week: string
  type: 'pdf' | 'doc' | 'txt' | 'other'
  size: string
  url: string
  thumbnail?: string
}

const mockOtherDocuments: OtherDocument[] = [
  {
    id: '1',
    title: 'PPT Demo File',
    description: 'Sample PowerPoint slide deck for testing downloads and previews.',
    week: 'Week 1',
    type: 'other',
    size: '1.1 MB',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pptx-file.pptx',
    thumbnail: '/images/Thumbnail.png'
  },
  {
    id: '2',
    title: 'DOC Demo File',
    description: 'Sample Word document for testing file handling in the app.',
    week: 'Week 1',
    type: 'doc',
    size: '48 KB',
    url: 'https://file-examples.com/storage/fefb5b5f8795a1b259d5b2e/2017/02/file-sample_100kB.docx',
    thumbnail: '/images/Thumbnail.png'
  },
  {
    id: '3',
    title: 'PDF Demo File',
    description: 'Standard PDF sample to verify download and open-in-new-tab behavior.',
    week: 'Week 2',
    type: 'pdf',
    size: '2.5 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnail: '/images/Thumbnail.png'
  },
  {
    id: '4',
    title: 'Other (TXT) Demo File',
    description: 'Plain text sample file representing other document types.',
    week: 'Week 2',
    type: 'txt',
    size: '1 KB',
    url: 'https://www.w3.org/TR/PNG/iso_8859-1.txt',
    thumbnail: '/images/Thumbnail.png'
  }
]

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
        <div className='flex items-center gap-3'>
          <FilterDropdown
            options={[
              { label: 'Select Series', value: '' },
              { label: 'Series A', value: 'a' },
              { label: 'Series B', value: 'b' },
              { label: 'Series C', value: 'c' },
            ]}
            value={series}
            onChange={setSeries}
            placeholder="Select Series"
            className='w-48'
          />
          <FilterDropdown
            options={[
              { label: 'All Types', value: '' },
              { label: 'PDF', value: 'pdf' },
              { label: 'DOC', value: 'doc' },
              { label: 'TXT', value: 'txt' },
              { label: 'Other', value: 'other' },
            ]}
            value={docType}
            onChange={setDocType}
            placeholder="Courses Type"
            className='w-48'
          />
        </div>
      </div>

      {/* Other Documents List */}
      <div className="space-y-4">
        {mockOtherDocuments
          .filter(d => (docType ? d.type === docType : true))
          .map((document) => (
          <Card key={document.id} className="rounded-xl border border-gray-200 transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {/* File Thumbnail */}
                <div className="flex-shrink-0">
                  {document.thumbnail ? (
                    <Image className='rounded-lg w-24 h-20' src={document.thumbnail} alt={document.title} width={100} height={100} />
                  ) : (
                    getFileIcon(document.type)
                  )}
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
                  <p className="text-xs text-gray-500">{document.size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockOtherDocuments.length === 0 && (
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
