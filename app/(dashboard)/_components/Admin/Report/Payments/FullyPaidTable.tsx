import React from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'

type FullyPaidRow = {
	id: number
	studentName: string
	courseName: string
	paymentDate: string
	amount: string
}

const headers = [
	{ key: 'studentName', label: 'Student Name', sortable: true },
	{ key: 'courseName', label: 'Course Name', sortable: true },
	{ key: 'paymentDate', label: 'Payment Date', sortable: true },
	{ key: 'amount', label: 'Amount', sortable: true },
]

// Example data (replace with API data when available)
const rows: FullyPaidRow[] = [
	{ id: 1, studentName: 'John Doe', courseName: 'Foundations of Faith', paymentDate: '2024-07-15', amount: '$2,999' },
	{ id: 2, studentName: 'Alex Chen', courseName: 'The Life and Teachings of Jesus', paymentDate: '2024-07-20', amount: '$2,499' },
	{ id: 3, studentName: 'Lisa Garcia', courseName: 'Christian Leadership & Servanthood', paymentDate: '2024-08-01', amount: '$2,499' },
	{ id: 4, studentName: 'Chris Taylor', courseName: 'Understanding the Bible: Old & New Testament', paymentDate: '2024-08-05', amount: '$2,499' },
	{ id: 5, studentName: 'Priya Singh', courseName: 'Biblical Theology Overview', paymentDate: '2024-08-12', amount: '$1,999' },
	{ id: 6, studentName: 'Ahmed Ali', courseName: 'Early Church History', paymentDate: '2024-08-18', amount: '$1,499' },
	{ id: 7, studentName: 'Maria Rossi', courseName: 'Gospels Deep Dive', paymentDate: '2024-08-22', amount: '$2,299' },
	{ id: 8, studentName: 'Ken Watanabe', courseName: 'Letters of Paul', paymentDate: '2024-08-25', amount: '$2,199' },
]

export default function FullyPaidTable() {
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
				customCellRenderer={(item: FullyPaidRow, header) => {
					if (header.key === 'amount') {
						return <span className="text-green-600 font-medium">{item.amount}</span>
					}
					return (item as any)[header.key]
				}}
			/>
		</div>
	)
}
