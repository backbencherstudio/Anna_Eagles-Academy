


import SettingsLayoutAdmin from '@/app/_components/Admin/SidebarAdmin/SettingsLayoutAdmin';
import React from 'react'


interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (

        <SettingsLayoutAdmin>
            {children}
        </SettingsLayoutAdmin>


    )
}
