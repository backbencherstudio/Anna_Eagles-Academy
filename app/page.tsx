'use client'

import { useUserData } from '@/context/UserDataContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HomePage from '../components/HomePage';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show the home page
  if (!isAuthenticated) {
    return <HomePage />;
  }

  // If authenticated, show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
