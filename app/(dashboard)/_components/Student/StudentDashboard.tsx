import React, { useState, useEffect } from 'react'
import MyCourseCard from './MyCourseCard'
import TodayTask from './TodayTask'
import CalanderPage from '@/components/Resuable/CalanderPage'
import CourseAnnouncement from './MainDashboard/CourseAnnouncement';
import WatchWelcomeVideo from './MainDashboard/WatchWelcomeVideo';
import StudentFeedback from './MainDashboard/StudentFeedback/StudentFeedback';
import TeacherVideo from './MainDashboard/TeacherVideo/TeacherVideo';
import CurrentCourseCard from './MainDashboard/MyCoursesSection/CurrentCourseCard';

interface ScheduleItem {
    id: number;
    task: string;
    subject: string;
    date: string;
    time: string;
    link?: string;
    link_label?: string;
}

export default function StudentDashboard() {
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        fetch('/data/MyScheduleData.json')
            .then((res) => res.json())
            .then((data) => setScheduleData(data))
            .catch((error) => console.error('Error fetching schedule data:', error));
    }, []);

    return (
        <>
            <CourseAnnouncement />
            <WatchWelcomeVideo />
            <div className='flex flex-col lg:flex-row gap-10'>
                {/* left side */}
                <div className='w-full lg:w-7/12 flex flex-col gap-7 mt-2'>
                    {/* My Courses Section */}
                    <div className='flex flex-col gap-4 '>
                        <h1 className='text-2xl font-semibold text-[#1D1F2C]'>My Courses</h1>
                        <CurrentCourseCard />
                    </div>

                    <MyCourseCard />
                    <TodayTask />
                </div>
                {/* right side */}
                <div className='w-full lg:w-5/12 mt-2'>
                    <CalanderPage scheduleData={scheduleData} />
                    <StudentFeedback />
                    <TeacherVideo />
                </div>
            </div>
        </>
    )
}
