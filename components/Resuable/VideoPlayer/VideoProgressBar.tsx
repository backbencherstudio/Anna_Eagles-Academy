"use client"
import { useState } from "react";

interface VideoProgressBarProps {
    currentTime: number;
    duration: number;
    buffered: number;
    onSeek: (time: number) => void;
    isCompleted?: boolean;
    allowSeeking?: boolean;
}

export default function VideoProgressBar({
    currentTime,
    duration,
    buffered,
    onSeek,
    isCompleted = true,
    allowSeeking = true
}: VideoProgressBarProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPosition, setHoverPosition] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);

    // Helper function to format time
    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const time = pos * duration;

        setHoverTime(time);
        setHoverPosition(pos * 100);
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
        setHoverTime(null);
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging || !allowSeeking) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const seekTime = pos * duration;
        
        // If not completed, only allow seeking to already watched positions
        if (!isCompleted && seekTime > currentTime) {
            // Disallow seeking to unwatched positions
            return;
        }
        
        onSeek(seekTime);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!allowSeeking) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        
        const handleMouseMove = (e: MouseEvent) => {
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const seekTime = pos * duration;
            
            // If not completed, prevent seeking beyond current position
            if (!isCompleted && seekTime > currentTime) {
                return;
            }
            
            onSeek(seekTime);
        };
        
        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className={`relative h-2 group ${allowSeeking ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Unplayed portion - Gray background */}
            <div className="absolute inset-0 bg-gray-500/40 rounded-full"></div>

            {/* Buffered portion - Light gray */}
            <div
                className="absolute left-0 top-0 h-full bg-white/30 rounded-full"
                style={{ width: `${buffered}%` }}
            ></div>

            {/* Played portion - Gold/Orange */}
            <div
                className="absolute left-0 top-0 h-full bg-[#F1C27D] rounded-full"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            ></div>

            {/* Scrubber handle */}
            <div
                className="absolute bg-[#F1C27D] rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:scale-125"
                style={{
                    left: `calc(${duration > 0 ? (currentTime / duration) * 100 : 0}% - 6px)`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '12px',
                    height: '12px'
                }}
                onMouseDown={(e) => {
                    if (!allowSeeking) return;
                    e.stopPropagation();
                    e.preventDefault();
                    const progressBar = (e.currentTarget as HTMLElement).parentElement;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                        if (!progressBar) return;
                        const rect = progressBar.getBoundingClientRect();
                        if (rect) {
                            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                            const seekTime = pos * duration;
                            
                            // If not completed, prevent seeking beyond current position
                            if (!isCompleted && seekTime > currentTime) {
                                return;
                            }
                            
                            onSeek(seekTime);
                        }
                    };
                    
                    const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                }}
            ></div>

            {/* Hover Tooltip */}
            {showTooltip && hoverTime !== null && (
                <div
                    className="absolute bottom-full mb-2 bg-black/90 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none z-30"
                    style={{
                        left: `${hoverPosition}%`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    {formatTime(hoverTime)}
                </div>
            )}
        </div>
    );
}

