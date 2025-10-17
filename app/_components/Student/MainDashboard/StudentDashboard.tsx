'use client'
import React from 'react'
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


export default function StudentDashboard() {
    const router = useRouter();
    const { user: userData } = useAppSelector((state) => state.auth);
    const isStudent = userData?.type === 'student'
    // Fetch dashboard data from API
    const { data: dashboardData, isLoading, error } = useGetDashboardDataQuery({});

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
            <WatchWelcomeVideo encouragement={dashboardData?.data?.teacher_sections?.encouragement || []} />

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
                            {/* <CalanderPage scheduleData={scheduleData} /> */}
                            <StudentFeedback />
                            <TeacherVideo />
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
