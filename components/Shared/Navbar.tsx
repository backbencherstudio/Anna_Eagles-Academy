import React, { useState, useEffect } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { FaRegUser } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import Image from 'next/image';
import { useUserData } from '@/context/UserDataContext';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MainNotification from './MainNotification';

interface NavbarProps {
    onMobileMenuToggle: () => void;
    isMobileMenuOpen: boolean;
    notificationCount?: number;
}

interface NotificationItem {
    id: string;
    message: string;
    time: string;
    role?: string;
}

export default function Navbar({ onMobileMenuToggle, notificationCount }: NavbarProps) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const { user, logout } = useUserData();
    const router = useRouter();

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isNotificationOpen && !target.closest('.notification-dropdown')) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationOpen]);

    // Role-based notification count calculation
    const calculateNotificationCount = () => {
        const allNotifications: NotificationItem[] = [
            // Student notifications
            { id: '1', message: 'You have empty vibe check for tomorrow.', time: '01:55 pm', role: 'student' },
            { id: '2', message: 'Course completion notification', time: '02:30 pm', role: 'student' },
            { id: '3', message: 'Payment success notification', time: '03:15 pm', role: 'student' },

            // Admin notifications
            { id: '4', message: 'New student registration', time: '10:00 am', role: 'admin' },
            { id: '5', message: 'Course completion alert', time: '11:30 am', role: 'admin' },
            { id: '6', message: 'Revenue update', time: '12:45 pm', role: 'admin' },
            { id: '7', message: 'System maintenance alert', time: '01:20 pm', role: 'admin' },
        ];

        // Filter notifications based on user role
        const roleBasedNotifications = allNotifications.filter(notification =>
            notification.role === user?.role || !notification.role
        );

        return roleBasedNotifications.length;
    };

    const [currentNotificationCount, setCurrentNotificationCount] = useState(0);

    // Update notification count when user role changes
    useEffect(() => {
        setCurrentNotificationCount(calculateNotificationCount());
    }, [user?.role]);

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
        'users-management': 'Users Management',
        'email-notification': 'Email Notification',
        "calendar": 'Calendar',
        'course-management': 'Course Management',
        'create-assignments': 'Create Assignments',
        'reports': 'Reports',

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



    const handleLogout = () => {
        logout();
        router.push('/login');
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
                                        Let's boost your knowledge today and learn a new things
                                    </span>
                                )}
                            </>
                        ) : (
                            <h1 className="text-[24px] font-semibold text-[#111827]">&nbsp;</h1>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative notification-dropdown">
                        <button
                            className="flex cursor-pointer items-center p-2 bg-[#F3F3F4] rounded-full hover:bg-gray-100 border border-gray-200"
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        >
                            <IoNotificationsOutline className="text-xl text-[#070707]" />
                        </button>
                        {currentNotificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {currentNotificationCount}
                            </span>
                        )}
                        {isNotificationOpen && (
                            <MainNotification
                                isOpen={isNotificationOpen}
                                onClose={() => setIsNotificationOpen(false)}
                                isDropdown={true}
                            />
                        )}
                    </div>

                    <div className='bg-gray-200 w-[1.3px] h-[40px]'></div>

                    <div className='flex items-center gap-2'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="p-0 h-auto cursor-pointer">
                                    <div className='flex items-center gap-2'>
                                        <div className="relative">
                                            {user?.profileImage && user.profileImage !== 'null' && user.profileImage !== '' ? (
                                                <Image
                                                    src={user.profileImage}
                                                    alt="Profile picture"
                                                    width={40}
                                                    height={40}
                                                    className='rounded-full w-10 h-10 object-cover'
                                                    unoptimized={true}
                                                />
                                            ) : (
                                                <div className='p-2 cursor-pointer bg-[#F3F3F4] rounded-full flex items-center justify-center border border-gray-200 w-10 h-10'>
                                                    <FaRegUser className="text-xl text-[#070707]" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h1 className="text-sm font-medium">{user?.name}</h1>
                                            <p className="text-xs text-[#777980] capitalize">{user?.role}</p>
                                        </div>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/setting/profile')}>
                                    <FaRegUser className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                    <FiLogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
