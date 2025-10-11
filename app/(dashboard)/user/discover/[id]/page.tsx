'use client'

import DiscoverCourses from '@/app/_components/Student/DiscoverCourses'
import React from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function CourseDetailsStudent() {
    const params = useParams()
    const router = useRouter()

    return (
        <div className="">
            {/* Back Button */}
            <div className="mb-5">
                <Button
                    variant="outline"
                    onClick={() => router.push('/user/discover')}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                </Button>
            </div>

            {/* Course Details */}
            <DiscoverCourses courseId={params.id as string} />
        </div>
    )
}
