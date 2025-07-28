import CalanderPage from '@/components/Resuable/CalanderPage'
import React, { useEffect, useState } from 'react'


interface ScheduleItem {
    id: number;
    task: string;
    subject: string;
    date: string;
    time: string;
    link?: string;
    link_label?: string;
}


export default function ScheduleCalander() {
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        fetch('/data/MyScheduleData.json')
            .then((res) => res.json())
            .then((data) => setScheduleData(data))
            .catch((error) => console.error('Error fetching schedule data:', error));
    }, []);
    return (
        <div>
            <CalanderPage scheduleData={scheduleData} />
        </div>
    )
}
