"use client"
import React from 'react'

type PieChartSkeletonProps = {
  height?: number
  outerSize?: number
  innerInset?: number
  showHeader?: boolean
}

export default function PieChartSkeleton({
  height = 256,
  outerSize = 192,
  innerInset = 24,
  showHeader = true
}: PieChartSkeletonProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {showHeader && (
        <div className="mb-4 flex items-center justify-between">
          <div className="h-4 w-44 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      )}

      <div className="flex items-center justify-center" style={{ height }}>
        <div
          className="relative animate-pulse rounded-full border-8 border-gray-200"
          style={{ width: outerSize, height: outerSize }}
        >
          <div
            className="absolute inset-0 rounded-full border-8 border-gray-100"
            style={{ inset: innerInset, }}
          />
        </div>
      </div>
    </div>
  )
}


