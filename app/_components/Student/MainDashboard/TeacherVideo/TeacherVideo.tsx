"use client"

import React from 'react'
import VideoModal from '@/components/Resuable/VideoModal'
import { ClockIcon } from 'lucide-react'

interface EncouragementItem {
    id: string
    title: string
    description: string | null
    file_url?: string | null
    created_at?: string
    release_date?: string
}

export default function TeacherVideo({ encouragement }: { encouragement: EncouragementItem[] }) {
    const [videoOpen, setVideoOpen] = React.useState(false)
    const [currentUrl, setCurrentUrl] = React.useState<string>('')

    const handlePlayClick = (videoUrl?: string | null) => {
        if (!videoUrl) return
        setCurrentUrl(videoUrl)
        setVideoOpen(true)
    }

    return (
        <div className="bg-white rounded-2xl p-4 border border-[#ECEFF3]">
            <h2 className="text-[#1D1F2C] font-bold text-xl  mb-4">Teacher Video</h2>

            <div className="flex flex-col gap-4 max-h-[100vh] overflow-y-auto pr-1">
                {(!encouragement || encouragement.length === 0) ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-gray-500 text-sm">Data not found</p>
                    </div>
                ) : (
                    encouragement.map((item) => {
                    const dateSource = item.created_at || item.release_date
                    const dateObj = dateSource ? new Date(dateSource) : null
                    const timeText = dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--'
                    const dateText = dateObj ? dateObj.toLocaleDateString() : '—'

                    return (
                        <div key={item.id} className="rounded-2xl border border-[#ECEFF3] p-4 shadow-sm">
                            {/* Video area */}
                            <div className="relative h-36 w-full overfl ow-hidden rounded-xl bg-black">
                                {Boolean(item.file_url) && (
                                    <video
                                        key={item.file_url as string}
                                        className="h-full w-full object-contain"
                                        playsInline
                                        preload="metadata"
                                        crossOrigin="anonymous"
                                        muted
                                    >
                                        <source src={item.file_url as string} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                {/* Play icon overlay */}
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className={`h-12 w-12 rounded-full ${item.file_url ? 'bg-background/90' : 'bg-gray-300'} shadow flex items-center justify-center`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 ml-0.5"><path d="M4.5 5.653c0-1.426 1.54-2.33 2.778-1.62l11.54 6.347c1.295.712 1.295 2.528 0 3.24L7.278 19.966c-1.238.71-2.778-.195-2.778-1.62V5.653z" /></svg>
                                    </div>
                                </div>
                                {/* Click layer */}
                                <button
                                    type="button"
                                    aria-label={`Open teacher video ${item.title}`}
                                    onClick={() => handlePlayClick(item.file_url)}
                                    disabled={!item.file_url}
                                    className="absolute inset-0 cursor-pointer bg-transparent disabled:cursor-not-allowed"
                                />
                            </div>

                            <h3 className="mt-3 text-base lg:text-lg font-semibold text-[#1D1F2C]">{item.title}</h3>
                            {item.description ? (
                                <p className="mt-1 text-sm text-muted-foreground leading-6 line-clamp-2">{item.description}</p>
                            ) : null}

                            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1">
                                        <ClockIcon className="h-4 w-4" />
                                        {timeText}
                                    </span>
                                </div>
                                <span>{dateText}</span>
                            </div>
                        </div>
                    )
                })
                )}
            </div>

            <VideoModal
                open={videoOpen}
                onOpenChange={setVideoOpen}
                videoSrc={currentUrl}
                title="Teacher Video"
                autoPlay
            />
        </div>
    )
}

