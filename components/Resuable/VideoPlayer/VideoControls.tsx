"use client"
import { Play, Pause, SkipBack, SkipForward, Maximize, RotateCcw } from "lucide-react";
import VolumeControl from "./VolumeControl";
import VideoProgressBar from "./VideoProgressBar";
import SettingsMenu from "./SettingsMenu";

interface VideoControlsProps {
    // States
    currentTime: number;
    duration: number;
    buffered: number;
    isPlaying: boolean;
    hasEnded: boolean;
    volume: number;
    isMuted: boolean;
    playbackRate: number;
    isFullscreen: boolean;
    showControls: boolean;
    hoveredControl: string | null;
    isLoading: boolean;
    videoError: string | null;
    isTheaterMode: boolean;
    
    // Video data
    isCompleted: boolean;
    
    // Callbacks
    togglePlay: () => void;
    skip: (seconds: number) => void;
    handleSeek: (seekTime: number) => void;
    toggleMute: () => void;
    handleVolumeChange: (newVolume: number) => void;
    toggleFullscreen: () => void;
    togglePictureInPicture: () => void;
    handlePlaybackRateChange: (rate: number) => void;
    formatTime: (seconds: number) => string;
    setHoveredControl: (control: string | null) => void;
    
    // Props
    showVolumeControl?: boolean;
    showPlaybackSpeed?: boolean;
    showSkipControls?: boolean;
    showFullscreen?: boolean;
    showProgressBar?: boolean;
    showSettings?: boolean;
    showTheaterMode?: boolean;
    showPictureInPicture?: boolean;
    allowSeeking?: boolean;
    
    // Navigation
    onPreviousVideo?: () => void;
    onNextVideo?: () => void;
    hasPreviousVideo?: boolean;
    hasNextVideo?: boolean;
    onTheaterModeToggle?: () => void;
}

export default function VideoControls({
    currentTime,
    duration,
    buffered,
    isPlaying,
    hasEnded,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    showControls,
    hoveredControl,
    isLoading,
    videoError,
    isTheaterMode,
    isCompleted,
    togglePlay,
    skip,
    handleSeek,
    toggleMute,
    handleVolumeChange,
    toggleFullscreen,
    togglePictureInPicture,
    handlePlaybackRateChange,
    formatTime,
    setHoveredControl,
    showVolumeControl = true,
    showPlaybackSpeed = true,
    showSkipControls = true,
    showFullscreen = true,
    showProgressBar = true,
    showSettings = true,
    showTheaterMode = true,
    showPictureInPicture = true,
    allowSeeking = true,
    onPreviousVideo,
    onNextVideo,
    hasPreviousVideo = false,
    hasNextVideo = false,
    onTheaterModeToggle
}: VideoControlsProps) {
    return (
        <>
            {/* Center Play/Pause/Replay Button */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                        }}
                        className="bg-black/50 cursor-pointer hover:bg-black/70 rounded-full p-3 transition-all duration-200 hover:scale-110 pointer-events-auto"
                        title={hasEnded ? "Replay" : "Play"}
                    >
                        {hasEnded ? (
                            <RotateCcw size={32} className="text-white " />
                        ) : (
                            <Play size={32} className="text-white " />
                        )}
                    </button>
                </div>
            )}

            {/* Bottom Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-0 sm:p-4 md:pb-4 sm:pb-6">
                {/* Custom Progress Bar */}
                <div className="mb-0 md:mb-3">
                    <VideoProgressBar
                        currentTime={currentTime}
                        duration={duration}
                        buffered={buffered}
                        onSeek={handleSeek}
                        isCompleted={isCompleted}
                        allowSeeking={allowSeeking}
                    />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink">
                        {/* Play/Pause/Replay */}
                        <div
                            className="relative"
                            onMouseEnter={() => setHoveredControl('play')}
                            onMouseLeave={() => setHoveredControl(null)}
                        >
                            <button
                                onClick={togglePlay}
                                className="text-white hover:text-[#F1C27D] transition-colors cursor-pointer p-2 touch-manipulation"
                            >
                                {hasEnded ? (
                                    <RotateCcw size={20} className="sm:w-6 sm:h-6" />
                                ) : isPlaying ? (
                                    <Pause size={20} className="sm:w-6 sm:h-6" />
                                ) : (
                                    <Play size={20} className="sm:w-6 sm:h-6" />
                                )}
                            </button>
                            {hoveredControl === 'play' && (
                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/95 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none z-30">
                                    {hasEnded ? "Replay" : isPlaying ? "Pause" : "Play"}
                                </div>
                            )}
                        </div>

                        {/* Skip Controls - Hidden on mobile */}
                        {showSkipControls && (
                            <>
                                <div
                                    className="relative hidden sm:block"
                                    onMouseEnter={() => setHoveredControl('skipBack')}
                                    onMouseLeave={() => setHoveredControl(null)}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // If previous video navigation is available, use it
                                            if (onPreviousVideo && hasPreviousVideo) {
                                                onPreviousVideo();
                                            } else if (isCompleted) {
                                                // Only skip backwards if video is completed
                                                skip(-10);
                                            }
                                            // If video is not completed, do nothing (don't skip)
                                        }}
                                        className={`p-2 ${onPreviousVideo && hasPreviousVideo
                                                ? 'text-white hover:text-[#F1C27D] transition-colors cursor-pointer'
                                                : isCompleted
                                                    ? 'text-white hover:text-[#F1C27D] transition-colors cursor-pointer'
                                                    : 'text-gray-500 cursor-not-allowed opacity-50'
                                            }`}
                                        disabled={!onPreviousVideo && !hasPreviousVideo && !isCompleted}
                                    >
                                        <SkipBack size={22} />
                                    </button>
                                    {hoveredControl === 'skipBack' && (
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/95 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none z-30">
                                            {onPreviousVideo && hasPreviousVideo ? "Previous video" : "Rewind 10s"}
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="relative hidden sm:block"
                                    onMouseEnter={() => setHoveredControl('skipForward')}
                                    onMouseLeave={() => setHoveredControl(null)}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // If next video navigation is available, use it
                                            if (onNextVideo && hasNextVideo) {
                                                onNextVideo();
                                            } else if (isCompleted) {
                                                // Only skip forward if video is completed
                                                skip(10);
                                            }
                                            // If video is not completed, do nothing (don't skip)
                                        }}
                                        className={`p-2 ${onNextVideo && hasNextVideo
                                                ? 'text-white hover:text-[#F1C27D] transition-colors cursor-pointer'
                                                : isCompleted
                                                    ? 'text-white hover:text-[#F1C27D] transition-colors cursor-pointer'
                                                    : 'text-gray-500 cursor-not-allowed opacity-50'
                                            }`}
                                        disabled={!onNextVideo && !hasNextVideo && !isCompleted}
                                    >
                                        <SkipForward size={22} />
                                    </button>
                                    {hoveredControl === 'skipForward' && (
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/95 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none z-30">
                                            {onNextVideo && hasNextVideo ? "Next video" : "Forward 10s"}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Volume Control */}
                        {showVolumeControl && (
                            <div
                                className="relative"
                                onMouseEnter={() => setHoveredControl('volume')}
                                onMouseLeave={() => setHoveredControl(null)}
                            >
                                <VolumeControl
                                    volume={volume}
                                    isMuted={isMuted}
                                    onVolumeChange={handleVolumeChange}
                                    onToggleMute={toggleMute}
                                />
                                {hoveredControl === 'volume' && (
                                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/95 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none z-30">
                                        {isMuted ? "Unmute" : "Mute"}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Time Display */}
                        <span className="text-white text-xs sm:text-sm ml-1 sm:ml-2">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Fullscreen Button */}
                        {showFullscreen && (
                            <div
                                className="relative"
                                onMouseEnter={() => setHoveredControl('fullscreen')}
                                onMouseLeave={() => setHoveredControl(null)}
                            >
                                <button
                                    onClick={toggleFullscreen}
                                    className="text-white cursor-pointer hover:text-[#F1C27D] transition-colors p-2 touch-manipulation"
                                >
                                    <Maximize size={20} className="sm:w-6 sm:h-6" />
                                </button>
                                {hoveredControl === 'fullscreen' && (
                                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/95 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none z-30">
                                        Fullscreen
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Settings Menu */}
                        {showSettings && (
                            <div
                                className="relative"
                                onMouseEnter={() => setHoveredControl('settings')}
                                onMouseLeave={() => setHoveredControl(null)}
                            >
                                <SettingsMenu
                                    playbackRate={playbackRate}
                                    isTheaterMode={isTheaterMode}
                                    showPlaybackSpeed={showPlaybackSpeed}
                                    onPlaybackRateChange={(rate) => {
                                        handlePlaybackRateChange(rate);
                                    }}
                                    onToggleTheaterMode={onTheaterModeToggle}
                                    onTogglePictureInPicture={togglePictureInPicture}
                                    showTheaterModeOption={showTheaterMode}
                                    showPictureInPictureOption={showPictureInPicture}
                                />
                                {hoveredControl === 'settings' && (
                                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/95 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none z-30">
                                        Settings
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

