import React, { useState } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import InProgressIcon from '@/components/Icons/InProgressIcon'
import { IoMdCheckmark } from 'react-icons/io'

// Sample course data based on the image
const sampleCourseData = [
    {
        id: 1,
        courseName: "Foundations of Faith",
        startDate: "01 Mar 2023",
        completionDate: "15 Apr 2023",
        enrolled: 45,
        completed: 32,
        inProgress: 28,
        completionRate: 60
    },
    {
        id: 2,
        courseName: "The Life and Teachings of Jesus",
        startDate: "01 Mar 2023",
        completionDate: "15 Apr 2023",
        enrolled: 38,
        completed: 28,
        inProgress: 12,
        completionRate: 20
    },
    {
        id: 3,
        courseName: "Christian Leadership & Servanthood",
        startDate: "01 Mar 2023",
        completionDate: "15 Apr 2023",
        enrolled: 21,
        completed: 13,
        inProgress: 54,
        completionRate: 50
    },
    {
        id: 4,
        courseName: "Understanding the Bible: Old & New Testament",
        startDate: "01 Mar 2023",
        completionDate: "15 Apr 2023",
        enrolled: 41,
        completed: 85,
        inProgress: 21,
        completionRate: 90
    },
    {
        id: 5,
        courseName: "The Holy Spirit and Daily Guidance",
        startDate: "01 Mar 2023",
        completionDate: "15 Apr 2023",
        enrolled: 41,
        completed: 85,
        inProgress: 21,
        completionRate: 90
    },
    {
        id: 6,
        courseName: "Discipleship & Evangelism Essentials",
        startDate: "01 Mar 2023",
        completionDate: "15 Apr 2023",
        enrolled: 41,
        completed: 85,
        inProgress: 21,
        completionRate: 90
    }
]

// Table headers configuration
const tableHeaders = [
    { key: 'courseName', label: 'COURSE NAME', sortable: true },
    { key: 'startDate', label: 'START DATE', sortable: true },
    { key: 'completionDate', label: 'COMPLETION DATE', sortable: true },
    { key: 'enrolled', label: 'ENROLLED', sortable: true },
    { key: 'completed', label: 'COMPLETED', sortable: true },
    { key: 'inProgress', label: 'IN PROGRESS', sortable: true },
    { key: 'completionRate', label: 'COMPLETION RATE', sortable: true }
]

export default function CourseDetailsTable() {
    const [selectedItems, setSelectedItems] = useState<any[]>([])

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
                data={sampleCourseData}
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
