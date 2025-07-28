import React from 'react'
import CalanderAdmin from '../_components/Admin/CalanderAdmin'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddEvent from '../_components/Admin/AddEvent'


export default function Calendar() {
    return (
        <div className='w-full  flex flex-col gap-10 lg:flex-row '>
            <div className=' w-full lg:w-7/12'>
                <CalanderAdmin />
            </div>
            <div className=' w-full lg:w-5/12 '>
                {/* <SchedulePage /> */}
                <Button className='w-full cursor-pointer bg-[#F1C27D] hover:bg-[#F1C27D]/80'>
                    <span className='bg-white/30 rounded-full p-1'>
                        <Plus />
                    </span>
                    Add Event
                </Button>
                <div className=' '>
                    <AddEvent />
                </div>
            </div>
        </div>
    )
}
