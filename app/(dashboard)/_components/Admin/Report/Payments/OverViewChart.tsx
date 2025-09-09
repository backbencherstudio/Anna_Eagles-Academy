import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const data = [
    { name: 'Full Paid', value: 65, color: '#10B981', percentage: '65%' },
    { name: 'Sponsored', value: 20, color: '#3B82F6', percentage: '20%' },
    { name: 'Free Enrolled', value: 15, color: '#FE964A', percentage: '15%' }
]

// Custom legend to control order explicitly and ensure responsiveness
const CustomLegend: React.FC<any> = () => {
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
    return (
        <div className="w-full h-80 md:h-80 flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        // label={renderCustomizedLabel}
                        outerRadius="80%"
                        innerRadius="48%"
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={2}
                        stroke="#ffffff"
                        startAngle={-90}
                        endAngle={270}
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
                        content={<CustomLegend />}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
