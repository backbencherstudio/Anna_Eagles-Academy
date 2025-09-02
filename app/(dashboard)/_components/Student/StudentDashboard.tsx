import React, { useState, useEffect } from 'react'
import MyCourseCard from './MyCourseCard'
import TodayTask from './TodayTask'
import CalanderPage from '@/components/Resuable/CalanderPage'
import CourseAnnouncement from './MainDashboard/CourseAnnouncement';
import WatchWelcomeVideo from './MainDashboard/WatchWelcomeVideo';
import StudentFeedback from './MainDashboard/StudentFeedback/StudentFeedback';

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
                <div className='w-full lg:w-7/12 flex flex-col gap-7'>
                    <MyCourseCard />
                    <TodayTask />
                </div>
                {/* right side */}
                <div className='w-full lg:w-5/12'>
                    <CalanderPage scheduleData={scheduleData} />
                    <StudentFeedback />
                </div>
            </div>
        </>
    )
}
