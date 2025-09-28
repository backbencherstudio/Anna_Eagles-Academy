'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdClose } from "react-icons/io";
import { MdArrowForwardIos } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import LoadingOverlay from '@/components/Resuable/LoadingOverlay';
import Logo from '@/components/Icons/Logo';
import USerSidebarMenu from './USerSidebarMenu';
import { useAppDispatch } from '@/rtk/hooks';
import { useLogoutMutation } from '@/rtk/api/authApi';

// Menu configuration and item rendering are encapsulated in SideBarMenu

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

export default function UserSidebar({ isMobileMenuOpen, onMobileMenuClose }: SidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logout, { isLoading }] = useLogoutMutation();
  const data = {
    name: 'John Doe',
    role: 'user'
  }

  if (!data?.role) {
    return null;
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      router.push('/login');
    }
  };

  // Navigation rendering moved to SideBarMenu

  return (
    <>
      {isLoading && <LoadingOverlay loadingText="Logging out" />}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
          ${isCollapsed ? 'md:w-16' : 'w-72'}
          bg-white border-r border-[#E9EAEC] overflow-hidden
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex relative items-center justify-between p-5 pb-5">
          <div className={`
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'opacity-0 max-w-0 w-0' : 'opacity-100 max-w-[240px] w-full'}
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

        {/* Main Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <USerSidebarMenu role={data?.role as 'user'} isCollapsed={isCollapsed} onMobileMenuClose={onMobileMenuClose} />
        </div>

        {/* Bottom Navigation - Logout - Fixed */}
        <nav className={`p-1  ${isCollapsed ? 'px-2' : ''} flex-shrink-0`}>
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

