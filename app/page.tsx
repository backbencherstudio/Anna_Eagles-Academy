'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { clearAuth, initializeAuth, initializeFromToken } from '@/redux/slices/authSlice';
import { useCheckAuthQuery } from '@/redux/api/authApi';
import { getCookie } from '@/lib/tokenUtils';
import LoadingOverlay from '@/components/Resuable/LoadingOverlay';

export default function MainPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, isInitialized } = useAppSelector((state) => state.auth);
  
  const hasToken = typeof document !== 'undefined' ? getCookie('token') !== null : false;
  const { refetch: checkAuth, isLoading: isCheckingAuth } = useCheckAuthQuery(undefined, { 
    skip: !hasToken || isAuthenticated 
  });

  // Check if we're in the middle of authentication process
  const isAuthInProgress = isLoading || isCheckingAuth || (!isInitialized && hasToken);

  useEffect(() => {
    const initializeAuthCheck = async () => {
      const token = getCookie('token');

      if (token && !isInitialized && !isLoading) {
        try {
          await checkAuth();
        } catch (error) {
          // If we have a token but /me fails, still initialize auth with token
          dispatch(initializeFromToken(token));
        }
      } else if (!token && !isInitialized) {
        dispatch(clearAuth());
      }
    };

    initializeAuthCheck();
  }, [dispatch, isInitialized, isLoading, checkAuth]);

  useEffect(() => {
    // Only proceed with routing logic if authentication process is complete
    if (!isAuthInProgress && isInitialized) {
      if (isAuthenticated && user) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/user/dashboard');
        }
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, user, isAuthInProgress, isInitialized, router]);

  if (isAuthInProgress) {
    return <LoadingOverlay loadingText="Loading..." delay={300} />;
  }
  return null;
}
