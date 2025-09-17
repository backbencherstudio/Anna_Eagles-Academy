
import React from 'react'
import RouteAudioGuard from '@/components/RouteAudioGuard'
import { UserMainLayout } from '@/app/_components/Student/UserSidebar/UserMainLayout';

export default function layout({ children }: { children: React.ReactNode }) {
  return (

    <UserMainLayout >
      <RouteAudioGuard />
      {children}
    </UserMainLayout>

  )
}
