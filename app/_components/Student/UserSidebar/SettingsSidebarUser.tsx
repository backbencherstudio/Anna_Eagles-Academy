'use client'
import { UserIcon, LockIcon, BellIcon, CreditCardIcon } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/rtk/hooks'


export default function SettingsSidebarUser() {
    const pathname = usePathname()
    const user = useAppSelector((state) => state.auth.user)

    const profileItems = [
        {
            label: 'Edit Profile',
            icon: <UserIcon size={20} />,
            href: '/user/setting/profile',
            role: 'user'
        },

        {
            label: 'Change Password',
            icon: <LockIcon size={20} />,
            href: '/user/setting/change-password',
            role: 'user'
        },

        {
            label: 'Notification',
            icon: <BellIcon size={20} />,
            href: '/user/setting/notification',
            role: 'user'
        },
        {
            label: 'Payment Details',
            icon: <CreditCardIcon size={20} />,
            href: '/user/setting/payment',
            role: 'user'
        },
    ]



    // Filter items based on user role
    const filterItemsByRole = (items: any[]) => {
        if (!user?.role) return []
        return items.filter(item => item.role === user.role)
    }

    const filteredProfileItems = filterItemsByRole(profileItems)


    const isActive = (href: string) => pathname === href

    return (
        <>
            {/* Mobile Sidebar - Horizontal scrolling */}
            <div className="lg:hidden w-full overflow-x-auto">
                <div className="flex space-x-2 p-4 min-w-max">
                    {/* Profile Items */}
                    {filteredProfileItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive(item.href)
                                ? 'bg-[#FEF9F2] text-[#F1C27D] border border-[#F1C27D]/30'
                                : 'text-[#1D1F2C]/70 hover:bg-[#FEF9F2] bg-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}


                </div>
            </div>

            {/* Desktop Sidebar - Vertical layout */}
            <div className="hidden lg:block w-64 bg-white rounded-xl p-6">
                {/* Profile Section */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Profile
                    </h3>
                    <div className="space-y-5">
                        {filteredProfileItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                    ? 'bg-[#FEF9F2] text-[#F1C27D] border border-[#F1C27D]/30'
                                    : 'text-[#1D1F2C]/70 hover:bg-[#FEF9F2]'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
