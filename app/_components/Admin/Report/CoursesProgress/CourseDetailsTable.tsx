import React, { useMemo, useState } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import InProgressIcon from '@/components/Icons/InProgressIcon'
import { IoMdCheckmark } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { RootState } from '@/rtk'

function formatDate(iso: string | null | undefined) {
    if (!iso) return '-'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

// Table headers configuration
const tableHeaders = [
    { key: 'seriesName', label: 'Series Name', sortable: true },
    { key: 'startDate', label: 'START DATE', sortable: true },
    { key: 'completionDate', label: 'COMPLETION DATE', sortable: true },
    { key: 'enrolled', label: 'ENROLLED', sortable: true },
    { key: 'completed', label: 'COMPLETED', sortable: true },
    { key: 'inProgress', label: 'IN PROGRESS', sortable: true },
    { key: 'completionRate', label: 'COMPLETION RATE', sortable: true }
]

export default function CourseDetailsTable() {
    const [selectedItems, setSelectedItems] = useState<any[]>([])
    const seriesDetails = useSelector((state: RootState) => (state.report.seriesProgress as any)?.series_details as any[] | undefined)

    const rows = useMemo(() => {
        if (Array.isArray(seriesDetails)) {
            return seriesDetails.map((s: any, idx: number) => ({
                id: s.series_id ?? idx,
                seriesName: s.series_name ?? '-',
                startDate: formatDate(s.start_date),
                completionDate: formatDate(s.completion_date),
                enrolled: s.enrolled ?? 0,
                completed: s.completed ?? 0,
                inProgress: s.in_progress ?? 0,
                completionRate: s.completion_rate ?? 0,
            }))
        }
        return []
    }, [seriesDetails])

    // Custom cell renderer for specific columns
    const customCellRenderer = (item: any, header: any) => {
        switch (header.key) {
            case 'completed':
                return (
                    <div className="inline-flex items-center gap-1.5 px-4 py-1 border border-[#12B76A3D] bg-[#12B76A0D] text-[#12B76A] rounded-xl text-sm font-medium">
                        <IoMdCheckmark />
                        <span>{item.completed}</span>
                    </div>
                )
            case 'inProgress':
                return (
                    <div className="inline-flex items-center gap-1.5 px-4 py-1 border border-[#C7892F0D] bg-[#D586120D] text-[#F1C27D] rounded-xl text-sm font-medium">
                        <InProgressIcon />
                        <span>{item.inProgress}</span>
                    </div>
                )
            case 'completionRate':
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${item.completionRate}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-medium">{item.completionRate}%</span>
                    </div>
                )
            default:
                return item[header.key]
        }
    }

    return (
        <div className="w-full bg-white p-4 rounded-lg">

            <div className='mb-6'>
                <h1 className='text-[#1D1F2C] text-xl font-semibold'>Course Details</h1>
            </div>

            <ReusableTable
                headers={tableHeaders}
                data={rows}
                itemsPerPage={5}
                itemsPerPageOptions={[5, 10, 15, 20]}
                showPagination={true}
                showCheckbox={false}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                customCellRenderer={customCellRenderer}
            />
        </div>
    )
}
