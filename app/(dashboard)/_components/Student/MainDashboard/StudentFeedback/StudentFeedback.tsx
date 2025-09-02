import React, { useMemo, useState } from 'react'
import WriteReviewModal from './WriteReviewModal'

interface ReviewItem {
    id: string
    userName: string
    userAvatar?: string
    tag: string
    title: string
    description: string
    thumbnail?: string
    time: string
    date: string
    weekLabel?: string
}

export default function StudentFeedback() {
    const [activeTab, setActiveTab] = useState<'course' | 'weekly'>('course')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const courseReviews: ReviewItem[] = useMemo(
        () => [
            {
                id: 'c1',
                userName: 'Sarah Johnson',
                tag: 'The Kingdom Principles',
                title: 'Leeming Biblical Leadership',
                description:
                    'The leadership course has transformed my understanding...',
                time: '06:00 AM',
                date: 'Jan 10, 2025',
                thumbnail: '/images/discover/course.png',
            },
            {
                id: 'c2',
                userName: 'Emily Rodriguez',
                tag: 'The Kingdom Principles',
                title: 'Prayer Life Transformation',
                description:
                    'This course helped me understand the role of the Holy Spirit more deeply.',
                time: '06:00 AM',
                date: 'Jan 10, 2025',
                thumbnail: '/images/discover/course.png',
            },
        ],
        []
    )

    const weeklyReviews: ReviewItem[] = useMemo(
        () => [
            {
                id: 'w1',
                userName: 'Sarah Johnson',
                tag: 'Week 2',
                title: 'Leeming Biblical Leadership',
                description:
                    'This week, I learned how listening in silence helps me hear God clearer. The meditation exercises really opened my heart.',
                time: '06:00 AM',
                date: 'Jan 10, 2025',
                thumbnail: '/images/discover/course.png',
            },
            {
                id: 'w2',
                userName: 'David',
                tag: 'Week 1',
                title: 'Prayer Life Transformation',
                description:
                    'Amazing start to this journey! The community here feels supportive and genuine. I\'m grateful for everything I\'m learning.',
                time: '06:00 AM',
                date: 'Jan 10, 2025',
                thumbnail: '/images/discover/course.png',
            },
        ],
        []
    )

    const data = activeTab === 'course' ? courseReviews : weeklyReviews

    return (
        <div className="bg-white rounded-2xl p-4 border border-[#ECEFF3]">
            <div className="flex flex-col mb-4">
                <h2 className="text-[#1D1F2C] font-bold text-xl lg:text-2xl mb-4">Student Sharing's Feedback</h2>
                <button
                    className="px-4 py-2 cursor-pointer w-fit rounded-xl bg-[#0F2598] hover:bg-[#0F2598]/80 transition-all duration-300 text-white text-sm font-semibold shadow-sm"
                    onClick={() => setIsModalOpen(true)}
                >
                    Write a Review
                </button>
            </div>

            {/* Tabs */}
            <div className="mt-1 px-1">
                <div className="relative">
                    <div className="flex items-center">
                        <button
                            className={`flex-1 py-2 text-sm font-semibold text-center transition-colors cursor-pointer ${
                                activeTab === 'course' ? 'text-[#0F2598]' : 'text-muted-foreground'
                            }`}
                            onClick={() => setActiveTab('course')}
                        >
                            Course review
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-semibold text-center transition-colors cursor-pointer ${
                                activeTab === 'weekly' ? 'text-[#0F2598]' : 'text-muted-foreground'
                            }`}
                            onClick={() => setActiveTab('weekly')}
                        >
                            Weekly review
                        </button>
                    </div>
                    <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gray-200" />
                    <div
                        className={`absolute bottom-0 h-[2px] bg-[#0F2598] w-1/2 transition-transform duration-300 ${
                            activeTab === 'course' ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    />
                </div>
            </div>

            {/* List */}
            <div className="mt-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
                {data.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-[#ECEFF3] p-4 shadow-sm cursor-pointer">
                        {/* Thumbnail */}
                        <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-200 relative">
                            {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                            ) : null}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                                    <div className="h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-gray-700 ml-0.5" />
                                </div>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="mt-3 flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full overflow-hidden bg-gray-300">
                                <img src={item.userAvatar || '/images/logo/withoutbg.png'} alt={item.userName} className="h-full w-full object-cover" />
                            </div>
                            <span className="text-sm font-semibold text-[#1D1F2C]">{item.userName}</span>
                        </div>
                        <div className="mt-2">
                            <span className="inline-flex items-center rounded-full bg-[#E9EEFF] text-[#2236CC] text-xs font-semibold px-3 py-1">{item.tag}</span>
                        </div>

                        {/* Content */}
                        <h3 className="mt-3 text-base lg:text-lg font-semibold text-[#1D1F2C]">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-6 line-clamp-2">{item.description}</p>

                        {/* Footer */}
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
            <WriteReviewModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    )
}
