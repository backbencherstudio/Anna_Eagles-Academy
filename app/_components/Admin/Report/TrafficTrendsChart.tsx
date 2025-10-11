import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import ChartShimmerEffect from './ShimmerEffect/ChartShimmerEffect'
import { useGetWebsiteTrafficQuery } from '@/rtk/api/admin/reportApis'

// Types for API data
interface ChartDataPoint {
    day?: string;
    month?: string;
    date?: string;
    users: number;
}



export default function TrafficTrendsChart() {
    const [selectedPeriod, setSelectedPeriod] = useState('week')
    const [isRefreshing, setIsRefreshing] = useState(false)

    const { data: trafficData, refetch, isLoading } = useGetWebsiteTrafficQuery({ period: selectedPeriod })

    // Handle period change
    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
    };

    // Handle reload with animation
    const handleReload = () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        refetch();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 500);
    };

    // Transform API data to chart format
    const transformChartData = () => {
        if (!trafficData?.data?.website_traffic_trends?.chart_data) return [];

        const currentData = trafficData.data.website_traffic_trends.chart_data.current_period.data || [];
        const lastData = trafficData.data.website_traffic_trends.chart_data.last_period.data || [];
        const dataMap = new Map();

        // Process current period data
        currentData.forEach((item: ChartDataPoint) => {
            const key = item.day || item.month || item.date || 'Unknown';
            const displayLabel = item.day || item.month || item.date || 'Unknown';

            dataMap.set(key, {
                date: displayLabel,
                thisPeriod: item.users || 0,
                lastPeriod: 0
            });
        });

        // Process last period data
        lastData.forEach((item: ChartDataPoint) => {
            const key = item.day || item.month || item.date || 'Unknown';
            const displayLabel = item.day || item.month || item.date || 'Unknown';

            if (dataMap.has(key)) {
                dataMap.get(key).lastPeriod = item.users || 0;
            } else {
                dataMap.set(key, {
                    date: displayLabel,
                    thisPeriod: 0,
                    lastPeriod: item.users || 0
                });
            }
        });

        return Array.from(dataMap.values());
    };

    const chartData = transformChartData();
    const summary = trafficData?.data?.website_traffic_trends?.summary;
    const currentUsers = summary?.current_period_users || 0;
    const percentageChange = summary?.growth_percentage || 0;
    const growthDirection = summary?.growth_direction || 'up';


    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const thisPeriodValue = payload.find((p: any) => p.dataKey === 'thisPeriod')?.value || 0;
            const lastPeriodValue = payload.find((p: any) => p.dataKey === 'lastPeriod')?.value || 0;

            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-50">
                    <div className="text-sm font-medium text-gray-900 mb-2">Website Traffic</div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{summary?.current_period_label || 'This period'}</span>
                            <span className="text-sm font-medium text-orange-500">{thisPeriodValue}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                {summary?.previous_period_label || 'Last period'}
                            </span>
                            <span className="text-sm font-medium text-blue-500">{lastPeriodValue}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };


    if (isLoading || isRefreshing) {
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
                            <Button variant="outline" className="flex items-center gap-2 text-sm cursor-pointer">
                                {selectedPeriod === 'week' ? 'Week' : 'Month'}
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => handlePeriodChange('week')}>
                                Week
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => handlePeriodChange('month')}>
                                Month
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 sm:h-10 sm:w-10 cursor-pointer"
                        onClick={handleReload}
                        disabled={isRefreshing}
                    >
                        <RefreshCw
                            className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-1000 ease-in-out ${isRefreshing ? 'animate-spin' : ''
                                }`}
                        />
                    </Button>
                </div>
            </div>

            {/* Traffic Info and Legend */}
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 px-4 sm:px-5'>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">{currentUsers}</span>
                    <div className={`flex items-center gap-1 ${growthDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {growthDirection === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-sm font-medium">{Math.abs(percentageChange)}</span>
                        <span className='text-sm font-medium text-black'>% from last period</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-xs sm:text-sm text-gray-600">{summary?.current_period_label || 'This period'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-xs sm:text-sm text-gray-600">{summary?.previous_period_label || 'Last period'}</span>
                    </div>
                </div>
            </div>

            <div className="w-full overflow-x-auto ">
                <div className="min-w-[600px] h-[250px] sm:h-[300px] lg:h-[350px] focus:outline-none" tabIndex={-1}>
                    <ResponsiveContainer width="100%" height="100%" >
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                            style={{ outline: 'none' }}
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
                                activeDot={{ r: 5, stroke: '#f97316', strokeWidth: 2, fill: '#f97316' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="lastPeriod"
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
