import React from 'react'
import StudentFileDetails from '@/app/_components/Admin/Assignment/StudentFileDetails'

export default async function StudentFileDownloadPage({ params }: { params: { id: string } }) {
    const { id } = params
    return (
        <div>
            <StudentFileDetails studentId={id} />
        </div>
    )
}
