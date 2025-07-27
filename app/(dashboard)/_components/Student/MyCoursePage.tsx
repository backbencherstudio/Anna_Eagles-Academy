

"use client"
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { useRouter } from 'next/navigation';
import { useVideoProgress } from '../../../../hooks/useVideoProgress';

// Helper to fetch local JSON (works in Next.js for public/data)
async function fetchCourseData() {
    const res = await fetch('/data/CourseData.json');
    return res.json();
}

function secondsToTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export default function MyCoursePage() {
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [continueWatchingVideos, setContinueWatchingVideos] = useState<any[]>([]);
    const router = useRouter();
    
    // Use the video progress hook
    const { getContinueWatchingVideos, findVideoPosition, getCourseCompletion } = useVideoProgress();
    
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        skipSnaps: false,
        dragFree: true,
        containScroll: 'trimSnaps',
    });

    // Load course data
    useEffect(() => {
        fetchCourseData().then((data) => {
            setCourse(data.course);
            setLoading(false);
        });
    }, []);

    // Process continue watching videos from localStorage
    useEffect(() => {
        if (!course) return;

        const videosWithProgress = getContinueWatchingVideos(course, 8);
        
        // Format videos for display
        const formattedVideos = videosWithProgress.map((vid: any) => ({
            ...vid,
            watchedStr: secondsToTime(vid.progress.currentTime),
            totalStr: secondsToTime(vid.progress.duration),
            percent: Math.round(vid.progress.percentage),
        }));

        setContinueWatchingVideos(formattedVideos);
    }, [course, getContinueWatchingVideos]);

    // Handle video click - navigate to courses-modules page
    const handleVideoClick = useCallback((video: any) => {
        if (!course) return;

        const position = findVideoPosition(course, video.video_id);
        if (position) {
            // Navigate to courses-modules page with video position
            router.push(`/courses-modules?video=${video.video_id}&module=${position.moduleIndex}&videoIndex=${position.videoIndex}`);
        }
    }, [course, router, findVideoPosition]);

    if (loading || !course) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="text-lg font-semibold text-gray-500">Loading...</span>
            </div>
        );
    }

    // Get actual course completion percentage
    const enrolledProgress = getCourseCompletion(course);

    return (
        <div className="">
            {/* Continue Watching */}
            <div className="bg-white rounded-2xl p-6 shadow mb-8">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <span className="text-yellow-500">⏸️</span> Continue Watching
                </h2>
                
                {continueWatchingVideos.length > 0 ? (
                    <div className="overflow-x-hidden">
                        <div ref={emblaRef} className="embla">
                            <div className="embla__container flex gap-6">
                                {continueWatchingVideos.map((vid: any, i: number) => (
                                    <div
                                        key={vid.video_id + i}
                                        className="embla__slide min-w-[240px] max-w-[260px] sm:min-w-[260px] sm:max-w-[280px] md:min-w-[300px] md:max-w-[320px] bg-[#F8F9FA] rounded-xl shadow-sm group transition hover:shadow-lg cursor-pointer flex-shrink-0"
                                        onClick={() => handleVideoClick(vid)}
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
                                            {/* Progress percentage */}
                                            <div className="text-xs text-gray-500 mt-1">
                                                {vid.percent}% completed
                                            </div>
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
            </div>

            {/* Enrolled Courses */}
            <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-1">Enrolled Courses</h2>
                <p className="text-gray-400 text-sm mb-4">Dive in, learn, and let your potential unfold!</p>
                <div className="flex flex-col gap-4">
                    <div 
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#F8F9FA] rounded-xl p-4 cursor-pointer hover:bg-[#F0F1F2] transition-colors"
                        onClick={() => router.push('/courses-modules')}
                    >
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
