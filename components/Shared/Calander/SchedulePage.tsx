'use client'
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import CategoriesOverview from '@/components/Shared/Calander/CategoriesOverview';



interface ScheduleItem {
  id: number;
  task: string;
  subject?: string;
  date: string;
  time?: string;
}

function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface CalanderPageProps {
  // scheduleData: ScheduleItem[];
  initialSelectedDate?: string;
  title?: string;
  scheduleData: ScheduleItem[];
  showAllCategories?: boolean;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

export default function SchedulePage({ initialSelectedDate, title, scheduleData, showAllCategories = true, selectedDate: externalSelectedDate, onDateChange }: CalanderPageProps) {

  const [internalSelectedDate, setInternalSelectedDate] = useState<string>(initialSelectedDate || '');
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);

  // Use external selected date if provided, otherwise use internal state
  const selectedDate = externalSelectedDate ? formatDateLocal(externalSelectedDate) : internalSelectedDate;

  useEffect(() => {
    if (externalSelectedDate) {
      setInternalSelectedDate(formatDateLocal(externalSelectedDate));
      setCalendarDate(externalSelectedDate);
    } else if (!internalSelectedDate) {
      const today = new Date();
      setInternalSelectedDate(formatDateLocal(today));
      setCalendarDate(today);
    }
  }, [externalSelectedDate, internalSelectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCalendarDate(date);
      const formattedDate = formatDateLocal(date);
      setInternalSelectedDate(formattedDate);

      // Emit date change to parent if callback provided
      if (onDateChange) {
        onDateChange(date);
      }
    }
  };

  const filteredSchedule = scheduleData?.filter((item: ScheduleItem) => item.date === selectedDate) || [];

  return (
    <div className="rounded-2xl h-full flex flex-col">
      <div className='bg-white rounded-2xl overflow-hidden flex-shrink-0'>
        <Calendar
          mode="single"
          selected={calendarDate}
          onSelect={handleDateSelect}
          className="border-none w-full bg-white"
        />
      </div>
      <div className="mt-6 flex-1">
        <CategoriesOverview
          scheduleData={filteredSchedule as any[]}
          title={showAllCategories ? 'Overview' : title}
        />
      </div>
    </div>
  );
}
