"use client"
import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import ChartSkeleton from './ChartSkeleton'

type CompletionSlice = {
    name: string
    value: number
    color: string
}

const COMPLETION_DATA: CompletionSlice[] = [
    { name: 'Completed', value: 73, color: '#16A34A' },
    { name: 'In Progress', value: 27, color: '#FACC15' },
]

function DonutCenterLabel({ completed }: { completed: number }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
                <p className="text-2xl font-semibold text-[#1D1F2C]">{completed}%</p>
                <p className="text-xs text-[#777980]">Completed</p>
            </div>
        </div>
    )
}

function CompletionLegend({ data }: { data: CompletionSlice[] }) {
    return (
        <div className="mt-6 flex items-center justify-center gap-6">
            {data.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                    <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#1D1F2C]">{item.name}</span>
                    <span className="text-[#777980]">{item.value}%</span>
                </div>
            ))}
        </div>
    )
}

export default function CompletionStatusPieChart() {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 200)
        return () => clearTimeout(t)
    }, [])
    if (loading) return <ChartSkeleton height={256} variant="pie" />
    const completedSlice = COMPLETION_DATA.find((d) => d.name === 'Completed')
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-medium text-[#1D1F2C]">Completion Status Distribution</h3>
            <div className="relative h-64 w-full">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={COMPLETION_DATA}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            stroke="#fff"
                            strokeWidth={2}
                        >
                            {COMPLETION_DATA.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                            formatter={(value: any, _name, payload: any) => [
                                `${value}%`,
                                payload?.name,
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <DonutCenterLabel completed={completedSlice?.value ?? 0} />
            </div>
            <CompletionLegend data={COMPLETION_DATA} />
        </div>
    )
}
