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
}

const TIME_SLOTS = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
];

const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

const MySchedule: React.FC<MyScheduleProps> = ({ scheduleData }) => {

    const slotTaskMap: Record<string, { task: ScheduleItem; isFirst: boolean; isLast: boolean } | null> = {};
    TIME_SLOTS.forEach((slot) => {
        slotTaskMap[slot] = null;
        for (const task of scheduleData) {
            const [start, end] = task.time.split(' - ');
            const slotTime = parseTime(slot);
            const startTime = parseTime(start);
            const endTime = parseTime(end);
            if (slotTime >= startTime && slotTime <= endTime) {
                slotTaskMap[slot] = {
                    task,
                    isFirst: slotTime === startTime,
                    isLast: slotTime === endTime,
                };
                break;
            }
        }
    });

    return (
        <div className='h-fit border border-[#ECEFF3] bg-white rounded-2xl p-6 overflow-y-auto font-spline-sans'>
            <h3 className='text-[#1D1F2C] font-bold text-xl lg:text-2xl pb-4 font-spline-sans'>My Schedule</h3>
            {TIME_SLOTS.map((slot, idx) => {
                const slotInfo = slotTaskMap[slot];


                let marginBottom = 12;
                if (slotInfo && idx < TIME_SLOTS.length - 1) {
                    const nextSlot = TIME_SLOTS[idx + 1];
                    const nextSlotInfo = slotTaskMap[nextSlot];
                    if (nextSlotInfo && slotInfo.task.id === nextSlotInfo.task.id) {
                        marginBottom = 0;
                    }
                }


                const isMiddleSegment = !!(slotInfo && !slotInfo.isFirst && !slotInfo.isLast);
                const bgClass = slotInfo ? 'bg-[#FFF7ED]' : 'bg-[#F7F8FA]';
                const roundedClass = slotInfo
                    ? slotInfo.isFirst && slotInfo.isLast
                        ? 'rounded-2xl'
                        : slotInfo.isFirst
                            ? 'rounded-t-2xl'
                            : slotInfo.isLast
                                ? 'rounded-b-2xl'
                                : 'rounded-none'
                    : 'rounded-2xl';

                return (
                    <div key={slot} className={`flex items-stretch gap-4 ${marginBottom === 0 ? 'mb-0' : 'mb-3'}`}>
                        {/* Time column */}
                        <div className='w-[90px] text-[#6B7280]  min-h-[48px] flex items-center'>
                            {slot}
                        </div>

                        {/* Slot box */}
                        <div className={`min-h-[48px] flex flex-col justify-center w-full p-4 ${bgClass} ${roundedClass}`}>
                            {slotInfo ? (
                                slotInfo.isFirst ? (
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
                                ) : isMiddleSegment ? null : (

                                    null
                                )
                            ) : (
                                <div className='text-[#A0A6AD]  text-center'>N/A</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MySchedule;
