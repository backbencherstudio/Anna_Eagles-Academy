"use client"
import React, { useEffect, useState, useRef, useCallback } from "react";
// Import Shaka Player CSS for UI controls
import 'shaka-player/dist/controls.css';
// Import custom styles
import './CustomVideoPlayer.css';

interface VideoData {
    video_id: string;
    video_title: string;
    video_url: string;
    video_duration: string;
    module?: string;
}

interface CustomVideoPlayerProps {
    /** Video data object containing video information */
    videoData: VideoData;
    /** Whether to auto-play the video on load */
    autoPlay?: boolean;
    /** Additional CSS classes for styling */
    className?: string;
    /** Theater mode state from parent */
    isTheaterMode?: boolean;
    /** Callback to toggle theater mode */
    onTheaterModeToggle?: () => void;
}

/**
 * CustomVideoPlayer - Clean Shaka Player implementation
 * 
 * Features:
 * - Uses Shaka Player with native UI controls for all videos
 * - Automatic detection and handling of different video formats
 * - Theater mode support
 * - Network state monitoring
 * - Buffering indicators
 * - Comprehensive error handling
 * 
 * @example
 * ```tsx
 * <CustomVideoPlayer
 *   videoData={{
 *     video_id: "1",
 *     video_title: "Introduction to React",
 *     video_url: "/videos/intro.mp4",
 *     video_duration: "5:30",
 *     module: "React Basics"
 *   }}
 *   autoPlay={false}
 *   className="my-4"
 * />
 * ```
 */
export default function CustomVideoPlayer({
    videoData,
    autoPlay = false,
    className = "",
    isTheaterMode = false,
    onTheaterModeToggle
}: CustomVideoPlayerProps) {
    // Basic states
    const [videoError, setVideoError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    
    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const shakaPlayerRef = useRef<any | null>(null);
    const isMountedRef = useRef(true);

    // Shaka Player error handlers
    const onShakaErrorEvent = useCallback((event: any) => {
        onShakaError(event.detail);
    }, []);

    const onShakaError = useCallback((error: any) => {
        // console.error('Shaka Player Error:', error);
        // console.error('Video URL:', videoData.video_url);
        
        let errorMessage = 'Video playback error';
        if (error && error.code) {
            switch (error.code) {
                case 1001:
                    errorMessage = 'Video format not supported';
                    break;
                case 1002:
                    errorMessage = 'Network error - Check CORS settings';
                    break;
                case 1003:
                    errorMessage = 'Video decoding error';
                    break;
                case 1004:
                    errorMessage = 'Video loading aborted';
                    break;
                case 1005:
                    errorMessage = 'Video not found';
                    break;
                default:
                    errorMessage = `Shaka Player error: ${error.message || 'Unknown error'}`;
            }
        } else if (!videoData.video_url) {
            errorMessage = 'No video URL provided';
        } else {
            errorMessage = `Shaka Player error: ${error?.message || 'Failed to load video'}`;
        }
        
        setVideoError(errorMessage);
        setIsLoading(false);
        setIsBuffering(false);
    }, [videoData.video_url]);

    // Check if URL is a manifest file (DASH/HLS) or regular video
    const isManifestUrl = useCallback((url: string) => {
        return url.includes('.mpd') || url.includes('.m3u8');
    }, []);

    // Initialize Shaka Player or Native Video
    useEffect(() => {
        let destroyed = false;

        async function initVideo() {
            try {
                if (!videoRef.current || !videoContainerRef.current) return;
                
                // Don't initialize if no video URL
                if (!videoData.video_url) {
                    setVideoError('No video URL provided');
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);
                setIsBuffering(false);
                setVideoError(null);

                // Check if it's a manifest URL (DASH/HLS)
                if (isManifestUrl(videoData.video_url)) {
                    // Use Shaka Player for manifest files
                    const shaka: any = (await import('shaka-player/dist/shaka-player.compiled.js')) as any;
                    
                    shaka.polyfill.installAll();

                    if (!shaka.Player.isBrowserSupported()) {
                        setVideoError('This browser is not supported by Shaka Player.');
                        setIsLoading(false);
                        return;
                    }

                    // Initialize Shaka Player
                    const player = new shaka.Player(videoRef.current);
                    shakaPlayerRef.current = player;

                    // Listen for error events
                    player.addEventListener('error', onShakaErrorEvent);

                    // Try to load the manifest
                    await player.load(videoData.video_url);
                } else {
                    // Use native HTML5 video for regular files (MP4, WebM, etc.)
                    videoRef.current.src = videoData.video_url;
                    await videoRef.current.load();
                }

                // Autoplay behavior
                if (autoPlay && videoRef.current && videoRef.current.paused) {
                    await videoRef.current.play().catch(() => {
                        // Autoplay failed, that's okay
                    });
                }

                if (!destroyed) {
                    setIsLoading(false);
                    setIsBuffering(false);
                }
            } catch (err: any) {
                // console.error('Video init/load error', err);
                // console.error('Video URL:', videoData.video_url);
                // console.error('Error details:', {
                //     message: err?.message,
                //     code: err?.code,
                //     stack: err?.stack
                // });
                onShakaError(err);
            }
        }

        initVideo();

        return () => {
            destroyed = true;
            if (shakaPlayerRef.current && typeof shakaPlayerRef.current.destroy === 'function') {
                shakaPlayerRef.current.destroy().catch(() => { });
            }
            shakaPlayerRef.current = null;
            if (videoRef.current) {
                videoRef.current.removeAttribute('src');
                videoRef.current.load?.();
            }
            // Reset states
            setIsLoading(true);
            setIsBuffering(false);
            setVideoError(null);
        };
    }, [videoData.video_url, autoPlay, onShakaErrorEvent, onShakaError, isManifestUrl]);

    // Add native video event listeners for non-Shaka videos
    useEffect(() => {
        const video = videoRef.current;
        if (!video || isManifestUrl(videoData.video_url)) return;

        const handleLoadStart = () => {
            setIsLoading(true);
            setIsBuffering(false);
            setVideoError(null);
        };

        const handleCanPlay = () => {
            setIsLoading(false);
            setIsBuffering(false);
        };

        const handleWaiting = () => {
            setIsBuffering(true);
        };

        const handlePlaying = () => {
            setIsBuffering(false);
        };

        const handleError = (e: Event) => {
            const target = e.target as HTMLVideoElement;
            const error = target.error;
            if (error) {
                let errorMessage = 'Video loading error';
                switch (error.code) {
                    case 1: errorMessage = 'Video loading aborted'; break;
                    case 2: errorMessage = 'Network error while loading video'; break;
                    case 3: errorMessage = 'Video decoding error'; break;
                    case 4: errorMessage = 'Video not supported'; break;
                }
                setVideoError(errorMessage);
                setIsLoading(false);
                setIsBuffering(false);
            }
        };

        video.addEventListener('loadstart', handleLoadStart);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('error', handleError);

        return () => {
            video.removeEventListener('loadstart', handleLoadStart);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('error', handleError);
        };
    }, [videoData.video_url, isManifestUrl]);

    // Reset component when video URL changes
    useEffect(() => {
        setIsLoading(true);
        setIsBuffering(false);
        setVideoError(null);
    }, [videoData.video_url]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    if (!videoData) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-100 rounded-xl">
                <span className="text-lg font-semibold text-gray-500">No video data provided</span>
            </div>
        );
    }

    return (
        <div className={`${className} ${isTheaterMode ? 'theater-mode' : ''}`}>
            {/* Video Info Header (Outside Player) */}
            {!isTheaterMode && videoData.video_title && (
                <div className="bg-white  border-gray-200 mb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                {videoData.video_title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {videoData.module} 
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Player */}
            <div
                ref={videoContainerRef}
                className={`video-player-container shaka-video-container relative cursor-pointer bg-black overflow-hidden group transition-all duration-500 ease-in-out ${isTheaterMode
                    ? 'fixed top-0 left-0 w-full max-h-[80vh] h-auto z-[9999] rounded-none flex items-center justify-center'
                    : 'w-full aspect-video'
                    }`}
                onContextMenu={(e) => e.preventDefault()}
            >
                {videoData.video_url ? (
                    <>
                        <video
                            key={`video-${videoData.video_id}`}
                            ref={videoRef}
                            className={`shaka-video w-full h-full object-cover ${isTheaterMode ? 'max-h-[80vh] w-auto mx-auto' : ''}`}
                            preload="metadata"
                            controls={true}
                            playsInline
                            draggable={false}
                            controlsList="nodownload"
                            crossOrigin="anonymous"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ pointerEvents: 'auto' }}
                        >
                            Your browser does not support the video tag.
                        </video>

                        {/* Loading/Buffering Overlay */}
                        {(isLoading || isBuffering) && (
                            <div
                                key={`loading-${videoData.video_id}`}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm"
                            >
                                <div className="text-center text-white flex flex-col items-center justify-center">
                                    {/* Loading Animation */}
                                    <div className="relative mb-6">
                                        <div className="video-loading"></div>
                                        {isBuffering && !isLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Loading/Buffering Text */}
                                    <p className="text-lg font-semibold mb-3">
                                        {isLoading ? 'Loading video...' : 'Buffering...'}
                                    </p>

                                    {/* Video Title */}
                                    <p className="text-sm text-gray-300 mb-4 max-w-xs truncate">
                                        {videoData.video_title}
                                    </p>

                                    {/* Retry Button for Errors */}
                                    {videoError && (
                                        <button
                                            onClick={() => {
                                                if (videoRef.current) {
                                                    videoRef.current.load();
                                                    setVideoError(null);
                                                    setIsLoading(true);
                                                    setIsBuffering(false);
                                                }
                                            }}
                                            className="mt-4 px-4 py-2 bg-[#F1C27D] hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Retry Loading
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Video Info Overlay (Theater Mode) */}
                        {isTheaterMode && (
                            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent px-6 py-4 text-white z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h1 className="text-xl font-bold mb-1 truncate">
                                            {videoData.video_title}
                                        </h1>
                                        <p className="text-sm text-gray-300 opacity-90">
                                            {videoData.module} • {videoData.video_duration}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onTheaterModeToggle?.();
                                        }}
                                        className="p-2 rounded-full cursor-pointer bg-black/50 text-white hover:bg-black/70 transition-all duration-200 hover:scale-105"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white bg-black">
                        <div className="text-center flex flex-col items-center justify-center">
                            <div className="mb-4">
                                <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-lg font-semibold mb-2">{videoError || 'No video available'}</p>
                            {videoError && videoError.includes('internet') && (
                                <button
                                    onClick={() => {
                                        if (videoRef.current) {
                                            setVideoError(null);
                                            setIsLoading(true);
                                            videoRef.current.load();
                                        }
                                    }}
                                    className="px-4 py-2 bg-[#F1C27D] hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Retry
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}