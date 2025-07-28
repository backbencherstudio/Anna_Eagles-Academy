"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Bold, Italic, Underline, Link, List, ListOrdered, Search } from 'lucide-react'

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
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        // Fetch student data from the JSON file
        const fetchStudents = async () => {
            try {
                const response = await fetch('/data/UserManagement.json')
                const data = await response.json()
                setStudents(data)
            } catch (error) {
                console.error('Error fetching students:', error)
            }
        }

        fetchStudents()
    }, [])

    const handleSend = () => {
        // Handle send functionality
        console.log('Sending to:', selectedRecipient)
        console.log('Message:', message)
        // Add your email sending logic here
    }

    const toggleFormat = (format: 'bold' | 'italic' | 'underline') => {
        switch (format) {
            case 'bold':
                setIsBold(!isBold)
                break
            case 'italic':
                setIsItalic(!isItalic)
                break
            case 'underline':
                setIsUnderline(!isUnderline)
                break
        }
    }

    // Filter students based on search query
    const filteredStudents = students.filter(student =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className='bg-white rounded-xl p-4 py-8'>
            <CardContent className="space-y-6">
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

                {/* Message Input */}
                <div className="space-y-2">
                    <Label htmlFor="message">Input</Label>

                    {/* Rich Text Toolbar */}
                    <div className="flex items-center gap-2 p-2 border rounded-t-md bg-gray-50">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFormat('bold')}
                            className={isBold ? 'bg-gray-200' : ''}
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFormat('italic')}
                            className={isItalic ? 'bg-gray-200' : ''}
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFormat('underline')}
                            className={isUnderline ? 'bg-gray-200' : ''}
                        >
                            <Underline className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-gray-300 mx-2" />
                        <Button variant="ghost" size="sm">
                            <Link className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                            <List className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                            <ListOrdered className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Text Area */}
                    <Textarea
                        id="message"
                        placeholder="You are have talented, love your work!"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-32 rounded-t-none resize-none"
                        style={{
                            fontWeight: isBold ? 'bold' : 'normal',
                            fontStyle: isItalic ? 'italic' : 'normal',
                            textDecoration: isUnderline ? 'underline' : 'none',
                        }}
                    />
                </div>

                {/* Send Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSend}
                        className="bg-[#F1C27D] hover:bg-[#F1C27D]/80 cursor-pointer text-white px-8 py-2 rounded-md"
                    >
                        Send
                    </Button>
                </div>
            </CardContent>
        </div>
    )
}
