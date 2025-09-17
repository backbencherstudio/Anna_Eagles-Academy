'use client';

import { useState, useEffect } from 'react';

interface LoadingOverlayProps {
    loadingText?: string;
    delay?: number; 
}

export default function LoadingOverlay({ 
    loadingText = "Processing", 
    delay = 300 
}: LoadingOverlayProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="relative bg-white/10 backdrop-blur-xl rounded-xl p-8 flex flex-col items-center gap-6">
                
                <div className="w-16 h-16 relative">
                    <svg
                        className="w-full h-full text-[#27A376]"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            className="opacity-20"
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="10"
                        />
                        <path
                            className="animate-[dash_1.5s_ease-in-out_infinite]"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeLinecap="round"
                            d="M 50,50 m -45,0 a 45,45 0 1,1 90,0"
                            style={{
                                strokeDasharray: '283',
                                strokeDashoffset: '283',
                            }}
                        />
                    </svg>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-1">
                    <h3 className="text-white/90 text-xl font-medium">
                        {loadingText}
                    </h3>
                    <p className="text-white/60 text-sm">
                        Please wait a moment...
                    </p>
                </div>
            </div>
        </div>
    );
} 