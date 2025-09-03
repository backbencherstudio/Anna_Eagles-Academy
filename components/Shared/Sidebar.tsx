'use client'
import React, { useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { IoMdClose } from "react-icons/io";
import { MdArrowForwardIos } from 'react-icons/md';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import LoadingOverlay from '../Resuable/LoadingOverlay';
import Logo from '../Icons/Logo';
import { useUserData } from '@/context/UserDataContext'; 
import DashboardIcon from '@/components/Icons/CustomIcon/DectiveIcon/DashboardIcon';
import DashboardIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DashboardIconAc';
import CalanderIcon from '@/components/Icons/CustomIcon/DectiveIcon/CalanderIcon';
import CalanderIconAt from '@/components/Icons/CustomIcon/ActiveIcon/CalanderIconAt';
import DiscoverIcon from '@/components/Icons/CustomIcon/DectiveIcon/DiscoverIcon';
import DiscoverIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DiscoverIconAc';
import MyCourseIcon from '@/components/Icons/CustomIcon/DectiveIcon/MyCourseIcon';
import MyCourseIconAc from '@/components/Icons/CustomIcon/ActiveIcon/MyCourseIconAc';
import AssignmentIcon from '@/components/Icons/CustomIcon/DectiveIcon/AssignmentIcon';
import AssignmentIconAc from '@/components/Icons/CustomIcon/ActiveIcon/AssignmentIconAc';
import StudentFileIcon from '../Icons/CustomIcon/DectiveIcon/StudentFileIcon';
import StudentFileIconAc from '../Icons/CustomIcon/ActiveIcon/StudentFileIconAc';
import DownloadMaterialsIcon from '../Icons/CustomIcon/DectiveIcon/DownloadMaterialsIcon';
import DownloadMaterialsIconAc from '../Icons/CustomIcon/ActiveIcon/DownloadMaterialsIconAc';
import ContactTeacherIcon from '../Icons/CustomIcon/DectiveIcon/ContactTeacherIcon';
import ContactTeacherIconAc from '../Icons/CustomIcon/ActiveIcon/ContactTeacherIconAc';
import DiplomaIcon from '../Icons/CustomIcon/DectiveIcon/DiplomaIcon';
import DiplomaIconAc from '../Icons/CustomIcon/ActiveIcon/DiplomaIconAc';
import DonationIcon from '../Icons/CustomIcon/DectiveIcon/DonationIcon';
import DonationIconAc from '../Icons/CustomIcon/ActiveIcon/DonationIconAc';
import SettingsIcon from '../Icons/CustomIcon/DectiveIcon/SettingsIcon';
import SettingsIconAc from '../Icons/CustomIcon/ActiveIcon/SettingsIconAc';
import UserManagementIcon from '../Icons/CustomIcon/DectiveIcon/UserManagementIcon';
import UserManagementIconAc from '../Icons/CustomIcon/ActiveIcon/UserManagementIconAc';
import CardIcon from '../Icons/CustomIcon/DectiveIcon/CardIcon';
import CardIconAc from '../Icons/CustomIcon/ActiveIcon/CardIconAc';
import ChartIcon from '../Icons/CustomIcon/DectiveIcon/ChartIcon';
import ChartIconAc from '../Icons/CustomIcon/ActiveIcon/ChartIconAc';

const MENU_CONFIG = {
    student: [
        {
            header: 'GENERAL',
            items: [
                { title: 'Dashboard', icon: DashboardIcon, activeIcon: DashboardIconAc, href: '/dashboard' },
                { title: 'Calander', icon: CalanderIcon, activeIcon: CalanderIconAt, href: '/schedule' },
            ],
        },
        {
            header: 'COURSES',
            items: [
                { title: 'Discover', icon: DiscoverIcon, activeIcon: DiscoverIconAc, href: '/discover' },
                { title: 'My Courses', icon: MyCourseIcon, activeIcon: MyCourseIconAc, href: '/my-courses' },
                { title: 'Assignments', icon: AssignmentIcon, activeIcon: AssignmentIconAc, href: '/assignments' },
                { title: 'Student Files', icon: StudentFileIcon, activeIcon: StudentFileIconAc, href: '/student-files' },
                { title: 'Download Materials', icon: DownloadMaterialsIcon, activeIcon: DownloadMaterialsIconAc, href: '/download-materials' },
                { title: 'Contact Teacher', icon: ContactTeacherIcon, activeIcon: ContactTeacherIconAc, href: '/contact-teacher' },
                { title: 'Diploma', icon: DiplomaIcon, activeIcon: DiplomaIconAc, href: '/diploma' },
                { title: 'Donations', icon: DonationIcon, activeIcon: DonationIconAc, href: '/donations' },
            ],
        },
        {
            header: 'OTHER',
            items: [
                { title: 'Setting', icon: SettingsIcon, activeIcon: SettingsIconAc, href: '/setting/profile' },
            ],
        },
    ],
    admin: [
        {
            header: 'GENERAL',
            items: [
                { title: 'Dashboard', icon: DashboardIcon, activeIcon: DashboardIconAc, href: '/dashboard' },
                { title: 'Calendar', icon: CalanderIcon, activeIcon: CalanderIconAt, href: '/calendar' },
                { title: 'User Management', icon: UserManagementIcon, activeIcon: UserManagementIconAc, href: '/users-management' },
            ],
        },
        {
            header: 'COURSES',
            items: [
                { title: 'Course Management', icon: MyCourseIcon, activeIcon: MyCourseIconAc, href: '/course-management' },
                { title: 'Assignments', icon: AssignmentIcon, activeIcon: AssignmentIconAc, href: '/assignment-management' },
                { title: 'Teacher Section', icon: AssignmentIcon, activeIcon: AssignmentIconAc, href: '/teacher-section' },
                { title: 'Student Feedback', icon: StudentFileIcon, activeIcon: StudentFileIconAc, href: '/student-feedback' },
                { title: 'Donations', icon: DonationIcon, activeIcon: DonationIconAc, href: '/donation' },
                { title: 'Card Generator', icon: CardIcon, activeIcon: CardIconAc, href: '/card-generator' },
                { title: 'Reports', icon: ChartIcon, activeIcon: ChartIconAc, href: '/reports' },
            ],
        },
        {
            header: 'OTHER',
            items: [
                { title: 'Setting', icon: FiSettings, href: '/setting/profile' },
            ],
        },
    ],
};

interface SidebarProps {
    isMobileMenuOpen: boolean;
    onMobileMenuClose: () => void;
}

export default function Sidebar({ isMobileMenuOpen, onMobileMenuClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user, logout } = useUserData();

    if (!user?.role) {
        return null;
    }

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        setIsLoading(true);
        logout();
        router.push('/login');
    };

    const menuSections = MENU_CONFIG[user.role as keyof typeof MENU_CONFIG] || [];

    const NavLink = ({ item }: { item: any }) => {
        const isActive = 'href' in item ? pathname === item.href : false;
        const IconComponent = isActive && item.activeIcon ? item.activeIcon : item.icon;

        const handleLinkClick = () => {

            if (window.innerWidth < 768) { 
                onMobileMenuClose();
            }
        };

        if ('onClick' in item) {
            return (
                <button
                    onClick={(e) => {
                        if (item.title === 'Logout') {
                            handleLogout();
                        } else {
                            item.onClick(e);
                        }
                        handleLinkClick();
                    }}
                    className={`
            w-full flex items-center text-[15px] cursor-pointer font-[600] transition-all duration-200
            ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
            p-3 rounded-lg text-[#4A4C56] hover:bg-gray-100
          `}
                    title={isCollapsed ? item.title : ''}
                >
                    <IconComponent className="w-5 h-5 shrink-0 text-gray-500" />
                    <span className={`
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-[160px] ml-2'}
            ${isActive ? 'font-medium' : ''}
            overflow-hidden whitespace-nowrap align-middle inline-block
          `}>
                        {item.title}
                    </span>
                </button>
            );
        }

        return (
            <Link
                href={item.href}
                onClick={handleLinkClick}
                className={`
          flex items-center text-[15px] font-[600] transition-all duration-200
          ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
          p-3 rounded-lg
          ${isActive ? 'bg-[#FEF9F2] text-[#F1C27D] border border-[#F1C27D]/30' : 'text-[#1D1F2C]/70 hover:bg-[#FEF9F2]'}
        `}
                title={isCollapsed ? item.title : ''}
            >
                <IconComponent className={`
          text-xl shrink-0
          ${isActive ? '' : 'text-gray-500'}
        `} />
                <span className={`
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-[160px] ml-2'}
          ${isActive ? 'font-medium' : ''}
          overflow-hidden whitespace-nowrap align-middle inline-block
        `}>
                    {item.title}
                </span>
            </Link>
        );
    };

    return (
        <>
            {isLoading && <LoadingOverlay loadingText="Logging out" />}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
          ${isCollapsed ? 'md:w-16' : 'w-64'}
          bg-white border-r border-[#E9EAEC] overflow-hidden
          flex flex-col
        `}
            >
                {/* Header */}
                <div className="flex relative items-center justify-between p-5 pb-5">
                    <div className={`
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'opacity-0 max-w-0 w-0' : 'opacity-100 max-w-[220px] w-full'}
          `}>
                        <div className="flex items-center gap-4">
                            <Logo />
                            <span
                                className={`transition-all duration-300 ease-in-out inline-block align-middle
                ${isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-[160px] ml-2'}
                overflow-hidden whitespace-nowrap`}
                            >
                                <h2 className="text-lg font-semibold leading-6 text-[#1D1F2C] font-sans">
                                    The White <br /> Eagles Academy
                                </h2>
                            </span>
                        </div>

                        {/* <div className='w-full h-full'>
                            <Image src="/images/logo/logo2.jpg" alt="logo" width={1000} height={500} className='rounded w-48 mx-auto h-full object-cover' />
                        </div> */}
                    </div>

                    {/* Toggle button for large screens */}
                    <div className='absolute -right-2'>
                        <button
                            className='hidden md:block cursor-pointer shrink-0 transition-transform duration-300'
                            onClick={toggleCollapse}
                        >
                            <div className={`transition-transform duration-300 group border border-[#E9EAEC] shadow-sm bg-gray-200 p-2 rounded-md ${isCollapsed ? 'rotate-180' : ''}`}>
                                <MdArrowForwardIos className='text-xl text-gray-600 group-hover:text-[#8D58FA]' />
                            </div>
                        </button>
                    </div>

                    {/* Close button for mobile */}
                    <button
                        className={`p-2 rounded-lg hover:bg-gray-100 md:hidden
              transition-opacity duration-300
              ${isCollapsed ? 'opacity-0' : 'opacity-100'}
            `}
                        onClick={onMobileMenuClose}
                    >
                        <IoMdClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className={`flex-1 p-4 space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
                    {menuSections.map((section, sIdx) => (
                        <div key={sIdx} className="mb-5">
                            <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isCollapsed ? 'hidden' : 'text-gray-400'}`}>
                                {section.header}
                            </div>
                            <div className='space-y-2 text-sm'>
                                {section.items.map((item, iIdx) => (
                                    <NavLink key={iIdx} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Navigation - Logout */}
                <nav className={`p-4 space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
                    <div className="border-t border-gray-200 pt-2">
                        <button
                            onClick={() => {
                                handleLogout();
                                // Close mobile sidebar when logout is clicked
                                if (window.innerWidth < 768) { 
                                    onMobileMenuClose();
                                }
                            }}
                            className={`
                w-full flex items-center text-[15px] cursor-pointer font-[600] transition-all duration-200
                ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
                p-3 rounded-lg text-[#4A4C56] hover:bg-gray-100
              `}
                            title={isCollapsed ? 'Logout' : ''}
                        >
                            <FiLogOut className="w-5 h-5 shrink-0 text-gray-500" />
                            <span className={`
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-[160px] ml-2'}
                overflow-hidden whitespace-nowrap align-middle inline-block
              `}>
                                Logout
                            </span>
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
}

