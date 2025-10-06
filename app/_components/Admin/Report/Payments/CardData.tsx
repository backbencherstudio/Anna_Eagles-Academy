'use client'
import ChartBarIcon from '@/components/Icons/ChartBarIcon'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useMemo, useState } from 'react'
import CardShimmerEffect from '../ShimmerEffect/CardShimmerEffect'
import StudentIcon from '@/components/Icons/payments/StudentIcon'
import PaidIcon from '@/components/Icons/payments/PaidIcon'
import SponsoredIcon from '@/components/Icons/payments/SponsoredIcon'
import FreeInrolledIcon from '@/components/Icons/payments/FreeInrolledIcon'
import { useAppSelector } from '@/rtk/hooks'

// Map totals to local metric ids
const mapTotals = (totals: {
    total_students: number
    fully_paid: number
    sponsored: number
    free_enrolled: number
} | null) => ({
    totalStudents: totals?.total_students ?? 0,
    fullyPaid: totals?.fully_paid ?? 0,
    sponsored: totals?.sponsored ?? 0,
    freeEnrolled: totals?.free_enrolled ?? 0,
})

// Metrics configuration
const metrics = [
    { id: 'totalStudents', title: 'Total Students', icon: <StudentIcon /> },
    { id: 'fullyPaid', title: 'Fully Paid',  icon: <PaidIcon /> },
    { id: 'sponsored', title: 'Sponsored',  icon: <SponsoredIcon /> },
    { id: 'freeEnrolled', title: 'Free Enrolled', icon: <FreeInrolledIcon /> }
]

export default function CardData() {
    const [loading, setLoading] = useState(true)
    const paymentOverview = useAppSelector((s) => s.report.paymentOverview)
    const totals = useMemo(() => mapTotals(paymentOverview?.totals ?? null), [paymentOverview])

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
                                {totals[metric.id as keyof typeof totals].toLocaleString('en-US')}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
