'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, Trash2 } from 'lucide-react'
import { IoLogoWhatsapp } from 'react-icons/io'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import toast from 'react-hot-toast'

// Data type for student question
interface StudentQuestionItem {
    id: string
    studentName: string
    email: string
    phoneNumber: string
    timeZone: string
    region: string
    avatar?: string
    hasWhatsApp?: boolean
}

// Sample data for student questions
const sampleStudentQuestions: StudentQuestionItem[] = [
    {
        id: '1',
        studentName: 'Devon Lane',
        email: 'kenzi.lawson@example.com',
        phoneNumber: '+44 7946 123456',
        timeZone: '02:34 am',
        region: 'School Fees',
        avatar: '/images/avatars/devon.jpg',
        hasWhatsApp: true
    },
    {
        id: '2',
        studentName: 'Ralph Edwards',
        email: 'sara.cruz@example.com',
        phoneNumber: '+880 1712 345678',
        timeZone: '08:20 pm',
        region: 'Prayer Request',
        avatar: '/images/avatars/ralph.jpg',
        hasWhatsApp: false
    },
    {
        id: '3',
        studentName: 'Courtney Henry',
        email: 'georgia.young@example.com',
        phoneNumber: '+86 1712 345678',
        timeZone: '11:23 pm',
        region: 'Conference',
        avatar: '/images/avatars/courtney.jpg',
        hasWhatsApp: true
    },
    {
        id: '4',
        studentName: 'Guy Hawkins',
        email: 'guy.hawkins@example.com',
        phoneNumber: '+91 1712 345678',
        timeZone: '02:34 am',
        region: 'Workshop',
        avatar: '/images/avatars/guy.jpg',
        hasWhatsApp: false
    },
    {
        id: '5',
        studentName: 'Floyd Miles',
        email: 'floyd.miles@example.com',
        phoneNumber: '+880 1712 345678',
        timeZone: '08:20 pm',
        region: '1:1 Meeting',
        avatar: '/images/avatars/floyd.jpg',
        hasWhatsApp: true
    },
    {
        id: '6',
        studentName: 'Kathryn Murphy',
        email: 'kathryn.murphy@example.com',
        phoneNumber: '+1 1712 345678',
        timeZone: '11:23 pm',
        region: 'Class Question',
        avatar: '/images/avatars/kathryn.jpg',
        hasWhatsApp: false
    },
    {
        id: '7',
        studentName: 'Jacob Jones',
        email: 'jacob.jones@example.com',
        phoneNumber: '+44 7946 123456',
        timeZone: '02:34 am',
        region: 'Refund',
        avatar: '/images/avatars/jacob.jpg',
        hasWhatsApp: true
    },
    {
        id: '8',
        studentName: 'Cameron Williamson',
        email: 'cameron.williamson@example.com',
        phoneNumber: '+880 1712 345678',
        timeZone: '08:20 pm',
        region: 'Class Schedule',
        avatar: '/images/avatars/cameron.jpg',
        hasWhatsApp: false
    },
    {
        id: '9',
        studentName: 'Brooklyn Simmons',
        email: 'brooklyn.simmons@example.com',
        phoneNumber: '+1 1712 345678',
        timeZone: '11:23 pm',
        region: 'School Fees',
        avatar: '/images/avatars/brooklyn.jpg',
        hasWhatsApp: true
    },
    {
        id: '10',
        studentName: 'Robert Fox',
        email: 'robert.fox@example.com',
        phoneNumber: '+44 7946 123456',
        timeZone: '02:34 am',
        region: 'Prayer Request',
        avatar: '/images/avatars/robert.jpg',
        hasWhatsApp: false
    }
]

// Table headers for student questions
const tableHeaders = [
    { key: 'studentName', label: 'Student Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phoneNumber', label: 'Phone Number', sortable: true },
    { key: 'timeZone', label: 'Time Zone', sortable: true },
    { key: 'region', label: 'Region', sortable: true },
    { key: 'actions', label: 'Registration', sortable: false }
]

export default function StudentQuestionTable() {
    const [studentQuestions, setStudentQuestions] = useState<StudentQuestionItem[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<StudentQuestionItem | null>(null)
    const router = useRouter()

    const buildWhatsappLink = (raw: string) => {
        const digits = raw.replace(/[^\d]/g, '')
        return `https://wa.me/${digits}`
    }

    useEffect(() => {
        const fetchStudentQuestions = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                setStudentQuestions(sampleStudentQuestions)
            } catch (error) {
                console.error('Error fetching student questions:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStudentQuestions()
    }, [])

    const transformedStudentData = studentQuestions.map(item => ({
        ...item,
        studentName: (
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={item.avatar} alt={item.studentName} />
                    <AvatarFallback>
                        {item.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                <span className="font-medium">{item.studentName}</span>
            </div>
        ),
        phoneNumber: (
            <div className="flex items-center gap-2">
                {item.hasWhatsApp ? (
                    <a
                        href={buildWhatsappLink(item.phoneNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-green-600 hover:underline hover:text-green-700 transition-colors duration-200"
                        title="Click to open WhatsApp"
                    >
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors duration-200">
                            <IoLogoWhatsapp className="text-green-600 text-sm" />
                        </span>
                        {item.phoneNumber}
                    </a>
                ) : (
                    <span className="text-gray-900">{item.phoneNumber}</span>
                )}
            </div>
        )
    }))

    const handleDeleteClick = (item: StudentQuestionItem) => {
        setSelectedStudent(item)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (selectedStudent) {
            // Remove the student from the list
            setStudentQuestions(prev => prev.filter(student => student.id !== selectedStudent.id))
            toast.success(`Student question from ${selectedStudent.studentName} has been deleted successfully!`)
        }
        setDeleteDialogOpen(false)
        setSelectedStudent(null)
    }

    // Define table actions
    const tableActions = [
        {
            label: 'View Details',
            icon: <Eye className="h-4 w-4 mr-2" />,
            onClick: (item: StudentQuestionItem) => {
                router.push(`/student-question/${item.id}`)
            }
        },
        {
            label: 'Delete',
            icon: <Trash2 className="h-4 w-4 mr-2" />,
            onClick: handleDeleteClick,
            variant: 'destructive' as const
        }
    ]

    return (
        <>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Student All Question</h2>
                <p className="text-gray-600 text-sm mb-6">Student Data</p>

                <ReusableTable
                    headers={tableHeaders}
                    data={transformedStudentData}
                    actions={tableActions}
                    showPagination={true}
                    itemsPerPage={5}
                    itemsPerPageOptions={[5, 10, 15, 20]}
                    isLoading={loading}
                />
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Student Question"
                description={`Are you sure you want to delete the question from ${selectedStudent?.studentName}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                confirmVariant="destructive"
            />
        </>
    )
}
