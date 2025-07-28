import { Icon } from 'lucide-react'
import React from 'react'
import { IconType } from 'react-icons'

import { FaDollarSign, FaBookOpen, FaUsers } from 'react-icons/fa'

interface DashboardCardProps {
    title: string
    value: string | number
    icon: IconType
    iconBgColor?: string
}

const data = [
    {
        title: 'Total Revenue',
        value: '$128,400.00',
        icon: FaDollarSign,
        iconBgColor: 'bg-[#F1C27D]'
    },
    {
        title: 'Traffic Today',
        value: '580',
        icon: FaBookOpen,
        iconBgColor: 'bg-[#F1C27D]'
    },
    {
        title: "Total Students",
        value: "14,200",
        icon: FaUsers,
        iconBgColor: "bg-[#F1C27D]"
    }
]


export default function DashboardCard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 ">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-2xl font-bold text-gray-900 mb-1">
                                {item.value}
                            </p>
                            <p className="text-sm text-gray-500">
                                {item.title}
                            </p>
                        </div>
                        <div className={`${item.iconBgColor} p-3 rounded-lg`}>
                            <item.icon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
