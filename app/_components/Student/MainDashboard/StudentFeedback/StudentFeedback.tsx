"use client"

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import WriteReviewModal from './WriteReviewModal'
import { useGetAllFeedbackQuery } from '@/rtk/api/users/shareFeedBackApis'
import VideoModal from '@/components/Resuable/VideoModal'

type TabKey = 'series' | 'course'

export default function StudentFeedback() {
    const [activeTab, setActiveTab] = useState<TabKey>('course')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [videoOpen, setVideoOpen] = useState(false)
    const [currentUrl, setCurrentUrl] = useState<string>('')
    const limit = 10
    const type = activeTab === 'course' ? 'course_review' : 'series_review'

    const { data, isLoading, isError, isFetching, refetch } = useGetAllFeedbackQuery(
        { page: 1, limit, search: '', type },
        { refetchOnMountOrArgChange: true, refetchOnFocus: true, refetchOnReconnect: true }
    )

    const feedbacks = data?.data?.feedbacks ?? []
    const handlePlayClick = (videoUrl?: string | null) => {
        if (!videoUrl) return
        setCurrentUrl(videoUrl)
        setVideoOpen(true)
    }

    const handleTabChange = (tab: TabKey) => {
        setActiveTab(tab)
    }

    React.useEffect(() => {
        refetch()
    }, [activeTab])

    return (
        <div className="bg-white rounded-2xl p-4 border border-[#ECEFF3] mb-4">
            <div className="flex flex-col mb-4">
                <h2 className="text-[#1D1F2C] font-bold text-xl  mb-4">Student Sharing's Feedback</h2>
                <button
                    className="bg-[#0F2598] w-fit cursor-pointer hover:bg-[#0F2598]/80 transition-colors duration-200 rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3 text-white font-medium text-sm  disabled:opacity-70"
                    onClick={() => setIsModalOpen(true)}
                >
                    <span>Write a Review</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="mt-1 px-1">
                <div className="relative">
                    <div className="flex items-center">
                        <button
                            className={`flex-1 py-2 text-sm font-semibold text-center transition-colors cursor-pointer ${activeTab === 'course' ? 'text-[#0F2598]' : 'text-muted-foreground'}`}
                            onClick={() => handleTabChange('course')}
                        >
                            Course review
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-semibold text-center transition-colors cursor-pointer ${activeTab === 'series' ? 'text-[#0F2598]' : 'text-muted-foreground'}`}
                            onClick={() => handleTabChange('series')}
                        >
                            Series review
                        </button>
                    </div>
                    <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gray-200" />
                    <div
                        className={`absolute bottom-0 h-[2px] bg-[#0F2598] w-1/2 transition-transform duration-300 ${activeTab === 'course' ? 'translate-x-0' : 'translate-x-full'}`}
                    />
                </div>
            </div>

            {/* List */}
            <div className="mt-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
                {(isLoading || isFetching) && (
                    <>
                        {[0].map((i) => (
                            <div key={i} className="rounded-2xl border border-[#ECEFF3] p-4 shadow-sm animate-pulse">
                                <div className="relative h-28 w-full overflow-hidden rounded-xl bg-gray-200" />
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-full bg-gray-200" />
                                    <div className="h-3 w-24 rounded bg-gray-200" />
                                </div>
                                <div className="mt-2 h-5 w-36 rounded-full bg-gray-200" />
                                <div className="mt-3 h-4 w-3/5 rounded bg-gray-200" />
                                <div className="mt-2 h-4 w-2/5 rounded bg-gray-200" />
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="h-3 w-16 rounded bg-gray-200" />
                                    <div className="h-3 w-20 rounded bg-gray-200" />
                                </div>
                            </div>
                        ))}
                    </>
                )}
                {isError && !isLoading && !isFetching && (
                    <div className="text-sm text-red-500">Failed to load feedback.</div>
                )}
                {!isLoading && !isFetching && !isError && feedbacks.length === 0 && (
                    <p className="text-sm text-muted-foreground">No feedback found.</p>
                )}
                {!isLoading && !isFetching && feedbacks.map((item: any) => (
                    <div key={item.id} className="rounded-2xl border border-[#ECEFF3] p-4 shadow-sm">
                        {/* Video Area (same visual style as VideoCard, fixed height) */}
                        <div className="relative h-28 w-full overflow-hidden rounded-xl bg-black">
                            {Boolean(item.file_download_url || item.file_url) && (
                                <video
                                    key={item.file_download_url || item.file_url}
                                    className="h-full w-full object-contain"
                                    playsInline
                                    preload="metadata"
                                    crossOrigin="anonymous"
                                    muted
                                >
                                    <source src={(item.file_download_url || item.file_url) as string} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            {/* Play icon overlay */}
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className={`h-12 w-12 rounded-full ${item.file_download_url || item.file_url ? 'bg-background/90' : 'bg-gray-300'} shadow flex items-center justify-center`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 ml-0.5"><path d="M4.5 5.653c0-1.426 1.54-2.33 2.778-1.62l11.54 6.347c1.295.712 1.295 2.528 0 3.24L7.278 19.966c-1.238.71-2.778-.195-2.778-1.62V5.653z" /></svg>
                                </div>
                            </div>
                            {/* Click layer */}
                            <button
                                type="button"
                                aria-label={`Open feedback video ${item.title ?? ''}`}
                                onClick={() => handlePlayClick(item.file_download_url || item.file_url)}
                                disabled={!(item.file_download_url || item.file_url)}
                                className="absolute inset-0 cursor-pointer bg-transparent disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Meta */}
                        <div className="mt-3 flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full overflow-hidden bg-gray-300">
                                {item?.user?.avatar_url ? (
                                    <Image
                                        src={item.user.avatar_url}
                                        alt={item?.user?.name || 'User'}
                                        className="h-full w-full object-cover"
                                        width={28}
                                        height={28}
                                    />
                                ) : (
                                    <Image
                                        src={'/images/logo/withoutbg.png'}
                                        alt={item?.user?.name || 'User'}
                                        className="h-full w-full object-cover"
                                        width={28}
                                        height={28}
                                    />
                                )}
                            </div>
                            <span className="text-sm font-semibold text-[#1D1F2C]">{item?.user?.name || 'Unknown'}</span>
                        </div>
                        <div className="mt-2">
                            <span className="inline-flex items-center rounded-full bg-[#E9EEFF] text-[#2236CC] text-xs font-semibold px-3 py-1">
                                {item?.type === 'course_review' ? (item?.course?.title || 'Course Review') : (item?.week_number ? `Week ${item.week_number}` : 'Series Review')}
                            </span>
                        </div>

                        {/* Content */}
                        <h3 className="mt-3 text-base lg:text-lg font-semibold text-[#1D1F2C]">{item.title ?? 'Untitled'}</h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-6 line-clamp-2">{item.description}</p>

                        {/* Footer */}
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 8a.75.75 0 01.75.75v3.19l2.28 2.28a.75.75 0 11-1.06 1.06l-2.47-2.47A.75.75 0 0111.25 12V8.75A.75.75 0 0112 8z" /><path fillRule="evenodd" d="M12 1.5a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM3 12a9 9 0 1118 0A9 9 0 013 12z" clipRule="evenodd" /></svg>
                                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>


            <WriteReviewModal open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) { refetch() } }} />

            <VideoModal
                open={videoOpen}
                onOpenChange={setVideoOpen}
                videoSrc={currentUrl}
                title="Feedback Video"
                autoPlay
            />
        </div>
    )
}
