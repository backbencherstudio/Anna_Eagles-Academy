import React from 'react';
import { MdMenuBook, MdCheck } from 'react-icons/md';

// Example task data
const tasks = [
    { title: 'Learn a new parts', subject: 'Christian Theology', teacher: 'Ms. Gynda', done: true },
    { title: 'Learn a new parts', subject: 'Christian Theology', teacher: 'Ms. Gynda', done: true },
    { title: 'Learn a new parts', subject: 'Christian Theology', teacher: 'Ms. Gynda', done: false },
    { title: 'Learn a new parts', subject: 'Christian Theology', teacher: 'Ms. Gynda', done: false },
];

function TaskCard({ task }: { task: typeof tasks[0] }) {
    return (
        <div
            className={`flex items-center gap-4 p-4 rounded-xl border transition mb-4 ${task.done ? 'border-[#F1C27D] bg-white' : 'border-[#F1C27D]/20 bg-[#FCFCFC]'
                }`}
        >
            <div className="bg-[#FFF3E0] rounded-lg p-2 flex items-center justify-center">
                <MdMenuBook className="text-[#F1C27D] text-2xl" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-[16px] text-[#1D1F2C]">{task.title}</div>
                <div className="flex items-center gap-2 text-xs text-[#A0A3BD] mt-1">
                    <span>{task.subject}</span>
                    <span className="w-1 h-1 bg-[#A0A3BD] rounded-full inline-block" />
                    <span>{task.teacher}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span
                    className={`w-5 h-5 flex items-center justify-center rounded border shadow transition select-none
                        ${task.done ? 'border-[#F1C27D] bg-white' : 'border-[#D9D9D9] bg-white'}`}
                    style={{ pointerEvents: 'none' }}
                >
                    {task.done && (
                        <MdCheck className="text-[#F1C27D] text-lg" />
                    )}
                </span>
                <span className={`font-medium text-[15px] ${task.done ? 'text-[#1D1F2C]' : 'text-[#1D1F2C]'}`}>Done</span>
            </div>
        </div>
    );
}

export default function TodayTask() {
    return (
        <div>
            <div className="font-semibold text-lg mb-6 text-[#1D1F2C]">Today's Task</div>
            {tasks.map((task, idx) => (
                <TaskCard key={idx} task={task} />
            ))}
        </div>
    );
}
