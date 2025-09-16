import React from 'react'
import StudentFileDetails from '@/app/(dashboard)/_components/Admin/Assignment/StudentFileDetails'

export default async function StudentFileDownloadPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <div>
            <StudentFileDetails studentId={id} />
        </div>
    )
}
