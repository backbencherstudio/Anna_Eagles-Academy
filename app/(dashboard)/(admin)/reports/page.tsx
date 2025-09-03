import React from 'react'
import FinancialReportsCard from '@/app/(dashboard)/_components/Admin/FinancialReportsCard'
import TableTransactions from '@/app/(dashboard)/_components/Admin/TableTransactions'

export default function ReportsPage() {
    return (
        <div className='flex flex-col gap-10 bg-white rounded-lg p-4 border border-gray-100'>
            <FinancialReportsCard />
            <TableTransactions />
        </div>
    )
}
