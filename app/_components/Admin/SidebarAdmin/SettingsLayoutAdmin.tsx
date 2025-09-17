import React from 'react'
import SettingsSidebarAdmin from './SettingsSidebarAdmin';

interface LayoutProps {
    children: React.ReactNode;
}

export default function SettingsLayoutAdmin({ children }: LayoutProps) {
    return (
        <div className=" bg-gray-50">
            {/* Mobile Layout - Sidebar at top */}
            <div className="lg:hidden">
                <div className="bg-white border-b border-gray-200">
                    <SettingsSidebarAdmin />
                </div>
                <main className="py-5">
                    {children}
                </main>
            </div>

            {/* Desktop Layout - Sidebar on left */}
            <div className="hidden lg:flex h-full">
                <SettingsSidebarAdmin />
                <main className="flex-1  px-5">
                    {children}
                </main>
            </div>
        </div>
    )
}
