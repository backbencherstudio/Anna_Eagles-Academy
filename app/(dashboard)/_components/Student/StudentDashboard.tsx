import React from 'react'
import MyCourseCard from './MyCourseCard'
import TodayTask from './TodayTask'
import CalanderPage from '@/components/Resuable/CalanderPage'

export default function StudentDashboard() {
    return (
        <div className='flex flex-col lg:flex-row gap-10'>
            <div className='w-full lg:w-5/12 flex flex-col gap-7'>
                <MyCourseCard />
                <TodayTask />
            </div>
            <div className='w-full lg:w-7/12'>
                <CalanderPage />

            </div>
        </div>
    )
}
