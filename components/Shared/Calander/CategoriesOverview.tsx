import React from 'react'
import { FileText, HelpCircle, Users, BookOpen, ClipboardList } from 'lucide-react'

interface ScheduleItem {
    id: number;
    task: string;
    subject?: string;
    date: string;
    time?: string;
    link?: string;
    link_label?: string;
    type: string;
}

interface CategoriesOverviewProps {
    scheduleData: ScheduleItem[];
    title?: string;
}

const CATEGORIES = {
    general: { label: 'General', color: '#059669', icon: ClipboardList },
    assignment: { label: 'Assignment', color: '#DC2626', icon: FileText },
    quiz: { label: 'Quiz', color: '#D97706', icon: HelpCircle },
    meeting: { label: 'Meeting', color: '#16A34A', icon: Users },
    lecture: { label: 'Lecture', color: '#7C3AED', icon: BookOpen },
};

export default function CategoriesOverview({ scheduleData, title }: CategoriesOverviewProps) {
    // Group data by type
    const groupedData = scheduleData.reduce((groups, item) => {
        const type = item.type || 'general';
        if (!groups[type]) groups[type] = [];
        groups[type].push(item);
        return groups;
    }, {} as Record<string, ScheduleItem[]>);

    // Render single item
    const Item = ({ item, color }: { item: ScheduleItem; color: string }) => (
        <li className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span>{item.task}</span>
            {item.link && (
                <a
                    href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-600 hover:underline"
                >
                    ({item.link_label || 'Link'})
                </a>
            )}
        </li>
    );

    // Render category section
    const CategorySection = ({ type, config, items }: { type: string; config: any; items: ScheduleItem[] }) => (
        <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
                <config.icon size={16} style={{ color: config.color }} />
                <span className="font-semibold" style={{ color: config.color }}>
                    {config.label}
                </span>
                <span className="text-gray-500 text-sm">({items.length})</span>
            </div>

            {items.length > 0 ? (
                <ul className="space-y-2">
                    {items.map(item => (
                        <Item key={item.id} item={item} color={config.color} />
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400 text-sm italic">No data found</p>
            )}
        </div>
    );

    // Show all categories
    if (!title || title === 'Overview') {
        return (
            <div className="space-y-4">
                {Object.entries(CATEGORIES).map(([type, config]) => (
                    <CategorySection
                        key={type}
                        type={type}
                        config={config}
                        items={groupedData[type] || []}
                    />
                ))}
            </div>
        );
    }

    // Show specific category
    const categoryType = Object.keys(CATEGORIES).find(key =>
        CATEGORIES[key as keyof typeof CATEGORIES].label.toLowerCase() === title.toLowerCase()
    );

    const config = categoryType ? CATEGORIES[categoryType as keyof typeof CATEGORIES] : CATEGORIES.general;
    const items = categoryType ? groupedData[categoryType] || [] : scheduleData;

    return (
        <div className="bg-white rounded-lg p-4 ">
            <div className="flex items-center gap-2 mb-3">
                <config.icon size={16} style={{ color: config.color }} />
                <span className="font-semibold" style={{ color: config.color }}>
                    {title}
                </span>
                <span className="text-gray-500 text-sm">({items.length})</span>
            </div>

            {items.length > 0 ? (
                <ul className="space-y-2">
                    {items.map(item => (
                        <Item key={item.id} item={item} color={config.color} />
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400 text-sm italic">No data found</p>
            )}
        </div>
    );
}