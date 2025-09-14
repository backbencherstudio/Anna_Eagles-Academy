import React, { useState } from 'react'
import Link from 'next/link'
import { FiSettings } from 'react-icons/fi'
import { usePathname } from 'next/navigation'
import { MdKeyboardArrowDown } from 'react-icons/md'
import DashboardIcon from '@/components/Icons/CustomIcon/DectiveIcon/DashboardIcon'
import DashboardIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DashboardIconAc'
import CalanderIcon from '@/components/Icons/CustomIcon/DectiveIcon/CalanderIcon'
import CalanderIconAt from '@/components/Icons/CustomIcon/ActiveIcon/CalanderIconAt'
import DiscoverIcon from '@/components/Icons/CustomIcon/DectiveIcon/DiscoverIcon'
import DiscoverIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DiscoverIconAc'
import MyCourseIcon from '@/components/Icons/CustomIcon/DectiveIcon/MyCourseIcon'
import MyCourseIconAc from '@/components/Icons/CustomIcon/ActiveIcon/MyCourseIconAc'
import AssignmentIcon from '@/components/Icons/CustomIcon/DectiveIcon/AssignmentIcon'
import AssignmentIconAc from '@/components/Icons/CustomIcon/ActiveIcon/AssignmentIconAc'
import StudentFileIcon from '@/components/Icons/CustomIcon/DectiveIcon/StudentFileIcon'
import StudentFileIconAc from '../Icons/CustomIcon/ActiveIcon/StudentFileIconAc'
import DownloadMaterialsIcon from '@/components/Icons/CustomIcon/DectiveIcon/DownloadMaterialsIcon'
import DownloadMaterialsIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DownloadMaterialsIconAc'
import ContactTeacherIcon from '@/components/Icons/CustomIcon/DectiveIcon/ContactTeacherIcon'
import ContactTeacherIconAc from '@/components/Icons/CustomIcon/ActiveIcon/ContactTeacherIconAc'
import DiplomaIcon from '@/components/Icons/CustomIcon/DectiveIcon/DiplomaIcon'
import DiplomaIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DiplomaIconAc'
import DonationIcon from '@/components/Icons/CustomIcon/DectiveIcon/DonationIcon'
import DonationIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DonationIconAc'
import SettingsIcon from '@/components/Icons/CustomIcon/DectiveIcon/SettingsIcon'
import SettingsIconAc from '@/components/Icons/CustomIcon/ActiveIcon/SettingsIconAc'
import UserManagementIcon from '@/components/Icons/CustomIcon/DectiveIcon/UserManagementIcon'
import UserManagementIconAc from '@/components/Icons/CustomIcon/ActiveIcon/UserManagementIconAc'
import CardIcon from '@/components/Icons/CustomIcon/DectiveIcon/CardIcon'
import CardIconAc from '@/components/Icons/CustomIcon/ActiveIcon/CardIconAc'
import ChartIcon from '@/components/Icons/CustomIcon/DectiveIcon/ChartIcon'
import ChartIconAc from '@/components/Icons/CustomIcon/ActiveIcon/ChartIconAc'
import PolicyIcon from '@/components/Icons/CustomIcon/DectiveIcon/PolicyIcon'
import PolicyIconAc from '@/components/Icons/CustomIcon/ActiveIcon/PolicyIconAc'
import CodeGenerateAc from '../Icons/CustomIcon/ActiveIcon/CodeGenerateAc'
import CodeGenerate from '../Icons/CustomIcon/DectiveIcon/CodeGenerate'
import QuestionIconAc from '../Icons/CustomIcon/ActiveIcon/QuestionIconAc'
import QuestionIcon from '../Icons/CustomIcon/DectiveIcon/QuestionIcon'

export const MENU_CONFIG = {
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
                { title: 'Privacy Policy', icon: PolicyIcon, activeIcon: PolicyIconAc, href: '/privacy-policy' },
            ],
        },
    ],

    admin: [
        {
            header: 'GENERAL',
            items: [
                { title: 'Dashboard', icon: DashboardIcon, activeIcon: DashboardIconAc, href: '/dashboard' },
                { title: 'Calendar', icon: CalanderIcon, activeIcon: CalanderIconAt, href: '/calendar' },
            ],
        },
        {
            header: 'COURSES',
            items: [
                {
                    title: 'Course Management',
                    icon: MyCourseIcon,
                    activeIcon: MyCourseIconAc,
                    hasDropdown: true,
                    subItems: [
                        { title: 'Course List', href: '/course-management' },
                        { title: 'Materials Upload', href: '/materials-upload' }
                    ]
                },
                {
                    title: 'Assignments',
                    icon: AssignmentIcon,
                    activeIcon: AssignmentIconAc,
                    hasDropdown: true,
                    subItems: [
                        { title: 'Create new Assignment', href: '/assignment-management' },
                        { title: 'Awaiting Evaluation', href: '/assignment-evaluation' },
                        { title: 'Student file download', href: '/student-file-download' }
                    ]
                },
                { title: 'User Management', icon: UserManagementIcon, activeIcon: UserManagementIconAc, href: '/users-management' },
                { title: 'Code Generate', icon: CodeGenerate, activeIcon: CodeGenerateAc, href: '/code-generate' },
                { title: 'Teacher Section', icon: AssignmentIcon, activeIcon: AssignmentIconAc, href: '/teacher-section' },
                { title: 'Student Feedback', icon: StudentFileIcon, activeIcon: StudentFileIconAc, href: '/student-feedback' },
                { title: 'Donations', icon: DonationIcon, activeIcon: DonationIconAc, href: '/donation' },
                { title: 'Card Generator', icon: CardIcon, activeIcon: CardIconAc, href: '/card-generator' },
                { title: 'Reports', icon: ChartIcon, activeIcon: ChartIconAc, href: '/reports' },
                { title: 'Student Question', icon: QuestionIcon, activeIcon: QuestionIconAc, href: '/student-question' },
            ],
        },
        {
            header: 'OTHER',
            items: [
                { title: 'Setting', icon: FiSettings, href: '/setting/profile' },
            ],
        },
    ],
} as const

export interface SideBarMenuProps {
    role: 'student' | 'admin'
    isCollapsed: boolean
    onMobileMenuClose: () => void
}

function DropdownItem({ subItem, isCollapsed, onMobileMenuClose, isActive, isLast }: {
    subItem: any;
    isCollapsed: boolean;
    onMobileMenuClose: () => void;
    isActive: boolean;
    isLast: boolean;
}) {
    const handleLinkClick = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            onMobileMenuClose()
        }
    }

    return (
        <div className="relative">
            <Link
                href={subItem.href}
                onClick={handleLinkClick}
                className={`
                    relative flex items-center text-[14px] font-[500] ml-8
                    ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
                    p-2.5 rounded-lg transition-all duration-200 group
                    ${isActive ? 'text-[#F1C27D]' : 'text-[#1D1F2C]/70 hover:text-[#F1C27D]'}
                `}
                title={isCollapsed ? subItem.title : ''}
            >
                {/* Tree node indicator */}
                {!isCollapsed && (
                    <div className={`
                        w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0 transition-colors duration-200
                        ${isActive ? 'bg-[#F1C27D]' : 'bg-gray-400 group-hover:bg-[#F1C27D]'}
                    `}></div>
                )}

                <span
                    className={`
                        transition-all duration-300 ease-in-out
                        ${isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-[200px] ml-1'}
                        ${isActive ? 'font-medium' : ''}
                        overflow-hidden whitespace-nowrap align-middle inline-block
                    `}
                >
                    {subItem.title}
                </span>
            </Link>
        </div>
    )
}

function NavLink({ item, isCollapsed, onMobileMenuClose, isDropdownOpen, onToggleDropdown }: {
    item: any;
    isCollapsed: boolean;
    onMobileMenuClose: () => void;
    isDropdownOpen: boolean;
    onToggleDropdown: () => void;
}) {
    const pathname = usePathname()

    // Check if any sub-item is active
    const isSubItemActive = item.subItems?.some((subItem: any) =>
        pathname === subItem.href || pathname.startsWith(subItem.href + '/')
    ) || false

    // Check if main item is active (for items without dropdown)
    const isMainItemActive = 'href' in item ? pathname === item.href || pathname.startsWith(item.href + '/') : false

    const isActive = isMainItemActive || isSubItemActive
    const IconComponent = isActive && item.activeIcon ? item.activeIcon : item.icon

    const handleLinkClick = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            onMobileMenuClose()
        }
    }

    const handleMainItemClick = () => {
        if (item.hasDropdown) {
            onToggleDropdown()
        } else {
            handleLinkClick()
        }
    }

    if ('onClick' in item) {
        return (
            <button
                onClick={(e) => {
                    if (item.onClick) item.onClick(e)
                    handleLinkClick()
                }}
                className={`
					w-full flex items-center text-[15px] cursor-pointer font-[600]
					${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
					p-3 rounded-lg text-[#4A4C56] hover:bg-gray-100
					${isActive ? 'bg-[#FEF9F2] text-[#F1C27D] border border-[#F1C27D]/30' : ''}
				`}
                title={isCollapsed ? item.title : ''}
            >
                <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#F1C27D]' : 'text-gray-500'}`} />
                <span
                    className={`
						transition-all duration-300 ease-in-out
						${isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-[160px] ml-2'}
						${isActive ? 'font-medium' : ''}
						overflow-hidden whitespace-nowrap align-middle inline-block
					`}
                >
                    {item.title}
                </span>
            </button>
        )
    }

    // Handle dropdown items
    if (item.hasDropdown) {
        return (
            <div className="space-y-0 relative">
                <button
                    onClick={handleMainItemClick}
                    className={`
                        w-full flex items-center text-[15px] cursor-pointer font-[600] group
                        ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
                        p-3 rounded-lg transition-all duration-200
                        ${isActive ? 'bg-[#FEF9F2] text-[#F1C27D] border border-[#F1C27D]/30 shadow-sm' : 'text-[#1D1F2C]/70 hover:bg-[#FEF9F2] hover:text-[#F1C27D] hover:shadow-sm'}
                    `}
                    title={isCollapsed ? item.title : ''}
                >
                    <IconComponent className={`
                        text-xl shrink-0 transition-colors duration-200
                        ${isActive ? 'text-[#F1C27D]' : 'text-gray-500 group-hover:text-[#F1C27D]'}
                    `} />
                    <span
                        className={`
                            transition-all duration-300 ease-in-out
                            ${isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-[220px] ml-2'}
                            ${isActive ? 'font-medium' : ''}
                            overflow-hidden whitespace-nowrap align-middle inline-block
                        `}
                    >
                        {item.title}
                    </span>
                    {!isCollapsed && (
                        <div className="ml-auto transition-transform duration-200">
                            <MdKeyboardArrowDown className={`
                                w-4 h-4 transition-all duration-200
                                ${isDropdownOpen ? 'text-[#F1C27D] rotate-0' : 'text-gray-500 -rotate-90'}
                            `} />
                        </div>
                    )}
                </button>

                {/* Dropdown sub-items with smooth animation */}
                <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'max-h-0 opacity-0' : isDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                    {!isCollapsed && item.subItems && (
                        <div className="space-y-0.5 pt-1 pb-2 relative">
                            {/* Single tree line for all sub-items */}
                            {isDropdownOpen && (
                                <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200"></div>
                            )}
                            {item.subItems.map((subItem: any, subIndex: number) => {
                                const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/')
                                const isLast = subIndex === item.subItems.length - 1
                                return (
                                    <div key={subIndex} className="relative">
                                        {/* Horizontal connector line for each item */}
                                        {isDropdownOpen && (
                                            <div className="absolute left-6 top-4 w-3 h-px bg-gray-200"></div>
                                        )}
                                        <DropdownItem
                                            subItem={subItem}
                                            isCollapsed={isCollapsed}
                                            onMobileMenuClose={onMobileMenuClose}
                                            isActive={isSubActive}
                                            isLast={isLast}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Regular link items
    return (
        <Link
            href={item.href}
            onClick={handleLinkClick}
            className={`
				flex items-center text-[15px] font-[600]
				${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
				p-3 rounded-lg
				${isActive ? 'bg-[#FEF9F2] text-[#F1C27D] border border-[#F1C27D]/30' : 'text-[#1D1F2C]/70 hover:bg-[#FEF9F2]'}
			`}
            title={isCollapsed ? item.title : ''}
        >
            <IconComponent className={`
				text-xl shrink-0
				${isActive ? 'text-[#F1C27D]' : 'text-gray-500'}
			`} />
            <span
                className={`
					transition-all duration-300 ease-in-out
					${isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-[220px] ml-2'}
					${isActive ? 'font-medium' : ''}
					overflow-hidden whitespace-nowrap align-middle inline-block
				`}
            >
                {item.title}
            </span>
        </Link>
    )
}

export default function SideBarMenu({ role, isCollapsed, onMobileMenuClose }: SideBarMenuProps) {
    const menuSections = MENU_CONFIG[role] || []
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
    const pathname = usePathname()

    // Auto-open dropdowns when sub-items are active
    React.useEffect(() => {
        const newOpenDropdowns: { [key: string]: boolean } = {}

        menuSections.forEach((section: any) => {
            section.items.forEach((item: any) => {
                if (item.hasDropdown && item.subItems) {
                    // Check if any sub-item is active
                    const hasActiveSubItem = item.subItems.some((subItem: any) =>
                        pathname === subItem.href || pathname.startsWith(subItem.href + '/')
                    )

                    if (hasActiveSubItem) {
                        newOpenDropdowns[item.title] = true
                    }
                }
            })
        })

        setOpenDropdowns(prev => ({
            ...prev,
            ...newOpenDropdowns
        }))
    }, [pathname, menuSections])

    const toggleDropdown = (itemTitle: string) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [itemTitle]: !prev[itemTitle]
        }))
    }

    return (
        <nav className={`px-3 space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
            {menuSections.map((section: any, sIdx: number) => (
                <div key={sIdx} className="mb-5">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isCollapsed ? 'hidden' : 'text-gray-400'}`}>
                        {section.header}
                    </div>
                    <div className='space-y-2 text-sm'>
                        {section.items.map((item: any, iIdx: number) => (
                            <NavLink
                                key={iIdx}
                                item={item}
                                isCollapsed={isCollapsed}
                                onMobileMenuClose={onMobileMenuClose}
                                isDropdownOpen={openDropdowns[item.title] || false}
                                onToggleDropdown={() => toggleDropdown(item.title)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    )
}
