'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { clearAuth, initializeFromToken, clearError } from '@/rtk/slices/authSlice';
import { useCheckAuthQuery, useLogoutMutation } from '@/rtk/api/authApi';
import LoadingOverlay from './Resuable/LoadingOverlay';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin' | 'student')[];
  requireAuth?: boolean;
}


const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};


export default function RouteGuard({
  children,
  allowedRoles = ['user', 'admin', 'student'],
  requireAuth = true
}: RouteGuardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const {
    isAuthenticated,
    user,
    isLoading,
    isInitialized,
    error
  } = useAppSelector((state) => state.auth);

  const hasToken = typeof document !== 'undefined' ? getCookie('token') !== null : false;
  
  const { refetch: checkAuth, isLoading: isCheckingAuth } = useCheckAuthQuery(undefined, {
    skip: !hasToken,
  });
  const [logout] = useLogoutMutation();

  const isAuthInProgress = isLoading || isCheckingAuth || (!isInitialized && hasToken);

  useEffect(() => {
    const initializeAuthCheck = async () => {
      const token = getCookie('token');

      if (token && !isAuthenticated && !isLoading) {
        try {
          await checkAuth();
        } catch (error) {
          // Don't initialize with token if /me fails - let error show
          dispatch(clearAuth());
        }
      } else if (!token && !isAuthenticated && !isInitialized) {
        dispatch(clearAuth());
      }
    };

    initializeAuthCheck();
  }, [dispatch, isAuthenticated, isInitialized, isLoading, hasToken, checkAuth]);

  useEffect(() => {
    if (!isAuthInProgress && isInitialized) {
      if (requireAuth && (!isAuthenticated || !hasToken)) {
        router.push('/login');
        return;
      }

      if (isAuthenticated && user && allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.includes(user?.role);

        if (!hasRequiredRole) {
          if (user?.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/user/dashboard');
          }
          return;
        }
      }

      if (isAuthenticated && (pathname === '/login' || pathname === '/sign-up')) {
        if (user?.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/user/dashboard');
        }
        return;
      }
    }
  }, [isAuthenticated, user, isAuthInProgress, isInitialized, pathname, router, allowedRoles, requireAuth, hasToken]);

  useEffect(() => {
    if (requireAuth && isAuthenticated && !hasToken) {
      logout();
      dispatch(clearAuth());
      router.push('/login');
    }
  }, [requireAuth, isAuthenticated, hasToken, dispatch, router, logout]);

  if (isAuthInProgress) {
    return <LoadingOverlay loadingText="Loading..." delay={500} />;
  }

  if (error && requireAuth && isInitialized && !isAuthInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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
                  dispatch(clearError());
                  await checkAuth();
                } catch (_) {
                  // ignore; slice handles error state
                }
              }}
              className="px-6 py-3 rounded-lg bg-[#0F2598] hover:bg-[#0F2598]/80 text-white font-medium transition-all duration-200"
            >
              Try again
            </button>
            <button
              onClick={() => {
                logout();
                dispatch(clearAuth());
                router.push('/login');
              }}
              className="px-6 py-3 rounded-lg border border-[#ECEFF3] text-[#111827] hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!requireAuth || (isAuthenticated && user && allowedRoles.includes(user?.role))) {
    return <>{children}</>;
  }

  if (!hasToken && requireAuth) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingOverlay loadingText="Redirecting to login..." delay={200} />
      </div>
    );
  }

  return <LoadingOverlay loadingText="Loading..." delay={300} />;
}
