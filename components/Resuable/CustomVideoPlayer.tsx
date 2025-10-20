"use client"
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MdOutlineReplay10, MdOutlineForward10 } from "react-icons/md";
import { useVideoProgress } from "@/hooks/useVideoProgress";

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
    /** Callback function called when video ends */
    onVideoEnd?: () => void;
    /** Callback function called on time update with current time and duration */
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    /** Callback function called when video starts playing */
    onPlay?: () => void;
    /** Callback function called when video is paused */
    onPause?: () => void;
    /** Callback function called when previous track button is clicked */
    onPreviousTrack?: () => void;
    /** Callback function called when next track button is clicked */
    onNextTrack?: () => void;
    /** Whether previous track button should be disabled */
    isPreviousDisabled?: boolean;
    /** Whether next track button should be disabled */
    isNextDisabled?: boolean;
    /** Whether to auto-play the video on load */
    autoPlay?: boolean;
    /** Whether to show controls initially */
    showControls?: boolean;
    /** Additional CSS classes for styling */
    className?: string;
    /** Width of the video player container */
    width?: string;
    /** Height of the video player container */
    height?: string;
    /** Theater mode state from parent */
    isTheaterMode?: boolean;
    /** Callback to toggle theater mode */
    onTheaterModeToggle?: () => void;
    /** Whether to show video info in theater mode */
    showVideoInfo?: boolean;
    /** Preload strategy for video */
    preload?: 'none' | 'metadata' | 'auto';
    /** Whether to show buffering indicator */
    showBuffering?: boolean;
    /** Network state callback */
    onNetworkStateChange?: (state: number, message: string) => void;
    /** Whether to show volume controls */
    showVolumeControls?: boolean;
    /** Whether to show rewind/forward 10s buttons */
    showSkipControls?: boolean;
    /** Whether to allow seeking on progress bar */
    allowSeeking?: boolean;
}

/**
 * CustomVideoPlayer - A reusable video player component with full controls
 * 
 * Features:
 * - Play/Pause controls
 * - Volume control with mute toggle
 * - Progress bar with seeking
 * - Skip forward/backward 10 seconds
 * - Loop toggle
 * - Theater mode toggle
 * - Settings panel
 * - Auto-hide controls
 * - Smooth tooltips
 * - Responsive design
 * - Smart theater mode with enhanced UI
 * - Network state monitoring
 * - Buffering indicators
 * - Preload functionality
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
 *   onVideoEnd={() => console.log("Video ended")}
 *   onTimeUpdate={(current, duration) => console.log(`${current}/${duration}`)}
 *   autoPlay={false}
 *   className="my-4"
 *   preload="metadata"
 *   showBuffering={true}
 * />
 * ```
 */
export default function CustomVideoPlayer({
    videoData,
    onVideoEnd,
    onTimeUpdate,
    onPlay,
    onPause,
    onPreviousTrack,
    onNextTrack,
    isPreviousDisabled = false,
    isNextDisabled = false,
    autoPlay = false,
    showControls: initialShowControls = true,
    className = "",
    width = "100%",
    height = "auto",
    isTheaterMode = false,
    onTheaterModeToggle,
    showVideoInfo = true,
    preload = 'metadata',
    showBuffering = true,
    onNetworkStateChange,
    showVolumeControls = true,
    showSkipControls = true,
    allowSeeking = true
}: CustomVideoPlayerProps) {
    const [playing, setPlaying] = useState(false);
    const [videoError, setVideoError] = useState<string | null>(null);

    // Custom video player states
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(initialShowControls);
    const [showSettings, setShowSettings] = useState(false);
    const [settingsView, setSettingsView] = useState<'main' | 'playback-speed'>('main');
    // const [resolution, setResolution] = useState('Auto');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isPictureInPicture, setIsPictureInPicture] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const shakaPlayerRef = useRef<any | null>(null);
    const isMountedRef = useRef(true);

    // Network and buffering states
    const [networkState, setNetworkState] = useState<number>(0);
    const [readyState, setReadyState] = useState<number>(0);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [bufferedRanges, setBufferedRanges] = useState<TimeRanges | null>(null);
    const [loadProgress, setLoadProgress] = useState(0);

    // Tooltip state with improved positioning
    const [tooltip, setTooltip] = useState<{ show: boolean; text: string; x: number; y: number; targetRect?: DOMRect }>({
        show: false,
        text: '',
        x: 0,
        y: 0
    });

    // Progress bar hover tooltip state
    const [progressTooltip, setProgressTooltip] = useState<{ show: boolean; time: string; x: number; y: number }>({
        show: false,
        time: '',
        x: 0,
        y: 0
    });

    // Mouse move handler for controls visibility
    const [mouseInControls, setMouseInControls] = useState(false);
    const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [volumeSliderTimeout, setVolumeSliderTimeout] = useState<NodeJS.Timeout | null>(null);

    // Network state messages
    const getNetworkStateMessage = useCallback((state: number): string => {
        switch (state) {
            case 0: return 'Initializing';
            case 1: return 'Loading';
            case 2: return 'Network active';
            case 3: return 'Network idle';
            default: return 'Unknown';
        }
    }, []);

    // Check network connectivity
    const checkNetworkConnectivity = useCallback(() => {
        if (!navigator.onLine) {
            setVideoError('No internet connection. Please check your network.');
            setIsLoading(false);
            setIsBuffering(false);
            setPlaying(false);
            return false;
        }
        return true;
    }, []);

    // Ready state messages
    const getReadyStateMessage = useCallback((state: number): string => {
        switch (state) {
            case 0: return 'No data';
            case 1: return 'Metadata loaded';
            case 2: return 'Current data';
            case 3: return 'Future data';
            case 4: return 'Enough data';
            default: return 'Unknown';
        }
    }, []);


    useEffect(() => {
        if (!mouseInControls && playing && !isTheaterMode) {
            const timer = setTimeout(() => {
                setShowControls(false);
            }, 100);
            setControlsTimeout(timer);
            return () => {
                if (timer) clearTimeout(timer);
            };
        }
        return () => {
            if (controlsTimeout) clearTimeout(controlsTimeout);
        };
    }, [mouseInControls, playing, isTheaterMode]);


    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (volumeSliderTimeout) {
                clearTimeout(volumeSliderTimeout);
            }
        };
    }, []);


    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);


    useEffect(() => {
        const handleOnline = () => {
            if (isMountedRef.current) {
                setVideoError(null);

                if (videoRef.current && videoError) {
                    videoRef.current.load();
                }
            }
        };

        const handleOffline = () => {
            if (isMountedRef.current) {
                setVideoError('No internet connection. Please check your network.');
                setIsLoading(false);
                setIsBuffering(false);
                setPlaying(false);
            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [videoError]);

    // Decide whether to use Shaka (manifests) or native (progressive URLs like MP4)
    const isManifestUrl = useMemo(() => {
        const lowerUrl = (videoData?.video_url || '').toLowerCase();
        return lowerUrl.endsWith('.mpd') || lowerUrl.includes('.m3u8');
    }, [videoData?.video_url]);

    // Initialize / destroy Shaka Player for manifest URLs
    useEffect(() => {
        let destroyed = false;

        async function initShaka() {
            if (!isManifestUrl) {
                // Ensure any previous player is destroyed when switching away from manifest
                if (shakaPlayerRef.current && typeof shakaPlayerRef.current.destroy === 'function') {
                    try { await shakaPlayerRef.current.destroy(); } catch { }
                }
                shakaPlayerRef.current = null;
                return;
            }

            try {
                if (!videoRef.current) return;

                setIsLoading(true);
                setIsBuffering(false);
                setVideoError(null);

                const shaka: any = (await import('shaka-player/dist/shaka-player.compiled.js')) as any;
                shaka.polyfill.installAll();

                if (!shaka.Player.isBrowserSupported()) {
                    setVideoError('This browser is not supported by Shaka Player.');
                    setIsLoading(false);
                    return;
                }

                const player = new shaka.Player(videoRef.current);
                shakaPlayerRef.current = player;

                player.addEventListener('error', (event: any) => {
                    const err = event?.detail;
                    setVideoError(`Playback error: ${err?.message || 'Unknown error'}`);
                    setIsLoading(false);
                    setIsBuffering(false);
                    setPlaying(false);
                });

                await player.load(videoData.video_url);

                // Autoplay behavior for Shaka as well
                if (autoPlay && videoRef.current && videoRef.current.paused) {
                    await videoRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
                }

                if (!destroyed) {
                    setIsLoading(false);
                    setIsBuffering(false);
                }
            } catch (err: any) {
                // eslint-disable-next-line no-console
                console.error('Shaka init/load error', err);
                setVideoError(err?.message || 'Failed to load the video');
                setIsLoading(false);
                setIsBuffering(false);
                setPlaying(false);
            }
        }

        initShaka();

        return () => {
            destroyed = true;
            if (shakaPlayerRef.current && typeof shakaPlayerRef.current.destroy === 'function') {
                shakaPlayerRef.current.destroy().catch(() => { });
            }
            shakaPlayerRef.current = null;
            if (videoRef.current) {
                // Clear native src to avoid conflicts when switching between types
                videoRef.current.removeAttribute('src');
                videoRef.current.load?.();
            }
        };
    }, [isManifestUrl, videoData.video_url, autoPlay]);


    useEffect(() => {
        if (isTheaterMode) {
            setShowControls(true);
        }
    }, [isTheaterMode]);




    useEffect(() => {
        if (!isMountedRef.current) return;

        if (!checkNetworkConnectivity()) {
            return;
        }

        setIsLoading(true);
        setIsBuffering(false);
        setLoadProgress(0);
        setBufferedRanges(null);
        setNetworkState(0);
        setReadyState(0);
        setVideoError(null);
        setCurrentTime(0);
        setDuration(0);
        setPlaying(false);
        setIsMuted(false);

        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.load();
        }

        const loadingTimeout = setTimeout(() => {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }, 10000);

        return () => clearTimeout(loadingTimeout);
    }, [videoData.video_id, videoData.video_url]);


    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isMountedRef.current) return;

        const handleNetworkStateChange = () => {
            if (!isMountedRef.current) return;
            const newState = video.networkState;
            setNetworkState(newState);
            onNetworkStateChange?.(newState, getNetworkStateMessage(newState));


            if (newState === 3) {
                setVideoError('Network error: Unable to load video');
                setIsLoading(false);
                setIsBuffering(false);
                setPlaying(false);
            }
        };

        const handleReadyStateChange = () => {
            if (!isMountedRef.current) return;
            const newState = video.readyState;
            setReadyState(newState);

            if (newState >= 3) {
                setIsLoading(false);
                setIsBuffering(false);
            }
        };

        const handleLoadStart = () => {
            if (!isMountedRef.current) return;
            setIsLoading(true);
            setIsBuffering(false);
            setLoadProgress(0);
            setVideoError(null);
        };

        const handleCanPlay = () => {
            if (!isMountedRef.current) return;
            setIsLoading(false);
            setIsBuffering(false);


            if (autoPlay && videoRef.current && !playing) {
                videoRef.current.play().then(() => {
                    setPlaying(true);
                }).catch((error) => {
                    setPlaying(false);
                });
            }
        };

        const handleCanPlayThrough = () => {
            if (!isMountedRef.current) return;
            setIsLoading(false);
            setIsBuffering(false);


            if (autoPlay && videoRef.current && !playing) {
                videoRef.current.play().then(() => {
                    setPlaying(true);
                }).catch((error) => {
                    setPlaying(false);
                });
            }
        };

        const handleLoadedData = () => {
            if (!isMountedRef.current) return;
            setIsLoading(false);
            setIsBuffering(false);


            if (videoRef.current) {
                const isActuallyPlaying = !videoRef.current.paused && !videoRef.current.ended;
                if (isActuallyPlaying !== playing) {
                    setPlaying(isActuallyPlaying);
                }


                if (videoRef.current.muted !== isMuted) {
                    setIsMuted(videoRef.current.muted);
                }
            }


            if (autoPlay && videoRef.current && !playing) {
                videoRef.current.play().then(() => {
                    setPlaying(true);
                }).catch((error) => {
                    setPlaying(false);
                });
            }
        };

        const handleProgress = () => {
            if (!isMountedRef.current) return;
            if (video.buffered.length > 0) {
                setBufferedRanges(video.buffered);


                let totalBuffered = 0;
                for (let i = 0; i < video.buffered.length; i++) {
                    totalBuffered += video.buffered.end(i) - video.buffered.start(i);
                }
                const duration = video.duration || 1;
                const bufferedPercentage = (totalBuffered / duration) * 100;
                setLoadProgress(bufferedPercentage);

                if (bufferedPercentage > 5) {
                    setIsLoading(false);
                }

                if (playing && bufferedPercentage < 10 && currentTime > 0) {
                    video.pause();
                    setPlaying(false);
                    setIsBuffering(true);
                }
            } else {

                setLoadProgress(0);
            }
        };

        const handleWaiting = () => {
            if (!isMountedRef.current) return;
            setIsBuffering(true);
        };

        const handlePlaying = () => {
            if (!isMountedRef.current) return;
            setIsBuffering(false);
        };

        const handleStalled = () => {
            if (!isMountedRef.current) return;
            setIsBuffering(true);
        };

        const handleSuspend = () => {
            if (!isMountedRef.current) return;
            setIsBuffering(false);
        };

        const handleError = (e: Event) => {
            if (!isMountedRef.current) return;
            const target = e.target as HTMLVideoElement;
            const error = target.error;

            if (error) {
                let errorMessage = 'Video loading error';
                switch (error.code) {
                    case 1:
                        errorMessage = 'Video loading aborted';
                        break;
                    case 2:
                        errorMessage = 'Network error while loading video';
                        break;
                    case 3:
                        errorMessage = 'Video decoding error';
                        break;
                    case 4:
                        errorMessage = 'Video not supported';
                        break;
                }
                setVideoError(errorMessage);
                setIsLoading(false);
                setIsBuffering(false);
                setPlaying(false);
            }
        };

        const handleAbort = () => {
            if (!isMountedRef.current) return;
            setIsLoading(false);
            setIsBuffering(false);
        };

        // Add event listeners
        video.addEventListener('loadstart', handleLoadStart);
        video.addEventListener('progress', handleProgress);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('canplaythrough', handleCanPlayThrough);
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('stalled', handleStalled);
        video.addEventListener('suspend', handleSuspend);
        video.addEventListener('readystatechange', handleReadyStateChange);
        video.addEventListener('networkstatechange', handleNetworkStateChange);
        video.addEventListener('error', handleError);
        video.addEventListener('abort', handleAbort);

        return () => {
            video.removeEventListener('loadstart', handleLoadStart);
            video.removeEventListener('progress', handleProgress);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('canplaythrough', handleCanPlayThrough);
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('stalled', handleStalled);
            video.removeEventListener('suspend', handleSuspend);
            video.removeEventListener('readystatechange', handleReadyStateChange);
            video.removeEventListener('networkstatechange', handleNetworkStateChange);
            video.removeEventListener('error', handleError);
            video.removeEventListener('abort', handleAbort);
        };
    }, [getNetworkStateMessage, onNetworkStateChange, autoPlay]);



    // Import video progress hook
    const { saveVideoProgress, loadVideoProgress, clearVideoProgress, throttledSaveProgress } = useVideoProgress();

    // Custom video player functions
    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (playing) {
                videoRef.current.pause();
                setPlaying(false);
            } else {
                videoRef.current.play().then(() => {
                    setPlaying(true);
                }).catch((error) => {
                    setPlaying(false);
                });
            }
        }
    }, [playing]);

    const skipBackward = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        }
    }, []);

    const skipForward = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
        }
    }, []);

    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            const time = videoRef.current.currentTime;
            setCurrentTime(time);
            onTimeUpdate?.(time, videoRef.current.duration);

            // Save progress using throttled function (max once every 3 seconds)
            if (time > 0 && videoRef.current.duration > 0) {
                throttledSaveProgress(videoData.video_id, time, videoRef.current.duration);
            }

            if (videoRef.current.buffered.length > 0) {
                setBufferedRanges(videoRef.current.buffered);
            }
        }
    }, [onTimeUpdate, throttledSaveProgress, videoData?.video_id]);

    const handleLoadedMetadata = useCallback(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    }, []);

    const wasPlayingBeforeSeek = useRef(false);

    const handleSeekMouseDown = useCallback(() => {
        if (videoRef.current) {
            wasPlayingBeforeSeek.current = !videoRef.current.paused;
        }
    }, []);

    const handleSeekMouseUp = useCallback(() => {
        if (videoRef.current && !wasPlayingBeforeSeek.current) {
            videoRef.current.pause();
            setPlaying(false);
        }
    }, []);

    const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    }, []);

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            const newMutedState = !videoRef.current.muted;
            videoRef.current.muted = newMutedState;
            setIsMuted(newMutedState);
        }
    }, []);

    const formatTime = useCallback((time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, []);


    const getVolumeIcon = useCallback(() => {
        if (isMuted || volume === 0) {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
            );
        } else if (volume < 0.5) {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3z" />
                </svg>
            );
        } else {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
            );
        }
    }, [isMuted, volume]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            const videoContainer = document.querySelector('.video-player-container') as HTMLElement;
            if (videoContainer) {
                videoContainer.requestFullscreen().catch(err => {
                    console.error('Error attempting to enable fullscreen:', err);
                });
            }
        } else {
            // Exit fullscreen
            document.exitFullscreen().catch(err => {
                console.error('Error attempting to exit fullscreen:', err);
            });
        }
    }, []);

    const toggleLoop = useCallback(() => {
        setIsLooping(!isLooping);
        if (videoRef.current) {
            videoRef.current.loop = !isLooping;
        }
    }, [isLooping]);

    const handleVideoEnd = useCallback(() => {
        setPlaying(false);
        // Clear progress when video is completed
        if (videoData?.video_id) {
            clearVideoProgress(videoData.video_id);
        }
        onVideoEnd?.();
    }, [onVideoEnd, clearVideoProgress, videoData?.video_id]);

    const handlePlay = useCallback(() => {
        if (!isMountedRef.current) return;
        setPlaying(true);
        onPlay?.();
    }, [onPlay]);

    const handlePause = useCallback(() => {
        if (!isMountedRef.current) return;
        setPlaying(false);
        onPause?.();
    }, [onPause]);

    // Improved tooltip functions
    const showTooltip = useCallback((text: string, event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltip({
            show: true,
            text,
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            targetRect: rect
        });
    }, []);

    const hideTooltip = useCallback(() => {
        setTooltip(prev => ({ ...prev, show: false }));
    }, []);

    // Progress bar hover functions
    const handleProgressHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progressWidth = rect.width;
        const hoverPercent = Math.max(0, Math.min(1, clickX / progressWidth));
        const hoverTime = hoverPercent * duration;

        setProgressTooltip({
            show: true,
            time: formatTime(hoverTime),
            x: e.clientX,
            y: rect.top - 15
        });
    }, [duration, formatTime]);

    const handleProgressLeave = useCallback(() => {
        setProgressTooltip(prev => ({ ...prev, show: false }));
    }, []);

    // Handle mouse events for controls
    const handleMouseEnter = useCallback(() => {
        setShowControls(true);
        setMouseInControls(true);
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }
    }, [controlsTimeout]);

    const handleMouseLeave = useCallback(() => {
        setMouseInControls(false);
    }, []);

    // Handle button clicks and remove focus rings
    const handleButtonClick = useCallback((e: React.MouseEvent, callback?: () => void) => {
        e.preventDefault();
        e.stopPropagation();


        if (callback) {
            callback();
        }


        setTimeout(() => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }, 100);
    }, []);


    const handleVolumeHover = useCallback(() => {
        setShowVolumeSlider(true);
        if (volumeSliderTimeout) {
            clearTimeout(volumeSliderTimeout);
        }
    }, []);

    const handleVolumeLeave = useCallback(() => {
        const timeout = setTimeout(() => {
            setShowVolumeSlider(false);
        }, 100);
        setVolumeSliderTimeout(timeout);
    }, []);


    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed, videoData.video_id]);

    // Keyboard controls handler
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Space' || e.key === ' ') {
            togglePlay();
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            setVolume((prev) => {
                const newVolume = Math.min(1, prev + 0.1);
                if (videoRef.current) videoRef.current.volume = newVolume;
                return newVolume;
            });
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            setVolume((prev) => {
                const newVolume = Math.max(0, prev - 0.1);
                if (videoRef.current) videoRef.current.volume = newVolume;
                return newVolume;
            });
            e.preventDefault();
        }
    }, [togglePlay]);

    // Picture-in-Picture toggle function
    const togglePictureInPicture = useCallback(async () => {
        if (!videoRef.current) return;

        try {
            if (document.pictureInPictureElement) {
                // Exit PiP mode
                await document.exitPictureInPicture();
                // Pause video when exiting PiP
                if (playing) {
                    videoRef.current.pause();
                    setPlaying(false);
                }
            } else {
                // Enter PiP mode
                await videoRef.current.requestPictureInPicture();
            }
        } catch (error) {
            console.error('Picture-in-Picture error:', error);
        }
    }, [playing]);

    // Handle Picture-in-Picture state changes
    useEffect(() => {
        const handlePiPEnter = () => {
            setIsPictureInPicture(true);
        };

        const handlePiPLeave = () => {
            setIsPictureInPicture(false);
            // Pause video when PiP is exited (either by user or system)
            if (videoRef.current && playing) {
                videoRef.current.pause();
                setPlaying(false);
            }
        };

        document.addEventListener('enterpictureinpicture', handlePiPEnter);
        document.addEventListener('leavepictureinpicture', handlePiPLeave);

        return () => {
            document.removeEventListener('enterpictureinpicture', handlePiPEnter);
            document.removeEventListener('leavepictureinpicture', handlePiPLeave);
        };
    }, [playing]);

    // Add useEffect to control initial playback
    useEffect(() => {
        if (autoPlay && videoRef.current && !playing) {
            videoRef.current.play().then(() => {
                setPlaying(true);
            }).catch(() => {
                setPlaying(false);
            });
        }
    }, [autoPlay, videoData.video_id]);

    // Show loading immediately when videoData changes (video switch)
    useEffect(() => {
        setIsLoading(true);
        setIsBuffering(false);
        setVideoError(null);
        setCurrentTime(0);
        setDuration(0);
        setPlaying(false);
        setIsMuted(false);
        setHasRestoredProgress(false); // Reset progress restoration flag
    }, [videoData.video_id]);

    // Video progress tracking state
    const [savedProgress, setSavedProgress] = useState<number>(0);
    const [hasRestoredProgress, setHasRestoredProgress] = useState(false);

    // Save progress using throttled function (max once every 3 seconds)
    useEffect(() => {
        if (!videoData?.video_id || !duration || !currentTime || !playing) return;

        const interval = setInterval(() => {
            if (currentTime > 0 && duration > 0 && playing) {
                throttledSaveProgress(videoData.video_id, currentTime, duration);
            }
        }, 5000); // Check every 5 seconds, but throttle ensures max once per 5 seconds

        return () => clearInterval(interval);
    }, [videoData?.video_id, currentTime, duration, throttledSaveProgress, playing]);

    // Restore video progress when video loads
    useEffect(() => {
        if (!videoData?.video_id || !videoRef.current || hasRestoredProgress) return;

        const progress = loadVideoProgress(videoData.video_id);
        if (progress && progress.currentTime > 0) {
            // Only restore if progress is less than 95% (not near end)
            if (progress.percentage < 95) {
                setSavedProgress(progress.currentTime);
                setHasRestoredProgress(true);

                // Set the video time after metadata is loaded
                const setVideoTime = () => {
                    if (videoRef.current && videoRef.current.readyState >= 1) {
                        videoRef.current.currentTime = progress.currentTime;
                        setCurrentTime(progress.currentTime);
                    }
                };

                // Try to set time immediately if possible
                setVideoTime();

                // Also try when metadata is loaded
                const handleMetadataLoaded = () => {
                    setVideoTime();
                    videoRef.current?.removeEventListener('loadedmetadata', handleMetadataLoaded);
                };
                videoRef.current.addEventListener('loadedmetadata', handleMetadataLoaded);
            }
        }
    }, [videoData?.video_id, hasRestoredProgress, loadVideoProgress]);

    if (!videoData) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-100 rounded-xl">
                <span className="text-lg font-semibold text-gray-500">No video data provided</span>
            </div>
        );
    }

    return (
        <div className={`${className} ${isTheaterMode ? 'theater-mode' : ''}`} style={{ width, height }}>
            {/* Video Player */}
            <div
                className={`video-player-container relative cursor-pointer bg-black overflow-hidden group transition-all duration-500 ease-in-out ${isTheaterMode
                    ? 'fixed top-0 left-0 w-full max-h-[80vh] h-auto z-[9999] rounded-none flex items-center justify-center' // changed here
                    : 'w-full aspect-video'
                    }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onContextMenu={(e) => e.preventDefault()}

            >
                {videoData.video_url ? (
                    <>
                        <video
                            key={`video-${videoData.video_id}`}
                            ref={videoRef}
                            src={isManifestUrl ? undefined : videoData.video_url}
                            className={`w-full h-full object-cover ${isTheaterMode ? 'max-h-[80vh] w-auto mx-auto' : ''}`}
                            preload={preload}
                            controls={false}
                            playsInline
                            
                            draggable={false}
                            controlsList="nodownload noplaybackrate"
                            disablePictureInPicture
                            crossOrigin="anonymous"
                            onDragStart={(e) => e.preventDefault()}
                            onContextMenu={(e) => e.preventDefault()}
                            onError={(e) => {
                                const target = e.target as HTMLVideoElement;
                                const error = target.error;

                                let errorMessage = 'Failed to load video';
                                if (error) {
                                    switch (error.code) {
                                        case 1:
                                            errorMessage = 'Video loading aborted';
                                            break;
                                        case 2:
                                            errorMessage = 'Network error - Check CORS settings';
                                            break;
                                        case 3:
                                            errorMessage = 'Video decoding error';
                                            break;
                                        case 4:
                                            errorMessage = 'Video format not supported';
                                            break;
                                    }
                                }

                                setVideoError(errorMessage);
                                setIsLoading(false);
                                setIsBuffering(false);
                                setPlaying(false);
                            }}
                            onLoadedData={() => {
                                setVideoError(null);
                                setIsLoading(false);
                                setIsBuffering(false);

                                if (videoRef.current) {
                                    const isActuallyPlaying = !videoRef.current.paused && !videoRef.current.ended;
                                    if (isActuallyPlaying !== playing) {
                                        setPlaying(isActuallyPlaying);
                                    }

                                    if (videoRef.current.muted !== isMuted) {
                                        setIsMuted(videoRef.current.muted);
                                    }
                                }

                                if (videoRef.current) {
                                    const video = videoRef.current;
                                    if (video.buffered.length > 0) {
                                        setBufferedRanges(video.buffered);

                                        let totalBuffered = 0;
                                        for (let i = 0; i < video.buffered.length; i++) {
                                            totalBuffered += video.buffered.end(i) - video.buffered.start(i);
                                        }
                                        const duration = video.duration || 1;
                                        setLoadProgress((totalBuffered / duration) * 100);
                                    } else {
                                        setLoadProgress(0);
                                    }
                                }
                            }}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onEnded={handleVideoEnd}
                            loop={isLooping}
                            muted={volume === 0}
                            style={{ pointerEvents: 'auto' }}
                            onClick={togglePlay}
                            onDoubleClick={toggleFullscreen}
                        >
                            Your browser does not support the video tag.
                        </video>

                        {/* Loading/Buffering Overlay */}
                        {(isLoading || (isBuffering && showBuffering)) && (
                            <div
                                key={`loading-${videoData.video_id}`}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm"
                            >
                                <div className="text-center text-white">
                                    {/* Enhanced Loading Animation */}
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

                                    {/* Network Status - Only show if not in initial state */}
                                    {networkState > 0 && (
                                        <div className="text-xs text-gray-300 mb-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${networkState === 1 ? 'bg-yellow-500 animate-pulse' :
                                                    networkState === 2 ? 'bg-blue-500' :
                                                        networkState === 3 ? 'bg-green-500' : 'bg-gray-500'
                                                    }`} />
                                                <span className="font-medium">{getNetworkStateMessage(networkState)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Load Progress */}
                                    {loadProgress > 0 && (
                                        <div className="text-xs text-gray-300 mb-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <span>Loaded: {loadProgress.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Network Speed Warning */}
                                    {networkState === 1 && loadProgress < 20 && (
                                        <div className="text-xs text-yellow-400 bg-yellow-900/30 px-4 py-2 rounded-lg border border-yellow-500/30">
                                            ⚠️ Slow network detected - Video may pause frequently
                                        </div>
                                    )}

                                    {/* Retry Button for Network Errors */}
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

                        {/* Network State Indicator */}
                        {networkState > 0 && !isLoading && (
                            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-30">
                                <span className="mr-2">●</span>
                                {getNetworkStateMessage(networkState)}
                            </div>
                        )}

                        {/* Video Info Overlay (Theater Mode) */}
                        {isTheaterMode && showVideoInfo && (
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

                        {/* Custom Video Controls */}
                        <div
                            className={`video-controls-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-3 transition-all duration-300 ease-in-out ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseUp={(e) => e.stopPropagation()}
                            style={{ pointerEvents: 'auto' }}
                        >
                            {/* Progress Bar with Buffering Indicator */}
                            <div
                                className={`mb-3 relative ${allowSeeking ? 'cursor-pointer' : 'cursor-default'}`}
                                onClick={(e) => e.stopPropagation()}
                                onMouseMove={handleProgressHover}
                                onMouseLeave={handleProgressLeave}
                                onMouseEnter={() => setProgressTooltip(prev => ({ ...prev, show: true }))}
                            >
                                {/* Combined Progress Bar - Shows both buffered and played content */}
                                <div className="relative w-full h-1.5 bg-gray-600 rounded-lg overflow-hidden">
                                    {/* Buffered Progress (Gray background) - Shows actual loaded content */}
                                    {bufferedRanges && bufferedRanges.length > 0 && duration > 0 ? (
                                        <div className="absolute top-0 left-0 h-full w-full">
                                            {Array.from({ length: bufferedRanges.length }, (_, i) => {
                                                const start = bufferedRanges.start(i);
                                                const end = bufferedRanges.end(i);
                                                const startPercent = Math.max(0, (start / duration) * 100);
                                                const endPercent = Math.min(100, (end / duration) * 100);
                                                return (
                                                    <div
                                                        key={i}
                                                        className="absolute h-full bg-gray-400 rounded-lg"
                                                        style={{
                                                            left: `${startPercent}%`,
                                                            width: `${endPercent - startPercent}%`
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ) : loadProgress > 0 && duration > 0 ? (
                                        /* Fallback: Show overall buffered percentage */
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gray-400 rounded-lg"
                                            style={{ width: `${Math.min(100, loadProgress)}%` }}
                                        />
                                    ) : null}

                                    {/* Playback Progress (Orange overlay) */}
                                    <div
                                        className="absolute top-0 left-0 h-full bg-[#F1C27D] rounded-lg transition-all duration-200"
                                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                    />

                                    {/* Buffering Indicator (if currently buffering) */}
                                    {isBuffering && (
                                        <div className="absolute top-0 right-0 h-full w-1 bg-yellow-400 animate-pulse rounded-r-lg" />
                                    )}
                                </div>

                                {/* Seekable Range Input */}
                                {allowSeeking && (
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 0}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        onMouseDown={(e) => { e.stopPropagation(); handleSeekMouseDown(); }}
                                        onMouseUp={(e) => { e.stopPropagation(); handleSeekMouseUp(); }}
                                        className="absolute top-0 left-0 w-full h-1.5 opacity-0 cursor-pointer z-10"
                                        style={{ pointerEvents: 'auto' }}
                                    />
                                )}
                            </div>

                            {/* Controls Bar */}
                            <div className="flex items-center justify-between text-white" style={{ pointerEvents: 'auto' }}>
                                {/* Left Controls */}
                                <div className="flex items-center  flex-shrink-0 gap-2">
                                    {/* Previous Track */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleButtonClick(e, () => {
                                            if (!isPreviousDisabled && onPreviousTrack) {
                                                onPreviousTrack();
                                            }
                                        })}
                                        disabled={isPreviousDisabled}
                                        onMouseEnter={(e) => showTooltip(isPreviousDisabled ? "First" : "Previous", e)}
                                        onMouseLeave={hideTooltip}
                                        className={`video-control-btn cursor-pointer p-1 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${isPreviousDisabled
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-white/20 hover:shadow-md'
                                            }`}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                                        </svg>
                                    </button>

                                    {/* Play/Pause */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleButtonClick(e, togglePlay)}
                                        onMouseEnter={(e) => showTooltip(playing ? "Pause" : "Play", e)}
                                        onMouseLeave={hideTooltip}
                                        className="video-control-btn cursor-pointer p-1 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-white/20 hover:shadow-md"
                                    >
                                        {playing ? (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                            </svg>
                                        ) : (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Next Track */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleButtonClick(e, () => {
                                            if (!isNextDisabled && onNextTrack) {
                                                onNextTrack();
                                            }
                                        })}
                                        disabled={isNextDisabled}
                                        onMouseEnter={(e) => showTooltip(isNextDisabled ? "Last" : "Next", e)}
                                        onMouseLeave={hideTooltip}
                                        className={`video-control-btn cursor-pointer p-1 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${isNextDisabled
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-white/20 hover:shadow-md'
                                            }`}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                                        </svg>
                                    </button>

                                    {/* Volume */}
                                    {showVolumeControls && (
                                        <div
                                            className="flex items-center gap-2 relative"
                                            onMouseEnter={handleVolumeHover}
                                            onMouseLeave={handleVolumeLeave}
                                        >
                                            <button
                                                type="button"
                                                onClick={(e) => handleButtonClick(e, toggleMute)}
                                                onMouseEnter={(e) => showTooltip(isMuted ? "Unmute" : "Mute", e)}
                                                onMouseLeave={hideTooltip}
                                                className="video-control-btn cursor-pointer p-1 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-white/20 hover:shadow-md flex-shrink-0"
                                            >
                                                {getVolumeIcon()}
                                            </button>
                                            <div className={`relative flex items-center transition-all duration-300 ease-in-out ${showVolumeSlider ? 'opacity-100 w-16' : 'opacity-0 w-0 overflow-hidden'}`}>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={volume}
                                                    onChange={handleVolumeChange}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onMouseUp={(e) => e.stopPropagation()}
                                                    className="volume-slider w-16 h-1 rounded-lg appearance-none cursor-pointer transition-all duration-200"
                                                    style={{
                                                        pointerEvents: 'auto',
                                                        background: `linear-gradient(to right, #F1C27D 0%, #F1C27D ${volume * 100}%, #fff ${volume * 100}%, #fff 100%)`
                                                    }}
                                                />
                                                {/* Volume percentage tooltip */}
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 transition-opacity duration-200 pointer-events-none volume-tooltip whitespace-nowrap">
                                                    {Math.round(volume * 100)}%
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Time Display */}
                                    <span className="text-sm font-medium flex-shrink-0">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>

                                {/* Right Controls */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {/* Rewind 10s */}
                                    {showSkipControls && (
                                        <button
                                            type="button"
                                            onClick={(e) => handleButtonClick(e, skipBackward)}
                                            onMouseEnter={(e) => showTooltip("Rewind 10s", e)}
                                            onMouseLeave={hideTooltip}
                                            className="video-control-btn cursor-pointer p-1 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-white/20 hover:shadow-md"
                                        >
                                            <MdOutlineReplay10 className="text-2xl" />
                                        </button>
                                    )}

                                    {/* Forward 10s */}
                                    {showSkipControls && (
                                        <button
                                            type="button"
                                            onClick={(e) => handleButtonClick(e, skipForward)}
                                            onMouseEnter={(e) => showTooltip("Forward 10s", e)}
                                            onMouseLeave={hideTooltip}
                                            className="video-control-btn cursor-pointer p-1 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-white/20 hover:shadow-md"
                                        >
                                            <MdOutlineForward10 className="text-2xl" />
                                        </button>
                                    )}

                                    {/* Loop */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleButtonClick(e, toggleLoop)}
                                        onMouseEnter={(e) => showTooltip(isLooping ? "Disable Loop" : "Enable Loop", e)}
                                        onMouseLeave={hideTooltip}
                                        className={`video-control-btn cursor-pointer p-1 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${isLooping ? 'bg-[#F1C27D] text-white shadow-lg' : 'hover:bg-white/20 hover:shadow-md'
                                            }`}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                                        </svg>
                                    </button>

                                    {/* Theater Mode */}
                                    {onTheaterModeToggle && (
                                        <button
                                            type="button"
                                            onClick={(e) => handleButtonClick(e, onTheaterModeToggle)}
                                            onMouseEnter={(e) => showTooltip(isTheaterMode ? "Exit Theater Mode" : "Theater Mode", e)}
                                            onMouseLeave={hideTooltip}
                                            className={`video-control-btn cursor-pointer p-1 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${isTheaterMode ? 'bg-[#F1C27D] text-white shadow-lg' : 'hover:bg-white/20 hover:shadow-md'
                                                }`}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
                                            </svg>
                                        </button>
                                    )}



                                    {/* Settings */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleButtonClick(e, () => {
                                            setShowSettings(!showSettings);
                                            setSettingsView('main');
                                        })}
                                        onMouseEnter={(e) => showTooltip("Settings", e)}
                                        onMouseLeave={hideTooltip}
                                        className={`video-control-btn cursor-pointer p-1 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${showSettings ? 'bg-[#F1C27D] text-white shadow-lg' : 'hover:bg-white/20 hover:shadow-md'
                                            }`}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                                        </svg>
                                    </button>

                                    {/* Fullscreen */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleButtonClick(e, toggleFullscreen)}
                                        onMouseEnter={(e) => showTooltip(isFullscreen ? "Exit Fullscreen" : "Fullscreen", e)}
                                        onMouseLeave={hideTooltip}
                                        className={`video-control-btn cursor-pointer p-1 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${isFullscreen ? 'bg-[#F1C27D] text-white shadow-lg' : 'hover:bg-white/20 hover:shadow-md'
                                            }`}
                                    >
                                        {isFullscreen ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Settings Panel */}
                            {showSettings && (
                                <div className="absolute bottom-16 right-0 bg-black/60 rounded-lg text-white min-w-56 transition-all duration-200 ease-in-out backdrop-blur-sm border border-white/10">
                                    {settingsView === 'main' ? (
                                        /* Main Settings View */
                                        <div className="p-3 space-y-2">
                                            {/* Picture-in-Picture Option */}
                                            <div
                                                className="flex items-center justify-between py-2 px-2 rounded hover:bg-white/10 transition-colors cursor-pointer"
                                                onClick={(e) => handleButtonClick(e, togglePictureInPicture)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Picture-in-Picture</span>
                                                </div>
                                                <span className="text-sm text-gray-300">
                                                    {isPictureInPicture ? 'On' : 'Off'}
                                                </span>
                                            </div>

                                            {/* Playback Speed Option */}
                                            <div
                                                className="flex items-center justify-between py-2 px-2 rounded hover:bg-white/10 transition-colors cursor-pointer"
                                                onClick={() => setSettingsView('playback-speed')}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        {/* Circular dashed arrow */}
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2" strokeDasharray="3 2" />
                                                        {/* Play triangle inside */}
                                                        <path d="M10 8l4 4-4 4V8z" fill="currentColor" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Playback speed</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-300">
                                                        {playbackSpeed === 1 ? '1x' : `${playbackSpeed}x`}
                                                    </span>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Playback Speed Sub-menu */
                                        <div className="p-3">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/20">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setSettingsView('main')}
                                                        className="p-1 hover:bg-white/10 rounded transition-colors"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                                        </svg>
                                                    </button>
                                                    <span className="text-sm font-medium">Playback speed</span>
                                                </div>
                                                <button
                                                    onClick={() => setShowSettings(false)}
                                                    className="p-1 hover:bg-white/10 rounded transition-colors"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Speed Options */}
                                            <div className="space-y-1">
                                                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                                                    <div
                                                        key={speed}
                                                        className={`flex items-center justify-between py-2 px-2 rounded cursor-pointer transition-colors ${playbackSpeed === speed ? 'bg-[#F1C27D]/20 text-[#F1C27D]' : 'hover:bg-white/10'
                                                            }`}
                                                        onClick={() => {
                                                            setPlaybackSpeed(speed);
                                                            if (videoRef.current) {
                                                                videoRef.current.playbackRate = speed;
                                                            }
                                                            setSettingsView('main');
                                                        }}
                                                    >
                                                        <span className="text-sm">
                                                            {speed === 1 ? 'Normal' : `${speed}x`}
                                                        </span>
                                                        {playbackSpeed === speed && (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Improved Tooltip */}
                        {tooltip.show && (
                            <div
                                className="fixed z-[10000] p-2 text-sm text-white bg-black/90 rounded-lg pointer-events-none shadow-lg transition-all duration-200 ease-in-out backdrop-blur-sm"
                                style={{
                                    left: tooltip.x,
                                    top: tooltip.y,
                                    transform: 'translateX(-50%) translateY(-100%)',
                                    pointerEvents: 'none'
                                }}
                            >
                                {tooltip.text}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
                            </div>
                        )}

                        {/* Progress Bar Time Tooltip */}
                        {progressTooltip.show && (
                            <div
                                className="fixed z-[10000] px-2 py-1 text-xs text-white bg-black/95 rounded pointer-events-none shadow-lg backdrop-blur-sm font-mono"
                                style={{
                                    left: progressTooltip.x,
                                    top: progressTooltip.y,
                                    transform: 'translateX(-50%) translateY(-100%)',
                                    pointerEvents: 'none',
                                    transition: 'none'
                                }}
                            >
                                {progressTooltip.time}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-black/95" />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-white">
                        <div className="text-center">
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
