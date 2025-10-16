"use client"
import React, { useState, useCallback, useEffect } from "react";
import Modules_Sidebar from "./Modules_Sidebar";
import CustomVideoPlayer from "@/components/Resuable/CustomVideoPlayer";
import { useLazyGetSingleEnrolledCourseQuery } from "@/rtk/api/users/myCoursesApis";

interface CoursesModulesProps {
  seriesId: string;
}

export default function CoursesModules({ seriesId }: CoursesModulesProps) {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState({
    video_id: "placeholder",
    video_title: "",
    video_url: "",
    video_duration: "",
    module: ""
  });

  // Fetch course when a course is selected via intro/end click
  const [fetchCourse, { data: courseResponse }] = useLazyGetSingleEnrolledCourseQuery();

  // Handle sidebar selection: only accepts ids of format intro-<courseId> or end-<courseId>
  const handleLessonSelect = useCallback((lessonId: string) => {
    setSelectedItemId(lessonId);
    const [kind, courseId] = lessonId.split("-", 2);
    if (kind === "intro" || kind === "end") {
      setActiveCourseId(courseId);
      fetchCourse(courseId);
    }
  }, [fetchCourse]);

  // When course data arrives, set current video to intro or end url accordingly
  useEffect(() => {
    if (!courseResponse?.data || !selectedItemId) return;
    const course = courseResponse.data as any;
    const [kind] = selectedItemId.split("-", 2);
    const title = kind === "intro" ? "Introduction" : "Conclusion";
    const url = kind === "intro" ? course.intro_video_url : course.end_video_url;
    if (url) {
      setCurrentVideo({
        video_id: selectedItemId,
        video_title: title,
        video_url: encodeURI(url),
        video_duration: course.video_length || "",
        module: course.title,
      });
    }
  }, [courseResponse?.data, selectedItemId]);

  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode(prev => !prev);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTheaterMode) {
        setIsTheaterMode(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isTheaterMode]);

  return (
    <div className={`flex max-w-7xl mx-auto gap-6 transition-all duration-500 ease-in-out ${isTheaterMode ? 'flex-col max-w-full px-0' : 'flex-col xl:flex-row '}`}>
      {/* Video Player Section */}
      <div className={`bg-white h-fit rounded-2xl shadow transition-all duration-500 ease-in-out ${isTheaterMode ? 'w-full p-0' : 'flex-1 w-full min-w-0 p-2 lg:p-6'}`}>
        <CustomVideoPlayer
          videoData={currentVideo}
          className={isTheaterMode ? "" : "mb-4"}
          key={currentVideo.video_id}
          isTheaterMode={isTheaterMode}
          onTheaterModeToggle={toggleTheaterMode}
          showVideoInfo={true}
          preload="metadata"
          showBuffering={true}
          autoPlay={true}
          showVolumeControls={true}
          showSkipControls={false}
          allowSeeking={true}
        />
      </div>


      <Modules_Sidebar
        isTheaterMode={isTheaterMode}
        seriesId={seriesId}
        onLessonSelect={handleLessonSelect}
        selectedLessonId={selectedItemId}
      />
    </div>
  );
}