import { MainLayout } from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import React from 'react'
import RouteAudioGuard from '@/components/RouteAudioGuard'

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <ProtectedRoute allowedRoles={['student', 'admin']}>
            <MainLayout >
                <RouteAudioGuard />
                {children}
            </MainLayout>
        </ProtectedRoute>
    )
}
