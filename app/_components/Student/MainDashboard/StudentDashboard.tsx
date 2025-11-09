'use client'
import React, { useMemo } from 'react'
import CourseAnnouncement from './CourseAnnouncement';
import WatchWelcomeVideo from './WatchWelcomeVideo';
import StudentFeedback from './StudentFeedback/StudentFeedback';
import TeacherVideo from './TeacherVideo/TeacherVideo';
import CurrentCourseCard from './MyCoursesSection/CurrentCourseCard';
import CompleteCourse from './MyCoursesSection/CompeleteCourse';
import { useGetDashboardDataQuery } from '@/rtk/api/users/dashboardDataApis';
import AcademyMaterials from './MyCoursesSection/AcademyMaterials';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import StudentDashboardShimmer from './MyCoursesSection/StudentDashboardShimmer';
import { useAppSelector } from '@/rtk/hooks';
import CalanderPage from '@/components/Resuable/CalanderPage';

interface ScheduleItem {
    id: number;
    task: string;
    subject: string;
    date: string;
    time: string;
    link?: string;
    link_label?: string;
}

interface ScheduleEvent {
    id: string;
    title: string;
    description?: string;
    start_at: string;
    end_at: string;
    type: string;
    assignment?: {
        id: string;
        title: string;
    };
    quiz?: {
        id: string;
        title: string;
    };
    course?: {
        id: string;
        title: string;
    };
    series?: {
        id: string;
        title: string;
    };
}


export default function StudentDashboard() {
    const router = useRouter();
    const { user: userData } = useAppSelector((state) => state.auth);
    const isStudent = userData?.type === 'student'
    // Fetch dashboard data from API
    const { data: dashboardData, isLoading, error } = useGetDashboardDataQuery({});

    // Transform schedule_events to match CalanderPage expected format
    const scheduleData: ScheduleItem[] = useMemo(() => {
        const scheduleEvents: ScheduleEvent[] = dashboardData?.data?.schedule_events || [];
        return scheduleEvents.map((event, index) => {
            // Extract date from start_at (format: "2025-10-11T00:00:00.000Z")
            const startDate = new Date(event.start_at);
            const endDate = new Date(event.end_at);

            // Format date as YYYY-MM-DD for CalanderPage
            const dateStr = startDate.toISOString().split('T')[0];

            // Format time range
            const startTime = startDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const endTime = endDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const timeStr = `${startTime} - ${endTime}`;

            // Determine subject based on type and related data
            let subject = '';
            if (event.type === 'ASSIGNMENT' && event.assignment) {
                subject = event.assignment.title;
            } else if (event.type === 'QUIZ' && event.quiz) {
                subject = event.quiz.title;
            } else if (event.course) {
                subject = event.course.title;
            } else {
                subject = event.type;
            }

            return {
                id: index + 1, 
                task: event.title,
                subject: subject,
                date: dateStr,
                time: timeStr,
                link: event.description || undefined,
                link_label: event.type
            };
        });
    }, [dashboardData?.data?.schedule_events]);

    // handle view all courses
    const handleViewAllCourses = () => {
        router.push('/user/my-courses');
    }

    if (isLoading) {
        return <StudentDashboardShimmer />
    }

    return (
        <>
            <CourseAnnouncement announcements={dashboardData?.data?.teacher_sections?.announcement || []} />
            <WatchWelcomeVideo  />

            {isStudent && (
                <>
                    <div className='flex flex-col lg:flex-row gap-10 mt-10'>
                        {/* left side */}
                        <div className='w-full lg:w-7/12 flex flex-col gap-5'>
                            <>
                                {/* My Courses Section */}
                                <div className='flex flex-col gap-4 '>
                                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                                        <h1 className='text-2xl font-semibold text-[#1D1F2C]'>My Courses</h1>
                                        {/* button view all courses */}
                                        {isStudent && (
                                            <Button onClick={handleViewAllCourses} variant="outline" size="sm" className="flex items-center gap-2 bg-blue-50 border-blue-200 text-[#0F2598] hover:bg-[#ECEFF3] cursor-pointer text-xs sm:text-sm px-3 py-2 w-full sm:w-auto justify-center">
                                                <span>View All Courses</span>
                                            </Button>
                                        )}
                                    </div>
                                    <CurrentCourseCard series={dashboardData?.data?.enrolled_series?.[0]} />
                                </div>

                                {/* cousres list */}
                                <div className=''>
                                    <CompleteCourse
                                        enrolledSeries={dashboardData?.data?.enrolled_series?.[0]}
                                    />
                                    <AcademyMaterials />
                                </div>
                            </>

                        </div>
                        {/* right side */}
                        <div className='w-full lg:w-5/12 mt-2'>
                            <CalanderPage scheduleData={scheduleData} isLoading={isLoading} />
                            <StudentFeedback />
                            <TeacherVideo encouragement={dashboardData?.data?.teacher_sections?.encouragement || []}/>
                        </div>
                    </div>
                </>)}
            {!isStudent && (
                <div className='mt-10 flex flex-col items-center justify-center gap-4 border rounded-md p-6 bg-blue-50'>
                    <h2 className='text-xl font-semibold text-[#1D1F2C] text-center'>You’re not enrolled in any course yet</h2>
                    <p className='text-sm text-gray-600 text-center'>Purchase or enroll in a course to get started.</p>
                    <Button onClick={() => router.push('/user/discover')} className='bg-[#0F2598] text-white hover:bg-[#0d1f7a] cursor-pointer'>Browse Courses</Button>
                </div>
            )}
        </>
    )
}
