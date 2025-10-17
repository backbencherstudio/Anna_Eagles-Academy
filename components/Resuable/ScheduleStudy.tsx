"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Clock, User } from "lucide-react";

type ScheduleItem = {
    id: number;
    task: string;
    subject?: string;
    date: string;
    time?: string;
    originalEvent?: any;
    uniqueId?: string;
};

interface ScheduleStudyProps {
    scheduleData: ScheduleItem[];
    selectedDate?: Date;
    onDateChange?: (date: Date) => void;
    onEventClick?: (event: any) => void;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = [
    "12:00 AM",
    "01:00 AM",
    "02:00 AM",
    "03:00 AM",
    "04:00 AM",
    "05:00 AM",
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
    "11:00 PM",
];
function getWeekDates(baseDate: Date): Date[] {
    const monday = new Date(baseDate);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });
}

function getWeekOfMonth(date: Date): number {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return Math.ceil((date.getDate() + firstDay.getDay() - 1) / 7);
}

function formatMonthYear(date: Date): string {
    return `${date.toLocaleString("default", { month: "long" })}, ${date.getFullYear()}`;
}

function formatTimeRange(time?: string): [string | null, string | null] {
    if (!time) return [null, null];
    const [start, end] = time.split(" - ");
    return [start, end];
}

// Normalize time to slot format (e.g., '1:00 PM' => '01:00 PM')
function formatTimeToSlot(time: string | null): string | null {
    if (!time) return null;
    const [h, m] = time.split(":");
    if (!m) return time;
    let [minute, ampm] = m.split(" ");
    let hourNum = parseInt(h, 10);
    let hour = hourNum < 10 ? `0${hourNum}` : hourNum.toString().padStart(2, "0");
    return `${hour}:${minute} ${ampm}`;
}

// Fixed type-to-color map aligned with CategoriesOverview
const TYPE_COLOR_MAP: Record<string, string> = {
    general: '#059669',
    assignment: '#DC2626',
    quiz: '#D97706',
    meeting: '#16A34A',
    lecture: '#7C3AED',
};

// Get the slot index for a given time
function getSlotIndex(time: string | null): number {
    if (!time) return -1;
    const formattedTime = formatTimeToSlot(time);
    if (!formattedTime) return -1;

    // First try exact match
    let index = TIME_SLOTS.findIndex(slot => slot === formattedTime);
    if (index !== -1) return index;

    // If no exact match, FLOOR to the current hour slot (01:30 PM -> 01:00 PM)
    const [timePart, ampm] = formattedTime.split(' ');
    const [hour] = timePart.split(':');
    const flooredTime = `${hour.padStart(2, '0')}:00 ${ampm}`;

    index = TIME_SLOTS.findIndex(slot => slot === flooredTime);
    return index;
}

// Check if an event spans across multiple slots
function getEventSlotRange(start: string | null, end: string | null): { startSlot: number; endSlot: number; span: number } {
    if (!start || !end) return { startSlot: -1, endSlot: -1, span: 1 };

    const startSlot = getSlotIndex(start);
    const endSlot = getSlotIndex(end);

    if (startSlot === -1 || endSlot === -1) {
        return { startSlot: -1, endSlot: -1, span: 1 };
    }

    return {
        startSlot,
        endSlot,
        span: Math.max(1, endSlot - startSlot)
    };
}

export default function ScheduleStudy({ scheduleData, selectedDate: externalSelectedDate, onDateChange, onEventClick }: ScheduleStudyProps) {
    const [events, setEvents] = useState<ScheduleItem[]>([]);
    const [baseDate, setBaseDate] = useState<Date>(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    });
    const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    });

    // Use external selected date if provided, otherwise use internal state
    const selectedDate = externalSelectedDate || internalSelectedDate;

    useEffect(() => {
        setEvents(scheduleData);
    }, [scheduleData]);

    // Update internal selected date and base week when external date changes
    useEffect(() => {
        if (externalSelectedDate) {
            const normalized = new Date(externalSelectedDate);
            normalized.setHours(0, 0, 0, 0);
            setInternalSelectedDate(normalized);
            // Ensure the week grid switches to the week of the newly selected date
            setBaseDate(normalized);
        }
    }, [externalSelectedDate]);

    const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate]);
    const weekOfMonth = useMemo(() => getWeekOfMonth(weekDates[0]), [weekDates]);
    const monthYear = useMemo(() => formatMonthYear(weekDates[0]), [weekDates]);

    const eventsForSelectedDate: ScheduleItem[] = useMemo(() => {
        const selectedDateStr = selectedDate.toLocaleDateString('en-CA');
        return events
            .filter((ev) => ev.date === selectedDateStr)
            .sort((a, b) => {
                const [aStart] = formatTimeRange(a.time);
                const [bStart] = formatTimeRange(b.time);
                return (aStart || "00:00 AM").localeCompare(bStart || "00:00 AM");
            });
    }, [events, selectedDate]);

    // Group events by start time slot; collect unmapped events
    const { eventsBySlot, unmappedEvents } = useMemo(() => {
        const bySlot: Record<number, (ScheduleItem & { slotSpan: number })[]> = {};
        const notMapped: ScheduleItem[] = [];
        eventsForSelectedDate.forEach(ev => {
            if (!ev.time) {
                notMapped.push(ev);
                return;
            }
            const [start, end] = formatTimeRange(ev.time);
            const slotRange = getEventSlotRange(start, end);
            if (slotRange.startSlot !== -1) {
                if (!bySlot[slotRange.startSlot]) bySlot[slotRange.startSlot] = [];
                bySlot[slotRange.startSlot].push({ ...ev, slotSpan: slotRange.span });
            } else {
                notMapped.push(ev);
            }
        });
        return { eventsBySlot: bySlot, unmappedEvents: notMapped };
    }, [eventsForSelectedDate]);

    const getEventColor = (ev: ScheduleItem): string => {
        const typeKey = (ev as any).type?.toLowerCase?.() || (ev.originalEvent?.type?.toLowerCase?.()) || 'general';
        // Map backend CLASS to lecture, fallback to general
        const normalizedType = typeKey === 'class' ? 'lecture' : typeKey;
        return TYPE_COLOR_MAP[normalizedType] || TYPE_COLOR_MAP.general;
    };

    function handlePrevWeek(): void {
        const prev = new Date(baseDate);
        prev.setDate(prev.getDate() - 7);
        setBaseDate(prev);
        const newSelectedDate = getWeekDates(prev)[0];
        if (onDateChange) {
            onDateChange(newSelectedDate);
        } else {
            setInternalSelectedDate(newSelectedDate);
        }
    }
    function handleNextWeek(): void {
        const next = new Date(baseDate);
        next.setDate(next.getDate() + 7);
        setBaseDate(next);
        const newSelectedDate = getWeekDates(next)[0];
        if (onDateChange) {
            onDateChange(newSelectedDate);
        } else {
            setInternalSelectedDate(newSelectedDate);
        }
    }

    return (
        <div
            className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-sm"
        >
            {/* Header */}
            <div className="schedule-header flex items-center mb-4 flex-col sm:flex-row sm:mb-6 gap-2 sm:gap-0 w-full">
                <span className="font-bold text-lg">Schedule Study</span>
                <span className="text-[#F5A623] font-semibold text-base sm:ml-3">
                    <span className="text-gray-400 hidden sm:inline">|</span> Week {weekOfMonth} of {monthYear}
                </span>
                <div className="schedule-header-nav flex gap-2 sm:ml-auto mt-2 sm:mt-0">
                    <button
                        onClick={handlePrevWeek}
                        className="border border-gray-300 rounded-md bg-white w-7 h-7 flex items-center justify-center cursor-pointer"
                        aria-label="Previous week"
                    >
                        <MdKeyboardArrowLeft />
                    </button>
                    <button
                        onClick={handleNextWeek}
                        className="border border-gray-300 rounded-md bg-white w-7 h-7 flex items-center justify-center cursor-pointer"
                        aria-label="Next week"
                    >
                        <MdKeyboardArrowRight />
                    </button>
                </div>
            </div>

            <div className="w-full overflow-x-auto flex-1">
                <div className="min-w-[600px] sm:min-w-[760px] mx-auto">
                    {/* Days Row */}
                    <div className="flex items-center gap-0 mb-2 ml-1 font-medium text-[15px]">
                        <div className="w-[60px] text-[#bbb]">Time</div>
                        {weekDates.map((d, idx) => {
                            const isSelected =
                                d.getDate() === selectedDate.getDate() &&
                                d.getMonth() === selectedDate.getMonth() &&
                                d.getFullYear() === selectedDate.getFullYear();
                            return (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        if (onDateChange) {
                                            onDateChange(d);
                                        } else {
                                            setInternalSelectedDate(d);
                                        }
                                    }}
                                    className={`${isSelected ? 'text-[#F5A623] font-bold bg-[#FFF7E6] rounded-lg' : 'text-[#222] font-medium'} flex-1 text-center cursor-pointer transition-colors py-0.5`}
                                >
                                    <div className="text-[16px]">{d.getDate()}</div>
                                    <div className={`${isSelected ? 'text-[#F5A623]' : 'text-[#888]'} text-[13px]`}>{WEEK_DAYS[idx]}</div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Time slots and events */}
                    <div className="flex flex-col gap-0 mt-2">
                        {TIME_SLOTS.map((slot, idx) => (
                            <div key={slot} className="flex items-start min-h-16 border-b border-gray-200">
                                <div className="w-15 text-gray-400 text-sm pt-4 text-center">{slot}</div>
                                <div className="flex-1 min-h-16 flex items-start justify-center flex-col relative py-2 gap-2">
                                    {eventsBySlot[idx]?.map((event, eventIndex) => (
                                        <div
                                            key={event.uniqueId || `${event.id}-${eventIndex}`}
                                            onClick={() => onEventClick?.(event.originalEvent)}
                                            className={`bg-gray-50 rounded-xl border p-2 min-w-[300px] min-h-[40px] max-h-[80px]  ms-5 flex flex-row items-center gap-3 mb-0 cursor-pointer transition-all duration-200 z-10 w-full max-w-[400px] overflow-hidden ${onEventClick ? 'hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md' : 'cursor-default'
                                                }`}
                                            style={{
                                                borderColor: getEventColor(event)
                                            }}
                                        >
                                            {/* Color dot */}
                                            <span
                                                className="w-3 h-3 rounded-sm inline-block flex-shrink-0"
                                                style={{
                                                    backgroundColor: getEventColor(event),
                                                }}
                                            />

                                            {/* Main content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-semibold text-xs leading-tight">{event.task}</span>
                                                    {eventsBySlot[idx].length > 1 && (
                                                        <span className="text-[9px] text-gray-600 bg-gray-200 px-1 py-0.5 rounded-md">
                                                            {eventIndex + 1}/{eventsBySlot[idx].length}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Student name and time in one line */}
                                                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                                                    {event.originalEvent?.user && (
                                                        <span className="font-medium flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            {event.originalEvent.user.first_name} {event.originalEvent.user.last_name}
                                                        </span>
                                                    )}
                                                    {event.time && (
                                                        <span className="font-normal flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {event.time}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Display unmapped events */}
            {unmappedEvents.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="text-sm font-semibold text-yellow-800 mb-3">
                        Events not in time slots ({unmappedEvents.length})
                    </h3>
                    <div className="space-y-2">
                        {unmappedEvents.map((event, index) => (
                            <div
                                key={index}
                                onClick={() => onEventClick?.(event.originalEvent)}
                                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-50 transition-colors"
                            >
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 3,
                                        background: getEventColor(event),
                                        display: 'inline-block',
                                    }}
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{event.task}</div>
                                    {event.subject && (
                                        <div className="text-sm text-gray-600">{event.subject}</div>
                                    )}
                                    {event.time && (
                                        <div className="text-xs text-gray-500">{event.time}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}