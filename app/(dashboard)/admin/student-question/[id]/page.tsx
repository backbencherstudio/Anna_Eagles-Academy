import React from 'react'
import StudentQuestionDetail from '@/app/_components/Admin/StudentQuestionDetail'

export default async function StudentQuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <div>
            <StudentQuestionDetail studentId={id} />
        </div>
    )
}
