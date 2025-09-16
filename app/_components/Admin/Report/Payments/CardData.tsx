'use client'
import ChartBarIcon from '@/components/Icons/ChartBarIcon'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import CardShimmerEffect from '../ShimmerEffect/CardShimmerEffect'
import StudentIcon from '@/components/Icons/payments/StudentIcon'
import PaidIcon from '@/components/Icons/payments/PaidIcon'
import SponsoredIcon from '@/components/Icons/payments/SponsoredIcon'
import FreeInrolledIcon from '@/components/Icons/payments/FreeInrolledIcon'

// User statistics data
const userStats = {
    dailyUsers: 280,
    weeklyUsers: 1680,
    monthlyUsers: 6720,
    totalVisits: 3487
}

// Metrics configuration
const metrics = [
    { id: 'dailyUsers', title: 'Total Students', icon: <StudentIcon /> },
    { id: 'weeklyUsers', title: 'Fully Paid',  icon: <PaidIcon /> },
    { id: 'monthlyUsers', title: 'Sponsored',  icon: <SponsoredIcon /> },
    { id: 'totalVisits', title: 'Free Enrolled', icon: <FreeInrolledIcon /> }
]

export default function CardData() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 200)
        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Cards loading */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <CardShimmerEffect key={index} />
                    ))}
                </div>
              
            </div>
        )
    }


    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => (
                <Card key={metric.id} className="bg-white border border-gray-200 rounded-xl transition-shadow duration-200">
                    <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                            <div className="mr-2">
                                {metric.icon}
                            </div>
                            <h3 className="text-sm font-medium text-[#5B5A64]">
                                {metric.title}
                            </h3>
                        </div>
                        <div className="mb-3 pt-5">
                            <div className="text-2xl font-bold text-[#161618]">
                                {userStats[metric.id as keyof typeof userStats].toLocaleString('en-US')}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
