import React from 'react'
import StudentFileDetails from '@/app/(dashboard)/_components/Admin/Assignment/StudentFileDetails'

interface PageProps {
    params: {
        id: string
    }
}

export default function StudentFileDownloadPage({ params }: PageProps) {
    return (
        <div>
            <StudentFileDetails studentId={params.id} />
        </div>
    )
}
