'use client'
import React, { useState } from 'react'
import FinancialReportsCard from '@/app/(dashboard)/_components/Admin/Report/FinancialReportsCard'
// import TableTransactions from '@/app/(dashboard)/_components/Admin/TableTransactions'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReportFilter from '@/app/(dashboard)/_components/Admin/Report/ReportFilter'
import CourseProgressCard from '@/app/(dashboard)/_components/Admin/Report/CourseProgressCard'
import PaymentsCard from '@/app/(dashboard)/_components/Admin/Report/PaymentsCard'
import EnrollmentCard from '@/app/(dashboard)/_components/Admin/Report/EnrollmentCard'
import { useSearchParams } from 'next/navigation'

export default function ReportsPage() {
    const searchParams = useSearchParams()
    const initialTab = searchParams.get('tab') || 'website-usage'
    const [activeTab, setActiveTab] = useState(initialTab || 'website-usage')

    
    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        const params = new URLSearchParams(window.location.search)
        params.set('tab', tab)
        window.history.replaceState(null, '', `?${params.toString()}`)
    }


    return (
        <>
            {/* Header */}
            <div className='flex items-center flex-col md:flex-row gap-4 justify-between mb-5'>
                <div className='flex flex-col gap-1'>
                    <h2 className='text-xl font-semibold text-gray-900'>Reports & Analytics</h2>
                    <p className='text-sm text-[#777980]'>Comprehensive insights into your educational platform.</p>
                </div>
                <Button
                    variant="outline"
                    className="border-gray-300 cursor-pointer py-5 bg-[#0F2598] hover:bg-[#0F2598]/90 text-white hover:text-white transition-all duration-300"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export Reports
                </Button>
            </div>
            <div >
                {/* Filter Tabs */}
                <ReportFilter activeTab={activeTab} onTabChange={handleTabChange} />

                              {/* card content */}
                {activeTab === 'website-usage' && (
                    <FinancialReportsCard />
                )}  
                {activeTab === 'course-progress' && (
                    <CourseProgressCard />
                )}  
                {activeTab === 'payments' && (
                    <PaymentsCard />
                )}  
                {activeTab === 'enrollment' && (
                    <EnrollmentCard />
                )}  
  
                
                {/* <TableTransactions /> */}
            </div>

        </>
    )
}
