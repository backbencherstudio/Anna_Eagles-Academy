import React from 'react'
import StudentFeedbackDetails from '@/app/(dashboard)/_components/Admin/StudentFeedbackDetails'

interface FeedbackDetailsPageProps {
  params: {
    id: string
  }
}

export default function FeedbackDetails({ params }: FeedbackDetailsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Feedback details</h1>
      </div>
      
      <StudentFeedbackDetails feedbackId={params.id} />
    </div>
  )
}
