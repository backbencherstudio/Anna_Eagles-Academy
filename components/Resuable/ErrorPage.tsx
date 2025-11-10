'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorPageProps {
  error?: {
    message?: string;
    code?: string;
    status?: number;
  };
  onRetry?: () => void;
  onGoHome?: () => void;
}

export default function ErrorPage({ error, onRetry, onGoHome }: ErrorPageProps) {
  const router = useRouter();

  const getErrorDetails = () => {
    const errorMessage = error?.message || '';
    const errorCode = error?.code || '';
    const status = error?.status;

    // Network errors
    if (errorCode === 'ERR_NAME_NOT_RESOLVED' || errorMessage.includes('ERR_NAME_NOT_RESOLVED')) {
      return {
        title: 'Connection Error',
        description: 'Unable to reach the server. Please check your internet connection and try again.',
        icon: '🌐',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      };
    }

    if (errorCode === 'ERR_NETWORK' || errorMessage.includes('Network Error')) {
      return {
        title: 'Network Error',
        description: 'There was a problem connecting to the server. Please check your connection.',
        icon: '📡',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
      };
    }

    if (errorCode === 'ECONNABORTED' || errorMessage.includes('timeout')) {
      return {
        title: 'Request Timeout',
        description: 'The request took too long to complete. Please try again.',
        icon: '⏱️',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      };
    }

    // HTTP errors
    if (status === 401) {
      return {
        title: 'Authentication Required',
        description: 'Your session has expired. Please log in again to continue.',
        icon: '🔒',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    }

    if (status === 403) {
      return {
        title: 'Access Denied',
        description: 'You do not have permission to access this resource.',
        icon: '🚫',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    }

    if (status === 404) {
      return {
        title: 'Not Found',
        description: 'The requested resource could not be found.',
        icon: '🔍',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      };
    }

    if (status === 500 || status === 502 || status === 503) {
      return {
        title: 'Server Error',
        description: 'The server encountered an error. Please try again later.',
        icon: '⚠️',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    }

    // Default error
    return {
      title: 'Something Went Wrong',
      description: errorMessage || 'An unexpected error occurred. Please try again.',
      icon: '❌',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    };
  };

  const errorDetails = getErrorDetails();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className={`max-w-md w-full ${errorDetails.bgColor} ${errorDetails.borderColor} border-2 rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105`}>
        <div className="text-7xl mb-6 animate-bounce">{errorDetails.icon}</div>
        
        <h1 className={`text-3xl font-bold ${errorDetails.color} mb-4`}>
          {errorDetails.title}
        </h1>
        
        <p className="text-gray-700 mb-8 leading-relaxed">
          {errorDetails.description}
        </p>

        {error?.status && (
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
              Error Code: {error.status}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            🔄 Try Again
          </button>
        
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If the problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

