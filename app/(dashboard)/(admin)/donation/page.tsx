import React from 'react'
import DonationManagement from '../../_components/Admin/DonationManagement'

export default function DonationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Donation Management</h1>
        <p className="text-[#777980] mt-1 text-sm">Manage donation campaigns and track contributions.</p>
      </div>
      
      <DonationManagement />
    </div>
  )
}
