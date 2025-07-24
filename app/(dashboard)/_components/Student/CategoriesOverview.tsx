import React from 'react'

// Define a color palette to use for tasks
const COLOR_PALETTE = [
    '#FF5C1A', '#FFD59A', '#2ECC40', '#FFD600', '#007bff', '#FF69B4', '#8A2BE2', '#20B2AA', '#FF6347', '#00CED1', '#FFA500', '#6A5ACD', '#32CD32', '#DC143C', '#00BFFF', '#FF4500', '#B8860B', '#228B22', '#DAA520', '#9932CC'
];

function getTaskColorMap(uniqueTasks: { task: string }[]) {
    const taskColorMap: Record<string, string> = {};
    let colorIndex = 0;
    uniqueTasks.forEach((item) => {
        if (!taskColorMap[item.task]) {
            taskColorMap[item.task] = COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];
            colorIndex++;
        }
    });
    return taskColorMap;
}

// TASK_LINK_LABELS object remove kore dilam

export default function CategoriesOverview({ scheduleData, uniqueTasks }: { scheduleData: any[], uniqueTasks?: any[] }) {
    const safeUniqueTasks = uniqueTasks && Array.isArray(uniqueTasks) && uniqueTasks.length > 0
        ? uniqueTasks
        : Array.from(new Map(scheduleData.map(item => [item.task, item])).values());

    const taskColorMap = getTaskColorMap(safeUniqueTasks);

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="font-semibold mb-3 text-[16px]">Task Categories Overview</div>
            <ul className="space-y-2">
                {scheduleData.map((item, idx) => (
                    <li key={item.id || (item.task + idx)} className="flex items-center gap-2 text-[15px]">
                        <span
                            className="inline-block rounded-sm mr-2"
                            style={{ width: 12, height: 12, background: taskColorMap[item.task] || '#ccc' }}
                        />
                        <span>{item.task}</span>
                        {item.link && (
                            <a
                                href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 font-medium"
                                style={{ color: taskColorMap[item.task] || '#007bff' }}
                            >
                                ({item.link_label && item.link_label.trim() !== '' ? item.link_label : 'Link'})
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
