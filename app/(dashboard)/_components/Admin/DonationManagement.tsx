'use client'

import React, { useState, useEffect } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

// Data type definition
interface DonationItem {
    id: string
    donorName: string
    emailAddress: string
    frequency: 'One Time' | 'Monthly'
    type: string
    amount: string
    date: string
    comment: string
    status: 'Pending' | 'Completed'
}

// Sample data declaration
const sampleDonationData: DonationItem[] = [
    {
        id: '1',
        donorName: 'Sarah Johnson',
        emailAddress: 'nevaeh.simmons@example.com',
        frequency: 'One Time',
        type: 'Sponsor a Student',
        amount: '$250',
        date: '2024-07-15',
        comment: 'Happy to support education...',
        status: 'Pending'
    },
    {
        id: '2',
        donorName: 'Robert Fox',
        emailAddress: 'deanna.curtis@example.com',
        frequency: 'Monthly',
        type: 'Ministry Needs',
        amount: '$500',
        date: '2024-07-15',
        comment: 'For the glory of God and adv...',
        status: 'Completed'
    },
    {
        id: '3',
        donorName: 'Cameron Williamson',
        emailAddress: 'kenzi.lawson@example.com',
        frequency: 'Monthly',
        type: 'Personal Donation',
        amount: '$1000',
        date: '2024-07-15',
        comment: 'May this help build a better f...',
        status: 'Completed'
    },
    {
        id: '4',
        donorName: 'Wade Warren',
        emailAddress: 'bill.sanders@example.com',
        frequency: 'One Time',
        type: 'Project Funds',
        amount: '$2000',
        date: '2024-07-15',
        comment: 'Happy to support education...',
        status: 'Pending'
    }
]

// Table headers configuration
const tableHeaders = [
    {
        key: 'donorName',
        label: 'DONER NAME',
        sortable: true
    },
    {
        key: 'emailAddress',
        label: 'EMAIL ADDRESS',
        sortable: true
    },
    {
        key: 'frequency',
        label: 'FREQUENCY',
        sortable: true
    },
    {
        key: 'type',
        label: 'TYPE',
        sortable: true
    },
    {
        key: 'amount',
        label: 'AMOUNT',
        sortable: true
    },
    {
        key: 'date',
        label: 'DATE',
        sortable: true
    },
    {
        key: 'comment',
        label: 'COMMENT',
        sortable: true
    },
    {
        key: 'status',
        label: 'STATUS',
        sortable: true
    }
]

export default function DonationManagement() {
    const [donationData, setDonationData] = useState<DonationItem[]>([])
    const [filteredData, setFilteredData] = useState<DonationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState<string>('')

    useEffect(() => {
        const fetchDonationData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                setDonationData(sampleDonationData)
                setFilteredData(sampleDonationData)
            } catch (error) {
                console.error('Error fetching donation data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDonationData()
    }, [])

    useEffect(() => {
        let filtered = donationData

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(item =>
                item.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.comment.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredData(filtered)
    }, [searchTerm, donationData])

    const transformedData = filteredData.map(item => ({
        ...item,
        frequency: (
            <span className={`px-3 py-1 text-sm rounded  ${item.frequency === 'One Time'
                ? 'bg-[#E6F0FF] text-[#0065FF]'
                : 'bg-[#EFCEFF] text-[#AD0AFD]'
                }`}>
                {item.frequency}
            </span>
        ),
        status: (
            <span className={`px-3 py-1 text-sm rounded  ${item.status === 'Completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
                }`}>
                {item.status}
            </span>
        ),
        comment: (
            <span className="text-gray-600 truncate max-w-[200px] block">
                {item.comment}
            </span>
        )
    }))



    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-base font-semibold text-[#1D1F2C]">Track and manage donation history</h1>

                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search donations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <ReusableTable
                    headers={tableHeaders}
                    data={transformedData}
                    showPagination={true}
                    itemsPerPage={5}
                    itemsPerPageOptions={[5, 10, 15, 20]}
                    isLoading={loading}
                />
            </div>

            {/* Empty state */}
            {filteredData.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No donations found</p>
                </div>
            )}
        </div>
    )
}
