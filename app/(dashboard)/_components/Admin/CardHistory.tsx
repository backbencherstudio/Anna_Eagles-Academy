'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'
import ReusableTable from '@/components/Resuable/ReusableTable'

// Data type for card history
interface CardHistoryItem {
    id: string
    type: string
    recipient: string
    sender: 'One Time' | 'Monthly'
    createdDate: string
    status: 'draft' | 'sent'
    downloads: number
}

// Sample data for card history
const sampleCardHistory: CardHistoryItem[] = [
    {
        id: '1',
        type: 'Type',
        recipient: 'John Doe',
        sender: 'One Time',
        createdDate: '2024-01-15',
        status: 'draft',
        downloads: 0
    },
    {
        id: '2',
        type: 'Thank You',
        recipient: 'Jane Smith',
        sender: 'Monthly',
        createdDate: '2024-01-14',
        status: 'sent',
        downloads: 12
    },
    {
        id: '3',
        type: 'Congratulations',
        recipient: 'Mike Johnson',
        sender: 'Monthly',
        createdDate: '2024-01-13',
        status: 'sent',
        downloads: 3
    },
    {
        id: '4',
        type: 'Birthday',
        recipient: 'Jane Smith',
        sender: 'One Time',
        createdDate: '2024-01-13',
        status: 'draft',
        downloads: 0
    }
]

// Table headers for card history
const tableHeaders = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'recipient', label: 'Recipient', sortable: true },
    { key: 'sender', label: 'SENDER', sortable: true },
    { key: 'createdDate', label: 'Created Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'downloads', label: 'Downloads', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
]

export default function CardHistory() {
    const [cardHistory, setCardHistory] = useState<CardHistoryItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCardHistory = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                setCardHistory(sampleCardHistory)
            } catch (error) {
                console.error('Error fetching card history:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCardHistory()
    }, [])

    const transformedHistoryData = cardHistory.map(item => ({
        ...item,
        sender: (
            <span className={`px-3 py-1 text-sm rounded font-medium ${item.sender === 'One Time'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
                }`}>
                {item.sender}
            </span>
        ),
        status: (
            <span className={`px-3 py-1 text-sm rounded font-medium ${item.status === 'sent'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
                }`}>
                {item.status}
            </span>
        ),
        actions: (
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                    <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                    <Printer className="h-4 w-4" />
                </Button>
            </div>
        )
    }))

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Generated Cards</h2>
            <p className="text-gray-600 text-sm mb-6">History of all generated cards</p>
            
            <ReusableTable
                headers={tableHeaders}
                data={transformedHistoryData}
                showPagination={true}
                itemsPerPage={5}
                itemsPerPageOptions={[5, 10, 15, 20]}
                isLoading={loading}
            />
        </div>
    )
}
