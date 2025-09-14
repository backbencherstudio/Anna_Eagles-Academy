"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import MaterialsUpload from '@/app/(dashboard)/_components/Admin/CourseManagement/MaterialsUpload/MaterialsUpload';

export default function MaterialsUploadPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('lecture-slides');

    // Get active tab from URL on component mount
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['lecture-slides', 'video-lectures', 'audio-lessons', 'other-document'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Update URL when tab changes
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        
            <div className="">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Materials Upload</h1>

                <Card className="bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Documents</h2>

                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <div className="border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
                            <TabsList className="flex w-max min-w-full bg-transparent p-0 h-auto">
                                <TabsTrigger
                                    value="lecture-slides"
                                    className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:text-[#0F2598] data-[state=active]:border-b-2 data-[state=active]:border-[#0F2598] data-[state=active]:rounded-none text-gray-500 hover:text-gray-700 px-4 py-3 text-sm font-medium border-b-2 border-transparent whitespace-nowrap flex-shrink-0"
                                >
                                    Lecture Slides
                                </TabsTrigger>
                                <TabsTrigger
                                    value="video-lectures"
                                    className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:text-[#0F2598] data-[state=active]:border-b-2 data-[state=active]:border-[#0F2598] data-[state=active]:rounded-none text-gray-500 hover:text-gray-700 px-4 py-3 text-sm font-medium border-b-2 border-transparent whitespace-nowrap flex-shrink-0"
                                >
                                    Video Lectures
                                </TabsTrigger>
                                <TabsTrigger
                                    value="audio-lessons"
                                    className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:text-[#0F2598] data-[state=active]:border-b-2 data-[state=active]:border-[#0F2598] data-[state=active]:rounded-none text-gray-500 hover:text-gray-700 px-4 py-3 text-sm font-medium border-b-2 border-transparent whitespace-nowrap flex-shrink-0"
                                >
                                    Audio Lessons
                                </TabsTrigger>
                                <TabsTrigger
                                    value="other-document"
                                    className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:text-[#0F2598] data-[state=active]:border-b-2 data-[state=active]:border-[#0F2598] data-[state=active]:rounded-none text-gray-500 hover:text-gray-700 px-4 py-3 text-sm font-medium border-b-2 border-transparent whitespace-nowrap flex-shrink-0"
                                >
                                    Other Document
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* MaterialsUpload component with activeTab prop */}
                        <MaterialsUpload activeTab={activeTab} />
                    </Tabs>
                </Card>
            </div>
      
    );
}