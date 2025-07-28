import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, RefreshCw, TrendingDown } from 'lucide-react'
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

export default function RevenueGrowthPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('Month')

    const chartData = [
        { date: 'May 01', thisPeriod: 6000, lastPeriod: 3000 },
        { date: 'May 05', thisPeriod: 5800, lastPeriod: 2500 },
        { date: 'May 08', thisPeriod: 7200, lastPeriod: 3500 },
        { date: 'May 13', thisPeriod: 5900, lastPeriod: 4800 },
        { date: 'May 18', thisPeriod: 6500, lastPeriod: 3200 },
        { date: 'May 20', thisPeriod: 7300, lastPeriod: 4000 },
        { date: 'May 25', thisPeriod: 6800, lastPeriod: 2800 },
        { date: 'May 30', thisPeriod: 5000, lastPeriod: 2800 },
    ]

    const currentRevenue = 1280.00
    const percentageChange = -8.5

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const thisPeriodValue = payload.find((p: any) => p.dataKey === 'thisPeriod')?.value || 0
            const lastPeriodValue = payload.find((p: any) => p.dataKey === 'lastPeriod')?.value || 0

            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-50">
                    <div className="text-sm font-medium text-gray-900 mb-2">Total Revenue</div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{label}, 2025</span>
                            <span className="text-sm font-medium text-orange-500">
                                ${(thisPeriodValue / 1000).toFixed(1)}K
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                {label.replace('May', 'Apr')}, 2025
                            </span>
                            <span className="text-sm font-medium text-blue-500">
                                ${(lastPeriodValue / 1000).toFixed(1)}K
                            </span>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }

    // Custom Y-axis tick formatter
    const formatYAxis = (tickItem: number) => `$${(tickItem / 1000)}K`

    return (
        <div className="p-4 sm:p-6 bg-white rounded-lg">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Revenue Growth</h2>

                {/* Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 text-sm">
                                {selectedPeriod}
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSelectedPeriod('Week')}>
                                Week
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedPeriod('Month')}>
                                Month
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedPeriod('Year')}>
                                Year
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                </div>
            </div>

            {/* Revenue Info and Legend */}
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">${currentRevenue.toFixed(2)}</span>
                    <div className="flex items-center gap-1 text-red-500">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-medium">{Math.abs(percentageChange)}</span>
                        <span className='text-sm font-medium text-black'>% from last period</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-xs sm:text-sm text-gray-600">This period</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-xs sm:text-sm text-gray-600">Last period</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-[600px] h-[250px] sm:h-[300px] lg:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%" >
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <defs>
                                <linearGradient id="thisPeriodGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="lastPeriodGradient" x1="0" y1="0" x2="0" y2="1">
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
                                tickFormatter={formatYAxis}
                                tickMargin={10}
                                width={50}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }}
                            />

                            {/* Gradient filled areas */}
                            <Area
                                type="monotone"
                                dataKey="thisPeriod"
                                stroke="none"
                                fill="url(#thisPeriodGradient)"
                                fillOpacity={0.6}
                            />
                            <Area
                                type="monotone"
                                dataKey="lastPeriod"
                                stroke="none"
                                fill="url(#lastPeriodGradient)"
                                fillOpacity={0.6}
                            />

                            {/* Line overlays */}
                            <Line
                                type="monotone"
                                dataKey="thisPeriod"
                                stroke="#f97316"
                                strokeWidth={2}
                                dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: '#f97316', strokeWidth: 2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="lastPeriod"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
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
