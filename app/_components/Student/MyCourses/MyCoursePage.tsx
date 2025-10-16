"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContinueWatching from './ContinueWatching';
import MyCoursePageSkeleton from './MyCoursePageSkeleton';
import { BookOpenIcon, PlayCircleIcon } from 'lucide-react';
import { useGetEnrolledSeriesQuery } from '@/rtk/api/users/myCoursesApis';
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { setEnrolledSeries, type EnrolledSeriesSummary } from '@/rtk/slices/users/myCoursesSlice';
import Image from 'next/image';

export default function MyCoursePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { enrolledSeries } = useAppSelector((s) => s.myCourses);

    const { data, isFetching } = useGetEnrolledSeriesQuery(undefined);

    useEffect(() => {
        if (!data?.data?.series) return;
        const mapped: EnrolledSeriesSummary[] = data.data.series.map((s: any) => ({
            id: s.id,
            title: s.title,
            duration: s.duration ?? null,
            progressPercentage: s.enrollment?.progress_percentage ?? 0,
            lessonFiles: s._count?.lesson_files ?? 0,
            coursesCount: s._count?.courses ?? 0,
            quizzesCount: s._count?.quizzes ?? 0,
            assignmentsCount: s._count?.assignments ?? 0,
            thumbnailUrl: s.thumbnail_url ?? null,
        }));
        dispatch(setEnrolledSeries(mapped));
    }, [data, dispatch]);

    if (isFetching) {
        return <MyCoursePageSkeleton />;
    }

    // handle course id wise paly video
    const handleViewVideo = (id: string) => {
        router.push(`/user/courses-modules/${id}`);
    }

    return (
        <div className="">
            <ContinueWatching />

            <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-1">Enrolled Series</h2>
                <p className="text-gray-400 text-sm mb-4">Dive in, learn, and let your potential unfold!</p>
                <div className="flex flex-col gap-4">
                    {enrolledSeries.map((series) => {
                        const progress = series.progressPercentage ?? 0;
                        return (
                            <div
                                key={series.id}
                                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#F8F9FA] rounded-xl p-4 cursor-pointer hover:bg-[#F0F1F2] transition-colors"
                                onClick={() => handleViewVideo(series.id)}
                            >
                                <div className="flex gap-4 flex-1 min-w-0">
                                    {/* Thumbnail Image */}
                                    <div className="flex-shrink-0">
                                        {series.thumbnailUrl ? (
                                            <Image
                                                width={500}
                                                height={200}
                                                src={series.thumbnailUrl}
                                                alt={series.title}
                                                className="w-40 h-20 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                                <BookOpenIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-base mb-1 truncate">{series.title}</div>
                                        <div className="flex items-center gap-6 text-xs text-gray-500 mb-2">
                                            <span>Duration <span className="font-semibold text-gray-700 ml-1">{series.duration ?? '—'}</span></span>
                                            <span className="hidden md:inline">|</span>
                                            <span>Progress <span className="font-semibold text-gray-700 ml-1">{progress}%</span></span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                            <div
                                                className="h-2 bg-yellow-400 rounded-full transition-all"
                                                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 min-w-[100px] justify-end">
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <BookOpenIcon className='w-4 h-4 text-[#BDC1C6]' />
                                        <span className="text-xs text-gray-500">Courses</span>
                                        <span className="text-xs font-medium">

                                            {series.coursesCount} </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <PlayCircleIcon className='w-4 h-4 text-[#BDC1C6]' />
                                        <span className="text-xs text-gray-500">Videos</span>
                                        <span className="text-sm font-medium">{series.lessonFiles}</span>
                                    </div>
                                    {/* <div className="flex items-center gap-1 text-gray-600">
                                        <CircleHelp className='w-4 h-4 text-[#BDC1C6]' />
                                        <span className="text-xs text-gray-500">Quizzes</span>
                                        <span className="text-sm font-medium">{series.quizzesCount}</span>
                                    </div> */}
                                    {/* <div className="flex items-center gap-1 text-gray-600">
                                        <ListChecks className='w-4 h-4 text-[#BDC1C6]' />
                                        <span className="text-xs text-gray-500">Assignments</span>
                                        <span className="text-sm font-medium">{series.assignmentsCount}</span>
                                    </div> */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
