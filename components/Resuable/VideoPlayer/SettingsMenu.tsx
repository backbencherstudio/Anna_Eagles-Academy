"use client"
import { useState, useRef, useEffect } from "react";
import { Settings, PictureInPicture, ChevronRight } from "lucide-react";

interface SettingsMenuProps {
    playbackRate: number;
    isTheaterMode: boolean;
    showPlaybackSpeed?: boolean;
    showTheaterModeOption?: boolean;
    showPictureInPictureOption?: boolean;
    onPlaybackRateChange: (rate: number) => void;
    onToggleTheaterMode?: () => void;
    onTogglePictureInPicture: () => void;
}

export default function SettingsMenu({
    playbackRate,
    isTheaterMode,
    showPlaybackSpeed = true,
    showTheaterModeOption = true,
    showPictureInPictureOption = true,
    onPlaybackRateChange,
    onToggleTheaterMode,
    onTogglePictureInPicture
}: SettingsMenuProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Get readable playback rate label
    const getPlaybackLabel = (rate: number) => {
        if (rate === 0.25) return '0.25x';
        if (rate === 0.5) return '0.5x';
        if (rate === 0.75) return '0.75x';
        if (rate === 1) return 'Normal';
        if (rate === 1.25) return '1.25x';
        if (rate === 1.5) return '1.5x';
        if (rate === 1.75) return '1.75x';
        if (rate === 2) return '2x';
        return `${rate}x`;
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (menuRef.current && !menuRef.current.contains(target)) {
                setShowMenu(false);
                setShowSpeedMenu(false);
                setIsRotating(false); // Reset rotation when menu closes
            }
        };

        if (showMenu) {
            // Use setTimeout to avoid immediate trigger when opening menu
            const timeoutId = setTimeout(() => {
                document.addEventListener('click', handleClickOutside, true);
            }, 100);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('click', handleClickOutside, true);
            };
        }
    }, [showMenu]);

    return (
        <div className="relative" data-settings-menu ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsRotating(!isRotating);
                    setShowMenu(!showMenu);
                }}
                className="text-white cursor-pointer hover:text-[#F1C27D] transition-colors p-2 touch-manipulation"
                title="Settings"
            >
                <Settings 
                    size={20}
                    className="sm:w-6 sm:h-6"
                    style={{ 
                        transform: `rotate(${isRotating ? 45 : 0}deg)`,
                        transition: 'transform 0.3s ease-in-out'
                    }} 
                />
            </button>

            {/* Settings Dropdown - YouTube Style */}
            <div 
                className={`absolute bottom-full right-0 mb-2 bg-black/60 backdrop-blur-sm rounded-lg shadow-xl z-50 overflow-hidden w-72 transition-all duration-300 ease-in-out ${
                    showMenu 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
            >
                {showMenu && (
                    <>
                        {/* If showing speed menu - show speed options */}
                        {showSpeedMenu ? (
                        <>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowSpeedMenu(false);
                                }}
                                className="w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-800/50 text-white flex items-center gap-3 border-b border-gray-700/50"
                            >
                                <ChevronRight className="rotate-180" size={20} />
                                <span>Back</span>
                            </button>

                            <div className="max-h-96 overflow-y-auto">
                                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                                    <button
                                        key={rate}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onPlaybackRateChange(rate);
                                            // Don't close menu, just go back to main menu
                                            setShowSpeedMenu(false);
                                        }}
                                        className={`w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-800/50 text-white transition-colors flex items-center justify-between ${playbackRate === rate ? 'bg-gray-800/50 text-[#F1C27D]' : ''
                                            }`}
                                    >
                                        <span>{getPlaybackLabel(rate)}</span>
                                        {playbackRate === rate && (
                                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* Main Settings Menu */
                        <>
                            {/* Playback Speed Option */}
                            {showPlaybackSpeed && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowSpeedMenu(true);
                                    }}
                                    className="w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-800/50 text-white transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3 ">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <circle cx="12" cy="12" r="10" />
                                            <circle cx="12" cy="12" r="2" />
                                            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                                        </svg>
                                        <span>Playback speed</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">{getPlaybackLabel(playbackRate)}</span>
                                        <ChevronRight size={20} />
                                    </div>
                                </button>
                            )}

                            {/* Theater Mode Option */}
                            {showTheaterModeOption && onToggleTheaterMode && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onToggleTheaterMode();
                                        // Keep menu open
                                    }}
                                    className="w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-800/50 text-white transition-colors flex items-center gap-3"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M3 9h18M9 3v18" />
                                    </svg>
                                    <span>{isTheaterMode ? 'Exit Theater Mode' : 'Theater Mode'}</span>
                                </button>
                            )}

                            {/* Picture-in-Picture Option */}
                            {showPictureInPictureOption && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onTogglePictureInPicture();
                                        // Keep menu open
                                    }}
                                    className="w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-800/50 text-white transition-colors flex items-center gap-3"
                                >
                                    <PictureInPicture size={20} />
                                    <span>Picture-in-Picture</span>
                                </button>
                            )}
                        </> 
                        )}
                    </>
                )}
                </div>
        </div>
    );
}

