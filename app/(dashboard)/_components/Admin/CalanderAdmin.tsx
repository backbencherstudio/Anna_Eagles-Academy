"use client";
import ScheduleStudy from '@/components/Resuable/ScheduleStudy'
import React, { useEffect, useState } from 'react'

type ScheduleItem = {
    id: number;
    task: string;
    subject?: string;
    date: string;
    time?: string;
};

export default function CalanderAdmin() {
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center">
                <div className="text-gray-500">Loading schedule...</div>
            </div>
        );
    }

    return (
        <ScheduleStudy scheduleData={scheduleData} />
    )
}
