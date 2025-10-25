'use client'

import React, { useState } from 'react';
import Navbar from '@/components/Shared/Navbar';
import UserSidebar from './UserSidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const UserMainLayout = ({ children }: LayoutProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (

        <div className="flex h-screen overflow-hidden bg-[#F7F7F9] font-spline-sans">
            <UserSidebar
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuClose={() => setIsMobileMenuOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar
                    notificationCount={1}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                <div className="flex-1 overflow-y-auto px-5 py-5 bg-[#F8F9FA]">
                    {children}
                </div>
            </div>
        </div>

    );
};

