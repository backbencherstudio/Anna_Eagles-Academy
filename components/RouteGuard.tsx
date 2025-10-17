'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { clearAuth, initializeFromToken } from '@/rtk/slices/authSlice';
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
          dispatch(initializeFromToken(token));
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              logout();
              dispatch(clearAuth());
              router.push('/login');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!requireAuth || (isAuthenticated && user && allowedRoles.includes(user?.role))) {
    return <>{children}</>;
  }

  if (!hasToken) {
    return null;
  }

  return <LoadingOverlay loadingText="Loading..." delay={300} />;
}
