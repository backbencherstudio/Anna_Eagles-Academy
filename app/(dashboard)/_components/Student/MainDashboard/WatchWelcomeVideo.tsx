import React from 'react'
import { Play } from 'lucide-react'

export default function WatchWelcomeVideo() {
    return (
        <div className="w-full bg-[#0F2598] rounded-xl px-5 py-4  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4">
            {/* Left side - Text content */}
            <div className="flex-1 space-y-2">
                <h2 className="text-white text-lg sm:text-lg lg:text-xl font-semibold leading-tight font-spline-sans">
                    Welcome to Your Learning Journey!
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-spline-sans">
                    Join our new "Advanced Biblical Studies" course starting next Monday!
                </p>
            </div>

            {/* Right side - Watch Video Button */}
            <div className="flex-shrink-0">
                <button className="bg-gray-200 hover:bg-gray-300 transition-colors duration-200 rounded-lg px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 text-gray-800 font-medium text-sm font-spline-sans">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Watch Welcome Video</span>
                </button>
            </div>
        </div>
    )
}
