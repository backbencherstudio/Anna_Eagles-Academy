'use client'
import React, { useState } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { IoMdClose } from "react-icons/io";
import { MdArrowForwardIos, MdDashboard, MdOutlineManageAccounts, MdOutlinePostAdd, MdOutlineTopic, MdOutlineCalendarToday, MdAssignment, MdMenuBook } from 'react-icons/md';
import { FiLogOut, FiSettings, FiGlobe } from 'react-icons/fi';
import { FaUsers, FaUserShield } from 'react-icons/fa';
import LoadingOverlay from '../Resuable/LoadingOverlay';
import Logo from '../Icons/Logo';



const adminMenuItems = [
    { title: "Dashboard", icon: MdDashboard, href: "/dashboard", role: "admin" },
    { title: "Manage Posts", icon: MdOutlinePostAdd, href: "/dashboard/manage-posts", role: "admin" },
    { title: "User Management", icon: MdOutlineManageAccounts, href: "/dashboard/users-management", role: "admin" },
    { title: "Topic Management", icon: MdOutlineTopic, href: "/dashboard/topics-management", role: "admin" },
    { title: "Advanced Posse", icon: FaUserShield, href: "/dashboard/advanced-posse", role: "admin" },
    { title: "Posse Management", icon: FaUsers, href: "/dashboard/posse-management", role: "admin" },
    { title: "Settings", icon: FiSettings, href: "/dashboard/settings", role: "admin" },
];


// student menu items with sections
const studentMenuSections = [
    {
        header: 'GENERAL',
        items: [
            { title: 'Dashboard', icon: MdDashboard, href: '/dashboard', role: 'student' },
            { title: 'Calendar', icon: MdOutlineCalendarToday, href: '/dashboard/calendar', role: 'student' },
        ],
    },
    {
        header: 'COURSES',
        items: [
            { title: 'Discover', icon: FiGlobe, href: '/dashboard/discover', role: 'student' },
            { title: 'My Courses', icon: MdMenuBook, href: '/dashboard/my-courses', role: 'student' },
            { title: 'Assignments', icon: MdAssignment, href: '/dashboard/assignments', role: 'student' },
        ],
    },
    {
        header: 'OTHER',
        items: [
            { title: 'Setting', icon: FiSettings, href: '/dashboard/setting', role: 'student' },
        ],
    },
];

interface SidebarProps {
    isMobileMenuOpen: boolean;
    onMobileMenuClose: () => void;
}

export default function Sidebar({ isMobileMenuOpen, onMobileMenuClose }: SidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = {
        name: 'John Doe',
        role: 'student',
        avatar_url: '',
    }
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };



    const bottomMenuItems = [
        { title: "Logout", icon: FiLogOut, onClick: () => { } },
    ];

    type MenuItem = typeof adminMenuItems[0] | typeof bottomMenuItems[0] | (typeof studentMenuSections[0]['items'][0]);
    const NavLink = ({ item }: { item: MenuItem }) => {
        const isActive = 'href' in item ? pathname === item.href : false;

        if ('onClick' in item) {
            return (
                <button
                    onClick={item.onClick}
                    className={`
                        w-full flex items-center text-[15px] cursor-pointer font-[600] transition-all duration-200
                        ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
                        p-3 rounded-lg text-[#4A4C56] hover:bg-gray-100
                    `}
                    title={isCollapsed ? item.title : ''}
                >
                    <item.icon className="w-5 h-5 shrink-0 text-gray-500" />
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
                className={`
                    flex items-center text-[15px] font-[600] transition-all duration-200
                    ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
                    p-3 rounded-lg
                    ${isActive ? 'bg-[#FEF9F2] text-[#F1C27D] border border-[#F1C27D]/30' : 'text-[#1D1F2C]/70 hover:bg-[#FEF9F2]'}
                `}
                title={isCollapsed ? item.title : ''}
            >
                <item.icon className={`
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
                                <h2 className="text-lg font-semibold leading-6 text-[#1D1F2C] font-sans">The White <br /> Eagles Academy</h2>
                            </span>
                        </div>
                    </div>

                    {/* Toggle button for large screens */}
                    <div className='absolute -right-2  '>
                        <button
                            className='hidden md:block cursor-pointer shrink-0 transition-transform duration-300'
                            onClick={toggleCollapse}
                        >
                            <div className={`transition-transform duration-300 group border border-[#E9EAEC] shadow-sm bg-gray-200 p-2 rounded-md ${isCollapsed ? 'rotate-180' : ''}`}>
                                {isCollapsed ? (
                                    <MdArrowForwardIos className='text-xl  text-gray-600 group-hover:text-[#8D58FA]' />
                                ) : (
                                    <MdArrowForwardIos className='text-xl text-gray-600 group-hover:text-[#8D58FA]' />
                                )}
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

                {/* Top Menu Items */}
                <nav className={`flex-1 p-4  space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
                    {user?.role === 'admin' ? (
                        adminMenuItems.map((item, index) => (
                            <NavLink key={index} item={item} />
                        ))
                    ) : (
                        studentMenuSections.map((section, sIdx) => (
                            <div key={sIdx} className="mb-5">
                                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isCollapsed ? 'hidden' : 'text-gray-400'}`}>{section.header}</div>
                                <p className='space-y-2 text-sm'>
                                    {section.items.map((item, iIdx) => (
                                        <NavLink key={iIdx} item={item} />
                                    ))}
                                </p>
                            </div>
                        ))
                    )}
                </nav>

                {/* Bottom Menu Items */}
                <nav className={`p-4 space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
                    <div className="border-t border-gray-200 pt-2">

                        {
                            bottomMenuItems.map((item, index) => (
                                <NavLink key={index} item={item} />
                            ))
                        }
                    </div>
                </nav>
            </aside>
        </>
    );
}

