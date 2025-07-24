"use client";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

type ScheduleItem = {
    id: number;
    task: string;
    subject?: string;
    date: string;
    time?: string;
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = [
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
];

const COLOR_MAP: Record<string, string> = {
    "Faith and Finances": "#FFE9E1",
    "Foundations of Faith": "#FFF7E6",
    "Understanding the Book of Genesis": "#E6F7EC",
    "Bible Study Session": "#FFF7E6",
};
const DOT_COLOR: Record<string, string> = {
    "Faith and Finances": "#FF5C1A",
    "Foundations of Faith": "#FFD59A",
    "Understanding the Book of Genesis": "#2ECC40",
    "Bible Study Session": "#FFD600",
};

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

// Helper to normalize time to slot format (e.g., '1:00 PM' => '01:00 PM')
function formatTimeToSlot(time: string | null): string | null {
    if (!time) return null;
    const [h, m] = time.split(":");
    if (!m) return time;
    let [minute, ampm] = m.split(" ");
    let hourNum = parseInt(h, 10);
    let hour = hourNum < 10 ? `0${hourNum}` : hourNum.toString().padStart(2, "0");
    return `${hour}:${minute} ${ampm}`;
}

// Helper to generate consistent task-to-color mapping
const COLOR_PALETTE = [
    '#FF5C1A', '#FFD59A', '#2ECC40', '#FFD600', '#007bff', '#FF69B4', '#8A2BE2', '#20B2AA', '#FF6347', '#00CED1', '#FFA500', '#6A5ACD', '#32CD32', '#DC143C', '#00BFFF', '#FF4500', '#B8860B', '#228B22', '#DAA520', '#9932CC'
];
function getTaskColorMap(scheduleData: { task: string }[]) {
    const taskColorMap: Record<string, string> = {};
    let colorIndex = 0;
    scheduleData.forEach((item) => {
        if (!taskColorMap[item.task]) {
            taskColorMap[item.task] = COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];
            colorIndex++;
        }
    });
    return taskColorMap;
}

export default function ScheduleStudy() {
    const [events, setEvents] = useState<ScheduleItem[]>([]);
    const [baseDate, setBaseDate] = useState<Date>(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    });
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    });

    useEffect(() => {
        fetch("/data/MyScheduleData.json")
            .then((res) => res.json())
            .then((data: ScheduleItem[]) => {
                setEvents(data);
            });
    }, []);

    const weekDates = getWeekDates(baseDate);
    const weekOfMonth = getWeekOfMonth(weekDates[0]);
    const monthYear = formatMonthYear(weekDates[0]);

    const eventsForSelectedDate: ScheduleItem[] = events
        .filter((ev) => {
            const evDate = new Date(ev.date);
            return (
                evDate.getFullYear() === selectedDate.getFullYear() &&
                evDate.getMonth() === selectedDate.getMonth() &&
                evDate.getDate() === selectedDate.getDate()
            );
        })
        .sort((a, b) => {
            const [aStart] = formatTimeRange(a.time);
            const [bStart] = formatTimeRange(b.time);
            return (aStart || "00:00 AM").localeCompare(bStart || "00:00 AM");
        });

    const slotEvents: ScheduleItem[][] = TIME_SLOTS.map((slot) => {
        return eventsForSelectedDate.filter((ev) => {
            const [start] = formatTimeRange(ev.time);
            return formatTimeToSlot(start) === slot;
        });
    });


    const uniqueTasks = Array.from(
        new Map(events.map(item => [item.task, item])).values()
    );
    const taskColorMap = getTaskColorMap(uniqueTasks);

    function handlePrevWeek(): void {
        const prev = new Date(baseDate);
        prev.setDate(prev.getDate() - 7);
        setBaseDate(prev);
        setSelectedDate(getWeekDates(prev)[0]);
    }
    function handleNextWeek(): void {
        const next = new Date(baseDate);
        next.setDate(next.getDate() + 7);
        setBaseDate(next);
        setSelectedDate(getWeekDates(next)[0]);
    }

    return (
        <div
            className="bg-white rounded-2xl p-6 shadow-sm"
            style={{ borderRadius: 16, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", padding: 24 }}
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>Schedule Study</span>
                <span style={{ color: "#F5A623", fontWeight: 600, fontSize: 16, marginLeft: 12 }}>
                    <span className="text-gray-400">|</span> Week {weekOfMonth} of {monthYear}
                </span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <button
                        onClick={handlePrevWeek}
                        style={{ border: "1px solid #D1D5DB", borderRadius: 6, background: "#fff", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        aria-label="Previous week"
                    >
                        <MdKeyboardArrowLeft />
                    </button>
                    <button
                        onClick={handleNextWeek}
                        style={{ border: "1px solid #D1D5DB", borderRadius: 6, background: "#fff", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        aria-label="Next week"
                    >
                        <MdKeyboardArrowRight />
                    </button>
                </div>
            </div>
            {/* Days Row */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8, marginLeft: 2, fontWeight: 500, fontSize: 15 }}>
                <div style={{ width: 60, color: "#bbb" }}>Time</div>
                {weekDates.map((d, idx) => {
                    const isSelected =
                        d.getDate() === selectedDate.getDate() &&
                        d.getMonth() === selectedDate.getMonth() &&
                        d.getFullYear() === selectedDate.getFullYear();
                    return (
                        <div
                            key={idx}
                            onClick={() => setSelectedDate(d)}
                            style={{
                                flex: 1,
                                color: isSelected ? "#F5A623" : "#222",
                                fontWeight: isSelected ? 700 : 500,
                                background: isSelected ? "#FFF7E6" : "none",
                                borderRadius: isSelected ? 8 : 0,
                                padding: isSelected ? "2px 0" : "2px 0",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "background 0.2s, color 0.2s",
                            }}
                        >
                            <div style={{ fontSize: 16 }}>{d.getDate()}</div>
                            <div style={{ fontSize: 13, color: isSelected ? "#F5A623" : "#888" }}>{WEEK_DAYS[idx]}</div>
                        </div>
                    );
                })}
            </div>
            {/* Time slots and events */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
                {TIME_SLOTS.map((slot, idx) => (
                    <div key={slot} style={{ display: "flex", alignItems: "flex-start", minHeight: 64, borderBottom: "1px solid #F3F4F6" }}>
                        <div style={{ width: 60, color: "#bbb", fontSize: 14, paddingTop: 18 }}>{slot}</div>
                        <div style={{ flex: 1, minHeight: 64, display: "flex", alignItems: "center", flexDirection: "column" }}>
                            {slotEvents[idx].map((event) => (
                                <div
                                    key={event.id}
                                    style={{
                                        background: COLOR_MAP[event.task] || "#f7f8fa",
                                        borderRadius: 14,
                                        padding: "14px 18px 14px 16px",
                                        minWidth: 260,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                        marginBottom: 8,
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                                        {/* Color dot like CategoriesOverview */}
                                        <span
                                            style={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: 3,
                                                background: taskColorMap[event.task] || '#ccc',
                                                display: 'inline-block',
                                                marginRight: 6,
                                            }}
                                        />
                                        <span style={{ fontWeight: 700, fontSize: 14 }}>{event.task}</span>
                                    </div>
                                    {event.subject && (
                                        <div style={{ fontWeight: 500, fontSize: 13 }}>{event.subject}</div>
                                    )}
                                    {event.time && (
                                        <div style={{ fontWeight: 400, fontSize: 12, color: "#888" }}>{event.time}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
