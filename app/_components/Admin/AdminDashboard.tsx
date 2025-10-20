'use client'
import React, { useState } from 'react'
import DashboardCard from './DashboardCard'
import RevenueGrowthPage from './RevenueGrowth'
import ScheduleCalander from './ScheduleCalander'
import AssignmentOverviewDashaboard from './AssignmentOverviewDashaboard'
import { useGetAllDataForMainDashboardQuery } from '@/rtk/api/admin/mainDashboardApis'

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const { data: dashboardData, refetch, isLoading } = useGetAllDataForMainDashboardQuery({
    period: selectedPeriod
  });

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleReload = () => {
    refetch();
  };

  return (
    <div className='flex flex-col gap-7 mb-10 '>
      <DashboardCard
        dashboardStats={dashboardData?.data?.dashboardStats}
        isLoading={isLoading}
      />
      <RevenueGrowthPage
        revenueGrowth={dashboardData?.data?.revenueGrowth}
        onPeriodChange={handlePeriodChange}
        onReload={handleReload}
        isLoading={isLoading}
      />


      {/* card section */}
      <div className='flex flex-col lg:flex-row gap-7 items-stretch'>

        {/* schedule calander left side */}
        <div className='w-full lg:w-7/12 flex flex-col'>
          <ScheduleCalander scheduleEvents={dashboardData?.data?.scheduleEvents} isLoading={isLoading} />
        </div>

        {/* assignment overview right side */}
        <div className='w-full lg:w-5/12 flex flex-col'>
          <AssignmentOverviewDashaboard 
            assignments={dashboardData?.data?.assignment}
            quizzes={dashboardData?.data?.quiz}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
