
import SettingsLayout from '@/components/Shared/SettingsLayout';
import { UserDataProvider } from '@/context/UserDataContext';
import React from 'react'


interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <UserDataProvider>
            <SettingsLayout>
                {children}
            </SettingsLayout>
        </UserDataProvider>

    )
}
