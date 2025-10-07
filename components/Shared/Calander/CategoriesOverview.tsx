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
    uniqueId?: string;
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
    // Group data by type, mapping CLASS to lecture
    const groupedData = scheduleData.reduce((groups, item) => {
        let typeKey = (item.type || 'general').toString().trim().toLowerCase();

        // Map CLASS type to lecture for display
        if (typeKey === 'class') {
            typeKey = 'lecture';
        }

        // Fallback unknown types to general
        if (!(typeKey in CATEGORIES)) {
            typeKey = 'general';
        }

        if (!groups[typeKey]) groups[typeKey] = [];
        groups[typeKey].push(item);
        return groups;
    }, {} as Record<string, ScheduleItem[]>);

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    // Render single item
    const Item = ({ item, color }: { item: ScheduleItem; color: string }) => (
        <li className="group hover:bg-gray-50 rounded-lg p-3 transition-all duration-200 border border-transparent hover:border-gray-200">
            <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{item.task}</h4>
                        {item.link && (
                            <a
                                href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {item.link_label || 'Link'}
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(item.date)}
                        </span>
                        {item.time && (
                            <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-full">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {item.time}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );

    // Render category section
    const CategorySection = ({ type, config, items }: { type: string; config: any; items: ScheduleItem[] }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${config.color}15` }}>
                        <config.icon size={18} style={{ color: config.color }} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {config.label}
                        </h3>
                        <p className="text-sm text-gray-500">{items.length} {items.length === 1 ? 'event' : 'events'}</p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {items.length > 0 ? (
                    <ul className="space-y-2">
                        {items.map(item => (
                            <Item key={item.id} item={item} color={config.color} />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                            <config.icon size={20} className="text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm">No events found</p>
                    </div>
                )}
            </div>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${config.color}15` }}>
                        <config.icon size={18} style={{ color: config.color }} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500">{items.length} {items.length === 1 ? 'event' : 'events'}</p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {items.length > 0 ? (
                    <ul className="space-y-2">
                        {items.map(item => (
                            <Item key={item.id} item={item} color={config.color} />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                            <config.icon size={20} className="text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm">No events found</p>
                    </div>
                )}
            </div>
        </div>
    );
}