"use client"
import React, { useCallback, useMemo, useEffect } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { FaCircleCheck } from "react-icons/fa6";
import { useVideoProgress } from "@/hooks/useVideoProgress";

interface Video {
  video_id: string;
  video_title: string;
  video_url: string;
  duration: number;
}

interface Module {
  module_id: string;
  module_title: string;
  videos: Video[];
}

interface Course {
  modules: Module[];
}

interface ModulesSidebarProps {
  course: Course;
  currentVideo: any;
  openModules: string[];
  setOpenModules: (modules: string[] | ((prev: string[]) => string[])) => void;
  setCurrentVideo: (video: any) => void;
  setCurrentVideoIndex: (index: { moduleIndex: number; videoIndex: number }) => void;
  isTheaterMode: boolean;
}

export default function Modules_Sidebar({
  course,
  currentVideo,
  openModules,
  setOpenModules,
  setCurrentVideo,
  setCurrentVideoIndex,
  isTheaterMode
}: ModulesSidebarProps) {
  const modules = course.modules;

  // Use the video progress hook
  const {
    getAllVideoProgress,
    isVideoCompleted,
  } = useVideoProgress();

  // Video progress state
  const [videoProgress, setVideoProgress] = React.useState<{ [key: string]: any }>({});

  // Load video progress for all videos
  const loadAllVideoProgress = useCallback(() => {
    if (!course) return;
    const progress = getAllVideoProgress(course);
    setVideoProgress(progress);
  }, [course, getAllVideoProgress]);

  // Throttled version of loadAllVideoProgress (max once every 2 seconds)
  const throttledLoadProgress = useMemo(() => {
    let lastCall = 0;
    return () => {
      const now = Date.now();
      if (now - lastCall >= 2000) {
        lastCall = now;
        loadAllVideoProgress();
      }
    };
  }, [loadAllVideoProgress]);

  // Get progress for a specific video
  const getVideoProgressInfo = useCallback((videoId: string) => {
    const progress = videoProgress[videoId];
    if (!progress) return null;

    const percentage = Math.round(progress.percentage);
    const watchedTime = formatTime(progress.currentTime);
    const totalTime = formatTime(progress.duration);

    return {
      percentage,
      watchedTime,
      totalTime,
      isCompleted: percentage >= 95
    };
  }, [videoProgress]);

  // Check if a video is unlocked (previous video is completed)
  const isVideoUnlocked = useCallback((moduleIndex: number, videoIndex: number) => {
    // First video is always unlocked
    if (moduleIndex === 0 && videoIndex === 0) return true;

    // Check if previous video in same module is completed
    if (videoIndex > 0) {
      const previousVideo = course.modules[moduleIndex].videos[videoIndex - 1];
      return isVideoCompleted(previousVideo.video_id);
    }

    // Check if last video of previous module is completed
    if (moduleIndex > 0) {
      const previousModule = course.modules[moduleIndex - 1];
      const lastVideoOfPreviousModule = previousModule.videos[previousModule.videos.length - 1];
      return isVideoCompleted(lastVideoOfPreviousModule.video_id);
    }

    return false;
  }, [course, isVideoCompleted]);

  // Get unlock status for display
  const getUnlockStatus = useCallback((moduleIndex: number, videoIndex: number) => {
    const isUnlocked = isVideoUnlocked(moduleIndex, videoIndex);
    const progressInfo = getVideoProgressInfo(course.modules[moduleIndex].videos[videoIndex].video_id);

    if (isUnlocked) {
      return {
        isUnlocked: true,
        isCompleted: progressInfo?.isCompleted || false,
        message: progressInfo?.isCompleted ? "Completed" : "Available"
      };
    } else {
      // Find which video needs to be completed
      if (videoIndex > 0) {
        const previousVideo = course.modules[moduleIndex].videos[videoIndex - 1];
        return {
          isUnlocked: false,
          message: `Complete "${previousVideo.video_title}" first`
        };
      } else if (moduleIndex > 0) {
        const previousModule = course.modules[moduleIndex - 1];
        const lastVideo = previousModule.videos[previousModule.videos.length - 1];
        return {
          isUnlocked: false,
          message: `Complete "${lastVideo.video_title}" first`
        };
      }
      return {
        isUnlocked: false,
        message: "Locked"
      };
    }
  }, [course, isVideoUnlocked, getVideoProgressInfo]);

  // Handle video selection
  const handleVideoSelect = useCallback((video: any, moduleTitle: string, moduleIndex: number, videoIndex: number) => {
    setCurrentVideo({
      ...video,
      module: moduleTitle,
    });
    setCurrentVideoIndex({ moduleIndex, videoIndex });

    // Automatically open the accordion for the selected video's module
    const moduleId = course.modules[moduleIndex].module_id;
    if (!openModules.includes(moduleId)) {
      setOpenModules((prev: string[]) => [...prev, moduleId]);
    }
  }, [course, openModules, setCurrentVideo, setCurrentVideoIndex, setOpenModules]);

  // Load progress when course data is available
  useEffect(() => {
    if (course) {
      loadAllVideoProgress();
    }
  }, [course, loadAllVideoProgress]);

  // Refresh progress periodically using throttled function
  useEffect(() => {
    const interval = setInterval(() => {
      throttledLoadProgress();
    }, 2000);

    return () => clearInterval(interval);
  }, [throttledLoadProgress]);

  // Format time utility function
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className={`bg-white overflow-y-auto max-h-[80vh] rounded-2xl shadow transition-all duration-500 ease-in-out ${isTheaterMode ? 'w-full p-6' : 'w-full lg:w-96 p-6'}`}>
      <div className="font-semibold text-lg mb-4">Modules</div>
      <Accordion.Root
        type="multiple"
        className="flex flex-col gap-3"
        value={openModules}
        onValueChange={setOpenModules}
      >
        {modules.map((mod: Module, modIdx: number) => (
          <Accordion.Item key={mod.module_id} value={mod.module_id} className="bg-[#FAFAFA] rounded-xl shadow-sm">
            <Accordion.Header>
              <Accordion.Trigger className="w-full flex items-center cursor-pointer justify-between px-4 py-3 font-medium text-base rounded-xl focus:outline-none group">
                <div>
                  {mod.module_title}
                  <span className="ml-2 text-xs text-gray-400">
                    ({mod.videos.length} {mod.videos.length > 1 ? "Courses" : "Course"})
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 transition-transform group-data-[state=open]:rotate-180"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-2 pb-3 pt-1">
              <div className="flex flex-col gap-2">
                {mod.videos.map((vid: Video, vidIdx: number) => {
                  const isActive =
                    currentVideo.video_id === vid.video_id &&
                    currentVideo.module === mod.module_title;
                  const progressInfo = getVideoProgressInfo(vid.video_id);
                  const unlockStatus = getUnlockStatus(modIdx, vidIdx);
                  return (
                    <button
                      key={vid.video_id}
                      onClick={() => {
                        if (unlockStatus.isUnlocked) {
                          handleVideoSelect(vid, mod.module_title, modIdx, vidIdx);
                        }
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition font-medium text-sm w-full relative ${!unlockStatus.isUnlocked
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                        : isActive
                          ? "bg-[#F1C27D] text-white shadow cursor-pointer"
                          : "hover:bg-[#F1C27D]/30 text-gray-700 bg-[#FEF9F2] cursor-pointer"
                        }`}
                      disabled={!unlockStatus.isUnlocked}
                    >
                      {/* Progress indicator */}
                      {progressInfo && (
                        <div className="absolute bottom-0 left-0 h-1 bg-gray-300 rounded-br-lg rounded-bl-lg overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${progressInfo.isCompleted ? 'bg-green-500' : 'bg-[#F1C27D]'}`}
                            style={{ width: `${progressInfo.percentage}%` }}
                          />
                        </div>
                      )}

                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${!unlockStatus.isUnlocked
                        ? 'bg-gray-300'
                        : isActive
                          ? 'bg-white'
                          : 'bg-gray-200'
                        }`}>
                        {!unlockStatus.isUnlocked ? (
                          // Lock icon
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <circle cx="12" cy="16" r="1" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        ) : progressInfo && progressInfo.isCompleted ? (
                          // Checkmark for completed
                          <FaCircleCheck className="text-green-500 text-xl" />
                        ) : (
                          // Play icon for available
                          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                            <circle cx="14" cy="14" r="14" fill="#F1C27D" />
                            <path d="M11 10V18L18 14L11 10Z" fill="#fff" />
                          </svg>
                        )}
                      </span>

                      <div className="flex-1 text-left">
                        <div className="font-medium">{vid.video_title}</div>
                        {!unlockStatus.isUnlocked ? (
                          <div className="text-xs text-gray-400 mt-1">
                            {unlockStatus.message}
                          </div>
                        ) : progressInfo && !progressInfo.isCompleted && (
                          <div className="text-xs text-gray-500 mt-1">
                            ({progressInfo.percentage}%)
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        {progressInfo && (
                          <div className="text-xs text-gray-500 mt-1">
                            {progressInfo.totalTime} min
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
