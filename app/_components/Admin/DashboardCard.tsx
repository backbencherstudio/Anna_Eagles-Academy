
import React from 'react'
import { FaDollarSign, FaBookOpen, FaUsers, FaUserPlus, FaCreditCard } from 'react-icons/fa'
import CardShimmerEffect from './Report/ShimmerEffect/CardShimmerEffect';

interface DashboardStats {
    total_revenue: string;
    total_users: number;
    new_enrollments: number;
    new_users: number;
    completed_payments: number;
}

interface DashboardCardProps {
    dashboardStats?: DashboardStats;
    isLoading?: boolean;
}

export default function DashboardCard({ dashboardStats, isLoading }: DashboardCardProps) {
    const data = [
        {
            title: 'Total Revenue',
            value: `$${dashboardStats?.total_revenue || '0'}`,
            icon: FaDollarSign,
            iconBgColor: 'bg-[#F1C27D]'
        },
        {
            title: 'Total Users',
            value: dashboardStats?.total_users?.toString() || '0',
            icon: FaUsers,
            iconBgColor: 'bg-[#F1C27D]'
        },
        {
            title: "New Enrollments",
            value: dashboardStats?.new_enrollments?.toString() || '0',
            icon: FaBookOpen,
            iconBgColor: "bg-[#F1C27D]"
        },
        {
            title: "New Users",
            value: dashboardStats?.new_users?.toString() || '0',
            icon: FaUserPlus,
            iconBgColor: "bg-[#F1C27D]"
        }
    
    ]

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <CardShimmerEffect key={index} />
                ))}
            </div>
        )
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
            {data.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 ">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="xl:text-2xl text-xl font-bold text-gray-900 mb-1">
                                {item.value}
                            </p>
                            <p className="text-sm xl:text-base text-gray-500">
                                {item.title}
                            </p>
                        </div>
                        <div className={`${item.iconBgColor} p-3 rounded-lg`}>
                            <item.icon className="xl:w-6 xl:h-6 w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
