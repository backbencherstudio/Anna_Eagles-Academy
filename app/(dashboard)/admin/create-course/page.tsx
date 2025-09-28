"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CreateCourseRoot() {
    const router = useRouter()

    useEffect(() => {
        router.push('/admin/create-course/new')
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F2598] mx-auto" />
                <p className="mt-2 text-gray-600">Redirecting...</p>
            </div>
        </div>
    )
}
