"use client"
import { useEffect, useState, useRef, useCallback } from "react";
import 'shaka-player/dist/controls.css';
import './CustomVideoPlayer.css';
import { useVideoProgress } from "@/hooks/useVideoProgress";
import VideoControls from "./VideoControls";

interface VideoData {
    video_id: string;
    video_title: string;
    video_url: string;
    video_duration: string;
    module?: string;
    video_type?: 'intro' | 'end' | 'lesson';
    last_position?: number;
    is_completed?: boolean;
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
    /** Callback when video ends */
    onVideoEnd?: () => void;
    /** Show volume control */
    showVolumeControl?: boolean;
    /** Show playback speed control */
    showPlaybackSpeed?: boolean;
    /** Show skip forward/backward buttons */
    showSkipControls?: boolean;
    /** Show fullscreen button */
    showFullscreen?: boolean;
    /** Show progress bar */
    showProgressBar?: boolean;
    /** Show settings menu */
    showSettings?: boolean;
    /** Show theater mode option in settings */
    showTheaterMode?: boolean;
    /** Show picture-in-picture option in settings */
    showPictureInPicture?: boolean;
    /** Allow seeking on progress bar */
    allowSeeking?: boolean;
    /** Callback to go to previous video */
    onPreviousVideo?: () => void;
    /** Callback to go to next video */
    onNextVideo?: () => void;
    /** Whether previous video is available and unlocked */
    hasPreviousVideo?: boolean;
    /** Whether next video is available and unlocked */
    hasNextVideo?: boolean;
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
    onTheaterModeToggle,
    onVideoEnd,
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
    hasNextVideo = false
}: CustomVideoPlayerProps) {
    // Basic states
    const [videoError, setVideoError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [buffered, setBuffered] = useState(0);
    const [hasEnded, setHasEnded] = useState(false);
    const [hoveredControl, setHoveredControl] = useState<string | null>(null);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const shakaPlayerRef = useRef<any | null>(null);

    // Video progress tracking
    const { throttledSaveProgress, loadVideoProgress } = useVideoProgress();

    // Use refs to store progress functions to avoid recreating listeners
    const throttledSaveProgressRef = useRef(throttledSaveProgress);
    const loadVideoProgressRef = useRef(loadVideoProgress);

    useEffect(() => {
        throttledSaveProgressRef.current = throttledSaveProgress;
        loadVideoProgressRef.current = loadVideoProgress;
    }, [throttledSaveProgress, loadVideoProgress]);

    // Shaka Player event listeners ref
    const shakaEventListenersRef = useRef<Array<{ type: string; listener: () => void }>>([]);
    const videoEventListenersRef = useRef<Array<{ type: string; listener: EventListener }>>([]);

    // Control handlers
    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (hasEnded) {
                videoRef.current.currentTime = 0;
                setHasEnded(false);
                videoRef.current.play();
                setIsPlaying(true);
            } else if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [hasEnded]);

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    }, []);

    const handleVolumeChange = useCallback((newVolume: number) => {
        if (videoRef.current) {
            const clampedVolume = Math.max(0, Math.min(1, newVolume));
            videoRef.current.volume = clampedVolume;
            setVolume(clampedVolume);
            setIsMuted(clampedVolume === 0);
        }
    }, []);

    const handleSeek = useCallback((seekTime: number) => {
        if (videoRef.current && duration > 0) {
            const clampedTime = Math.max(0, Math.min(duration, seekTime));
            videoRef.current.currentTime = clampedTime;
            setCurrentTime(clampedTime);
        }
    }, [duration]);

    const skip = useCallback((seconds: number) => {
        if (videoRef.current) {
            handleSeek(currentTime + seconds);
        }
    }, [currentTime, handleSeek]);

    const toggleFullscreen = useCallback(() => {
        if (videoContainerRef.current) {
            if (!document.fullscreenElement) {
                videoContainerRef.current.requestFullscreen?.();
                setIsFullscreen(true);
            } else {
                document.exitFullscreen?.();
                setIsFullscreen(false);
            }
        }
    }, []);

    const togglePictureInPicture = useCallback(async () => {
        if (videoRef.current) {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    await videoRef.current.requestPictureInPicture();
                }
            } catch (err) {
                console.error('Picture-in-Picture error:', err);
            }
        }
    }, []);

    const handlePlaybackRateChange = useCallback((rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
        }
    }, []);

    const formatTime = useCallback((seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!videoRef.current) return;

            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    // Only skip backwards if video is completed
                    if (videoData.is_completed !== false) {
                        skip(-10);
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    // Only skip forward if video is completed
                    if (videoData.is_completed !== false) {
                        skip(10);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    handleVolumeChange(volume + 0.1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    handleVolumeChange(volume - 0.1);
                    break;
                case 'm':
                case 'M':
                    toggleMute();
                    break;
                case 'f':
                case 'F':
                    toggleFullscreen();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [togglePlay, skip, handleVolumeChange, toggleMute, toggleFullscreen, volume, videoData.is_completed]);

    // Auto-hide controls
    useEffect(() => {
        if (!showControls) return;

        const timer = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [showControls, isPlaying]);

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Reset hasEnded when video starts playing
    useEffect(() => {
        if (isPlaying && hasEnded) {
            setHasEnded(false);
        }
    }, [isPlaying, hasEnded]);

    // Sync video state on mount
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        setVolume(video.volume);
        setIsMuted(video.muted);
        setIsPlaying(!video.paused);
        setCurrentTime(video.currentTime);
    }, [videoData.video_url]);

    // Shaka Player error handlers
    const onShakaErrorEvent = useCallback((event: any) => {
        onShakaError(event.detail);
    }, []);

    const onShakaError = useCallback((error: any) => {
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

                    // Track progress for Shaka Player
                    const timeupdateListener = () => {
                        const video = videoRef.current;
                        if (video) {
                            const current = video.currentTime;
                            const dur = video.duration;
                            if (dur > 0 && current > 0) {
                                setDuration(dur);
                                setCurrentTime(current);
                                setIsPlaying(!video.paused);

                                // Track buffering
                                if (video.buffered.length > 0 && dur > 0) {
                                    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                                    const bufferedPercentage = (bufferedEnd / dur) * 100;
                                    setBuffered(bufferedPercentage);
                                }

                                if (videoData.video_type) {
                                    throttledSaveProgressRef.current(
                                        videoData.video_id,
                                        current,
                                        dur,
                                        videoData.video_type
                                    );
                                }
                            }
                        }
                    };
                    player.addEventListener('timeupdate', timeupdateListener);
                    shakaEventListenersRef.current.push({ type: 'timeupdate', listener: timeupdateListener });

                    // Track buffering for Shaka Player
                    const progressListener = () => {
                        const video = videoRef.current;
                        if (video && video.buffered.length > 0 && video.duration > 0) {
                            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                            const bufferedPercentage = (bufferedEnd / video.duration) * 100;
                            setBuffered(bufferedPercentage);
                        }
                    };
                    videoRef.current.addEventListener('progress', progressListener);
                    videoEventListenersRef.current.push({ type: 'progress', listener: progressListener });

                    // Track play/pause for Shaka Player
                    const playListener = () => {
                        const video = videoRef.current;
                        if (video) {
                            setIsPlaying(true);
                            setVolume(video.volume);
                            setIsMuted(video.muted);
                        }
                    };
                    videoRef.current.addEventListener('play', playListener);
                    videoEventListenersRef.current.push({ type: 'play', listener: playListener });

                    const pauseListener = () => {
                        const video = videoRef.current;
                        if (video) {
                            setIsPlaying(false);
                        }
                    };
                    videoRef.current.addEventListener('pause', pauseListener);
                    videoEventListenersRef.current.push({ type: 'pause', listener: pauseListener });

                    const volumeChangeListener = () => {
                        const video = videoRef.current;
                        if (video) {
                            setVolume(video.volume);
                            setIsMuted(video.muted);
                        }
                    };
                    videoRef.current.addEventListener('volumechange', volumeChangeListener);
                    videoEventListenersRef.current.push({ type: 'volumechange', listener: volumeChangeListener });

                    // Track when video metadata is loaded
                    const loadListener = () => {
                        const video = videoRef.current;
                        if (video) {
                            const dur = video.duration;
                            if (dur > 0) {
                                setDuration(dur);
                                // Load saved progress and seek to it
                                const savedProgress = loadVideoProgressRef.current(videoData.video_id);
                                const lastPosition = videoData.last_position || (savedProgress && savedProgress.currentTime > 0 ? savedProgress.currentTime : 0);
                                if (lastPosition > 0 && lastPosition < dur) {
                                    video.currentTime = lastPosition;
                                }
                            }
                        }
                    };
                    player.addEventListener('load', loadListener);
                    shakaEventListenersRef.current.push({ type: 'load', listener: loadListener });

                    // Track when video ends for auto-play next
                    const endedListener = () => {
                        const video = videoRef.current;
                        if (video) {
                            const dur = video.duration;
                            if (videoData.video_type && dur > 0) {
                                // Save as complete when video ends
                                throttledSaveProgressRef.current(
                                    videoData.video_id,
                                    dur,
                                    dur,
                                    videoData.video_type
                                );
                            }
                            // Trigger next video callback
                            if (onVideoEnd) {
                                onVideoEnd();
                            }
                        }
                    };
                    // Use video element's ended event for Shaka Player
                    videoRef.current.addEventListener('ended', endedListener);

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
                onShakaError(err);
            }
        }

        initVideo();

        return () => {
            destroyed = true;
            // Clean up event listeners
            if (shakaPlayerRef.current) {
                shakaEventListenersRef.current.forEach(({ type, listener }) => {
                    shakaPlayerRef.current?.removeEventListener(type, listener);
                });
                shakaEventListenersRef.current = [];
            }

            // Clean up video element event listeners
            if (videoRef.current) {
                videoEventListenersRef.current.forEach(({ type, listener }) => {
                    videoRef.current?.removeEventListener(type, listener);
                });
                videoEventListenersRef.current = [];
                videoRef.current.removeAttribute('src');
                videoRef.current.load?.();
            }

            if (shakaPlayerRef.current && typeof shakaPlayerRef.current.destroy === 'function') {
                shakaPlayerRef.current.destroy().catch(() => { });
            }
            shakaPlayerRef.current = null;

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
        setHasEnded(false);
    }, [videoData.video_url]);

    // Track video time and save progress periodically
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            const current = video.currentTime;
            const dur = video.duration;

            if (dur > 0) {
                setDuration(dur);
                setCurrentTime(current);
                setIsPlaying(!video.paused);

                // Track buffering
                if (video.buffered.length > 0) {
                    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                    const bufferedPercentage = (bufferedEnd / dur) * 100;
                    setBuffered(bufferedPercentage);
                }

                // Save progress periodically (throttled)
                if (videoData.video_type && current > 0) {
                    throttledSaveProgressRef.current(
                        videoData.video_id,
                        current,
                        dur,
                        videoData.video_type
                    );
                }
            }
        };

        const handlePlayPause = () => {
            setIsPlaying(!video.paused);
        };

        const handleVolumeUpdate = () => {
            setVolume(video.volume);
            setIsMuted(video.muted);
        };

        const handleProgress = () => {
            if (video.buffered.length > 0 && video.duration > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                const bufferedPercentage = (bufferedEnd / video.duration) * 100;
                setBuffered(bufferedPercentage);
            }
        };

        const handleLoadedMetadata = () => {
            const dur = video.duration;
            if (dur > 0) {
                setDuration(dur);

                // Load saved progress and seek to it
                const savedProgress = loadVideoProgressRef.current(videoData.video_id);
                const lastPosition = videoData.last_position || (savedProgress && savedProgress.currentTime > 0 ? savedProgress.currentTime : 0);
                if (lastPosition > 0 && lastPosition < dur) {
                    video.currentTime = lastPosition;
                }
            }
        };

        // Only add listeners if not a manifest URL (not Shaka Player)
        if (!isManifestUrl(videoData.video_url)) {
            video.addEventListener('timeupdate', handleTimeUpdate);
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('play', handlePlayPause);
            video.addEventListener('pause', handlePlayPause);
            video.addEventListener('volumechange', handleVolumeUpdate);
            video.addEventListener('progress', handleProgress);
            video.addEventListener('waiting', handleProgress);

            return () => {
                video.removeEventListener('timeupdate', handleTimeUpdate);
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                video.removeEventListener('play', handlePlayPause);
                video.removeEventListener('pause', handlePlayPause);
                video.removeEventListener('volumechange', handleVolumeUpdate);
                video.removeEventListener('progress', handleProgress);
                video.removeEventListener('waiting', handleProgress);
            };
        }
    }, [videoData.video_id, videoData.video_type]);

    // Save final progress when video ends and trigger next video
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = async () => {
            setHasEnded(true);
            setIsPlaying(false);

            if (videoData.video_type && duration > 0) {
                // Save as complete when video ends
                throttledSaveProgressRef.current(
                    videoData.video_id,
                    duration,
                    duration,
                    videoData.video_type
                );
            }

            // Trigger next video callback
            if (onVideoEnd) {
                onVideoEnd();
            }
        };

        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('ended', handleEnded);
        };
    }, [videoData.video_id, videoData.video_type, duration, onVideoEnd]);

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
                className={`video-player-container shaka-video-container relative cursor-pointer bg-black overflow-hidden group transition-all duration-500 ease-in-out w-full ${isTheaterMode ? 'aspect-auto h-auto' : 'aspect-video'}`}
                onContextMenu={(e) => e.preventDefault()}
            >
                {videoData.video_url ? (
                    <>
                        <video
                            key={`video-${videoData.video_id}`}
                            ref={videoRef}
                            className="shaka-video w-full h-full object-contain sm:object-cover"
                            preload="metadata"
                            controls={false}
                            playsInline
                            draggable={false}
                            controlsList="nodownload"
                            crossOrigin="anonymous"
                            onContextMenu={(e) => e.preventDefault()}
                            onClick={togglePlay}
                            onMouseEnter={() => setShowControls(true)}
                            onMouseLeave={() => setShowControls(false)}
                            style={{ pointerEvents: 'auto' }}
                        >
                            Your browser does not support the video tag.
                        </video>

                        {/* Custom Controls Overlay */}
                        {!isLoading && !videoError && (
                            <div
                                className={`absolute inset-0 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
                                onMouseEnter={() => setShowControls(true)}
                                onMouseMove={() => setShowControls(true)}
                                onMouseLeave={() => isPlaying && setShowControls(false)}
                                onClick={(e) => {
                                    // Only toggle play/pause if clicking on the overlay itself (not on controls)
                                    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('controls-overlay')) {
                                        togglePlay();
                                    }
                                }}
                            >
                                {/* Clickable overlay area for play/pause */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    onClick={togglePlay}
                                ></div>

                                {/* Video Controls Component */}
                                <VideoControls
                                    currentTime={currentTime}
                                    duration={duration}
                                    buffered={buffered}
                                    isPlaying={isPlaying}
                                    hasEnded={hasEnded}
                                    volume={volume}
                                    isMuted={isMuted}
                                    playbackRate={playbackRate}
                                    isFullscreen={isFullscreen}
                                    showControls={showControls}
                                    hoveredControl={hoveredControl}
                                    isLoading={isLoading}
                                    videoError={videoError}
                                    isTheaterMode={isTheaterMode}
                                    isCompleted={videoData.is_completed !== false}
                                    togglePlay={togglePlay}
                                    skip={skip}
                                    handleSeek={handleSeek}
                                    toggleMute={toggleMute}
                                    handleVolumeChange={handleVolumeChange}
                                    toggleFullscreen={toggleFullscreen}
                                    togglePictureInPicture={togglePictureInPicture}
                                    handlePlaybackRateChange={handlePlaybackRateChange}
                                    formatTime={formatTime}
                                    setHoveredControl={setHoveredControl}
                                    showVolumeControl={showVolumeControl}
                                    showPlaybackSpeed={showPlaybackSpeed}
                                    showSkipControls={showSkipControls}
                                    showFullscreen={showFullscreen}
                                    showProgressBar={showProgressBar}
                                    showSettings={showSettings}
                                    showTheaterMode={showTheaterMode}
                                    showPictureInPicture={showPictureInPicture}
                                    allowSeeking={allowSeeking}
                                    onPreviousVideo={onPreviousVideo}
                                    onNextVideo={onNextVideo}
                                    hasPreviousVideo={hasPreviousVideo}
                                    hasNextVideo={hasNextVideo}
                                    onTheaterModeToggle={onTheaterModeToggle}
                                />
                            </div>
                        )}

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

                                    {/* Loading Text */}
                                    <p className="text-lg font-semibold mb-3">
                                        Loading video...
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
                                        className="p-2 bg-black/50 rounded-full cursor-pointer text-white hover:bg-black/70 transition-all duration-200 hover:scale-105"
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