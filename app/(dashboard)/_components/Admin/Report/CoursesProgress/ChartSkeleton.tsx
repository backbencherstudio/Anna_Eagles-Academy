"use client"
import React from 'react'

type Props = {
    height?: number
    variant?: 'pie' | 'bar'
}

export default function ChartSkeleton({ height = 256, variant = 'bar' }: Props) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
            {/* header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="h-4 w-44 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            </div>

            {variant === 'pie' ? (
                <div className="flex h-[256px] items-center justify-center">
                    <div className="relative h-48 w-48 animate-pulse rounded-full border-8 border-gray-200">
                        <div className="absolute inset-6 rounded-full border-8 border-gray-100" />
                    </div>
                </div>
            ) : (
                <div className="h-[256px] w-full">
                    <div
                        className="grid h-full items-end gap-3"
                        style={{ gridTemplateColumns: `repeat(11, minmax(0, 1fr))` }}
                    >
                        {Array.from({ length: 11 }).map((_, idx) => (
                            <div key={idx} className="h-full flex flex-col items-center justify-end gap-2">
                                <div
                                    className="w-full animate-pulse rounded bg-gray-200"
                                    style={{ height: `${30 + ((idx * 13) % 65)}%` }}
                                />
                                <div className="h-2 w-10 animate-pulse rounded bg-gray-100" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


