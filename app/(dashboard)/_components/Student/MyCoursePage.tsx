

"use client"
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

// Helper to fetch local JSON (works in Next.js for public/data)
async function fetchCourseData() {
    const res = await fetch('/data/CourseData.json');
    return res.json();
}

// Mock watched progress for videos
const mockWatched = [
    { watched: 443, total: 660 }, // 7:23 / 11:00
    { watched: 142, total: 480 }, // 2:22 / 8:00
    { watched: 553, total: 913 }, // 9:13 / 15:13
    { watched: 103, total: 343 }, // 1:43 / 5:43
];

function secondsToTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function parseDuration(str: string) {
    // "6:18:00" or "3:40:00" or "2:15:00" or "3:00:00"
    const parts = str.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
}

export default function MyCoursePage() {
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        skipSnaps: false,
        dragFree: true,
        containScroll: 'trimSnaps',
    });

    useEffect(() => {
        fetchCourseData().then((data) => {
            setCourse(data.course);
            setLoading(false);
        });
    }, []);

    if (loading || !course) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="text-lg font-semibold text-gray-500">Loading...</span>
            </div>
        );
    }

    // Flatten all videos for 'Continue Watching'
    const allVideos = course.modules.flatMap((mod: any) =>
        mod.videos.map((vid: any, idx: number) => ({
            ...vid,
            module: mod.module_title,
            module_id: mod.module_id,
            watched: mockWatched[idx]?.watched || 0,
            total: mockWatched[idx]?.total || parseDuration(vid.video_duration),
        }))
    );

    const continueWatching = allVideos.map((vid: any, i: number) => {
        return {
            ...vid,
            watchedStr: secondsToTime(vid.watched),
            totalStr: secondsToTime(vid.total),
            percent: Math.round((vid.watched / vid.total) * 100),
            module: vid.module,
        };
    });

    // Enrolled course progress (mocked as 79%)
    const enrolledProgress = 79;

    return (
        <div className="">
            {/* Continue Watching */}
            <div className="bg-white rounded-2xl p-6 shadow mb-8">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <span className="text-yellow-500">⏸️</span> Continue Watching
                </h2>
                <div className="overflow-x-hidden">
                    <div ref={emblaRef} className="embla">
                        <div className="embla__container flex gap-6">
                            {continueWatching.map((vid: any, i: number) => (
                                <div
                                    key={vid.video_id + i}
                                    className="embla__slide min-w-[240px] max-w-[260px] sm:min-w-[260px] sm:max-w-[280px] md:min-w-[300px] md:max-w-[320px] bg-[#F8F9FA] rounded-xl shadow-sm group transition hover:shadow-lg cursor-pointer flex-shrink-0"
                                >
                                    <div className="relative w-full h-36 rounded-xl overflow-hidden">
                                        <Image
                                            src={vid.thumbnail}
                                            alt={vid.video_title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 600px) 100vw, 320px"
                                        />
                                        {/* Subtle black overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10 pointer-events-none rounded-xl" />
                                        {/* Always-visible Play Button with hover effect */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-white/80 rounded-full p-2 flex items-center justify-center shadow-md transition-transform transition-shadow duration-200 group-hover:scale-110 group-hover:shadow-xl">
                                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#F1C27D" /><path d="M11 10V18L18 14L11 10Z" fill="#fff" /></svg>
                                            </div>
                                        </div>
                                        {/* Watched progress bar */}
                                        <div className="absolute bottom-0 left-0 w-full h-2 bg-black/10">
                                            <div
                                                className="h-2 bg-yellow-400 rounded-br-xl rounded-bl-xl"
                                                style={{ width: vid.percent + '%' }}
                                            ></div>
                                        </div>
                                        {/* Watched time */}
                                        <div className="absolute left-2 bottom-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                                            {vid.watchedStr}
                                        </div>
                                        {/* Total time */}
                                        <div className="absolute right-2 bottom-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                                            {vid.totalStr}
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="font-medium text-sm truncate mb-1">{vid.video_title}</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">{vid.module}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrolled Courses */}
            <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-1">Enrolled Courses</h2>
                <p className="text-gray-400 text-sm mb-4">Dive in, learn, and let your potential unfold!</p>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#F8F9FA] rounded-xl p-4">
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-base mb-1 truncate">{course.course_title}</div>
                            <div className="flex items-center gap-6 text-xs text-gray-500 mb-2">
                                <span>Duration <span className="font-semibold text-gray-700 ml-1">1 Month</span></span>
                                <span className="hidden md:inline">|</span>
                                <span>Progress <span className="font-semibold text-gray-700 ml-1">{enrolledProgress}%</span></span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-2 bg-yellow-400 rounded-full transition-all"
                                    style={{ width: `${enrolledProgress}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 min-w-[120px] justify-end">
                            <div className="flex items-center gap-1 text-gray-600">
                                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M4 4h12v2H4V4zm0 4h12v2H4V8zm0 4h8v2H4v-2z" fill="#F1C27D" /></svg>
                                <span className="text-sm font-medium">{course.total_modules}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#F1C27D" strokeWidth="2" /><path d="M10 6v4l3 2" stroke="#F1C27D" strokeWidth="2" strokeLinecap="round" /></svg>
                                <span className="text-sm font-medium">{course.total_videos}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Embla styles */}
            <style>{`
        .embla { width: 100%; }
        .embla__container { display: flex; }
        .embla__slide { flex: 0 0 auto; }
      `}</style>
        </div>
    );
}
