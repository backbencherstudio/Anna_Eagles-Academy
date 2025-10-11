import React from 'react'

export default function ScheduleShimmerEffect() {
  const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM',
    '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM'
  ];

  return (
    <div className='max-h-[900px] border border-[#ECEFF3] bg-white rounded-2xl p-6 overflow-y-auto font-spline-sans'>
      {/* Title skeleton */}
      <div className='h-7 bg-gray-200 rounded animate-pulse w-32 pb-4 sticky top-0 bg-white z-10'></div>
      
      {/* Schedule slots skeleton */}
      {TIME_SLOTS.map((slot, idx) => (
        <div key={slot} className={`flex items-stretch gap-4 mb-3`}>
          {/* Time column skeleton */}
          <div className='w-[90px] min-h-[48px] flex items-center'>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>

          {/* Slot box skeleton */}
          <div className={`min-h-[48px] flex flex-col justify-center w-full p-4 bg-[#F7F8FA] rounded-2xl`}>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
