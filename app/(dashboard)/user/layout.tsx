import { MainLayout } from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import React from 'react'
import RouteAudioGuard from '@/components/RouteAudioGuard'

export default function layout({ children }: { children: React.ReactNode }) {
  return (

      <MainLayout >
        <RouteAudioGuard />
        {children}
      </MainLayout>

  )
}
