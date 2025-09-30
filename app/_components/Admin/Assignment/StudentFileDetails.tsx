'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Camera, FileText } from 'lucide-react'
import WeeklyVideo from './WeeklyVideo'
import OtherFiles from './OtherFiles'

// Data types
interface VideoDiary {
    id: string
    title: string
    week: string
    date: string
    thumbnail: string
    videoUrl?: string
}

interface FileSubmission {
    id: string
    fileName: string
    uploadDate: string
    uploadTime: string
    fileType: string
}

interface StudentDetails {
    id: string
    name: string
    videoDiaries: VideoDiary[]
    fileSubmissions: FileSubmission[]
}

// Sample data
const sampleStudentData: StudentDetails = {
    id: '1',
    name: 'Miles, Esther',
    videoDiaries: [
        {
            id: '1',
            title: 'Week 1 Video Diary.mp4',
            week: 'Week 1',
            date: 'Jan 10, 2025',
            thumbnail: '/images/video-thumbnail.jpg',
            videoUrl: '/videos/week1-diary.mp4'
        },
        {
            id: '2',
            title: 'Week 2 Video Diary.mp4',
            week: 'Week 2',
            date: 'Jan 18, 2025',
            thumbnail: '/images/video-thumbnail.jpg',
            videoUrl: '/videos/week2-diary.mp4'
        },
        {
            id: '3',
            title: 'Week 3 Video Diary.mp4',
            week: 'Week 3',
            date: 'Jan 20, 2025',
            thumbnail: '/images/video-thumbnail.jpg',
            videoUrl: '/videos/week3-diary.mp4'
        }
    ],
    fileSubmissions: [
        {
            id: '1',
            fileName: 'Biblical Studies Assignment.pdf',
            uploadDate: '08/01/2024',
            uploadTime: '11:59 PM',
            fileType: 'pdf'
        },
        {
            id: '2',
            fileName: 'Prayer Journal.docx',
            uploadDate: '08/01/2024',
            uploadTime: '11:59 PM',
            fileType: 'docx'
        }
    ]
}

export default function StudentFileDetails({ studentId }: { studentId: string }) {
    const [studentData, setStudentData] = useState<StudentDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('video-diaries')
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize tab from URL query parameter
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab')
        if (tabFromUrl && (tabFromUrl === 'video-diaries' || tabFromUrl === 'file-submissions')) {
            setActiveTab(tabFromUrl)
        }
    }, [searchParams])

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 300))
                setStudentData(sampleStudentData)
            } catch (error) {
                console.error('Error fetching student data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStudentData()
    }, [studentId])

    const handleBack = () => {
        router.push('/admin/student-file-download')
    }



    const handleTabChange = (value: string) => {
        setActiveTab(value)
        // Update URL with new tab parameter
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', value)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-100">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-gray-200 rounded-lg h-48"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!studentData) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-100">
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Student not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">{studentData.name}</h1>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                {/* tabs buttons */}
                <TabsList className="w-full justify-start rounded-xl bg-white py-2 px-2">
                    <TabsTrigger value="video-diaries" className="text-muted-foreground cursor-pointer w-fit sm:w-1/2 py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm">Weekly Video Diaries</TabsTrigger>

                    <TabsTrigger value="file-submissions" className="cursor-pointer w-fit sm:w-1/2 text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm">Other File Submissions</TabsTrigger>
                </TabsList>

                {/* Video Diaries Tab */}
                <TabsContent value="video-diaries" className="mt-6">
                    <WeeklyVideo />
                </TabsContent>

                {/* File Submissions Tab */}
                <TabsContent value="file-submissions" className="mt-6">
                    <OtherFiles />
                </TabsContent>
            </Tabs>
        </div>
    )
}
