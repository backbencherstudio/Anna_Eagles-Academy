"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import TextAreaCustom from '@/components/Resuable/TextAreaCustom'

interface Student {
    id: number
    fullName: string
    email: string
    avatar: string
    completionStatus: number
    submittedAssignments: number
    enrollmentStatus: string
}

export default function EmailNotification() {
    const [students, setStudents] = useState<Student[]>([])
    const [selectedRecipient, setSelectedRecipient] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        // Fetch student data from the JSON file
        const fetchStudents = async () => {
            try {
                const response = await fetch('/data/UserManagement.json')
                const data = await response.json()
                setStudents(data)
                // console.log('Students data loaded:', data)
            } catch (error) {
                console.error('Error fetching students:', error)
            }
        }

        fetchStudents()
    }, [])

    const handleSend = () => {
        console.log('=== EMAIL NOTIFICATION DATA ===')
        console.log('Recipient:', selectedRecipient)
        console.log('Message (HTML):', message)
        console.log('Full Editor Data:', {
            recipient: selectedRecipient,
            messageHTML: message
        })
        // Add your email sending logic here
    }

    // Filter students based on search query
    const filteredStudents = students.filter(student =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className='bg-white rounded-xl p-5'>
            <div className="space-y-6">
                {/* Recipient Selection */}
                <div className="space-y-2">
                    <Label htmlFor="recipient">To</Label>
                    <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                        <SelectTrigger className="w-full" >
                            <SelectValue placeholder="Everyone" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                            {/* Search Input */}
                            <div className="flex items-center px-3 py-2 border-b">
                                <Search className="h-4 w-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            <SelectItem value="everyone" className="py-1">Everyone</SelectItem>
                            {filteredStudents.map((student) => (
                                <SelectItem key={student.id} value={student.email} className="py-1">
                                    {student.fullName} ({student.email})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Rich Text Editor */}
                <TextAreaCustom
                    value={message}
                    onChange={setMessage}
                    label="Message"
                    placeholder="Enter your message here..."
                />

                {/* Send Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSend}
                        className="bg-[#F1C27D] hover:bg-[#F1C27D]/80 cursor-pointer text-white px-8 py-2 rounded-md"
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    )
}
