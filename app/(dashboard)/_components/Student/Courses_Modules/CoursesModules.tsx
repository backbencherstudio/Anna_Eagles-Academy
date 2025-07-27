"use client"
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from 'next/navigation';
import CustomVideoPlayer from "@/components/Resuable/CustomVideoPlayer";
import Modules_Sidebar from "./Modules_Sidebar";
import ModulesSkeletonLoading from "./ModulesSkeletonLoading";

export default function CoursesModules() {
  const [course, setCourse] = useState<any>(null);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<{ moduleIndex: number; videoIndex: number }>({ moduleIndex: 0, videoIndex: 0 });
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [networkState, setNetworkState] = useState<number>(0);
  const [networkMessage, setNetworkMessage] = useState<string>('');
  const [openModules, setOpenModules] = useState<string[]>([]);
  const searchParams = useSearchParams();

  async function fetchCourseData() {
    const res = await fetch("/data/CourseData.json");
    return res.json();
  }

  useEffect(() => {
    fetchCourseData().then((data) => {
      setCourse(data.course);

      // Check for URL parameters to set initial video
      const videoId = searchParams.get('video');
      const moduleIndex = searchParams.get('module');
      const videoIndex = searchParams.get('videoIndex');

      if (videoId && moduleIndex !== null && videoIndex !== null) {
        // Set video based on URL parameters
        const modIdx = parseInt(moduleIndex);
        const vidIdx = parseInt(videoIndex);

        if (data.course.modules[modIdx] && data.course.modules[modIdx].videos[vidIdx]) {
          const selectedVideo = data.course.modules[modIdx].videos[vidIdx];
          setCurrentVideo({
            ...selectedVideo,
            module: data.course.modules[modIdx].module_title,
          });
          setCurrentVideoIndex({ moduleIndex: modIdx, videoIndex: vidIdx });

          // Open the accordion for the selected video's module
          const moduleId = data.course.modules[modIdx].module_id;
          setOpenModules([moduleId]);
        } else {
          // Fallback to first video if parameters are invalid
          const firstVideo = data.course.modules[0]?.videos[0];
          setCurrentVideo({
            ...firstVideo,
            module: data.course.modules[0]?.module_title,
          });
          setCurrentVideoIndex({ moduleIndex: 0, videoIndex: 0 });

          if (data.course.modules[0]?.module_id) {
            setOpenModules([data.course.modules[0].module_id]);
          }
        }
      } else {
        // Set first video as default
        const firstVideo = data.course.modules[0]?.videos[0];
        setCurrentVideo({
          ...firstVideo,
          module: data.course.modules[0]?.module_title,
        });
        setCurrentVideoIndex({ moduleIndex: 0, videoIndex: 0 });

        // Open the accordion for the first module
        if (data.course.modules[0]?.module_id) {
          setOpenModules([data.course.modules[0].module_id]);
        }
      }
    });
  }, [searchParams]);



  const handleNextVideo = useCallback(() => {
    const { moduleIndex, videoIndex } = currentVideoIndex;

    // Check if there's a next video in the same module
    if (videoIndex < course.modules[moduleIndex].videos.length - 1) {
      const nextVideoIndex = videoIndex + 1;
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
  }, [currentVideoIndex, course, openModules]);

  const isLastVideo = useCallback(() => {
    const { moduleIndex, videoIndex } = currentVideoIndex;
    const currentModule = course.modules[moduleIndex];

    // Check if this is the last video
    const isLastInModule = videoIndex === currentModule.videos.length - 1;
    const isLastModule = moduleIndex === course.modules.length - 1;

    return isLastInModule && isLastModule;
  }, [currentVideoIndex, course]);

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
    console.log(`Network State: ${state} - ${message}`);
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


  if (!course || !currentVideo) {
    return <ModulesSkeletonLoading />;
  }

  return (
    <div className={`flex max-w-7xl mx-auto gap-6 transition-all duration-500 ease-in-out ${isTheaterMode ? 'flex-col max-w-full px-0' : 'flex-col lg:flex-row '
      }`}>
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
