import React, { useState, useEffect } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import { useUserData } from '@/context/UserDataContext';
import { usePathname } from 'next/navigation';
import MainNotification from './MainNotification';
import Language from './Laguage';
import ProfileNav from './ProfileNav';
import { useNotificationCount } from '@/hooks/useNotificationCount';

interface NavbarProps {
    onMobileMenuToggle: () => void;
    isMobileMenuOpen: boolean;
    notificationCount?: number;
}



export default function Navbar({ onMobileMenuToggle, notificationCount }: NavbarProps) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const { user } = useUserData();
    const currentNotificationCount = useNotificationCount();

    const handleLanguageChange = (languageCode: string) => {
        // Here you can add logic to change the app language
        // For example, using i18n or context
        // console.log('Language changed to:', languageCode);
    };

    // Dynamic title system - handles all route types including dynamic routes with query parameters
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const currentPath = pathSegments[pathSegments.length - 1] || 'dashboard';

    const titleMap = {
        'dashboard': 'Hi, ' + user?.name,
        'schedule': 'My Schedule',
        'discover': 'Discover Courses',
        'student-files': 'Student Files',
        'download-materials': 'Download Materials',
        'contact-teacher': 'Contact Teacher',
        'diploma': 'Diploma',
        'donations': 'Donations',
        'card-generator': 'Card Generator',
        'reports': 'Reports',
        'teacher-section': 'Teacher Section',
        'student-feedback': 'Student Feedback',
        'donation': 'Donation',
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


    };

    // Function to get dynamic title based on pathname
    const getDynamicTitle = () => {
        // Special case for dashboard
        if (currentPath === 'dashboard') {
            return `Welcome Back, ${user?.name}`;
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





    return (
        <header className="bg-white z-10 ">
            <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
                        onClick={onMobileMenuToggle}
                    >
                        <HiMenuAlt3 className="w-6 h-6" />
                    </button>

                    {/* poem section */}
                    <div className='flex flex-col'>
                        {user ? (
                            <>
                                <h1 className="text-[18px] xl:text-[20px] font-semibold text-[#111827] hidden sm:block">
                                    {getDynamicTitle()}
                                </h1>
                                {currentPath === 'dashboard' && user.role === 'student' && (
                                    <span className="text-[12px] xl:text-[14px] text-[#777980] mt-1 hidden lg:block">
                                        Let's boost your knowledge today and learn a new things
                                    </span>
                                )}
                            </>
                        ) : (
                            <h1 className="text-[24px] font-semibold text-[#111827]">&nbsp;</h1>
                        )}
                    </div>
                </div>

                {/* Quote chip (poem section) */}
                <div className="hidden xl:flex items-center justify-center">
                    <div className="max-w-[860px] w-full bg-[#F1C27D1A] px-4 sm:px-6 py-3 sm:py-4 rounded-tl-[48px] rounded-br-[48px] rounded-tr-[10px] rounded-bl-[10px]">
                        <p className="text-[#0F172A] italic text-[13px] leading-relaxed text-center font-medium">
                            "For I know the plans I have for you, declares the Lord, plans to <br /> prosper you and not to harm you, to give you hope and a future."
                        </p>
                        <p className="text-center text-[#E2A93B] text-[12px] sm:text-[14px] font-semibold mt-1">— Jeremiah 29:11</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">

                    {/* language dropdown */}
                    <Language onLanguageChange={handleLanguageChange} />

                    {/* notification dropdown */}
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
                        <div className='absolute -right-18 sm:-right-0 md:-right-5 top-12'>
                            {isNotificationOpen && (
                                <MainNotification
                                    isOpen={isNotificationOpen}
                                    onClose={() => setIsNotificationOpen(false)}
                                    isDropdown={true}
                                />
                            )}
                        </div>
                    </div>

                    {/* profile dropdown */}
                    <ProfileNav />
                </div>
            </div>
        </header>
    );
}
