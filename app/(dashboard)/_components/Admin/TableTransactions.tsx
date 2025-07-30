'use client'
import React, { useState, useMemo } from 'react'
import { Input } from "@/components/ui/input"
import { Search, Download, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import ReusableTable from "@/components/Resuable/ReusableTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock transaction data
const mockTransactions = [
    { id: 1, no: 1, date: "May 20, 2025", userName: "Olivia Brown", amount: "$21.00", type: "Course Fee", status: "Completed" },
    { id: 2, no: 2, date: "May 5, 2025", userName: "Liam Johnson", amount: "$33.00", type: "Course Fee", status: "Completed" },
    { id: 3, no: 3, date: "May 15, 2025", userName: "Noah Davis", amount: "$76.00", type: "Course Fee", status: "Completed" },
    { id: 4, no: 4, date: "May 10, 2025", userName: "James Anderson", amount: "$62.00", type: "Course Fee", status: "Completed" },
    { id: 5, no: 5, date: "May 12, 2025", userName: "Ava Wilson", amount: "$54.00", type: "Course Fee", status: "Completed" },
    { id: 6, no: 6, date: "May 8, 2025", userName: "Emily Carter", amount: "$89.00", type: "Course Fee", status: "Completed" },
    { id: 7, no: 7, date: "May 18, 2025", userName: "Michael Thompson", amount: "$37.00", type: "Course Fee", status: "Completed" },
    { id: 8, no: 8, date: "May 22, 2025", userName: "Sophia Martinez", amount: "$45.00", type: "Course Fee", status: "Completed" },
    { id: 9, no: 9, date: "May 25, 2025", userName: "William Garcia", amount: "$67.00", type: "Course Fee", status: "Completed" },
    { id: 10, no: 10, date: "May 28, 2025", userName: "Isabella Rodriguez", amount: "$92.00", type: "Course Fee", status: "Completed" },
    { id: 11, no: 11, date: "May 30, 2025", userName: "Ethan Lee", amount: "$28.00", type: "Course Fee", status: "Completed" },
    { id: 12, no: 12, date: "June 2, 2025", userName: "Mia Hernandez", amount: "$73.00", type: "Course Fee", status: "Completed" },
    { id: 13, no: 13, date: "June 5, 2025", userName: "Alexander Gonzalez", amount: "$41.00", type: "Course Fee", status: "Completed" },
    { id: 14, no: 14, date: "June 8, 2025", userName: "Charlotte Perez", amount: "$85.00", type: "Course Fee", status: "Completed" },
    { id: 15, no: 15, date: "June 10, 2025", userName: "Daniel Torres", amount: "$59.00", type: "Course Fee", status: "Completed" },
]

export default function TableTransactions() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTransactions, setSelectedTransactions] = useState<any[]>([])

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm) return mockTransactions

        return mockTransactions.filter(transaction =>
            transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.amount.includes(searchTerm) ||
            transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm])

    // Handle export invoice
    const handleExportInvoice = (transaction: any) => {
        // In a real application, this would generate and download an invoice PDF
        console.log(`Exporting invoice for transaction ID: ${transaction.id}, User: ${transaction.userName}`)
        alert(`Invoice exported for ${transaction.userName} - ${transaction.amount}`)
    }



    // Table headers
    const headers = [
        { key: 'no', label: 'No', sortable: true },
        { key: 'date', label: 'Date', sortable: true },
        { key: 'userName', label: 'User Name', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ]

    // Table actions
    const actions = [
        // {
        //     label: 'View Details',
        //     icon: <Search className="h-4 w-4 mr-2" />,
        //     onClick: handleViewDetails,
        //     variant: 'default' as const
        // },
        {
            label: 'Export Invoice',
            icon: <Download className="h-4 w-4 mr-2" />,
            onClick: handleExportInvoice,
            variant: 'default' as const
        }
        // {
        //     label: 'Delete Transaction',
        //     icon: <Trash2 className="h-4 w-4 mr-2" />,
        //     onClick: handleDeleteTransaction,
        //     variant: 'destructive' as const
        // }
    ]

    return (
        <div className="w-full border border-gray-200 rounded-lg p-4 ">
            <div className="flex flex-col lg:flex-row justify-between  sm:items-center gap-4 mb-5">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold">Table of Transactions</h1>
                    {selectedTransactions.length > 0 && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {selectedTransactions.length} selected
                        </span>
                    )}
                </div>

                <div className='flex items-center flex-col sm:flex-row gap-4'>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full sm:w-64"
                        />
                    </div>
                    {/* Sort By Dropdown */}
                    <Select >
                        <SelectTrigger className="w-fit border-gray-300 rounded-md">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <ChevronUp className="h-3 w-3 text-gray-400" />
                                    <ChevronDown className="h-3 w-3 text-gray-400" />
                                </div>
                                <SelectValue placeholder="Sort By" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">A - Z</SelectItem>
                            <SelectItem value="email">Z - A</SelectItem>
                            <SelectItem value="completion">Oldest</SelectItem>
                            <SelectItem value="assignments">Newest</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
            </div>
            <ReusableTable
                headers={headers}
                data={filteredData}
                actions={actions}
                itemsPerPage={10}
                itemsPerPageOptions={[5, 10, 15, 20]}
                showPagination={true}
                showCheckbox={true}
                selectedItems={selectedTransactions}
                onSelectionChange={setSelectedTransactions}
            />
        </div>
    )
}
