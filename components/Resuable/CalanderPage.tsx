import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MySchedule from './MySchedule';

interface ScheduleItem {
    id: number;
    task: string;
    subject: string;
    date: string;
    time: string;
    link?: string;
    link_label?: string;
}

function formatDateLocal(date: Date): string {
    return date.toISOString();
}

function getWeekDates(date: Date): Date[] {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
        const weekDay = new Date(startOfWeek);
        weekDay.setDate(startOfWeek.getDate() + i);
        week.push(weekDay);
    }
    return week;
}



function getMonthLabel(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

interface CalanderPageProps {
    scheduleData: ScheduleItem[];
    initialSelectedDate?: string;
}

export default function CalanderPage({ scheduleData, initialSelectedDate }: CalanderPageProps) {
    const [selectedDate, setSelectedDate] = useState<string>(initialSelectedDate || '');
    const [currentWeek, setCurrentWeek] = useState<Date>(new Date());

    useEffect(() => {
        if (!selectedDate) {
            const today = new Date();
            setSelectedDate(formatDateLocal(today));
            setCurrentWeek(today);
        } else {
            setCurrentWeek(new Date(selectedDate));
        }
    }, [selectedDate]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(formatDateLocal(date));
        setCurrentWeek(date);
    };

    const handlePreviousWeek = () => {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(newWeek.getDate() - 7);
        setCurrentWeek(newWeek);
    };

    const handleNextWeek = () => {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(newWeek.getDate() + 7);
        setCurrentWeek(newWeek);
    };

    const weekDates = getWeekDates(currentWeek);
    const monthLabel = getMonthLabel(currentWeek);
    const filteredSchedule = scheduleData.filter((item) => {
        const selectedDatePart = selectedDate ? selectedDate.slice(0, 10) : '';
        return item.date === selectedDatePart;
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="rounded-2xl">
            <div className='bg-white rounded-2xl p-4 border border-[#ECEFF3]'>
                <h1 className='text-[#1D1F2C] font-bold text-xl lg:text-2xl pb-4'>Calendar</h1>
                {/* Month Header (Month navigation only) */}
                <div className="mb-3">
                    <div className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
                        <h2 className="text-lg font-semibold select-none text-foreground">{monthLabel}</h2>
                        <div className="flex items-center gap-2">
                            <Button
                                size="icon"
                                onClick={() => {
                                    const d = new Date(currentWeek);
                                    d.setMonth(d.getMonth() - 1);
                                    setCurrentWeek(d);
                                }}
                                className="h-9 w-9 cursor-pointer !bg-[#F8F9FA]"
                            >
                                <ChevronLeftIcon className="!h-5 !w-5 text-muted-foreground" />
                            </Button>
                            <Button
                                size="icon"
                                onClick={() => {
                                    const d = new Date(currentWeek);
                                    d.setMonth(d.getMonth() + 1);
                                    setCurrentWeek(d);
                                }}
                                className="h-9 w-9  !bg-[#F8F9FA] cursor-pointer"
                            >
                                <ChevronRightIcon className="!h-5 !w-5 text-[#f8bd63]" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Week View with side arrows */}
                <div className="flex w-full items-center gap-2 ">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePreviousWeek}
                        className=" cursor-pointer"
                    >
                        <ChevronLeftIcon className="!h-5 !w-5 text-[#4A4C56] " />
                    </Button>

                    <div className="flex w-full justify-start xl:justify-center overflow-x-auto">
                        {weekDates.map((date, index) => {
                            const dateIso = formatDateLocal(date);
                            const datePart = dateIso.slice(0, 10);
                            const isSelected = selectedDate.slice(0, 10) === datePart;

                            return (
                                <div key={index} className="flex-none flex flex-col items-center min-w-[72px]">
                                    <button
                                        onClick={() => handleDateSelect(date)}
                                        className={`px-3 py-2 cursor-pointer rounded-xl flex flex-col items-center transition-colors ${isSelected
                                            ? 'bg-[#f1c27d] text-white'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-foreground'}`}>
                                            {date.getDate()}
                                        </div>
                                        <div className={`text-sm ${isSelected ? 'text-white' : 'text-muted-foreground'}`}>
                                            {dayNames[index]}
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextWeek}
                        className="cursor-pointer"
                    >
                        <ChevronRightIcon className="!h-5 !w-5 text-[#4A4C56]" />
                    </Button>
                </div>
            </div>

            <div className='my-5'>
                <MySchedule scheduleData={filteredSchedule} />
            </div>
        </div>
    );
}
