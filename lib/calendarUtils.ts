import { CalendarEvent } from '@/rtk/slices/admin/calendarSehedulesSlice';

export interface TransformedScheduleItem {
    id: number;
    task: string;
    subject?: string;
    date: string;
    time?: string;
    link?: string;
    link_label?: string;
    type: string;
    originalEvent?: CalendarEvent;
    uniqueId?: string;
}

export function transformCalendarEventToScheduleItem(
    event: CalendarEvent,
    index: number,
    timeZone?: string
): TransformedScheduleItem {
    const startDate = new Date(event.start_at);
    let endDate = new Date(event.end_at);

    if (endDate < startDate) {
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    }
    if (endDate.getTime() === startDate.getTime()) {
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    }

    const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    const dateStr = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(startDate);

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: tz,
    });
    const timeRange = `${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;

    let subject = '';
    if (event.course?.title) subject = event.course.title;
    else if (event.series?.title) subject = event.series.title;
    else if (event.user) subject = `${event.user.first_name} ${event.user.last_name}`;

    let frontendType = 'general';
    switch (event.type) {
        case 'CLASS':
            frontendType = 'lecture';
            break;
        case 'QUIZ':
            frontendType = 'quiz';
            break;
        case 'ASSIGNMENT':
            frontendType = 'assignment';
            break;
        case 'GENERAL':
            frontendType = 'general';
            break;
        default:
            frontendType = 'general';
    }

    return {
        id: index + 1,
        task: event.title,
        subject: subject || undefined,
        date: dateStr,
        time: timeRange,
        link: event.class_link || undefined,
        link_label: event.class_link ? 'Class Link' : undefined,
        type: frontendType,
        originalEvent: event,
        uniqueId: `${event.id}-${event.user_id || 'no-user'}-${event.start_at}`,
    };
}
