'use client'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CalanderAdmin from '@/app/_components/Admin/CalanderAdmin'
import AddEventModal from '@/app/_components/Admin/Calendar/AddEventModal'
import ButtonSpring from '@/components/Resuable/ButtonSpring'
import SchedulePage from '@/components/Shared/Calander/SchedulePage'

interface ScheduleItem {
    id: number;
    task: string;
    subject: string;
    date: string;
    time: string;
}

export default function Calendar() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [opening, setOpening] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    });

    const handleOpenModal = () => {

        setOpening(true)
        setTimeout(() => {
            setIsModalOpen(true)
            setOpening(false)
        }, 100)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    }

    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        fetch('/data/MyScheduleData.json')
            .then((res) => res.json())
            .then((data) => setScheduleData(data));
    }, []);

    return (
        <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch'>

            {/* schedule calander left side */}
            <div className='lg:col-span-2 flex flex-col'>
                <CalanderAdmin scheduleData={scheduleData} selectedDate={selectedDate} onDateChange={handleDateChange} />
            </div>

            {/* add event and schedule page right side */}
            <div className='lg:col-span-1 flex flex-col'>
                <Button
                    className='w-full py-5 cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/80 disabled:opacity-70 disabled:cursor-not-allowed'
                    onClick={handleOpenModal}
                    disabled={opening}
                >
                    {opening ? (
                        <span className='flex items-center gap-2 w-full justify-center'>
                            <ButtonSpring size={18} color='#ffffff' />
                            <span>loading...</span>
                        </span>
                    ) : (
                        <>
                            <span className='bg-white/30 rounded-full p-1'>
                                <Plus />
                            </span>
                            Add Event
                        </>
                    )}
                </Button>

                {/* schedule page */}
                <div className='mt-4'>
                    <SchedulePage title='Overview' scheduleData={scheduleData} showAllCategories={true} selectedDate={selectedDate} onDateChange={handleDateChange} />
                </div>
                {/* Modal */}
                <AddEventModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            </div>
        </div>
    )
}
