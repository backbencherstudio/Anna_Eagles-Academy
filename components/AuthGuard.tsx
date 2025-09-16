'use client'

import { useUserData } from '@/context/UserDataContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { user, isAuthenticated, isLoading } = useUserData();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            // Redirect authenticated users to their appropriate dashboard
            if (user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/user/dashboard');
            }
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-8 w-8" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If authenticated, show loading while redirecting
    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-8 w-8" />
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, show the auth page
    return <>{children}</>;
} 