"use client"
import { useState, useRef } from "react";

interface VideoProgressBarProps {
    currentTime: number;
    duration: number;
    buffered: number;
    onSeek: (time: number) => void;
}

export default function VideoProgressBar({
    currentTime,
    duration,
    buffered,
    onSeek
}: VideoProgressBarProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        onSeek(pos * duration);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        
        const handleMouseMove = (e: MouseEvent) => {
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            onSeek(pos * duration);
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
            className="relative h-2 cursor-pointer group" 
            onClick={handleClick}
            onMouseDown={handleMouseDown}
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
                    e.stopPropagation();
                    e.preventDefault();
                    const progressBar = (e.currentTarget as HTMLElement).parentElement;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                        if (!progressBar) return;
                        const rect = progressBar.getBoundingClientRect();
                        if (rect) {
                            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                            onSeek(pos * duration);
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
        </div>
    );
}

