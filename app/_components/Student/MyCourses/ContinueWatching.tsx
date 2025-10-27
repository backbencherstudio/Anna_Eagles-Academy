"use client"
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { PauseIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useGetWatchedHistoryQuery } from '@/rtk/api/users/myCoursesApis';
import { WatchedHistoryItem } from '@/rtk/slices/users/myCoursesSlice';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { ContinueWatchingSkeleton } from './MyCoursePageSkeleton';

interface VideoDisplayData {
    id: string;
    seriesId: string;
    videoTitle: string;
    thumbnail: string;
    watchedStr: string;
    totalStr: string;
    percent: number;
    completionPercentage: number;
    viewedAtStr: string;
    seriesTitle: string;
    courseTitle: string;
}

export default function ContinueWatching() {
    const { data: watchedHistoryData, isLoading, error } = useGetWatchedHistoryQuery({});
    const router = useRouter();

    // Embla Carousel setup
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        slidesToScroll: 1,
        dragFree: false,
        breakpoints: {
            '(min-width: 640px)': { slidesToScroll: 2 },
            '(min-width: 768px)': { slidesToScroll: 3 },
        }
    });

    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    // Helper function to format time from seconds to MM:SS format
    const formatTime = (seconds: number | null): string => {
        if (!seconds) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Helper function to format date
    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Helper function to convert video length to seconds
    const parseVideoLength = (lengthStr: string | null | undefined): number => {
        if (!lengthStr) return 0;
        const match = lengthStr.match(/(\d+)m\s*(\d+)s/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            return minutes * 60 + seconds;
        }
        return 0;
    };

    // Transform API data for display
    const watchedVideos: VideoDisplayData[] = watchedHistoryData?.data?.watchedLessons?.map((item: WatchedHistoryItem) => {
        const videoLengthSeconds = parseVideoLength(item.lesson?.video_length);
        const watchedSeconds = item.progress.time_spent || 0;
        const completionPercentage = item.progress.completion_percentage || 0;

        // Calculate progress percentage based on time spent vs total video length
        const timeBasedProgress = videoLengthSeconds > 0 ? (watchedSeconds / videoLengthSeconds) * 100 : 0;

        return {
            id: item.lesson.id,
            seriesId: item.series.id,
            videoTitle: item.lesson.title,
            thumbnail: item.series.thumbnail,
            watchedStr: formatTime(watchedSeconds),
            totalStr: item.lesson?.video_length || "0m 0s",
            percent: Math.min(timeBasedProgress, 100),
            completionPercentage: completionPercentage,
            viewedAtStr: `Last at ${formatDate(item.progress.viewed_at)}`,
            seriesTitle: item.series.title,
            courseTitle: item.course.title
        };
    }) || [];

    // Show loading state
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow mb-8">
                <h2 className="text-lg font-medium mb-5 flex items-center gap-2">
                    <span className="text-yellow-500">
                        <PauseIcon />
                    </span> Continue Watching
                </h2>
                <ContinueWatchingSkeleton />
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow mb-8">
                <h2 className="text-lg font-medium mb-5 flex items-center gap-2">
                    <span className="text-yellow-500">
                        <PauseIcon />
                    </span> Continue Watching
                </h2>
                <div className="text-center py-8 text-gray-500">
                    Failed to load watching history. Please try again.
                </div>
            </div>
        );
    }

    // Show empty state
    if (!watchedVideos || watchedVideos.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow mb-8">
                <h2 className="text-lg font-medium mb-5 flex items-center gap-2">
                    <span className="text-yellow-500">
                        <PauseIcon />
                    </span> Continue Watching
                </h2>
                <div className="text-center py-8 text-gray-500">
                    No videos in your watching history yet.
                </div>
            </div>
        );
    }

    // id wise view 

    const handleViewVideo = (seriesId: string, lessonId: string) => {
        const params = new URLSearchParams();
        params.set('lessonId', lessonId);
        router.push(`/user/courses-modules/${seriesId}?${params.toString()}`);
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow mb-8">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-medium flex items-center gap-2">
                    <span className="text-yellow-500">
                        <PauseIcon />
                    </span> Continue Watching
                </h2>

                {/* Navigation buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={scrollPrev}
                        disabled={prevBtnDisabled}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={scrollNext}
                        disabled={nextBtnDisabled}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="embla overflow-hidden py-1" ref={emblaRef}>
                <div className="embla__container flex gap-4">
                    {watchedVideos.map((vid: VideoDisplayData, i) => (
                        <div
                            key={vid.id + i}
                            className="embla__slide flex-[0_0_280px] min-w-0"
                        >
                            <div
                                className="w-full bg-[#F8F9FA] rounded-xl shadow-sm group transition cursor-pointer hover:shadow-md"
                                onClick={() => handleViewVideo(vid.seriesId, vid.id)}
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
                                        <div className="bg-white/80 rounded-full p-2 flex items-center justify-center shadow-md transition-shadow duration-200 group-hover:scale-110 group-hover:shadow-xl">
                                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                                <circle cx="14" cy="14" r="14" fill="#F1C27D" />
                                                <path d="M11 10V18L18 14L11 10Z" fill="#fff" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-2 bg-black/10">
                                        <div
                                            className="h-2 bg-yellow-400 rounded-br-xl rounded-bl-xl"
                                            style={{ width: vid.percent + '%' }}
                                        />
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
                                    <div className="text-xs text-gray-400 uppercase tracking-wide">{vid.courseTitle}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {vid.completionPercentage}%
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{vid.viewedAtStr}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
