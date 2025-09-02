import { MainLayout } from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import React from 'react'

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <ProtectedRoute allowedRoles={['student', 'admin']}>
            <MainLayout >
                {children}
            </MainLayout>
        </ProtectedRoute>
    )
}
