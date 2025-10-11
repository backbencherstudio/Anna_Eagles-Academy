import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react'
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import ChartShimmerEffect from './Report/ShimmerEffect/ChartShimmerEffect'

// Types
interface ChartDataPoint {
    date?: string;
    day?: string;
    month?: string;
    revenue: number;
}

interface ChartData {
    label: string;
    data: ChartDataPoint[];
}

interface RevenueGrowthSummary {
    current_period_revenue: number;
    previous_period_revenue: number;
    growth_percentage: number;
    growth_direction: "up" | "down";
    current_period_label: string;
    previous_period_label: string;
    period_type: string;
}

interface RevenueGrowth {
    summary: RevenueGrowthSummary;
    chart_data: {
        current_period: ChartData;
        last_period: ChartData;
    };
}

interface RevenueGrowthPageProps {
    revenueGrowth?: RevenueGrowth;
    onPeriodChange?: (period: string) => void;
    onReload?: () => void;
    isLoading?: boolean;
}

export default function RevenueGrowthPage({ revenueGrowth, onPeriodChange, onReload, isLoading }: RevenueGrowthPageProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('Week')
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Handle period change
    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
        onPeriodChange?.(period.toLowerCase());
    };

    // Handle reload with animation
    const handleReload = () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        onReload?.();
        // Keep shimmer visible for a minimum time for better UX
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

    // Transform API data to chart format
    const transformChartData = () => {
        if (!revenueGrowth?.chart_data) return [];

        const currentData = revenueGrowth.chart_data.current_period.data || [];
        const lastData = revenueGrowth.chart_data.last_period.data || [];
        const dataMap = new Map();

        // Process current period data
        currentData.forEach(item => {
            const key = item.date || item.day || item.month || 'Unknown';
            const displayLabel = item.month || item.day || item.date || 'Unknown';

            dataMap.set(key, {
                date: displayLabel,
                thisPeriod: item.revenue,
                lastPeriod: 0
            });
        });

        // Process last period data
        lastData.forEach(item => {
            const key = item.date || item.day || item.month || 'Unknown';
            const displayLabel = item.month || item.day || item.date || 'Unknown';

            if (dataMap.has(key)) {
                dataMap.get(key).lastPeriod = item.revenue;
            } else {
                dataMap.set(key, {
                    date: displayLabel,
                    thisPeriod: 0,
                    lastPeriod: item.revenue
                });
            }
        });

        return Array.from(dataMap.values());
    };

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload?.length) return null;

        const thisPeriodValue = payload.find((p: any) => p.dataKey === 'thisPeriod')?.value || 0;
        const lastPeriodValue = payload.find((p: any) => p.dataKey === 'lastPeriod')?.value || 0;

        const formatLabel = (label: string) => {
            if (!label || label === 'Invalid Date') {
                return revenueGrowth?.summary?.current_period_label || 'This period';
            }
            if (['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(label)) {
                return `${label} ${revenueGrowth?.summary?.current_period_label || 'This period'}`;
            }
            return label;
        };

        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-50">
                <div className="text-sm font-medium text-gray-900 mb-2">Total Revenue</div>
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{formatLabel(label)}</span>
                        <span className="text-sm font-medium text-orange-500">${thisPeriodValue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            {revenueGrowth?.summary?.previous_period_label || 'Last period'}
                        </span>
                        <span className="text-sm font-medium text-blue-500">${lastPeriodValue}</span>
                    </div>
                </div>
            </div>
        );
    };

    // Get data and values
    const chartData = transformChartData();
    const currentRevenue = revenueGrowth?.summary?.current_period_revenue || 0;
    const percentageChange = revenueGrowth?.summary?.growth_percentage || 0;
    const growthDirection = revenueGrowth?.summary?.growth_direction || 'up';



    if (isLoading || isRefreshing) {
        return (
            <div className="p-5 bg-white rounded-lg">
                {/* Header skeleton */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-gray-200 pb-4 mb-4">
                    <div className="h-7 bg-gray-200 rounded animate-pulse w-40"></div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                        <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Revenue info skeleton */}
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                        </div>
                    </div>
                </div>

                {/* Chart skeleton */}
                <ChartShimmerEffect />
            </div>
        )
    }


    return (
        <div className="p-5 bg-white rounded-lg">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Revenue Growth</h2>

                {/* Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 text-sm cursor-pointer">
                                {selectedPeriod}
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handlePeriodChange('Week')} className='cursor-pointer'>
                                Week
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePeriodChange('Month')} className='cursor-pointer'>
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

            {/* Revenue Info and Legend */}
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">${currentRevenue.toFixed(2)}</span>
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
                        <span className="text-xs sm:text-sm text-gray-600">{revenueGrowth?.summary?.current_period_label || 'This period'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-xs sm:text-sm text-gray-600">{revenueGrowth?.summary?.previous_period_label || 'Last period'}</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-[600px] h-[250px] sm:h-[300px] lg:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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

                            <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" vertical={false} />
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
                                tickFormatter={(value) => `$${value}`}
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