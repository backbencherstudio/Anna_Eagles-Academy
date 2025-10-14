"use client"
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { useGetWatchedHistoryQuery } from '@/rtk/api/users/myCoursesApis';
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { setWatchedHistory, type WatchedHistoryItem } from '@/rtk/slices/users/myCoursesSlice';
import { PauseIcon } from 'lucide-react';



function secondsToTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function parseDurationToSeconds(input?: string | null) {
    if (!input) return 0;
    let total = 0;
    const hMatch = input.match(/(\d+)\s*h/i);
    const mMatch = input.match(/(\d+)\s*m/i);
    const sMatch = input.match(/(\d+)\s*s/i);
    if (hMatch) total += parseInt(hMatch[1], 10) * 3600;
    if (mMatch) total += parseInt(mMatch[1], 10) * 60;
    if (sMatch) total += parseInt(sMatch[1], 10);
    return total;
}

function formatLocalDateTime(iso?: string | null) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }).format(d);
}




export default function ContinueWatching() {
    const router = useRouter();
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        skipSnaps: false,
        dragFree: true,
        containScroll: 'trimSnaps',
    });

    const dispatch = useAppDispatch();
    const { watchedHistory } = useAppSelector((s) => s.myCourses);
    const { data } = useGetWatchedHistoryQuery(undefined);

    useEffect(() => {
        const items = data?.data?.watchedLessons ?? [];
        if (!items.length) return;
        const mapped: WatchedHistoryItem[] = items.map((w: any) => ({
            lessonId: w.lesson?.id,
            lessonTitle: w.lesson?.title,
            videoLength: w.lesson?.video_length ?? null,
            timeSpent: w.progress?.time_spent ?? null,
            progressPercentage: w.enrollment?.progress_percentage ?? 0,
            completionPercentage: w.progress?.completion_percentage ?? 0,
            lastPosition: w.progress?.last_position ?? null,
            seriesId: w.series?.id,
            seriesTitle: w.series?.title,
            seriesThumbnail: w.series?.thumbnail ?? null,
            viewedAt: w.progress?.viewed_at ?? null,
        }));
        dispatch(setWatchedHistory(mapped));
    }, [data, dispatch]);

    const formatted = useMemo(() => {
        return (watchedHistory ?? []).map((w) => {
            const totalSeconds = parseDurationToSeconds(w.videoLength);
            const watchedSeconds = w.timeSpent ?? 0;
            const percent = totalSeconds > 0 ? Math.min(100, Math.max(0, Math.round((watchedSeconds * 100) / totalSeconds))) : 0;
            return {
                id: w.lessonId,
                videoTitle: w.lessonTitle,
                thumbnail: w.seriesThumbnail,
                watchedStr: watchedSeconds != null ? secondsToTime(watchedSeconds) : '00:00',
                totalStr: w.videoLength ?? '',
                percent,
                lastPosition: w.lastPosition,
                viewedAtStr: formatLocalDateTime(w.viewedAt),
                seriesId: w.seriesId,
                completionPercentage: w.completionPercentage,
            };
        });
    }, [watchedHistory]);

    const handleVideoClick = useCallback((item: { seriesId: string; id: string }) => {
        if (!item?.seriesId) return;
        router.push(`/user/courses-modules/${item.seriesId}`);
    }, [router]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow mb-8">
            <h2 className="text-lg font-medium mb-5 flex items-center gap-2">
                <span className="text-yellow-500">
                    <PauseIcon />
                </span> Continue Watching
            </h2>

            {formatted.length > 0 ? (
                <div className="overflow-x-hidden py-1">
                    <div ref={emblaRef} className="embla">
                        <div className="embla__container flex gap-6">
                            {formatted.map((vid: any, i: number) => (
                                <div
                                    key={vid.id + i}
                                    className="embla__slide min-w-[240px] max-w-[260px] sm:min-w-[260px] sm:max-w-[280px] md:min-w-[300px] md:max-w-[320px] bg-[#F8F9FA] rounded-xl shadow-sm group transition cursor-pointer flex-shrink-0"
                                    onClick={() => handleVideoClick(vid)}
                                >
                                    <div className="relative w-full h-36 rounded-xl overflow-hidden">
                                        <Image
                                            src={vid.thumbnail}
                                            alt={vid.videoTitle}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 600px) 100vw, 320px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10 pointer-events-none rounded-xl" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-white/80 rounded-full p-2 flex items-center justify-center shadow-md  transition-shadow duration-200 group-hover:scale-110 group-hover:shadow-xl">
                                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#F1C27D" /><path d="M11 10V18L18 14L11 10Z" fill="#fff" /></svg>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-2 bg-black/10">
                                            <div
                                                className="h-2 bg-yellow-400 rounded-br-xl rounded-bl-xl"
                                                style={{ width: vid.percent + '%' }}
                                            >

                                            </div>
                                        </div>
                                        <div className="absolute left-2 bottom-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                                            {vid.watchedStr}
                                        </div>
                                        <div className="absolute right-2 bottom-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                                            {vid.totalStr}
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="font-medium text-sm truncate mb-1">{vid.videoTitle}</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">Watched</div>
                                        <div className="text-xs text-gray-500 mt-1">

                                            {vid.completionPercentage}%
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{vid.viewedAtStr ? `Last at ${vid.viewedAtStr}` : 'Not started'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No videos in progress</p>
                    <p className="text-gray-400 text-xs mt-1">Start watching a course to see it here</p>
                </div>
            )}

            <style>{`
                .embla { width: 100%; }
                .embla__container { display: flex; }
                .embla__slide { flex: 0 0 auto; }
            `}</style>
        </div>
    );
}
