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
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'
  
   
];

const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

const MySchedule: React.FC<MyScheduleProps> = ({ scheduleData }) => {
    // Assume scheduleData is already filtered for the correct date
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
                    isLast: slotTime === endTime
                };
                break;
            }
        }
    });

    return (
        <div className='h-fit' style={{ background: '#fff', borderRadius: 16, padding: 24,  overflowY: 'auto' }}>
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>My Schedule</h3>
            {TIME_SLOTS.map((slot, idx) => {
                const slotInfo = slotTaskMap[slot];
                const slotBg = slotInfo ? '#FFF7ED' : '#F7F8FA';
                let marginBottom = 12;
                if (slotInfo && idx < TIME_SLOTS.length - 1) {
                    const nextSlot = TIME_SLOTS[idx + 1];
                    const nextSlotInfo = slotTaskMap[nextSlot];
                    if (nextSlotInfo && slotInfo.task.id === nextSlotInfo.task.id) {
                        marginBottom = 0;
                    }
                }
                return (
                    <div
                        key={slot}
                        style={{
                            background: slotBg,
                            borderRadius: 16,
                            padding: 20,
                            marginBottom,
                            minHeight: 60,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <div style={{ color: '#8A8A8A', fontWeight: 500 }}>{slot}</div>
                        {slotInfo && slotInfo.isFirst ? (
                            <>
                                <div style={{ color: '#E6A23C', fontWeight: 600, fontSize: 16 }}>{slotInfo.task.subject}</div>
                                <div style={{ color: '#E6A23C', fontWeight: 700 }}>{slotInfo.task.task}</div>
                                <div style={{ color: '#E6A23C', fontWeight: 400, fontSize: 13 }}>{slotInfo.task.time}</div>
                            </>
                        ) : slotInfo && slotInfo.isLast ? (
                            <div style={{ color: '#E6A23C', fontWeight: 400, fontSize: 13 }}>Ends: {slot}</div>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
};

export default MySchedule;
