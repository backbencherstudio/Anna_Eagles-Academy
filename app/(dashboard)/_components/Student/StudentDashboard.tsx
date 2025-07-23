import React from 'react'
import MyCourseCard from './MyCourseCard'

export default function StudentDashboard() {
    return (
        <div className='flex flex-col md:flex-row gap-4'>
            <div className='w-full md:w-4/12'>
                <MyCourseCard />
            </div>
            <div className='w-full md:w-8/12'>
                <div className='w-full bg-white rounded-2xl shadow p-4'>
                    <h1 className='text-2xl font-bold'>My Courses</h1>
                </div>
            </div>
        </div>
    )
}
