'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import WeeklyVideo from './WeeklyVideo'
import OtherFiles from './OtherFiles'
import { useGetSingleStudentFileDownloadQuery } from '@/rtk/api/admin/studentFileDownloadApis'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setSectionType } from '@/rtk/slices/studentFileDownloadSlice'



export default function StudentFileDetails({ studentId }: { studentId: string }) {
    const dispatch = useAppDispatch()
    const { section_type } = useAppSelector(s => s.studentFileDownload)
    const { data, isFetching } = useGetSingleStudentFileDownloadQuery({ student_id: studentId, section_type })
    const [studentName, setStudentName] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'video-diaries' | 'file-submissions'>(section_type === 'Other File Submissions' ? 'file-submissions' : 'video-diaries')
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize tab from URL query parameter
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab')
        if (tabFromUrl === 'video-diaries') {
            setActiveTab('video-diaries')
            dispatch(setSectionType('Weekly Video Diary'))
        } else if (tabFromUrl === 'file-submissions') {
            setActiveTab('file-submissions')
            dispatch(setSectionType('Other File Submissions'))
        }
    }, [searchParams, dispatch])

    useEffect(() => {
        const files: any[] = data?.data?.student_files ?? []
        const inferredName: string = files[0]?.student?.name || 'Student'
        setStudentName(inferredName)
        setLoading(isFetching)
    }, [data, isFetching, studentId])

    const handleBack = () => {
        router.push('/admin/student-file-download')
    }



    const handleTabChange = (value: string) => {
        const v = value === 'file-submissions' ? 'file-submissions' : 'video-diaries'
        setActiveTab(v)
        dispatch(setSectionType(v === 'video-diaries' ? 'Weekly Video Diary' : 'Other File Submissions'))
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', v)
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
                <h1 className="text-2xl font-bold text-gray-900">{studentName || 'Student'}</h1>
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
                    <WeeklyVideo studentId={studentId} />
                </TabsContent>

                {/* File Submissions Tab */}
                <TabsContent value="file-submissions" className="mt-6">
                    <OtherFiles studentId={studentId} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
