import ScheduleShimmerEffect from '@/app/_components/Admin/Report/ShimmerEffect/ScheduleShimmerEffect';
import React from 'react';

interface ScheduleItem {
    id: number;
    task: string;
    subject: string;
    date: string;
    time: string;
}

interface MyScheduleProps {
    scheduleData: ScheduleItem[];
    isLoading?: boolean;
}

const TIME_SLOTS = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM',
    '10:00 PM',
    '11:00 PM',


];

const parseTime = (timeStr: string) => {
    if (!timeStr || typeof timeStr !== 'string') {
        return 0;
    }
    const [time, modifier] = timeStr.split(' ');
    if (!time || !modifier) {
        return 0;
    }
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

const MySchedule: React.FC<MyScheduleProps> = ({ scheduleData, isLoading = false }) => {

    const slotTaskMap: Record<string, { task: ScheduleItem; isFirst: boolean; isLast: boolean } | null> = {};
    TIME_SLOTS.forEach((slot) => {
        slotTaskMap[slot] = null;
        for (const task of scheduleData) {
            if (!task.time || typeof task.time !== 'string') {
                continue;
            }
            const timeParts = task.time.split(' - ');
            if (timeParts.length !== 2) {
                continue;
            }
            const [start, end] = timeParts;
            const slotTime = parseTime(slot);
            const startTime = parseTime(start);
            const endTime = parseTime(end);
            // Only color the start time slot, not the entire range
            if (slotTime === startTime) {
                slotTaskMap[slot] = {
                    task,
                    isFirst: true,
                    isLast: slotTime === endTime,
                };
                break;
            }
        }
    });

    if (isLoading) {
        return <ScheduleShimmerEffect />;
    }

    return (
        <div className=' border border-[#ECEFF3] bg-white rounded-2xl p-6 font-spline-sans'>
            <h3 className='text-[#1D1F2C] font-bold text-xl lg:text-xl pb-4 sticky top-0 bg-white z-10'>My Schedule</h3>

            <div className='max-h-[500px] overflow-y-auto'>

                {TIME_SLOTS.map((slot, idx) => {
                    const slotInfo = slotTaskMap[slot];

                    const bgClass = slotInfo ? 'bg-[#FFF7ED]' : 'bg-[#F7F8FA]';
                    const roundedClass = 'rounded-2xl';

                    return (
                        <div key={slot} className={`flex items-stretch gap-4 mb-3`}>
                            {/* Time column - LEFT SIDE */}
                            <div className='w-[90px] text-[#F5A623] font-bold min-h-[48px] flex items-center'>
                                {slot}
                            </div>

                            {/* Slot box */}
                            <div className={`min-h-[48px] flex flex-col justify-center w-full p-4 ${bgClass} ${roundedClass}`}>
                                {slotInfo ? (
                                    <>
                                        <div className='text-[#E6A23C] font-semibold text-[16px]'>
                                            {slotInfo.task.subject}
                                        </div>
                                        <div className='text-[#E6A23C] font-bold'>
                                            {slotInfo.task.task}
                                        </div>
                                        <div className='text-[#E6A23C] font-normal text-[13px]'>
                                            {slotInfo.task.time}
                                        </div>
                                    </>
                                ) : (
                                    <div className='text-[#A0A6AD] text-center'>N/A</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default MySchedule;
