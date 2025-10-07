'use client'
import React, { useEffect, useState } from 'react'
import CalanderStudent from '@/app/_components/Student/CalanderStudent'
import SchedulePage from '@/components/Shared/Calander/SchedulePage'

type ScheduleItem = {
    id: number;
    task: string;
    subject?: string;
    date: string;
    time?: string;
};

export default function Calendar() {
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    });
    
    useEffect(() => {
        fetch("/data/MyScheduleData.json")
            .then((res) => res.json())
            .then((data: ScheduleItem[]) => {
                setScheduleData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching schedule data:", error);
                setLoading(false);
            });
    }, []);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    }

    return (
        <div className='w-full  flex flex-col gap-10 lg:flex-row '>
            <div className=' w-full lg:w-7/12'>
                <CalanderStudent scheduleData={scheduleData} selectedDate={selectedDate} onDateChange={handleDateChange} />
            </div>
            <div className=' w-full lg:w-5/12'>
                <SchedulePage 
                    title='Task Categories Overview' 
                    scheduleData={scheduleData}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                />
            </div>
        </div>
    )
}
