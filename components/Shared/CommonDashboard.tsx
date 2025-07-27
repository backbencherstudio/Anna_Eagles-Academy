'use client'
import AdminDashboard from '@/app/(dashboard)/_components/Admin/AdminDashboard';
import StudentDashboard from '@/app/(dashboard)/_components/Student/StudentDashboard';
import { useUserData } from '@/context/UserDataContext';
import React from 'react'



export default function CommonDashboard() {
    const { user, isLoading } = useUserData();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {user?.role === 'student' ? <StudentDashboard /> : <AdminDashboard />}
        </div>
    )
}
