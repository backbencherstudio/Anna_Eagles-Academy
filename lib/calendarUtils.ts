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
        case 'LECTURE':
            frontendType = 'lecture';
            break;
        case 'MEETING':
            frontendType = 'meeting';
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

// ---- Reusable Date/Time helpers for forms ----

// Merge a selected local calendar date with a 12-hour time like "10:30 AM"
// Returns a UTC ISO string representing that local datetime
export function toIsoWithTime(date: Date, timeString: string): string {
    const [time, period] = timeString.split(' ');
    const [hhStr, mmStr] = time.split(':');
    let hour = parseInt(hhStr, 10);
    const minute = parseInt(mmStr, 10);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const localDateTime = new Date(year, month, day, hour, minute, 0, 0);
    return localDateTime.toISOString();
}

// Validate that end time is after start time (both in 12-hour strings like "10:00 AM")
export function validateTimeRange(startTime: string, endTime: string): boolean {
    if (!startTime || !endTime) return true;

    const toMinutes = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour = hours;
        if (period === 'PM' && hours !== 12) hour += 12;
        if (period === 'AM' && hours === 12) hour = 0;
        return hour * 60 + minutes;
    };

    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);
    return endMinutes > startMinutes;
}

// Suggest an end time one hour after a given start time (12-hour string)
export function getSuggestedEndTime(startTime: string): string {
    if (!startTime) return '';

    const parse = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour = hours;
        if (period === 'PM' && hours !== 12) hour += 12;
        if (period === 'AM' && hours === 12) hour = 0;
        return { hour, minute: minutes };
    };

    const { hour, minute } = parse(startTime);
    const end = new Date();
    end.setHours(hour + 1, minute, 0, 0);
    return end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}