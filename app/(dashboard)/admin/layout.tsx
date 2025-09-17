
import React from 'react'
import RouteGuard from '@/components/RouteGuard'
import { AdminLayout } from '@/app/_components/Admin/SidebarAdmin/AdminLayout';

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
    return (
        <RouteGuard allowedRoles={['admin']} requireAuth={true}>
            <AdminLayout>
                {children}
            </AdminLayout>
        </RouteGuard>
    )
}
