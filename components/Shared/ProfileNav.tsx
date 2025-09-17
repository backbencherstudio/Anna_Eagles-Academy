import React from 'react';
import { FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';

interface ProfileNavProps {
    className?: string;
}

export default function ProfileNav({ className = "" }: ProfileNavProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    // Get user data from Redux store
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto cursor-pointer">
                        <div>
                            <div className="relative">
                                {user?.avatar && user?.avatar !== 'null' && user?.avatar !== '' ? (
                                    <Image
                                        src={user.avatar}
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

            {/* User Name Display - Right Side */}
            <div className="hidden 2xl:block">
                <div className="text-left">
                    <p className="text-sm font-medium text-[#111827]">{user?.name || 'User'}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            user?.role === 'admin' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'text-white bg-[#22C55E]'
                        }`}>
                            {user?.role === 'admin' ? 'Admin' : 'Paid Student'}
                        </span>
                    </div>
                </div>
            </div>
          
        </div>
    );
}
