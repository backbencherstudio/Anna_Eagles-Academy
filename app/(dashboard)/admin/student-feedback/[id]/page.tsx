import React from 'react'
import StudentFeedbackDetails from '@/app/_components/Admin/StudentFeedbackDetails'

export default async function FeedbackDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <StudentFeedbackDetails feedbackId={id} />
    </>
  )
}
