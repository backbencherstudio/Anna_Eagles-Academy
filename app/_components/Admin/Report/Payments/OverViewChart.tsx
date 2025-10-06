"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import PieChartSkeleton from '../ShimmerEffect/PieChartSkeleton'
import { useAppSelector } from '@/rtk/hooks'

const COLORS: Record<string, string> = {
    'Full Paid': '#10B981',
    'Sponsored': '#3B82F6',
    'Free Enrolled': '#FE964A',
}

// Custom legend to control order explicitly and ensure responsiveness
const CustomLegend: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <div
            className='flex flex-wrap justify-center items-center gap-3 md:gap-6 pt-4'
            style={{ fontSize: 14, fontWeight: 500 }}
        >
            {data.map((item) => (
                <span key={item.name} style={{ color: item.color, display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color, display: 'inline-block', marginRight: 8 }} />
                    {item.name} {item.percentage}
                </span>
            ))}
        </div>
    )
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-semibold" style={{ color: data.color }}>
                    {data.name}: {data.percentage}
                </p>
            </div>
        )
    }
    return null
}

export default function OverViewChart() {
    const [isLoading, setIsLoading] = useState(true)
    const paymentOverview = useAppSelector((s) => s.report.paymentOverview)
    const data = useMemo(() => {
        const src = paymentOverview?.overview ?? []
        return src.map((d) => ({
            name: d.label,
            value: d.count,
            color: COLORS[d.label] ?? '#999999',
            percentage: `${d.percentage}%`,
        }))
    }, [paymentOverview])

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 200)
        return () => clearTimeout(timer)
    }, [])

    if (isLoading && data.length === 0) {
        return <PieChartSkeleton height={320} outerSize={220} innerInset={28} showHeader={false} />
    }

    return (
        <div className="w-full h-80 md:h-80 flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        innerRadius="48%"
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={2}
                        stroke="#ffffff"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={2}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={80}
                        content={<CustomLegend data={data} />}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
