"use client";

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[100vh] h-full flex items-center justify-center px-4 bg-white ">
            <div className="max-w-lg w-full text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#777980]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-[#111827] mb-3">Page not found</h2>
                    <p className="text-[#777980] text-base">We couldn't find the page you're looking for.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-lg bg-[#0F2598] hover:bg-[#0F2598]/80 text-white font-medium transition-all duration-200"
                    >
                        Go home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 rounded-lg border border-[#ECEFF3] text-[#111827] hover:bg-gray-50 font-medium transition-all duration-200"
                    >
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );
}