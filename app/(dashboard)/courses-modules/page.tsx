"use client"
import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import dynamic from "next/dynamic";
import Image from "next/image";
import * as Accordion from '@radix-ui/react-accordion';

// Helper to fetch local JSON (works in Next.js for public/data)
async function fetchCourseData() {
  const res = await fetch("/data/CourseData.json");
  return res.json();
}

export default function CoursesModulesPage() {
  const [course, setCourse] = useState<any>(null);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    fetchCourseData().then((data) => {
      setCourse(data.course);
      // Set first video as default
      const firstVideo = data.course.modules[0]?.videos[0];
      setCurrentVideo({
        ...firstVideo,
        module: data.course.modules[0]?.module_title,
      });
    });
  }, []);

  if (!course || !currentVideo) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg font-semibold text-gray-500">Loading...</span>
      </div>
    );
  }

  // Debug: Log current video info
  console.log('Current Video:', currentVideo);
  console.log('Current Video URL:', currentVideo.video_url);

  // Flatten all videos for sidebar selection
  const modules = course.modules;

  // Handlers
  const handleVideoSelect = (video: any, module: any) => {
    setCurrentVideo({ ...video, module: module.module_title });
    setPlayed(0);
    setLoaded(0);
    setPlaying(false); // Wait for user to click play
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto py-6">
      {/* Player and Info */}
      <div className="flex-1 bg-white rounded-2xl p-4 shadow min-w-0">
        <div className="rounded-2xl overflow-hidden relative aspect-video bg-black">
          {/* @ts-ignore */}
          <ReactPlayer
            ref={playerRef}
            url={currentVideo.video_url}
            width="100%"
            height="100%"
            playing={playing}
            controls
            volume={volume}
            muted={muted}
            loop={loop}
            playbackRate={playbackRate}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onProgress={(state: any) => {
              if (!seeking) {
                setPlayed(state.played);
                setLoaded(state.loaded);
              }
            }}
            config={{
              youtube: {},
            }}
          />
        </div>
        {/* Video Info and Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
          <div>
            <div className="font-semibold text-lg mb-1">{currentVideo.video_title}</div>
            <div className="text-gray-500 text-sm">
              {currentVideo.module} &nbsp;•&nbsp; {currentVideo.video_duration}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              className={`px-3 py-1 rounded ${loop ? "bg-yellow-200" : "bg-gray-100 hover:bg-gray-200"} text-sm font-medium`}
              onClick={() => setLoop((l) => !l)}
            >
              Loop
            </button>
            <label className="flex items-center gap-1 text-sm">
              Speed:
              <select
                className="rounded border px-1 py-0.5"
                value={playbackRate}
                onChange={e => setPlaybackRate(Number(e.target.value))}
              >
                {[0.5, 1, 1.25, 1.5, 2].map(rate => (
                  <option key={rate} value={rate}>{rate}x</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1 text-sm">
              Volume:
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
              />
            </label>
            <button
              className={`px-3 py-1 rounded ${muted ? "bg-yellow-200" : "bg-gray-100 hover:bg-gray-200"} text-sm font-medium`}
              onClick={() => setMuted((m) => !m)}
            >
              {muted ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>
        {/* Progress Info */}
        <div className="mt-2 text-xs text-gray-500">
          Played: {(played * 100).toFixed(1)}% &nbsp;|&nbsp; Loaded: {(loaded * 100).toFixed(1)}%
        </div>
      </div>
      {/* Sidebar: Modules and Videos */}
      <div className="w-full md:w-80 bg-white rounded-2xl p-4 shadow h-fit">
        <div className="font-semibold text-lg mb-4">Modules</div>
        <Accordion.Root type="multiple" className="flex flex-col gap-3">
          {modules.map((mod: any, modIdx: number) => (
            <Accordion.Item key={mod.module_id} value={mod.module_id} className="bg-[#FAFAFA] rounded-xl shadow-sm">
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 font-medium text-base rounded-xl focus:outline-none group">
                  <div>
                    {mod.module_title}
                    <span className="ml-2 text-xs text-gray-400">({mod.videos.length} {mod.videos.length > 1 ? "Courses" : "Course"})</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 transition-transform group-data-[state=open]:rotate-180" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-2 pb-3 pt-1">
                <div className="flex flex-col gap-2">
                  {mod.videos.map((vid: any, vidIdx: number) => {
                    const isActive =
                      currentVideo.video_id === vid.video_id &&
                      currentVideo.module === mod.module_title;
                    return (
                      <button
                        key={vid.video_id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition font-medium text-sm w-full ${
                          isActive
                            ? "bg-yellow-300/80 text-yellow-900 shadow"
                            : "hover:bg-yellow-100/60 text-gray-700"
                        }`}
                        onClick={() => handleVideoSelect(vid, mod)}
                      >
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${isActive ? 'bg-yellow-400' : 'bg-yellow-200'}`}>
                          <svg width="18" height="18" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#F1C27D" /><path d="M11 10V18L18 14L11 10Z" fill="#fff" /></svg>
                        </span>
                        <span className="flex-1 text-left">{vid.video_title}</span>
                        <span className="text-xs text-gray-500">{vid.video_duration}</span>
                      </button>
                    );
                  })}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
}
