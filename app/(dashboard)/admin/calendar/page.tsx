'use client'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CalanderAdmin from '@/app/_components/Admin/CalanderAdmin'
import AddEventModal from '@/app/_components/Admin/Calendar/AddEventModal'
import EventDetailModal from '@/app/_components/Admin/Calendar/EventDetailModal'
import ButtonSpring from '@/components/Resuable/ButtonSpring'
import SchedulePage from '@/components/Shared/Calander/SchedulePage'
import { useGetAllCalendarSchedulesQuery, useGetSingleCalendarScheduleQuery } from '@/rtk/api/admin/calendarSehedulesApis'
import { transformCalendarEventToScheduleItem } from '@/lib/calendarUtils'

interface ScheduleItem {
    id: number;
    task: string;
    subject?: string;
    date: string;
    time?: string;
    originalEvent?: any;
    uniqueId?: string;
}

export default function CalendarPageAdmin() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [opening, setOpening] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    });
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    // Fetch calendar schedules from API - fetch all events initially
    const { data: apiData, isLoading, error } = useGetAllCalendarSchedulesQuery({
        date: ''
    });

    // Fetch single calendar schedule details when event is selected
    const { data: singleEventData, isLoading: isLoadingSingleEvent } = useGetSingleCalendarScheduleQuery(
        selectedEventId || '',
        {
            skip: !selectedEventId
        }
    );

    const handleOpenModal = () => {
        setOpening(true)
        setTimeout(() => {
            setIsModalOpen(true)
            setOpening(false)
        }, 100)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    }

    const handleEventClick = (event: any) => {
        setSelectedEvent(event);
        setSelectedEventId(event.id?.toString() || null);
        setIsEventModalOpen(true);
    }

    const handleCloseEventModal = () => {
        setIsEventModalOpen(false);
        setSelectedEvent(null);
        setSelectedEventId(null);
    }

    // Transform API data when it changes
    useEffect(() => {
        if (apiData?.data?.events) {
            const transformedEvents = apiData.data.events.map((event: any, index: number) =>
                transformCalendarEventToScheduleItem(event, index)
            );
            setScheduleData(transformedEvents);
        }
    }, [apiData]);

    // Loading state
    if (isLoading) {
        return (
            <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch'>
                <div className='lg:col-span-2 flex flex-col'>
                    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center h-full">
                        <div className="text-gray-500">Loading calendar data...</div>
                    </div>
                </div>
                <div className='lg:col-span-1 flex flex-col'>
                    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center h-full">
                        <div className="text-gray-500">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch'>
                <div className='lg:col-span-2 flex flex-col'>
                    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center h-full">
                        <div className="text-red-500">Error loading calendar data</div>
                    </div>
                </div>
                <div className='lg:col-span-1 flex flex-col'>
                    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center h-full">
                        <div className="text-red-500">Error loading data</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch'>

            {/* schedule calander left side */}
            <div className='lg:col-span-2 flex flex-col'>
                <CalanderAdmin
                    scheduleData={scheduleData}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    onEventClick={handleEventClick}
                />
            </div>

            {/* add event and schedule page right side */}
            <div className='lg:col-span-1 flex flex-col'>
                <Button
                    className='w-full py-5 cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/80 disabled:opacity-70 disabled:cursor-not-allowed'
                    onClick={handleOpenModal}
                    disabled={opening}
                >
                    {opening ? (
                        <span className='flex items-center gap-2 w-full justify-center'>
                            <ButtonSpring size={18} color='#ffffff' />
                            <span>loading...</span>
                        </span>
                    ) : (
                        <>
                            <span className='bg-white/30 rounded-full p-1'>
                                <Plus />
                            </span>
                            Add Event
                        </>
                    )}
                </Button>

                {/* schedule page */}
                <div className='mt-4'>
                    <SchedulePage title='Overview' scheduleData={scheduleData} showAllCategories={true} selectedDate={selectedDate} onDateChange={handleDateChange} />
                </div>
                {/* Modal */}
                <AddEventModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            </div>

            {/* Event Detail Modal */}
            {isEventModalOpen && (singleEventData?.data || selectedEvent) && (
                <EventDetailModal
                    event={singleEventData?.data || selectedEvent}
                    isOpen={isEventModalOpen}
                    onClose={handleCloseEventModal}
                    isLoading={isLoadingSingleEvent}
                />
            )}
        </div>
    )
}
