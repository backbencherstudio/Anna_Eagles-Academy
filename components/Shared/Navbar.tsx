'use client'
import React, { useState, useEffect } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";

import { usePathname, useSearchParams } from 'next/navigation';
import MainNotification from './MainNotification';
import Language from './Laguage';
import ProfileNav from './ProfileNav';
import { useNotificationCount } from '@/hooks/useNotificationCount';
import { useAppSelector } from '@/rtk/hooks';

interface NavbarProps {
    onMobileMenuToggle: () => void;
    isMobileMenuOpen: boolean;
    notificationCount?: number;
}

export default function Navbar({ onMobileMenuToggle, notificationCount }: NavbarProps) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const currentNotificationCount = useNotificationCount();
    const searchParams = useSearchParams();
    
    // Get user data from Redux store
    const { user: userData, isAuthenticated } = useAppSelector((state) => state.auth);

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
        // common
        'dashboard': 'Hi, ' + userData?.name,
        // admin
        'calendar': 'Calendar',
        'course-management': 'Course Management',
        'create-course': 'Create Course',
        'materials-upload': 'Materials Upload',
        'assignment-management': 'Assignment Management',
        'assignment-evaluation': 'Assignment Evaluation',
        'student-file-download': 'Student File Download',
        'users-management': 'Users Management',
        'code-generate': 'Code Generate',
        'teacher-section': 'Teacher Section',
        'student-feedback': 'Student Feedback',
        'donation': 'Donation',
        'card-generator': 'Card Generator',
        'reports': 'Reports',
        'student-question': 'Student Question',


        // user
        'schedule': 'Schedule',
        'discover': 'Discover',
        'payment-success': 'Payment Success',
        'my-courses': 'My Courses',
        'assignments': 'Assignments',
        'student-files': 'Student Files',
        'download-materials': 'Download Materials',
        'contact-teacher': 'Contact Teacher',
        'diploma': 'Diploma',
        'donations': 'Donations',
        'privacy-policy': 'Privacy Policy',
    };


    // admin dyanmic titles
    const assignmentTabTitles = {
        'quiz': 'Quiz Management',
    };

    const cardGeneratorTabTitles = {
        'createCard': 'Create Card',
        'cardHistory': 'Card History',
    };

    // Tab-specific titles for reports
    const reportsTabTitles = {
        'website-usage': 'Website Usage',
        'financial-reports': 'Financial Reports',
        'course-progress': 'Course Progress',
        'payments': 'Payments',
        'enrollment': 'Enrollment',
        'overview': 'Payments > Overview',
        'fully-paid': 'Payments > Fully Paid',
        'sponsored': 'Payments > Sponsored',
        'free-enrolled': 'Payments > Free Enrolled',
    };

    // Function to get dynamic title based on pathname for admin
    const getDynamicTitle = () => {
        // Special case for dashboard
        if (pathname === '/user/dashboard') {
            return `Welcome Back, ${userData?.name || 'User'}`;
        }

        if (pathname === '/admin/assignment-management') {
            const tab = searchParams.get('tab');
            if (tab && assignmentTabTitles[tab as keyof typeof assignmentTabTitles]) {
                return assignmentTabTitles[tab as keyof typeof assignmentTabTitles];
            }
            return 'Assignment Management';
        }

        if (pathname === '/admin/card-generator') {
            const tab = searchParams.get('tab');
            if (tab && cardGeneratorTabTitles[tab as keyof typeof cardGeneratorTabTitles]) {
                return cardGeneratorTabTitles[tab as keyof typeof cardGeneratorTabTitles];
            }
            return 'Card Generator';
        }
        if (pathname === '/admin/reports') {
            const tab = searchParams.get('tab');
            const paymentTab = searchParams.get('paymentTab');

            if (tab === 'payments' && paymentTab && reportsTabTitles[paymentTab as keyof typeof reportsTabTitles]) {
                return reportsTabTitles[paymentTab as keyof typeof reportsTabTitles];
            }

            if (tab && reportsTabTitles[tab as keyof typeof reportsTabTitles]) {
                return reportsTabTitles[tab as keyof typeof reportsTabTitles];
            }
            return 'Reports';
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
                        {isAuthenticated && userData ? (
                            <>
                                <h1 className="text-[18px] xl:text-[20px] font-semibold text-[#111827] hidden sm:block">
                                    {getDynamicTitle()}
                                </h1>
                                {pathname === '/user/dashboard' && userData?.role === 'user' && (
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
                {
                    pathname === '/user/dashboard' && isAuthenticated && userData?.role === 'user' && (
                        <div className="hidden xl:flex items-center justify-center">
                            <div className="max-w-[860px] w-full bg-[#F1C27D1A] px-4 sm:px-6 py-3 sm:py-4 rounded-tl-[48px] rounded-br-[48px] rounded-tr-[10px] rounded-bl-[10px]">
                                <p className="text-[#0F172A] italic text-[13px] leading-relaxed text-center font-medium">
                                    "For I know the plans I have for you, declares the Lord, plans to <br /> prosper you and not to harm you, to give you hope and a future."
                                </p>
                                <p className="text-center text-[#E2A93B] text-[12px] sm:text-[14px] font-semibold mt-1">— Jeremiah 29:11</p>
                            </div>
                        </div>
                    )
                }

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
