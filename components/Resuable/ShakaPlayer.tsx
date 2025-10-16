"use client"
import React, { useEffect, useRef, useState } from "react";

export interface ShakaVideoData {
    video_id: string;
    video_title: string;
    video_url: string;
}

interface ShakaPlayerProps {
    videoData: ShakaVideoData;
    className?: string;
    isTheaterMode?: boolean;
    onTheaterModeToggle?: () => void;
}

export default function ShakaPlayer({ videoData, className, isTheaterMode, onTheaterModeToggle }: ShakaPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let destroyed = false;
        let player: any;
        let shakaLib: any | null = null;

        async function init() {
            try {
                if (!videoRef.current) return;

                // Decide whether to use Shaka (manifests) or native (progressive URLs like MP4)
                const lowerUrl = (videoData.video_url || "").toLowerCase();
                const isManifest = lowerUrl.endsWith(".mpd") || lowerUrl.includes(".m3u8");

                if (isManifest) {
                    const shaka = (await import("shaka-player/dist/shaka-player.compiled.js")) as any;
                    shakaLib = shaka;

                    shaka.polyfill.installAll();

                    if (!shaka.Player.isBrowserSupported()) {
                        setErrorMessage("This browser is not supported by Shaka Player.");
                        return;
                    }

                    player = new shaka.Player(videoRef.current);

                    // Listen for error events.
                    player.addEventListener("error", (event: any) => {
                        const err = event.detail as any;
                        setErrorMessage(`Playback error: ${err?.message || "Unknown error"}`);
                    });

                    await player.load(videoData.video_url);
                } else {
                    // Progressive URL: use native video element
                    videoRef.current.src = videoData.video_url;
                    await videoRef.current.load?.();
                }
            } catch (err: any) {
                // eslint-disable-next-line no-console
                console.error("Shaka init/load error", err);
                setErrorMessage(err?.message || "Failed to load the video");
            }
        }

        init();

        return () => {
            destroyed = true;
            if (player && typeof player.destroy === "function") {
                player.destroy();
            }
            player = null;
            shakaLib = null;
            if (videoRef.current) {
                videoRef.current.removeAttribute("src");
                videoRef.current.load?.();
            }
        };
    }, [videoData.video_url]);

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">{videoData.video_title}</h2>
                {typeof isTheaterMode !== "undefined" && onTheaterModeToggle && (
                    <button onClick={onTheaterModeToggle} className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">
                        {isTheaterMode ? "Exit Theater" : "Theater Mode"}
                    </button>
                )}
            </div>
            <div className={`relative w-full  ${isTheaterMode ? "" : "rounded-lg overflow-hidden"}`}>
                <video
                    ref={videoRef}
                    controls
                    preload="metadata"
                    controlsList="nodownload"
                    className={`w-full h-[420px] ${isTheaterMode ? "h-[70vh]" : "h-auto "}`}
                />
            </div>
            {errorMessage && (
                <div className="mt-3 text-red-600 text-sm">{errorMessage}</div>
            )}
        </div>
    );
}


