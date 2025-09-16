import React from 'react'
import StudentFeedbackList from '@/app/_components/Admin/StudentFeedbackList'

export default function StudentFeedback() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className='text-xl font-semibold text-[#1D1F2C]'>Feedback List</h1>
        <p className="text-[#777980] mt-1 text-sm">List of feedback received from users.</p>
      </div>
      
      <StudentFeedbackList />
    </div>
  )
}
