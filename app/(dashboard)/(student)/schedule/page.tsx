import React from 'react'
import CalanderStudent from '../../_components/Student/CalanderStudent'
import SchedulePage from '../../_components/Student/SchedulePage'


export default function Calendar() {
    return (

        <div className='w-full  flex flex-col gap-10 lg:flex-row '>
            <div className=' w-full lg:w-7/12'>
                <CalanderStudent />
            </div>
            <div className=' w-full lg:w-5/12'>
                <SchedulePage />
            </div>
        </div>

    )
}
