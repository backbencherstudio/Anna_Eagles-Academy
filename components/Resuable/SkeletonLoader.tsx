'use client'

import React from 'react'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

// Video Card Skeleton
export function VideoCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#ECEFF3] shadow-none">
      <div className="p-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-200">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}

// Document Card Skeleton
export function DocumentCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Skeleton className="w-24 h-20 rounded-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Audio Card Skeleton
export function AudioCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
      <div className="mb-3 sm:mb-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mb-3 sm:mb-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="w-full h-10 rounded-lg" />
    </div>
  )
}

// Grid Skeleton Loader
export function GridSkeletonLoader({ 
  count = 6, 
  type = 'video' 
}: { 
  count?: number
  type?: 'video' | 'document' | 'audio'
}) {
  const renderSkeleton = () => {
    switch (type) {
      case 'video':
        return <VideoCardSkeleton />
      case 'document':
        return <DocumentCardSkeleton />
      case 'audio':
        return <AudioCardSkeleton />
      default:
        return <VideoCardSkeleton />
    }
  }

  return (
    <div className={`grid gap-6 ${
      type === 'video' ? 'sm:grid-cols-2 lg:grid-cols-3' :
      type === 'audio' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' :
      'space-y-4'
    }`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}
