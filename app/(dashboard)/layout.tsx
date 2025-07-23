import { MainLayout } from '@/components/Layout/MainLayout';
import { UserDataProvider } from '@/context/UserDataContext';
import React from 'react'


interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <UserDataProvider>
            <MainLayout>
                {children}
            </MainLayout>
        </UserDataProvider>

    )
}
