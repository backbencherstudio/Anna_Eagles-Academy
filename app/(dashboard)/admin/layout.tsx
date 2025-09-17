
import React from 'react'
import { AdminLayout } from '@/components/Layout/AdminLayout';

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <AdminLayout >
                {children}
            </AdminLayout>
        </div>
    )
}
