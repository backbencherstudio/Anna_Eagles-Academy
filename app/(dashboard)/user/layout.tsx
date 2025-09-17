
import React from 'react'
import RouteGuard from '@/components/RouteGuard'
import { UserMainLayout } from '@/app/_components/Student/UserSidebar/UserMainLayout';

export default function LayoutUser({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={['user']} requireAuth={true}>
      <UserMainLayout>
        {children}
      </UserMainLayout>
    </RouteGuard>
  )
}
