import React from 'react'
import SchedulePage from '../_components/Student/SchedulePage'

export default function Calendar() {
    return (

        <div className='w-full  flex flex-col gap-10'>

            <div className=' w-full lg:w-5/12'>
                <SchedulePage />
            </div>
        </div>

    )
}
