import React from 'react'
import StudentFileDownload from '@/app/(dashboard)/_components/Admin/Assignment/StudentFileDownload'

export default function StudentFileDownloadPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Files</h1>
            <StudentFileDownload />
        </div>
    )
}
