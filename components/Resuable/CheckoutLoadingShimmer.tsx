'use client'
import React from 'react'

// Shimmer loading components
const ShimmerBox = ({ className = '' }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const ShimmerText = ({ lines = 1, className = '' }: { lines?: number; className?: string }) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <ShimmerBox key={i} className="h-4 w-full" />
        ))}
    </div>
);

// Checkout loading shimmer component
export default function CheckoutLoadingShimmer() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full mx-auto">
            {/* Payment Methods Section */}
            <div className="w-full lg:w-7/12">
                <ShimmerBox className="h-6 w-32 mb-3" />

                {/* Stripe Payment Form */}
                <div className="bg-white shadow rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <ShimmerBox className="h-5 w-40" />
                        <div className='flex items-center gap-2'>
                            <ShimmerBox className="w-10 h-6" />
                            <ShimmerBox className="w-10 h-6" />
                        </div>
                    </div>

                    {/* Card Form */}
                    <div className="space-y-4">
                        <ShimmerBox className="h-12 w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <ShimmerBox className="h-12 w-full" />
                            <ShimmerBox className="h-12 w-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Section */}
            <div className="w-full lg:w-5/12">
                <ShimmerBox className="h-6 w-32 mb-3" />

                {/* Course Series */}
                <div className="bg-white shadow rounded-xl p-5 mb-4">
                    <div className="flex gap-4 items-center mb-4">
                        <ShimmerBox className="w-20 h-20 rounded-lg" />
                        <div className="flex-1">
                            <ShimmerBox className="h-5 w-48 mb-2" />
                            <ShimmerBox className="h-3 w-24 mb-1" />
                            <ShimmerBox className="h-6 w-16" />
                        </div>
                    </div>

                    {/* Course List */}
                    <div className="mt-4">
                        <ShimmerBox className="h-3 w-32 mb-3" />
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="relative flex items-center">
                                        <ShimmerBox className="w-6 h-6 rounded-full" />
                                        <div className="ml-8 flex-1 flex items-center justify-between">
                                            <ShimmerBox className="h-4 w-32" />
                                            <ShimmerBox className="h-4 w-12" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coupon Section */}
                <div className="bg-white shadow rounded-xl p-5 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ShimmerBox className="w-4 h-4" />
                        <ShimmerBox className="h-3 w-16" />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <ShimmerBox className="h-8 w-full" />
                        <ShimmerBox className="h-8 w-16" />
                    </div>
                </div>

                {/* Sub Total */}
                <div className="flex flex-col gap-2 bg-white shadow rounded-xl p-5">
                    <div className="flex justify-between items-center">
                        <ShimmerBox className="h-4 w-20" />
                        <ShimmerBox className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between items-center">
                        <ShimmerBox className="h-4 w-16" />
                        <ShimmerBox className="h-4 w-12" />
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="flex justify-between items-center mt-1">
                        <ShimmerBox className="h-5 w-12" />
                        <ShimmerBox className="h-6 w-20" />
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center gap-3 mt-6">
                    <ShimmerBox className="w-4 h-4 rounded" />
                    <ShimmerBox className="h-4 w-64" />
                </div>

                {/* Pay Button */}
                <ShimmerBox className="h-12 w-full mt-6" />
            </div>
        </div>
    );
}
