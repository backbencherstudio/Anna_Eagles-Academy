import AssignmentIconAc from '@/components/Icons/CustomIcon/ActiveIcon/AssignmentIconAc'
import CalanderIconAt from '@/components/Icons/CustomIcon/ActiveIcon/CalanderIconAt'
import ContactTeacherIconAc from '@/components/Icons/CustomIcon/ActiveIcon/ContactTeacherIconAc'
import DashboardIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DashboardIconAc'
import DiplomaIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DiplomaIconAc'
import DiscoverIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DiscoverIconAc'
import DonationIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DonationIconAc'
import DownloadMaterialsIconAc from '@/components/Icons/CustomIcon/ActiveIcon/DownloadMaterialsIconAc'
import MyCourseIconAc from '@/components/Icons/CustomIcon/ActiveIcon/MyCourseIconAc'
import PolicyIconAc from '@/components/Icons/CustomIcon/ActiveIcon/PolicyIconAc'
import SettingsIconAc from '@/components/Icons/CustomIcon/ActiveIcon/SettingsIconAc'
import StudentFileIconAc from '@/components/Icons/CustomIcon/ActiveIcon/StudentFileIconAc'
import AssignmentIcon from '@/components/Icons/CustomIcon/DectiveIcon/AssignmentIcon'
import CalanderIcon from '@/components/Icons/CustomIcon/DectiveIcon/CalanderIcon'
import ContactTeacherIcon from '@/components/Icons/CustomIcon/DectiveIcon/ContactTeacherIcon'
import DashboardIcon from '@/components/Icons/CustomIcon/DectiveIcon/DashboardIcon'
import DiplomaIcon from '@/components/Icons/CustomIcon/DectiveIcon/DiplomaIcon'
import DiscoverIcon from '@/components/Icons/CustomIcon/DectiveIcon/DiscoverIcon'
import DonationIcon from '@/components/Icons/CustomIcon/DectiveIcon/DonationIcon'
import DownloadMaterialsIcon from '@/components/Icons/CustomIcon/DectiveIcon/DownloadMaterialsIcon'
import MyCourseIcon from '@/components/Icons/CustomIcon/DectiveIcon/MyCourseIcon'
import PolicyIcon from '@/components/Icons/CustomIcon/DectiveIcon/PolicyIcon'
import SettingsIcon from '@/components/Icons/CustomIcon/DectiveIcon/SettingsIcon'
import StudentFileIcon from '@/components/Icons/CustomIcon/DectiveIcon/StudentFileIcon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useAppSelector } from '@/rtk/hooks'

export const MENU_CONFIG = {
    user: [
        {
            header: 'GENERAL',
            items: [
                { title: 'Dashboard', icon: DashboardIcon, activeIcon: DashboardIconAc, href: '/user/dashboard', role: ['user', 'student'] },
                { title: 'Calander', icon: CalanderIcon, activeIcon: CalanderIconAt, href: '/user/schedule', role: 'student' },
            ],
        },
        {
            header: 'COURSES',
            items: [
                { title: 'Discover', icon: DiscoverIcon, activeIcon: DiscoverIconAc, href: '/user/discover', type: ['user', 'student'] },
                { title: 'My Courses', icon: MyCourseIcon, activeIcon: MyCourseIconAc, href: '/user/my-courses', role: 'student' },
                { title: 'Assignments', icon: AssignmentIcon, activeIcon: AssignmentIconAc, href: '/user/assignments', role: 'student' },
                { title: 'Student Files', icon: StudentFileIcon, activeIcon: StudentFileIconAc, href: '/user/student-files', role: 'student' },
                { title: 'Download Materials', icon: DownloadMaterialsIcon, activeIcon: DownloadMaterialsIconAc, href: '/user/download-materials', role: 'student' },
                { title: 'Contact Teacher', icon: ContactTeacherIcon, activeIcon: ContactTeacherIconAc, href: '/user/contact-teacher', role: ['user', 'student'] },
                { title: 'Diploma', icon: DiplomaIcon, activeIcon: DiplomaIconAc, href: '/user/diploma', role: 'student' },
                { title: 'Donations', icon: DonationIcon, activeIcon: DonationIconAc, href: '/user/donations', role: ['user', 'student'] },
            ],
        },
        {
            header: 'OTHER',
            items: [
                { title: 'Setting', icon: SettingsIcon, activeIcon: SettingsIconAc, href: '/user/setting/profile', role: ['user', 'student'] },
                { title: 'Privacy Policy', icon: PolicyIcon, activeIcon: PolicyIconAc, href: '/user/privacy-policy', role: ['user', 'student'] },
            ],
        },
    ],
} as const

export interface SideBarMenuProps {
    role: 'user' | 'student' | 'admin'
    isCollapsed: boolean
    onMobileMenuClose: () => void
}

function NavLink({ item, isCollapsed, onMobileMenuClose }: {
    item: any;
    isCollapsed: boolean;
    onMobileMenuClose: () => void;
}) {
    const pathname = usePathname()

    // Check if item is active
    const isActive = 'href' in item ? pathname === item.href || pathname.startsWith(item.href + '/') : false
    const IconComponent = isActive && item.activeIcon ? item.activeIcon : item.icon

    const handleLinkClick = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            onMobileMenuClose()
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

export default function USerSidebarMenu({ role: _role, isCollapsed, onMobileMenuClose }: SideBarMenuProps) {
    const { user: userData } = useAppSelector((state) => state.auth)
    const userType = (userData?.type || (userData as any)?.role || 'user') as 'user' | 'student' | 'admin'

    const menuSections = MENU_CONFIG['user'] || []

    const getAllowedRoles = (item: any): string[] => {
        if (Array.isArray(item.role)) return item.role
        if (item.role) return [item.role]
        if (Array.isArray(item.type)) return item.type
        if (item.type) return [item.type]
        return ['user', 'student']
    }

    const filteredSections = menuSections
        .map((section: any) => {
            const filteredItems = (section.items || []).filter((item: any) => getAllowedRoles(item).includes(userType))
            return { ...section, items: filteredItems }
        })
        .filter((section: any) => (section.items || []).length > 0)

    return (
        <nav className={`px-3 space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
            {filteredSections.map((section: any, sIdx: number) => (
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
                            />
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    )
}