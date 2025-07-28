'use client'

import React, { useState, useEffect } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import ResuablePagination from '@/components/Resuable/ResuablePagination'
import { Download, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'

interface User {
    id: number
    fullName: string
    email: string
    avatar: string
    completionStatus: number
    submittedAssignments: number
    enrollmentStatus: string
}

export default function UserManagementPage() {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [sortKey, setSortKey] = useState<string>('')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('')

    useEffect(() => {
        // Load data from UserManagement.json
        const loadUsers = async () => {
            try {
                const response = await fetch('/data/UserManagement.json')
                const data = await response.json()
                setUsers(data)
            } catch (error) {
                console.error('Error loading users:', error)
            }
        }
        loadUsers()
    }, [])

    const headers = [
        { key: 'fullName', label: 'Full Name' },
        { key: 'email', label: 'Email Address', sortable: true },
        { key: 'completionStatus', label: 'Completion Status', sortable: true },
        { key: 'submittedAssignments', label: 'Submitted Assignments', sortable: true },
        { key: 'enrollmentStatus', label: 'Enrollment Status' }
    ]

    const actions = [
        {
            label: 'Download Details',
            icon: <Download className="mr-2 h-4 w-4" />,
            onClick: (user: User) => {
                console.log('Download details for:', user.fullName)
                // Implement download functionality
            }
        },
        {
            label: 'Delete User',
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            onClick: (user: User) => {
                console.log('Delete user:', user.fullName)
                // Implement delete functionality
            },
            variant: 'destructive' as const
        }
    ]

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDirection('asc')
        }
    }

    const sortedUsers = [...users].sort((a, b) => {
        if (!sortKey) return 0

        const aValue = a[sortKey as keyof User]
        const bValue = b[sortKey as keyof User]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue)
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }

        return 0
    })

    const totalItems = sortedUsers.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentUsers = sortedUsers.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1)
    }

    const handleSendEmailNotification = () => {
        router.push('/email-notification')
        // Implement email notification functionality
    }

    return (
        <div className="bg-white rounded-xl p-4">

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Student Roster</h1>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    {/* Search Field */}
                    <div className="relative w-full sm:w-48 lg:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for a Student"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-gray-300 rounded-md w-full"
                        />
                    </div>

                    {/* Sort By Dropdown */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-fit border-gray-300 rounded-md">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <ChevronUp className="h-3 w-3 text-gray-400" />
                                    <ChevronDown className="h-3 w-3 text-gray-400" />
                                </div>
                                <SelectValue placeholder="Sort By" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="completion">Completion</SelectItem>
                            <SelectItem value="assignments">Assignments</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Send Email Notification Button */}
                    <Button
                        onClick={handleSendEmailNotification}
                        className="bg-[#F1C27D] hover:bg-[#F1C27D]/80 cursor-pointer text-white rounded-md px-3 sm:px-4 py-2 w-full sm:w-auto text-sm sm:text-base"
                    >
                        Send Email Notification
                    </Button>
                </div>
            </div>

            <CardContent className="p-0">
                <ReusableTable
                    headers={headers}
                    data={currentUsers}
                    actions={actions}
                    onSort={handleSort}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                />

                <ResuablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            </CardContent>

        </div>
    )
}
