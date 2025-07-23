'use client'
import AdminDashboard from '@/app/(dashboard)/_components/Admin/AdminDashboard';
import StudentDashboard from '@/app/(dashboard)/_components/Student/StudentDashboard';
import { useUserData } from '@/context/UserDataContext';
import React from 'react'



export default function CommonDashboard() {
    const user = useUserData();
    return (
        <div>
            {user.role === 'student' ? <StudentDashboard /> : <AdminDashboard />}
        </div>
    )
}
