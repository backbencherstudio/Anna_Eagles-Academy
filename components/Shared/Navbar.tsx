import React, { useState, useEffect } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { FaRegUser } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import Image from 'next/image';
import { useUserData } from '@/context/UserDataContext';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    onMobileMenuToggle: () => void;
    isMobileMenuOpen: boolean;
    notificationCount?: number;
}

interface NotificationItem {
    id: string;
    message: string;
    time: string;
}

export default function Navbar({ onMobileMenuToggle, notificationCount }: NavbarProps) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const user = useUserData();
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        {
            id: '1',
            message: 'You have empty vibe check for tomorrow.',
            time: '01:55 pm',
        },

    ]);
    // Dynamic title system - handles all route types including dynamic routes with query parameters
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const currentPath = pathSegments[pathSegments.length - 1] || 'dashboard';

    const titleMap = {
        'dashboard': 'Hi, ' + user?.name,
        'schedule': 'My Schedule',
        'discover': 'Discover Courses',
        'checkout': 'Checkout',
        'my-courses': 'My Courses',
        'assignments': 'Assignments',
        'setting': 'Setting',
        'payment-success': 'Payment Success',
        'profile': 'Profile',
        'notification': 'Notification',
        'payment': 'Payment',
        'change-password': 'Change Password',
        'payment-method': 'Payment Method',
        'billing': 'Billing',
        'email-address': 'Email Address',
        'courses-modules': 'Course Modules',
        'courses': 'Courses',
        'modules': 'Modules',
        'quiz': 'Quiz',
        'test': 'Test',
        'video': 'Video',
        'lesson': 'Lesson',
        'chapter': 'Chapter',
    };

    // Function to get dynamic title based on pathname
    const getDynamicTitle = () => {
        // Special case for dashboard
        if (currentPath === 'dashboard') {
            return `Hi, ${user?.name}`;
        }

        // Handle specific routes with dynamic titles
        if (pathname.includes('courses-modules')) {
            return 'Course Modules';
        }
        if (pathname.includes('checkout/')) {
            return 'Checkout';
        }
        if (pathname.includes('assignments/')) {
            return 'Assignments';
        }
        if (pathname.includes('my-courses/')) {
            return 'Course Details';
        }
        if (pathname.includes('setting/')) {
            const settingPath = pathSegments[pathSegments.length - 1];
            return titleMap[settingPath as keyof typeof titleMap] || 'Setting';
        }

        // Handle dynamic routes with IDs (like /assignments/[id], /my-courses/[id], etc.)
        if (pathSegments.length > 2) {
            const parentRoute = pathSegments[pathSegments.length - 2];
            if (parentRoute === 'assignments') {
                return 'Assignments';
            }
            if (parentRoute === 'my-courses') {
                return 'Course Details';
            }
            if (parentRoute === 'checkout') {
                return 'Checkout';
            }
        }

        // Default to titleMap or fallback
        return titleMap[currentPath as keyof typeof titleMap] || 'Dashboard';
    };



    const handleClearAll = () => {
        setNotifications([]);
    };

    const handleDeleteOne = (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    return (
        <header className="bg-white border-b border-[#E9EAEC] z-10 mx-2 md:mx-6 mt-4 rounded-2xl">
            <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
                        onClick={onMobileMenuToggle}
                    >
                        <HiMenuAlt3 className="w-6 h-6" />
                    </button>
                    <div className='hidden sm:flex flex-col'>
                        {user ? (
                            <>
                                <h1 className="text-[24px] font-semibold text-[#111827]">
                                    {getDynamicTitle()}
                                </h1>
                                {currentPath === 'dashboard' && user.role === 'student' && (
                                    <span className="text-[16px] text-[#777980] mt-1">
                                        Let’s boost your knowledge today and learn a new things
                                    </span>
                                )}
                            </>
                        ) : (
                            <h1 className="text-[24px] font-semibold text-[#111827]">&nbsp;</h1>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative">
                        <button
                            className="flex cursor-pointer items-center p-2 bg-[#F3F3F4] rounded-full hover:bg-gray-100 border border-gray-200"
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        >
                            <IoNotificationsOutline className="text-xl text-[#070707]" />
                        </button>
                        {(notificationCount ?? 0) > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {notificationCount}
                            </span>
                        )}
                        {/* <Notification
                            isOpen={isNotificationOpen}
                            onClose={() => setIsNotificationOpen(false)}
                            notifications={notifications}
                            onClearAll={handleClearAll}
                            onDeleteOne={handleDeleteOne}
                        /> */}
                    </div>

                    <div className='bg-gray-200 w-[1.3px] h-[40px]'></div>

                    <div className='flex items-center gap-2'>
                        <div className="">
                            {
                                user?.avatar_url && user.avatar_url !== 'null' ? (
                                    <Image src={user.avatar_url} alt="Profile picture" width={500} height={500} className='rounded-full w-10 h-10 object-cover' />
                                ) : (
                                    <div className='p-2 cursor-pointer bg-[#F3F3F4] rounded-full flex items-center justify-center border border-gray-200'>
                                        <FaRegUser className="text-xl text-[#070707]" />
                                    </div>

                                )
                            }
                        </div>
                        <div>
                            <h1 className="text-sm font-medium">{user?.name}</h1>
                            <p className="text-xs text-[#777980]">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
