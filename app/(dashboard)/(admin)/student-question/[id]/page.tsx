import React from 'react'
import StudentQuestionDetail from '../../../_components/Admin/StudentQuestionDetail'

interface StudentQuestionDetailPageProps {
    params: {
        id: string
    }
}

export default function StudentQuestionDetailPage({ params }: StudentQuestionDetailPageProps) {
    return (
        <div>
            <StudentQuestionDetail studentId={params.id} />
        </div>
    )
}
