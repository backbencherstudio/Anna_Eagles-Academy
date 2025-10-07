"use client";
import ScheduleStudy from '@/components/Resuable/ScheduleStudy'
import React, { useState } from 'react'

type ScheduleItem = {
    id: number;
    task: string;
    subject?: string;
    date: string;
    time?: string;
};

export default function CalanderStudent({ scheduleData, selectedDate, onDateChange }: {
    scheduleData: ScheduleItem[];
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}) {
    const [loading, setLoading] = useState(false);


    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center">
                <div className="text-gray-500">Loading schedule...</div>
            </div>
        );
    }

    return (
        <ScheduleStudy scheduleData={scheduleData} selectedDate={selectedDate} onDateChange={onDateChange} />
    )
}
