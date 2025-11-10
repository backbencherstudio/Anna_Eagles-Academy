'use client';

import { useRouter } from 'next/navigation';
import ErrorPage from '@/components/Resuable/ErrorPage';

export default function NotFound() {
  const router = useRouter();

  return (
    <ErrorPage
      error={{
        status: 404,
        code: 'NOT_FOUND',
        message: 'The page you are looking for could not be found. It may have been moved or deleted.',
      }}
      onRetry={() => {
        router.back();
      }}
      onGoHome={() => {
        router.push('/');
      }}
    />
  );
}

