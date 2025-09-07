import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import ChartShimmerEffect from './ShimmerEffect/ChartShimmerEffect'



export default function TrafficTrendsChart({ loading }: { loading: boolean }) {
    const [selectedPeriod, setSelectedPeriod] = useState('Daily')
    const [isLoading, setIsLoading] = useState(loading)

    // keep internal loading state in sync with parent prop
    useEffect(() => {
        setIsLoading(loading)
    }, [loading])

    const chartData = {
        Daily: [
            { date: '8/12/2025', baseline: 85, policy: 65 },
            { date: '8/12/2025', baseline: 90, policy: 70 },
            { date: '8/12/2025', baseline: 88, policy: 68 },
            { date: '8/12/2025', baseline: 95, policy: 75 },
            { date: '8/12/2025', baseline: 98, policy: 78 },
            { date: '8/12/2025', baseline: 96, policy: 76 },
            { date: '8/12/2025', baseline: 95, policy: 78 },
        ],
        Weekly: [
            { date: 'Sun', baseline: 85, policy: 65 },
            { date: 'Mon', baseline: 90, policy: 70 },
            { date: 'Tue', baseline: 88, policy: 68 },
            { date: 'Wed', baseline: 95, policy: 75 },
            { date: 'Thu', baseline: 92, policy: 72 },
            { date: 'Fri', baseline: 98, policy: 78 },
            { date: 'Sat', baseline: 85, policy: 65 },
        ],
        Monthly: [
            { date: 'Jan', baseline: 85, policy: 65 },
            { date: 'Feb', baseline: 90, policy: 70 },
            { date: 'Mar', baseline: 88, policy: 68 },
            { date: 'Apr', baseline: 95, policy: 75 },
            { date: 'May', baseline: 92, policy: 72 },
            { date: 'Jun', baseline: 98, policy: 78 },
            { date: 'Jul', baseline: 85, policy: 65 },
            { date: 'Aug', baseline: 90, policy: 70 },
            { date: 'Sep', baseline: 88, policy: 68 },
            { date: 'Oct', baseline: 95, policy: 75 },
            { date: 'Nov', baseline: 92, policy: 72 },
            { date: 'Dec', baseline: 98, policy: 78 },
        ]
    }

    const currentData = chartData[selectedPeriod as keyof typeof chartData]


    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const baselineValue = payload.find((p: any) => p.dataKey === 'baseline')?.value || 0
            const policyValue = payload.find((p: any) => p.dataKey === 'policy')?.value || 0

            // Dynamic title based on selected period
            const getTooltipTitle = () => {
                switch (selectedPeriod) {
                    case 'Daily':
                        return label || 'Date'
                    case 'Weekly':
                        return label || 'Week'
                    case 'Monthly':
                        return label || 'Month'
                    default:
                        return 'Data Point'
                }
            }

            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-50">
                    <div className="text-sm font-semibold text-gray-900 mb-2">{getTooltipTitle()}</div>
                    <div className="space-y-1">
                        <div className="text-sm text-green-600">
                            Baseline Scenario : {baselineValue.toFixed(1)}
                        </div>
                        <div className="text-sm text-blue-600">
                            Policy Scenario : {policyValue.toFixed(1)}
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }


    if (isLoading) {
        return <ChartShimmerEffect />
    }

    return (
        <div className=" bg-white rounded-lg mt-6">
            {/* Header */}
            <div className="flex p-4 sm:p-5 flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Traffic Trends</h2>

                {/* Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 text-sm cursor-pointer w-32">
                                {selectedPeriod}
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent >
                            <DropdownMenuItem className='cursor-pointer' onClick={() => setSelectedPeriod('Daily')}>
                                Daily
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => setSelectedPeriod('Weekly')}>
                                Weekly
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => setSelectedPeriod('Monthly')}>
                                Monthly
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="w-full overflow-x-auto ">
                    <div className="min-w-[600px] h-[250px] sm:h-[300px] lg:h-[350px] focus:outline-none" tabIndex={-1}>
                        <ResponsiveContainer width="100%" height="100%" >
                        <AreaChart
                            data={currentData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                            style={{ outline: 'none' }}
                        >
                            <defs>
                                <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="policyGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="5 5"
                                stroke="#e5e7eb"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                tickMargin={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                tickMargin={10}
                                width={50}
                                domain={[0, 120]}
                                ticks={[0, 30, 60, 80, 100, 120]}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }}
                            />

                            {/* Gradient filled areas */}
                            <Area
                                type="monotone"
                                dataKey="baseline"
                                stroke="none"
                                fill="url(#baselineGradient)"
                                fillOpacity={0.6}
                            />
                            <Area
                                type="monotone"
                                dataKey="policy"
                                stroke="none"
                                fill="url(#policyGradient)"
                                fillOpacity={0.6}
                            />

                            {/* Line overlays */}
                            <Line
                                type="monotone"
                                dataKey="baseline"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: '#22c55e', strokeWidth: 2, fill: '#22c55e' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="policy"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#3b82f6' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Scroll Indicator for Mobile */}
            <div className="mt-2 text-center sm:hidden">
                <p className="text-xs text-gray-500">← Scroll horizontally to see more data →</p>
            </div>
        </div>
    )
}
