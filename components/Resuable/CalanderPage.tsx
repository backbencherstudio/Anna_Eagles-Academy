import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import MySchedule from './MySchedule';

interface ScheduleItem {
    id: number;
    task: string;
    subject: string;
    date: string;
    time: string;
}

// Helper to format date as YYYY-MM-DD in local time
function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function CalanderPage() {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        fetch('/data/MyScheduleData.json')
            .then((res) => res.json())
            .then((data) => setScheduleData(data));
    }, []);

    // Set today as default selected date
    useEffect(() => {
        if (!selectedDate) {
            const today = new Date();
            setSelectedDate(formatDateLocal(today));
            setCalendarDate(today);
        }
    }, [selectedDate]);

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setCalendarDate(date);
            setSelectedDate(formatDateLocal(date));
        }
    };

    return (
        <div className="calendar-page-container rounded-2xl h-96">
            <div className='bg-white rounded-2xl' style={{ height: 320, overflowY: 'auto' }}>
                <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={handleDateSelect}
                    className="border-none w-full bg-transparent"
                />
            </div>
            <div style={{ marginTop: 24 }}>
                <MySchedule selectedDate={selectedDate} scheduleData={scheduleData} />
            </div>
        </div>
    );
}
