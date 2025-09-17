
import SettingsLayoutUser from '@/app/_components/Student/UserSidebar/SettingsLayoutUser';

import React from 'react'


interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (

        <SettingsLayoutUser>
            {children}
        </SettingsLayoutUser>


    )
}
