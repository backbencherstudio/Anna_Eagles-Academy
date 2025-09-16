import React from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'

type FreeEnrolledRow = {
  id: number
  studentName: string
  courseName: string
  enrollmentDate: string
}

const headers = [
  { key: 'studentName', label: 'Student Name', sortable: true },
  { key: 'courseName', label: 'Course Name', sortable: true },
  { key: 'enrollmentDate', label: 'Enrollment Date', sortable: true },
]

// Example data (replace with API data when available)
const rows: FreeEnrolledRow[] = [
  { id: 1, studentName: 'Jane Smith', courseName: 'Foundations of Faith', enrollmentDate: '2024-07-15' },
  { id: 2, studentName: 'Emily Brown', courseName: 'The Life and Teachings of Jesus', enrollmentDate: '2024-07-20' },
  { id: 3, studentName: 'Tom Anderson', courseName: 'Christian Leadership & Servanthood', enrollmentDate: '2024-08-01' },
  { id: 4, studentName: 'Samuel Park', courseName: 'Old Testament Survey', enrollmentDate: '2024-08-06' },
  { id: 5, studentName: 'Aisha Khan', courseName: 'Biblical Theology Overview', enrollmentDate: '2024-08-11' },
]

export default function FreeEnrolledTable() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="w-full">
      <ReusableTable
        headers={headers}
        data={rows}
        itemsPerPage={5}
        itemsPerPageOptions={[5, 10, 15, 20]}
        showPagination
        isLoading={isLoading}
        skeletonRows={5}
      />
    </div>
  )
}
