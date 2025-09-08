"use client"
import React, { useEffect, useState } from 'react'
import ChartSkeleton from './ChartSkeleton'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'

type CourseRate = {
    course: string
    rate: number
}

const DATA: CourseRate[] = [
    { course: 'Foundations of Faith', rate: 30 },
    { course: 'The Life and Teachings of Jesus', rate: 103 },
    { course: 'Christian Leadership', rate: 12 },
    { course: 'Unshakable Faith', rate: 78 },
    { course: 'Women in Scripture', rate: 42 },
    { course: 'Theology & Tradition', rate: 76 },
    { course: 'Church Growth', rate: 31 },
    { course: 'Ethics & Discipleship', rate: 18 },
    { course: 'Practical Evangelism', rate: 66 },
    { course: 'Acts: Early Church', rate: 20 },
    { course: 'The Kingdom of God', rate: 102 },
]

function splitIntoTwoLines(text: string, maxPerLine: number = 16): [string, string] {
    const words = text.split(' ')
    let firstLine = ''
    let secondLine = ''
    for (const word of words) {
        if ((firstLine + (firstLine ? ' ' : '') + word).length <= maxPerLine) {
            firstLine = firstLine ? `${firstLine} ${word}` : word
        } else {
            secondLine = secondLine ? `${secondLine} ${word}` : word
        }
    }
    if (!secondLine && firstLine.length > maxPerLine) {
        // Fallback split in the middle if a single long word or exceeded
        const mid = Math.floor(firstLine.length / 2)
        secondLine = firstLine.slice(mid)
        firstLine = firstLine.slice(0, mid)
    }
    return [firstLine, secondLine]
}

function TwoLineTick(props: any) {
    const { x, y, payload } = props
    const [l1, l2] = splitIntoTwoLines(payload.value as string)
    return (
        <g transform={`translate(${x},${y}) rotate(-45)`}>
            <text textAnchor="end" fill="#6B7280" fontSize={10}>
                <tspan x={0} dy={0}>{l1}</tspan>
                {l2 ? <tspan x={0} dy={12}>{l2}</tspan> : null}
            </text>
        </g>
    )
}

function HeaderStats({ overall }: { overall: number }) {
    return (
        <div className=" text-xs text-[#0F2598]">
            Completion Rate: {overall}%
        </div>
    )
}

export default function CourseCompletionRatesChart() {
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const update = () => setIsSmallScreen(window.innerWidth < 1024) // below lg
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600)
        return () => clearTimeout(t)
    }, [])

    const overall = 64
    if (loading) return <ChartSkeleton height={320} />
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 lg:overflow-x-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <h3 className=" text-sm font-medium text-[#1D1F2C]">Course Completion Rates</h3>
                <HeaderStats overall={overall} />
            </div>
            <div className={`h-80 w-full ${isSmallScreen ? 'overflow-x-auto' : 'overflow-x-hidden'}`}>
                <div
                    className="h-full"
                    style={{ minWidth: isSmallScreen ? `${Math.max(DATA.length * 80, 800)}px` : '100%' }}
                >
                    <ResponsiveContainer>
                        <BarChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="course"
                            tickLine={false}
                            axisLine={false}
                            tick={
                                // @ts-ignore - Recharts allows ReactNode here
                                <TwoLineTick />
                            }
                            interval={0}
                            height={70}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 10, fill: '#6B7280' }}
                        />
                        <Tooltip
                            wrapperStyle={{ pointerEvents: 'auto' }}
                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                            formatter={(value: any) => [`${value}%`, 'Completion Rate %']}
                            labelFormatter={(label: string) => label}
                        />
                        <Bar dataKey="rate" fill="#0F2598" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
