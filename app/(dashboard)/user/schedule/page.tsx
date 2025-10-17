'use client'
import React, { useEffect, useState } from 'react'
import CalanderStudent from '@/app/_components/Student/CalanderStudent'
import SchedulePage from '@/components/Shared/Calander/SchedulePage'
import { transformCalendarEventToScheduleItem } from '@/lib/calendarUtils'
import { useGetAllStudentScheduleQuery, useGetSingleStudentScheduleQuery } from '@/rtk/api/users/scheduleApis'
import EventDetailModal from '@/app/_components/Admin/Calendar/EventDetailModal'
import { SimpleCalendarLoadingShimmer } from '@/components/Resuable/CalendarLoadingShimmer'

type ScheduleItem = {
    id: number;
    task: string;
    subject?: string;
    date: string;
    time?: string;
};

export default function CalendarStudentPage() {

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
    const { data: apiData, isLoading, error } = useGetAllStudentScheduleQuery({
        date: ''
    });

    // Fetch single event details when event is selected
    const { data: singleEventData, isLoading: isLoadingSingleEvent } = useGetSingleStudentScheduleQuery(
        selectedEventId || '',
        {
            skip: !selectedEventId
        }
    );

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
        return <SimpleCalendarLoadingShimmer />
    }
    return (
        <div className='w-full  flex flex-col gap-10 lg:flex-row '>
            <div className=' w-full lg:w-7/12'>
                <CalanderStudent
                    scheduleData={scheduleData}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    onEventClick={handleEventClick}
                />
            </div>
            <div className=' w-full lg:w-5/12'>
                <SchedulePage
                    title='Task Categories Overview'
                    scheduleData={scheduleData} showAllCategories={true} selectedDate={selectedDate} onDateChange={handleDateChange}
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
