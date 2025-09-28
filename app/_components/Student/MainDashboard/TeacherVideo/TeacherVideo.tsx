import Image from 'next/image'
import React, { useMemo } from 'react'

interface TeacherVideoItem {
    id: string
    title: string
    description: string
    tag: string
    time: string
    date: string
    thumbnail?: string
}

export default function TeacherVideo() {
    const videos: TeacherVideoItem[] = useMemo(
        () => [
            {
                id: 't1',
                title: 'Weekly Encouragement',
                description: 'Pastor\'s message of hope and encouragement for all students.',
                tag: 'motivational',
                time: '06:00 AM',
                date: 'Jan 10, 2025',
                thumbnail: '',
            },
            {
                id: 't2',
                title: 'Study Tips for Success',
                description: 'Effective study methods for biblical learning.',
                tag: 'teaching',
                time: '8:30 AM',
                date: 'Jan 10, 2025',
                thumbnail: '',
            },
            {
                id: 't3',
                title: 'Academy Updates',
                description: 'Important announcements and updates about the academy.',
                tag: 'administrative',
                time: '06:00 AM',
                date: 'Jan 10, 2025',
                thumbnail: '',
            },
        ],
        []
    )

    const tagClassesByType: Record<string, string> = {
        motivational: 'bg-[#E9FDF3] text-[#1BA97F]',
        teaching: 'bg-[#F5E8FF] text-[#9B5DE5]',
        administrative: 'bg-[#EAF2FF] text-[#0F2598]',
    }

    return (
        <div className="bg-white rounded-2xl p-4 border border-[#ECEFF3]">
            <h2 className="text-[#1D1F2C] font-bold text-xl lg:text-2xl mb-4">Teacher Video</h2>

            <div className="flex flex-col gap-4 max-h-[100vh] overflow-y-auto pr-1">
                {videos.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-[#ECEFF3] p-4 shadow-sm">
                        {/* Thumbnail */}
                        <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-200 relative">
                            {item.thumbnail ? (
                                <Image width={100} height={100} src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                            ) : null}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                                    <div className="h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-gray-700 ml-0.5" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-3">
                            <span className={`inline-flex items-center rounded-full text-xs font-semibold px-3 py-1 ${tagClassesByType[item.tag] || 'bg-[#E9EEFF] text-[#0F2598]'}`}>{item.tag}</span>
                        </div>

                        <h3 className="mt-3 text-base lg:text-lg font-semibold text-[#1D1F2C]">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-6 line-clamp-2">{item.description}</p>

                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 8a.75.75 0 01.75.75v3.19l2.28 2.28a.75.75 0 11-1.06 1.06l-2.47-2.47A.75.75 0 0111.25 12V8.75A.75.75 0 0112 8z" /><path fillRule="evenodd" d="M12 1.5a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM3 12a9 9 0 1118 0A9 9 0 013 12z" clipRule="evenodd" /></svg>
                                    {item.time}
                                </span>
                            </div>
                            <span>{item.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
