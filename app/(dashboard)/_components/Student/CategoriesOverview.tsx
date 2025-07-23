import React from 'react'

const TASK_COLORS: Record<string, string> = {
    'Spiritual Growth and Financial Insights': '#FF5C1A', // orange
    'Fundamental Beliefs and Values': '#FFD59A', // light orange
    'Live Session': '#2ECC40', // green
    'Bible Study Group Meeting ': '#FFD600', // yellow
};

const TASK_LINK_LABELS: Record<string, string> = {
    'Live Session': 'Live Link',
    'Bible Study Group Meeting ': 'Meeting Link',
};

export default function CategoriesOverview({ scheduleData }: { scheduleData: any[] }) {
    // Get unique tasks
    const uniqueTasks = Array.from(
        new Map(scheduleData.map(item => [item.task, item])).values()
    );

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="font-semibold mb-3 text-[16px]">Task Categories Overview</div>
            <ul className="space-y-2">
                {uniqueTasks.map((item) => (
                    <li key={item.task} className="flex items-center gap-2 text-[15px]">
                        <span
                            className="inline-block rounded-sm mr-2"
                            style={{ width: 12, height: 12, background: TASK_COLORS[item.task] || '#ccc' }}
                        />
                        <span>{item.task}</span>
                        {item.link && (
                            <a
                                href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 font-medium"
                                style={{ color: TASK_COLORS[item.task] || '#007bff' }}
                            >
                                ({TASK_LINK_LABELS[item.task] || 'Link'})
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
