import React from 'react'
import StudentFeedbackDetails from '@/app/_components/Admin/StudentFeedbackDetails'

export default async function FeedbackDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Feedback details</h1>
      </div>
      <StudentFeedbackDetails feedbackId={id} />
    </div>
  )
}
