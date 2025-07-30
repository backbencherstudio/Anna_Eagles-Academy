'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PiggyBank, Clock, MinusCircle, FileText, ArrowRight, Download } from 'lucide-react'

// Financial data declaration at the top
const financialData = {
    totalRevenue: 127560.00,
    earningsThisMonth: 14320.00,
    pendingPayouts: 3420.00,
    numberOfTransactions: 3487
}

// Financial metrics configuration
const financialMetrics = [
    {
        id: 'totalRevenue',
        title: 'Total Revenue',
        value: `$${financialData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        icon: PiggyBank,
        color: 'bg-orange-100',
        iconColor: 'text-orange-600'
    },
    {
        id: 'earningsThisMonth',
        title: 'Earnings This Month',
        value: `$${financialData.earningsThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        icon: Clock,
        color: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    {
        id: 'pendingPayouts',
        title: 'Pending Payouts',
        value: `$${financialData.pendingPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        icon: MinusCircle,
        color: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
    },
    {
        id: 'numberOfTransactions',
        title: 'Number of Transactions',
        value: financialData.numberOfTransactions.toLocaleString('en-US'),
        icon: FileText,
        color: 'bg-green-100',
        iconColor: 'text-green-600'
    }
]

export default function FinancialReportsCard() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    const handleExportReport = () => {
        // Handle export functionality
        console.log('Exporting financial report...')
        // You can add actual export logic here
        // For example: download CSV, PDF, etc.
    }

    const handleViewDetails = (metricId: string) => {
        // Handle view details functionality
        console.log('Viewing details for:', metricId)
        // You can add navigation or modal logic here
    }

    // Shimmer Skeleton Component
    const ShimmerCard = () => (
        <Card className="">
            <CardContent className="p-6">
                {/* Icon skeleton */}
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gray-200 animate-pulse">
                        <div className="h-6 w-6 bg-gray-300 rounded"></div>
                    </div>
                </div>

                {/* Value skeleton */}
                <div className="mb-4">
                    <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>

                {/* Separator */}
                <div className="border-t border-dashed border-gray-200 mb-4"></div>

                {/* View details skeleton */}
                <div className="flex items-center">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-3 w-3 bg-gray-200 rounded ml-1 animate-pulse"></div>
                </div>
            </CardContent>
        </Card>
    )

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-100">
                {/* Header skeleton */}
                <div className='flex items-center justify-between mb-6'>
                    <div className="h-7 bg-gray-200 rounded animate-pulse w-40"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse w-48"></div>
                </div>

                {/* Cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <ShimmerCard key={index} />
                    ))}
                </div>


            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className='flex items-center flex-col md:flex-row gap-4 justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-900'>Financial Reports</h2>
                <Button
                    onClick={handleExportReport}
                    variant="outline"
                    className="border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export Financial Report
                </Button>
            </div>

            {/* Financial Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {financialMetrics.map((metric) => {
                    const IconComponent = metric.icon
                    return (
                        <Card key={metric.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                {/* Top Section */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${metric.color}`}>
                                        <IconComponent className={`h-6 w-6 ${metric.iconColor}`} />
                                    </div>
                                </div>

                                {/* Value and Title */}
                                <div className="mb-4">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {metric.value}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {metric.title}
                                    </div>
                                </div>

                                {/* Separator */}
                                <div className="border-t border-dashed border-gray-200 mb-4"></div>

                                {/* View Details Link */}
                                <div
                                    className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                                    onClick={() => handleViewDetails(metric.id)}
                                >
                                    <span>View details</span>
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>


        </div>
    )
}
