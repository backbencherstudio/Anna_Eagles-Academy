'use client'
import React, { useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppSelector } from '@/rtk/hooks';
import { useLogoutMutation } from '@/rtk/api/authApi';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ProfileNavProps {
    className?: string;
}

export default function ProfileNav({ className = "" }: ProfileNavProps) {
    const router = useRouter();
    const [logout] = useLogoutMutation();
    const [imageError, setImageError] = useState(false);

    // Get user data from Redux store
    const { user } = useAppSelector((state) => state.auth);

    // Reset image error when user data changes (e.g., after profile update)
    React.useEffect(() => {
        setImageError(false);
    }, [user?.avatar_url]);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };


    const hanldeProfile = () => {
        if (user?.role === 'admin') {
            router.push('/admin/setting/profile');
        } else if (user?.role === 'user') {
            router.push('/user/setting/profile');
        }
    }

    const hanldeLogout = () => {
        handleLogout();
    }
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto cursor-pointer">
                        <div>
                            <div className="relative">
                                {user?.avatar_url && user?.avatar_url !== 'null' && user?.avatar_url !== '' && !imageError ? (
                                    <img
                                        src={user.avatar_url}
                                        alt="Profile picture"
                                        width={40}
                                        height={40}
                                        className='rounded-full w-10 h-10 object-cover'
                                        onError={() => {
                                            console.error('Image failed to load:', user.avatar_url);
                                            setImageError(true);
                                        }}
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <div className='p-2 cursor-pointer bg-[#F3F3F4] rounded-full flex items-center justify-center border border-gray-200 w-10 h-10'>
                                        <FaRegUser className="text-xl text-[#070707]" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {/* user name show korbe  */}
                    <DropdownMenuItem className='cursor-pointer flex 2xl:hidden items-center  gap-2' onClick={hanldeProfile}>
                        {user?.avatar_url && user?.avatar_url !== 'null' && user?.avatar_url !== '' && !imageError ? (
                            <Image
                                src={user.avatar_url}
                                alt="Profile picture"
                                width={40}
                                height={40}
                                className='rounded-full w-10 h-10 object-cover'
                            />
                        ) : (
                            <div className='p-2 cursor-pointer bg-[#F3F3F4] rounded-full flex items-center justify-center border border-gray-200 w-10 h-10'>
                                <FaRegUser className="text-xl text-[#070707]" />
                            </div>
                        )}
                        <div className='flex flex-col'>

                            <span className='text-sm font-medium capitalize'>{user?.name || 'User'}</span>
                            {/* role */}
                            <span className='text-xs  text-gray-500 uppercase font-medium'>{user?.type || user?.role}</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer flex items-center gap-2 hidden 2xl:flex' onClick={hanldeProfile}>
                        <FaRegUser className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={hanldeLogout} className="text-red-600 cursor-pointer">
                        <FiLogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* User Name Display - Right Side */}
            <div className="hidden 2xl:block">
                <div className="text-left">
                    <p className="text-sm font-medium text-[#111827]">{user?.name || 'User'}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${user?.role === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'text-white bg-[#22C55E]'
                            }`}>
                            {user?.type || user?.role}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}
