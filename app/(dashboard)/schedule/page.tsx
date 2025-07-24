import React from 'react'
import SchedulePage from '../_components/Student/SchedulePage'
import ScheduleStudy from '../_components/Student/ScheduleStudy'

export default function Calendar() {
    return (

        <div className='w-full  flex flex-col gap-10 lg:flex-row '>
            <div className=' w-full lg:w-7/12'>
                <ScheduleStudy />
            </div>
            <div className=' w-full lg:w-5/12'>
                <SchedulePage />
            </div>
        </div>

    )
}
