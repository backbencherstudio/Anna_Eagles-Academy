'use client'
import { useUserData } from '@/context/UserDataContext';
import React from 'react'
import StudentDashboard from '../Student/StudentDashboard';
import AdminDashboard from '../Admin/AdminDashboard';


export default function CommonDashboard() {
    const user = useUserData();
    return (
        <div>
            {user.role === 'student' ? <StudentDashboard /> : <AdminDashboard />}
        </div>
    )
}
