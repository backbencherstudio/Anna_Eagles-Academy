"use client"

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import TextAreaCustom from '@/components/Resuable/TextAreaCustom'
import { useGetAllStudentListQuery } from '@/rtk/api/admin/filterStudentListApis'
import { useEmailNotificationMutation } from '@/rtk/api/admin/studentManagementApis'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setSearch } from '@/rtk/slices/admin/studentManagementSlice'
import toast from 'react-hot-toast'

interface Student {
    id: string
    name: string
    email: string
}

interface EmailNotificationProps {
    studentId?: string
}

export default function EmailNotification({ studentId }: EmailNotificationProps) {
    const [selectedRecipient, setSelectedRecipient] = useState('')
    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false)

    const dispatch = useAppDispatch()
    const { search } = useAppSelector((state) => state.studentManagement)
    const { data, isFetching, error } = useGetAllStudentListQuery(undefined)
    const [sendEmailNotification] = useEmailNotificationMutation()
    const students = data || []

    // Pre-select student if studentId is provided
    useEffect(() => {
        if (studentId && students.length > 0) {
            const student = students.find((s: Student) => s.id === studentId)
            if (student) {
                setSelectedRecipient(student.email)
            }
        }
    }, [studentId, students])

    const handleSend = async () => {
        if (!message.trim()) {
            toast.error('Please enter a message')
            return
        }

        if (selectedRecipient === 'everyone') {
            // Send to all students
            setIsSending(true)
            try {
                let successCount = 0
                let errorCount = 0
                
                for (const student of students) {
                    try {
                        const response = await sendEmailNotification({
                            student_id: student.id,
                            message: message
                        }).unwrap()
                        
                        if (response.success) {
                            successCount++
                        } else {
                            errorCount++
                        }
                    } catch (error) {
                        errorCount++
                    }
                }
                
                if (successCount > 0) {
                    toast.success(`Email notifications sent to ${successCount} students successfully!`)
                }
                if (errorCount > 0) {
                    toast.error(`Failed to send ${errorCount} email notifications`)
                }
                
                setMessage('')
                setSelectedRecipient('')
            } catch (error) {
                console.error('Error sending email notifications:', error)
                toast.error('Failed to send email notifications')
            } finally {
                setIsSending(false)
            }
        } else if (selectedRecipient) {
            // Send to specific student
            const student = students.find((s: Student) => s.email === selectedRecipient)
            if (student) {
                setIsSending(true)
                try {
                    const response = await sendEmailNotification({
                        student_id: student.id,
                        message: message
                    }).unwrap()
                    
                    if (response.success) {
                        toast.success(response.message || `Email notification sent to ${student.name} successfully!`)
                    } else {
                        toast.error('Failed to send email notification')
                    }
                    
                    setMessage('')
                    setSelectedRecipient('')
                } catch (error) {
                    console.error('Error sending email notification:', error)
                    toast.error('Failed to send email notification')
                } finally {
                    setIsSending(false)
                }
            }
        } else {
            toast.error('Please select a recipient')
        }
    }

    // Filter students based on search query from Redux state
    const filteredStudents = students.filter((student: Student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
    )

    // Handle search input change
    const handleSearchChange = (value: string) => {
        dispatch(setSearch(value))
    }

    return (
        <div className='bg-white rounded-xl p-5'>
            <div className="space-y-6">
                {/* Recipient Selection */}
                <div className="space-y-2">
                    <Label htmlFor="recipient">To</Label>
                    <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={isFetching ? "Loading students..." : "Everyone"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                            {/* Search Input */}
                            <div className="flex items-center px-3 py-2 border-b">
                                <Search className="h-4 w-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            <SelectItem value="everyone" className="py-1">Everyone</SelectItem>
                            {isFetching ? (
                                <div className="px-3 py-2 text-sm text-gray-500">Loading students...</div>
                            ) : error ? (
                                <div className="px-3 py-2 text-sm text-red-500">Error loading students</div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500">No students found</div>
                            ) : (
                                filteredStudents.map((student: Student) => (
                                    <SelectItem key={student.id} value={student.email} className="py-1">
                                        {student.name} ({student.email})
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Custom Text Editor */}
                <TextAreaCustom
                    value={message}
                    onChange={setMessage}
                    label="Message"
                    placeholder="Enter your message here..."
                    className='w-full'
                />

                {/* Send Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSend}
                        disabled={isSending}
                        className="bg-[#0F2598] hover:bg-[#0F2598]/80 text-white px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSending ? 'Sending...' : 'Send'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
