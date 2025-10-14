"use client"
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import CustomVideoPlayer from "@/components/Resuable/CustomVideoPlayer";
import Modules_Sidebar from "./Modules_Sidebar";
import ModulesSkeletonLoading from "./ModulesSkeletonLoading";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { useGetSingleEnrolledSeriesQuery } from "@/rtk/api/users/myCoursesApis";

interface CoursesModulesProps {
  seriesId: string;
}

export default function CoursesModules({ seriesId }: CoursesModulesProps) {
  const [course, setCourse] = useState<any>(null);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<{ moduleIndex: number; videoIndex: number }>({ moduleIndex: 0, videoIndex: 0 });
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [networkState, setNetworkState] = useState<number>(0);
  const [networkMessage, setNetworkMessage] = useState<string>('');
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [lockNotification, setLockNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const searchParams = useSearchParams();

  // Use the video progress hook
  const { isVideoCompleted } = useVideoProgress();

  // Fetch single enrolled series from API
  const { data, isLoading, isError } = useGetSingleEnrolledSeriesQuery(seriesId, { skip: !seriesId });

  // Helper: parse durations like "16m 30s" to seconds
  const parseDurationToSeconds = useCallback((duration: string | null | undefined) => {
    if (!duration) return 0;
    try {
      const minMatch = duration.match(/(\d+)\s*m/);
      const secMatch = duration.match(/(\d+)\s*s/);
      const hourMatch = duration.match(/(\d+)\s*h/);
      const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
      const minutes = minMatch ? parseInt(minMatch[1]) : 0;
      const seconds = secMatch ? parseInt(secMatch[1]) : 0;
      return hours * 3600 + minutes * 60 + seconds;
    } catch {
      return 0;
    }
  }, []);

  // Map API response to local course/modules/videos structure
  const mappedCourse = useMemo(() => {
    const series = data?.data;
    if (!series) return null;

    const modules = Array.from(series.courses || [])
      .slice()
      .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
      .map((courseItem: any) => {
        const baseVideos = Array.from(courseItem.lesson_files || [])
          .slice()
          .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
          .map((lf: any) => ({
            video_id: lf.id,
            video_title: lf.title,
            video_url: lf.url || "",
            duration: parseDurationToSeconds(lf.video_length),
            // keep original length string for player overlay
            video_duration: lf.video_length || ""
          }));

        const videos: any[] = [];

        // Intro video first if present
        if (courseItem.intro_video_url) {
          videos.push({
            video_id: `${courseItem.id}-intro`,
            video_title: `${courseItem.title} • Intro`,
            video_url: courseItem.intro_video_url,
            duration: parseDurationToSeconds(courseItem.video_length),
            video_duration: courseItem.video_length || ""
          });
        }

        // Then all lesson files
        videos.push(...baseVideos);

        // End video last if present
        if (courseItem.end_video_url) {
          videos.push({
            video_id: `${courseItem.id}-end`,
            video_title: `${courseItem.title} • End`,
            video_url: courseItem.end_video_url,
            duration: parseDurationToSeconds(courseItem.video_length),
            video_duration: courseItem.video_length || ""
          });
        }
        return {
          module_id: courseItem.id,
          module_title: courseItem.title,
          videos
        };
      });

    return { modules };
  }, [data, parseDurationToSeconds]);

  useEffect(() => {
    if (!mappedCourse) return;
    setCourse(mappedCourse);

    // Check for URL parameters to set initial video
    const videoId = searchParams.get('video');
    const moduleIndex = searchParams.get('module');
    const videoIndex = searchParams.get('videoIndex');

    if (videoId && moduleIndex !== null && videoIndex !== null) {
      const modIdx = parseInt(moduleIndex);
      const vidIdx = parseInt(videoIndex);

      if (mappedCourse.modules[modIdx] && mappedCourse.modules[modIdx].videos[vidIdx]) {
        const selectedVideo = mappedCourse.modules[modIdx].videos[vidIdx];
        setCurrentVideo({
          ...selectedVideo,
          module: mappedCourse.modules[modIdx].module_title,
        });
        setCurrentVideoIndex({ moduleIndex: modIdx, videoIndex: vidIdx });

        const moduleId = mappedCourse.modules[modIdx].module_id;
        setOpenModules([moduleId]);
      } else {
        const firstVideo = mappedCourse.modules[0]?.videos[0];
        if (firstVideo) {
          setCurrentVideo({
            ...firstVideo,
            module: mappedCourse.modules[0]?.module_title,
          });
          setCurrentVideoIndex({ moduleIndex: 0, videoIndex: 0 });
        }
        if (mappedCourse.modules[0]?.module_id) {
          setOpenModules([mappedCourse.modules[0].module_id]);
        }
      }
    } else {
      const firstVideo = mappedCourse.modules[0]?.videos[0];
      if (firstVideo) {
        setCurrentVideo({
          ...firstVideo,
          module: mappedCourse.modules[0]?.module_title,
        });
        setCurrentVideoIndex({ moduleIndex: 0, videoIndex: 0 });
      }
      if (mappedCourse.modules[0]?.module_id) {
        setOpenModules([mappedCourse.modules[0].module_id]);
      }
    }
  }, [mappedCourse, searchParams]);

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

  const handleNextVideo = useCallback(() => {
    const { moduleIndex, videoIndex } = currentVideoIndex;

    // Check if there's a next video in the same module
    if (videoIndex < course.modules[moduleIndex].videos.length - 1) {
      const nextVideoIndex = videoIndex + 1;

      // Check if the next video is unlocked
      if (!isVideoUnlocked(moduleIndex, nextVideoIndex)) {
        // Show notification that video is locked
        setLockNotification({
          show: true,
          message: "Please complete the current video first to unlock the next video."
        });
        // Hide notification after 3 seconds
        setTimeout(() => setLockNotification({ show: false, message: '' }), 3000);
        return;
      }

      const currentModule = course.modules[moduleIndex];
      const nextVideo = currentModule.videos[nextVideoIndex];
      setCurrentVideo({
        ...nextVideo,
        module: currentModule.module_title,
      });
      setCurrentVideoIndex({ moduleIndex, videoIndex: nextVideoIndex });
    } else {
      // Check if there's a next module
      if (moduleIndex < course.modules.length - 1) {
        const nextModuleIndex = moduleIndex + 1;

        // Check if the first video of the next module is unlocked
        if (!isVideoUnlocked(nextModuleIndex, 0)) {
          // Show notification that video is locked
          setLockNotification({
            show: true,
            message: "Please complete all videos in the current module first to unlock the next module."
          });
          // Hide notification after 3 seconds
          setTimeout(() => setLockNotification({ show: false, message: '' }), 3000);
          return;
        }

        const nextModule = course.modules[nextModuleIndex];
        const nextVideo = nextModule.videos[0];
        setCurrentVideo({
          ...nextVideo,
          module: nextModule.module_title,
        });
        setCurrentVideoIndex({ moduleIndex: nextModuleIndex, videoIndex: 0 });

        // Automatically open the accordion for the new module
        const moduleId = nextModule.module_id;
        if (!openModules.includes(moduleId)) {
          setOpenModules(prev => [...prev, moduleId]);
        }
      }
    }
  }, [currentVideoIndex, course, openModules, isVideoUnlocked]);

  const isLastVideo = useCallback(() => {
    const { moduleIndex, videoIndex } = currentVideoIndex;
    const currentModule = course.modules[moduleIndex];

    // Check if this is the last video
    const isLastInModule = videoIndex === currentModule.videos.length - 1;
    const isLastModule = moduleIndex === course.modules.length - 1;

    // Also check if next video is locked (if not the last video)
    if (!isLastInModule || !isLastModule) {
      const nextVideoIndex = isLastInModule ? 0 : videoIndex + 1;
      const nextModuleIndex = isLastInModule ? moduleIndex + 1 : moduleIndex;

      if (!isVideoUnlocked(nextModuleIndex, nextVideoIndex)) {
        return true; // Treat as last video if next is locked
      }
    }

    return isLastInModule && isLastModule;
  }, [currentVideoIndex, course, isVideoUnlocked]);

  const isFirstVideo = useCallback(() => {
    const { moduleIndex, videoIndex } = currentVideoIndex;
    return moduleIndex === 0 && videoIndex === 0;
  }, [currentVideoIndex]);

  const handlePreviousVideo = useCallback(() => {
    const { moduleIndex, videoIndex } = currentVideoIndex;

    // Check if there's a previous video in the same module
    if (videoIndex > 0) {
      const currentModule = course.modules[moduleIndex];
      const previousVideo = currentModule.videos[videoIndex - 1];
      setCurrentVideo({
        ...previousVideo,
        module: currentModule.module_title,
      });
      setCurrentVideoIndex({ moduleIndex, videoIndex: videoIndex - 1 });
    } else {
      // Check if there's a previous module
      if (moduleIndex > 0) {
        const previousModule = course.modules[moduleIndex - 1];
        const previousVideo = previousModule.videos[previousModule.videos.length - 1];
        setCurrentVideo({
          ...previousVideo,
          module: previousModule.module_title,
        });
        setCurrentVideoIndex({ moduleIndex: moduleIndex - 1, videoIndex: previousModule.videos.length - 1 });

        // Automatically open the accordion for the new module
        const moduleId = previousModule.module_id;
        if (!openModules.includes(moduleId)) {
          setOpenModules(prev => [...prev, moduleId]);
        }
      }
    }
  }, [currentVideoIndex, course, openModules]);

  const handleVideoEnd = useCallback(() => {
    // Auto-play next video when current video ends
    if (!isLastVideo()) {
      handleNextVideo();
    }
  }, [isLastVideo, handleNextVideo]);

  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode(prev => !prev);
  }, []);

  // Handle network state changes
  const handleNetworkStateChange = useCallback((state: number, message: string) => {
    setNetworkState(state);
    setNetworkMessage(message);

    // Log network state for debugging
    // console.log(`Network State: ${state} - ${message}`);
  }, []);

  // Handle escape key to exit theater mode
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTheaterMode) {
        setIsTheaterMode(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isTheaterMode]);


  if (isLoading || !course || !currentVideo) {
    return <ModulesSkeletonLoading />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">Failed to load series.</div>
      </div>
    );
  }

  return (
    <div className={`flex max-w-7xl mx-auto gap-6 transition-all duration-500 ease-in-out ${isTheaterMode ? 'flex-col max-w-full px-0' : 'flex-col xl:flex-row '
      }`}>
      {/* Lock Notification */}
      {lockNotification.show && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm font-medium">{lockNotification.message}</span>
          </div>
        </div>
      )}
      {/* Video Player Section */}
      <div className={`bg-white h-fit rounded-2xl shadow transition-all duration-500 ease-in-out ${isTheaterMode ? 'w-full p-0' : 'flex-1 p-2 lg:p-6'
        }`}>
        {!isTheaterMode && (
          <div >
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">
              {currentVideo.video_title}
            </h1>

            {/* Network Status Indicator */}
            {networkState > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${networkState === 1 ? 'bg-[#F1C27D]' :
                  networkState === 2 ? 'bg-blue-500' :
                    networkState === 3 ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                <span className="text-xs text-gray-500">
                  {networkMessage}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Video Player */}
        <CustomVideoPlayer
          videoData={currentVideo}
          onVideoEnd={handleVideoEnd}
          onPreviousTrack={handlePreviousVideo}
          onNextTrack={handleNextVideo}
          isPreviousDisabled={isFirstVideo()}
          isNextDisabled={isLastVideo()}
          className={isTheaterMode ? "" : "mb-4"}
          isTheaterMode={isTheaterMode}
          onTheaterModeToggle={toggleTheaterMode}
          showVideoInfo={true}
          preload="metadata"
          showBuffering={true}
          autoPlay={true}
          showVolumeControls={true}
          showSkipControls={false}
          allowSeeking={false}
          onNetworkStateChange={handleNetworkStateChange}
        />

        {/* Video Navigation - Only show when not in theater mode */}
        {!isTheaterMode && (
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 justify-between items-center">
            <p className="text-sm text-gray-600">
              {currentVideo.module} • Course {currentVideo.video_id}
            </p>
            <div className="flex gap-2 items-center justify-center">
              <button
                onClick={handlePreviousVideo}
                disabled={isFirstVideo()}
                className={`px-5 py-1.5 rounded cursor-pointer font-medium transition-colors ${isFirstVideo()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-transparent border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors'
                  }`}
              >
                {isFirstVideo() ? 'Start' : 'Previous'}
              </button>
              <button
                onClick={handleNextVideo}
                disabled={isLastVideo()}
                className={`px-5 py-1.5 cursor-pointer rounded font-medium transition-colors ${isLastVideo()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white'
                  }`}
                title={isLastVideo() ? 'This is the last video' : 'Go to next video'}
              >
                {isLastVideo() ? 'End' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar: Modules and Videos - Show in theater mode at bottom */}
      <Modules_Sidebar
        course={course}
        currentVideo={currentVideo}
        openModules={openModules}
        setOpenModules={setOpenModules}
        setCurrentVideo={setCurrentVideo}
        setCurrentVideoIndex={setCurrentVideoIndex}
        isTheaterMode={isTheaterMode}
      />
    </div>
  );
}
