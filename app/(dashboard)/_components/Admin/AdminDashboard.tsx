import React from 'react'
import DashboardCard from './DashboardCard'
import RevenueGrowthPage from './RevenueGrowth'
import ScheduleCalander from './ScheduleCalander'
import AssignmentOverviewDashaboard from './AssignmentOverviewDashaboard'

export default function AdminDashboard() {
  return (
    <div className='flex flex-col gap-7 mb-10 '>
      <DashboardCard />
      <RevenueGrowthPage />
      <div className='flex flex-col lg:flex-row gap-7'>
        <div className='w-full lg:w-7/12'>
          <ScheduleCalander />
        </div>
        <div className='w-full lg:w-5/12'>
          <AssignmentOverviewDashaboard />
        </div>
      </div>
    </div>
  )
}
