'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import ChartBarIcon from '@/components/Icons/ChartBarIcon'
import TrafficTrendsChart from './TrafficTrendsChart'
import ChartShimmerEffect from './ShimmerEffect/ChartShimmerEffect'
import CardShimmerEffect from './ShimmerEffect/CardShimmerEffect'

// User statistics data
const userStats = {
    dailyUsers: 280,
    weeklyUsers: 1680,
    monthlyUsers: 6720,
    totalVisits: 3487
}

// Metrics configuration
const metrics = [
    { id: 'dailyUsers', title: 'Daily Users', description: 'Today\'s unique visitors' },
    { id: 'weeklyUsers', title: 'Weekly Users', description: 'This week\'s unique visitors' },
    { id: 'monthlyUsers', title: 'Monthly Users', description: 'This month\'s unique visitors' },
    { id: 'totalVisits', title: 'Total Visits', description: 'All-time page views' }
]

export default function FinancialReportsCard() {
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
                {/* Chart loading */}
                <div className="bg-white rounded-lg mt-6">
                    <div className="flex p-4 sm:p-5 flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-gray-200 pb-4 mb-4">
                        <div className="h-7 bg-gray-200 rounded animate-pulse w-40"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                    </div>
                    <ChartShimmerEffect />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* reports card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <Card key={metric.id} className="bg-white border border-gray-200 rounded-xl transition-shadow duration-200">
                        <CardContent className="p-4">
                            <div className="flex items-center mb-3">
                                <div className="mr-2">
                                    <ChartBarIcon />
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
                            <div className="text-sm text-[#A5A5AB]">
                                {metric.description}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* reports chart */}
            <TrafficTrendsChart loading={loading} />
        </div>
    )
}