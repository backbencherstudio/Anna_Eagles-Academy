"use client"
import React, { useEffect, useState, useCallback } from "react";
import * as Accordion from '@radix-ui/react-accordion';
import CustomVideoPlayer from "../../../components/Resuable/CustomVideoPlayer";

export default function CoursesModulesPage() {
  const [course, setCourse] = useState<any>(null);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<{ moduleIndex: number; videoIndex: number }>({ moduleIndex: 0, videoIndex: 0 });

  // Theater mode state
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Network and buffering states
  const [networkState, setNetworkState] = useState<number>(0);
  const [networkMessage, setNetworkMessage] = useState<string>('');

  // Accordion state - track which modules are open
  const [openModules, setOpenModules] = useState<string[]>([]);

  async function fetchCourseData() {
    const res = await fetch("/data/CourseData.json");
    return res.json();
  }

  useEffect(() => {
    fetchCourseData().then((data) => {
      setCourse(data.course);
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
    });
  }, []);

  const handleVideoSelect = useCallback((video: any, moduleTitle: string, moduleIndex: number, videoIndex: number) => {
    setCurrentVideo({
      ...video,
      module: moduleTitle,
    });
    setCurrentVideoIndex({ moduleIndex, videoIndex });

    // Automatically open the accordion for the selected video's module
    const moduleId = course.modules[moduleIndex].module_id;
    if (!openModules.includes(moduleId)) {
      setOpenModules(prev => [...prev, moduleId]);
    }
  }, [course, openModules]);

  const handleNextVideo = useCallback(() => {
    const { moduleIndex, videoIndex } = currentVideoIndex;

    // Check if there's a next video in the same module
    if (videoIndex < course.modules[moduleIndex].videos.length - 1) {
      const currentModule = course.modules[moduleIndex];
      const nextVideo = currentModule.videos[videoIndex + 1];
      setCurrentVideo({
        ...nextVideo,
        module: currentModule.module_title,
      });
      setCurrentVideoIndex({ moduleIndex, videoIndex: videoIndex + 1 });
    } else {
      // Check if there's a next module
      if (moduleIndex < course.modules.length - 1) {
        const nextModule = course.modules[moduleIndex + 1];
        const nextVideo = nextModule.videos[0];
        setCurrentVideo({
          ...nextVideo,
          module: nextModule.module_title,
        });
        setCurrentVideoIndex({ moduleIndex: moduleIndex + 1, videoIndex: 0 });

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
    return moduleIndex === course.modules.length - 1 && videoIndex === currentModule.videos.length - 1;
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
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg font-semibold text-gray-500">Loading...</span>
      </div>
    );
  }

  const modules = course.modules;

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

        {/* Course Description - Only show when not in theater mode */}
        {/* {!isTheaterMode && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">About this course</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {course.course_description}
            </p>
          </div>
        )} */}
      </div>

      {/* Sidebar: Modules and Videos - Show in theater mode at bottom */}
      <div className={`bg-white rounded-2xl shadow transition-all duration-500 ease-in-out ${isTheaterMode ? 'w-full p-6' : 'w-full lg:w-96 p-6'
        }`}>
        <div className="font-semibold text-lg mb-4">Modules</div>
        <Accordion.Root
          type="multiple"
          className="flex flex-col gap-3"
          value={openModules}
          onValueChange={setOpenModules}
        >
          {modules.map((mod: any, modIdx: number) => (
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
                  {mod.videos.map((vid: any, vidIdx: number) => {
                    const isActive =
                      currentVideo.video_id === vid.video_id &&
                      currentVideo.module === mod.module_title;
                    return (
                      <button
                        key={vid.video_id}
                        onClick={() => handleVideoSelect(vid, mod.module_title, modIdx, vidIdx)}
                        className={`flex items-center  cursor-pointer gap-3 px-3 py-2 rounded-lg text-left transition font-medium text-sm w-full ${isActive
                          ? "bg-[#F1C27D] text-white shadow"
                          : "hover:bg-[#F1C27D]/30 text-gray-700 bg-[#FEF9F2]"
                          }`}
                      >
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${isActive ? 'bg-white' : 'bg-gray-200'
                          }`}>
                          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                            <circle cx="14" cy="14" r="14" fill="#F1C27D" />
                            <path d="M11 10V18L18 14L11 10Z" fill="#fff" />
                          </svg>
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
