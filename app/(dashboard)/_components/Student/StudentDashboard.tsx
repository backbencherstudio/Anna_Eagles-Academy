import React from 'react'
import MyCourseCard from './MyCourseCard'
import TodayTask from './TodayTask'

export default function StudentDashboard() {
    return (
        <div className='flex flex-col lg:flex-row gap-4'>
            <div className='w-full lg:w-4/12 flex flex-col gap-7'>
                <MyCourseCard />
                <TodayTask />
            </div>
            <div className='w-full lg:w-8/12'>
                <div className='w-full bg-white rounded-2xl shadow p-4'>
                    <h1 className='text-2xl font-bold'>Calendar</h1>
                </div>
            </div>
        </div>
    )
}
