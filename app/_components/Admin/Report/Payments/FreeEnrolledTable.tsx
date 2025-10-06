import React from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { useAppSelector } from '@/rtk/hooks'

type FreeEnrolledRow = {
  id: string
  studentName: string
  courseName: string
  enrollmentDate: string
}

const headers = [
  { key: 'studentName', label: 'Student Name', sortable: true },
  { key: 'courseName', label: 'Course Name', sortable: true },
  { key: 'enrollmentDate', label: 'Enrollment Date', sortable: true },
]

export default function FreeEnrolledTable({
  currentPage = 1,
  totalPages = 0,
  totalItems = 0,
  itemsPerPage = 5,
  onPageChange,
  onItemsPerPageChange,
  isParentFetching,
}: {
  currentPage?: number
  totalPages?: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange?: (p: number) => void
  onItemsPerPageChange?: (l: number) => void
  isParentFetching?: boolean
}) {
  const paymentOverview = useAppSelector((s) => s.report.paymentOverview)
  const [isLoading, setIsLoading] = React.useState(!paymentOverview)

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(t)
  }, [paymentOverview])

  const rows: FreeEnrolledRow[] = (paymentOverview?.free_enrolled?.items ?? []).map((it: any) => ({
    id: it.id,
    studentName: it.user?.name ?? '—',
    courseName: it.series?.title ?? '—',
    enrollmentDate: new Date(it.updated_at).toISOString().slice(0, 10),
  }))

  return (
    <div className="w-full">
      <ReusableTable
        headers={headers}
        data={rows}
        itemsPerPageOptions={[5, 10, 15, 20]}
        showPagination
        serverControlled={true}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        isLoading={isLoading || !!isParentFetching}
        skeletonRows={5}
      />
    </div>
  )
}
