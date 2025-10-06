import React from 'react'
 import ReusableTable from '@/components/Resuable/ReusableTable'
import { useAppSelector } from '@/rtk/hooks'
 
type SponsoredRow = {
    id: string
    studentName: string
    courseName: string
    paymentDate: string
    sponsorName: string
    sponsorUrl?: string
}
 
 const headers = [
 	{ key: 'studentName', label: 'Student Name', sortable: true },
 	{ key: 'courseName', label: 'Course Name', sortable: true },
 	{ key: 'paymentDate', label: 'Payment Date', sortable: true },
 	{ key: 'sponsorName', label: 'Sponsor Name', sortable: true },
 ]
 
export default function SponsoredTable({
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

    const rows: SponsoredRow[] = (paymentOverview?.sponsored?.items ?? []).map((it: any) => ({
        id: it.id,
        studentName: it.user?.name ?? '—',
        courseName: it.series?.title ?? '—',
        paymentDate: new Date(it.updated_at).toISOString().slice(0, 10),
        sponsorName: it.sponsor_name ?? '—',
        sponsorUrl: it.sponsor_url,
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
 				customCellRenderer={(item: SponsoredRow, header) => {
 					if (header.key === 'sponsorName') {
 						return (
 							<a
                                href={item.sponsorUrl || '#'}
 								target="_blank"
 								rel="noopener noreferrer"
 								className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:underline"
 							>
 								{item.sponsorName}
 							</a>
 						)
 					}
 					return (item as any)[header.key]
 				}}
 			/>
 		</div>
 	)
 }
 