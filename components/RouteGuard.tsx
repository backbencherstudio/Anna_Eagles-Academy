'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { checkAuth, clearAuth } from '@/redux/slices/authSlice';
import LoadingOverlay from './Resuable/LoadingOverlay';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin')[];
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

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export default function RouteGuard({
  children,
  allowedRoles = ['user', 'admin'],
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


  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie('token');

      if (token && !isAuthenticated && !isLoading) {

        try {
          // Add a timeout safeguard to avoid hanging on the loading overlay
          const timeoutPromise = new Promise((_, reject) => {
            const id = setTimeout(() => {
              clearTimeout(id);
              reject(new Error('Authentication timeout'));
            }, 10000);
          });

          await Promise.race([
            dispatch(checkAuth()).unwrap(),
            timeoutPromise,
          ]);
        } catch (error) {
          dispatch(clearAuth());
          deleteCookie('token');
        }
      } else if (!token && !isAuthenticated && !isInitialized) {
        dispatch(clearAuth());
      }
    };

    initializeAuth();
  }, [dispatch, isAuthenticated, isInitialized, isLoading, hasToken]);

  useEffect(() => {
    if (!isLoading && isInitialized) {
      if (requireAuth && (!isAuthenticated || !hasToken)) {
        router.push('/login');
        return;
      }

      if (isAuthenticated && user && allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.includes(user.role);

        if (!hasRequiredRole) {
          if (user.role === 'admin') {
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
  }, [isAuthenticated, user, isLoading, isInitialized, pathname, router, allowedRoles, requireAuth]);

  // If token disappears while authenticated, immediately clear and redirect
  useEffect(() => {
    if (requireAuth && isAuthenticated && !hasToken) {
      dispatch(clearAuth());
      router.push('/login');
    }
  }, [requireAuth, isAuthenticated, hasToken, dispatch, router]);

  if ((isLoading || !isInitialized) && hasToken) {
    return <LoadingOverlay loadingText="Authenticating" delay={500} />;
  }


  if (error && requireAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
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

  if (!requireAuth || (isAuthenticated && user && allowedRoles.includes(user.role))) {
    return <>{children}</>;
  }

  // No token: let the effect redirect to login without blocking overlay
  if (!hasToken) {
    return null;
  }

  return <LoadingOverlay loadingText="Authenticating" delay={300} />;
}
