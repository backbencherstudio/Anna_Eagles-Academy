
import SettingsLayout from '@/components/Shared/SettingsLayout';

import React from 'react'


interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
  
            <SettingsLayout>
                {children}
            </SettingsLayout>


    )
}
