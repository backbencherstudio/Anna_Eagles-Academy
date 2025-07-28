import React from 'react'
import DashboardCard from './DashboardCard'
import RevenueGrowthPage from './RevenueGrowth'

export default function AdminDashboard() {
  return (
    <div className='flex flex-col gap-7'>
      <DashboardCard />
      <RevenueGrowthPage />
    </div>
  )
}
