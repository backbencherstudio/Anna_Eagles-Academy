import { MainLayout } from '@/components/Layout/MainLayout';
import React from 'react'


interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (

        <MainLayout>
            {children}
        </MainLayout>

    )
}
