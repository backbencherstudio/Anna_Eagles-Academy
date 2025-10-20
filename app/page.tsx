'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/rtk/hooks';
import { clearAuth, initializeFromToken } from '@/rtk/slices/authSlice';
import { useCheckAuthQuery } from '@/rtk/api/authApi';
import { getCookie } from '@/lib/tokenUtils';
import LoadingOverlay from '@/components/Resuable/LoadingOverlay';

export default function MainPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, isInitialized, error } = useAppSelector((state) => state.auth);

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
          // Don't initialize with token if /me fails - let error show
          dispatch(clearAuth());
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

  // Show error if authentication failed
  if (error && isInitialized && !isAuthInProgress) {
    return (
      <div className="h-full flex items-center justify-center min-h-[100vh]">
        <div className="text-center max-w-lg px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[#111827] mb-3">Authentication Error</h2>
          <p className="text-[#777980] text-base mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={async () => {
                try {
                  // simply retry the check
                  await checkAuth();
                } catch (_) { }
              }}
              className="px-6 py-3 cursor-pointer rounded-lg bg-[#0F2598] hover:bg-[#0F2598]/80 text-white font-medium transition-all duration-200"
            >
              Try again
            </button>
            <button
              onClick={() => {
                dispatch(clearAuth());
                router.push('/login');
              }}
              className="px-6 py-3 cursor-pointer rounded-lg border border-[#ECEFF3] text-[#111827] hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
