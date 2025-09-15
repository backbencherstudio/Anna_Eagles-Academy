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
    email: string
    createdDate: string
}

// Sample data for card history
const sampleCardHistory: CardHistoryItem[] = [
    {
        id: '1',
        type: 'Type',
        recipient: 'John Doe',
        email: 'test@gmail.com',
        createdDate: '2024-01-15'
    },
    {
        id: '2',
        type: 'Thank You',
        recipient: 'Jane Smith',
        email: 'test@gmail.com',
        createdDate: '2024-01-14'
    },
    {
        id: '3',
        type: 'Congratulations',
        recipient: 'Mike Johnson',
        email: 'test@gmail.com',
        createdDate: '2024-01-13'
    },
    {
        id: '4',
        type: 'Birthday',
        recipient: 'Jane Smith',
        email: 'test@gmail.com',
        createdDate: '2024-01-13'
    }
]

// Table headers for card history
const tableHeaders = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'recipient', label: 'Recipient', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'createdDate', label: 'Created Date', sortable: true },
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
        ...item
    }))

    // Define table actions
    const tableActions = [
        {
            label: 'Download',
            icon: <Download className="h-4 w-4 mr-2" />,
            onClick: (item: CardHistoryItem) => {
                console.log('Downloading card:', item.id)
                // Add your download logic here
                // For example: downloadCard(item.id)
            }
        },
        {
            label: 'Print',
            icon: <Printer className="h-4 w-4 mr-2" />,
            onClick: (item: CardHistoryItem) => {
                console.log('Printing card:', item.id)
                // Add your print logic here
                // For example: printCard(item.id)
            }
        }
    ]

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Generated Cards</h2>
            <p className="text-gray-600 text-sm mb-6">History of all generated cards</p>

            <ReusableTable
                headers={tableHeaders}
                data={transformedHistoryData}
                actions={tableActions}
                showPagination={true}
                itemsPerPage={5}
                itemsPerPageOptions={[5, 10, 15, 20]}
                isLoading={loading}
            />
        </div>
    )
}
