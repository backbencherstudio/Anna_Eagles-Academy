
import AssignmentIconAc from '@/components/Icons/CustomIcon/ActiveIcon/AssignmentIconAc'
import CalanderIconAt from '@/components/Icons/CustomIcon/ActiveIcon/CalanderIconAt'
import CardIconAc from '@/components/Icons/CustomIcon/ActiveIcon/CardIconAc'
import ChartIconAc from '@/components/Icons/CustomIcon/ActiveIcon/ChartIconAc'
import CodeGenerateAc from '@/components/Icons/CustomIcon/ActiveIcon/CodeGenerateAc'
import DashboardIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DashboardIconAc'
import DonationIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DonationIconAc'
import MyCourseIconAc from '@/components/Icons/CustomIcon/ActiveIcon/MyCourseIconAc'
import QuestionIconAc from '@/components/Icons/CustomIcon/ActiveIcon/QuestionIconAc'
import StudentFileIconAc from '@/components/Icons/CustomIcon/ActiveIcon/StudentFileIconAc'
import UserManagementIconAc from '@/components/Icons/CustomIcon/ActiveIcon/UserManagementIconAc'
import AssignmentIcon from '@/components/Icons/CustomIcon/DectiveIcon/AssignmentIcon'
import CalanderIcon from '@/components/Icons/CustomIcon/DectiveIcon/CalanderIcon'
import CardIcon from '@/components/Icons/CustomIcon/DectiveIcon/CardIcon'
import ChartIcon from '@/components/Icons/CustomIcon/DectiveIcon/ChartIcon'
import CodeGenerate from '@/components/Icons/CustomIcon/DectiveIcon/CodeGenerate'
import DashboardIcon from '@/components/Icons/CustomIcon/DectiveIcon/DashboardIcon'
import DonationIcon from '@/components/Icons/CustomIcon/DectiveIcon/DonationIcon'
import MyCourseIcon from '@/components/Icons/CustomIcon/DectiveIcon/MyCourseIcon'
import QuestionIcon from '@/components/Icons/CustomIcon/DectiveIcon/QuestionIcon'
import StudentFileIcon from '@/components/Icons/CustomIcon/DectiveIcon/StudentFileIcon'
import UserManagementIcon from '@/components/Icons/CustomIcon/DectiveIcon/UserManagementIcon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useMemo } from 'react'
import { FiSettings } from 'react-icons/fi'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useAppSelector } from '@/rtk/hooks'



export const MENU_CONFIG = {
    admin: [
        {
            header: 'GENERAL',
            items: [
                { title: 'Dashboard', icon: DashboardIcon, activeIcon: DashboardIconAc, href: '/admin/dashboard', role: 'admin' },
                { title: 'Calendar', icon: CalanderIcon, activeIcon: CalanderIconAt, href: '/admin/calendar', role: 'admin' },
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
                        { title: 'Course List', href: '/admin/course-management', role: 'admin' },
                        { title: 'Materials Upload', href: '/admin/materials-upload', role: 'admin' }
                    ]
                },
                {
                    title: 'Assignments',
                    icon: AssignmentIcon,
                    activeIcon: AssignmentIconAc,
                    hasDropdown: true,
                    subItems: [
                        { title: 'Create new Assignment', href: '/admin/assignment-management', role: 'admin' },
                        { title: 'Awaiting Evaluation', href: '/admin/assignment-evaluation', role: 'admin' },
                        { title: 'Student file download', href: '/admin/student-file-download', role: 'admin' }
                    ]
                },
                { title: 'User Management', icon: UserManagementIcon, activeIcon: UserManagementIconAc, href: '/admin/users-management', role: 'admin' },
                { title: 'Code Generate', icon: CodeGenerate, activeIcon: CodeGenerateAc, href: '/admin/code-generate', role: 'admin' },
                { title: 'Teacher Section', icon: AssignmentIcon, activeIcon: AssignmentIconAc, href: '/admin/teacher-section', role: 'admin' },
                { title: 'Student Feedback', icon: StudentFileIcon, activeIcon: StudentFileIconAc, href: '/admin/student-feedback', role: 'admin' },
                { title: 'Donations', icon: DonationIcon, activeIcon: DonationIconAc, href: '/admin/donation', role: 'admin' },
                { title: 'Card Generator', icon: CardIcon, activeIcon: CardIconAc, href: '/admin/card-generator', role: 'admin' },
                { title: 'Reports', icon: ChartIcon, activeIcon: ChartIconAc, href: '/admin/reports', role: 'admin' },
                { title: 'Student Question', icon: QuestionIcon, activeIcon: QuestionIconAc, href: '/admin/student-question', role: 'admin' },
            ],
        },
        {
            header: 'OTHER',
            items: [
                { title: 'Setting', icon: FiSettings, href: '/admin/setting/profile', role: 'admin' },

            ],
        },
    ],
}
export interface SideBarMenuProps {
    role: 'admin'
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
                        ${isActive ? 'bg-[#FEF9F2] text-[#F1C27D] border border-[#F1C27D]/30 shadow-sm' : 'text-[#1D1F2C]/70 hover:bg-[#FEF9F2]  hover:shadow-sm'}
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



export default function SideBarMenuAdmin({ role: _role, isCollapsed, onMobileMenuClose }: SideBarMenuProps) {
    const { user: userData } = useAppSelector((state) => state.auth)
    const userType = (userData?.type || (userData as any)?.role || 'user') as 'user' | 'student' | 'admin'

    const isAdmin = userType === 'admin'

    const getAllowedRoles = (item: any): string[] => {
        if (Array.isArray(item.role)) return item.role
        if (item.role) return [item.role]
        if (Array.isArray(item.type)) return item.type
        if (item.type) return [item.type]
        return ['admin']
    }

    const rawSections = useMemo(() => MENU_CONFIG['admin'] || [], [])

    // Filter items and sub-items by role, and drop empty sections
    const menuSections = useMemo(() => {
        return (rawSections as any[])
            .map((section: any) => {
                const filteredItems = (section.items || []).map((item: any) => {
                    if (item.hasDropdown && Array.isArray(item.subItems)) {
                        const filteredSubItems = item.subItems.filter((subItem: any) => getAllowedRoles(subItem).includes(userType))
                        if (filteredSubItems.length === 0) return null
                        return { ...item, subItems: filteredSubItems }
                    }
                    return getAllowedRoles(item).includes(userType) ? item : null
                }).filter(Boolean)

                return { ...section, items: filteredItems }
            })
            .filter((section: any) => (section.items || []).length > 0)
    }, [rawSections, userType])
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

    if (!isAdmin) {
        return null
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
