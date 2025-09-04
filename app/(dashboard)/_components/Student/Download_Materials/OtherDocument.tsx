'use client'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Eye } from 'lucide-react'

type OtherDocument = {
  id: string
  title: string
  description: string
  week: string
  type: 'pdf' | 'doc' | 'txt' | 'other'
  size: string
}

const mockOtherDocuments: OtherDocument[] = [
  {
    id: '1',
    title: 'Course Syllabus - Complete Guide',
    description: 'Detailed course syllabus with learning objectives, assessment criteria, and schedule.',
    week: 'Week 1',
    type: 'pdf',
    size: '2.5 MB'
  },
  {
    id: '2',
    title: 'Assignment Guidelines',
    description: 'Comprehensive guidelines for all course assignments and submission requirements.',
    week: 'Week 1',
    type: 'pdf',
    size: '1.8 MB'
  },
  {
    id: '3',
    title: 'Reference Materials',
    description: 'Additional reading materials and resources to supplement your learning.',
    week: 'Week 2',
    type: 'pdf',
    size: '3.2 MB'
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
  return (
    <div className="space-y-6">
      {/* Files Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0F2598] flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Other Documents</h2>
      </div>

      {/* Other Documents Grid */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {mockOtherDocuments.map((document) => (
          <Card key={document.id} className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(document.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                    {document.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                    {document.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Size: {document.size}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-[#0F2598] text-white hover:bg-[#0F2598]/90 text-sm font-medium py-2"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Document
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-[#0F2598] text-[#0F2598] hover:bg-[#0F2598]/5 text-sm font-medium py-2"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
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
