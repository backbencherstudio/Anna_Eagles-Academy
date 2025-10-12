"use client"

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AssignmentData from '@/app/_components/Student/AssignmentQuiz/AssignmentData'
import QuizData from '@/app/_components/Student/AssignmentQuiz/QuizData'

export default function AssignmentsPage() {
    const [filter, setFilter] = useState<'Published' | 'Submitted' | 'All'>('All')

    // Map internal filter to API parameter
    const getApiFilter = (filter: 'Published' | 'Submitted' | 'All') => {
        switch (filter) {
            case 'Published':
                return 'Upcoming'
            case 'Submitted':
                return 'Finished'
            default:
                return 'All'
        }
    }

    return (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            {/* header section */}
            <div className="mb-6 sm:mb-7">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                    <div className="flex-1">
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Assignment & Quiz</h1>
                        <p className="text-gray-700 leading-relaxed text-sm ">
                            Engage in lessons, connect with learners, and explore topics at your pace. Your strengths are assets—use them to enhance your learning and expand your knowledge!
                        </p>
                    </div>

                    {/* Dropdown Filter */}
                    <div className="flex-shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex  cursor-pointer items-center gap-2 bg-gray-100 border-gray-200 hover:bg-gray-200 px-3 sm:px-4 py-2 h-auto text-gray-700 text-sm w-full sm:w-auto"
                                >
                                    {filter}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 sm:w-40">
                                <DropdownMenuItem onClick={() => setFilter('All')} className='cursor-pointer'>
                                    All
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter('Published')} className='cursor-pointer'>
                                    Published
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter('Submitted')} className='cursor-pointer'>
                                    Submitted
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="assignments" className="w-full">
                <TabsList className="grid w-full grid-cols-2 ">
                    <TabsTrigger value="assignments" className='cursor-pointer'>Assignments</TabsTrigger>
                    <TabsTrigger value="quizzes" className='cursor-pointer'>Quizzes</TabsTrigger>
                </TabsList>

                <TabsContent value="assignments">
                    <AssignmentData filter={getApiFilter(filter)} />
                </TabsContent>

                <TabsContent value="quizzes">
                    <QuizData filter={getApiFilter(filter)} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
