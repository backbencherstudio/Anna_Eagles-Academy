'use client'
import AssignmentEssay from '@/app/_components/Admin/Assignment/AssignmentEssay'
import AssignmentQuiz from '@/app/_components/Admin/Assignment/AssignmentQuiz'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'


export default function CreateAssignmentsPage() {
    const [activeTab, setActiveTab] = useState('quiz')
    const router = useRouter()
    const handleTabChange = (value: string) => {
        setActiveTab(value)
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', value)
        router.push(`?${params.toString()}`, { scroll: false })
    }
    // get the url params
    const searchParams = useSearchParams()
    const tab = searchParams.get('tab')
    useEffect(() => {
        if (tab) {
            setActiveTab(tab)
        }
    }, [tab])

    return (
        <div className='flex flex-col gap-5 w-full'>
            {/* header */}
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
            </div>

            {/* tabs buttons */}
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="w-full justify-start overflow-x-auto rounded-xl bg-white py-2 px-2">
                    <TabsTrigger value="quiz" className="cursor-pointer w-fit sm:w-1/2 text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm">Assignment (Quiz)</TabsTrigger>
                    <TabsTrigger value="essay" className="text-muted-foreground cursor-pointer w-fit sm:w-1/2 py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm">Assignment (Essay)</TabsTrigger>
                </TabsList>
                {/* tabs content */}
                <TabsContent value="quiz" className="mt-6">
                    <AssignmentQuiz />
                </TabsContent>
                <TabsContent value="essay" className="mt-6">
                    <AssignmentEssay />
                </TabsContent>

            </Tabs>

        </div>
    )
}
