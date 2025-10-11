import CalanderPage from '@/components/Resuable/CalanderPage'
import React, { useMemo } from 'react'

interface ScheduleItem {
    id: number;
    task: string;
    subject: string;
    date: string;
    time: string;
    link?: string;
    link_label?: string;
}

interface ScheduleEvent {
    id: string;
    title: string;
    description?: string;
    start_at: string;
    end_at: string;
    type: string;
    assignment?: {
        id: string;
        title: string;
    };
    quiz?: {
        id: string;
        title: string;
    };
    course?: {
        id: string;
        title: string;
    };
    series?: {
        id: string;
        title: string;
    };
}

interface ScheduleCalanderProps {
    scheduleEvents?: ScheduleEvent[];
    isLoading?: boolean;
}

export default function ScheduleCalander({ scheduleEvents = [], isLoading = false }: ScheduleCalanderProps) {
    // Transform API data to match CalanderPage expected format
    const scheduleData: ScheduleItem[] = useMemo(() => {
        return scheduleEvents.map((event, index) => {
            // Extract date from start_at (format: "2025-10-11T00:00:00.000Z")
            const startDate = new Date(event.start_at);
            const endDate = new Date(event.end_at);

            // Format date as YYYY-MM-DD for CalanderPage
            const dateStr = startDate.toISOString().split('T')[0];

            // Format time range
            const startTime = startDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const endTime = endDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const timeStr = `${startTime} - ${endTime}`;

            // Determine subject based on type and related data
            let subject = '';
            if (event.type === 'ASSIGNMENT' && event.assignment) {
                subject = event.assignment.title;
            } else if (event.type === 'QUIZ' && event.quiz) {
                subject = event.quiz.title;
            } else if (event.course) {
                subject = event.course.title;
            } else {
                subject = event.type;
            }

            return {
                id: index + 1, // Use index as id since API uses string ids
                task: event.title,
                subject: subject,
                date: dateStr,
                time: timeStr,
                link: event.description || undefined,
                link_label: event.type
            };
        });
    }, [scheduleEvents]);

    return (
        <div>
            <CalanderPage scheduleData={scheduleData} isLoading={isLoading} />
        </div>
    )
}
