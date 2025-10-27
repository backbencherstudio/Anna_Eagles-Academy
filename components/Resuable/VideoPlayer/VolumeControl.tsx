"use client"
import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VolumeControlProps {
    volume: number;
    isMuted: boolean;
    onVolumeChange: (volume: number) => void;
    onToggleMute: () => void;
}

export default function VolumeControl({
    volume,
    isMuted,
    onVolumeChange,
    onToggleMute
}: VolumeControlProps) {
    const [showSlider, setShowSlider] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShowSlider(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowSlider(false);
        }, 300);
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        onVolumeChange(Math.max(0, Math.min(1, pos)));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        const sliderDiv = e.currentTarget as HTMLElement;
        const rect = sliderDiv.getBoundingClientRect();

        const handleMouseMove = (e: MouseEvent) => {
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            onVolumeChange(pos);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className="flex items-center gap-2 ml-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Mobile: Just mute button, Desktop: Mute button + slider */}
            <button
                onClick={onToggleMute}
                className="text-white cursor-pointer hover:text-[#F1C27D] transition-colors p-2 touch-manipulation"
            >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            {/* Inline Volume Slider - Hidden on mobile, shown on desktop */}
            <div
                className={`hidden sm:block h-1.5 transition-all duration-300 overflow-visible ease-in-out ${showSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}
                onMouseEnter={handleMouseEnter}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
            >
                <div className="relative h-full cursor-pointer">
                    {/* Background track */}
                    <div className="absolute inset-0 bg-gray-500/40 rounded-full"></div>

                    {/* Filled portion - Gold/Orange */}
                    <div
                        className="absolute left-0 top-0 h-full bg-[#F1C27D] rounded-full transition-all duration-150"
                        style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    ></div>

                    {/* Visible handle */}
                    <div
                        className={`absolute bg-[#F1C27D] rounded-full cursor-grab active:cursor-grabbing transition-all duration-150 ${showSlider ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                            }`}
                        style={{
                            left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '12px',
                            height: '12px'
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const sliderDiv = (e.currentTarget as HTMLElement).parentElement?.parentElement;

                            if (!sliderDiv) return;
                            const rect = sliderDiv.getBoundingClientRect();
                            const initialX = e.clientX;
                            const initialVolume = isMuted ? 0 : volume;

                            const handleMouseMove = (e: MouseEvent) => {
                                const delta = e.clientX - initialX;
                                const deltaPercent = delta / rect.width;
                                const newVolume = Math.max(0, Math.min(1, initialVolume + deltaPercent));
                                onVolumeChange(newVolume);
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
            </div>
        </div>
    );
}

