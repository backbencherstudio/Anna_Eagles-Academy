'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { checkAuth, clearAuth } from '@/redux/slices/authSlice';
import { getCookie } from '@/lib/tokenUtils';
import LoadingOverlay from '@/components/Resuable/LoadingOverlay';

export default function MainPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie('token');

      if (token && !isInitialized && !isLoading) {
        try {
          await dispatch(checkAuth()).unwrap();
        } catch (error) {
          dispatch(clearAuth());
        }
      } else if (!token && !isInitialized) {
        dispatch(clearAuth());
      }
    };

    initializeAuth();
  }, [dispatch, isInitialized, isLoading]);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } else {

      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, isInitialized, router]);

  if (!isInitialized || isLoading) {
    return <LoadingOverlay loadingText="Loading..." delay={300} />;
  }
  return null;
}
