"use client";
import ScheduleStudy from '@/components/Resuable/ScheduleStudy'
import React from 'react'

type ScheduleItem = {
    id: number;
    task: string;
    subject?: string;
    date: string;
    time?: string;
    originalEvent?: any;
    uniqueId?: string;
};

export default function CalanderAdmin({ scheduleData, selectedDate, onDateChange, onEventClick }: { 
    scheduleData: ScheduleItem[];
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    onEventClick?: (event: any) => void;
}) {

    return (
        <div className="h-full">
            <ScheduleStudy 
                scheduleData={scheduleData} 
                selectedDate={selectedDate} 
                onDateChange={onDateChange}
                onEventClick={onEventClick}
            />
        </div>
    )
}
