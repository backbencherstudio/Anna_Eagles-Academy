 import React from 'react'
 import ReusableTable from '@/components/Resuable/ReusableTable'
 
 type SponsoredRow = {
 	id: number
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
 
 // Example data (replace with API data when available)
 const rows: SponsoredRow[] = [
 	{ id: 1, studentName: 'Jane Smith', courseName: 'Foundations of Faith', paymentDate: '2024-07-15', sponsorName: 'TechCor Inc.', sponsorUrl: 'https://example.com' },
 	{ id: 2, studentName: 'Emily Brown', courseName: 'The Life and Teachings of Jesus', paymentDate: '2024-07-20', sponsorName: 'DataSoft LLC', sponsorUrl: 'https://example.com' },
 	{ id: 3, studentName: 'Tom Anderson', courseName: 'Christian Leadership & Servanthood', paymentDate: '2024-08-01', sponsorName: 'Marketing Pro Agency', sponsorUrl: 'https://example.com' },
 	{ id: 4, studentName: 'Isha Patel', courseName: 'Biblical Theology Overview', paymentDate: '2024-08-08', sponsorName: 'BrightFuture Org', sponsorUrl: 'https://example.com' },
 ]
 
 export default function SponsoredTable() {
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
 